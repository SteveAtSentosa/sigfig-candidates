// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const webpack = require('@cypress/webpack-preprocessor');
const webpackOptions = require('../../webpack.config');

module.exports = (on) => {
  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions,
    watchOptions: {},
  };

  on('file:preprocessor', webpack(options));
};
