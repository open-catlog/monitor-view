import React from 'react';
import { Menu, Icon } from 'antd';
import { hashHistory, Link } from 'react-router';

import location from '../../conf/location';

import './style';

const SubMenu = Menu.SubMenu;

class SiderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: location,
      current: '1',
      openKeys: []
    };
  };

  handleClick = (e) => {
    this.setState({ current: e.key });
  };

  onOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  };

  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  render() {
    let siderBarProps = this.state.navigation;
    let index = 1;
    let subIndex = 3;
    return (
      <Menu
        className="sider"
        theme="dark"
        mode="inline"
        onClick={this.handleClick}
      >
        <Menu.Item key="1">
          <Link to="/"><span>
            <Icon type="home" />
            <span>首页</span>
          </span></Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/hardware"><span>
            <Icon type="hdd" />
            <span>基础设施</span>
          </span></Link>
        </Menu.Item>
        {siderBarProps.map(menu => {
          return (
            <SubMenu key={"sub" + (index++)} title={<span><Icon type={menu.listIcon} /><span>{menu.listTitle}</span></span>}>
              {
                menu.list ?
                  menu.list.map(subMenu => {
                    return <Menu.Item key={(subIndex++) + ""}><Link to={subMenu.pageUrl}>{subMenu.pageName}</Link></Menu.Item>
                  }) : null
              }
            </SubMenu>
          );
        })}
        <Menu.Item key={(subIndex++) + ""}>
          <Link to="/config"><span>
            <Icon type="setting" />
            <span>配置中心</span>
          </span></Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default SiderBar;
