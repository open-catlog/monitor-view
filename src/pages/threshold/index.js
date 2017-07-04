import React from 'react';

import { Tabs, Form, Input, Button, Icon, Modal, Transfer, Tag, message, InputNumber } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import './style';
import { getRequest, postRequest } from '../../../utils/httpClient';

class PageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hardwareServers: [],
      databases: [],
      selectedHardwareKeys: [],
      targetHardwareKeys: [],
      hardwareModalVisible: false,
      selectedMySQLKeys: [],
      targetMySQLKeys: [],
      mysqlModalVisible: false,
      hardwareCpu: 0,
      hardwareThread: 0,
      hardwareMemory: 0,
      hardwareNetwork: 0,
      hardwareIo: 0,
      hardwareDisk: 0,
      mysqlConnections: 0,
      mysqlSelect: 0,
      mysqlUpdate: 0,
      mysqlDelete: 0,
      mysqlInsert: 0
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

  onCpuChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareCpu = value;
    if (!value) {
      tempState.hardwareCpu = 0;
    }
    this.setState(tempState);
  };

  onThreadChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareThread = value;
    if (!value) {
      tempState.hardwareThread = 0;
    }
    this.setState(tempState);
  };

  onDiskChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareDisk = value;
    if (!value) {
      tempState.hardwareDisk = 0;
    }
    this.setState(tempState);
  };

  onIoChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareIo = value;
    if (!value) {
      tempState.hardwareIo = 0;
    }
    this.setState(tempState);
  };

  onMemoryChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareMemory = value;
    if (!value) {
      tempState.hardwareMemory = 0;
    }
    this.setState(tempState);
  };

  onNetworkChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.hardwareNetwork = value;
    if (!value) {
      tempState.hardwareNetwork = 0;
    }
    this.setState(tempState);
  };

  onConnectionChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlConnections = value;
    if (!value) {
      tempState.mysqlConnections = 0;
    }
    this.setState(tempState);
  };

  onSelectChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlSelect = value;
    if (!value) {
      tempState.mysqlSelect = 0;
    }
    this.setState(tempState);
  };

  onUpdateChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlUpdate = value;
    if (!value) {
      tempState.mysqlUpdate = 0;
    }
    this.setState(tempState);
  };

  onInsertChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlInsert = value;
    if (!value) {
      tempState.mysqlInsert = 0;
    }
    this.setState(tempState);
  };

  onDeleteChange = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.mysqlDelete = value;
    if (!value) {
      tempState.mysqlDelete = 0;
    }
    this.setState(tempState);
  };

  handleHardwareSubmit = () => {
    let hardwareServers = [];

    if (this.state.targetHardwareKeys.length) {
      this.state.targetHardwareKeys.forEach(key => {
        hardwareServers.push(this.state.hardwareServers[key].title)
      });
    }

    if (hardwareServers.length) {
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
      this.postData('hardware', hardwareServers, threshold);
      let tempState = Object.assign({}, this.state);
      tempState.hardwareCpu = 0;
      tempState.hardwareThread = 0;
      tempState.hardwareDisk = 0;
      tempState.hardwareIo = 0;
      tempState.hardwareMemory = 0;
      tempState.hardwareNetwork = 0;
      tempState.targetHardwareKeys = [];
      this.setState(tempState);
    } else {
      message.warning('未添加服务器~');
    }
  };

  handleMySQLSubmit = () => {
    let databases = [];

    if (this.state.targetMySQLKeys.length) {
      this.state.targetMySQLKeys.forEach(key => {
        databases.push(this.state.databases[key].title);
      });
    }

    if (databases.length) {
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
      this.postData('mysql', databases, threshold);
      let tempState = Object.assign({}, this.state);
      tempState.mysqlConnections = 0;
      tempState.mysqlInsert = 0;
      tempState.mysqlSelect = 0;
      tempState.mysqlUpdate = 0;
      tempState.mysqlDelete = 0;
      tempState.targetMySQLKeys = [];
      this.setState(tempState);
    } else {
      message.warning('未添加数据库~');
    }
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
              <InputNumber className="setting-input-num" min={0} max={1} step={0.1} value={this.state.hardwareCpu} onChange={this.onCpuChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="线程数">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.hardwareThread} onChange={this.onThreadChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="网络传输速率">
              <InputNumber className="setting-input-num" min={0} max={1} step={0.1} value={this.state.hardwareNetwork} onChange={this.onNetworkChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="IO读写速率">
              <InputNumber className="setting-input-num" min={0} max={1} step={0.1} value={this.state.hardwareIo} onChange={this.onIoChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="内存空闲比例">
              <InputNumber className="setting-input-num" min={0} max={1} step={0.1} value={this.state.hardwareMemory} onChange={this.onMemoryChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="磁盘占用比例">
              <InputNumber className="setting-input-num" min={0} max={1} step={0.1} value={this.state.hardwareDisk} onChange={this.onDiskChange} />
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
        <TabPane tab="MySQL" key="2">
          <Form layout="inline" onSubmit={this.handleMySQLSubmit}>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="连接数">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.mysqlConnections} onChange={this.onConnectionChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Select">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.mysqlSelect} onChange={this.onSelectChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Update">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.mysqlUpdate} onChange={this.onUpdateChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Delete">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.mysqlDelete} onChange={this.onDeleteChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="antd-form-item"
              label="Insert">
              <InputNumber className="setting-input-num" min={0} step={100} value={this.state.mysqlInsert} onChange={this.onInsertChange} />
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