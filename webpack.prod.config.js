const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const extractCSS = new ExtractTextPlugin('bundle-[hash:6].css')

const ENV_DIR = './config/'
const envPath = ENV_DIR + `${process.env.NODE_ENV}`.toLowerCase() + '.env'

module.exports = {
  mode: 'production',
  entry: [
    'whatwg-fetch',
    '@babel/polyfill',
    path.resolve(__dirname, 'src/index.js'),
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
        loader: 'babel-loader',
        query: { compact: false },
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true },
            },
          ],
        })
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true },
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
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: false,
      }),
    ]
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
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
      filename: '[path]',
    }),
    new CopyWebpackPlugin([{
      from: 'static',
      to: 'static',
      toType: 'dir',
    }]),
    new Dotenv({
      path: envPath,
    }),
    new CleanWebpackPlugin(['dist']),
  ],
}
