'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

function scss () {
    return gulp.src(['./src/**/*.scss', './src/**/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true,
            remove: true
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./')) // 坑点：此路径相对于src
        .pipe(gulp.dest('./src/'))    // 坑点：此路径相对于根目录
}

// 编译sass
gulp.task(scss);

// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
    gulp.watch(['./src/**/*.scss', './src/**/**/*.scss'], scss);
    gulp.watch(["./src/**/*.html","./src/**/*.js",'./src/**/*.scss', './src/**/**/*.scss']).on('change', reload);
});

// 开始
gulp.task('default', gulp.series('scss', 'serve'));