# Why I don't like jquery-ujs
- 2015-03-28

[jquery-ujs] is a JavaScript library designed to make things easier when writing a website with a Rails-powered backend. It provides a number of (completely unrelated) features such as turning links into forms so that you can send POST requests instead of GET requests, disabling submit buttons when they've been clicked, magically AJAXifying forms, and obliterating your users' experience with confirm boxes.

I don't like jquery-ujs very much. I think it's unnecessary, encourages bad practices, and contains useless functionality.

Here's a number of reasons I don't like jquery-ujs, and stuff you can do to retain functionality without using it.

## Kitchen sink

jquery-ujs tries to do everything: it's a [kitchen sink] library, as opposed to being a few libraries which do separate things.

This means that it's a library that does a lot, instead of a few libraries that do a little. This isn't so great: if a bit of it breaks or isn't suitable for you, you can't just swap it out for something else, because you're relying on the rest of the library.

Decoupling your JavaScript is great practice. Usually when you think of decoupling in the context of front-end development, you're thinking about getting HTML out of your JavaScript, or—worse—getting JavaScript out of your HTML. Addy Osmani gave a talk on it, a video of which you can find [on Vimeo][decoupling video]. The slides for the talk are pretty understandable without watching the talk, too: [here they are][decoupling].

## Bad for progressive enhancement

Some features in jquery-ujs do not encourage progressive enhancement, and using them will cause your website to break when JavaScript isn't available; say, the user has disabled it, the device they're using doesn't support it, or simply the JavaScript file has failed to download—it's not about NoScript, it's about being [tolerant to faults][progressive enhancement].

An example of a feature of jquery-ujs which is bad for progressive enhancement is `data-method`, which is an attribute that you can put on an anchor element, and it will allow you to specify a method like POST or DELETE to send the link to.

In other words, it behaves just like a form, but breaks when you don't have JavaScript.

This is how to create a link with jquery-ujs to send a POST request:

```markup
<a href="/controller/new" data-method="post" rel="nofollow">New</a>
```

Or, using the [link_to] rails helper:

```markup
<%= link_to "New", "/controller/new", { data: { method: "post" }, rel: "nofollow" } %>
```

This is how to create a form which submits a POST request with Rails, using the [button_to] helper. The link_to helper also has a `method` option which does the same thing.

```markup
<%= button_to "New", action: "new" %>
# => "<form method="post" action="/controller/new" class="button_to">
#      <input value="New" type="submit" />
#    </form>"
```

The jquery-ujs way is no shorter, isn't semantic HTML—POST requests should be sent using [buttons, not anchors]—and completely breaks when JavaScript isn't available.

And finally, in the example for `data-params`, we get to see some HTML-encoded JSON!

```markup
data-params="{&quot;param1&quot;:&quot;Hello server&quot;}"
```

That's not my blog escaping stuff it shouldn't be. It really is like that—ugly as hell. Wat. Use a hidden input element.

Stuff that should really just be a form makes up half of jquery-ujs's functionality. The remaining functionality is `data-confirm`, `data-disable-with`, and the `data-remote` AJAX stuff.


## It isn't on npm

This could just be the bit of the article where I sound butthurt that they didn't merge my pull request.

Honestly though, that's not the case!

> I really think we should not publish a frontend project in npm. This project is not a nodejs module. If Browserify choose to use npm to install frontend dependencies it not our problem.

ಠ_ಠ

[Here is the pull request, for reference][jquery-ujs PR]. Enough on that point—I don't want to sound too butthurt ;-)

## It relies on `window.jQuery`

Even though it is on Bower, jquery-ujs does not support the [Universal Module Definition][UMD], and doesn't even support AMD. It literally just passes in the `jQuery` variable—in this case, it would point to `window.jQuery`—and uses that.

