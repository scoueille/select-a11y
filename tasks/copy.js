var gulp = require('gulp');

gulp.task('copy:public', function() {
  return gulp.src('./dist/select-a11y.j*')
    .pipe(gulp.dest('./public/assets/scripts'));
});
