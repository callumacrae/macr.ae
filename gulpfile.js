'use strict';

var fs = require('fs');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var moment = require('moment');
var nunjucks = require('nunjucks');
var stylish = require('jshint-stylish');
var through = require('through2');
var plugins = require('gulp-load-plugins')();

gulp.task('less', function () {
	var minify = false;

	return gulp.src('app/assets/less/style.less')
		.pipe(plugins.plumber())
		.pipe(plugins.less({ compress: true }))
		.pipe(plugins.autoprefixer())
		.pipe(minify ? plugins.minifyCss() : plugins.util.noop())
		.pipe(gulp.dest('app/assets/build'));
});

gulp.task('build', function () {
	// Build HTML from MarkDown and template files
	nunjucks.configure('templates');

	var files = [];

	return gulp.src('articles/*.md')
		.pipe(through.obj(function (file, enc, callback) {
			// Extract article data
			file.articleData = {};
			files.push(file.articleData);

			var lines = file.contents.toString('utf8').split('\n');
			file.articleData.title = lines.splice(0, 1)[0].slice(2);
			file.articleData.date = lines.splice(0, 1)[0].slice(2);

			var date = moment(file.articleData.date, 'D MMMM, YYYY', 'en');
			file.articleData.datetime = date.format('YYYY-MM-DD 00:00');

			file.articleData.slug = file.path.slice(file.base.length, -3);

			file.contents = new Buffer(lines.join('\n'));

			callback(null, file);
		}))
		.pipe(plugins.markdown({
			langPrefix: 'language-'
		}))
		.pipe(through.obj(function (file, enc, callback) {
			file.articleData.body = file.contents.toString('utf8');

			file.contents = new Buffer(nunjucks.render('article.tmpl.html', {
				article: file.articleData,
				root: '..',
				prism: true
			}));

			callback(null, file);
		}))
		.pipe(gulp.dest('app/article'))
		.on('end', function () {
			files.sort(function (a, b) {
				if (a.datetime > b.datetime) {
					return -1;
				}

				if (a.datetime < b.datetime) {
					return 1;
				}

				return 0;
			});

			var out = nunjucks.render('index.tmpl.html', {
				articles: files,
				root: '.',
				prism: false
			});

			fs.writeFile('app/index.html', out);
		});
});

gulp.task('lesslint', function () {
	var options = {
		strictPropertyOrder: false
	};

	return gulp.src(['app/assets/css/*.css', 'app/assets/less/*.less'])
		.pipe(plugins.plumber())
		.pipe(plugins.recess(options));
});

gulp.task('jshint', function () {
	return gulp.src(['app/assets/js/*.js', 'gulpfile.js'])
		.pipe(plugins.plumber())
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(stylish));
});

gulp.task('htmllint', function () {
	return gulp.src(['app/**/*.html', '!app/assets/js/**/*.html'])
		.pipe(plugins.plumber())
		.pipe(plugins.w3cjs());
});

gulp.task('lint', gulp.parallel('jshint', 'lesslint', 'htmllint'));

gulp.task('watchers', function () {
	gulp.watch('app/assets/less/**/*.less', gulp.parallel('less'));
	gulp.watch(['articles/*.md', 'templates/*.tmpl.html'], gulp.parallel('build'));

	browserSync.init([
		'app/assets/build/style.css',
		'app/assets/css/**/*.css',
		'app/assets/imgs/**/*.jpg',
		'app/assets/imgs/**/*.png',
		'app/assets/js/**/*.js',
		'app/**/*.php',
		'app/**/*.html'
	], {
		server: {
			baseDir: './app/'
		},
		ghostMode: {
			scroll: true,
			links: true,
			forms: true
		}
	});
});

gulp.task('default', gulp.series('lint', 'build', 'watchers'));
