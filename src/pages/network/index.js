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

      for (let i = 0; i < 2; i++) {
        let networkChart = echarts.init(document.getElementById(i === 0 ? 'network-read-chart': 'network-send-chart'));
        networkChart.setOption({
          title: {
            text: i === 0 ? '网络读取' : '网络发送',
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
          series: Object.keys(seriesData).map(netCard => {
            return {
              name: '网卡:' + netCard + (i === 0 ? ', 读取速度' : ', 发送速度'),
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
              data: seriesData[netCard].map(temp => {
                return i === 0 ? temp.read : temp.send;
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
        type: 'network',
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
        <div id="network-read-chart"></div>
        <div id="network-send-chart"></div>
      </div>
    );
  }
}

let route = {
  path: 'network',
  component: PageContent
}

export default route;