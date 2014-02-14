# Playing with iterators and generators in ECMAScript 6
- 12th February, 2014

This article will cover for…of loops, iterators and generators, features all in the Harmony (ECMAScript 6) proposal. As this hasn't actually happened yet, browser support isn't great—most of the features mentioned in this article only currently work in Firefox nightly. You can see a full list of feature support in browsers in [this table](http://kangax.github.io/es5-compat-table/es6/).


### for…of loops


The for…of loop is a new type of loop proposed for Harmony (ECMAScript 6). It's designed for iterating over arrays, array-like objects (such as the `arguments` variable and instances of NodeList), and generators. for…in loops aren't great for iterating over arrays, as the following code will demonstrate:

```javascript
var arr = ['one', 'two', 'three'];
Array.prototype._someLibraryAddedThis = {};

for (var i in arr) {
	console.log(arr[i])
}
```

That will output the following:

```javascript
"one"
"two"
"three"
{}
```

Oops! We didn't want to log the object to the console. We could work around it by added an if statement calling `arr.hasOwnProperty(i)`, but our code is now pretty ugly:

```javascript
var arr = ['one', 'two', 'three'];
Array.prototype._someLibraryAddedThis = {};

for (var i in arr) {
	if (arr.hasOwnProperty(i)) {
		console.log(arr[i])
	}
}
```

Any properties added directly to the array will still be logged, too (`arr.hello = 'world'`).

Using a for...of loop is nicer:

```javascript
var arr = ['one', 'two', 'three'];
Array.prototype._someLibraryAddedThis = {};

for (var i of arr) {
	console.log(i);
}
```

That will result in only "one", "two" and "three" being logged to the console, even if you add properties directly to the array. Success!

As a bonus, here's an example of the for…of loops being used to iterate through a NodeList:

```javascript
var elements = document.querySelectorAll('.myClassName');

for (let element of elements) {
	console.log(element);
}
```


### Iterators

**This section updated 14th February 2014: before, it was wrong and was using SpiderMonkey's old syntax for Iterators. Apologies!**

Iterators are pretty self descriptive—an Iterator is an object that can iterate through something one item at a time. An object is an iterator when it has a method called `@@iterator`. For example, we could define a `NumberIterator` constructor to create an iterator to loop through an array, converting the elements to numbers. It isn't really a real-life example, but it's good for demonstration:

```javascript
function NumberIterator(arr) {
    this['@@iterator'] = function () {
        var index = 0;

        return {
            next: function () {
                if (index >= arr.length) {
                    return {done: true};
                } else {
                    return {
                        value: parseInt(arr[index++]),
                        done: false
                    }
                }
            }
        }
    };
}
```

We can then use the iterator using the following:

```javascript
for (let i of new NumberIterator([1, 2, "3"])) {
    console.log(i);
}
```

This works as expected, logging the numbers one to three to the console, all as numbers.

#### The let keyword

The usage of `let i` demonstrates another ECMAScript 6 feature. `let` is similar to the `var` keyword in that it declares a variable, but it uses block scoping instead of function scoping, meaning that the variable declared will not be available after the block:

```javascript
{
    var foo = 'bar';
    let hello = 'world';

    console.log(foo, hello); // "bar" "world"
}

console.log(foo); // "bar"
console.log(hello); // ReferenceError
```

#### Back to iterators

Time for a more complicated example, this time using prototypes instead of returning an object.

Let's say we have an array containing a couple million strings containing JSON representations of users. We want to create a page to scroll through them all, but we only want to display the first hundred. When the browser reaches the bottom of the page, we'll display another hundred.

To do this, we'll use an iterator. The following block of code defines our iterator.

```javascript
function JSONStrings(jsonStrings) {
    this.jsonStrings = jsonStrings;
}

function JSONStringsIterator(stringsArray) {
    this.stringsArray = stringsArray;
    this.index = 0;
}

JSONStringsIterator.prototype.next = function () {
    if (this.index >= this.stringsArray.length) {
        return {done: true};
    } else {
        return {
            value: JSON.parse(this.stringsArray[this.index++]),
            done: false
        };
    }
};

JSONStrings.prototype['@@iterator'] = function () {
    return new JSONStringsIterator(this.jsonStrings);
};
```

The code creates a constructor function that we can give an array of JSON strings to, and then when we loop through them it will parse them as they're iterated over (not all at the beginning).

We can now use it as follows:

```javascript
var users = new JSONStrings([
    '{"id":1,"name":"Bob Smith","email":"bob.smith@example.com"}',
    '{"id":2,"name":"Robert","email":"robert@example.com"}',
    '{"id":3,"name":"Callum Macrae","email":"callum@example.com"}'
]);

for (let user of users) {
    console.log(user.name + ' has email address ' + user.email);
}
```

But how does it work?

We're definining two functions, `JSONStrings` and `JSONStringsInterator`. They're both pretty simple:

```javascript
function JSONStrings(jsonStrings) {
    this.jsonStrings = jsonStrings;
}
```

This literally just stores the array of JSON strings as a property of the created object.

```javascript
function JSONStringsIterator(stringsArray) {
    this.stringsArray = stringsArray;
    this.index = 0;
}
```

Our iterator function stores an array of JSON strings, and defines the initial index as zero.

```javascript
JSONStringsIterator.prototype.next = function () {
    if (this.index >= this.stringsArray.length) {
        return {done: true};
    } else {
        return {
            value: JSON.parse(this.stringsArray[this.index++]),
            done: false
        };
    }
};
```

This is the function called by the JavaScript engine in order to iterate through the items. It has to return an object containing two properties, `value` and `done`. When `done` is false, the `value` is given to the for…of loop, and the loop continues. When `done` is true, the loop is stopped.

```javascript
JSONStrings.prototype['@@iterator'] = function () {
    return new JSONStringsIterator(this.jsonStrings);
};
```

This is the code that makes `JSONStrings` iterable. When you attempt to loop through an object in a for…of loop, the JavaScript engine looks for an `@@iterator` method, and calls it to attempt to get an iterator.

There are a lot of functions which don't really do much in the above example, but they're not strictly needed. The below code would do the same and is a lot easier to understand, but I wouldn't recommend using it: it copies the `@@iterator` function into every instance of JSONStrings, which isn't great.

```javascript
function JSONStrings(jsonStrings) {
    this['@@iterator'] = function () {
        var index = 0,
            iterator = {};

        iterator.next = function () {
            if (index >= jsonStrings.length) {
                return {done: true};
            } else {
                return {
                    value: JSON.parse(jsonStrings[index++]),
                    done: false
                };
            }
        };

        return iterator;
    };
}
```

### Generators

Generators are a new type of function that provide an easier way to build an iterator. They are similar to functions, but they provide a new keyword to use, `yield`. It is similar to `return`, but means that you can continue to execute the function afterwards—generator functions can have multiple entry and exit points. It's best to explain using an example:

```javascript
function* count() {
	yield 1;
	yield 2;
	yield 3;
}

var counter = count();

counter.next(); // {value: 1, done: false}
counter.next(); // {value: 2, done: false}
counter.next(); // {value: 3, done: false}

counter.next(); // {done: true, value: undefined}
```

The `.next()` method posts everything yielded, and finally the return value (in this case, undefined).

You can use generators with for...of loops. Let's make a `range()` function to loop through numbers between a range:

```javascript
function* range(start, end) {
	for (let i = start; i <= end; i++) {
		yield i;
	}
}

for (let i of range(5, 8)) {
	console.log(i);
}
```

That outputs the numbers 5 through 8, as expected. That example isn't especially useful, though: we could have just made a `range()` function to build and return an array of numbers between the start and end value, and then looped through them. Let's look at a better example.

Let's say we want to log the first 10 numbers in the fibonacci sequence to the console. To remain testable, we want the function to generate the fibonacci numbers and the code to log them to the console to remain seperate. Traditionally, we would return an array and then loop through that:

```javascript
function fibonacci() {
	var [n, m] = [0, 1];
	var arr = [];
	
	for (let i = 0; i < 10; i++) {
		arr.push(n);
		[n, m] = [m, m + n];
	}

	return arr;
}

var arr = fibonacci();

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

I've kept some Harmony syntax in (imagine what it would be like without the destructuring assignments), but it doesn't use generators.

The following code does the same thing as the code above, but it uses a generator:

```javascript
function* fibonacciGenerator() {
	var [n, m] = [0, 1];
	
	while (true) {
		yield n;
		[n, m] = [m, m + n];
	}
}

var fibonacci = fibonacciGenerator();

for (let i = 0; i < 10; i++) {
	console.log(fibonacci.next().value)
}
```

It's not that much different. This new generator is much better than using the function we had before, though. Before, the fibonacci function was returning an array of ten numbers, meaning that we were coupling our fibonacci number generation logic with our "we only want ten numbers" logic. This doesn't allow us to easily reuse this function—what if we want the first fifty? What if we want all fibonacci numbers below one million? A generator will carry on returning bigger numbers while we ask for them, so we can use this generator for any of the above cases. To log all fibonacci numbers less than 150 to the console, we can use the following:

```javascript
var fibonacci = fibonacciGenerator();
while ((next = fibonacci.next().value) < 150) {
	console.log(next);
}
```

Or using a for...of loop:

```javascript
for (let i of fibonacciGenerator()) {
    if (i > 150) {
        break;
    }

	console.log(i);
}
```

To do that with our original fibonacci function which returns an array, we'd have to guess the number of elements we wanted (and adjust the function accordingly), or write an entirely new function.


### A quick summary

for…of loops can be used to loop through arrays, array-like objects like `arguments` and NodeLists, and generators. Unlike for…in loops, it will not loop through properties.

```javascript
for (let i of ['one', 'two', 'three']) {
	console.log(i); // "one", then "two", then "three"
}
```

Iterators create a nice way to loop through objects one at a time using a for…of loop.

```javascript
function NumberIterator(arr) {
    this['@@iterator'] = function () {
        var index = 0;

        return {
            next: function () {
                if (index >= arr.length) {
                    return {done: true};
                } else {
                    return {
                        value: parseInt(arr[index++]),
                        done: false
                    }
                }
            }
        }
    };
}

for (let i of new NumberIterator([1, 2, "3"])) {
    console.log(i);
}
```

You can create iterators on your objects by adding an `@@iterator` method to the object (either directly or onto a prototype) which returns an object with a `.next()` method, which in turn returns an object with `done` and `value` properties.


Generators provide an easy way to create iterators and functions with multiple exit and entry points, allowing us to decouple non-function logic from functions and make code easier to reuse and better for testing. The following code will output the first twenty fibonacci numbers, and then all the fibonacci numbers below 150.

```javascript
function* fibonacciGenerator() {
	var [n, m] = [0, 1];
	
	while (true) {
		yield n;
		[n, m] = [m, m + n];
	}
}

var fibonacci = fibonacciGenerator();
for (let i = 0; i < 10; i++) {
	console.log(fibonacci.next().value)
}

for (let i of fibonacciGenerator()) {
    if (i > 150) {
        break;
    }

	console.log(i);
}
```
