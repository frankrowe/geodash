// Build GeoDash.js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , less = require('gulp-less')

gulp.task('less', function () {
  gulp.src('src/styles/chart.less')
    .pipe(less({
      paths: ['src/styles']
    }))
    .pipe(rename('geodash.min.css'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('minify', function(next){
  gulp.src(['src/lib/ezoop.js', 'src/GeoDash.js', 'src/Chart.js', 'src/charts/*.js'])
    .pipe(concat('geodash.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('geodash.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
    .on('end', next)
})

var gulpconcat = function(){
  gulp.src(['src/lib/*.js', '!src/lib/ezoop.js', 'dist/geodash.min.js'])
    .pipe(concat('geodash.min.js'))
    .pipe(gulp.dest('dist/'))

  gulp.src(['src/lib/*.js', '!src/lib/ezoop.js', 'dist/geodash.js'])
    .pipe(concat('geodash.js'))
    .pipe(gulp.dest('dist/'))
}

gulp.task('default', function() {
  // gulp.run('minify', function() { gulpconcat() })
  // gulp.run('less')

  gulp.watch(['src/GeoDash.js', 'src/Chart.js', 'src/charts/*.js'], function(event) {
    gulp.run('minify', function() { gulpconcat() })
  })

  gulp.watch(['src/styles/*.less'], function(event) {
    gulp.run('less', function() { gulpconcat() })
  })
})