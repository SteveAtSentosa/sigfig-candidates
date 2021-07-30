const path = require('path')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const devPlugins = require('./webpack.plugins.js').development

const sourcePath = path.resolve(__dirname, 'src')
const outPath = path.resolve(__dirname, 'dist')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: devPlugins,
  devServer: {
    host: '0.0.0.0',
    allowedHosts: ['m***-web-dev.localhost', '0.0.0.0', 'localhost', 'm***-web-dev.local'],
    historyApiFallback: {
      disableDotRule: true
    }
  }
})
