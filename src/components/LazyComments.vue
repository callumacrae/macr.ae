<template>
  <div class="container comments">
    <div v-if="['new', 'loading'].includes(status)" class="comments__button">
      <button @click="viewComments">
        {{ status === 'new' ? 'View Disqus comments' : 'Loading…' }}
      </button>
    </div>

    <!-- v-show to allow Disqus to initialise in background -->
    <div v-show="status === 'loaded'" id="disqus_thread"></div>
  </div>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data: () => ({
    status: 'new'
  }),
  methods: {
    viewComments() {
      this.status = 'loading';

      const handleLoaded = () => {
        this.status = 'loaded';
      };

      window.disqus_config = function() {
        // Use urls from old site!
        this.page.url = `http://macr.ae/article/${this.slug}.html`;

        this.callbacks.onReady.push(handleLoaded);
      };

      // prettier-ignore
      (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://macrae.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
.comments {
  margin-top: 100px;

  &__button {
    text-align: center;
  }
}
</style>
