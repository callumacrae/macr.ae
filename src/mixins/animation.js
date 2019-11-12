export default {
  data: () => ({
    i: Math.round(Math.random() * 1e5), // Start at random position
    isIntersecting: true,
  }),
  mounted() {
    this.observer = new IntersectionObserver(([entry]) => {
      this.isIntersecting = entry.isIntersecting;
    });

    this.observer.observe(this.$refs.animated);

    requestAnimationFrame(this.frame);
  },
  destroyed() {
    cancelAnimationFrame(this.frame);

    this.observer.disconnect();
  },
  methods: {
    frame() {
      requestAnimationFrame(this.frame);

      if (this.isIntersecting) {
        this.i++;
      }
    }
  }
};
