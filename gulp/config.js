'use strict';

var gulp = require('gulp');
var pkg = require('../package.json');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');
var fs = require('fs');

module.exports = function(options) {
  function readConfig() {
    var fs = require('fs');
    var _ = require('lodash');
    var localConfig = {};
    var defaultConfig = require('../src/app/config.json');

    try {
      localConfig = require('../src/app/config.local.json');
    }
    catch(e) {
      console.info("Local config not found");
    }
    return _.merge(defaultConfig, localConfig);
  }

  gulp.task('config', function () {
    var appConfig = readConfig();
    appConfig.version = pkg.version;

    return ngConstant({
      name: 'janusHangouts.config',
      constants: appConfig,
      stream: true,
      space: '  ',
      templatePath: 'gulp/config.tpl.ejs'
    })
    .pipe(rename('config.js'))
    .pipe(gulp.dest('src/app'));
  });
}
