'use strict';

// npm modules
var del = require('del');
var runSequence = require('run-sequence');

// gulp modules
var gulp = require('gulp');
var jsMinify = require('gulp-minify');
var cssMinify = require('gulp-clean-css');
var htmlMinify = require('gulp-htmlmin');

/*********************************************************************************************************************
 * Public tasks: run these from the console eg. gulp start
 *********************************************************************************************************************/

gulp.task('default', function (done) {
    runSequence(
        'build.dist',
        done
    );
});

gulp.task('start', ['build.dist', 'watch.src']);

/*********************************************************************************************************************
 * Build distribution
 *********************************************************************************************************************/

gulp.task('build.dist', function (done) {
    runSequence(
        'clean',
        'minify.js',
        'minify.css',
        'minify.html',
        'copy',
        done
    );
});

gulp.task('clean', function (done) {
    cleanDir('dist', done);
});

gulp.task('minify.js', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(jsMinify({}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify.css', function () {
    return gulp.src(['src/**/*.css'])
        .pipe(cssMinify({}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify.html', function () {
    return gulp.src(['src/**/*.html'])
        .pipe(htmlMinify({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src([
        'src/**/*',
        '!src/**/*.js',
        '!src/**/*.css',
        '!src/**/*.html'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('watch.src', function () {
    gulp.watch([
        'src/**/*.js',
        'src/**/*.css',
        'src/**/*.html'
    ], ['build.dist']);
});

/*********************************************************************************************************************
 * Private helper methods
 *********************************************************************************************************************/

function cleanDir(dir, done) {
    del(dir).then(function () {
        done();
    });
}