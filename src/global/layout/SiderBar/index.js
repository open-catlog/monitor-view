import React from 'react';
import {Icon} from 'antd';
import {hashHistory} from 'react-router';

import location from '../../conf/location';

import './style';

class SiderBar extends React.Component {
  constructor(props) {
    super(props);
    
    let navigation = location;
    let currentUrl = this.props.pathName;

    navigation.forEach(data => {
      data.listShow = false;
      data.currentTitle = false;
      if (data.list) {
        data.list.forEach((dataList) => {
          dataList.current = false;
          if (dataList.pageUrl === currentUrl) {
            dataList.listShow = true;
            data.currentTitle = true;
            dataList.current = true;
          }
        });
      } else if(data.pageUrl) {
        if (data.pageUrl === currentUrl) {
          data.currentTitle = true;
        }
      }
    });

    this.state = {
      navigation: navigation
    };
  }

  setListShow = (data, index) => {
    let tempState = Object.assign({}, this.state);
    let tempListShow = tempState.navigation[index].listShow;
    if (tempState.navigation[index].list) {
      tempState.navigation.forEach((value, key) => {
        if (index === key) {
          value.listShow = !tempListShow;
        } else {
          value.listShow = false;
        }
      });
      this.setState(tempState);
    } else {
      tempState.navigation.forEach((value, key) => {
        if (index === key) {
          value.listShow = !tempListShow;
          value.currentTitle = true;
        } else {
          value.listShow = false;
          value.currentTitle = false;
          if (value.list) {
            value.list.forEach(tempListData => {
              tempListData.current = false;
            });
          }        
        }
      });
      this.setState(tempState, () => {
        hashHistory.push(tempState.navigation[index].pageUrl);
      });
    }
  }

  setCurrent = (titleIndex, listIndex, url) => {
    let tempState = Object.assign({}, this.state);
    tempState.navigation.forEach((data, index) => {
      if (index == titleIndex) {
        data.listShow = true;
        data.currentTitle = true;
        data.list.forEach((tempListData, tempListIndex) => {
          tempListData.current = tempListIndex === listIndex;
        });
      } else {
        data.listShow = false;
        data.currentTitle = false;
        if (data.list) {
          data.list.forEach((tempListData) => {
            tempListData.current = false;
          })
        }
      }
    });
    this.setState(tempState, () => {
      hashHistory.push(url);
    })
  }

  renderSiderBar = (siderBarProps) => {
    let siderBarNode = [];

    siderBarProps.forEach((data, index) => {
      if (data.list) {
        let collapseNode = <Icon className="collapse" type={data.listShow ? 'up' : 'down'}></Icon>
        siderBarNode.push(
          <li key={index} className={data.currentTitle ? "list-title title-active" : "list-title"} 
              onClick={() => this.setListShow(data, index)}>
          <Icon type={data.listIcon}/>{data.listTitle}
          {collapseNode}
          </li>
        );

        data.list.forEach((dataList, key) => {
          if (data.listShow) {
            if (dataList.current) {
              siderBarNode.push(
                <li key={index + '-' + key} className="active list-node">
                  {dataList.pageName}
                </li>
              )
            } else {
              siderBarNode.push(
                <li key={index + '-' + key} className="list-node" onClick={() => this.setCurrent(index, key, dataList.pageUrl)}>
                  {dataList.pageName}
                </li>
              );
            }
          }
        });     
      } else if (data.pageUrl) {
        siderBarNode.push(
          <li key={index} className={data.currentTitle ? "list-title title-active" : "list-title"} 
              onClick={() => this.setListShow(data, index)}>
            <Icon type={data.listIcon}/>{data.listTitle}
          </li>
        );
      }
    });

    return siderBarNode;
  }

  render() {
    let siderBarProps = this.state.navigation;
    return (
      <ul className="sider">
        {this.renderSiderBar(siderBarProps)}
      </ul>
    );
  }
}

export default SiderBar;