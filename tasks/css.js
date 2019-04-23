var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var config = require('./config');

gulp.task('css:src', function () {
  var expanded = gulp.src('./src/select-a11y.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(autoprefixer(config.browser))
    .pipe(gulp.dest('./dist'));

  var compressed = gulp.src('./src/select-a11y.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(autoprefixer(config.browser))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));

  return Promise.all([expanded, compressed])
});

gulp.task('css:public', function () {
    return gulp.src('./demo/scss/*.scss')
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(autoprefixer(config.browser))
        .pipe(gulp.dest('./public/assets/css'))
});
