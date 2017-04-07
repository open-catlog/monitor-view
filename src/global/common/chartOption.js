'use strict';

exports.option = {
  backgroundColor: 'rgba(0,0,0,.2)',
  title: {
    fontWeight: 'bolder',
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
        color: '#F0FFF0',
        fontWeight: 'bolder'
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(0,0,0,.2)'
      }
    },
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#F0FFF0'
      },
      fontWeight: 'bolder'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(0,0,0,.2)',
      }
    }
  },
  series: []
};

exports.series = {
  type: 'line',
  itemStyle: {
    normal: {
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      shadowOffsetX: 8,
      shadowOffsetY: 8
    }
  },
  data: []
};