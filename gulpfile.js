var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'), //Склеивает js
	uglify       = require('gulp-uglify'), //Сжимает js
	cssnano      = require('gulp-cssnano'), //Сжимает css
	rename       = require('gulp-rename'), //Переимнговывает css в .min
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	notify        = require('gulp-notify'), //Показывает ошибки
	autoprefixer = require('gulp-autoprefixer'); 

// Tasks 

gulp.task('sass', function(){
	return  gulp.src('app/sass/**/*.sass')
			.pipe(sass().on('error', notify.onError({
				message:"<%= error.message%>",
				title:"Sass Error!"
			})))
			.pipe(autoprefixer(['last 15 version','>1%','ie 8', 'ie 7'],{cascade:true}))
			.pipe(gulp.dest('app/css'))
			.pipe(browserSync.reload({stream:true}))
});

gulp.task('css-libs', ['sass'],function(){
	return  gulp.src('app/css/libs.css')
			.pipe(cssnano())
			.pipe(rename({suffix:'.min'}))
			.pipe(gulp.dest('app/css'));
});

gulp.task('scripts',function(){
	return gulp.src([
			'app/libs/**/*.js'])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify:false
	});	
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img',function(){
	return gulp.src('app/img/**/*')
	.pipe(cache (imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins:[{removeViewBox:false}],
		une:[pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('default',['browser-sync','css-libs','scripts'],function(){
	gulp.watch('app/sass/**/*.sass',['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Таск для прода!
gulp.task('build',['clean','img','sass','scripts'],function(){
	var buildCss = gulp.src([
			'app/css/main.css',
			'app/css/libs.min.css'
		])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src( 'app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src( 'app/js/**/*.js')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src( 'app/*.html')
		.pipe(gulp.dest('dist'));
});














