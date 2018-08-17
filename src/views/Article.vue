<template>
  <home-section title="Callum Macrae" :i="0">
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
