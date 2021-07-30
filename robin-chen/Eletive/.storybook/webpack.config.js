const custom = require('../webpack.config.js');

module.exports = async ({ config, mode }) => {
  const [jsx, css, scss1, scss2, fonts, svg, img ] = custom.module.rules;
  const rules = [ jsx, scss1, scss2, fonts, svg, img ];
  return {
    ...config,
    module: { ...config.module, ...custom.module, rules },
    resolve: { ...config.resolve, ...custom.resolve },
    plugins: [ ...config.plugins, custom.plugins[0], custom.plugins[1], custom.plugins[3]],
  };
};
