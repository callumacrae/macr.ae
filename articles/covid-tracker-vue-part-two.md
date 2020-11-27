---
title: "Building an animated COVID-19 tracker using Vue.js: part two"
date: 2020-06-08
description:
  Did you know that you can use Vue.js to create interactive, animated
  visualisations using SVGs? This article will explore how you can do just that,
  by building an animated COVID-19 tracker.
image: covid-tracker.png
---

This is part two of a two-part mini-series about how you can use Vue and SVG to
build an animated COVID-19 tracker.

- [Part one](/article/covid-tracker-vue-part-one) contained a brief primer to
SVG and built a static chart using SVG and Vue.
- Part two shows how to animate it the chart built in part one.

The code for the entire article can be found on GitHub:
[callumacrae/covid-visualisations](https://github.com/callumacrae/covid-visualisations).

On with the article!

---

## The static chart

In part one after a quick SVG primer, we downloaded some open source COVID-19
data from GitHub, transformed it into the data we actually wanted to visualise,
and created the following chart:

<div class="covid-full-data">
  <svg
    width="760" height="410"
    viewBox="0 0 760 410"
    xmlns="http://www.w3.org/2000/svg">
    <g
      v-for="({ country, value, position }) in chartData"
      :transform="`translate(0, ${position * 60})`">
      <rect :x="barStart" :width="barWidthSpaced(value)" height="50" fill="hsl(10, 80%, 70%)" />
      <text :x="barStart - 10" y="25" dominant-baseline="middle" text-anchor="end">{{ country }}</text>
      <text
        y="25"
        dominant-baseline="middle"
        :x="barStart + barWidthSpaced(value)"
        :fill="value < maxValue * 0.8 ? 'black' : 'white'"
        :text-anchor="value < maxValue * 0.8 ? 'start' : 'end'"
        :transform="`translate(${value < maxValue * 0.8 ? '' : '-'}10, 0)`"
      >
        {{ value }}
      </text>
    </g>
  </svg>
  <day-input
    v-model="day"
    :dates="dates"
    :animation-duration="0.3"
  />
</div>

While it isn't fully static as you can interact with the chart to pan through
the data, it isn't animated, either - let's look at that now.

## Animating the chart

Now that we've got a chart displaying data for specified days, let's look at
animating it when the day is changed.

We want to animate the following things:

- When the countries change order, their position should be transitioned.
- When a new country sees their first case, it should fade in (and vice versa if
  going through the data backwards).
- When a countries case count increases or decreases, the bar width should
  change smoothly.

Vue's
[list transitions](https://vuejs.org/v2/guide/transitions.html#List-Transitions)
can help us with the first two, but it can't really help us with the width
change, as that's a state transition.

Before we start animating the chart, let's move the bar logic into a separate
component which will be passed the value and be responsible for the width - that
means the animation will also happen inside the component.

Let's call our component `ChartBar` and give it the following API:

```html
<ChartBar
  v-for="({ country, value }, i) in chartData"
  :transform="`translate(0, ${i * 60})`"
  :country="country"
  :chart-width="chartWidth"
  :max-value="maxValue"
  :value="value"
/>
```

We could also pass in `i` and have the component be responsible for its own
positioning, but I decided it would be better outside the component. It doesn't
really make much difference!

Here's the source for the new component:

```html
<template>
  <g>
    <rect :x="barStart" :width="barWidth" height="50" />
    <text y="25" :x="barStart - 10">
      {{ country }}
    </text>
    <text y="25" :x="barStart + barWidth">
      {{ value }}
    </text>
  </g>
</template>

<script>
  export default {
    props: {
      country: { type: String, required: true },
      chartWidth: { type: Number, required: true },
      maxValue: { type: Number, required: true },
      value: { type: Number, required: true }
    },
    data: () => ({ barStart: 150 }),
    computed: {
      barWidth() {
        return (this.chartWidth - this.barStart) /
          this.maxValue * this.value;
      }
    }
  };
</script>
```

(I promise this the longest code block of the article)

### List enter and leave transitions

Let's start by fading in countries when they're added and fading them out again
when they're removed.

Vue has a bunch of helpers built for animating and transitioning content. You
can find the full documentation for it here:
[Transitions & Animation](https://vuejs.org/v2/guide/transitions.html).

The list enter and leave transitions in particular are what we will be using
here. In fact, there's an example in the documentation which is almost exactly
what we want to do, just with HTML instead of SVG (which has implications we'll
get to in a bit!)

Using Vue's list transitions is usually pretty straightforward. To start with,
let's wrap the `<ChartBar>` element with a `<transition-group>` component:

```html
<transition-group name="country-list" tag="g">
  <ChartBar
    v-for="({ country, value }, i) in chartData"
    class="country"
    :transform="`translate(0, ${i * 60})`"
    :country="country"
    :max-value="maxValue"
    :value="value"
    :chart-width="chartWidth"
    :key="country"
  />
</transition-group>
```

Now, when an element enters or leaves the DOM, Vue will add a class that we can
use to apply a CSS transition to the change.

Let's add the following CSS to our main file (not the ChartBar component) to
utilise the classes Vue is adding:

```css
.country {
  transition: opacity 0.3s linear;
}
.country-list-enter,
.country-list-leave-to {
  opacity: 0;
}
```

`.country-list-enter` is added before the element is added to the DOM and
removed immediately afterwards, so the element will fade in, and
`.country-list-leave-to` is added when an element is going to be removed, so the
element will fade out.

Here's where we're at now:

<div class="covid-full-data">
  <svg
    width="760" height="410"
    viewBox="0 0 760 410"
    xmlns="http://www.w3.org/2000/svg">
    <transition-group name="country-list" tag="g">
      <chart-bar
        v-for="{ country, value, position } in chartData"
        class="country-enter-leave"
        :transform="`translate(0, ${position * 60})`"
        :country="country"
        :max-value="maxValue"
        :value="value"
        :chart-width="chartWidth"
        :key="country"
      />
    </transition-group>
  </svg>
  <day-input
    v-model="day"
    :dates="dates"
    :animation-duration="0.3"
  />
</div>

It's easier to see the affect if you go to day one and click forwards from
there, as that's when most countries start appearing.

### List move transitions?

Vue contains "list move transition" functionality where it applies
[the FLIP technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/)
to elements being reordered to smoothly transition them to the new position. At
first glance, it looks like it might come in handy here, but it turns out we
don't have to use it in this case as we're positioning groups using `transform`
in the first place.

All we have to do is add a transition for `transform` to the existing `.country`
transition declaration:

```css
.country {
  transition: opacity 0.3s linear,
    transform 0.3s linear;
}
.country-list-enter,
.country-list-leave-to {
  opacity: 0;
}
```

Unfortunately, I ran into
[what looked like an issue with Vue](https://github.com/vuejs/vue/issues/11310)
here and had to make some changes to work around it. While currently `i` is the
index of the country in `chartData` (a sorted array), that caused some strange
unexpected behaviour.

To work around the issue, we have to sort the data in another array and add a
`position` property to the object for each country instead.

Our modified `chartData` function looks like this:

```javascript
chartData() {
  const chartData = Object.entries(data.countryData)
    .map(([country, dataArray]) => {
      return {
        country,
        value: dataArray[this.day]
      };
    })
    .filter(({ value }) => value);

  const sortedData = chartData.slice()
    .sort((a, b) => b.value - a.value);

  return chartData.map(item => ({
    position: sortedData.indexOf(item),
    ...item
  }));
},
```

Now the order of `chartData` isn't changed so the issue won't occur, but we have
to use `position` instead of `i`. Let's go ahead and make that change:

```html
<transition-group name="country-list">
  <ChartBar
    v-for="{ country, value, position } in chartData"
    class="country"
    :transform="`translate(0, ${position * 60})`"
    :country="country"
    :max-value="maxValue"
    :value="value"
    :chart-width="chartWidth"
  />
</transition-group>
```

You could even just call it `i` if you wanted!

Here's the updated demo:

<div class="covid-full-data">
  <svg
    width="760" height="410"
    viewBox="0 0 760 410"
    xmlns="http://www.w3.org/2000/svg">
    <transition-group name="country-list" tag="g">
      <chart-bar
        v-for="{ country, value, position } in chartData"
        class="country-move"
        :transform="`translate(0, ${position * 60})`"
        :country="country"
        :max-value="maxValue"
        :value="value"
        :chart-width="chartWidth"
        :key="country"
      />
    </transition-group>
  </svg>
  <day-input
    v-model="day"
    :dates="dates"
    :animation-duration="0.3"
  />
</div>

We can now see that in addition to elements fading in and out when they're added
and removed, they're also moving up and down smoothly when the countries change
positions.

### Bar width transition

Now for the fun one!

Transitioning the width of the bar is much more complicated than the previous
transitions we've looked at, as it involves transitioning the data itself, not
just an attribute. If we only changed the width of the bar, the numbers
displayed on the visualisation would be wrong.

This is a large part of the reason we created the `ChartBar` component—handling
the transition logic for each bar in the component is a lot simpler than
handling the transition logic for every single bar at the same time in the main
file.

So how do we transition state?

There's a few different ways we can approach this, but the one we'll go for is
as follows:

- Add a new property of the data object of the ChartBar component called
  `tweenedValue` (I'll explain what tweening is in a couple paragraphs).
- Add a watcher watching for when the `value` prop is changed.
- When the `value` prop is changed, transition `tweenedValue` from the old value
  to the new value.
- Use `tweenedValue` instead of `value` in the bar width calculation.

We also have to do the same to the `maxValue` prop to ensure that the bar width
is transitioned smoothly.

To transition a value from one number to another, we could use
`requestAnimationFrame` and transition the value ourselves, but for the sake of
simplicity we'll use one of a number of available tweening libraries to do it
for us.

<small>Sidenote: if you're interested in how this could work without a library,
[check out this codepen](https://codepen.io/callumacrae/pen/oyXXWR) where I
tween the values using `requestAnimationFrame`.</small>

Tweening (short for in-betweening) is the process in animation of generating the
frames between two images, called key frames. For example, if you wanted to
animate an element from one position to another and have it slow down when it's
reaching its destination, a tweening library can help you with that.

In this case, we're not going to use the tweening library to change an element
in the DOM, we're just going to use it to change a value on the data object.

[GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform) is a widely
used animation library that provides pretty much everything you'd need to
animate anything on your website or application. It turns out that its tweening
functionality, in addition to being able to modify DOM elements, can also be
used to smoothly transition values on the Vue data object.

It's important to note at this point that loading all of GSAP just to transition
a number is definitely overkill. There's other smaller libraries that can do a
good job of this, I just wanted to stick with a well known example.

Let's look at a quick example of how this works.

Click this button a couple times to see an example of a tweened number:

<div id="gsap-tweening-example" style="padding: 20px; border: 1px rgba(41, 61, 163, 0.2) solid">
  <p style="margin-top: 0"><code>number</code> is {{ number }}.</p>
  <p><code>tweenedNumber</code> is {{ Math.round(tweenedNumber) }}.</p>
  <button @click="newNumber">Click for a new number</button>
</div>

Here's what happens when we click on the button:

```javascript
this.number = Math.round(Math.random() * 10000);
gsap.to(this.$data, {
  tweenedNumber: this.number
});
```

`this.number` is being set directly to a new random number. This simulates the
`width` prop of the ChartBar component.

We're then calling `gsap.to()` to tell GSAP to tween `tweenedNumber` from its
previous value to the new random number. `this.$data` is the data object of the
current Vue instance - we could also pass it just `this`, but `this.$data` makes
it clearer what is going on.

In affect, GSAP then repeatedly increases or decreases
`this.$data.tweenedNumber` (aka `this.tweenedNumber`) until it equals the value
specified.

---

Now let's apply this in watchers for `width` and `maxWidth`:

```javascript
watch: {
  maxValue(newMax) {
    gsap.to(this.$data, {
      tweenedMaxValue: newMax
    });
  },
  value(newValue) {
    gsap.to(this.$data, {
      tweenedValue: newValue
    });
  }
}
```

And now, after changing the bar width logic to use `tweenedValue` instead of
`value`, this is what we get:

<div class="covid-full-data">
  <svg
    width="760" height="410"
    viewBox="0 0 760 410"
    xmlns="http://www.w3.org/2000/svg">
    <transition-group name="country-list" tag="g">
      <chart-bar
        v-for="{ country, value, position } in chartData"
        class="country-move"
        animated
        :transform="`translate(0, ${position * 60})`"
        :country="country"
        :max-value="maxValue"
        :value="value"
        :chart-width="chartWidth"
        :key="country"
      />
    </transition-group>
  </svg>
  <day-input
    v-model="day"
    :dates="dates"
    :animation-duration="0.3"
  />
</div>

Nice!

The final piece is to display the tweened number on the bar instead of the
actual value, so that it increases as the bar changes width. To do that, we'll
also need to round it.

Here is our complete COVID-19 tracker, animated and interactive:

<div class="covid-full-data">
  <svg
    width="760" height="410"
    viewBox="0 0 760 410"
    xmlns="http://www.w3.org/2000/svg">
    <transition-group name="country-list" tag="g">
      <chart-bar
        v-for="{ country, value, position } in chartData"
        class="country-move"
        animated
        value-animated
        :transform="`translate(0, ${position * 60})`"
        :country="country"
        :max-value="maxValue"
        :value="value"
        :chart-width="chartWidth"
        :key="country"
      />
    </transition-group>
  </svg>
  <day-input
    v-model="day"
    :dates="dates"
    :animation-duration="0.3"
  />
</div>

You can now see that when you change the day, the numbers are animated as well
as the bar widths.

The code on GitHub contains a couple extra features such as configurable
animation time and smarter bar heights—here's the link again:
[callumacrae/covid-visualisation](https://github.com/callumacrae/covid-visualisations).

---

So what have we learned here?

- SVG allows us to draw shapes embedded in our HTML documents, which enables us
  to create visualisations.
- As SVG can be embedded directly in our HTML documents, we can use Vue
  templates to generate SVGs.
- `<transition-group>` works in SVGs as well, and we can use it to fade elements
  in an out, just like with HTML.
- CSS transitions also work just fine in SVGs, which was useful for animating
  positions when elements were being reordered.
- Finally, while Vue doesn't provide us with any help here, animating state
  doesn't have to be difficult, especially if we use the help of a library like
  GSAP.

There's loads of other potential applications for this, and not just in data
visualisation. In a future article I hope write about how you can use d3-shape
directly with Vue to display and visualise data on a world map. If that's
something you'd be interested in, make sure to
[follow me on Twitter](https://twitter.com/callumacrae) so that you can see when
I post it.

I hope you found this useful, and stay safe!

<small>Big thanks to [Darek Gusto](https://twitter.com/gustojs) and
[Bartosz Trzos](https://twitter.com/remotelydev) for proof reading this
article!</small>
