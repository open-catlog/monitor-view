var webpack = require('webpack');

var config = {
  entry: [
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: __dirname + '/build/src/pages',
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
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
