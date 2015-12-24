'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('markups', function() {
    function renameToHtml(path) {
      path.extname = '.html';
    }

    var pkg = require('../package.json');

    return gulp.src(options.src + '/app/**/*.jade')
      .pipe($.consolidate('jade', {
        basedir: options.src,
        doctype: 'html',
        pretty: '  ',
        version: pkg.version })).on('error', options.errorHandler('Jade'))
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
