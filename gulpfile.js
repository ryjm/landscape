var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

var rollupReal = require('rollup');
// var rollup = require('rollup-stream');
var rollup = require('gulp-better-rollup');
var source = require('vinyl-source-stream')
var acornJSX = require('acorn-jsx');
var gulpJSX = require('gulp-jsx');;
// var rollupUrb = require('rollup-urb');

// var jsx = require('rollup-plugin-jsx-js');
var sucrase = require('@sucrase/gulp-plugin');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var rootImport = require('rollup-plugin-root-import');

/***
  Main config options
***/

var urbitrc = require('./.urbitrc');

/***
  End main config options
***/

gulp.task('bundle-css', function() {
  return gulp
    .src('src/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./urbit-code/web/landscape/css'));
});

gulp.task('jsx-transform', function(cb) {
  return gulp.src('src/**/*.js')
    .pipe(sucrase({
      transforms: ['jsx', 'imports']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('js-imports', function(cb) {
  return gulp.src('dist/bundle.js')
    .pipe(rollup({
      plugins: [
        commonjs({
          namedExports: {
            'node_modules/react/index.js': [ 'Component' ]
          }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
        rootImport({
          root: `${__dirname}/dist/js`,
          useEntry: 'prepend',
          extensions: '.js'
        }),
        // json(),
        builtins(),
        resolve()
      ]
    }, 'umd'))
    .on('error', function(e){
      console.log(e);
      cb();
    })
    // .pipe(source('index.js'))
    .pipe(gulp.dest('./urbit-code/web/landscape/js/'))
    .on('end', cb);
});

gulp.task('copy-urbit', function () {
  let ret = gulp.src('urbit-code/**/*');

  urbitrc.URBIT_PIERS.forEach(function(pier) {
    ret = ret.pipe(gulp.dest(pier));
  });

  return ret;
});

gulp.task('bundle-js', gulp.series('jsx-transform', 'js-imports'));
gulp.task('default', gulp.series(gulp.parallel('bundle-js', 'bundle-css'), 'copy-urbit'));
gulp.task('watch', gulp.series('default', function() {
  gulp.watch('src/**/*.js', gulp.parallel('bundle-js'));
  gulp.watch('src/**/*.css', gulp.parallel('bundle-css'));

  gulp.watch('urbit-code/**/*', gulp.parallel('copy-urbit'));
}));
