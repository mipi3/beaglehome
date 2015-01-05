'use strict';

var gulp = require('gulp')
    , jshint = require('gulp-jshint')
    , source = require('vinyl-source-stream')
    , browserify = require('browserify')
    , concat = require('gulp-concat')
    , sass = require('gulp-sass')
    , autoprefixer = require('gulp-autoprefixer')
    , refresh = require('gulp-livereload')
    , nodemon = require('gulp-nodemon')
    , nodeunitRunner = require("gulp-nodeunit-runner")
    , protractor = require('gulp-protractor').protractor;


// var expressServer = require('./server');
// gulp.task('serve_', function() {
//   console.log('Server');
//   expressServer.startServer();
// });

gulp.task('serve', function () {
    nodemon({ script: 'main.js', ext: 'json js', ignore: ['public/*', 'client/*'] })
        .on('change', ['server:lint'])
        .on('restart', function () {
            console.log('Restarted webserver')
        });
});

gulp.task('server:lint', function() {
    gulp.src([
        'lib/**/*.js',
        'server/**/*.js',
        'main.js',
        'test/server/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('server:test', ['server:lint'], function() {
    gulp.src('test/server/*_test.js')
        .pipe(nodeunitRunner());
});

gulp.task('views', function() {

    gulp.src('client/*.*')
        .pipe(gulp.dest('public/'));

    gulp.src('client/views/**/*')
        .pipe(gulp.dest('public/views/'));
});

gulp.task('vendor', function() {

    gulp.src('client/vendor/modernizr/modernizr*.min.js')
        .pipe(gulp.dest('public/js'));

});

gulp.task('styles', function() {

    gulp.src([
        'client/styles/*.css',
        'client/vendor/bootstrap/css/bootstrap.min.css',
        'client/vendor/bootstrap-switch/css/bootstrap3/bootstrap-switch.min.css'
        ])
        .pipe(concat('style.css'))
        .pipe(gulp.dest('public/css/'));
    
    gulp.src('client/styles/*.scss')
        .pipe(sass({onError: function(e) { console.log(e); } }))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('client:lint', function() {
    gulp.src([
        'client/scripts/**/*.js',
        'test/client/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
    gulp.src([
        'client/vendor/jquery/jquery.min.*',
        'client/vendor/bootstrap/js/bootstrap.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'));

    return browserify({
        entries: ['./client/scripts/main.js'],
        debug: true
     }).bundle()
       .pipe(source('main.js'))
       .pipe(gulp.dest('./public/js'));
});

gulp.task('client:test', ['client:lint'], function() {
    gulp.src('test/client/*_test.js')
        .pipe(nodeunitRunner());
});

gulp.task('e2e', ['serve'], function() {
    return gulp.src(['./test/e2e/*_spec.js'])
        .pipe(protractor({
            configFile: 'protractor.conf.js',
        }))
        .on('error', function(e) { console.log(e); })
        .on('end', function() {
            connect.serverClose();
        });
});

gulp.task('client:prepare', ['views', 'styles', 'vendor'], function() {});
gulp.task('client:compile', ['client:lint', 'client:test', 'browserify'], function() {});

gulp.task('watch', ['serve', 'client:lint'], function() {
    refresh.listen();

    gulp.watch([
        'client/scripts/*.js',
        'client/scripts/**/*.js',
        'test/**/*.js'],[
            
        'client:compile',
    ]);

    gulp.watch(['client/styles/**/*.scss'], [
        'styles'
    ]);

    gulp.watch(['client/**/*.html'], [
        'views'
    ]);

    gulp.watch('./public/**').on('change', refresh.changed);
});

gulp.task('dev', ['client:prepare', 'client:compile', 'watch'], function() {});
gulp.task('default', ['dev']);
