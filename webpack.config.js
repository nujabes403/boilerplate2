const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCSS = new ExtractTextPlugin('bundle-[hash:6].css')

const ENV_DIR = './config/'
const envPath = ENV_DIR + `${process.env.NODE_ENV}`.toLowerCase() + '.env'

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: [
    'whatwg-fetch',
    '@babel/polyfill',
    'react-hot-loader/patch',
    path.resolve(__dirname, 'src/index.js'),
    'webpack-hot-middleware/client',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle-[hash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: 'babel-loader',
        loader: 'babel-loader',
        query: { compact: false },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, 'src/styles')],
              },
            },
            {
              loader: 'sass-resources-loader',
              options: {
                // Or array of paths
                resources: [
                  './src/styles/_colors.scss',
                  './src/styles/_mixins.scss',
                  './src/styles/_common.scss',
                  './src/styles/_fonts.scss',
                ]
              },
            },
          ],
        }),
      },
    ],
  },
  resolve: {
    alias: {
      constants: path.resolve(__dirname, 'src/constants/'),
      components: path.resolve(__dirname, 'src/components/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      contracts: path.resolve(__dirname, 'contracts'),
      images: path.resolve(__dirname, 'static/images/'),
      pages: path.resolve(__dirname, 'src/pages/'),
      klaytn: path.resolve(__dirname, 'src/klaytn/'),
      streams: path.resolve(__dirname, 'src/streams/'),
      vendors: path.resolve(__dirname, 'src/vendors/'),
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: ['caver-js.js'],
    }),
    new MonacoWebpackPlugin({
      languages: ['solidity'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      inject: 'body',
    }),
    extractCSS,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: envPath,
    }),
  ],
}
