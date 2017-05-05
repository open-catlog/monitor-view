import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { Select, Row, Col, Switch, message, InputNumber, Button } from 'antd';
const Option = Select.Option;

import { getRequest } from '../../../utils/httpClient';
import { option, stackedSeries } from '../../../src/global/common/chartOption';

import './style';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      server: 'offline',
      databases: [],
      defaultDatabase: 'shop',
      currentDatabase: 'shop',
      defaultSeconds: 600,
      currentSeconds: 600
    };
  };

  renderChart = result => {
    option.series = [];
    let mysqlChart;
    let mysqlInfoOption = Object.assign({}, option);
    mysqlChart = echarts.init(document.getElementById('mysql-chart'));
    mysqlInfoOption.title.text = 'Database: ' + this.state.currentDatabase;
    mysqlInfoOption.xAxis.data = result.map(data => {
      let momentTime = moment(data.time);
      return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
    });
    mysqlInfoOption.legend = {
      data: ['Connections', 'Select', 'Insert', 'Update', 'Delete'],
      textStyle: {
        color: '#fff'
      }
    };

    for (let i = 0; i < 5; i++) {
      let mysqlInfoSeries = Object.assign({}, stackedSeries);
      switch (i) {
        case 0:
          mysqlInfoSeries.name = 'Connections';
          mysqlInfoSeries.data = result.map(data => {
            return data.connections;
          });
          break;
        case 1:
          mysqlInfoSeries.name = 'Select';
          mysqlInfoSeries.areaStyle = {
            normal: {
              color: '#87CEEB'
            }
          };
          mysqlInfoSeries.data = result.map(data => {
            return data.select;
          });
          break;
        case 2:
          mysqlInfoSeries.name = 'Insert';
          mysqlInfoSeries.data = result.map(data => {
            return data.insert;
          });
          break;
        case 3:
          mysqlInfoSeries.name = 'Update';
          mysqlInfoSeries.data = result.map(data => {
            return data.update;
          });
          break;
        case 4:
          mysqlInfoSeries.name = 'Delete';
          mysqlInfoSeries.data = result.map(data => {
            return data.delete;
          });
          break;
      }
      mysqlInfoOption.series.push(mysqlInfoSeries);
    }

    mysqlChart.setOption(mysqlInfoOption);
  };

  requestData = (database, server, seconds) => {
    let _self = this;
    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getMysqlInfoByServerAndDatabase',
      data: {
        database: database,
        seconds: seconds,
        server: server
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          if (responseResult.data.length) {
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
      url: 'http://localhost:6789/paas/getDatabases',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          _self.state.databases = responseResult.data;
          _self.setState(_self.state);
        } else {
          message.error(responseResult.message);
        }
      }
    });
    _self.requestData(_self.state.defaultDatabase, _self.state.server, _self.state.defaultSeconds);
  };

  selectChange = value => {
    this.state.currentDatabase = value;
    this.setState(this.state);
    this.requestData(value, this.state.server, this.state.currentSeconds);
  };

  onChange = (checked) => {
    if (checked) {
      this.state.server = 'online';
    } else {
      this.state.server = 'offline';
    }
    this.setState(this.state);
    this.requestData(this.state.currentDatabase, this.state.server, this.state.currentSeconds);
  };

  onTimeChange = value => {
    let tempState = Object.assign({}, this.state);
    tempState.currentSeconds = value;
    this.setState(tempState);
  };

  onSubmit = () => {
    this.requestData(this.state.currentDatabase, this.state.server, this.state.currentSeconds);
  };

  render() {
    return (
      <div>
        <Row type='flex' justify='center'>
          <Col span={22}>
            <div>
              <Select defaultValue={this.state.defaultDatabase}
                onChange={(value) => this.selectChange(value)}>
                {this.state.databases.length ? this.state.databases.map((database, index) => {
                  return <Option value={database} key={index}>{database}</Option>
                }) : null}
              </Select>
              <Button className="antd-default-btn" onClick={this.onSubmit}>提交</Button>
              <InputNumber 
                defaultValue={this.state.defaultSeconds}
                min={1}
                step={60}
                formatter={value => `${value}秒`}
                parser={value => value.replace('秒', '')}
                onChange={this.onTimeChange} />
              <Switch checkedChildren={'线上服务器'} unCheckedChildren={'线下服务器'} onChange={this.onChange} />
            </div>
            <Row><Col span={24}><div id='mysql-chart' /></Col></Row>
          </Col>
        </Row>
      </div>
    );
  }
}

let route = {
  path: 'mysql',
  component: PageContent
}

export default route;