'use strict';
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const browserSync  = require('browser-sync').create();
const reload       = browserSync.reload;
const babel        = require('gulp-babel');
const rename       = require('gulp-rename');
const yargs        = require('yargs')
const argv         = yargs.alias('n', 'name').alias('p', 'port').argv;

function scss () {
    return gulp.src('./components/**/src/*.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true,
            remove: true
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.')) 
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace('src', 'dist')
        }))
        .pipe(gulp.dest('./components'))
}

function babel_env () {
    return gulp.src('./components/**/src/*.js')
               .pipe(sourcemaps.init())
               .pipe(babel({
                  presets: [
                      [
                        "env",
                        {
                          "targets": {
                            "browsers": ["last 5 versions", "ie >= 8"]
                          }
                        }
                      ],
                      "babel-preset-stage-2"
                  ],
                  plugins: [
                      'transform-runtime'
                  ]
               }))
               .pipe(sourcemaps.write('.')) 
               .pipe(rename(function (path) {
                   path.dirname = path.dirname.replace('src', 'dist')
               }))
               .pipe(gulp.dest('./components'))
            
}

// 编译sass
gulp.task(scss);

// 编译babel
gulp.task(babel_env)

// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        port: argv.port || '3000',
        server: {
            baseDir: './components/' + argv.name
        },
    });
    gulp.watch('./components/**/src/*.scss', scss);
    gulp.watch('./components/**/src/*.js', babel_env);
    gulp.watch(['./components/**/*.html','./components/**/src/.js','./components/**/src/*.scss']).on('change', reload);
});

// 开始
gulp.task('default', gulp.series('scss', 'babel_env', 'serve'));