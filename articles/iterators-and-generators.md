# Playing with interators and generators in ECMAScript 6
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

Iterators are pretty self descriptive—an Iterator is an object that can iterate through something one item at a time. They can be iterated through either by calling the `.next()` method or using a for…in loop.

A really simple iterator would just iterate through an object:

```javascript
var keyMap = {
	keyLeft: 37,
	keyUp: 38,
	keyRight: 39,
	keyDown: 40
};

var keyMapIterator = Iterator(keyMap);

keyMapIterator.next(); // ["keyLeft", 37]
keyMapIterator.next(); // ["keyUp", 38]
keyMapIterator.next(); // ["keyRight", 39]
keyMapIterator.next(); // ["keyUp", 40]

keyMapIterator = Iterator(keyMap);

for (let [key, code] in keyMapIterator) {
	console.log(key + ' has keyCode ' + code);
}
```

That code sample demonstrates two ways of iterating through an Iterator. You may have noticed that we declared `keyMapIterator` twice, once before each loops—this is because once an Iterator has been looped through all the way, you can't loop through it again (it'll just throw an error).

#### More ECMAScript 6 features

`let [key, code]` demonstrates another two ECMAScript 6 features. `let` is similar to the `var` keyword in that it declares a variable, but it uses block scoping instead of function scoping, meaning that the variable declared will not be available after the block:

```javascript
{
    var foo = 'bar';
    let hello = 'world';

    console.log(foo, hello); // "bar" "world"
}

console.log(foo); // "bar"
console.log(hello); // ReferenceError
```

The square brackets allow you to declare multiple variables at the same time on one line:

```javascript
var [a, b] = ["hello", "world"];
console.log(a, b); // "hello" "world"
```

This is especially useful for switching two variables round (which previously involved three lines of code and a temporary variable):

```javascript
var a = 1,
	b = 2;

[a, b] = [b, a];

console.log(a, b); // a = 2, b = 1
```

This is called a destructuring assignment.

#### Back to iterators

So we've seen how we can create an Iterator to iterate over a simple object. You can also use them to loop over arrays in the same way, and it will include properties added to the array (but not properties added to the prototype; it's like using a for…in loop with an `arr.hasOwnProperty(key)` call).

You can create **custom iterators** to iterate through your own objects.

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
        throw StopIteration;
    } else {
        return JSON.parse(this.stringsArray[this.index++]);
    }
};

JSONStrings.prototype.__iterator__ = function () {
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

for (let user in users) {
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
        throw StopIteration;
    } else {
        return JSON.parse(this.stringsArray[this.index++]);
    }
};
```

This is the function called to iterate through the items, the usage of which was demonstrated earlier. If the index is greater than the length of the array of strings then there is nothing left to iterate over and the function throws `StopIteration` to indicate that—otherwise, it parses the JSON string of the current iteration, and increases the index by one.

```javascript
JSONStrings.prototype.__iterator__ = function () {
    return new JSONStringsIterator(this.jsonStrings);
};
```

This is the code that makes `JSONStrings` iterable. When you attempt to loop through an object in a for…in loop, the JavaScript engine looks for an `__iterator__` method, and calls it to attempt to get an iterator.

There are a lot of functions which don't really do much in the above example, but they're not strictly needed. The below code would do the same and is a lot easier to understand, but I wouldn't recommend using it: it copies the `__iterator__` function into every instance of JSONStrings, which isn't great.

```javascript
function JSONStrings(jsonStrings) {
    this.__iterator__ = function () {
        var index = 0,
            iterator = {};

        iterator.next = function () {
            if (index >= jsonStrings.length) {
                throw StopIteration;
            } else {
                return JSON.parse(jsonStrings[index++]);
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

Iterators create a nice way to loop through objects on at a time using something like for for…in loop (or just by calling the `.next()` method).

```javascript
var obj = {
	one: 1,
	two: 2,
	three: 3
};

for (let [word, num] in Iterator(obj)) {
	console.log(word + ' is ' + num);
		// one is 1
		// two is 2
		// three is 3
}
```

You can create custom iterators on your own objects by adding an `__iterator__` method to the object (either directly or onto a prototype) which returns an object with a `.next()` method.


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