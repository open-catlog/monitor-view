import _ from 'lodash';
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
      domains: [],
      tableData: [],
      tableVisible: true,
      chartVisible: false,
      defaultDomain: 'shop.showjoy.com',
      currentDomain: 'shop.showjoy.com',
      charts: {}
    };
  };

  renderTable = result => {
    let tempState = Object.assign({}, this.state);
    Object.keys(result).forEach((data, index) => {
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

  renderChart = data => {
    Object.keys(data).forEach((uri, index) => {
      option.series = [];
      let uriChart;
      let uriInfoOption = Object.assign({}, option);
      let uriInfoSeries;
      uriChart = echarts.init(document.getElementById('nginx-chart-' + index));
      uriInfoOption.title.text = 'URI: ' + uri;
      uriInfoOption.xAxis.data = data[uri].map(uriInfo => {
        let momentTime = moment(uriInfo.time);
        return (momentTime.month() + 1) + '.'  + momentTime.date() + ',' + momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
      });

      for (let i = 0; i < 3; i++) {
        uriInfoSeries = Object.assign({}, series);
        uriInfoSeries.name = i === 0 ? 'RequestCount' : i === 1 ? 'RequestTime' : 'AverageRequestTime';
        uriInfoSeries.data = data[uri].map(uriInfo => {
          return i === 0 ? uriInfo.requestCount : i === 1 ? uriInfo.requestTime : uriInfo.averageTime;
        });
        uriInfoOption.series.push(uriInfoSeries);
      }
      uriChart.setOption(uriInfoOption);
    });
  };

  requestData = value => {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/paas/getAllNginxInfoByDomain',
      data: {
        domain: value
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
      url: 'http://localhost:6789/paas/getNginxDomains',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          tempState.domains = responseResult.data;
          _self.setState(tempState);
        } else {
          message.error(responseResult.message);
        }
      }
    });
    _self.requestData(this.state.defaultDomain);
  };

  selectChange = value => {
    let tempState = Object.assign({}, this.state);
    tempState.currentDomain = value;
    tempState.tableData = [];
    tempState.tableVisible = true;
    tempState.chartVisible = false;
    this.setState(tempState);
    this.requestData(value);
  };

  searchUri = value => {
    let _self = this;
    if (!_self.state.currentDomain) {
      message.error('请选择域名后重新搜索~');
      return;
    }
    let tempState = Object.assign({}, this.state);
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
        url: 'http://localhost:6789/paas/getNginxInfoByDomainAndUri',
        data: {
          domain: _self.state.currentDomain,
          uri: value,
          hours: 24 * 7
        },
        response: (err, res) => {
          let responseResult = JSON.parse(res.text);
          if (responseResult.success) {
            if (_.isEmpty(responseResult.data)) {
              message.error('未找到匹配的 uri~');
            } else {
              tempState.charts = responseResult.data;
              _self.setState(tempState);
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
      key: 'uri',
      width: '500px'
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
              <Select defaultValue={this.state.defaultDomain}
                onSelect={(value) => this.selectChange(value)}>
                {this.state.domains.length ? this.state.domains.map((domain, index) => {
                  return <Option value={domain} key={index}>{domain}</Option>
                }) : null}
              </Select>
              <Search className="search-box" placeholder="请输入 uri 地址" onSearch={uri => this.searchUri(uri)} />
            </div>
            {this.state.chartVisible ?
              Object.keys(this.state.charts).map((chart, index) => {
                return (<Row key={index}><Col span={24}><div id={'nginx-chart-' + index} style={{ width: '100%', height: '100%' }} /></Col></Row>);
              }) : ''}
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