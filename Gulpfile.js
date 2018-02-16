var gulp = require('gulp');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var opn = require('opn');
var gulpLivereload = require('gulp-livereload');
var serveStatic = require('serve-static');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


// Run tests in tests/ with jasmine default task)
// ======================================== */

// build specific css rules for select-a11y.js
gulp.task('make:css-src', function () {
    return gulp.src('./src/select-a11y.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('./src'))
});

// tests paths
var config = {
    paths: {
        filesToWatch: ['./tests/**/*.js','./src/select-a11y.scss']
    },
    rootDir: __dirname,
    servingPort: 8080,
    filesToWatch: ['./tests/**/*.js','./src/select-a11y.scss']
};


// connect, watch and serve
gulp.task('connect', function(){
    connect()
        .use(connectLivereload())
        .use(serveStatic(config.rootDir))
        .listen(config.servingPort);
});

gulp.task('watch:tests', ['make:css-src','connect'], function () {
    gulpLivereload.listen();
    gulp.watch(config.filesToWatch, function(file) {
        gulp.src(file.path)
            .pipe(gulpLivereload());
    });
});

// you must set {app: value} for your OS :
//      - windows:  {app: 'chrome'}
//      - linux:    {app: 'google-chrome'}
//      - mac:      {app: 'google chrome'}

gulp.task('serve:tests', ['watch:tests'], function () {
    opn('http://localhost:' + config.servingPort + '/tests/SpecRunner.html', {app: 'google chrome'});
});

gulp.task('default',['serve:tests']);


// Build dist repository
// ======================================== */
gulp.task('copy:src', function() {
  gulp.src('./src/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('compress:js', function () {
  gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('compress:css', function () {
    return gulp.src('./src/select-a11y.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build:dist',['copy:src','compress:js','compress:css']);


// Build demo / public
// ===========================================================

// Add scampi in demo files
gulp.task('copy:scampi', function() {
  gulp.src('node_modules/scampi/**/*')
    .pipe(gulp.dest('./demo/assets/scss/scampi'));
});

// Add script select-a11y.js in demo files
gulp.task('copy:script', function() {
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./demo/assets/scripts'));
});

// Add partial select-a11y.scss in demo files
gulp.task('copy:scss', function() {
  gulp.src('./src/select-a11y.scss')
    .pipe(rename('_select-a11y.scss'))
    .pipe(gulp.dest('./demo/assets/scss'));
});

gulp.task('prepare:demo',['copy:scampi','copy:script','copy:scss']);

// Compilation css
gulp.task('make:css-demo', function () {
    return gulp.src(['./demo/assets/scss/style.scss','./demo/assets/scss/print.scss'])
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./demo/assets/css/'));
});

gulp.task('build:demo',['prepare:demo','make:css-demo']);

// gitlab pages needs a folder named "public" to deploy
gulp.task('build:gitlab', function () {
    gulp.src(['./demo/**/*','!./demo/assets/{scss,scss/**}'])
    .pipe(gulp.dest('./public'));
});
