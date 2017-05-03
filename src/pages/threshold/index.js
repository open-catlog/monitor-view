import React from 'react';

import { Tabs, Form, Input, Button, Icon, Modal, Transfer, Tag, message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import './style';
import { getRequest, postRequest } from '../../../utils/httpClient';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hardwareServers: [],
      tomcatServers: [],
      databases: [],
      selectedHardwareKeys: [],
      targetHardwareKeys: [],
      hardwareModalVisible: false,
      selectedTomcatKeys: [],
      targetTomcatKeys: [],
      tomcatModalVisible: false,
      selectedMySQLKeys: [],
      targetMySQLKeys: [],
      mysqlModalVisible: false,
      hardwareCpu: '0',
      hardwareThread: '0',
      hardwareMemory: '0',
      hardwareNetwork: '0',
      hardwareIo: '0',
      hardwareDisk: '0',
      tomcatThread: '0',
      tomcatSession: '0',
      mysqlConnections: '0',
      mysqlSelect: '0',
      mysqlUpdate: '0',
      mysqlDelete: '0',
      mysqlInsert: '0'
    };
  };

  showHardwareModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareModalVisible = true;
    this.setState(tempState);
  };

  hideHardwareModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareModalVisible = false;
    this.setState(tempState);
  };

  handleHardwareChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetHardwareKeys: nextTargetKeys });
  };

  handleHardwareSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedHardwareKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  showTomcatModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.tomcatModalVisible = true;
    this.setState(tempState);
  };

  hideTomcatModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.tomcatModalVisible = false;
    this.setState(tempState);
  };

  handleTomcatChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetTomcatKeys: nextTargetKeys });
  };

  handleTomcatSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedTomcatKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  showMySQLModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlModalVisible = true;
    this.setState(tempState);
  };

  hideMySQLModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlModalVisible = false;
    this.setState(tempState);
  };

  handleMySQLChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetMySQLKeys: nextTargetKeys });
  };

  handleMySQLSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedMySQLKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  onInputChange = (event) => {
    let tempState = Object.assign({}, this.state);
    switch (event.target.id) {
      case 'hardware-cpu':
        tempState.hardwareCpu = event.target.value;
        break;
      case 'hardware-thread':
        tempState.hardwareThread = event.target.value;
        break;
      case 'hardware-memory':
        tempState.hardwareMemory = event.target.value;
        break;
      case 'hardware-disk':
        tempState.hardwareDisk = event.target.value;
        break;
      case 'hardware-io':
        tempState.hardwareIo = event.target.value;
        break;
      case 'hardware-network':
        tempState.hardwareNetwork = event.target.value;
        break;
      case 'tomcat-thread':
        tempState.tomcatThread = event.target.value;
        break;
      case 'tomcat-session':
        tempState.tomcatSession = event.target.value;
        break;
      case 'mysql-connections':
        tempState.mysqlConnections = event.target.value;
        break;
      case 'mysql-select':
        tempState.mysqlSelect = event.target.value;
        break;
      case 'mysql-update':
        tempState.mysqlUpdate = event.target.value;
        break;
      case 'mysql-insert':
        tempState.mysqlInsert = event.target.value;
        break;
      case 'mysql-delete':
        tempState.mysqlDelete = event.target.value;
        break;
    }
    this.setState(tempState);
  };

  handleHardwareSubmit = () => {
    let cpu = this.state.hardwareCpu;
    let thread = this.state.hardwareThread;
    let disk = this.state.hardwareDisk;
    let io = this.state.hardwareIo;
    let memory = this.state.hardwareMemory;
    let network = this.state.hardwareNetwork;
    let threshold = {
      cpu: cpu,
      thread: thread,
      disk: disk,
      io: io,
      memory: memory,
      network: network
    };
    let hardwareServers = [];
    this.state.targetHardwareKeys.forEach(key => {
      hardwareServers.push(this.state.hardwareServers[key].title)
    });
    this.postData('hardware', hardwareServers, threshold);
  };

  handleTomcatSubmit = () => {
    let thread = this.state.tomcatThread;
    let session = this.state.tomcatSession;
    let threshold = {
      thread: thread,
      session: session
    };
    let tomcatServers = [];
    this.state.targetTomcatKeys.forEach(key => {
      tomcatServers.push(this.state.tomcatServers[key].title);
    });
    this.postData('tomcat', tomcatServers, threshold);
  };

  handleMySQLSubmit = () => {
    let connections = this.state.mysqlConnections;
    let select = this.state.mysqlSelect;
    let insert = this.state.mysqlInsert;
    let update = this.state.mysqlUpdate;
    let del = this.state.mysqlDelete;
    let threshold = {
      connections: connections,
      select: select,
      insert: insert,
      update: update,
      delete: del
    };
    let databases = [];
    this.state.targetMySQLKeys.forEach(key => {
      databases.push(this.state.databases[key].title);
    });
    this.postData('mysql', databases, threshold);
  };

  postData = (type, names, threshold) => {
    let _self = this;
    postRequest({
      context: _self,
      url: 'http://localhost:6789/config/setThreshold',
      data: {
        type: type,
        names: names,
        data: threshold
      },
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          message.info('设置成功');
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  componentWillMount() {
    let _self = this;
    let tempState = Object.assign({}, this.state);
    getRequest({
      context: _self,
      url: 'http://localhost:6789/config/getConfig',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.success) {
          for (let i = 0; i < responseResult.data.hardware.length; i++) {
            tempState.hardwareServers.push({
              key: i.toString(),
              title: responseResult.data.hardware[i]
            });
          }
          for (let i = 0; i < responseResult.data.mysql.length; i++) {
            tempState.databases.push({
              key: i.toString(),
              title: responseResult.data.mysql[i]
            });
          }
          for (let i = 0; i < responseResult.data.tomcat.length; i++) {
            tempState.tomcatServers.push({
              key: i.toString(),
              title: responseResult.data.tomcat[i]
            });
          }
          _self.setState(tempState);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  };

  render() {

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 5 }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 24,
        offset: 2
      },
    };

    const formItemLayoutWithTags = {
      wrapperCol: {
        offset: 2
      },
    };

    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="基础设施" key="1">
          <Form layout="inline" onSubmit={this.handleHardwareSubmit}>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="CPU利用率">
              <Input id="hardware-cpu" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="线程数">
              <Input id="hardware-thread" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="网络传输速率">
              <Input id="hardware-network" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="IO读写速率">
              <Input id="hardware-io" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="内存空闲比例">
              <Input id="hardware-memory" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="磁盘占用比例">
              <Input id="hardware-disk" onChange={this.onInputChange} />
            </FormItem>
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="plus-button" type="primary" size="small" onClick={this.showHardwareModal}>
                <Icon type="plus" />添加/删除服务器
              </Button>
            </FormItem>
            {this.state.targetHardwareKeys.length ?
              <FormItem {...formItemLayoutWithTags} className="antd-form-item">
                {this.state.targetHardwareKeys.map(index => {
                  return (<Tag key={index}>{this.state.hardwareServers[index].title}</Tag>);
                })}
              </FormItem> : ''}
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="setting-submit" type="primary" htmlType="submit" size="default">提交</Button>
            </FormItem>
          </Form>
          <Modal title="基础设施服务器列表"
            visible={this.state.hardwareModalVisible}
            onOk={() => this.hideHardwareModal()}
            onCancel={() => this.hideHardwareModal()} >
            <Transfer
              dataSource={this.state.hardwareServers}
              titles={['未选择', '已选择']}
              targetKeys={this.state.targetHardwareKeys}
              selectedKeys={this.state.selectedHardwareKeys}
              onChange={this.handleHardwareChange}
              onSelectChange={this.handleHardwareSelectChange}
              render={item => item.title}
            />
          </Modal>
        </TabPane>
        <TabPane tab="Tomcat" key="2">
          <Form layout="inline" onSubmit={this.handleTomcatSubmit}>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="繁忙线程数">
              <Input id="=tomcat-thread" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="活跃Session">
              <Input id="tomcat-session" onChange={this.onInputChange} />
            </FormItem>
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="plus-button" type="primary" size="small" onClick={this.showTomcatModal}>
                <Icon type="plus" />添加/删除服务器
              </Button>
            </FormItem>
            {this.state.targetTomcatKeys.length ?
              <FormItem {...formItemLayoutWithTags} className="antd-form-item">
                {this.state.targetTomcatKeys.map(index => {
                  return (<Tag key={index}>{this.state.tomcatServers[index].title}</Tag>);
                })}
              </FormItem> : ''}
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="setting-submit" type="primary" htmlType="submit" size="default">提交</Button>
            </FormItem>
          </Form>
          <Modal title="Tomcat服务器列表"
            visible={this.state.tomcatModalVisible}
            onOk={() => this.hideTomcatModal()}
            onCancel={() => this.hideTomcatModal()} >
            <Transfer
              dataSource={this.state.tomcatServers}
              titles={['未选择', '已选择']}
              targetKeys={this.state.targetTomcatKeys}
              selectedKeys={this.state.selectedTomcatKeys}
              onChange={this.handleTomcatChange}
              onSelectChange={this.handleTomcatSelectChange}
              render={item => item.title}
            />
          </Modal>
        </TabPane>
        <TabPane tab="MySQL" key="3">
          <Form layout="inline" onSubmit={this.handleMySQLSubmit}>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="连接数">
              <Input id="mysql-connections" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Select">
              <Input id="mysql-select" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Update">
              <Input id="mysql-update" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Delete">
              <Input id="mysql-delete" onChange={this.onInputChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Insert">
              <Input id="mysql-insert" onChange={this.onInputChange} />
            </FormItem>
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="plus-button" type="primary" size="small" onClick={this.showMySQLModal}>
                <Icon type="plus" />添加/删除数据库
              </Button>
            </FormItem>
            {this.state.targetMySQLKeys.length ?
              <FormItem {...formItemLayoutWithTags} className="antd-form-item">
                {this.state.targetMySQLKeys.map(index => {
                  return (<Tag key={index}>{this.state.databases[index].title}</Tag>);
                })}
              </FormItem> : ''}
            <FormItem {...formItemLayoutWithOutLabel} className="antd-form-item">
              <Button className="setting-submit" type="primary" htmlType="submit" size="default">提交</Button>
            </FormItem>
          </Form>
          <Modal title="数据库列表"
            visible={this.state.mysqlModalVisible}
            onOk={() => this.hideMySQLModal()}
            onCancel={() => this.hideMySQLModal()} >
            <Transfer
              dataSource={this.state.databases}
              titles={['未选择', '已选择']}
              targetKeys={this.state.targetMySQLKeys}
              selectedKeys={this.state.selectedMySQLKeys}
              onChange={this.handleMySQLChange}
              onSelectChange={this.handleMySQLSelectChange}
              render={item => item.title}
            />
          </Modal>
        </TabPane>
      </Tabs>
    );
  }
}

let route = {
  path: 'threshold',
  component: PageContent
}

export default route;