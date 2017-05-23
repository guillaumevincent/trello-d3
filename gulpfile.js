'use strict';

var gulp = require('gulp');

gulp.task('default', function() {
  return gulp
    .src([
      'node_modules/vue/dist/vue.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/d3/build/d3.min.js',
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
    ])
    .pipe(gulp.dest('vendors/'));
});
