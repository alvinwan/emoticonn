// Taken from tutorial at browsersync.io

var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var minifyCss     = require('gulp-minify-css');
var rename        = require('gulp-rename');
var twig          = require('gulp-twig');
var prettify      = require('gulp-prettify');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var data          = require('gulp-data');
var fs            = require('fs');
var path          = require('path');
var twigMarkdown  = require('twig-markdown');
var jsoncombine   = require("gulp-jsoncombine");

/**
 * Support Functions and Data
 */

var PUBLISHED_DIR = "../published/"

/**
 * Gets data from JSON, depending on file path
 */
function getJsonData(file) {
  return getFile('data/' + path.basename(file.path) + '.json');
}

/**
 * Gets data from a filepath
 */
function getFile(path) {
  return JSON.parse(fs.readFileSync(path));
}

/**
 * Returns list of all values in dictionary.
 */
function values(dictionary) {
  list = [];
  for (var key in dictionary) {
    list.push(dictionary[key]);
  }
  return list;
}

/**
 * Returns slide.text_<size> and defaults to
 * slide.text otherwise.
 */
function getText(slide, attr) {
  if (attr in slide) {
   return slide[attr];
  }
  return slide.text;
}

// Define functions to use in Twig templates
twigFunctions = [
  {
    name: "getText",
    func: getText
  },
  {
    name: "values",
    func: values
  }
];

// Generate twig objects
function twigGenerator() {
  return twig({
    extend: twigMarkdown,
    functions: twigFunctions
  });
}

/**
 * Server, Gulp-specific Functions
 */

// Static Server + watching scss/html files
gulp.task('serve', ['js', 'sass', 'html'], function() {

  browserSync.init({
    server: "./" + PUBLISHED_DIR,
  });

  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("js/**/*.js", ['js']);
  gulp.watch(["html/**/*.html", "data/*.json"], ['html'])
      .on('change', browserSync.reload);
});

// Compile sass into minified CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("scss/*.scss")
    .pipe(sass())
    .pipe(minifyCss({compatibility: 'ie8', keepBreaks: false}))
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest(PUBLISHED_DIR + "emoticonn/css"))
    .pipe(browserSync.stream());
});

// Compile Twig templates to HTML
gulp.task('html', function() {
  return gulp.src('html/*.html')
    .pipe(data(getJsonData))
    .pipe(twigGenerator())
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(PUBLISHED_DIR));
});

// Compile into minified JS & auto-inject into browsers
gulp.task('js', function() {
  return gulp.src("js/**/*.js")
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PUBLISHED_DIR + "js"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
