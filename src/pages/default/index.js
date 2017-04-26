import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import echarts from 'echarts';

import { message, Select, Row, Col, DatePicker } from 'antd';
const Option = Select.Option;

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
        max: 3000,
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
            currentDate: moment().format('YYYYMMDD'),
            pvData: {},
            uvData: {},
            intervalIds: []
        };
    };

    renderPVChart = data => {
        option.series[0].data = [];
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
        option.series[1].data = [];
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

    requestData = (date) => {
        let _self = this;
        getRequest({
            context: _self,
            url: 'http://localhost:6789/saas/getPVByDate',
            data: {
                date: date
            },
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                if (responseResult.success) {
                    if (!_.isEmpty(responseResult.data)) {
                        _self.state.pvData = responseResult.data;
                        _self.setState(_self.state);
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
            url: 'http://localhost:6789/saas/getUVByDate',
            data: {
                date: date
            },
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                if (responseResult.success) {
                    if (!_.isEmpty(responseResult.data)) {
                        _self.state.uvData = responseResult.data;
                        _self.setState(_self.state);
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

    disabledDate = current => {
        return current.valueOf() > Date.now() || current.valueOf() < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    };

    onDateChange = (date, dateString) => {
        let tempState = Object.assign({}, this.state);
        tempState.currentDate = date.format('YYYYMMDD');
        this.setState(tempState);
        this.requestData(date.format('YYYYMMDD'));
    };

    componentWillMount() {
        this.requestData(this.state.defaultDate);
    };

    shouldComponentUpdate() {
        for (let i = 0; i < this.state.intervalIds.length; i++) {
            clearInterval(this.state.intervalIds[i]);
            this.state.intervalIds.shift();
        }
        let _self = this;
        this.state.intervalIds.push(setInterval(function () {
            _self.requestData(_self.state.currentDate);
        }, 60 * 15 * 1000));
        return true;
    };

    componentWillUnmount() {
        for (let i = 0; i < this.state.intervalIds.length; i++) {
            clearInterval(this.state.intervalIds[i]);
            this.state.intervalIds.shift();
        }
    };

    render() {
        return (
            <div id="map">
                <Row type='flex' justify='center'>
                    <Col span={22}>
                        <div>
                            <DatePicker
                                defaultValue={moment()}
                                format="YYYY-MM-DD"
                                disabledDate={this.disabledDate}
                                onChange={(date, dateString) => this.onDateChange(date, dateString)}
                            />
                        </div>
                        <Col span={24}><div id='map-chart' /></Col>
                    </Col>
                </Row>
            </div>
        );
    }
}

let route = {
    component: Default
};

export default route;