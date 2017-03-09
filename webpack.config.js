'use strict';

var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    // path: path.join('/Users/julia/prjs/monitor-server', '/build/src/pages'),
    // publicPath: './build/src/pages/',
    path: './build/src/pages',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.less']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        plugins: [['import', {'libraryName': 'antd', 'style': true}]],
        presets: ['es2015', 'react', 'stage-0', 'stage-1']
      }
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=50000'
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
