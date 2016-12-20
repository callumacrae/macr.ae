---
title: Making a sortable list in Vue
date: 14th October, 2016
---

Last week, I wanted to represent an array as a reorderable list in Vue, where
you could drag and drop the list elements and the array would be changed
accordingly.

Here was my code:

```html
<template>
  <ul>
    <li v-for="item in items">{{ item }}</li>    
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        items: [1, 2, 3, 4]
      };
    } 
  };
</script>
```

I started off trying [vue-sortable], but it didn't reorder the original array:

<iframe src='https://gfycat.com/ifr/WelltodoEvenAllosaurus' frameborder='0' scrolling='no' width='640' height='271' style="max-width: 100%"></iframe>

I dug into the source of vue-sortable to see if I could send a patch adding 
this functionality, and it turned out it wasn't that complicated a plugin. It
basically just initiated [Sortable] to handle the sorting, which then handles
the rest.

Writing my own directive seemed to be the answer. Adding a directive in Vue is
really simple: you just call `Vue.directive()` with the name of your directive
and an object containing lifecycle methods, and it gives you an HTML element to
work on. The full documentation is here: [Custom Directives - vue.js]. Note
that I'm using Vue 1.0, but it shouldn't be too tricky to adapt this for Vue 2.

To start with, we just register our component and get it to initiate Sortable,
same as vue-sortable does:

```js
import Vue from 'vue';
import Sortable from 'sortablejs';

Vue.directive('sortable', {
  update(options = {}) {
    Sortable.create(this.el, options);
  },
});
```

Once the directive has been added, we can call it the same way vue-sortable is
called:

```markup
<ul v-sortable>
  <li v-for="item in items">{{ item }}</li>
</ul>
```

That seems simple enough, but only achieves what we had previously: in order to
reorder the array, we're going to need to pass in an `onUpdate` function to
Sortable, and accept the original array the list was generated from as a param,
otherwise we can't access it.

```js
import Vue from 'vue';
import Sortable from 'sortablejs';

Vue.directive('sortable', {
  params: ['sorting'],
  update(options = {}) {
    const sorting = this.params.sorting;
    if (sorting) {
      options.onUpdate = function sortableUpdate(e) {
        const deleted = sorting.splice(e.oldIndex, 1);
        sorting.splice(e.newIndex, 0, deleted[0]);
      };
    }

    Sortable.create(this.el, options);
  },
});
```

We're calling splice twice: the first time to remove the item from the array,
and the second time to add the remove element back into the array in its new
position.

Now we pass in `items` as a param, and now reordering the list items also
reorders the array:

```markup
<ul v-sortable :sorting="items">
  <li v-for="item in items">{{ item }}</li>
</ul>
```

<iframe src='https://gfycat.com/ifr/BoldWellmadeDromedary' frameborder='0' scrolling='no' width='640' height='278' style="max-width: 100%"></iframe>

Success!


[vue-sortable]: https://github.com/sagalbot/vue-sortable
[Sortable]: http://rubaxa.github.io/Sortable/
[Custom Directives - vue.js]: http://v1.vuejs.org/guide/custom-directive.html