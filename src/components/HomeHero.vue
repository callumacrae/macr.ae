<template>
  <section ref="main" class="hero" :style="{ height: `${pageHeight}px` }">
    <div
      ref="animated"
      class="left-background"
      :style="{
        clipPath: leftBackgroundClipPath,
        '-webkit-clip-path': leftBackgroundClipPath,
        height: `${pageHeight}px`
      }"
    ></div>
    <div class="left">
      <h1>Callum Macrae</h1>

      <div class="left__content">
        <p>
          I'm a developer and occasional musician based in London, UK, with a
          passion for using JavaScript to solve complicated problems. My current
          enthusiasms are Vue and SVGs (but only sometimes at the same time).
        </p>
        <p>
          I write and speak, some of which you can find below. I'm also
          available for work: contact me at
          <a href="mailto:callum@macr.ae">callum@macr.ae</a>.
        </p>
        <a class="down-arrow" role="presentation" @click="handleScrollClick">
          <FontAwesomeIcon
            :icon="['fas', 'arrow-down']"
            :mask="['fas', 'circle']"
            transform="shrink-6"
            class="fa-2x"
          />
        </a>
        <div class="social-links">
          <a href="https://twitter.com/callumacrae" target="_blank">
            <span class="sr-only">Twitter</span>
            <FontAwesomeIcon :icon="['fab', 'twitter']" />
          </a>
          <a href="https://github.com/callumacrae" target="_blank">
            <span class="sr-only">Github</span>
            <FontAwesomeIcon :icon="['fab', 'github']" />
          </a>
          <a href="https://codepen.io/callumacrae" target="_blank">
            <span class="sr-only">Codepen</span>
            <FontAwesomeIcon :icon="['fab', 'codepen']" />
          </a>
        </div>
      </div>
    </div>

    <div class="right">
      <h1
        ref="rightTitleEl"
        role="presentation"
        :style="{
          clipPath: rightTitleClipPath,
          '-webkit-clip-path': rightTitleClipPath
        }"
      >
        Callum Macrae
      </h1>

      <div class="right__content">
        <a href="https://twitter.com/callumacrae" target="_blank">
          <span class="sr-only">Twitter</span>
          <FontAwesomeIcon :icon="['fab', 'twitter']" />
        </a>
        <a href="https://github.com/callumacrae" target="_blank">
          <span class="sr-only">Github</span>
          <FontAwesomeIcon :icon="['fab', 'github']" />
        </a>
        <a href="https://codepen.io/callumacrae" target="_blank">
          <span class="sr-only">Codepen</span>
          <FontAwesomeIcon :icon="['fab', 'codepen']" />
        </a>
      </div>
    </div>

    <GlobalEvents target="window" @resize="handlePageResize" />
  </section>
</template>

<script>
import GlobalEvents from 'vue-global-events';
import * as util from '@/util';
import animationMixin from '@/mixins/animation';

export default {
  mixins: [animationMixin],
  data() {
    const isMobile = window.innerWidth <= 500;

    return {
      pageHeight: window.innerHeight,
      isMobile,
      startPositions:
        Math.random() < 0.5
          ? { top: -25, bottom: 20 }
          : { top: 25, bottom: -20 },
      // @todo refactor the logic to not have to use these massive numbers!
      startPositionsMobile: { top: -1900, bottom: 4000 }
    };
  },
  components: {
    GlobalEvents
  },
  computed: {
    positions() {
      if (this.isMobile) {
        const startPositions = this.startPositionsMobile;
        return {
          top: startPositions.top + Math.sin(this.i / 650) * 50,
          bottom: startPositions.bottom + Math.sin(this.i / 350) * 50
        };
      }

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
  },
  methods: {
    handleScrollClick() {
      // behaviour: 'smooth' doesn't have great browser support unfortunately

      const startPosition = window.scrollY;
      const scrollOffset =
        this.$refs.main.getBoundingClientRect().height - startPosition;

      const startTime = Date.now();
      const duration = 1000;

      const frame = () => {
        const percentage = (Date.now() - startTime) / duration;

        if (percentage < 1) {
          requestAnimationFrame(frame);
        }

        // Quart easing
        const adjustedPercentage =
          percentage < 0.5
            ? 8 * percentage ** 4
            : 1 - 8 * (percentage - 1) ** 4;

        window.scrollTo({
          top: scrollOffset * adjustedPercentage + startPosition
        });
      };

      requestAnimationFrame(frame);
    },
    handlePageResize() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 500;

      // Don't react to user scrolling down
      if (!this.isMobile || !wasMobile) {
        this.pageHeight = window.innerHeight;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/mixins';
@import '../scss/meta/variables';

.hero {
  position: relative;
  display: flex;
  height: 100vh; // Overridden by JavaScript
  min-height: 500px;
  background-color: $orange;
}

h1 {
  font-size: 100px;

  position: absolute;
  top: calc(50% - 220px);
  left: 0;

  margin: 0;
  width: 100vw;

  text-align: center;

  color: inherit;

  @include mobile {
    top: 60px;
    font-size: 80px;
  }
}

.left-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; // Overridden by JavaScript
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

    a {
      color: inherit;
    }

    .down-arrow {
      cursor: pointer;

      &:hover {
        text-decoration: none;
      }

      .svg-inline--fa {
        opacity: 0.66;
      }
    }

    .social-links a {
      font-size: 1.5em;
      margin-right: 10px;
    }

    @include mobile {
      padding: 0 30px;
      width: 100vw;
      left: 0;
      top: auto;
      bottom: 60px;

      .down-arrow {
        display: none;
      }
    }

    @include desktop {
      .social-links {
        display: none;
      }
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

    a {
      color: inherit;
    }

    .svg-inline--fa {
      display: block;
      margin-bottom: 15px;
      margin-left: auto;
    }

    @include mobile {
      display: none;
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
