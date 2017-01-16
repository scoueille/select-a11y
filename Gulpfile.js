// //////////////////////////////////////// //
//
//    compiler sass     :   gulp make:css
//    watch html et css :   gulp
//
// //////////////////////////////////////// //


//  Installation de sass et prérequis
// ======================================== */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var opn = require('opn');
var gulpLivereload = require('gulp-livereload');
var serveStatic = require('serve-static');

// variables de chemins
// ======================================== */
var config = {
    paths: {
        srcStylesCss: '_assets/scss/**/*.scss',
        destStylesCss: '_assets/css/'
    },

    // this is your local directory to become served as root,
    // e.g. `localhost:8080` should point to show `index.html` in that directory
    rootDir: __dirname,

    // any port to use for your local server
    servingPort: 8080,

    // the files you want to watch for changes for live reload
    // replace by any glob pattern matching your files
    filesToWatch: ['lib/**/*.js', 'spec/**/*.js', '!Gulpfile.js', '!config.js']
};

// 1. Sass > Css
// ===========================================================

// Compilation scss et génération sourcemaps
gulp.task('make:css', function () {
    return gulp.src(config.paths.srcStylesCss)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.paths.destStylesCss))
        ;
});

// css
gulp.task('watch:css', function () {
    console.log(">>>>> compilation continue des fichiers sass");
    return gulp.watch(config.paths.srcStylesCss, ['make:css']);
});

gulp.task('watch', ['watch:css']);

gulp.task('watch:test', ['connect'], function () {
    gulpLivereload.listen();

    gulp.watch(config.filesToWatch, function(file) {
        gulp.src(file.path)
            .pipe(gulpLivereload());
    });
});

// `gulp serve` task loading the URL in your browser
gulp.task('serve:test', ['watch:test'], function () {
    opn('http://localhost:' + config.servingPort + '/spec/SpecRunner.html', {app: 'google chrome'});
});

// `gulp connect` task starting your server
gulp.task('connect', function(){
    connect()
    // inject JavaScript into our page with `index.html` to listen for change notifications:
    //   <script src="//localhost:35729/livereload.js?snipver=1"></script>
        .use(connectLivereload())
        .use(serveStatic(config.rootDir))
        .listen(config.servingPort);
});

// 2. Tâche par défaut
// ===========================================================

// la plupart du temps en cours de dev
// on a juste besoin de surveiller les css et le html
gulp.task('default', ['watch', 'serve:test']);
