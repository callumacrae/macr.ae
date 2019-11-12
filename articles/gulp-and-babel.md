# Using gulp with Babel
- 2015-11-04

[Babel] is a JavaScript compiler which can be used to transpile ECMAScript 6, the next version of JavaScript adding some additional features and syntax, into ECMAScript 5, meaning that you can use JavaScript features currently not supported in some engines—for example, classes and fat arrow functions—in those engines. In this article, I'll be explaining how you can use Babel with gulp.

"Using Babel with gulp" could mean one of two things: either using Babel to write your gulpfile using ES6 syntax, or using gulp to run babel to turn your website's JavaScript using ECMAScript 6 into JavaScript a browser will understand. I will explain both!

## Using ECMAScript 6 to write your gulpfile

Gulp 3.9 added support for transpilers such as Babel so that you can use ES6 when writing your gulpfile—for example, to be able to use fat arrow functions when using Node 0.12. First, you need to install the `babel` package using npm in the project gulp is installed into. Then, you need to name your gulpfile `gulpfile.babel.js`, which tells gulp to look for babel.

Set up the es2015 preset (as of Babel 6.0, there are no plugins included by default) in `.babelrc` after installing it using `npm install babel-preset-es2015`:

```javascript
{
  "presets": ["es2015"]
}
```

(these instructions are taken from [the Babel website][es2015])

Then, you can use ES6 in your gulpfile. For example:

```javascript
import gulp from 'gulp';

gulp.task('default', () => console.log('Default task called'));
```

That was simple. You can then call `gulp` normally and it will run as expected.

If you want to specify options to babel, it's best to use `.babelrc`. Failing that (for example, if you want to specify a function as one of the options), you can't use the method I just outlined. Instead, create a file called gulpfile.js containing the following:

```javascript
require('babel/register')({
  nonStandard: process.env.ALLOW_JSX
});

require('./gulpfile.babel.js');
```

Then use gulpfile.babel.js as highlighted above.

## Building ES6 files using Gulp

To just compile ES6 into ES5 with babel is pretty simple. Use the [gulp-babel] plugin as follows:

```javascript
var gulp = require('gulp');
var babel = require('gulp-babel');
 
gulp.task('default', function () {
    return gulp.src('src/app.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});
```

The output will be the babelified code which will work in browsers that don't yet support all the features of ES6. Once the gulp-babel plugin has been called, you can call plugins like uglify as you normally would with gulp.

The gulp-babel plugin supports [gulp-sourcemaps] for easy browser debugging.

Pretty much the only feature this approach doesn't enable is ES6 modules. For that, I recommend using browserify in addition to gulp and babel.


### Calling Babel in gulp with Browserify

_(it took me a while to look up the correct casing for all those library names)_

If you want to use ES6 modules, which give you the ability to `import` other files from your project, you can use [Browserify] with babel to do this.

Browserify, if you haven't heard of it, allows you to use Node.js-style requires in your browser code:

```javascript
var $ = require('jquery');

$('body').css('background-color', 'orange');
```

Browserify supports "transforms", which are effectively plugins—just like there are gulp plugins to do different things with files in gulp, there are a number of Browserify transforms which allow you to do anything from support environmental variables from the machine the script was compiled on, or compile [React]'s JSX files.

One of these transforms is called [babelify], which adds babel support to Browserify. In addition to just allowing you to use ES6 and use `require()`, it also transpiles `import` statements into `require()` statements, allowing you to use ES6 modules in your code:

```javascript
import $ from 'jquery';

$('body').css('background-color', 'red');
```

You can use Browserify and babelify together using the following code:

```javascript
var fs = require('fs');
var babelify = require('babelify');
var browserify = require('browserify');

var bundler = browserify('src/app.js');
bundler.transform(babelify);

bundler.bundle()
	.on('error', function (err) { console.error(err); })
	.pipe(fs.createWriteStream('bundle.js'));
```

The `bundler.bundle()` function returns a readable stream containing the processed code. We can use vinyl-source-stream and vinyl-buffer to convert this into something we can pipe to other gulp plugins and `gulp.dest()`: although the previous code does work completely fine, it's best practice to avoid using the fs module in your gulpfile.

In a gulpfile, the previous code could look like this:	

```javascript
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
	var bundler = browserify('src/app.js');
	bundler.transform(babelify);

	bundler.bundle()
		.on('error', function (err) { console.error(err); })
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify()) // Use any gulp plugins you want now
		.pipe(gulp.dest('dist'));
});
```

Finally—bonus round!—the following code adds support for source maps.

```javascript
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
	var bundler = browserify({
		entries: 'src/app.js',
		debug: true
	});
	bundler.transform(babelify);

	bundler.bundle()
		.on('error', function (err) { console.error(err); })
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify()) // Use any gulp plugins you want now
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});
```

Nice. _(It's pretty long. Maybe worth [splitting into a seperate file?])_

---

You should now know how to use ES6 in your gulp file—by installing `babel` and renaming your file to `gulpfile.babel.js`—and how to transpile ES6 code to ES5 using gulp, either using [gulp-babel] or [babelify] with Browserify.

If you get any weird errors at any point after updating to Babel 6, make sure you [use the es2015 preset!][es2015]


[Babel]: http://babeljs.io/
[gulp-babel]: https://www.npmjs.com/package/gulp-babel
[gulp-sourcemaps]: https://www.npmjs.com/package/gulp-sourcemaps
[Browserify]: http://browserify.org
[React]: https://facebook.github.io/react/
[babelify]: https://github.com/babel/babelify
[splitting into a seperate file?]: http://macr.ae/article/splitting-gulpfile-multiple-files.html
[es2015]: https://babeljs.io/docs/plugins/preset-es2015/
