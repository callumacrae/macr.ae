# ECMAScript 6 and Currying
- 21st September, 2015

Currying is the act of turning a function into a new function that takes slightly few arguments, achieving a slightly more specific task. For example, we could take a function that surrounds some text in a specified HTML tag, and create a function that specifically surrounds some text in a `<strong>` tag.

Here is the function I'll be using as a demo in this article:

```javascript
function formatText(tag, text) {
	return '<' + tag + '>' + text + '</' + tag + '>';
}

formatText('p', 'some text'); // <p>some text</p>
```

In ECMAScript 5 and below, a common way of currying a function without using a library was to use the bind function as follows:

```javascript
var makeStrong = formatText.bind(undefined, 'strong');

makeStrong('this is important'); // <strong>this is important</strong>
```

That syntax is kind of confusing if you don't already know what it does or how the bind function works—and a surprisingly large number of people don't know that you can give it more than one argument.

In ES6, you can use fat arrow functions to achieve pretty much the same thing:

```javascript
var makeStrong = (text) => formatText('strong', text);
```

It's shorter, and more readable.

If you want to accept more than one argument (say, you've decided you want your formatText function to concatenate two strings together), you can use a rest parameter and a spread operator:

```javascript
function formatText(tag, text, text2) {
	return '<' + tag + '>' + text + ' ' + text2 + '</' + tag + '>';
}

var makeStrong = (...args) => formatText('strong', ...args);

makeStrong('this is', 'a test'); // <strong>this is a test</strong>
```

It may not be as clever as using the bind function or a currying function from a library, but it's much more readable.

Alternative, you can use a function that does currying for you, taking a function and returning a function that already has some of the arguments filled in:


## Writing a currying function

To better demonstrate how much shorter and easier to read the ES6 currying function is, here is the `_.partial` function from [Underscore's annotated documentation](http://underscorejs.org/#partial), which is used for currying and doesn't use ES6:

```javascript
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };
```

In addition to the basic currying functionality, the function in Underscore allows you to specify placeholders, like so:

```javascript
function subtract(x, y) {
	return x - y;
}

var take5From = _.partial(subtract, _, 5);

take5From(10); // 5
```

Let's rewrite it using fat arrow functions and rest and spread operators. Here is the basic currying functionality:

```javascript
function curry(fn, ...args1) {
  return (...args2) => fn(...args1, ...args2);
}
```

And here it is with the placeholder functionality:

```javascript
function curry(fn, ...args1) {
  var i = args1.indexOf(_);
  var args3 = (i === -1) ? [] : args1.splice(i).slice(1);
  return (...args2) => fn(...args1, ...args2, ...args3)
}
```

We can verify it works using the following:

```javascript
var take5From = curry(subtract, _, 5);
take5From(10); // 5
```

That's certainly a lot simpler than the function taken from Underscore!