# Immediate Functions
- 2014-03-25

This is an article I wrote in early 2012, originally published on [lynx.io](http://lynx.io/article/javascript-immediate-functions), my old website. I haven't made many changes to the article; I've only fixed a few grammar errors.


----


In JavaScript, the immediate function pattern is a way of executing a function as soon as it is defined. In this article, I will explain the syntax and explore some of the advantages of using it. This syntax can also be referred to as a closure.

An example of an immediate function:

```javascript
(function () {
    console.log('test');
})();
```

Basically, it is a function expression which is executed immediately. The function has to wrapped in brackets to prevent a syntax error (without the brackets, it is a function declaration), and can also be written like this:

```javascript
(function () {
    console.log('test');
}());
```

Both syntaxes are correct, and both are fairly commonly used.

Why would we want to have a function that is executed immediately? Why not just write `console.log('test');`? The example above probably wasn't the best example in the world, as the immediate function doesn't provide anything to the code. Immediate functions traditionally have two usages: defining a function on page load by a conditional (because function declarations are hoisted—more on this later), or for creating a new scope. For example, jQuery plugins commonly use the following syntax:

```javascript
(function ($) {
    // Plugin code here
})(jQuery);
```

This is to avoid conflicts with other libraries that use the `$` variable. When the jQuery variable is passed to the function as an argument, it is defined as `$` in the new scope. In the old scope, the `$` is left unchanged. This can also be used to solve what is known as the "last one only" problem. Consider the following code:

```javascript
var anchors = document.getElementsByTagName('a');

for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function () {
        console.log('Anchor number ' + i + ' has been clicked.');
    });
}
```

While nothing seems obviously wrong with it, it doesn't function at all as expected. Check out the code here: <http://jsfiddle.net/UwxS5/>. Whenever you click a link, the text logged to the console will be "Anchor number 4 has been clicked.". Obviously, this is not what we expected - we expected "Anchor number 0 has been clicked" if you clicked the first link, etc. The problem is caused by the fact that `i` has increased to the highest it possibly can by the time the element is clicked - hence "last one only".

This can be solved by using an immediate function. If we pass `i` to the function and then add the event listener inside the function, `i` will be in a different scope to the loop, and so will not be modified on the next iteration of the loop:

```javascript
var anchors = document.getElementsByTagName('a');

for (var i = 0; i < anchors.length; i++) {
    (function (i) {
        anchors[i].addEventListener('click', function () {
            console.log('Anchor number ' + i + ' has been clicked.');
        });
    })(i);
}
```

As you can see in [this jsfiddle](http://jsfiddle.net/Mmk7B/), it works as expected.

### Init-Time Branching

Init-time branching is a pattern used to define a function on page load by a conditional that we know will not change. An example of this is defining a function for Internet Explorer, and then another for the other browsers. Consider the following code:

```javascript
if (isIE()) {
    function myFunction() {
        console.log('This is IE!');
    }
} else {
    function myFunction() {
        console.log('This is not IE!');
    }
}
```

If you run `myFunction()` in, say, Chrome, you get "This is not IE!" logged to the console. That's expected. However, if you run it in IE, you also get "This is not IE!" logged to the console. This is because function declarations are hoisted, meaning that the parser goes through the code parsing the function declarations before it parses the rest of the code. This allows us to do stuff like this:

```javascript
test(); // "Hello world!"
function test() {
    console.log('Hello world!');
}
```

However, if we want to declare a function on page load by a conditional, that isn't very useful. We could do the following, but it isn't especially efficient:

```javascript
function myFunction() {
    if (isIE()) {
        console.log('This is IE!');
    } else {
        console.log('This is not IE!');
    }
}
```

The solution? An immediate function! The following code will do what we expected in the first example:

```javascript
var myFunction = (function () {
    if (isIE()) {
        return function () {
            console.log('This is IE!');
        }
    } else {
        return function () {
            console.log('This is not IE!');
        }
    }
})();
```

That works fine, but is not hoisted, as it is a function expression, not a function declaration. We also don't need the else statement; as the if statement always returns something, the second function will only be returned if `isIE()` doesn't return truthy anyway. I've left the else statement in for readability reasons, though.

---

In summary, immediate functions can be useful to solve a variety of problems, including scoping issues, the last one only problem, and the problem of defining a function on page load by a conditional.

To read more on this and problems like these, I would highly recommend [JavaScript Patterns](http://shop.oreilly.com/product/9780596806767.do) by Stoyan Stefanov, published by O'Reilly Media.
