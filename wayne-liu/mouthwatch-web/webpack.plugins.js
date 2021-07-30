const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin
const CircularDependencyPlugin = require('circular-dependency-plugin')

const sourcePath = path.resolve(__dirname, 'src')
const outPath = path.resolve(__dirname, 'dist')

const commonPlugins = [
  // copy images
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(sourcePath, 'static/**/*'),
        to: path.resolve(outPath, 'static'),
        globOptions: {
          ignore: [ 'index.html', 'styles/**/*', 'robots.txt', 'vmsg.wasm', 'images/samples/**/*' ]
        },
        context: path.resolve(sourcePath, 'static')
      },
      {
        from: path.resolve(sourcePath, 'static/robots.txt'),
        to: path.resolve(outPath)
      },
      {
        from: path.resolve(sourcePath, 'static/vmsg.wasm'),
        to: path.resolve(outPath, 'static')
      }
    ]
  }),
  new ExtractCssChunksPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    hot: true,
    orderWarning: false,
    reloadAll: true
  }),
  new ForkTsCheckerWebpackPlugin(),
  new HtmlPlugin({
    template: path.resolve(sourcePath, 'static/index.html')
  })
]

module.exports = {
  development: [
    ...commonPlugins,
    // check if there are any breaking circular dependencies.
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add warning instead of error.
      failOnError: false,
      // allow import cycles that include an asynchronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ],
  production: [
    ...commonPlugins,
    new SourceMapDevToolPlugin({
      module: false,
      columns: false,
      filename: '[file].map'
    })
  ]
}
