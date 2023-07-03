import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browser from 'browser-sync';
import browserify from 'browserify';
import esmify from 'esmify';
import gulpSass from 'gulp-sass';
import nodeSass from 'sass';
import insert from 'gulp-insert';
import formatHTML from 'gulp-format-html';
import replace from 'gulp-string-replace';
import fileinclude from 'gulp-file-include';

const sass = gulpSass(nodeSass);
const mode = require('gulp-mode')();
const $ = plugins();

// Paths
const paths = {
  src: {
    root: 'src/',
    templates: 'src/templates/*.html',
    includes: 'src/templates/includes',
    styles: 'src/scss/app.scss',
    scripts: 'src/js/app.js',
  },
  dist: {
    root: 'dist/',
    templates: 'dist/',
    styles: 'dist/css/',
    scripts: 'dist/js/',
  },
  public: {
    root: 'public/',
    templates: 'public/',
    styles: 'public/css/',
    scripts: 'public/js/',
  },
  watch: {
    templates: 'src/**/*.html',
    styles: 'src/scss/**/*.scss',
    scripts: 'src/js/**/*.js',
  },
};

const processMode = (process.env.PROCESS_MODE = mode.production()
  ? 'production'
  : 'development');
process.env.PROCESS_TIME = new Date().toLocaleString();
process.env.PROCESS_TIMESTAMP = Date.now();

// Delete dist or public folder
function clean(done) {
  if (processMode === 'production') {
    rimraf('public', done);
  } else {
    rimraf('dist', done);
  }
}

// SVG-sprite

// Templates
function templates() {
  return processMode === 'production'
    ? gulp
      .src(paths.src.templates)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: paths.src.includes
      }))
      .pipe(replace('style.css', 'style.min.css'))
      .pipe(replace('bundle.js', 'bundle.min.js'))
      .pipe(formatHTML())
      .pipe(gulp.dest(paths.public.templates))
    : gulp
      .src(paths.src.templates)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: paths.src.includes
      }))
      .pipe(formatHTML())
      .pipe(gulp.dest(paths.dist.templates));
}

// Styles
function styles() {
  return processMode === 'production'
    ? gulp
      .src(paths.src.styles)
      .pipe($.plumber())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe($.rename('style.min.css'))
      .pipe($.autoprefixer())
      .pipe(gulp.dest(paths.public.styles))
    : gulp
      .src(paths.src.styles)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe($.rename('style.css'))
      .pipe($.autoprefixer())
      .pipe($.sourcemaps.write('./'))
      .pipe(insert.prepend(`/* Built at: ${process.env.PROCESS_TIME} */\n\n`))
      .pipe(gulp.dest(paths.dist.styles));
}

// Scripts
function scripts() {
  return processMode === 'development'
    ? browserify({
      entries: [paths.src.scripts],
      debug: true,
      plugin: [[esmify]],
    })
      .bundle()
      .pipe($.plumber())
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('./'))
      .pipe(insert.prepend(`/* Built at: ${process.env.PROCESS_TIME} */\n\n`))
      .pipe(gulp.dest(paths.dist.scripts))
    : browserify({
      entries: [paths.src.scripts],
      debug: true,
      plugin: [[esmify]],
    })
      .transform('babelify', {
        presets: ['@babel/preset-env'],
        ignore: ['//node_modules//'],
      })
      .bundle()
      .pipe($.plumber())
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe($.terser())
      .pipe(gulp.dest(paths.public.scripts));
}

// Start a server with livereload
function server(done) {
  browser.init({
    server: 'dist',
  });
  done();
}

// Watch for file changes
function watch() {
  gulp
    .watch(paths.watch.templates)
    .on('all', gulp.series(templates, browser.reload));
  gulp.watch(paths.watch.styles).on('all', gulp.series(styles, browser.reload));
  gulp
    .watch(paths.watch.scripts)
    .on('all', gulp.series(scripts, browser.reload));
}

// Gulp-tasks
gulp.task(
  'build',
  gulp.series(clean, styles, scripts, templates)
);
gulp.task(
  'default',
  gulp.series(
    clean,
    styles,
    scripts,
    templates,
    server,
    watch
  )
);
