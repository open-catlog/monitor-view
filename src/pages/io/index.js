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

      for (let i = 0; i < 2; i++) {
        let ioChart = echarts.init(document.getElementById(i === 0 ? 'io-read-chart': 'io-write-chart'));
        ioChart.setOption({
          title: {
            text: i === 0 ? 'IO读取' : 'IO写入',
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
            data: xAxisData
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
          series: Object.keys(seriesData).map(device => {
            return {
              name: '设备:' + device + (i === 0 ? ', 读取速度' : ', 写入速度'),
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
              data: seriesData[device].map(temp => {
                return i === 0 ? temp.read : temp.write;
              })
            };
          })
        });
      }
    }
  };

  componentWillMount() {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/iaas/getInfo',
      data: {
        type: 'io',
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
        <div id="io-read-chart"></div>
        <div id="io-write-chart"></div>
      </div>
    );
  }
}

let route = {
  path: 'io',
  component: PageContent
}

export default route;