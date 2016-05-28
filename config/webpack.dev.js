/*
 * @author: magarcia <newluxfero@gmail>
 */
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

/*
 * Webpack Plugins
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
 * Webpack configuration
 */
module.exports = webpackMerge(commonConfig, {
  // Switch loaders to debug mode
  debug: true,

  // Developer tool to enhance debugging
  devtool: 'source-map',

  // Options affecting the output of the compilation
  output: {
    path: helpers.root('dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  //plugins: [
    //new ExtractTextPlugin('[name].css')
  //],

  /*
   * Static analysis linter for TypeScript advanced options configuration
   * Description: An extensible linter for the TypeScript language.
   *
   * See: https://github.com/wbuchwalter/tslint-loader
   */
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  /*
   * Webpack Development Server configuration
   * Description: The webpack-dev-server is a little node.js Express server.
   * The server emits information about the compilation state to the client,
   * which reacts to those events.
   *
   * See: https://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    port: 4000,
    host: 'localhost',
    historyApiFallback: true,
    //watchOptions: {
      //aggregateTimeout: 300,
      //poll: 1000
    //},
    outputPath: helpers.root('dist')
  },

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});

