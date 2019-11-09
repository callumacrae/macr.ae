<template>
  <section class="section" :class="`section--${n}`">
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

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    n: {
      type: Number
    }
  },
  data() {
    const startPositions =
      this.n % 0 ? { left: 10, right: 50 } : { left: 50, right: 10 };

    return {
      i: Math.round(Math.random() * 1e5), // Start at random position
      startPositions,
      // positions can be 0 to 60
      positions: Object.assign({}, startPositions)
    };
  },
  mounted() {
    requestAnimationFrame(this.frame);
  },
  destroyed() {
    cancelAnimationFrame(this.frame);
  },
  methods: {
    frame() {
      this.i++;

      this.positions.left =
        this.startPositions.left + Math.sin(this.i / 900) * 10;
      this.positions.right =
        this.startPositions.right + Math.sin(this.i / 500) * 10;

      requestAnimationFrame(this.frame);
    }
  },
  computed: {
    headerClipPath() {
      const positionLeft = util.roundDp(this.positions.left, 3);
      const positionRight = util.roundDp(this.positions.right, 3);

      let top = '0 0%, 100% 0%';

      if (this.n > 0) {
        top = `0% calc(0% + ${positionLeft}px), 100% calc(0% + ${positionRight}px)`;
      }

      return `polygon(
        ${top},
        100% calc(100% - ${60 - positionRight}px),
        0% calc(100% - ${60 - positionLeft}px)
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
