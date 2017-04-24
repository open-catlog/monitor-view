import React from 'react';

import { Form, Input, Icon, Button, message } from 'antd';
const FormItem = Form.Item;

import './style';
import { postRequest } from '../../../../utils/httpClient';

let uuid = 0;
class DynamicFieldSet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hardwareServers: [],
      tomcatServers: [],
      nginxDomains: [],
      databases: []
    };
  }

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    uuid++;
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  postData = (type, val) => {
    let _self = this;
    postRequest({
      context: _self,
      url: 'http://localhost:6789/config/setConfig',
      data: {
        type: type,
        data: val
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          message.info('设置成功，请刷新页面');
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  handleSubmit = (e) => {
    this.state.hardwareServers = [];
    let _self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        switch (this.props.field) {
          case 'hardware':
            Object.keys(values).forEach((key, index) => {
              if (index !== 0) {
                _self.state.hardwareServers.push(values[key]);
              }
            });
            _self.postData('hardware', _self.state.hardwareServers);
            break;
          case 'tomcat':
            Object.keys(values).forEach((key, index) => {
              if (index !== 0) {
                _self.state.tomcatServers.push(values[key]);
              }
            });
            _self.postData('tomcat', _self.state.tomcatServers);
            break;
          case 'nginx':
            Object.keys(values).forEach((key, index) => {
              if (index !== 0) {
                _self.state.nginxDomains.push(values[key]);
              }
            });
            _self.postData('nginx', _self.state.nginxDomains);
            break;
          case 'mysql':
            Object.keys(values).forEach((key, index) => {
              if (index !== 0) {
                _self.state.databases.push(values[key]);
              }
            });
            _self.postData('mysql', _self.state.databases);
            break;
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayoutWithOutLabel }
          required={false}
          key={k}
        >
          {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input or delete this field.",
            }],
          })(
            <Input className="setting-input" placeholder={this.props.type === 'server' ? '请输入服务器IP' : this.props.type === 'database' ? '请输入数据库' : '请输入域名'}
              style={{ width: '80%', marginRight: 8 }} />
            )}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={this.props.type === 'server' ? 'Server' : this.props.type === 'database' ? 'DB' : 'Domain'}>
          {getFieldDecorator(`names-0`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input in this field.",
            }],
          })(
            <Input className="setting-input" placeholder={this.props.type === 'server' ? '请输入服务器IP' : this.props.type === 'database' ? '请输入数据库' : '请输入域名'}
              style={{ width: '80%', marginRight: 8 }} />
            )}
        </FormItem>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button className="plus-button" type="primary" size="small" onClick={this.add}>
            <Icon type="plus" />{this.props.type === 'server' ? '添加／删除服务器' : this.props.type === 'database' ? '添加／删除数据库' : '添加／删除域名'}
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button className="setting-submit" type="primary" htmlType="submit" size="large">提交</Button>
        </FormItem>
      </Form>
    );
  }
}

export default DynamicFieldSet;