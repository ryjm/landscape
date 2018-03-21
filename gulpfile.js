var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');
var rsync = require('gulp-rsync');
var serve = require('gulp-webserver');

var rollup = require('rollup-stream');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var source = require('vinyl-source-stream');

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
  // urbitrc.LOCAL_PIERS.forEach(function(pier) {
  //   console.log('woops');
  //   return gulp.src('urbit-code/**/*')
  //     .pipe(gulp.dest(pier));
  // });

  var ret = {};

  urbitrc.REMOTE_PIERS.forEach(function(pier) {
    var opts = Object.assign({}, pier, {
      root: 'urbit-code/',
      username: 'root',
      silent: false
    });

    ret = gulp.src('urbit-code/**/*')
      .pipe(rsync(opts));
  });

  return ret;
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/**/*.js', ['bundle-js']);
  gulp.watch('src/**/*.css', ['bundle-css']);

  gulp.watch('urbit-code/**/*', ['copy-urbit']);
})

gulp.task('default', [ 'bundle-js', 'bundle-css', 'copy-urbit' ]);
gulp.task('serve', ['server', 'watch']);
