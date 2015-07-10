'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util')
var fs = require('fs');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch', ['markups', 'inject'], function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.src + '/app/**/*.css',
      options.src + '/app/**/*.scss'
    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.src + '/app/**/*.js{,on}', function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.src + '/app/**/*.jade', ['markups']);

    var components_symlink = options.tmp + '/serve/bower_components';
    fs.exists(components_symlink, function (exists) {
      if (!exists) {
        gutil.log("Symlinking " + components_symlink + " -> bower_components");
        fs.symlinkSync('../../bower_components', components_symlink);
      }
    });
  });
};
