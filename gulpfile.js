var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var rootImport = require('rollup-plugin-root-import');

var serve = require('gulp-webserver');

/***
  Main config options
***/

var urbitrc = require('./.urbitrc');

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
      rootImport({
        root: `${__dirname}/src/js`,
        useEntry: 'prepend',
        extensions: '.js'
      }),
      json(),
      builtins(),
      resolve()
    ]
  }).on('bundle', function(bundle){ cache = bundle; })
    .on('error', function(e){ console.log(e)})
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
  urbitrc.URBIT_PIERS.forEach(function(pier) {
    gulp.src('urbit-code/**/*')
        .pipe(gulp.dest(pier));
  })
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/**/*.js', ['bundle-js']);
  gulp.watch('src/**/*.css', ['bundle-css']);

  gulp.watch('urbit-code/**/*', ['copy-urbit']);
})

gulp.task('default', [ 'bundle-js', 'bundle-css', 'copy-urbit' ]);
gulp.task('serve', ['server', 'watch']);
