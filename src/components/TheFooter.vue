<template>
  <section
    ref="animated"
    class="the-footer"
    :class="`section--${n}`"
    :style="{ clipPath: headerClipPath }"
  >
    <div class="the-footer__content">
      <div class="left">
        <img class="the-footer__photo" src="../assets/me-speaking.png" />
      </div>
      <div class="right">
        <h2>
          Callum Macrae
        </h2>

        <p>
          Callum Macrae is a JavaScript developer and occasional musician based
          in London, UK, working at SamKnows to make the internet faster for
          everyone. His current favourite things to work with are Vue, and SVGs
          (but only sometimes at the same time). He regularly contributes to
          open source projects including gulp and his own projects and is the
          author of Vue.js: Up and Running, a book about getting started with
          Vue.
        </p>

        <div class="the-footer__links">
          <a href="https://twitter.com/callumacrae" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://github.com/callumacrae" target="_blank">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://codepen.io/callumacrae" target="_blank">
            <i class="fab fa-codepen"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from '@/util';
import animationMixin from '@/mixins/animation';

export default {
  mixins: [animationMixin],
  props: {
    n: {
      type: Number
    }
  },
  data() {
    return {
      startPositions:
        this.n % 2 ? { left: 10, right: 50 } : { left: 50, right: 10 }
    };
  },
  computed: {
    positions() {
      return {
        left: this.startPositions.left + Math.sin(this.i / 500) * 10,
        right: this.startPositions.right + Math.sin(this.i / 350) * 10
      };
    },
    headerClipPath() {
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
@import '../scss/meta/colors';

.the-footer {
  margin-top: 80px;
  padding-top: 1px;
  padding-bottom: 1px;

  background-color: $blue;
  color: rgba(white, 0.8);

  &__content {
    width: 800px;
    margin: 120px auto 80px;

    display: flex;

    .left {
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
    margin-bottom: 30px;

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
}
</style>
