var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var serve = require('gulp-webserver');

/***
  Main config options
***/

var URBIT_PIER = "/Users/chris/ciqss/proj/urbit/piers/fake/fake_zod/home";

/***
  End main config options
***/

gulp.task('bundle-css', function() {
  gulp
    .src('src/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./urbit-code/web/pages/nutalk/css'));
});

var cache;

gulp.task('bundle-js', function() {
  return rollup({
    input: './src/index.js',
    cache: cache,
    format: "umd",
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs({
        namedExports: {
          'node_modules/react/index.js': [ 'Component' ]
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      resolve()
    ]
  }).on('bundle', function(bundle){ cache = bundle; })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./urbit-code/web/pages/nutalk/js/'));
});

gulp.task('server', function () {
  gulp.src('.')
    .pipe(serve({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('copy-urbit', function () {
  gulp.src('urbit-code/**/*')
      .pipe(gulp.dest(URBIT_PIER));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['bundle-js']);
  gulp.watch('src/**/*.css', ['bundle-css']);

  gulp.watch('urbit-code/**/*', ['copy-urbit']);
})

gulp.task('default', [ 'bundle-js2', 'bundle-css', 'copy-urbit' ]);
gulp.task('serve', ['server', 'watch']);
