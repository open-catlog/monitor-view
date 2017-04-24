import React from 'react';

import { Row, Col, Form, Input, Button, Icon, Card, Table } from 'antd';
const FormItem = Form.Item;

import './style';
import { getRequest } from '../../../utils/httpClient';
import DynamicFieldSet from '../../global/components/DynamicFieldSet/index';
const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  };

  renderTable = result => {
    let tempState = Object.assign({}, this.state);
    Object.keys(result).forEach(function (key, index) {
      tempState.tableData.push({
        key: index,
        type: key,
        names: result[key].join('，')
      });
    });
    this.setState(tempState);
  };

  componentDidMount() {
    let _self = this;
    getRequest({
      context: _self,
      url: 'http://localhost:6789/config/getConfig',
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

  render() {

    const columns = [{
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '120px'
    }, {
      title: '配置项',
      dataIndex: 'names',
      key: 'names'
    }];

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <div className="setting-area">
          <Row className="setting-row" gutter={16}>
            <Col className="hardware-row" span={6}>
              <Card className="setting-title">
                <p style={{ "fontSize": "large" }}>硬件监控配置</p>
              </Card>
              <WrappedDynamicFieldSet type="server" field="hardware" />
            </Col>
            <Col className="nginx-row" span={6}>
              <Card className="setting-title">
                <p style={{ "fontSize": "large" }}>MySQL监控配置</p>
              </Card>
              <WrappedDynamicFieldSet type="database" field="mysql" />
            </Col>
            <Col className="tomcat-row" span={6}>
              <Card className="setting-title">
                <p style={{ "fontSize": "large" }}>Tomcat监控配置</p>
              </Card>
              <WrappedDynamicFieldSet type="server" field="tomcat" />
            </Col>
            <Col className="nginx-row" span={6}>
              <Card className="setting-title">
                <p style={{ "fontSize": "large" }}>Nginx监控配置</p>
              </Card>
              <WrappedDynamicFieldSet type="domain" field="nginx" />
            </Col>
          </Row>
        </div>
        <Table className="settings" columns={columns} dataSource={this.state.tableData} pagination={false} />
      </div>
    );
  }
}

let route = {
  path: 'config',
  component: PageContent
}

export default route;