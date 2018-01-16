const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//const nodemon = require('nodemon');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const path = require('path');
const del = require('del');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const cssnano = require('gulp-cssnano');
const cssbase64 = require('gulp-base64');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;

/**
 * sass编译
 */

gulp.task('sass',()=> {
	return gulp.src(['./src/assets/sass/**/*.scss', './src/assets/sass.scss'])
	.pipe(plumber())
	/*.pipe(autoprefixer('last 6 version'))
	.pipe(sass().on('error', (err)=> {
		console.log('sass err:', err);
	}))
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(cssnano())
	.pipe(rename((path)=> {
		path.basename += ".min"
	}))
	.pipe(cssbase64())*/
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(browserSync.stream())
});

/**
 * css文件
 */

gulp.task('css', ()=> {
	return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
	/*.pipe(plumber())
	.pipe(autoprefixer('last 6 version'))
	.pipe(cssbase64())
	.pipe(cssnano())
	.pipe(rename((path)=> {
		path.basename += ".min"
	}))*/
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(browserSync.stream())
});

/**
 * html文件编译
 */

gulp.task('html', ()=> {
	return gulp.src(['src/*.html', 'src/views/*.html'])
	/*.pipe(plumber())
	.pipe(fileInclude({
		prefix: '@@',
		baspath: '@file'
	}))*/
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.stream())
});

/**
 * js
 */

gulp.task('js', (path)=> {
	return gulp.src(['src/assets/js/**/*.js', 'src/assets/js/*.js'])
	/*.pipe(plumber())
	.pipe(babel({
		presets: ['env']
	}))*/
	.pipe(gulp.dest('./dist/assets/js'))
	/*.pipe(uglify())
	.pipe(rename((path)=> {
		path.basename += '.min'
	}))
	.pipe(gulp.dest('dist/assets/js'))*/
	.pipe(browserSync.stream())
});

/**
 * server
 * port 7000 proxy express port 3001
 */

gulp.task('browserSync', ['nodemon'], ()=> {
	let files = [
		'src/**.html', 
		'src/views/**.html', 
		'src/assets/**/**.*', 
		'src/assets/**/**/**.*'
	]
	browserSync.init(files, {
		proxy: 'http://localhost:3001',
		notify: false,
		port: 7000
	});

	gulp.watch(files).on('change', reload);
});

/**
 * open express server
 */

gulp.task('nodemon', (cb)=> {
	let started = false;
	return nodemon({
		script: 'server.js'
	}).on('start', ()=> {
		if(!started) {
			cb();
			started = true;
		}
	})
});

/**
 * build打包
 */
gulp.task('build', ['html', 'css', 'sass', 'js'], ()=> {
	//pass
});


/**
 * default
 */

gulp.task('default', ['browserSync']);

