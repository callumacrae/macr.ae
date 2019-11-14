<template>
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
</template>

<script>
import TitledSection from '@/components/TitledSection';
import * as util from '@/util';

export default {
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
      }
    }
  },
  components: {
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
  opacity: 0.66;
  font-size: 0.9em;
}
</style>
