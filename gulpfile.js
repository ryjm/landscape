var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

// var rollup = require('rollup-stream');
var rollup = require('gulp-better-rollup');
var source = require('vinyl-source-stream');

var babel = require('rollup-plugin-babel');
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

// var cache;

gulp.task('bundle-js', function(cb) {
  gulp.src('src/index.js')
    .pipe(rollup({
      // format: "umd",
      plugins: [
        // babel({
        //   ignore: ['src/js/vendor/**', 'node_modules/**']
        // }),
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
    }, 'umd'))
    .on('error', function(e){
      console.log(e);
      cb();
    })
    // .pipe(source('index.js'))
    .pipe(gulp.dest('./urbit-code/web/landscape/js/'))
    .on('end', cb);
});

// gulp.task('bundle-js', function(cb) {
//   return rollup({
//     input: './src/index.js',
//     cache: cache,
//     format: "umd",
//     plugins: [
//       babel({
//         ignore: ['src/js/vendor/**', 'node_modules/**']
//       }),
//       commonjs({
//         namedExports: {
//           'node_modules/react/index.js': [ 'Component' ]
//         }
//       }),
//       replace({
//         'process.env.NODE_ENV': JSON.stringify('development')
//       }),
//       rootImport({
//         root: `${__dirname}/src/js`,
//         useEntry: 'prepend',
//         extensions: '.js'
//       }),
//       json(),
//       builtins(),
//       resolve()
//     ]
//   }).on('bundle', function(bundle){
//     // console.log("bundle = ", bundle);
//     console.log("bundle.cache = ", bundle.cache);
//
//     if (!cache) {
//       cache = bundle;
//     }
//   })
//     .on('error', function(e){
//       console.log(e);
//       cb();
//     })
//     .pipe(source('index.js'))
//     .pipe(gulp.dest('./urbit-code/web/landscape/js/'))
//     .on('end', cb);
// });

gulp.task('copy-urbit', function () {
  let ret = gulp.src('urbit-code/**/*');

  urbitrc.URBIT_PIERS.forEach(function(pier) {
    ret = ret.pipe(gulp.dest(pier));
  });

  return ret;
});

gulp.task('default', gulp.series(gulp.parallel('bundle-js', 'bundle-css'), 'copy-urbit'));

gulp.task('watch', gulp.series('default', function() {
  gulp.watch('src/**/*.js', gulp.parallel('bundle-js'));
  gulp.watch('src/**/*.css', gulp.parallel('bundle-css'));

  gulp.watch('urbit-code/**/*', gulp.parallel('copy-urbit'));
}));
