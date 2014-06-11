// Build GeoDash.js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , less = require('gulp-less')

gulp.task('less', function () {
  gulp.src('src/style/chart.less')
    .pipe(less({
      paths: ['src/style']
    }))
    .pipe(rename('geodash.min.css'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('minify', function(){
  gulp.src(['src/core/*.js', 'src/charts/Chart.js', 'src/charts/BarChart.js', 'src/charts/*.js'])
    .pipe(concat('geodash.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('geodash.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
    .on('end', gulpconcat)
})

var gulpconcat = function(){

  gulp.src([
    'src/GeoDash.js'
    , 'src/lib/d3.v3.min.js'
    , 'src/lib/mustache.js'
    , 'dist/geodash.min.js'
    ])
    .pipe(concat('geodash.min.js'))
    .pipe(gulp.dest('dist/'))

  gulp.src([
    'src/GeoDash.js'
    , 'src/lib/aight.min.js'
    , 'src/lib/r2d3.min.js'
    , 'src/lib/aight.d3.min.js'
    , 'src/lib/mustache.js'
    , 'dist/geodash.min.js'
    ])
    .pipe(concat('geodash.ie8.min.js'))
    .pipe(gulp.dest('dist/'))

  gulp.src([
    'src/GeoDash.js'
    , 'src/lib/d3.v3.min.js'
    , 'src/lib/mustache.js'
    , 'dist/geodash.js'
    ])
    .pipe(concat('geodash.js'))
    .pipe(gulp.dest('dist/'))

  gulp.src([
    'src/GeoDash.js'
    , 'src/lib/aight.min.js'
    , 'src/lib/r2d3.js'
    , 'src/lib/aight.d3.min.js'
    , 'src/lib/mustache.js'
    , 'dist/geodash.js'
    ])
    .pipe(concat('geodash.ie8.js'))
    .pipe(gulp.dest('dist/'))
}

gulp.task('default', function() {
  gulp.run('minify')
  gulp.run('less')

  gulp.watch(['src/**/*.js'], function(event) {
    gulp.run('minify')
  })

  gulp.watch(['src/style/*.less'], function(event) {
    gulp.run('less')
  })
})