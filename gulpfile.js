var gulp = require('gulp');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var jshint = require('gulp-jshint');

gulp.task('clean', function() {
    return gulp.src('build/', {read:false})
        .pipe(clean());
});

gulp.task('lint', function() {
    return gulp.src('./app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('usemin', ['lint'], function() {
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

gulp.task('default', ['usemin', 'movefiles']);