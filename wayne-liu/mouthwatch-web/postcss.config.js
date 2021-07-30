const cssNano = require('cssnano')
const cssPresetEnv = require('postcss-preset-env')
const cssModules = require('postcss-modules')

module.exports = {
  plugins: [
    cssPresetEnv(),
    cssNano({
      zIndex: false
    })
  ]
}
