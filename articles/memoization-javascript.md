# My take on function memoization in JavaScript
- 2014-02-19

Memoization is a simple optimisation technique where the result of a function is cached, and then if the same arguments are seen again the result is retrieved from the cache instead of being calculated again. On functions which take longer to run, this can be extremely effective at speeding up your JavaScript.

Here is a function I wrote to achieve it in JavaScript:

```javascript
/**
 * A memoize function to cache return values where possible.
 *
 * @author Callum Macrae (@callumacrae)
 * @license Public domain.
 *
 * @param fn The function to memoize.
 * @param sort If true, arguments will be sorted. Useful for functions where
 *             the order of arguments don't matter.
 */
function memoize(fn, sort) {
    var cache = {};

    return function () {
        var args = Array.prototype.slice.call(arguments);

        if (sort) {
            args.sort();
        }

        if (cache[JSON.stringify(args)] !== undefined) {
            return cache[JSON.stringify(args)];
        }
        
        var result = fn.apply(this, args);
        cache[JSON.stringify(args)] = result;
        return result;
    };
}
```


### How good is it?

To see how effective it is, let's take an inefficient recursive function to generate the nth fibonacci number.

```javascript
function fibonacci(n) {
    if (n === 0) {
        return 0;
    } else if (n === 1) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

We can use `console.time` to see how long it takes to compute the 40th fibonacci number three times:

```javascript
console.time('Plain function call');
for (var i = 0; i < 3; i++) {
    fibonacci(40);
}
console.timeEnd('Plain function call');
```

It usually took about 4500ms without using a cache—4458.188ms was the best result over a few tries.

```javascript
var fibonacciFromCache = memoize(fibonacci);

console.time('Memoized function call');
for (var i = 0; i < 3; i++) {
    fibonacciFromCache(40);
}
console.timeEnd('Memoized function call');
```

Now, it takes around 1500ms (1476.292ms was the best result). It was pretty obvious that this would happen—you were originally doing something three times, and now you're doing it once—but it does demonstrate that it works.


### Unordered arguments

I added a sort argument to the memoize function, which when set to true will sort the arguments. This is great for functions where the order of arguments don't matter.

Take a function to take a list of numbers and work out which three items in the list have the product which is closest to ten. It's a pretty simple function: it just gets every combination of three numbers, and multiplies them, comparing them to the previous best. If the previous best is beaten, those numbers are saved.

```javascript
function findClosestToTen() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length <= 3) {
        return args;
    }

    var closest = [args[0], args[1], args[2]];

    for (var i = 0; i < args.length; i++) {
        for (var j = i + 1; j < args.length; j++) {
            for (var k = j + 1; k < args.length; k++) {
                var closestRes = closest[0] * closest[1] * closest[2],
                    currentRes = args[i] * args[j] * args[k];

                if (Math.abs(currentRes - 10) < Math.abs(closestRes - 10)) {
                    closest = [args[i], args[j], args[k]];
                }
            }
        }
    }

    return closest;
}
```

This is fine with a small list of numbers, but as the list gets bigger, this takes a horrifically large amount of time as it has a cubic complexity `O(n^3)`. Let's generate an array containing 500 random numbers:

```javascript
var nums = [];
for (var i = 0; i < 500; i++) {
    nums.push(Math.random() * 20);
}
```

According to `console.time()`, it takes around 1600ms to run `findClosestToTen.call(null, nums)`—and that's in Chrome.

The product of the three numbers returned by `findClosestToTen.apply(null, nums)` will be the same as the product of the three numbers returned by `findClosestToTen.apply(null, _.shuffle(nums))`, as it doesn't matter what order the list is in; the list contains the same numbers, we've just used [Underscore's shuffle method](http://underscorejs.org/#shuffle) to shuffle the array.

If we generate a new function using the `memoize()` function and set the `sort` argument to true, the new function will sort the arguments before comparing them, and so it considers `nums` and any `_.shuffle(nums)` to be the same:

```javascript
var findClosestToTenFromCache = memoize(findClosestToTen, true);
findClosestToTenFromCache.apply(null, nums);
findClosestToTenFromCache.apply(null, _.shuffle(nums)); // From cache
findClosestToTenFromCache.apply(null, _.shuffle(nums)); // From cache
```

While this example isn't exactly realistic, you can see how it can be useful.


### The minified function

Minified, the function is 159 bytes gzipped or 185 bytes uncompressed. Here you go:

```javascript
function memoize(d,e){var b={},c=JSON.stringify;return function(){var a=[].slice.call(arguments);e&&a.sort();if(void 0!==b[c(a)])return b[c(a)];var f=d.apply(this,a);return b[c(a)]=f}};
```

Feel free to use the function any way you want.


### Other libraries

The are other functions and libraries available for memoization. Most of the functions do the same as mine, but slightly differently. Then there is [this library](https://github.com/medikoo/memoize), which is a more complete library: in addition to the simple memoization my function provides, it allows you to specify an argument length, allows you to specify types, and supports asyncronous functions.
