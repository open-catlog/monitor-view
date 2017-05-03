import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';

import { Layout } from 'antd';

import SiderBar from './src/global/components/SiderBar/index';
import CustomHeader from './src/global/components/Header/index';

const { Header, Content, Sider } = Layout;

import './src/global/less/global';

export default class CustomLayout extends React.Component {
  render() {
    return (
      <Layout>
        <Header>
          <CustomHeader />
        </Header>
        <Layout>
          <Sider><SiderBar /></Sider>
          <Content>{this.props.children}</Content>
        </Layout>
      </Layout>
    );
  }
}

const routes = {
  path: '/',
  component: CustomLayout,
  getIndexRoute(history, callback) {
    require.ensure([], function (require) {
      callback(null, require('./src/pages/default/index').default);
    });
  },
  getChildRoutes(history, callback) {
    if (history.location.pathname === '/hardware') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/hardware/index').default
        ]);
      });
    } else if (history.location.pathname === '/tomcat' || history.location.pathname === '/nginx' || history.location.pathname === '/mysql') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/tomcat/index').default,
          require('./src/pages/nginx/index').default,
          require('./src/pages/mysql/index').default
        ]);
      });
    } else if (history.location.pathname === '/config' || history.location.pathname === '/threshold') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/config/index').default,
          require('./src/pages/threshold/index').default
        ]);
      });
    }
  }
}

ReactDOM.render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById('app')
);
