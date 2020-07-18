export default {
  data: () => ({
    i: Math.round(Math.random() * 1e5), // Start at random position
    isIntersecting: false,
    isIE: navigator.userAgent.includes('Trident')
  }),
  mounted() {
    if (!window.IntersectionObserver) {
      return;
    }

    if (this.isIE) {
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      this.isIntersecting = entry.isIntersecting;
    });

    this.observer.observe(this.$refs.animated);

    requestAnimationFrame(this.frame);

    this.$nextTick(() => {
      this.i++;
    });
  },
  destroyed() {
    cancelAnimationFrame(this.frame);

    this.observer.disconnect();
  },
  methods: {
    frame() {
      // DISABLED because of high CPU and GPU usage
      return;

      // requestAnimationFrame(this.frame);

      // if (this.isIntersecting) {
      //   this.i++;
      // }
    }
  }
};
