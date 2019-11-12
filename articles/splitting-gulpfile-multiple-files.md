# Splitting a gulpfile into multiple files
- 2015-01-20

In some projects, your gulpfile will get big enough that it's worth splitting it into multiple files, with one task per file. There are a couple approaches you can take to achieve this; both are pretty simple.

Here is a fairly simple gulpfile which we will be splitting up in this article. It doesn't do anything fancy, it just deals with our JavaScript and Sass:

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');

gulp.task('scripts', function () {
	gulp.src('src/js/**/*.js')
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dest'));
});

gulp.task('sass', function () {
	gulp.src('src/sass/styles.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('dest'));
});

gulp.task('default', ['scripts', 'sass'], function () {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
});
```

## Approach one

Both tasks involve a task per file. This approach literally involves moving a task to each file and is the approach detailed in the [recipe in the Gulp repository](https://github.com/gulpjs/gulp/blob/master/docs/recipes/split-tasks-across-multiple-files.md):

`gulp-tasks/scripts.js`:

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function () {
	gulp.src('src/js/**/*.js')
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dest'));
});
```

`gulp-tasks/sass.js`:

```javascript
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');

gulp.task('sass', function () {
	gulp.src('src/sass/styles.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('dest'));
});
```

Then you can use the [require-dir](https://www.npmjs.com/package/require-dir) module to include every file in the `gulp-tasks` directory into your gulpfile.

The following is all you would need in your gulpfile:

```javascript
var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./gulp-tasks');

gulp.task('default', ['scripts', 'sass'], function () {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
});
```

You can move the default task out into its own file, but I often prefer not to.

You can shorten the two require-dir lines to a single line, too:

```javascript
require('require-dir')('./gulp-tasks');
```

This approach is good on simple gulpfiles, but if you want to do more complicated things like store your source and destination file paths in an object or use [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins), then this approach would lead to a lot of redundencies.

Enter approach two.

## Approach two

This approach is slightly more complicated, but it removes some redundencies. I also find it makes seeing which tasks rely on other tasks much, much easier. It involves splitting your gulpfile into functions which you will require into tasks which are defined in the gulpfile. Again, this is easier explained by example.

In this example I will be using `gulp-load-plugins` to load the plugins into the `plugins` object.


`gulp-tasks/scripts.js`:

```javascript
module.exports = function (gulp, plugins) {
	return function () {
		gulp.src('src/js/**/*.js')
			.pipe(plugins.concat('scripts.js'))
			.pipe(plugins.uglify())
			.pipe(gulp.dest('dest'));
	};
};
```

`gulp-tasks/sass.js`:

```javascript
module.exports = function (gulp, plugins) {
	return function () {
		gulp.src('src/sass/styles.scss')
			.pipe(plugins.sass())
			.pipe(plugins.autoprefixer())
			.pipe(plugins.minifyCss())
			.pipe(gulp.dest('dest'));
	};
};
```

`gulpfile.js`:

```javascript
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('scripts', require('./gulp-tasks/scripts')(gulp, plugins));
gulp.task('sass', require('./gulp-tasks/sass')(gulp, plugins));

gulp.task('default', ['scripts', 'sass'], function () {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
});
```

The resulting gulpfile isn't as simple, but it's way more powerful. You can also use a function to get the task for you:

```javascript
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task) {
	return require('./gulp-tasks/' + task)(gulp, plugins);
}

gulp.task('scripts', getTask('scripts'));
gulp.task('sass', getTask('sass'));

gulp.task('default', ['scripts', 'sass'], function () {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
});
```

I find that this way of including tasks is also a lot better when you have tasks calling tasks that call other tasks: for example, if you have a `default` task calling a `scripts` task which calls a `lint` task, you will be able to see that straight from the gulpfile, without opening all the task files.

The following is part of the gulpfile in the project I link to at the end of this article. It's really easy to see which tasks run each other!

```javascript
gulp.task('auto-reload', getTask('auto-reload'));
gulp.task('html', getTask('html'));
gulp.task('js', ['js-quality'], getTask('js'));
gulp.task('js-quality', getTask('js-quality'));
gulp.task('scss', getTask('scss'));

gulp.task('build', ['html', 'js', 'scss']);
gulp.task('default', ['build'], getTask('default'));
```

You can find an example of a more complicated gulpfile, including the code above, in the project I've been working on recently, [Lostmyname/monkey](https://github.com/Lostmyname/monkey). [Here](https://github.com/Lostmyname/monkey/blob/master/gulpfile.js) is the gulpfile, and [here](https://github.com/Lostmyname/monkey/tree/master/gulp-tasks) is the directory containing all the tasks. Note that in this project, I've also split out the default task, because in addition to calling `gulp.watch()`, I'm also starting [BrowserSync](http://browsersync.io/) in there as well.
