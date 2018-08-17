<template>
  <div>
    <home-hero />

    <home-section title="Books" :i="0">
      <book
        link="http://shop.oreilly.com/product/0636920103455.do"
        cover="https://covers.oreillystatic.com/images/0636920103455/lrg.jpg"
        title="Vue.js: Up and Running">
        Get a brisk introduction to building fast, interactive single-page web applications with Vue.js, the popular JavaScript framework that organizes and simplifies web development. With this practical guide, you’ll quickly move from basics to custom components and advanced features—including JSX, the JavaScript syntax extension.
        <a href="http://shop.oreilly.com/product/0636920103455.do">O'Reilly Shop</a>,
        <a href="https://www.amazon.co.uk/Vue-js-Up-Running-Callum-Macrae/dp/1491997249">amazon.co.uk</a>,
        <a href="https://www.amazon.com/_/dp/1491997249">amazon.com</a>
      </book>

      <book
        link="http://shop.oreilly.com/product/0636920026280.do"
        cover="https://covers.oreillystatic.com/images/0636920026280/cat.gif"
        title="Learning from jQuery">
        If you’re comfortable with jQuery but a bit shaky with JavaScript, this concise guide will help you expand your knowledge of the language—especially the code that jQuery covers up for you. Many jQuery devotees write as little code as possible, but with some JavaScript under your belt, you can prevent errors, reduce overhead, and make your application code more efficient.
        <a href="http://shop.oreilly.com/product/0636920026280.do">O'Reilly Shop</a>,
        <a href="http://www.amazon.co.uk/Learning-jQuery-Callum-Macrae/dp/1449335195">amazon.co.uk</a>,
        <a href="http://www.amazon.com/Learning-jQuery-Callum-Macrae/dp/1449335195">amazon.com</a>
      </book>
    </home-section>

    <home-section title="Articles" :i="1">
      <ul class="articles">
        <li v-for="article in articles" :key="article.attributes.path">
          <router-link :to="`article/${article.attributes.path}`">{{ article.attributes.title }}</router-link>
          <time :datetime="article.attributes.date.toISOString()">{{ article.attributes.date | niceDate }}</time>
          <blockquote>{{ article.attributes.description }}</blockquote>
        </li>

        <li v-if="articles.length > 5" class="show-more">
          <a href>Show more…</a>
        </li>

      </ul>
    </home-section>
  </div>
</template>

<script>
import Book from '@/components/Book';
import HomeHero from '@/components/HomeHero';
import HomeSection from '@/components/HomeSection';
import * as util from '@/util';

export default {
  data: () => ({
    showAll: false
  }),
  computed: {
    articles() {
      const articles = util.getArticles();
      return this.showAll ? articles : articles.slice(0, 5);
    }
  },
  components: {
    Book,
    HomeHero,
    HomeSection
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

  blockquote {
    font-size: 0.9em;
    line-height: 1.5;
    padding-left: 15px;
    margin: 1.5em 0 2em 15px;
    border-left: 5px rgba(79, 79, 171, 0.25) solid;
  }

  .show-more a {
    font-size: 0.8em;
    color: #666;
    text-decoration: none;
  }
}
</style>
