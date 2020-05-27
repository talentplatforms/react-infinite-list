/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const megre = require('webpack-merge')
const cfg = require('./webpack.config')

const mergedCfg = megre(cfg, {
  mode: 'development',
  output: {
    libraryTarget: 'var',
  },
  entry: {
    devServer: './src/devServer.tsx',
  },
  externals: 'replace',
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 8080,
    host: 'localhost',
    public: 'localhost',
  },
})

module.exports = mergedCfg
