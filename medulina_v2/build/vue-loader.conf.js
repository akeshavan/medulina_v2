'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const loaderObj = utils.cssLoaders({
  sourceMap: sourceMapEnabled,
  extract: isProduction
})
loaderObj['scss'] = 'vue-style-loader!css-loader!sass-loader'
loaderObj['sass'] = 'vue-style-loader!css-loader!sass-loader?indentedSyntax',

module.exports = {
  loaders: loaderObj,
  cssSourceMap: sourceMapEnabled,
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
