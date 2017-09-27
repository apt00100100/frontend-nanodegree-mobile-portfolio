'use strict';

// npm modules
var del = require('del');
var runSequence = require('run-sequence');
var psi = require('psi');
var ngrok = require('ngrok');
var browserSync = require('browser-sync');

// gulp modules
var gulp = require('gulp');
var jsMinify = require('gulp-minify');
var cssMinify = require('gulp-clean-css');
var htmlMinify = require('gulp-htmlmin');

// global constants
var portVal = 3020;
var site;

/*********************************************************************************************************************
 * Public tasks: run these from the console eg. gulp start
 *********************************************************************************************************************/

gulp.task('default', function (done) {
    runSequence(
        'psi',
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
 * Test the performance
 *********************************************************************************************************************/

gulp.task('browser-sync-psi', ['build.dist'], function() {
    browserSync({
        port: portVal,
        open: false,
        server: {
            baseDir: 'dist/'
        }
    });
});

gulp.task('ngrok-url', function(cb) {
    return ngrok.connect(portVal, function (err, url) {
        site = url + '/index.html';
        console.log('serving your tunnel from: ' + site);
        cb();
    });
});

gulp.task('psi-desktop', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'desktop'
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

gulp.task('psi-mobile', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'mobile'
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('psi-seq', function (cb) {
    return runSequence(
        'browser-sync-psi',
        'ngrok-url',
        'psi-desktop',
        'psi-mobile',
        cb
    );
});

gulp.task('psi', ['psi-seq'], function() {
    console.log('Check out your page speed scores!');
    process.exit();
});

/*********************************************************************************************************************
 * Private helper methods
 *********************************************************************************************************************/

function cleanDir(dir, done) {
    del(dir).then(function () {
        done();
    });
}