import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { message, Select, Card, Col, Row, InputNumber, Button } from 'antd';
const Option = Select.Option;

import { getRequest } from '../../../utils/httpClient';
import { option, series } from '../../../src/global/common/chartOption';

import './style';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      maxActiveSessions: null,
      maxThreads: null,
      startTime: '',
      uptime: '',
      sessions: [],
      defaultServer: '127.0.0.1',
      currentServer: '127.0.0.1',
      intervalIds: [],
      defaultSeconds: 600,
      currentSeconds: 600
    };
  };

  renderChart = (data) => {
    let tempState = Object.assign({}, this.state);
    //renderCard
    tempState.maxActiveSessions = data.maxActiveSessions;
    tempState.maxThreads = data.maxThreads;
    tempState.startTime = moment.unix(data.startTime / 1000).format('YYYY-MM-DD HH:mm:ss');
    tempState.uptime = data.upTime;
    tempState.sessions = [];
    data.sessionInfo.forEach(session => {
      if (tempState.sessions.indexOf(session.context) === -1) {
        tempState.sessions.push(session.context);
      }
    });
    this.setState(tempState);

    //renderThreadInfo
    option.series = [];
    let threadInfoChart;
    let threadInfoOption = Object.assign({}, option);
    let threadInfoSeries;
    threadInfoChart = echarts.init(document.getElementById('tomcat-thread-chart'));
    threadInfoOption.title.text = 'Thread Info';
    threadInfoOption.xAxis.data = data.threadInfo.map(data => {
      let momentTime = moment(data.time);
      return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
    });
    for (let i = 0; i < 2; i++) {
      threadInfoSeries = Object.assign({}, series);
      threadInfoSeries.name = i === 0 ? 'currentThreadCount' : 'currentThreadBusy';
      threadInfoSeries.data = data.threadInfo.map(data => {
        return i === 0 ? data.currentThreadCount : data.currentThreadsBusy;
      });
      threadInfoOption.series.push(threadInfoSeries);
    }
    threadInfoChart.setOption(threadInfoOption);

    //renderGCInfo
    option.series = [];
    let GCInfoChart;
    let GCInfoOption = Object.assign({}, option);
    let GCInfoSeries;
    GCInfoChart = echarts.init(document.getElementById('tomcat-gc-chart'));
    GCInfoOption.title.text = 'Garbage Collection Info';
    GCInfoOption.xAxis.data = data.GCInfo.map(data => {
      let momentTime = moment(data.time);
      return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
    });
    for (let i = 0; i < 2; i++) {
      GCInfoSeries = Object.assign({}, series);
      GCInfoSeries.name = i === 0 ? 'collectionCount' : 'collectionTime';
      GCInfoSeries.data = data.GCInfo.map(data => {
        return i === 0 ? data.collectionCount : data.collectionTime;
      });
      GCInfoOption.series.push(GCInfoSeries);
    }
    GCInfoChart.setOption(GCInfoOption);

    //renderSessionInfo
    this.state.sessions.forEach((session, index) => {
      option.series = [];
      let sessionInfoChart;
      let sessionInfoOption = Object.assign({}, option);
      let sessionInfoSeries;
      let tempSessions = [];
      data.sessionInfo.forEach(data => {
        if (data.context === session) {
          tempSessions.push(data);
        }
      });
      sessionInfoChart = echarts.init(document.getElementById('tomcat-session-' + index));
      sessionInfoOption.title.text = 'Session: ' + session;
      sessionInfoOption.xAxis.data = tempSessions.map(tempSession => {
        let momentTime = moment(tempSession.time);
        return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
      });
      for (let i = 0; i < 2; i++) {
        sessionInfoSeries = Object.assign({}, series);
        sessionInfoSeries.name = i === 0 ? 'activeSessions' : 'sessionCounter';
        sessionInfoSeries.data = tempSessions.map(tempSession => {
          return i === 0 ? tempSession.activeSessions : tempSession.sessionCounter;
        });
        sessionInfoOption.series.push(sessionInfoSeries);
      }
      sessionInfoChart.setOption(sessionInfoOption);
    });
  };

  requestData = (server, seconds) => {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getTomcatInfo',
      data: {
        seconds: seconds,
        server: server
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          if (responseResult.data.threadInfo.length && responseResult.data.GCInfo.length) {
            _self.renderChart(responseResult.data);
          } else {
            message.error('服务端返回的数据为空~');
          }
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  componentWillMount() {
    let _self = this;
    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getTomcatServers',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          _self.state.servers = responseResult.data;
          _self.setState(_self.state);
        } else {
          message.error(responseResult.message);
        }
      }
    });
    _self.requestData(this.state.defaultServer, this.state.defaultSeconds);
  };

  shouldComponentUpdate() {
    for (let i = 0; i < this.state.intervalIds.length; i++) {
        clearInterval(this.state.intervalIds[i]);
        this.state.intervalIds.shift();
    }
    let _self = this;
    this.state.intervalIds.push(setInterval(function () {
      _self.requestData(_self.state.currentServer, _self.state.currentSeconds);
    }, 45 * 1000));
    return true;
  };

  selectChange = value => {
    let tempState = Object.assign({}, this.state);
    tempState.currentServer = value;
    this.setState(tempState);
    this.requestData(value, _self.state.currentSeconds);
  };

  onChange = value => {
    let tempState = Object.assign({}, this.state);
    tempState.currentSeconds = value;
    this.setState(tempState);
  };

  onSubmit = () => {
    this.requestData(this.state.currentServer, this.state.currentSeconds);
  };

  componentWillUnmount() {
    for (let i = 0; i < this.state.intervalIds.length; i++) {
      clearInterval(this.state.intervalIds[i]);
      this.state.intervalIds.shift();
    }
  };

  render() {
    return (
      <div>
        <Row type='flex' justify='center'>
          <Col span={22}>
            <Select defaultValue={this.state.defaultServer}
              onChange={(value) => this.selectChange(value)}>
              {this.state.servers.length ? this.state.servers.map((server, index) => {
                return <Option value={server} key={index}>{server}</Option>
              }) : null}
            </Select>
            <Button className="antd-default-btn" onClick={this.onSubmit}>提交</Button>
            <InputNumber 
              defaultValue={this.state.defaultSeconds}
              min={1}
              step={60}
              formatter={value => `${value}秒`}
              parser={value => value.replace('秒', '')}
              onChange={this.onChange} />
            <div className='antd-card'>
              <Row>
                <Col span='6'>
                  <Card className="tomcat-card" title='startTime' bordered={false}>{this.state.startTime}</Card>
                </Col>
                <Col span='6'>
                  <Card className="tomcat-card" title='uptime' bordered={false}>{this.state.uptime}</Card>
                </Col>
                <Col span='6'>
                  <Card className="tomcat-card" title='maxThreads' bordered={false}>{this.state.maxThreads}</Card>
                </Col>
                <Col span='6'>
                  <Card className="tomcat-card" title='maxActiveSessions' bordered={false}>{this.state.maxActiveSessions}</Card>
                </Col>
              </Row>
            </div>
            <Row gutter={16}>
              <Col span={12}><div id='tomcat-thread-chart' /></Col>
              <Col span={12}><div id='tomcat-gc-chart' /></Col>
            </Row>
            {this.state.sessions.map((session, index) => {
              if (index % 2 === 0) {
                return (<Row gutter={16} key={index}>
                  {this.state.sessions.length - 1 === index ?
                    <Col span={12}><div id={'tomcat-session-' + index} style={{ width: '100%', height: '100%' }} /></Col> :
                    <div className='session-row'>
                      <Col span={12}><div id={'tomcat-session-' + index} style={{ width: '100%', height: '100%' }} /></Col>
                      <Col span={12}><div id={'tomcat-session-' + (index + 1)} style={{ width: '100%', height: '100%' }} /></Col>
                    </div>
                  }
                </Row>);
              }
            })}
          </Col>
        </Row>
      </div>
    );
  }
}

let route = {
  path: 'tomcat',
  component: PageContent
}

export default route;