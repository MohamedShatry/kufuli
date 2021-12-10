const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rules = {
  test: /\.js(x?)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
};

const plugins = [
  new HTMLWebpackPlugin({
    template: 'src/popup/popup.html',
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new HTMLWebpackPlugin({
    template: './src/option/option.html',
    filename: 'option.html',
    chunks: ['popup'],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: 'public', to: '.' }],
  }),
  new CleanWebpackPlugin(),
];

module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup/popup.jsx',
    option: './src/option/option.jsx',
    background: './src/background.js',
    contentScript: './src/contentScript.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [rules],
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  plugins,
};
