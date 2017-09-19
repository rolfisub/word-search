/**
 * @author Rolf Bansbach
 */

var gulp = require('gulp');
var config =  require('./gulp.config.js');
var concat = require('gulp-concat');
var order = require('gulp-order');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

gulp.task('scripts', function(){
    return gulp.src(config.source.scripts)
            .pipe(order(config.source.scripts))
            .pipe(concat(config.build.appFile))
            .pipe(gulp.dest(config.build.scriptsDest));
});

gulp.task('styles', function(){
    return gulp.src(config.source.styles)
            .pipe(concat(config.build.stylesFile))
            .pipe(sass())
            .pipe(gulp.dest(config.build.stylesDest));
});

gulp.task('watch', function(){
    console.log('Starting to watch...');
    gulp.watch(config.source.scripts, ['scripts']);
    gulp.watch(config.source.styles, ['styles']);
});

gulp.task('default',['scripts', 'styles']);
