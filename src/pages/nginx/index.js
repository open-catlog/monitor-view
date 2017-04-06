import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { Table, Select, message, Col, Row, Input } from 'antd';
const Option = Select.Option;
const Search = Input.Search;

import { getRequest } from '../../../utils/httpClient';
import { option, series } from '../../../src/global/common/chartOption';

import './style';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      tableData: [],
      tableVisible: true,
      chartVisible: false
    };
  };

  renderTable = result => {
    let tempState = Object.assign({}, this.state);
    Object.keys(result).forEach((data, index) => {
      console.log(data)
      tempState.tableData.push({
        key: index,
        uri: data,
        request_count: result[data].request_count,
        request_time: result[data].request_time,
        average_request_time: result[data].average_request_time
      })
    });
    this.setState(tempState);
  };

  renderChart = result => {
    option.series = [];
    let uriChart;
    let uriInfoOption = Object.assign({}, option);
    let uriInfoSeries;
    uriChart = echarts.init(document.getElementById('nginx-uri-chart'));
    uriInfoOption.title.text = 'URI Info';
    uriInfoOption.xAxis.data = result.map(data => {
      let momentTime = moment(data.time);
      return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
    });
    for (let i = 0; i < 3; i++) {
      uriInfoSeries = Object.assign({}, series);
      uriInfoSeries.name = i === 0 ? 'RequestCount' : i === 1 ? 'RequestTime' : 'AverageRequestTime';
      uriInfoSeries.data = result.map(data => {
        return i === 0 ? data.requestCount : i === 1 ? data.requestTime : data.averageTime;
      });
      uriInfoOption.series.push(uriInfoSeries);
    }
    uriChart.setOption(uriInfoOption);
  };

  requestData = value => {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getAllNginxInfo',
      data: {
        server: value
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          _self.renderTable(responseResult.data);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  componentWillMount() {
    let _self = this;
    let tempState = Object.assign({}, this.state);
    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getNginxServers',
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
    tempState.tableData = [];
    tempState.tableVisible = true;
    tempState.chartVisible = false;
    this.setState(tempState);
    this.requestData(value);
  };

  searchUri = value => {
    if (value === '') {
      message.error('请输入 uri 地址后重试~');
    } else {
      let _self = this;
      let tempState = Object.assign({}, this.state);
      tempState.tableVisible = false;
      tempState.chartVisible = true;
      this.setState(tempState);
      getRequest({
        context: _self,
        url: 'http://localhost:6789/paas/getNginxInfoByUri',
        data: {
          uri: value,
          hours: 1
        },
        response: (err, res) => {
          let responseResult = JSON.parse(res.text);
          if (responseResult.success) {
            if (responseResult.data.length === 0) {
              message.error('未找到匹配的 uri~')
            } else {
              _self.renderChart(responseResult.data);
            }
          } else {
            message.error(responseResult.message);
          }
        }
      });
    }
  };

  render() {

    const columns = [{
      title: 'URI',
      dataIndex: 'uri',
      key: 'uri'
    }, {
      title: 'Request Count',
      dataIndex: 'request_count',
      key: 'request_count',
      sorter: (a, b) => a.request_count - b.request_count
    }, {
      title: 'Request Time',
      dataIndex: 'request_time',
      key: 'request_time',
      sorter: (a, b) => a.request_time - b.request_time
    }, {
      title: 'Average Request Time',
      dataIndex: 'average_request_time',
      key: 'average_request_time',
      sorter: (a, b) => a.average_request_time - b.average_request_time
    }];

    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={22}>
            <div>
              <Select defaultValue="请选择服务器" style={{ width: 120 }}
                onSelect={(value) => this.selectChange(value)}>
                {this.state.servers.length ? this.state.servers.map((server, index) => {
                  return <Option value={server} key={index}>{server}</Option>
                }) : null}
              </Select>
              <Search placeholder="请输入 uri 地址" onSearch={uri => this.searchUri(uri)} />
            </div>
            {this.state.chartVisible ? <Row><Col span={24}><div id="nginx-uri-chart" /></Col></Row> : ''}
            {this.state.tableVisible ? <Table columns={columns} dataSource={this.state.tableData} /> : ''}
          </Col>
        </Row>
      </div>
    );
  }
}

let route = {
  path: 'nginx',
  component: PageContent
}

export default route;