import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { message } from 'antd';

import { getRequest } from '../../../utils/httpClient';

import './style';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
  };

  renderChart = result => {
    if (result) {
      let processChart = echarts.init(document.getElementById('process-chart'));
      processChart.setOption({
        title: {
          text: '进程数',
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
          data: result.data.map(data => {
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
          name: '线程数',
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
          data: result.data.map(data => {
            return data.processCount;
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
        type: 'process',
        seconds: 300,
        server: '192.168.0.127'
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          _self.renderChart(responseResult);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  render() {
    return (
      <div className="main-content">
        <div id="process-chart"></div>
      </div>
    );
  }
}

let route = {
  path: 'process',
  component: PageContent
}

export default route;