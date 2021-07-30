const path = require('path')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const prodPlugins = require('./webpack.plugins.js').production

const sourcePath = path.resolve(__dirname, 'src')
const outPath = path.resolve(__dirname, 'dist')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: prodPlugins
})
