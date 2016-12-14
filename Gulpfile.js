// //////////////////////////////////////// //
//
//    Tout construire   :   gulp build
//    Tout nettoyer     :   gulp clean
//
//    compiler sass     :   gulp make:css
//    compiler twig     :   gulp make:html
//    watch html et css :   gulp
//
//    Constuire pour gitlab     :   gulp build --gitlab
//
// //////////////////////////////////////// //


//  Installation de sass et prérequis
// ======================================== */

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');


// variables de chemins
// ======================================== */

var paths = {
  srcStylesCss: '_assets/scss/**/*.scss',
  destStylesCss: '_assets/css/',
};

// 3. Sass > Css
// ===========================================================

// Compilation scss et génération sourcemaps
gulp.task('make:css', function() {
  return gulp.src(paths.srcStylesCss)
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.destStylesCss))
    ;
});

// css
gulp.task('watch:css', function() {
  console.log(">>>>> compilation continue des fichiers sass");
  return gulp.watch(paths.srcStylesCss,['make:css']);
});

gulp.task('watch',['watch:css']);


// 8. Tâche par défaut
// ===========================================================

// la plupart du temps en cours de dev
// on a juste besoin de surveiller les css et le html
gulp.task('default',['watch']);
