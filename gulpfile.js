const path      = require('path');
const del       = require('del');
const gulp      = require('gulp4');
const $         = require('gulp-load-plugins')();
const header    = `
                      ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️
    This file is in the dist/ folder, which is generated via gulp.
    Changes here will be lost on the next build! Please be careful.
                      ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️`;


gulp.task('clean', () => del(path.join(__dirname, 'dist')));

gulp.task('scripts', () => gulp
  .src(path.join(__dirname, 'src', '**', '*.js'))
  .pipe($.babel({presets: ['env']}))
  .pipe($.iife({useStrict: false, params: ['document'], args: ['document']}))
  .pipe($.browserify())
  .pipe($.headerComment(header))
  .pipe(gulp.dest(path.join(__dirname, 'dist')))
  .pipe($.uglify())
  .pipe($.headerComment(header))
  .pipe($.rename({extname: '.min.js'}))
  .pipe(gulp.dest(path.join(__dirname, 'dist'))));

gulp.task('styles', () => gulp
  .src(path.join(__dirname, 'src', '**', '*.less'))
  .pipe($.less())
  .pipe($.headerComment(header))
  .pipe(gulp.dest(path.join(__dirname, 'dist')))
  .pipe($.cleanCss())
  .pipe($.headerComment(header))
  .pipe($.rename({extname: '.min.css'}))
  .pipe(gulp.dest(path.join(__dirname, 'dist'))));

gulp.task('views', () => gulp
  .src(path.join(__dirname, 'src', '**', '*.pug'))
  .pipe($.pug())
  .pipe(gulp.dest(path.join(__dirname, 'dist'))));

gulp.task('test', () => gulp
  .src(path.join(__dirname, 'test', '**', '*.spec.js'), {read: false})
  .pipe($.mocha({reporter: 'list'})));

gulp.task('watch', () => {
  gulp.watch(path.join('src', '**', '*.js'), gulp.task('scripts'));
  gulp.watch(path.join('src', '**', '*.less'), gulp.task('styles'));
  gulp.watch(path.join('src', '**', '*.pug'), gulp.task('views'));
});


gulp.task('source', gulp.parallel('scripts', 'styles', 'views'));
gulp.task('build', gulp.series('clean', 'source'));
gulp.task('default', gulp.series('build', 'test', 'watch'));
