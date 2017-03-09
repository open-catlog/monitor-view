import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';

import SiderBar from './src/global/layout/SiderBar/index';
import Header from './src/global/layout/Header/index';

import './src/global/less/global';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <Header />
        <SiderBar pathName={this.props.location.pathname} />
        {this.props.children}
      </div>
    );
  }
}

const routes = {
  path: '/',
  component: Layout,
  getIndexRoute(history, callback) {
    require.ensure([], function (require) {
      callback(null, require('./src/pages/default/index').default);
    });
  },
  getChildRoutes(history, callback) {
    if (history.location.pathname === '/cpu' || history.location.pathname === '/process' || history.location.pathname === '/disk'
      || history.location.pathname === '/memory' || history.location.pathname === '/io' || history.location.pathname === '/network') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/cpu/index').default,
          require('./src/pages/process/index').default,
          require('./src/pages/disk/index').default,
          require('./src/pages/memory/index').default,
          require('./src/pages/io/index').default,
          require('./src/pages/network/index').default
        ]);
      });
    }
  }
}

ReactDOM.render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById('app')
);
