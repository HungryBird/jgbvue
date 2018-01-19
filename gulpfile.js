const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');
const express = require('gulp-express');
const gls = require('gulp-live-server');
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
const cssbase64 = require('gulp-base64');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;

/**
 * sass编译
 */

gulp.task('sass',()=> {
	return gulp.src('./src/assets/sass/**.scss')
	.pipe(plumber())
	.pipe(autoprefixer('last 3 version'))
	.pipe(sass().on('error', (err)=> {
		console.log('sass err:', err);
	}))
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(cssnano())
	.pipe(rename((path)=> {
		path.basename += ".min"
	}))
	.pipe(cssbase64())
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(livereload())
});

/**
 * css文件
 */

gulp.task('css', ()=> {
	return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
	.pipe(plumber())
	.pipe(autoprefixer('last 6 version'))
	.pipe(cssbase64())
	.pipe(cssnano())
	.pipe(rename((path)=> {
		path.basename += ".min"
	}))
	.pipe(gulp.dest('dist/assets/css'))
	.pipe(livereload())
});

/**
 * html文件编译
 */

gulp.task('html', ()=> {
	return gulp.src(['src/**.html', 'src/**/*.html'])
	/*.pipe(plumber())
	.pipe(fileInclude({
		prefix: '@@',
		baspath: '@file'
	}))*/
	.pipe(gulp.dest('dist'))
	.pipe(livereload())
});


/**
 * js
 */

gulp.task('js', (path)=> {
	return gulp.src(['src/assets/js/**/*.js', 'src/assets/js/*.js'])
	.pipe(plumber())
	.pipe(babel({
		presets: ['env']
	}))
	.pipe(gulp.dest('./dist/assets/js'))
	.pipe(uglify())
	.pipe(rename((path)=> {
		path.basename += '.min'
	}))
	.pipe(gulp.dest('dist/assets/js'))
	.pipe(livereload())
});

/**
 * watch
 */

gulp.task('watch', ()=> {
	livereload.listen({start: true});
	gulp.watch('src/**.html', ['html']);
	gulp.watch('src/views/**.html', ['html']);
	gulp.watch('src/assets/css/**.css', ['css']);
	gulp.watch('src/assets/css/**/**.css', ['css']);
	gulp.watch('src/assets/js/**.js', ['js']);
	gulp.watch('src/assets/js/**/**.js', ['js']);
	// gulp.watch('src/**/*.*',(file)=> {
 //        livereload.changed(file.path);
 //    });
 	gulp.watch(['./**.*','./dist/**/*']).on('change', reload);
});

/**
 * server
 */

gulp.task('server', ['nodemon', 'sass', 'js', 'css', 'html', 'watch'], ()=> {
	// let server = gls.new('server.js');
	// server.start();

	// gulp.watch(['src/**.html', 'src/views/**.html', 'src/assets/css/**.css', 'src/assets/css/**/**.css', 'src/assets/js/**.js', 'src/assets/js/**/**.js'], (file)=> {
	// 	server.notify.apply(server, [file]);
 //    });

    //gulp.watch('server.js', server.start.bind(server));
})

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

gulp.task('default', ['server']);

