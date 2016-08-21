/**
 * @author: magarcia <newluxfero@gmail.com>
 */

var webpack = require('webpack');
var helpers = require('./helpers');

var PACKAGE = require('../package.json')
/*
 * Webpack Plugins
 */
var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  entry: {
    'app': './src/app/index.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts'],
     modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|ogg|mp3|wav)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loaders: ["style", "css"]
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  htmlLoader: {
    minimize: false,
    caseSensitive: true,
    // Workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    customAttrSurround: [
      [/#/, /(?:)/],
      [/\*/, /(?:)/],
      [/\[?\(?/, /(?:)/]
    ],
    customAttrAssign: [/\)?\]?=/]
  },

  plugins: [
    /*
     * Plugin: ResolverPlugin
     * Description: To use components from bower.
     *
     * See: https://github.com/webpack/docs/wiki/list-of-plugins#resolverplugin
     */
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project config.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([{
      from: 'src/config.json',
      to: 'config.json'
    }]),

    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'none',
      minify: false,
      cache: true
    }),

    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      VERSION: JSON.stringify(PACKAGE.version)
    })
  ],

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
