import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { message, Select, Row, Col } from 'antd';
const Option = Select.Option;

import { getRequest } from '../../../utils/httpClient';
import { option, series } from '../../../src/global/common/chartOption';

import './style';

const points = ['cpu', 'process', 'memory', 'io', 'network', 'disk'];

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      servers: []
    };
  };

  renderChart = (result, type) => {
    option.series = [];
    if (result.success && result.data.length) {
      let chart;
      let tempOption;
      let tempSeries;
      switch (type) {
        case 'cpu':
          tempOption = Object.assign({}, option);
          tempSeries = Object.assign({}, series);
          chart = echarts.init(document.getElementById('cpu-chart'));
          tempOption.title.text = 'CPU Utilization';
          tempOption.xAxis.data = result.data.map(data => {
            let momentTime = moment(data.time);
            return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
          });
          tempSeries.data = result.data.map(data => {
            return data.utilization;
          });
          tempSeries.name = "CPU";
          tempOption.series = tempSeries;
          chart.setOption(tempOption);
          break;
        case 'process':
          tempOption = Object.assign({}, option);
          tempSeries = Object.assign({}, series);
          chart = echarts.init(document.getElementById('process-chart'));
          tempOption.title.text = 'Process Count';
          tempOption.xAxis.data = result.data.map(data => {
            let momentTime = moment(data.time);
            return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
          });
          tempSeries.data = result.data.map(data => {
            return data.processCount;
          });
          tempSeries.name = "count";
          tempOption.series = tempSeries;
          chart.setOption(tempOption);
          break;
        case 'disk':
          tempOption = Object.assign({}, option);
          chart = echarts.init(document.getElementById('disk-chart'));
          let seriesData = {};
          result.data.forEach(data => {
            if (!seriesData[data.mount]) {
              seriesData[data.mount] = [];
            }
            seriesData[data.mount].push(data.used);
          });
          let benchmark = result.data[0].mount;
          let xAxisData = [];
          result.data.forEach(data => {
            if (data.mount === benchmark) {
              let momentTime = moment(data.time);
              xAxisData.push(momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds());
            }
          });
          tempOption.xAxis.data = xAxisData;
          tempOption.title.text = 'Disk Utilization';
          tempOption.series = Object.keys(seriesData).map(mount => {
            tempSeries = Object.assign({}, series);
            tempSeries.name = 'Mount Point:' + mount + ', Proportion';
            tempSeries.data = seriesData[mount];
            return tempSeries;
          });
          chart.setOption(tempOption);
          break;
        case 'memory':
          tempOption = Object.assign({}, option);
          chart = echarts.init(document.getElementById('memory-chart'));
          tempOption.title.text = 'Memory Utilization';
          tempOption.xAxis.data = result.data.map(data => {
            let momentTime = moment(data.time);
            return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
          });
          for (let i = 0; i < 2; i++) {
            tempSeries = Object.assign({}, series);
            tempSeries.name = i === 0 ? "Memory" : "Swap Space";
            tempSeries.data = result.data.map(data => {
              return i === 0 ? data.memory : data.swap;
            });
            tempOption.series.push(tempSeries);
          }
          chart.setOption(tempOption);
          break;
        case 'network':
          for (let i = 0; i < 2; i++) {
            chart = echarts.init(document.getElementById(i === 0 ? 'network-read-chart' : 'network-send-chart'));
            tempOption = Object.assign({}, option);
            tempOption.title.text = i === 0 ? 'Network-Read' : 'Network-Send';
            //获取y轴取值
            let seriesData = {};
            result.data.forEach(data => {
              if (!seriesData[data.netCard]) {
                seriesData[data.netCard] = [];
              }
              seriesData[data.netCard].push({ read: data.read, send: data.send });
            });
            //获取x轴取值
            let benchmark = result.data[0].netCard;
            let xAxisData = [];
            result.data.forEach(data => {
              if (data.netCard === benchmark) {
                let momentTime = moment(data.time);
                xAxisData.push(momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds());
              }
            });
            tempOption.xAxis.data = xAxisData;
            tempOption.series = Object.keys(seriesData).map(netCard => {
              tempSeries = Object.assign({}, series);
              tempSeries.name = 'NetCard:' + netCard + (i === 0 ? ', Read-Speed' : ', Send-Speed');
              tempSeries.data = seriesData[netCard].map(temp => {
                return i === 0 ? temp.read : temp.send;
              });
              return tempSeries;
            });
            chart.setOption(tempOption);
          }
          break;
        case 'io':
          for (let i = 0; i < 2; i++) {
            chart = echarts.init(document.getElementById(i === 0 ? 'io-read-chart' : 'io-write-chart'));
            tempOption = Object.assign({}, option);
            tempOption.title.text = i === 0 ? 'IO-Read' : 'IO-Send';
            //获取y轴取值
            let seriesData = {};
            result.data.forEach(data => {
              if (!seriesData[data.device]) {
                seriesData[data.device] = [];
              }
              seriesData[data.device].push({ read: data.read, write: data.write });
            });
            //获取x轴取值
            let benchmark = result.data[0].device;
            let xAxisData = [];
            result.data.forEach(data => {
              if (data.device === benchmark) {
                let momentTime = moment(data.time);
                xAxisData.push(momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds());
              }
            });
            tempOption.xAxis.data = xAxisData;
            tempOption.series = Object.keys(seriesData).map(device => {
              tempSeries = Object.assign({}, series);
              tempSeries.name = 'Device:' + device + (i === 0 ? ', Read-Speed' : ', Write-Speed');
              tempSeries.data = seriesData[device].map(temp => {
                return i === 0 ? temp.read : temp.write;
              });
              return tempSeries;
            });
            chart.setOption(tempOption);
          }
          break;
      }
    }
  };

  requestData = (value) => {
    let _self = this;

    points.forEach(point => {
      getRequest({
        context: _self,
        url: 'http://localhost:6789/iaas/getInfo',
        data: {
          type: point,
          seconds: 600,
          server: value
        },
        response: (err, res) => {
          let responseResult = JSON.parse(res.text);
          if (responseResult.success) {
            _self.renderChart(responseResult, point);
          } else {
            message.error(responseResult.message);
          }
        }
      });
    })
  };

  componentWillMount() {
    let _self = this;
    let tempState = Object.assign({}, this.state);
    getRequest({
      context: _self,
      url: 'http://localhost:6789/iaas/getServers',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          tempState.servers = responseResult.data;
          _self.setState(tempState);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  selectChange = value => {
    let tempState = Object.assign({}, this.state);
    tempState.server = value;
    this.setState(tempState);
    this.requestData(value);
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={22}>
            <Select defaultValue="请选择服务器" style={{ width: 120 }}
              onChange={(value) => this.selectChange(value)}>
              {this.state.servers.length ? this.state.servers.map((server, index) => {
                return <Option value={server} key={index}>{server}</Option>
              }) : null}
            </Select>
            <div>
              <Row gutter={16}>
                <Col span={12}><div id="cpu-chart" /></Col>
                <Col span={12}><div id="process-chart" /></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}><div id="memory-chart" /></Col>
                <Col span={12}><div id="disk-chart" /></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}><div id="network-read-chart" /></Col>
                <Col span={12}><div id="network-send-chart" /></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}><div id="io-read-chart" /></Col>
                <Col span={12}><div id="io-write-chart" /></Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

let route = {
  path: 'hardware',
  component: PageContent
}

export default route;