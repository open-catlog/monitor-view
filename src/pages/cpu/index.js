import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { message } from 'antd';

import { getRequest } from '../../../utils/httpClient';

import './style';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: []
    };
  };

  renderChart = result => {
    if (result) {
      let tempState = Object.assign({}, this.state);
      tempState.chartData = result.data;
      var cpuChart = echarts.init(document.getElementById('cpu-chart'));
      cpuChart.setOption({
        title: {
          text: 'CPU利用率',
          textStyle: {
            color: '#F0FFF0'
          }
        },
        tooltip: {
          trigger: 'axis',
          showDelay: 20,
          hideDelay: 100,
          transitionDuration: 0.4
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#F0FFF0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#515151',
              width: 2.5
            }
          },
          data: tempState.chartData.map(data => {
            let momentTime = moment(data.time);
            return momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds();
          })
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#F0FFF0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#515151',
              width: 2.5
            }
          }
        },
        series: [{
          name: 'CPU',
          type: 'line',
          itemStyle: {
            normal: {
              width: 2,
              color: '#B8860B',
              shadowColor: 'rgba(0,0,0,0.5)',
              shadowBlur: 10,
              shadowOffsetX: 8,
              shadowOffsetY: 8
            }
          },
          data: tempState.chartData.map(data => {
            return data.utilization;
          })
        }],
      });
      this.setState(tempState);
    }
  };

  componentWillMount() {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/iaas/getInfo',
      data: {
        type: 'cpu',
        seconds: 60,
        server: 'localhost'
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          _self.renderChart(responseResult);
          //console.log(responseResult.data);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  render() {
    return (
      <div className="main-content">
        <div id="cpu-chart"></div>
      </div>
    );
  }
}

let route = {
  path: 'cpu',
  component: PageContent
}

export default route;