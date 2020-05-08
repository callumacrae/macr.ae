<template>
  <div>
    <TitledSection title="Callum Macrae" link-back :n="0">
      <h1>{{ article.attributes.title }}</h1>

      <time
        class="article-date"
        :datetime="article.attributes.date.toISOString()"
      >
        {{ article.attributes.date | niceDate }}
      </time>

      <div v-html="article.body" class="article"></div>
    </TitledSection>

    <LazyComments :slug="$route.params.slug" />

    <p class="text-center">
      <router-link to="/">« Return to home</router-link>
    </p>

    <TheFooter :n="1" />
  </div>
</template>

<script>
import LazyComments from '@/components/LazyComments';
import TheFooter from '@/components/TheFooter';
import TitledSection from '@/components/TitledSection';
import * as util from '@/util';

export default {
  metaInfo() {
    const meta = [
      { name: 'og:type', content: 'article' },
      { name: 'og:url', content: `https://macr.ae${this.$route.path}` },
      {
        name: 'og:title',
        content: this.article.attributes.title
      }
    ];

    if (this.article.attributes.description) {
      meta.push(
        {
          name: 'description',
          content: this.article.attributes.description
        },
        {
          name: 'og:description',
          content: this.article.attributes.description
        }
      );
    }

    if (this.article.attributes.image) {
      meta.push({
        property: 'og:image',
        content: `/article-images/${this.article.attributes.image}`
      });
    }

    return {
      title: this.article.attributes.title,
      meta
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    article() {
      const articles = util.getArticles();
      const slug = this.$route.params.slug;

      return articles.find(article => article.attributes.path === slug);
    }
  },
  watch: {
    $route: 'init'
  },
  methods: {
    init() {
      if (this.$route.path.includes('sorting-algorithms')) {
        import(
          /* webpackChunkName: "sorting-algos" */ '../article-js/sorting-algorithms'
        ).then(({ default: init }) => {
          init();
        });
      } else if (this.$route.path.includes('transform-when')) {
        import(
          /* webpackChunkName: "transform-when" */ '../article-js/transform-when'
        ).then(({ default: init }) => {
          init();
        });
      } else if (this.$route.path.includes('covid-tracker-in-vue')) {
        import(
          /* webpackChunkName: "transform-when" */ '../article-js/covid-tracker-in-vue'
        ).then(({ default: init }) => {
          init();
        });
      }
    }
  },
  components: {
    LazyComments,
    TheFooter,
    TitledSection
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}

.article-date {
  display: block;
  margin-top: 0.5em;
  margin-bottom: 2em;
  opacity: 0.75;
  font-size: 0.9em;
}
</style>
