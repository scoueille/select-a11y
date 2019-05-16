/* Tasks
default: dev (build + watch)
*/


// var
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

// config
const path = require('path');

const config = {
  "paths": {
      "filesToWatch": ["./tests/**/*.js","./src/select-a11y.scss"]
  },
  "rootDir": path.resolve(__dirname, '../'),
  "servingPort": 8080,
  "filesToWatch": ["./tests/**/*.js","./src/select-a11y.scss"],
  "browser": "last 2 version"
}


/* -----------------------------------
gulp server
-------------------------------------- */

gulp.task('server', function(){
    browserSync.init({
      server: {
        baseDir: "./demo",
        port: config.servingPort
      },
      open: false,
      ui: false,
  });
});

/* -----------------------------------
gulp dev
-------------------------------------- */

gulp.task('dev', ['server'], function(){
  watch('./src/*.js', function(){
    return gulp.start('script:dev');
  });
  watch('./src/*.scss', function(){
    return gulp.start('css:select');
  });
  watch('./demo/assets/scss/*',{delay: 1000}, function(){
    return gulp.start('css:demo');
  });
});

/* -----------------------------------
gulp build
-------------------------------------- */
gulp.task('build', function(cb){
  runSequence('script:build', 'script:dev', 'css:select', 'css:demo', cb);
});


/* -----------------------------------
Styles
-------------------------------------- */

// compile the specific styles for select-a11y
gulp.task('css:select', function () {
  return gulp.src('./src/select-a11y.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(autoprefixer(config.browser))
    .pipe(gulp.dest('./demo/assets/css'));
});

// compile all the styles for the demo page
gulp.task('css:demo', function () {
    return gulp.src('./demo/assets/scss/*.scss')
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(autoprefixer(config.browser))
        .pipe(gulp.dest('./demo/assets/css'))
});


/* ----------------------------------------------
script
----------------------------------------------- */

gulp.task( 'script:dev', () => {
  const entry = { ...rollupIn };
  const out = { ...rollupOut };

  out.sourcemap = true

  return rollup( entry )
    .then( bundle => bundle.write( out ))
    .then(() => {
      browserSync.reload();
    });
});

gulp.task( 'script:build', () => {

  const script = rollup( rollupIn )
    .then( bundle => bundle.write( rollupOut ))
    .then(() => {
      browserSync.reload();
    });

  const entryMin = { ...rollupIn };
  const outMin = { ...rollupOut };

  entryMin.plugins.push(uglify());

  outMin.file = rollupOut.file.replace('.js', '.min.js');

  const minified = rollup( entryMin )
    .then( bundle => bundle.write( outMin ));

  return Promise.all([script, minified]);
});


/* -------------------------------------------------------
babel
-------------------------------------------------------- */
const task = 'js';
const { rollup } = require( 'rollup' );
const commonjs = require( 'rollup-plugin-commonjs' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const { uglify } = require( 'rollup-plugin-uglify' );
const babel = require( 'rollup-plugin-babel' );

const params = {
  src: `./src/select-a11y.js`,
  name: 'Select',
  dest: `./demo/assets/scripts/select-a11y.js`
}

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    presets: [
      [ '@babel/preset-env', {
        modules: false,
        targets: {
          browsers: config.browser,
        }
      }]
    ]
  }),
];

const rollupIn = {
  input: params.src,
  plugins
};

const rollupOut = {
  file: params.dest,
  format: 'iife',
  name: params.name,
};



/* ----------------------------------
Tâche par défaut
----------------------------------- */

gulp.task('default', function(cb){
  runSequence('build', 'dev', cb);
});
