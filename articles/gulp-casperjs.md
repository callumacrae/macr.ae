# Running CasperJS tests from gulp
- 26th January, 2014

[CasperJS](http://casperjs.org/) is a navigation scripting and testing utility built on [PhantomJS](http://phantomjs.org/) which allows you to run tests from Node.js as if they were in a browser—so, seeing whether elements exist, checking that the page title is a specified value, and seeing if a form is handled correctly on submission.

[gulp](http://gulpjs.com/) is a build system—like [Grunt](http://gruntjs.com/)—but it is different in that it is built upon streams. This makes it much, much faster than Grunt. The configuration is also very different—it is code, not a big object like it is for Grunt. I much prefer the configuration for gulp, although it is probably trickier to understand at first if you're not used to Node.

CasperJS tests are designed to be ran from the console, by running something like `casperjs test myTests.js`.

Take the following testing.html:

```markup
<!doctype html>
<html lang="en">
<head>
	<title>Test Page</title>
	<meta charset="utf-8">
</head>
<body>
	<h1>Test!</h1>

	<button>Change title</button>

	<script>
		document.querySelector('button').addEventListener('click', function () {
			document.querySelector('h1').innerHTML = 'New title';
		});
	</script>
</body>
</html>
```

And the following myTests.js:

```javascript
casper.test.begin('testing.html contains stuff', 3, function (test) {
	casper.start('testing.html', function () {
		test.assertTitle('Test Page');
		test.assertSelectorHasText('h1', 'Test!');
	});

	casper.then(function () {
		this.click('button');
		test.assertSelectorHasText('h1', 'New title');
	});

	casper.run(function() {
		test.done();
	});
});
```

Running `casperjs test myTests.js` will give us the following output:

![Successful tests](http://i.imgur.com/JLWknKQ.png)

Even though your test files are written in JavaScript using Node.js, you can't actually run them directly through the `node` package. If you're using Grunt, you can use the [grunt-casperjs](https://github.com/ronaldlokers/grunt-casperjs) plugin. There's also [SpookyJS](https://github.com/WaterfallEngineering/SpookyJS) to run CasperJS from Node, but it has a different API and doesn't seem to support Casper's testing functionality yet.

Unlike with Grunt, there is no gulp plugin to run CasperJS tests. I dug into grunt-casperjs and trawled StackOverflow for a bit, and it seems that the best way—although slightly hacky—is to use Node's [child_process](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) functionality to call `casperjs`.

Add the following task to your gulpfile.js:

```javascript
var spawn = require('child_process').spawn,
	gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task('test', function () {
	var tests = ['myTests.js'];

	var casperChild = spawn('casperjs', ['test'].concat(tests));

	casperChild.stdout.on('data', function (data) {
		gutil.log('CasperJS:', data.toString().slice(0, -1)); // Remove \n
	});

	casperChild.on('close', function (code) {
		var success = code === 0; // Will be 1 in the event of failure

		// Do something with success here
	});
});
```

Running `gulp test` will produce the following:

![Successful tests through gulp](http://i.imgur.com/MjciFmM.png)

Easy peasy.
