'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    refresh = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    nodeunitRunner = require("gulp-nodeunit-runner");

// var expressServer = require('./server');
// gulp.task('serve_', function() {
//   console.log('Server');
//   expressServer.startServer();
// });

gulp.task('serve', function () {
  nodemon({ script: 'main.js', ext: 'json js', ignore: ['public/*', 'client/*'] })
  .on('change', ['lint'])
  .on('restart', function () {
    console.log('Restarted webserver')
  });
});

gulp.task('dev', ['views', 'styles', 'lint', 'test', 'browserify', 'watch'], function() {});

gulp.task('lint', function() {
  gulp.src(['lib/**/*.js','server/**/*.js', 'client/scripts/**/*.js', 'main.js', 'test/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  gulp.src('client/styles/*.scss')
  .pipe(sass({onError: function(e) { console.log(e); } }))
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  .pipe(gulp.dest('public/css/'));
});

gulp.task('browserify', function() {
  var bundleStream = browserify({
    entries: ['./client/scripts/main.js'],
    debug: true
  }).bundle().pipe(source('core.js'));
  return bundleStream.pipe(gulp.dest('./public/js'));
});

gulp.task('views', function() {
    gulp.src('client/*.*')
    .pipe(gulp.dest('public/'));

    gulp.src('client/styles/*.css')
    .pipe(gulp.dest('public/css/'));
    
    gulp.src('client/views/**/*')
    .pipe(gulp.dest('public/views/'));
});

gulp.task('test', ['lint'], function() {
  gulp.src('test/**/*_test.js')
  .pipe(nodeunitRunner());
});

gulp.task('watch', ['serve', 'lint'], function() {
  // Start live reload server
  refresh.listen();

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['client/scripts/*.js', 'client/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);

  // Watch our sass files
  gulp.watch(['client/styles/**/*.scss'], [
    'styles'
  ]);

  // Watch view files
  gulp.watch(['client/**/*.html'], [
    'views'
  ]);

  gulp.watch('./public/**').on('change', refresh.changed);

});

gulp.task('default', ['dev']);
