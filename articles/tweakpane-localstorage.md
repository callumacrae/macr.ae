---
title: 'Persisting tweakpane settings using localStorage'
date: 2023-01-19
description: helo write description pls
---

I love [Tweakpane]! I use it when working on [my Codepens] and other visual
works, to tweak variables until things look just how I want them.

Open "Controls" on the top right to see an example here:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="poZpbPY" data-user="callumacrae" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/callumacrae/pen/poZpbPY">
  Pickup sticks</a> by Callum Macrae (<a href="https://codepen.io/callumacrae">@callumacrae</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

I kept finding myself setting the same settings again and again because they
weren't persisting across page reloads, so I wrote some code to persist various
things using local storage. I don't think it can be done as a plugin but if I'm
wrong, let me know!

Let's take a basic Tweakpane setup:

```js
const config = {
  number: 5,
  string: 'hello world',
  color: 0xff0000
};

const pane = new Pane({
  title: 'Controls',
});

pane.addInput(config, 'number', { min: 0, max: 10 });
pane.addInput(config, 'string');
pane.addInput(config, 'color', { view: 'color' });
```

To persist config across page reloads, you can use a combination of Tweakpane's
events and import/export functionality, both of which are documented on [this
page][tweakpane misc].

The first change we'll make is to store the config in local storage when any
input is changed:

```js
pane.on('change', () => {
  const preset = JSON.stringify(pane.exportPreset());
  localStorage.setItem('tweakpane-preset', preset);
});
```

Then, on page load, we can check local storage for an existing preset and
import it into tweakpane if it exists:

```js
const preset = localStorage.getItem('tweakpane-preset');
if (preset) {
  try {
    pane.importPreset(JSON.parse(preset));
  } catch (err) {
    console.error('Failed to set from preset', err);
  }
}
```

Note that this has to be done *after* you've added your inputs as tweakpane
ignores properties that it doesn't know about.

The final code looks like this:

```js
const config = {
  number: 5,
  string: 'hello world',
  color: 0xff0000
};

const pane = new Pane({
  title: 'Controls',
});

pane.on('change', () => {
  const preset = JSON.stringify(pane.exportPreset());
  localStorage.setItem('tweakpane-preset', preset);
});

pane.addInput(config, 'number', { min: 0, max: 10 });
pane.addInput(config, 'string');
pane.addInput(config, 'color', { view: 'color' });

const preset = localStorage.getItem('tweakpane-preset');
if (preset) {
  try {
    pane.importPreset(JSON.parse(preset));
  } catch (err) {
    console.error('Failed to set from preset', err);
  }
}
```

## Remembering whether the pane is expanded or not

This one is a bit easier! We can use the `fold` event and `expanded` property
for this:

```js
const pane = new Pane({
  title: 'Controls',
  expanded: localStorage.getItem('tweakpane-closed') !== 'true',
});

pane.on('fold', ({ expanded }) => {
  localStorage.setItem('tweakpane-closed', String(!expanded));
});
```

## Adding a reset button

Finally, I found it useful to add a button to reset the settings back to the
config specified in the code, for when I _don't_ want the settings to persist
anymore.

It can be done in two steps: first, copy the initial config object so that we
can know what it used to be after `config` is changed by tweakpane. I chose
to use JSON.stringify to do this for simplicity - using a function to do an
actual deep copy of the object would also work, but be aware that you need to
do it every time the button is clicked, not just on initialisation.

```js
const config = {
  number: 5,
  string: 'hello world',
  color: 0xff0000
};
const initialConfig = JSON.stringify(config);
```

Then, add a button to handle the reset functionality:

```js
pane.addButton({ title: 'Reset' }).on('click', () => {
  pane.importPreset(JSON.parse(initialConfig));
});
```

Now, clicking the reset button will reset the settings to their initial values
before they were changed.

## Putting it all together

The final code with the persisting settings, persisting fold settings, and reset
button looks like this:

```js
const config = {
  number: 5,
  string: 'hello world',
  color: 0xff0000
};
const initialConfig = JSON.stringify(config);

const pane = new Pane({
  title: 'Controls',
  expanded: localStorage.getItem(`closed-${location.pathname}`) !== 'true',
});

pane.on('fold', ({ expanded }) => {
  localStorage.setItem('tweakpane-closed', String(!expanded));
});
pane.on('change', () => {
  const preset = JSON.stringify(pane.exportPreset());
  localStorage.setItem('tweakpane-preset', preset);
});

pane.addInput(config, 'number', { min: 0, max: 10 });
pane.addInput(config, 'string');
pane.addInput(config, 'color', { view: 'color' });

pane.addButton({ title: 'Reset' }).on('click', () => {
  pane.importPreset(JSON.parse(initialConfig));
});

const preset = localStorage.getItem('tweakpane-preset');
if (preset) {
  try {
    pane.importPreset(JSON.parse(preset));
  } catch (err) {
    console.error('Failed to set from preset', err);
  }
}
```

All code in this article is freely released under the [MIT] license.

Happy tinkering!

[Tweakpane]: https://cocopon.github.io/tweakpane/
[My codepens]: https://codepen.io/callumacrae
[tweakpane misc]: https://cocopon.github.io/tweakpane/misc/
[MIT]: https://opensource.org/licenses/MIT
