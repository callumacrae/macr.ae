<template>
  <div>
    <slot v-if="loaded"></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    loaded: false
  }),
  mounted() {
    setTimeout(() => {
      if (!window.IntersectionObserver) {
        this.loaded = true;
        return;
      }

      this.observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            this.loaded = true;
            this.observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );

      this.observer.observe(this.$el);
    });
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
</script>
