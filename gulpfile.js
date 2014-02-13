'use strict';

var fs = require('fs'),
	browserSync = require('browser-sync'),
	es = require('event-stream'),
	gulp = require('gulp'),
	moment = require('moment'),
	nunjucks = require('nunjucks'),
	stylish = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')();

var config = {
	lintOnLess: false,
	minify: false,

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
		.pipe(plugins.markdown({
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
	var lessStream = plugins.less({
			compress: true
		});

	lessStream.on('error', function (err) {
		plugins.util.log(plugins.util.colors.red.bold('Parse error:'), err.message);
	});

	var stream = gulp.src('app/assets/less/style.less');

	if (config.lintOnLess) {
		stream = stream.pipe(plugins.recess(config.recessOptions));
	}

	stream = stream.pipe(lessStream)
		.pipe(plugins.autoprefixer());

	if (config.minify) {
		stream = stream.pipe(plugins.minifyCss());
	}

	stream.pipe(gulp.dest('app/assets/build'));
});

gulp.task('lesslint', function () {
	gulp.src(['app/assets/css/*.css', 'app/assets/less/*.less'])
		.pipe(plugins.recess(config.recessOptions));
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
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(stylish))
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
		.pipe(plugins.w3cjs())
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

gulp.task('default', ['lint', 'build', 'browser-sync'], function () {
	gulp.watch('app/assets/less/**/*.less', ['less']);
	gulp.watch(['articles/*.md', 'templates/*.tmpl.html'], ['build']);
});
