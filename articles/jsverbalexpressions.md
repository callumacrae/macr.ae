# Easy regular expressions with JSVerbalExpressions
- 31st January, 2014

[VerbalExpressions](http://verbalexpressions.github.io/) is a collection of libraries for many languages (including JavaScript, PHP, Python, Ruby and even PowerShell) which make writing regular expressions a lot easier—in fact, you don't need to write regular expressions at all; it writes them for you. [JSVerbalExpressions](https://github.com/VerbalExpressions/JSVerbalExpressions) is the library for JavaScript, and the one that I'll be covering in this article. They're all pretty similar to each other, though.

This article requires no knowledge of regular expressions!

If we have a string that *might* contain either the text "RegExp", "regex", or "Regular Expressions", we can use a regular expression to check for that. The following regular expression would do the trick:

```javascript
/Reg(?:ular )?Exp?(?:ressions)?/i
```

To someone who doesn't know regular expressions, that probably won't make much sense. Here it is using the library:

```javascript
var tester = VerEx()
	.find('Reg').maybe('ular ')
	.then('Ex').maybe('p').maybe('ressions')
	.withAnyCase();
```

That's a lot more readable. (Note: `.find()` and `.then()` do exactly the same thing.)

We can now use the `tester` variable as a normal regular expression:

```javascript
tester.test('Regular Expressions'); // true
tester.test('This regex stuff is confusing'); // true
tester.test('Foo bar'); // false

'This regex stuff is confusing'.match(tester); // ['regex']
```

It also adds a method to make string replacements easier:

```javascript
tester.replace('This regex stuff is confusing', 'foo bar');
	// This foo bar stuff is confusing
```

### A more complicated example—limitations


For a more complicated example, let's say that we want to write a regular expression to match a date in YYYY/MM/DD format between 1000/01/01 and 2999/12/31. The regular expression for that would be as follows:

```javascript
/^[12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/
```

Unfortunately, the `.range()` method only allows character input, so the following is not valid:

```javascript
var tester = VerEx()
	.startOfLine()
	.range('1000', '2999')
	.then('/')
	.range('01', '12')
	.then('/')
	.range('01', '31')
	.endOfLine();
```

Instead, we'd have to use multiple expressions and the `.or()` method:

```javascript
var tester = VerEx()
	.startOfLine()
	.any('12')
	.range('0', '9')
	.range('0', '9')
	.range('0', '9')
	.then('/')
	.find(
		VerEx()
			.then('0')
			.range('1', '9')

			.or('1')
			.range('0', '2')
	)
	.then('/')
	.find(
		VerEx()
			.then('0')
			.range('1', '9')

			.or()
			.any('12')
			.range('0', '9')

			.or('3')
			.any('01')
	)
	.endOfLine();
```

This generates the following regular expression:

```javascript
/^[1-2][0-9][0-9][0-9](?:\/)(?:(?:(?:0)[1-9])|(?:(?:1)[0-2]))(?:\/)(?:(?:(?:(?:0)[1-9])|(?:[12][0-9])|(?:(?:3)[01])))$/gm
```

Holy shit, right? It's 119 characters long (and near unreadable), while the expressions I wrote is only 49.

JSVerbalExpressions also doesn't support all the features of regular expressions—for example, you can't do named capture groups or backreferences—but it certainly makes writing simple regular expressions very easy for people who don't know how to write regular expressions.

Nethertheless, JSVerbalExpressions remains a very good tool for writing simple regular expressions without having to have knowledge of regular expressions.