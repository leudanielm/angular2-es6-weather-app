const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    scope: ['dependencies'],
    lazy: true
});
const browserSync = require('browser-sync');
const process = require('process');

const JS_FILES = ['src/**/*.js'];
const CSS_FILES = ['src/**/*.scss'];
const HTML_FILES = ['src/**/*.html'];
const ASSET_FILES = ['src/assets/**/*'];

const TARGET = 'dist';
const TERGET_VENDOR_FILES = [TARGET, '/vendors'].join('');
const TARGET_ASSETS = [TARGET, '/assets'].join('');

const conf = require('./src/middleware/conf')();

// Vendor scripts, the order matters.
const VENDOR_FILES = [
    'systemjs/dist/system-polyfills.js',
    'angular2/bundles/angular2-polyfills.js',
    'systemjs/dist/system.src.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/http.dev.js',
    'angular2/bundles/router.dev.js'
].map((file) => 'node_modules/' + file);

const VENDOR_FILES_UNCHANGED = [
    'slideout/dist/slideout.js',
    'lodash/lodash.js'
].map((file) => 'node_modules/' + file);

gulp.task('app-html', () => {
    return gulp.src(HTML_FILES)
        .pipe(gulp.dest(TARGET));
});

gulp.task('app-assets', () => {
    return gulp.src(ASSET_FILES)
      .pipe(gulp.dest(TARGET_ASSETS));
});

gulp.task('vendor-js', () => {
    return gulp.src(VENDOR_FILES)
        .pipe($.concatUtil('vendor.js'))
        .pipe(gulp.dest(TERGET_VENDOR_FILES));
});

gulp.task('vendor-unchanged-js', () => {
    return gulp.src(VENDOR_FILES_UNCHANGED)
      .pipe(gulp.dest(TERGET_VENDOR_FILES));
});

gulp.task('app-js', () => {
    return gulp.src(JS_FILES)
        .pipe($.babel())
        .pipe(gulp.dest(TARGET));
});

gulp.task('app-css', () => {
    return gulp.src(CSS_FILES)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(TARGET));
});

gulp.task('app-index', () => {
    return gulp.src('index.html')
        .pipe(gulp.dest(TARGET));
});

gulp.task('eslint-app-js', () => {
  return gulp.src(JS_FILES)
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('browser-sync', () => {

    var proxy = {
        target: `localhost:${conf.port}`
    };

    return browserSync({
        proxy: proxy,
        notify: false, // Do not show the the notification
        open: false, // don't automatically open browser
        ghostMode: false // don't make it mirror all actions accross browsers (click/forms/scroll)
    });
});

gulp.task('watch', ['browser-sync'], () => {
    gulp.watch(JS_FILES, ['app-js', browserSync.reload]);
    gulp.watch(CSS_FILES, ['app-css', browserSync.reload]);
    gulp.watch(HTML_FILES, ['app-html', browserSync.reload]);
    gulp.watch(JS_FILES, ['eslint-app-js', browserSync.reload]);
});

gulp.task('default', $.sequence('eslint-app-js', 'app-html', 'app-assets', 'vendor-js', 'vendor-unchanged-js', 'app-js', 'app-css'));
