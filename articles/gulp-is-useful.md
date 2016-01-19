# Gulp is an unnecessary abstraction? Not always.
- 19th January, 2016

An article entitled [Why I Left Gulp and Grunt for npm Scripts] has been doing the rounds on Twitter over the last couple days, and I figured I'd share my thoughts about why I disagree with the article and the many similar articles like it.

I'll admit that this article is better written than the other articles. Most other articles on the subject can basically be condensed down to "Look how long this gulpfile that only runs jshint is! Look how short it is in an npm script! npm scripts rock!" It's tricky to argue against because the main point is completely valid: if you're only running jshint, it probably isn't worth using gulp. However, most people _aren't_ just running jshint in their gulpfiles! At [Lost My Name], we do a tonne of things in our gulpfiles: it deals with our JavaScript, our CSS, our responsive images, our linting, our sprite sheets, and our SVG minification and fallbacks.


## Complicated tasks: an example

Our browserify task is a good example of a task that would be near impossible without gulp. This is what it does:

- It calls [browserify], which does a few things
  - It (obviously) packages our modules into one file
  - It calls babel, which deals with our ES6 and JSX
  - It sets up hot module loading
  - It inlines some environmental variables
  - We add our own copy of jQuery so that if a dependency tries to add jQuery@2, it can't: [more on that here][Only one jQuery]
- Then, we transform the browserify stream into a gulp stream and call a few gulp plugins:
- We minify the JavaScript using [gulp-uglify]
- We remove `console.log()` statements with [gulp-strip-debug]
- We call a function which combines a few gulp tasks which we call after every task which does this:
  - It creates a revisioned version of the file using [gulp-rev]
  - It creates a manifest of revisioned files, again with gulp-rev
  - Finally, it deletes the old revisioned file using [rev-del]
  
You can find the full source of our browserify task [here][browserify task].
  
There are two things that gulp make very nice here. The first is sourcemaps.

### Sourcemaps

[gulp-sourcemaps] is a gulp plugin which add source maps support to gulp. It's supported by all the plugins I mentioned above seamlessly: to do this in JavaScript alone, or worse, in a shell script, would be tricky. [Vinyl], the virtual file format that gulp plugins work with, allow plugins to set properties on the file objects, which it uses to build the source map with multiple plugins. It's super nice and works pretty much seamlessly.
 
### Function composition
 
The revision stuff mentioned previously is another case where gulp shines. We want a load of our tasks (such as js, css, responsive-images, svg fallback) to generate revisioned assets. What do we do with gulp? We use [multipipe] to merge all the common streams we want to pass every task to, and create just one function. We can then treat this function just like any other gulp plugin: this is a big advantage of using streams like gulp does.

