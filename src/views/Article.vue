<template>
  <home-section title="Callum Macrae" :n="0">
    <h1>{{ article.attributes.title }}</h1>

    <time class="article-date" :datetime="article.attributes.date.toISOString()">{{ article.attributes.date | niceDate }}</time>

    <div v-html="article.body"></div>
  </home-section>
</template>

<script>
import HomeSection from '@/components/HomeSection';
import * as util from '@/util';

export default {
  computed: {
    article() {
      const articles = util.getArticles();
      const slug = this.$route.params.slug;

      return articles.find(article => article.attributes.path === slug);
    }
  },
  components: {
    HomeSection
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
