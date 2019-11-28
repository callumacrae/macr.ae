<template>
  <section class="section" :class="`section--${n}`">
    <header
      ref="animated"
      :style="{ clipPath: headerClipPath, '-webkit-clip-path': headerClipPath }"
    >
      <router-link v-if="linkBack" to="/" class="section__link-back">
        <h2 class="section__title">{{ title }}</h2>
      </router-link>
      <h2 v-else class="section__title">{{ title }}</h2>
    </header>

    <div class="container">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import * as util from '@/util';
import animationMixin from '@/mixins/animation';

export default {
  mixins: [animationMixin],
  props: {
    title: {
      type: String,
      required: true
    },
    n: {
      type: Number
    },
    linkBack: {
      type: Boolean,
      default: false
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
    headerClipPath() {
      const positionLeft = util.roundDp(this.positions.left, 3);
      const positionRight = util.roundDp(this.positions.right, 3);

      let top = '0 0%, 100% 0%';

      if (this.n > 0) {
        top = `0% calc(0% + ${positionLeft}px), 100% calc(0% + ${positionRight}px)`;
      }

      return `polygon(
        ${top},
        100% calc(100% - ${this.maxOffset - positionRight}px),
        0% calc(100% - ${this.maxOffset - positionLeft}px)
      )`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/meta/variables';
@import '../scss/meta/mixins';

.section {
  margin-top: 100px;

  header {
    margin-bottom: 20px;
    padding: 60px 20px;

    text-align: center;

    background-color: $blue;
  }

  &__link-back:hover .section__title::before {
    position: absolute;
    transform: translate(-60px, 0);

    content: '«';
  }

  &__title {
    margin: 0;
    font-size: 2.5em;
    color: $pink;
  }

  &--0 {
    margin-top: 0;

    header {
      padding-top: 30px;
    }
  }

  @include desktop {
    header {
      margin-bottom: 50px;
      padding-top: 80px;
      padding-bottom: 80px;
    }

    &__title {
      font-size: 3.5em;
    }

    &--0 header {
      padding-top: 50px;
    }
  }
}
</style>
