'use strict';

var gulp = require('gulp');
var file = require('gulp-file');
var pkg = require('../package.json');

module.exports = function(options) {
  gulp.task('config', function () {
    var appConfig;
    try {
      appConfig = require('../src/config.json');
    } catch (e) {
      appConfig = {};
    }
    appConfig.version = pkg.version;

    file('config.json', JSON.stringify(appConfig, null, '  '), { str: true })
      .pipe(gulp.dest('src'));
  });
}
