export default {
  data: () => ({
    i: Math.round(Math.random() * 1e5), // Start at random position
    isIntersecting: true,
  }),
  mounted() {
    let observer = new IntersectionObserver(([entry]) => {
      this.isIntersecting = entry.isIntersecting;
    });

    observer.observe(this.$refs.animated);

    requestAnimationFrame(this.frame);
  },
  destroyed() {
    cancelAnimationFrame(this.frame);
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
