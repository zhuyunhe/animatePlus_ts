const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = 'localhost'
const PORT = 8080
const HTTPS = false

module.exports = {
  mode: 'development',
  entry: {
    app: './test/test.js'
  },
  output: {
    publicPath: '/dist',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.ts/, use: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '模块热替换',
      template: './test/index.html',
      file: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: __dirname,
    quiet: true,
    compress: true,
    port: PORT,
    host: HOST,
    https: HTTPS,
    // hot: true,
    // hotOnly: true,
    // inline: true,
    open: true,
    overlay: true,
    openPage: './dist/index.html'
  },
  devtool: 'cheap-module-eval-source-map'
}