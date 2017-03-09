let locationProps = [{
  listTitle: '首页',
  listIcon: 'home',
  pageUrl: '/'
}, {
  listTitle: '基础设施',
  listIcon: 'hdd',
  list: [{
    pageName: 'CPU',
    pageUrl: '/cpu'
  }, {
    pageName: '内存',
    pageUrl: '/memory'
  }, {
    pageName: '进程数',
    pageUrl: '/process'
  }, {
    pageName: 'IO',
    pageUrl: '/io'
  }, {
    pageName: '硬盘',
    pageUrl: '/disk'
  }, {
    pageName: '网络',
    pageUrl: '/network'
  }]
}, {
    listTitle: '平台信息',
    listIcon: 'bulb',
    list: [{
      pageName: 'Tomcat',
      pageUrl: '/tomcat'
    }]
}];

export default locationProps;