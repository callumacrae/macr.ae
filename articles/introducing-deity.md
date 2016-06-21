# Introducing Deity
- 20th June 2016

[Deity] is a property generating tool for use when writing generative tests.
You call it with a string called a generator string saying what kind of data
should be generated, and then it calls a specified testing function a number
of times (the default is 100, but it is configurable) with some random
generated data matching what you said you wanted.

Basically, it does this:

```javascript
deity('number:10-20', function (num) {
	// This function will be called 100 times
	// num will equal a random number between 10 and 20 each time
});
```

This is useful for testing a range of values against a function you've written,
instead of just a couple values that you specified when writing the test.

The first argument is what we call a "generator string": it specifies the name
of the generator that should be used and any arguments to be given to the
generator—in the case of the number generator, a range to generate the number
within.

You can specify multiple generator strings as multiple arguments, and the
callback will be called with multiple arguments.

It then has an optional argument which is an object containing configuration
for both Deity and any generators. For example, we can specify the number of
times we want Deity to run the generator.

The final argument is a function, your testing function, which will be called a
number of times with different generated data each time. You can then run your
tests on this data.


## An example

Let's say we want to test a `reverse()` function that simply takes a string and
returns it in reverse order. Traditionally with mocha and an assertion library,
we would write a test for it like this:

```javascript
describe('reverse()', function () {
	it('should return reversed string', function () {
		assert.equal(reverse('abc'), 'cba');
		assert.equal(reverse('qwerty'), 'ytrewq');
		assert.equal(reverse('hello'), 'olleh');
	});
});
```

That's all very well, but we're only testing those three specific strings. It
would be nice if we could generate some strings to test—and with Deity, we can.

Let's rewrite the example to call `reverse()` twice, which should return the
original string:

```javascript
describe('reverse()', function () {
	it('should return reversed string', function () {
		assert.equal(reverse(reverse('abc')), 'abc');
		assert.equal(reverse(reverse('qwerty')), 'qwerty');
		assert.equal(reverse(reverse('hello')), 'hello');
	});
});
```

Now we're testing that the input string and output string are the same instead
of manually performing the reverse logic when writing our tests. We can use
Deity to generate the test strings for us:

```javascript
describe('reverse()', function () {
	it('should return reversed string', function () {
		return deity('string:5-10', function (str) {
			assert.equal(reverse(reverse(str)), str);
		});
	});
});
```

Our assertion will be called 100 times with a different random string each time
with a length between 5 and 10 characters. This is far superior to testing the
same three strings every time!


## Generators

Deity has quite a few built in generators which can be used to generate many
types of data. Here are a few of the most useful:

### String

This generator generates strings of random length within a specified range.

```javascript
deity('string:30-50', function (str) {
	// str will equal a string of between 30 and 50 characters
});
```

The string generator gets the characters from the `letters` config options. You
can customise it. If you only want the string to contain vowels, you can do the
following:

```javascript
deity('string:30-50', { letters: 'AEIOU' }, function (str) {
	// str will equal a string containing only vowels
});
```

### Number

The number generator generates numbers between a given range of numbers.

```javascript
deity('number:5-20', function (num) {
	// num will equal a number between 5 and 20
});
```

The numbers generated are not whole numbers: for example, the above could have
generated `17.51900236005895`. The generator also accepts a second argument
specifying the precision we want the number generated to. Just specify a number
of the precision that you want the generated number to be returned as. For
example, if you specify a precision of "0.001", the number used as an example
previously would be rounded to `17.519`.

```javascript
deity('number:0-100:0.1', function (num) {
	// number will equal a number between 0 and 100 with no more than one decimal place
});
```

#### Int

The int generator is similar to the number generator, but only generates whole
numbers.

### Char

This generator generates single characters within a given range:

```javascript
deity('char:A-M', function (char) {
	// char will be a letter in the first half of the alphabet
});
```

### Boolean

The boolean generator generates true or false values with a given bias.

With no arguments, it generates true 50% of the time, and false the other 50%
of the time. If given a number between 0 and 1, it generates the values with
a bias. For example, if give 0.7, it will return true 70% of the time, and
false the remaining the 30%.

```javascript
deity('boolean:0.1', function (value) {
	// value will be false nine times out of ten
});
```

### oneOf

The oneOf generator is the first of a few generators that takes another
generator as an argument. This one takes a number of generators as arguments,
and then picks one randomly to generate a value with each time. For example,
the generator string `'oneOf:(string:5-10):(int:0-10):(boolean)'` will generate
a value that is either a string between 5 and 10 characters long, or an integer
between 0 and 10, or a boolean value.

```javascript
deity('oneOf:(string:5-10):(int:0-10):(boolean)', function (value) {
	// value is one of the following:
	// - a string of length between 5 and 10 characters
	// - an integer between 0 and 10
	// - or a boolean value with no bias
});
```

For a full list of supported generators, check out the [Deity documentation].

## Plugins

It's easy to extend Deity with plugins, and it's easy to write your own. Deity
generators are just ES6 generators: every value they yield will be passed to
the function specified by the user.

To load a plugin, use the `deity.extend()` function. For this example, we're
going to use the [deity-plugin-randomuser] plugin.

```javascript
var deity = require('deity');
var randomUser = require('deity-plugin-randomuser');

deity.extend(randomUser);

deity('users', function (user) {
	// will be called with 50 generated users
});
```

### Writing a plugin

This will be a separate article: keep an eye on [my twitter] for when it will
be posted (it will be in the next week).

tl;dr: plugins are ES6 generators:

```javascript
deity.extend('myGenerator', function* () {
    while (true) {
        yield 'This is the value given to the deity callback';
    }
});
```

## Asynchronicity

Generators can be asynchronous, and if they are, any errors thrown inside your
specified function won't be caught by mocha. To get around this, when using
an asynchronous generator, the deity function returns a promise which will be
either resolved or rejected depending on whether an error is thrown. If you're
using mocha, just return the result of the deity function as in the example
below.

If you want your testing function to be asynchronous, returning a promise will
allow you to do that.

The randomuser plugin mentioned just now sends off an AJAX request before it
can call your testing function with the random users, and so is an asynchronous
generator. Let's see how we would use it with mocha:

```javascript
describe('validateUser()', function () {
	it('should validate users', function () {
		return deity('randomuser', function (user) {
			assert.true(validateUser(user));
		});
	});
});
```

To go further with this, let's introduce an asynchronous `asyncValidateUser()`
function to the example:

```javascript
describe('validateUser()', function () {
	it('should validate users', function () {
		return deity('randomuser', function (user) {
			return validateUser(user)
				.then(function (isValid) {
					assert.true(isValid);
				});
		});
	});
});
```

Writing the same code without Deity would be less than trivial.

## Deity

Deity allows us to easily test data generated randomly from criteria we
specify. Based on promises, it allows us to perform both synchronous and
asynchronous operations in our generators and testing functions.

It can be extended with plugins such as [deity-plugin-randomuser], which uses
an API to generate random users for your tests. It's also easy to write your
own plugins: Deity generators are just ES6 generators.

For more, check out [the website][Deity] and the [Deity documentation].




[Deity]: http://deityjs.com/
[Deity documentation]: https://github.com/DeityJS/deity#deity-
[deity-plugin-randomuser]: https://github.com/DeityJS/deity-randomuser
[my twitter]: https://twitter.com/callumacrae
