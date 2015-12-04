var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    bower = require('gulp-bower');

// --- Paths variables
var paths = {
    'sources': {
        'vendor': './bower_components/',
        'js': './src/js/',
        'sass': './src/sass/'
    },
    'dist': {
        'js': './dist/js/',
        'css': './dist/css/'
    }
};

gulp.task('bower', function() {
  return bower()
});

gulp.task('staades-graph.js', function(){
  return gulp.src([
      paths.sources.js+'staades-core.js',
      paths.sources.js+'staades-graph.js'
    ])
    .pipe(plumber())
    .pipe(concat('staades-graph.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('staades-graph.css', function() {
  return gulp.src(paths.sources.sass+'staades-graph.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: [paths.sources.vendor]
    }))
    .pipe(gulp.dest(paths.dist.css)) // output: frontend.css
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist.css)); // output: frontend.min.css
});


// --- WATCH
gulp.task('watch', function() {
  gulp.watch(paths.sources.js+'*', ['staades-graph.js']);
  gulp.watch(paths.sources.sass+'*', ['staades-graph.css']);
});

// --- DEFAULT
gulp.task('default', [
  'staades-graph.js',
  'staades-graph.css'
]);
