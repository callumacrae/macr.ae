<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    this.init();
  },
  watch: {
    $route: 'init'
  },
  methods: {
    init() {
      if (typeof document === 'undefined') {
        return;
      }

      // @todo use vue-meta for this
      document.body.classList.toggle(
        'transform-when',
        this.$route.path.includes('transform-when')
      );
    }
  }
};
</script>

<style src="./scss/style.scss" lang="scss"></style>
