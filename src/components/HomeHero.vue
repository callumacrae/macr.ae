<template>
  <section
    ref="main"
    class="hero">
    <div ref="animated" class="left-background" :style="{ clipPath: leftBackgroundClipPath }"></div>
    <div class="left">
      <h1>Callum Macrae</h1>

      <div class="left__content">
        <p>I'm a JavaScript developer and occasional musician based in London, UK, working at <a href="https://samknows.com/">SamKnows</a> to make the internet faster for everyone. My current enthusiasms are Vue and SVGs (but only sometimes at the same time).</p>
        <p>I write and speak, some of which you can find below.</p>
        <i class="fas fa-arrow-down fa-2x" data-fa-transform="shrink-6" data-fa-mask="fas fa-circle"></i>
      </div>
    </div>

    <div class="right">
      <h1 ref="rightTitleEl" role="presentation" :style="{ clipPath: rightTitleClipPath }">Callum Macrae</h1>

      <div class="right__content">
        <i class="fab fa-twitter"></i>
        <i class="fab fa-github"></i>
        <i class="fab fa-codepen"></i>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from '@/util';
import animationMixin from '@/mixins/animation';

export default {
  mixins: [animationMixin],
  data() {
    return {
      startPositions:
        Math.random() < 0.5
          ? { top: -25, bottom: 20 }
          : { top: 25, bottom: -20 }
    };
  },
  computed: {
    positions() {
      return {
        top: this.startPositions.top + Math.sin(this.i / 900) * 15,
        bottom: this.startPositions.bottom + Math.sin(this.i / 500) * 15
      };
    },
    leftBackgroundClipPath() {
      const offsetTop = util.roundDp(this.positions.top, 3);
      const offsetBottom = util.roundDp(this.positions.bottom, 3);

      return `polygon(
        0 0%, calc(65% + ${offsetTop}px) 0%,
        calc(65% + ${offsetBottom}px) 100%, 0% 100%
      )`;
    },
    rightTitleClipPath() {
      const mainEl = this.$refs.main;

      // This is a hack to make Vue watch this before mainEl exists
      // It cannot be inlined
      const topPosition = this.positions.top;
      const bottomPosition = this.positions.bottom;

      // Hasn't been added to DOM yet
      if (!mainEl) {
        return;
      }

      const offsetTop = util.roundDp(topPosition, 3);
      const offsetBottom = util.roundDp(bottomPosition, 3);

      const mainRect = mainEl.getBoundingClientRect();
      const rect = this.$refs.rightTitleEl.getBoundingClientRect();
      const rectTop = rect.top - mainRect.top;

      const generatedOffsetTop =
        offsetTop + ((offsetBottom - offsetTop) / mainRect.height) * rectTop;
      const generatedOffsetBottom =
        offsetTop +
        ((offsetBottom - offsetTop) / mainRect.height) *
          (rectTop + rect.height);

      return `polygon(
        calc(65% + ${generatedOffsetTop}px) 0%, 100% 0%,
        100% 100%, calc(65% + ${generatedOffsetBottom}px) 100%
      )`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/colors';

.hero {
  position: relative;
  display: flex;
  height: 100vh;
  min-height: 500px;
  background-color: $orange;
}

h1 {
  font-size: 100px;

  position: absolute;
  top: calc(50% - 220px);
  left: 0;
  width: 100vw;
  text-align: center;
}

.left-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 500px;
  background-color: $purple;
}

.left {
  flex: 0 0 65%;

  color: $orange;

  &__content {
    position: absolute;
    top: calc(50% - 70px);
    left: calc(50% - 400px);
    width: 480px;

    transition: opacity 600ms;

    a[href] {
      color: inherit;

      &:hover {
        text-decoration: none;
      }
    }

    .svg-inline--fa {
      opacity: 0.66;
    }
  }
}

.right {
  flex: 0 0 35%;

  color: $purple;

  &__content {
    position: absolute;
    top: calc(50% - 70px);
    right: calc(50% - 400px);
    width: 200px;

    font-size: 60px;
    text-align: right;

    transition: opacity 600ms;

    .svg-inline--fa {
      display: block;
      margin-bottom: 15px;
      margin-left: auto;
    }
  }
}

.hover--left .right__content {
  opacity: 0.8;
}

.hover--right .left__content {
  opacity: 0.8;
}
</style>
