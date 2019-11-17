<template>
  <div>
    <HomeHero />

    <TitledSection title="Books" :n="0">
      <BookInfo
        link="http://shop.oreilly.com/product/0636920103455.do"
        cover="https://covers.oreillystatic.com/images/0636920103455/lrg.jpg"
        title="Vue.js: Up and Running"
      >
        Get a brisk introduction to building fast, interactive single-page web
        applications with Vue.js, the popular JavaScript framework that
        organizes and simplifies web development. With this practical guide,
        you’ll quickly move from basics to custom components and advanced
        features—including JSX, the JavaScript syntax extension.
        <a href="http://shop.oreilly.com/product/0636920103455.do">
          O'Reilly Shop</a
        >,
        <a
          href="https://www.amazon.co.uk/Vue-js-Up-Running-Callum-Macrae/dp/1491997249"
        >
          amazon.co.uk</a
        >,
        <a href="https://www.amazon.com/_/dp/1491997249">amazon.com</a>
      </BookInfo>

      <BookInfo
        link="http://shop.oreilly.com/product/0636920026280.do"
        cover="https://covers.oreillystatic.com/images/0636920026280/cat.gif"
        title="Learning from jQuery"
      >
        If you’re comfortable with jQuery but a bit shaky with JavaScript, this
        concise guide will help you expand your knowledge of the
        language—especially the code that jQuery covers up for you. Many jQuery
        devotees write as little code as possible, but with some JavaScript
        under your belt, you can prevent errors, reduce overhead, and make your
        application code more efficient.
        <a href="http://shop.oreilly.com/product/0636920026280.do">
          O'Reilly Shop</a
        >,
        <a
          href="http://www.amazon.co.uk/Learning-jQuery-Callum-Macrae/dp/1449335195"
        >
          amazon.co.uk</a
        >,
        <a
          href="http://www.amazon.com/Learning-jQuery-Callum-Macrae/dp/1449335195"
        >
          amazon.com
        </a>
      </BookInfo>
    </TitledSection>

    <TitledSection title="Talks" :n="1">
      <p>@wip</p>
      <ul>
        <li>Front-end Love 2020</li>
        <li>
          Vue.js Amsterdam: Accessibility in Single Page Apps:
          https://www.youtube.com/watch?v=1Rvg_XkFH8Q
        </li>
        <li>Vue.js Toronto</li>
        <li>Vue.js London</li>
        <li>VueConf Poland</li>
        <li>that tiny conference</li>
        <li>meetups? FEL, halfstack, enriques</li>
      </ul>
    </TitledSection>

    <TitledSection title="Articles" :n="2">
      <ul class="articles">
        <li v-for="article in limitedArticles" :key="article.attributes.path">
          <router-link :to="`article/${article.attributes.path}`">
            {{ article.attributes.title }}
          </router-link>
          <time :datetime="article.attributes.date.toISOString()">
            {{ article.attributes.date | niceDate }}
          </time>
          <blockquote>{{ article.attributes.description }}</blockquote>
        </li>

        <li v-if="articles.length > 5 && !showAll" class="show-more">
          <a @click="showAll = true">Show more…</a>
        </li>
      </ul>
    </TitledSection>
  </div>
</template>

<script>
import BookInfo from '@/components/BookInfo';
import HomeHero from '@/components/HomeHero';
import TitledSection from '@/components/TitledSection';
import * as util from '@/util';

export default {
  metaInfo: {
    title: 'Callum Macrae',
    titleTemplate: null
  },
  data: () => ({
    showAll: false
  }),
  computed: {
    articles() {
      return util.getArticles();
    },
    limitedArticles() {
      return this.showAll ? this.articles : this.articles.slice(0, 5);
    }
  },
  components: {
    BookInfo,
    HomeHero,
    TitledSection
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/colors';

.articles {
  list-style-type: none;
  padding-left: 0;

  li:not(:first-child) {
    margin-top: 1.5em;
  }

  li:not(.show-more) a {
    position: relative;

    padding-bottom: 4px;

    font-weight: bold;
    text-decoration: none;

    &::after {
      position: absolute;
      top: 100%;

      display: block;
      content: '';
      width: 140px;
      height: 4px;
      background-color: $pink;

      transition: width 400ms;
    }
  }

  li:not(.show-more):hover a::after {
    width: 100%;
  }

  time {
    float: right;
    font-style: italic;
    font-size: 10pt;
    color: #666;
  }

  .show-more a {
    font-size: 0.8em;
    color: #666;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
