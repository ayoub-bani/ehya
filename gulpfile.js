const gulp = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require("node-sass"));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');


// Html Task
gulp.task('minify', () => {
    return gulp.src('src/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
  });

// CSS Task
gulp.task('concat-css', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(replace('../../../images', '../img'))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
})

// Javascript Task
gulp.task('concat-js', function () {
    return gulp.src(['./node_modules/@popperjs/core/dist/umd/popper.min.js', './node_modules/bootstrap/dist/js/bootstrap.min.js', 'src/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(terser())
        .pipe(gulp.dest('dist/js'))
})
// Image task
gulp.task('img', function () {
    return gulp.src('src/images/*.*')
        // .pipe(image())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
})

// watch Tasks
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    })
    gulp.watch('src/sass/**/*.scss', gulp.series('concat-css'));
    gulp.watch('src/js/*.js', gulp.series('concat-js'));
    gulp.watch('src/images/*.*', gulp.series('img'));
    gulp.watch('src/*.html', gulp.series('minify'));
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    gulp.watch('dist/js/*.js').on('change', browserSync.reload);
});

// Default Gulp task
gulp.task('default', gulp.series('watch'));
