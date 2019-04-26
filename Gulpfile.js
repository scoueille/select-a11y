var gulp = require('gulp');
var config = require('./tasks/config');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');
var runSequence = require('run-sequence');


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

gulp.task('watch:dev', ['server'], function(){
  watch('./dist/*',{delay: 1000}, function(){
    return gulp.start('make:public');
  });
  watch('./src/*.js', function(){
    return gulp.start('script:dev');
  });
  watch('./src/*.scss', function(){
    return gulp.start('css:src');
  });
});

gulp.task('default',['watch:dev']);

gulp.task('make:public', function(){
  return gulp.start(['copy:public', 'css:public']);
});

gulp.task('build', function(cb){
  runSequence('script:build','copy:public', 'css:public', cb);
});

require('./tasks/copy.js');
require('./tasks/css.js');
require('./tasks/script.js');
