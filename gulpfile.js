var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');
var babel = require('gulp-babel');

gulp.task('bundle-css', function() {
  gulp
    .src('src/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css/'));
})

gulp.task('bundle-js', function() {
  gulp
    .src('src/index.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./dist/js/'));
})
