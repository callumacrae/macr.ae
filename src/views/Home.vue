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
      <ul class="articles">
        <li v-for="talk in talks" :key="talk.title">
          <h3>{{ talk.title }}</h3>
          <time :datetime="talk.date.toISOString()">
            {{ talk.date | niceDate }}
          </time>
          <blockquote>
            <p v-if="talk.event">
              Event{{ talk.event.includes(',') ? 's' : '' }}: {{ talk.event }}
            </p>
            <TruncatedText :text="talk.description" />
            <p v-if="talk.video">
              Video:
              <a :href="talk.video" target="_blank" rel="noopener">
                {{ talk.video }}
              </a>
            </p>
          </blockquote>
        </li>
      </ul>
      <p>This list is incomplete!</p>
    </TitledSection>

    <TitledSection title="Articles" :n="2">
      <ul class="articles">
        <li v-for="article in limitedArticles" :key="article.attributes.path">
          <router-link :to="`article/${article.attributes.path}`">
            <h3>{{ article.attributes.title }}</h3>
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
import TruncatedText from '@/components/TruncatedText';
import * as util from '@/util';

export default {
  metaInfo: {
    title: 'Callum Macrae',
    titleTemplate: null,
    meta: [
      {
        name: 'description',
        content:
          'Callum Macrae is a developer and occasional musician based in London, UK, with a passion for using JavaScript to solve complicated problems.'
      }
    ]
  },
  data: () => ({
    showAll: false,
    talks: [
      {
        title: 'Vue.js and SVG',
        date: new Date(2020, 3, 9),
        event: 'Vue.js Amsterdam Virtual Meetup',
        description:
          'In addition to being able to use Vue.js to generate HTML documents, you can also use it to display SVGs. This talk will demonstrate how you can do just that!',
        video: 'https://youtu.be/wJIU6ApgzTI?t=5080'
      },
      {
        title: 'Battle of the Frameworks meetup',
        date: new Date(2020, 3, 1),
        description:
          'Battle of the Frameworks was a meetup hosted by Orbis Connect with three speakers; one representing React; one representing Angular, and one representing Vue.js.',
        video: 'https://www.crowdcast.io/e/battle-of-the-frameworks'
      },
      {
        title: 'Climate change and the tech community',
        date: new Date(2020, 1, 20),
        event: 'Vue.js Amsterdam 2020',
        description:
          'The internet is responsible for about the same level of carbon emissions as the aviation industry. This talk looks at the impact we as a community are having on the environment and what measures we can take to reduce it.',
        video: 'https://www.youtube.com/watch?v=rs1CY8ChF6U'
      },
      {
        title: 'Data visualisation and Vue.js',
        date: new Date(2018, 0, 10),
        event: 'London AJAX, Front-end London',
        description:
          "Vue.js is the latest big front-end framework. It's blazingly fast, easy to learn, and a valuable tool to have in your arsenal. Did you know you can work with SVGs directly in your Vue.js templates? This talk will explain the basics of Vue, explore some of the things you can do with SVGs, and show you how you can visualise some simple data without using a library like d3 or Highcharts."
      },
      {
        title: 'Accessibility in Single Page Apps',
        date: new Date(2017, 5, 22),
        event:
          'VueConf Poland (2017), Vue Toronto (2018), and Vue.js Amsterdam (2019)',
        description: [
          "As developers, we have a responsibility to make sure that as many people as possible can use the websites and applications that we create. But with a new generation of websites—single page applications—come a new set of challenges for users with disabilities, and the assistive technology they use to browse the web. Client-side routing, custom input elements, and shiny animated content: all things that screen readers can struggle with if the developer who implemented it didn't consider accessibility.\n\n",
          "During this talk, I'll explain what we as developers can do to ensure that our single page applications are usable by everyone, including people who might not use a keyboard, mouse and screen like the majority of us do. I'll show how some assistive technology is used, and demonstrate how some common mistakes we make affect people using that assistive technology."
        ],
        video: 'https://www.youtube.com/watch?v=1Rvg_XkFH8Q'
      },
      {
        title: 'Building with Gulp',
        date: new Date(2015, 1, 10),
        event: 'London Ajax',
        description:
          'Gulp is a build tool which you can use to automate tasks involved in the development of a website, such as compiling Sass, minifying JavaScript, and generating sprites. The talk will introduce Gulp and some of the things you can do with it, and will also explain some of the differences between the current version of Gulp and the upcoming version of Gulp, Gulp 4.'
      }
    ]
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
    TitledSection,
    TruncatedText
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/variables';

.articles {
  list-style-type: none;
  padding-left: 0;

  li:not(:first-child) {
    margin-top: 1.5em;
  }

  li:not(.show-more) a {
    text-decoration: none;

    > h3 {
      color: inherit;
    }
  }

  li:not(.show-more) h3 {
    position: relative;

    display: inline;
    padding-bottom: 4px;

    font-size: 1em;
    font-family: inherit;
    font-weight: bold;

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

  li:not(.show-more):hover h3::after {
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
