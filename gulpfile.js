var gulp = require('gulp');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('clean', function() {
    return gulp.src('build/', {read:false})
        .pipe(clean());
});

gulp.task('usemin', function() {    
    return gulp.src('./app/*.html')
        .pipe(usemin({
            css: [minifyCss()],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('movefiles', function() {
    gulp.src('./app/icons/*.png')
        .pipe(gulp.dest('build/icons'));
});

gulp.task('moveGif', function() {
    gulp.src('./app/*.gif')
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['usemin', 'movefiles', 'moveGif']);