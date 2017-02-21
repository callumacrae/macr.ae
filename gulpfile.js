'use strict';

var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var moment = require('moment');
var nunjucks = require('nunjucks');
var source = require('vinyl-source-stream');
var through = require('through2');
var frontMatter = require('yaml-front-matter');
var plugins = require('gulp-load-plugins')();

var minify = process.env.MINIFY || false;

gulp.task('less', function () {
	return gulp.src(['app/assets/less/style.less', 'app/assets/less/transform-when.less'])
		.pipe(plugins.plumber())
		.pipe(plugins.less({ compress: minify }))
		.pipe(plugins.autoprefixer())
		.pipe(minify ? plugins.minifyCss() : plugins.util.noop())
		.pipe(gulp.dest('app/assets/build'));
});

gulp.task('js', function () {
	var bundler = browserify({
		entries: './app/assets/js/app.js',
		transform: [babelify]
	});

	return bundler.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(minify ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('app/assets/build'));
});

gulp.task('js-sorting', function () {
	var bundler = browserify({
		entries: './app/assets/js/sorting-article.js',
		transform: [babelify]
	});

	return bundler.bundle()
		.pipe(source('sorting-article.js'))
		.pipe(buffer())
		.pipe(minify ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('app/assets/build'));
});

gulp.task('js-transform-when', function () {
	var bundler = browserify({
		entries: './app/assets/js/transform-when.js',
		transform: [babelify]
	});

	return bundler.bundle()
		.pipe(source('transform-when.js'))
		.pipe(buffer())
		.pipe(minify ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('app/assets/build'));
});

gulp.task('html', function () {
	// Build HTML from MarkDown and template files
	nunjucks.configure('templates');

	var renderer = new plugins.markdown.marked.Renderer();

	renderer.heading = function (text, level) {
		var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

		return `<h${level} id="${escapedText}">
				<a class="heading-anchor" href="#${escapedText}"><span>#</span>${text}</a>
			</h${level}>`;
	};

	var files = [];

	return gulp.src('articles/*.md')
		.pipe(through.obj(function (file, enc, callback) {
			// Extract article data
			file.articleData = frontMatter.loadFront(file.contents.toString());
			files.push(file.articleData);

			// Fall back to old behaviour
			if (!file.articleData.title) {
				var lines = file.articleData.__content.split('\n');
				file.articleData.title = lines.splice(0, 1)[0].slice(2);
				file.articleData.date = lines.splice(0, 1)[0].slice(2);

				file.articleData.__content = lines.join('\n');
			}

			var date = moment(file.articleData.date, 'D MMMM, YYYY', 'en');
			file.articleData.datetime = date.format('YYYY-MM-DD 00:00');
			file.articleData.slug = file.path.slice(file.base.length, -3);

			file.contents = new Buffer(file.articleData.__content);

			callback(null, file);
		}))
		.pipe(plugins.markdown({
			langPrefix: 'language-',
			renderer: renderer
		}))
		.pipe(through.obj(function (file, enc, callback) {
			file.articleData.body = file.contents.toString('utf8');

			file.contents = new Buffer(nunjucks.render('article.tmpl.html', {
				article: file.articleData
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
				articles: files
			});

			fs.writeFile('app/index.html', out);
		});
});

gulp.task('all-js', gulp.parallel('js', 'js-sorting', 'js-transform-when'));
gulp.task('default', gulp.series('html', 'all-js', 'less'));

if (process.argv.indexOf('--watch') !== -1) {
	gulp.watch('app/assets/less/**/*.less', gulp.parallel('less'));
	gulp.watch('app/assets/js/**/*.js', gulp.parallel('all-js'));
	gulp.watch(['articles/*.md', 'templates/*.tmpl.html'], gulp.parallel('html'));

	browserSync.init([
		'app/assets/build/*.{js,css}',
		'app/assets/imgs/**/*.jpg',
		'app/assets/imgs/**/*.png',
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
}