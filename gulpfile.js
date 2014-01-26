'use strict';

var fs = require('fs'),

	browserSync = require('browser-sync'),
	es = require('event-stream'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	marked = require('marked'),
	markdown = require('gulp-markdown'),
	moment = require('moment'),
	minifyCSS = require('gulp-minify-css'),
	nunjucks = require('nunjucks'),
	prefix = require('gulp-autoprefixer'),
	recess = require('gulp-recess'),
	stylish = require('jshint-stylish'),
	w3cjs = require('gulp-w3cjs');

var config = {
	lintOnLess: false,
	minify: false, // @todo: Get this from a env var or something

	recessOptions: {
		strictPropertyOrder: false
	}
};


gulp.task('build', function () {
	gulp.run('less');

	// Build HTML from MarkDown and template files
	nunjucks.configure('templates');

	var files = [];

	gulp.src('articles/*.md')
		.pipe(es.map(function (file, callback) {
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
		.pipe(markdown({
			langPrefix: 'language-'
		}))
		.pipe(es.map(function (file, callback) {
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

gulp.task('less', function () {
	var lessStream = less({
			compress: true
		});

	lessStream.on('error', function (err) {
		gutil.log(gutil.colors.red.bold('Parse error:'), err.message);
	});

	var stream = gulp.src('app/assets/less/style.less');

	if (config.lintOnLess) {
		stream = stream.pipe(recess(config.recessOptions));
	}

	stream = stream.pipe(lessStream)
		.pipe(prefix());

	if (config.minify) {
		stream = stream.pipe(minifyCSS());
	}

	stream.pipe(gulp.dest('app/assets/build'));
});

gulp.task('lesslint', function () {
	gulp.src(['app/assets/css/*.css', 'app/assets/less/*.less'])
		.pipe(recess(config.recessOptions));
});

gulp.task('browser-sync', function () {
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

gulp.task('jshint', function (done) {
	var failed = false;

	gulp.src(['app/assets/js/*.js', 'gulpfile.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish))
		.pipe(es.map(function (file, cb) {
			cb(null, file);
			if (!failed) {
				failed = !file.jshint.success;
			}
		}))
		.on('end', function () {
			if (failed) {
				done(new Error('Failed JSHint'));
			} else {
				done();
			}
		});
});

gulp.task('htmllint', function (done) {
	var failed = false;

	gulp.src(['app/**/*.html', '!app/assets/js/**/*.html'])
		.pipe(w3cjs())
		.pipe(es.map(function (file, cb) {
			cb(null, file);
			if (!failed) {
				failed = !file.w3cjs.success;
			}
		}))
		.on('end', function () {
			if (failed) {
				done(new Error('Failed HTMLLint'));
			} else {
				done();
			}
		});
});

gulp.task('lint', ['jshint', 'lesslint', 'htmllint']);

gulp.task('default', ['lint'], function () {
	gulp.run('build', 'browser-sync');

	gulp.watch('app/assets/less/**/*.less', function () {
		gulp.run('less');
	});

	gulp.watch(['articles/*.md', 'templates/*.tmpl.html'], function () {
		gulp.run('build');
	});
});
