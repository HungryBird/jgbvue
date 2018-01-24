const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const batch = require('batch');
const express = require('gulp-express');
const gls = require('gulp-live-server');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const path = require('path');
const del = require('del');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const cssnano = require('gulp-cssnano');
const minify = require('gulp-clean-css');
const cssbase64 = require('gulp-base64');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;

/**
 * clean
 */

gulp.task('clean',(cb)=> {
	del(['dist/*'], cb);
});

/**
 * sass编译
 */

gulp.task('sass',()=> {
	return gulp.src('./src/assets/sass/*.scss')
	.pipe(plumber())
	.pipe(autoprefixer('last 3 version'))
	.pipe(sass({
		paths: [ path.join(__dirname, 'sass', 'includes') ]
	}).on('error', (err)=> {
		console.log('sass err:', err);
	}))
	.pipe(gulp.dest('dist/assets/css/common'))
	.pipe(cssbase64())
	.pipe(minify())
	.pipe(gulp.dest('dist/assets/css/common'))
	.pipe(browserSync.stream())
});

/**
 * css文件
 */

gulp.task('css', ()=> {
	return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
	.pipe(plumber())
	.pipe(autoprefixer('last 3 version'))
	.pipe(minify())
	.pipe(cssbase64())
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(browserSync.stream())
});

/**
 * imgs
 */

gulp.task('img', ()=> {
	return gulp.src(['src/assets/img/**/*'])
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest('dist/assets/img'))
})

/**
 * html文件编译
 */

gulp.task('html', ()=> {
	return gulp.src(['src/*.html', 'src/**/*.html'])
	.pipe(plumber())
	.pipe(fileInclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.stream())
});

/**
 * js
 */

gulp.task('vjs', function () {
    return gulp.src('src/assets/js/views/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/js/views'));
});

gulp.task('js', function () {
    return gulp.src('src/assets/js/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream())
});

/**
 * watch
 */

gulp.task('watch', ()=> {
	gulp.watch('src/*.html', ['html']);
	gulp.watch('src/views/*.html', ['html']);
	gulp.watch('src/include/*.html', ['html']);
	gulp.watch('src/assets/js/*.js', ['js']);
	gulp.watch('src/assets/js/views/*.js', ['vjs']);
	gulp.watch('src/assets/css/*.css', ['css']);
	gulp.watch('src/assets/css/**/*.css', ['css']);
	gulp.watch('src/assets/img/**/*', ['img']);
	gulp.watch('src/assets/sass/*.scss', ['sass'])
})

/**
 * browserSync
 */

gulp.task('browserSync', ['nodemon', 'html', 'sass', 'js', 'vjs', 'css', 'img', 'watch'], ()=> {
	let files = [
		'dist/**.html', 
		'dist/views/**.html', 
		'dist/assets/**/*',
		'dist/assets/**/**.*', 
		'dist/assets/**/**/**.*'
	]
	browserSync.init({
		proxy: 'http://localhost:3333',
		port: 7000,
		notify: false
	});
	gulp.watch(files).on('change', reload);
})

/**
 * open express
 */

gulp.task('nodemon', (cb)=> {
	let started = false;
	return nodemon({
		script: 'bin/www'
	}).on('start', ()=> {
		if(!started) {
			cb();
			started = true;
		}
	})
});


/**
 * default
 */

gulp.task('default', ['browserSync']);

