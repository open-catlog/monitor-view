import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';

import SiderBar from './src/global/layout/SiderBar/index';
import Header from './src/global/layout/Header/index';

import './src/global/less/global';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <Header />
        <SiderBar pathName={this.props.location.pathname}/>
        {this.props.children}
      </div>
    );
  }
}

const routes = {
  path: '/',
  component: Layout,
  getIndexRoute(history, callback) {
    require.ensure([], function(require) {
      callback(null, require('./src/pages/default/index').default);
    });
  },
  getChildRoutes(history, callback) {
    if (history.location.pathname === '/test1' || history.location.pathname === '/test2' || history.location.pathname === '/test3') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/test1/index').default,
          require('./src/pages/test2/index').default,
          require('./src/pages/test3/index').default
        ]);
      });
    }
  }
}

ReactDOM.render(
  <Router history={hashHistory} routes={routes} />, 
  document.getElementById('app')
);
