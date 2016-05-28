/**
 * @author: magarcia <newluxfero@gmail.com>
 */

var webpack = require('webpack');
var helpers = require('./helpers');

/*
 * Webpack Plugins
 */
var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = {
  entry: {
    //'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/app/index.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts'],
     modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },

  module: {
    loaders: [
      /*
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
      {
        test: /\.ts$/,
        loader: 'ts'
        //exclude: [/\.(spec|e2e)\.ts$/]
      },
      /*
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|ogg|mp3|wav)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      //{
        //test: /\.css$/,
        //exclude: helpers.root('src', 'app'),
        //loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      //},
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loaders: ["style", "css"]
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
      //{
        //test: /\.scss$/,
        //loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      //}
    ]
  },

  plugins: [
    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    //new ForkCheckerPlugin(),

    /*
     * Plugin: ResolverPlugin
     * Description: To use components from bower.
     *
     * See: https://github.com/webpack/docs/wiki/list-of-plugins#resolverplugin
     */
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),

    new webpack.optimize.DedupePlugin(),

    /*
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor', 'app'].reverse()
    }),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
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
      chunksSortMode: 'none'
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.jquery': 'jquery',
      _: 'lodash'
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
