## 1. 简介

  该项目是 [monitor-server](https://github.com/open-catlog/monitor-server) 的前端展示部分，是单页应用。运行时能够正常展示页面，但无法获取数据。

## 2. 运行

  首先要确保本地能够运行 webpack 和 webpack-dev-server。

### 2.1. 热加载

- 修改 webpack 的配置文件中的 entry 配置项和 output 配置项。如下： 
```
  entry: [
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: './build/src/pages',
    filename: 'build.js'
  }
```
- 运行命令：npm run dev

### 2.2. 打包

- 修改 webpack 的配置文件中的 entry 配置项和 output 配置项。如下：
```
  entry: [
    './index.js'
  ],
  output: {
    path: path.join('---------你的打包文件将要放置的目录---------------")', '/build/src/pages'),
    publicPath: './build/src/pages/',
    filename: 'build.js'
  }
```
- 运行命令：npm run build