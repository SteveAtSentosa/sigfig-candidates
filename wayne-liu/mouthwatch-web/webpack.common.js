const path = require('path')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const sourcePath = path.resolve(__dirname, 'src')
const outPath = path.resolve(__dirname, 'dist')

module.exports = {
  entry: {
    app: [path.resolve(sourcePath, 'index')]
  },
  output: {
    filename: '[name].[hash].js',
    path: outPath,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'shared',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
        }
      }
    }
  },
  target: 'web',
  resolve: {
    plugins: [
      new TsConfigPathsPlugin()
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      // typescript / javascript
      {
        test: /\.(j|t)sx?$/,
        exclude: [/@babel(?:\/|\\{1,2})runtime|core-js/],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            extends: path.join(__dirname + '/.babelrc')
          }
        }
      },
      // stylesheets
      {
        test: /\.(css|sass|scss)$/,
        use: [
          ExtractCssChunksPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              hot: true,
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [ 'src/', 'src/static/' ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  }
}
