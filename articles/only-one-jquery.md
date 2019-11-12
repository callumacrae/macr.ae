# Loading only one version of jQuery in Browserify
- 2015-05-04

We had a problem at [Lost My Name] a while back where our bundled JavaScript file included both jQuery 1 and jQuery 2. This would be a problem for most websites due to the overhead from the duplicate code alone, but it was especially a problem for us as we support Internet Explorer 8—loading jQuery 2 broke the site in Internet Explorer. Also, it caused some weirdness where custom events fired from one of the versions of jQuery weren't being picked up by the other version, which was causing some major headaches and frustration.

Basically, loading multiple versions of jQuery isn't a good thing, and it's pretty easy to do.

The root of the problem was that some of our dependencies were loading jQuery 1, and others were loading jQuery 2. Because of the major version change (1.x.x -> 2.x.x), Browserify was putting both versions into our bundled JavaScript. The solution was to go through all our dependencies changing all the required jQuery versions to `^1.11.2` (although in retrospect, I should probably have changed them to `*`). However, if I hadn't had control over all the dependencies, I'd have been stuck with a dependency trying to require jQuery 2.

It turns out that you can use Browserify to make sure that only the version of jQuery you choose is loaded.

```javascript
var browserify = require('browserify');
var bundler = browserify({
	ignore: ['jquery']
});

bundler.require('jquery');
bundler.add('app.js');

// Output file
bundler.bundle().pipe(process.stdoud);
```

That will ignore the versions of jQuery loaded by your dependencies, and load the version of jQuery in the current project directory.

If you want to load jQuery from another directory, `bundle.require()` accepts a file stream. You can use the [resolve] module, which works like `require.resolve()` but allows you to specify a basedir, to find the path of jquery.js:

```javascript
// Replace bundler.require('jquery'); with this:
try {
  var res = resolve.sync('jquery', { basedir: process.cwd() });
  bundler.require(fs.createReadStream(res));
} catch (e) {
  if (e.message.indexOf('Cannot find module') !== -1) {
    console.log('jQuery couldn\'t be loaded, but that\'s okay');
  } else {
    throw e;
  }
}
```

In addition, the code above won't die if jQuery cannot be found—this can be great if you're writing generic code for a build tool to be used in multiple projects (like we did!). Just take the second and third lines if you don't want the error checking.

----

tl;dr: If multiple dependencies try to load different sufficiently different versions of jQuery (e.g. "foo" depends on 1.11.2 and "bar" depends on 2.1.3), you can use Browserify to make sure that 




[Lost My Name]: http://making.lostmy.name/
[resolve]: https://github.com/substack/node-resolve
