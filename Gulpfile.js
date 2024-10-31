/* Tasks
default: dev (build + watch)
*/


// var
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer =  require('autoprefixer');
const browserSync = require('browser-sync').create();
const watch = require('gulp');
const runSequence = require('gulp4-run-sequence');

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
        baseDir: "./public",
        port: config.servingPort
      },
      open: false,
      ui: false,
  });
});

/* -----------------------------------
gulp dev
-------------------------------------- */

gulp.task('dev', gulp.series(function(cb){
  gulp.watch('src/*.js', gulp.series(['script:dev']));
  gulp.watch('src/*.scss', gulp.series(['css:select']));
  gulp.watch(['public/assets/scss/*.scss', 'public/assets/css/select-a11y.css'],{delay: 1000}, gulp.series(['css:public']));
  cb();
}, 'server'));

/* -----------------------------------
gulp build
-------------------------------------- */
gulp.task('build', function(cb){
  runSequence('script:build', 'script:dev', 'css:select', 'css:public', cb);
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
    .pipe(postcss([ autoprefixer()]))      
    .pipe(gulp.dest('./public/assets/css'));
});

// compile all the styles for the public page
gulp.task('css:public', function () {
    return gulp.src('./public/assets/scss/*.scss')
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer()]))      
        .pipe(gulp.dest('./public/assets/css'))
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
const commonjs =  (...args) => import('@rollup/plugin-commonjs').then(({default: fetch}) => fetch(...args));
const nodeResolve =  (...args) => import('@rollup/plugin-node-resolve').then(({default: fetch}) => fetch(...args));
const babel =  (...args) => import('@rollup/plugin-babel').then(({default: fetch}) => fetch(...args));
const terser =  (...args) => import('@rollup/plugin-terser').then(({default: fetch}) => fetch(...args));
         
const params = {
  src: `./src/select-a11y.js`,
  name: 'Select',
  dest: `./public/assets/scripts/select-a11y.js`
}

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      [ '@babel/preset-env', {
        modules: false,
        targets: {
          browsers: config.browser,
        }
      }]
    ],
    plugins: ['@babel/plugin-transform-object-assign']
  }),
  terser(),
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
