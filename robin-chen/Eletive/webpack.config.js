const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appConfig = require('./config/app.config');

module.exports = {
  mode: 'development',

  devtool: 'eval-source-map',

  entry: {
    index: ['@babel/polyfill', './source/index.js'],
  },

  output: {
    filename: 'static/[name].[hash:8].bundle.js',
    chunkFilename: 'static/[name][hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  performance: {
    hints: false,
  },

  devServer: {
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true,
    },
  },

  module: {
    strictExportPresence: true,

    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        include: /source/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        include: /index.scss/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /index.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(png|jpg)/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
    ],
  },

  resolve: {
    modules: ['node_modules'],
    descriptionFiles: ['package.json'],
    alias: {
      api: path.resolve(__dirname, 'source/api'),
      utils: path.resolve(__dirname, 'source/utils'),
      Pages: path.resolve(__dirname, 'source/pages'),
      Models: path.resolve(__dirname, 'source/models'),
      Constants: path.resolve(__dirname, 'source/constants'),
      Components: path.resolve(__dirname, 'source/components'),
      Containers: path.resolve(__dirname, 'source/containers'),

      store: path.resolve(__dirname, 'source/store'),
      styles: path.resolve(__dirname, 'source/styles'),
      images: path.resolve(__dirname, 'source/images'),
      services: path.resolve(__dirname, 'source/services'),
      utilities: path.resolve(__dirname, 'source/utilities'),
      'react-dom': '@hot-loader/react-dom',
    },
    mainFields: ['browser', 'main', 'module'],
    extensions: ['*', '.js', '.jsx', '.json'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      CONFIG: appConfig,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/[hash].bundle.css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      title: 'Eletive Dashboard',
      template: './public/index.html',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|sv/),
  ],
};
