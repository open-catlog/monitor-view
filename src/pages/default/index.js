import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import '../../global/common/china.js';
import { getRequest } from '../../../utils/httpClient';

import './style';

var option = {
    title: {
        text: 'PV/UV 分布图',
        left: 'center',
        textStyle: {
            color: '#D9D9D9'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['UV', 'PV'],
        textStyle: {
            color: '#D9D9D9'
        }
    },
    visualMap: {
        min: 0,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true
    },
    series: [
        {
            name: 'PV',
            type: 'map',
            mapType: 'china',
            roam: true,
            itemStyle: {
                normal: { label: { show: true } },
                emphasis: { label: { show: true } }
            },
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            data: []
        },
        {
            name: 'UV',
            type: 'map',
            mapType: 'china',
            roam: true,
            itemStyle: {
                normal: { label: { show: true } },
                emphasis: { label: { show: true } }
            },
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            data: []
        }
    ]
};

class Default extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultDate: moment().format('YYYYMMDD'),
            currentDate: '',
            defaultDomain: 'www.showjoy.com',
            currentDomain: 'www.showjoy.com',
            domains: []
        };
    };

    renderPVChart = data => {
        let chart = echarts.init(document.getElementById('map-chart'));
        Object.keys(data).forEach(prov => {
            let pvData = {
                name: prov,
                value: data[prov]
            };
            option.series[0].data.push(pvData);
        });
        chart.setOption(option);
    };

    renderUVChart = data => {
        let chart = echarts.init(document.getElementById('map-chart'));
        Object.keys(data).forEach(prov => {
            let uvData = {
                name: prov,
                value: data[prov]
            };
            option.series[1].data.push(uvData);
        });
        chart.setOption(option);
    };

    requestData = (domain, date) => {
        let _self = this;
        getRequest({
            context: _self,
            url: 'http://localhost:6789/saas/getPVByDomainAndDate',
            data: {
                domain: domain,
                date: date
            },
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                if (responseResult.success) {
                    if (!_.isEmpty(responseResult.data)) {
                        _self.renderPVChart(responseResult.data);
                    } else {
                        message.error('服务端返回的PV数据为空~');
                    }
                } else {
                    message.error(responseResult.message);
                }
            }
        });

        getRequest({
            context: _self,
            url: 'http://localhost:6789/saas/getUVByDomainAndDate',
            data: {
                domain: domain,
                date: date
            },
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                if (responseResult.success) {
                    if (!_.isEmpty(responseResult.data)) {
                        _self.renderUVChart(responseResult.data);
                    } else {
                        message.error('服务端返回的UV数据为空~');
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
            url: 'http://localhost:6789/saas/getDomains',
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                if (responseResult.success) {
                    _self.state.domains = responseResult.data;
                    _self.setState(_self.state);
                } else {
                    message.error(responseResult.message);
                }
            }
        });
        _self.requestData(this.state.defaultDomain, this.state.defaultDate);
    };

    render() {
        return (
            <div id="map-chart"></div>
        );
    }
}

let route = {
    component: Default
};

export default route;