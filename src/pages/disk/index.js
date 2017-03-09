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
        if (!seriesData[data.mount]) {
          seriesData[data.mount] = [];
        }
        seriesData[data.mount].push(data.used);
      });
      //获取x轴取值
      let benchmark = result.data[0].mount;
      let xAxisData = [];
      result.data.forEach(data => {
        if (data.mount === benchmark) {
          let momentTime = moment(data.time);
          xAxisData.push(momentTime.hour() + ':' + momentTime.minute() + ':' + momentTime.seconds());
        }
      });

      let diskChart = echarts.init(document.getElementById('disk-chart'));
      diskChart.setOption({
        title: {
          text: '磁盘占用',
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
        series: Object.keys(seriesData).map(mount => {
          return {
            name: '挂载点:' + mount + ', 占用比例',
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
            data: seriesData[mount]
          };
        })
      });
    }
  };

  componentWillMount() {
    let _self = this;

    getRequest({
      context: _self,
      url: 'http://localhost:6789/iaas/getInfo',
      data: {
        type: 'disk',
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
        <div id="disk-chart"></div>
      </div>
    );
  }
}

let route = {
  path: 'disk',
  component: PageContent
}

export default route;