<template>
  <div class="book">
    <a :href="link">
      <LazyContent>
        <img :src="cover" :alt="title" />
      </LazyContent>
    </a>
    <h3>{{ title }}</h3>
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
import LazyContent from '@/components/LazyContent';

export default {
  props: {
    link: {
      type: String
    },
    cover: {
      type: String
    },
    title: {
      type: String
    }
  },
  components: { LazyContent }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/variables';

.book {
  img {
    width: 180px;
    transition: box-shadow 400ms;
  }

  h3 {
    font-size: 1.5em;
  }

  &:nth-child(odd) img {
    float: left;
    margin-right: 2em;
  }

  &:nth-child(even) img {
    float: right;
    margin-left: 2em;
  }

  &:not(:first-child) {
    margin-top: 100px;
  }

  &:hover {
    &:nth-child(odd) img {
      box-shadow: 10px 10px 0 0 $blue;
    }

    &:nth-child(even) img {
      box-shadow: 10px 10px 0 0 $pink;
    }
  }
}
</style>
