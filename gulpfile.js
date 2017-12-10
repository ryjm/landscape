var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

gulp.task('bundle-css', function() {
  gulp
    .src('src/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css/'));
})

gulp.task('bundle-js', function() {
  return rollup.rollup({
    input: './src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs({
        namedExports: {
          'node_modules/react/index.js': [ 'Component' ],
          'node_modules/react-router-dom/index.js': [ 'Link' ]
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      resolve()
    ]
  }).then(bundle => {
    return bundle.write({
      file: './dist/js/index.js',
      format: 'umd',
      name: 'index',
      sourcemap: true
    });
  });
})
