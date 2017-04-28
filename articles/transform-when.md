---
title: Interactive animations with transform-when
date: 1st March 2017
description: transform-when is a library I wrote at SamKnows that allows you to combine a number of variables—scroll position, time, and user actions—to create beautiful, performant animations. This article demonstrates some of the functionality of the library.
---

<link rel="stylesheet" href="/assets/build/transform-when.css">

![](https://camo.githubusercontent.com/74e76f488000f2bdd64c1f115473aeda8ecb9058/68747470733a2f2f6769616e742e6766796361742e636f6d2f536361726365496d6167696e61746976654c616d707265792e676966)

When working on the new homepage for [SamKnows.com], we decided to do something that none of us had ever seen before: create an animation that combined both time and the users position on the page to tell the story of SamKnows in an interactive, fun way. When researching how to develop this, I discovered that the technique is called "scrollytelling", and is a technique used mostly in journalism to tell a story. Unfortunately, most of the examples I found were quite laggy—especially on my 4K display—and didn't even attempt the animation on mobile.

This wasn't good enough for us.

I set out to create a library that could satisfy all the following:

- Combines a number of variables: in our case, scroll position, time, and user actions (such as clicking or arriving at a certain position on the page).
- Work with both SVGs and normal HTML elements.
- Produce a highly performant animation that works on any screen size.
- Work perfectly on a mobile device without lagging or using an excessive amount of battery.

As demonstrated by the completed home page, I succeeded! We've published it as an open source library on GitHub: [samknows/transform-when].

So, let's take it for a spin.

### Demo

You'll need JavaScript enabled for this.

Let's draw a circle to demonstrate when-scroll on (if you haven't already, scroll down).

<div class="transform" data-transform="draw-circle">
    <strong class="start">Start transform</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong class="end">End transform</strong>
</div>

#### Animating on scroll

transform-when currently supports animating by three different variables: the users scroll position on the page (useful for parallax animations), time (useful for traditional animations) and user actions (such as clicking a button or the page load completing).

Let's look at animating on scroll, first. Let's change the colour of this circle and make it slightly smaller:

<div class="transform" data-transform="scroll">
    <strong class="start">Start transform</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong class="end">End transform</strong>
</div>

Neat. We changed the fill using CSS, and the scale using a transform.

#### Animation through time

The second variable transform-when can animate by is time: this is provided using a variable called `i`, which simply counts up one every frame (so, in a performant animation, about once every 16ms). If you want an actual time, you can do that yourself using `Date.now()`.

To demonstrate this, let's make the circle rotate. Wait, what? Okay, let's also turn it into a square so that we can see that it is rotating:

<div class="transform" data-transform="time">
    <strong class="start">Start transform</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong>&nbsp;</strong>
    <strong class="end">End transform</strong>
</div>

#### Animation on user action

Finally, the third variable is "actions", generally triggered by the user. They're called by calling `transform.trigger('action-name', 1000)` where `transform` is the object returned by the transformer.

An action could be triggered by anything you choose. For examples, it could be the press of a button, it could be when a timer runs out, or it could be triggered when the user reaches a certain point on the page using a library like <a href="https://github.com/callumacrae/when-scroll">when-scroll</a>.

To see an example of an action, click on the square or <a href="#action" class="trigger-action">this link</a>.

<small>(When you scroll past this point, the animation might start to get a bit jerky: it's one of the share buttons or Disqus. Not sure why.)</small>

### transform-when

transform-when can be used to power animations that take a number of variables—scroll position, time, and user actions—to produce an efficient, performant animation on both desktop and mobile devices.

You can find it on GitHub at [samknows/transform-when] and you can see an example of where we're using on the front page of [SamKnows.com].

----

If you want to work on stuff like this, we're looking to hire a front-end developer right now! Drop me an email at <callum@samknows.com> or find the job description [on our careers site](https://samknows.com/company/careers/front-end-developer).

<svg class="arrow" width="108" height="304" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 304" >
	<polyline class="st0" points="105,254.2 54,301 3,254.2 	"/>
	<line class="st0" x1="54" y1="301" x2="54" y2="3"/>
</svg>

<svg class="demo" width="210" height="210" viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">
    <rect transform="translate(105 105)" x="-70" y="-70" width="140" height="140" rx="70" ry="70" />
</svg>

<script src="/assets/build/transform-when.js"></script>


[SamKnows.com]: https://www.samknows.com/
[samknows/transform-when]: https://github.com/samknows/transform-when