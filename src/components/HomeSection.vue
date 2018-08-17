<template>
  <section class="section" :class="`section--${i}`">
    <header :style="{ clipPath: headerClipPath }">
      <h2>{{ title }}</h2>
    </header>

    <div class="section__content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import * as util from '@/util';

const randomPositions = () => ({
  left: Math.random() * 20 + 10,
  right: Math.random() * 20 + 10
});

const randomMotion = () => ({
  left: 0.017 * (Math.random() < 0.5 ? -1 : 1),
  right: 0.005 * (Math.random() < 0.5 ? -1 : 1)
});

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    i: {
      type: Number
    }
  },
  data: () => ({
    positions: randomPositions(),
    motion: randomMotion()
  }),
  mounted() {
    requestAnimationFrame(this.frame);
  },
  destroyed() {
    cancelAnimationFrame(this.frame);
  },
  methods: {
    frame() {
      this.positions.left += this.motion.left;
      this.positions.right += this.motion.right;

      if (Math.random() < 0.002) {
        this.positions = randomPositions();
        this.motion = randomMotion;
      } else {
        if (this.positions.left > 30 || this.positions.left <= 0) {
          this.motion.left *= -1;
        }
        if (this.positions.right > 30 || this.positions.right <= 0) {
          this.motion.right *= -1;
        }
      }

      requestAnimationFrame(this.frame);
    }
  },
  computed: {
    headerClipPath() {
      const offsetLeft = util.roundDp(this.positions.left, 3);
      const offsetRight = util.roundDp(this.positions.right, 3);

      let top = '0 0%, 100% 0%';

      if (this.i > 0) {
        // top = `0% calc(0% + ${30 - offsetRight}px), 100% calc(0% + ${30 - offsetLeft}px)`;
        top = `0% calc(0% + ${offsetLeft +
          (this.i % 2 ? 0 : 30)}px), 100% calc(0% + ${offsetRight +
          (this.i % 2 ? 30 : 0)}px)`;
      }

      return `polygon(
        ${top},
        100% calc(100% - ${offsetLeft +
          (this.i % 2 ? 0 : 30)}px), 0% calc(100% - ${offsetRight +
        (this.i % 2 ? 30 : 0)}px)
      )`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/colors';

.section {
  margin-top: 100px;

  header {
    margin-bottom: 50px;
    padding: 80px 20px;

    text-align: center;

    background-color: $blue;

    h2 {
      font-size: 60px;

      color: $pink;
    }
  }

  &__content {
    width: 800px;
    margin: 0 auto;
  }

  &--0 {
    margin-top: 0;

    header {
      padding-top: 50px;
    }
  }
}
</style>