[Reference][window.jQuery]. (it's the last line of the file)

This isn't good! Half the point in Bower and AMD is that you don't have to create global variables. [Global variables are bad.][bad global vars]

## The docs are impossible to find

Take a look at [the repo][jquery-ujs], which is the first result if you google something like "jquery-ujs" or "jquery-ujs documentation": it has no website.

The README says what you can do (but not how to do it). The first link has the following text:

> These features are achieved by adding certain ["data" attributes] to your HTML markup.

That link takes you to the W3C specification for data attributes. Not the jquery-ujs documentation.

That aside, the next link is more helpful, taking you to [the wiki]. This page only really works if you know what you're looking for: the third link, titled "Unobtrusive scripting support for jQuery"—although I've found that by this point, most people who don't already know where to go have given up looking.

We've found the documentation! Success.

## data-confirm

This is basically what `data-confirm` does:

```javascript
$(document).on('submit', '[data-confirm]', function (e) {
	var message = $(this).data('confirm');
	if (!confirm(message)) {
		e.preventDefault();
	}
});
```

Uh, thanks guys. For anyone who doesn't know, [this is a confirm box]. You might recognise it from ten years ago.

Confirm boxes are really, really bad. They create a horrible experience for the user—especially if you do it wrong—as they're super invasive, and you can't theme them. [This comment][shitty confirm box] on StackExchange puts it better than I can.

You can take it a step further and say you shouldn't even prompt the user to confirm they want to do something, whether doing it in a prompt, modal, or inline. It's way nicer to prompt the user to undo their action after they've already done it! Here's a great article on A List Apart about the subject: [Never Use a Warning When you Mean Undo].

Please just don't use `data-confirm`.

## The remaining functionality

There are two things left in jquery-ujs that do have uses. The first is `data-disable-with`, which disables submit submit buttons in forms when the form is submitted.

Basically, this:

```javascript
$(document).on('submit', 'form', function () {
  $(this)
    .find('[data-disable-with]')
    .each(function () {
      var $this = $(this);

      $this
        .text($this.data('disable-with'))
        .prop('disabled', true);
    });
});
```

There we go, you no longer need jquery-ujs for that.

The last thing jquery-ujs does—and its best feature, in my opinion, is `data-remote`, which takes an ordinary form and makes it submit using AJAX—super useful. It also creates a number of events, which have [their own page on the wiki][data-remote events] (helpfully titled "ajax").

[eldarion-ajax], previously called bootstrap-ajax, is a library which does pretty much the same thing as jquery-ujs's data-remote functionality, with some additional features. [The demo][eldarion-ajax demo] is pretty amazing.


---

In summary, there are a few reasons I don't like jquery-ujs, and no real reasons to use it. It would be better as a number of small libraries instead of one big library, some of its functionality is bad for progressive enhancement, it isn't on npm, and doesn't properly support Bower.

Most of its functionality, such as `data-confirm` and the crazy link to form conversion stuff, just shouldn't be used. The rest can be easily replaced by a few lines of code—which I provided above—and [eldarion-ajax], which provides the same behaviour as `data-remote`.



[jquery-ujs]: https://github.com/rails/jquery-ujs
[kitchen sink]: http://crypt.codemancers.com/posts/2012-05-08-dawn-of-the-kitchen-sink/
[button_to]: http://api.rubyonrails.org/classes/ActionView/Helpers/UrlHelper.html#method-i-button_to
[link_to]: http://api.rubyonrails.org/classes/ActionView/Helpers/UrlHelper.html#method-i-link_to
[buttons, not anchors]: http://davidwalsh.name/html5-buttons
[jquery-ujs PR]: https://github.com/rails/jquery-ujs/pull/380
[UMD]: http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
[window.jQuery]: https://github.com/rails/jquery-ujs/blob/master/src/rails.js#L477
[bad global vars]: https://gist.github.com/hallettj/64478
["data" attributes]: http://www.w3.org/TR/html5/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes
[the wiki]: https://github.com/rails/jquery-ujs/wiki
[this is a confirm box]: http://www.michael-thomas.com/tech/javascript/ex_confirm.htm
[shitty confirm box]: http://programmers.stackexchange.com/a/106039
[Never Use a Warning When you Mean Undo]: http://alistapart.com/article/neveruseawarning
[data-remote events]: https://github.com/rails/jquery-ujs/wiki/ajax
[eldarion-ajax]: https://github.com/eldarion/eldarion-ajax
[eldarion-ajax demo]: http://uk013.gondor.co/
[decoupling]: https://speakerdeck.com/addyosmani/decoupling-javascript-vs-the-world
[decoupling video]: https://vimeo.com/44100359
[progressive enhancement]: http://allinthehead.com/retro/367/why-is-progressive-enhancement-so-unpopular
