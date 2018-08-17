<template>
  <section
    ref="main"
    class="hero"
    :class="'hover--' + activeHover"
    @mousemove="handleMousemove"
    @mouseleave="handleMouseleave">
    <div class="left-background" :style="{ clipPath: leftBackgroundClipPath }"></div>
    <div class="left">
      <h1>Callum Macrae</h1>

      <div class="left__content">
        <p>I'm a JavaScript developer and occasional musician based in London, UK, working at <a href="https://samknows.com/">SamKnows</a> to make the internet faster for everyone. My current enthusiasms are Vue and SVGs (but only sometimes at the same time).</p>
        <p>I write and speak, some of which you can find below.</p>
        <i class="fas fa-arrow-down fa-2x" data-fa-transform="shrink-6" data-fa-mask="fas fa-circle"></i>
      </div>
    </div>

    <div class="right">
      <h1 ref="rightTitleEl" :style="{ clipPath: rightTitleClipPath }">Callum Macrae</h1>

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

const randomMotion = () => ({
  top: 0.033 * (Math.random() < 0.5 ? -1 : 1),
  bottom: 0.009 * (Math.random() < 0.5 ? -1 : 1)
});

const randomPositions = () => ({
  top: Math.random() * 60 - 30,
  bottom: Math.random() * 60 - 30
});

export default {
  data: () => ({
    activeHover: 'none',
    basePosition: 65,
    nextGlitch: undefined,
    motion: randomMotion(),
    positions: randomPositions()
  }),
  mounted() {
    this.nextGlitch = Date.now() + 1500;

    requestAnimationFrame(this.frame);
  },
  destroyed() {
    cancelAnimationFrame(this.frame);
  },
  methods: {
    frame() {
      this.positions.top += this.motion.top;
      this.positions.bottom += this.motion.bottom;

      // This is configuration
      const basePositionTendTo = {
        none: 65,
        left: 67,
        right: 63
      }[this.activeHover];

      if (util.roundDp(this.basePosition, 1) !== basePositionTendTo) {
        this.basePosition = util.roundDp(
          basePositionTendTo * 0.1 + this.basePosition * 0.9,
          2
        );
      } else if (
        Date.now() > this.nextGlitch ||
        Math.abs(this.positions.top) > 100 ||
        Math.abs(this.positions.bottom) > 100
      ) {
        const oldPositionTop = this.positions.top;
        const oldPositionBottom = this.positions.bottom;

        this.positions = randomPositions();

        if (Date.now() > this.nextGlitch && Math.random() < 0.75) {
          setTimeout(() => {
            const newPositionTop = this.positions.top;
            const newPositionBottom = this.positions.bottom;

            this.positions.top = oldPositionTop;
            this.positions.bottom = oldPositionBottom;

            if (Math.random() < 0.5) {
              setTimeout(() => {
                this.positions.top = newPositionTop;
                this.positions.bottom = newPositionBottom;
              }, 100);

              if (Math.random() < 0.5) {
                setTimeout(() => {
                  this.positions.top = oldPositionTop;
                  this.positions.bottom = oldPositionBottom;
                }, 100);
              }
            }
          }, 100);
        } else {
          this.motion = randomMotion();
        }

        this.nextGlitch = Date.now() + 800 + Math.random() * 3500;
      }

      requestAnimationFrame(this.frame);
    },
    handleMousemove(e) {
      const mainRect = this.$refs.main.getBoundingClientRect();
      const mousePerc = e.pageY / mainRect.height;
      const lineXAtY =
        this.basePosition * 0.01 * mainRect.width +
        (1 - mousePerc) * this.positions.top +
        mousePerc * this.positions.bottom;

      this.activeHover = lineXAtY > e.pageX ? 'left' : 'right';
    },
    handleMouseleave() {
      this.activeHover = 'none';
    }
  },
  computed: {
    leftBackgroundClipPath() {
      const offsetTop = util.roundDp(this.positions.top, 3);
      const offsetBottom = util.roundDp(this.positions.bottom, 3);

      return `polygon(
        0 0%, calc(${this.basePosition}% + ${offsetTop}px) 0%,
        calc(${this.basePosition}% + ${offsetBottom}px) 100%, 0% 100%
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
        calc(${this.basePosition}% + ${generatedOffsetTop}px) 0%, 100% 0%,
        100% 100%, calc(${this.basePosition}% + ${generatedOffsetBottom}px) 100%
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
