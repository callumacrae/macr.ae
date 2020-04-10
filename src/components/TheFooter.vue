<template>
  <section
    ref="animated"
    class="the-footer"
    :class="`section--${n}`"
    :style="{ clipPath: footerClipPath, '-webkit-clip-path': footerClipPath }"
  >
    <div class="the-footer__content container">
      <div class="left">
        <LazyContent>
          <img class="the-footer__photo" src="../assets/me-speaking.png" />
        </LazyContent>
      </div>
      <div class="right">
        <h2>
          Callum Macrae
        </h2>

        <p>
          Callum Macrae is a developer and occasional musician based in London,
          UK, with a passion for using JavaScript to solve complicated problems.
          His current favourite things to work with are Vue and SVGs (but only
          sometimes at the same time). He is the author of Vue.js: Up and
          Running, a book about getting started with Vue.
        </p>

        <div class="the-footer__links">
          <a href="https://twitter.com/callumacrae" target="_blank">
            <FontAwesomeIcon :icon="['fab', 'twitter']" />
          </a>
          <a href="https://github.com/callumacrae" target="_blank">
            <FontAwesomeIcon :icon="['fab', 'github']" />
          </a>
          <a href="https://codepen.io/callumacrae" target="_blank">
            <FontAwesomeIcon :icon="['fab', 'codepen']" />
          </a>
          <a href="mailto:callum@macr.ae">
            <FontAwesomeIcon :icon="['far', 'envelope']" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from '@/util';
import animationMixin from '@/mixins/animation';
import LazyContent from './LazyContent';

export default {
  mixins: [animationMixin],
  components: { LazyContent },
  props: {
    n: {
      type: Number
    }
  },
  data() {
    const maxOffset = window.innerWidth < 500 ? 40 : 60;
    return {
      maxOffset,
      startPositions:
        this.n % 2
          ? { left: 10, right: maxOffset - 10 }
          : { left: maxOffset - 10, right: 10 }
    };
  },
  computed: {
    positions() {
      const max = this.maxOffset / 6;
      return {
        left: this.startPositions.left + Math.sin(this.i / 500) * max,
        right: this.startPositions.right + Math.sin(this.i / 350) * max
      };
    },
    footerClipPath() {
      const positionLeft = util.roundDp(this.positions.left, 3);
      const positionRight = util.roundDp(this.positions.right, 3);

      return `polygon(
        0% calc(0% + ${positionLeft}px), 100% calc(0% + ${positionRight}px),
        100% 100%, 0% 100%
      )`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/variables';
@import '../scss/meta/mixins';

.the-footer {
  margin-top: 50px;
  padding-top: 1px;
  padding-bottom: 1px;

  background-color: $blue;
  color: rgba(white, 0.8);

  &__content {
    margin-top: 90px;
    margin-bottom: 50px;

    display: flex;

    .left {
      display: none;

      min-width: 190px;
      width: 190px;
      margin-right: 40px;
    }
  }

  &__photo {
    border-radius: 2px;
  }

  h2 {
    margin-top: -5px; // -5px so that it lines up with the image
    margin-bottom: 0.75em;

    line-height: 1em;

    color: $pink;
  }

  p {
    font-size: 0.9em;
  }

  &__links {
    font-size: 2em;

    a {
      color: $pink;
      margin-right: 0.5em;
    }
  }

  @include desktop {
    margin-top: 80px;

    &__content {
      margin-top: 120px;
      margin-bottom: 80px;
    }

    .left {
      display: block;
    }
  }
}
</style>
