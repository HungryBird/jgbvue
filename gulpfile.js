const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const path = require('path');
const del = require('del');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const reload = browserSync.reload;

gulp.task('sass',()=> {
	return gulp.src('./src/')
});

gulp.task('clean', (cb)=> {
	del(['dist/css/*', 'dist/js/*', 'dist/img/*'], cb)
});

gulp.task('default', ()=> {
	//
});

gulp.task('scss', ()=> {
	//
});

gulp.task('js', ()=> {
	//
});