[Here is our `rev()` function.](https://github.com/Lostmyname/lmn-gulp-tasks/blob/master/lib/rev.js)

This is pretty tricky to do with npm scripts. If you're using shell scripts, it's basically impossible. If you're using JavaScript files, then it's possible, but you'll end up rewriting a fair chunk of gulp yourself.


## Not everyone is using tools like browserify

Sure, if you're using browserify, you can just call it directly. But what if you don't want to do that? What if you just want to concatenate three files and then minify them? You want to use streams for this, and you don't want to rewrite Vinyl, so we're going to use bash for this.

You now have a couple problems:

### Which tool do you use?

With gulp, we would use the gulp plugin for [Uglify2]. However, while it has a command line interface, it doesn't seem to accept streams, so we can't do anything like the following:

```markup
$ cat src/**/*.js | uglify2 > app.min.js
```

That's a shame. Now we need to find a different tool, because we can't use that one.

### Junior developers

If I ask a junior developer on my team to write me a gulp task to concatenate and minify a few files, they'll be able to do it in minutes. It's super easy.

If I ask them to write me a shell script or plain JavaScript file to do the same thing, there's a good chance they won't be able to do it: and the solution certainly won't be as elegant as the four lines of JavaScript required to do it in gulp.

Junior developers can comfortably work with gulp. npm scripts, not so much.


## npm scripts are powerful enough: but are less verbose

In gulp, if I want to make a build task that runs a `lint` task, then runs the `js` and `css` tasks simultaneously, I do the following:

```javascript
gulp.task('build', gulp.series('lint', gulp.parallel('js', 'css')));
```

To do that in an npm script, I do this:

```javascript
"build": "npm run lint && ( npm run css & npm run js )"
```

I'm sure other people will disagree with me, but I prefer the former syntax.

## More complicated tasks

The article didn't give any examples of complicated tasks: I believe it's misleading you. You'll start using npm scripts for small tasks, thinking "this is great!", but as you attempt to write more complicated tasks, you'll run into difficulty. I have always challenged people who advocate for npm scripts to rewrite the [lmn-gulp-tasks responsive-images task] in either pure JavaScript or using a shell script. So far, nobody has ever managed it.

gulp makes working with multiple libraries together a lot easier.

## Dependence on Plugin Authors

I'll admit, this one can sometimes be a genuine pain point. If a plugin author stops using their plugin, it can be a while before they update it. However, this barely ever happens, and you can usually work around it! Because of the way npm works, you can specify your own version of the library in the root `package.json` and the plugin will start using that version instead.

It's also worth noting that the gulp plugins of most of the libraries he mentioned are actually maintained by the same people who write the plugin itself: for example, gulp-babel is [hosted on the babel organisation][github gulp-babel]. mocha, webpack, and browserify should all be called directly, not by gulp plugins: has the author quite understood what gulp is for?

You can also send a pull request updating the plugin or fork the project!

### Number of plugins

![](https://cdn-images-1.medium.com/max/800/1*Ukvg75zwIh7eZn35s8bs3g.png)

The author uses this image to illustrate that there are more plugins available for npm than for gulp and Grunt.

**This argument is wrong.**

Gulp tasks are written in JavaScript and powered by Node. You can load _any_ of the 227,000 npm packages in gulp: you don't need to load a specific gulp plugin.

----

Gulp makes writing tasks in JavaScript to aid you when you're building your website _easy_. Sure, you can probably rewrite the entire thing in shell scripts, but it won't be pleasant, and if your junior developer wants to tweak it? Not a chance.

Gulp makes things that are near impossible without gulp seamless and easy, such as working with sourcemaps across multiple libraries and composing multiple libraries together for use over multiple tasks.

It's all very well saying "if you want to use this library, you can call it directly", but when you want multiple libraries to work together, that's where gulp shines: it provides a consistent API that plugins (and libraries directly) can use so you don't end up creating a mess of different temporary files which each plugin reads to and the next one writes from. Not all libraries support streams.




[Why I Left Gulp and Grunt for npm Scripts]: https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.qx38c99ge
[Lost My Name]: http://making.lostmy.name/
[Only one jQuery]: http://macr.ae/article/only-one-jquery.html
[browserify task]: https://github.com/Lostmyname/lmn-gulp-tasks/blob/master/tasks/browserify.js
[gulp-sourcemaps]: https://www.npmjs.com/package/gulp-sourcemaps
[Vinyl]: http://npmjs.com/package/vinyl
[multipipe]: https://www.npmjs.com/package/multipipe
[Uglify2]: https://github.com/mishoo/UglifyJS2
[lmn-gulp-tasks responsive-images task]: https://github.com/Lostmyname/lmn-gulp-tasks/blob/master/tasks/responsive-images.js
[github gulp-babel]: https://github.com/babel/gulp-babel
[browserify]: http://browserify.org/
[gulp-uglify]: https://www.npmjs.com/package/gulp-uglify
[gulp-strip-debug]: https://www.npmjs.com/package/gulp-strip-debug
[gulp-rev]: https://www.npmjs.com/package/gulp-rev
[rev-del]: https://www.npmjs.com/package/rev-del