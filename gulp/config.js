'use strict';

var gulp = require('gulp');
var file = require('gulp-file');

module.exports = function(options) {
  gulp.task('config', function () {
    var appConfig;
    try {
      appConfig = require('../src/config.json');
    } catch (e) {
      appConfig = {};
    }

    file('config.json', JSON.stringify(appConfig, null, '  '), { str: true })
      .pipe(gulp.dest('src'));
  });
}
