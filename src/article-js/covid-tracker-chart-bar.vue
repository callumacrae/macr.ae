<template>
  <g>
    <rect :x="barStart" :width="barWidth" height="50" />
    <text y="25" :x="barStart - 10" class="country">
      {{ country }}
    </text>
    <text
      y="25"
      :x="barStart + barWidth"
      :class="[
        'value',
        tweenedValue < tweenedMaxValue * 0.8 ? 'value--right' : 'value--left'
      ]"
    >
      {{ valueAnimated ? tweenedValue : value | formatNumber }}
    </text>
  </g>
</template>

<script>
import { gsap } from 'gsap';

export default {
  props: {
    country: { type: String, required: true },
    chartWidth: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    value: { type: Number, required: true },
    animated: { type: Boolean, default: false },
    valueAnimated: { type: Boolean, default: false }
  },
  data() {
    return {
      barStart: 150,
      tweenedMaxValue: this.maxValue,
      tweenedValue: this.value
    };
  },
  computed: {
    barWidth() {
      return (
        ((this.chartWidth - this.barStart) / this.tweenedMaxValue) *
        this.tweenedValue
      );
    }
  },
  watch: {
    maxValue(newMax) {
      if (!this.animated) {
        this.tweenedMaxValue = newMax;
        return;
      }
      gsap.to(this.$data, {
        tweenedMaxValue: newMax
      });
    },
    value(newValue) {
      if (!this.animated) {
        this.tweenedValue = newValue;
        return;
      }
      gsap.to(this.$data, {
        tweenedValue: newValue
      });
    }
  },
  filters: {
    formatNumber(value) {
      return Math.round(value).toLocaleString();
    }
  }
};
</script>

<style scoped>
rect {
  fill: hsl(10, 80%, 70%);
}

text {
  font: 16px sans-serif;
  alignment-baseline: middle;
}

.country {
  fill: black;
  text-anchor: end;
}

.value {
  transition: transform 0.3s linear;
  transition-duration: var(--animation-duration);
}
.value--left {
  fill: white;
  text-anchor: end;
  transform: translateX(-10px);
}
.value--right {
  text-anchor: start;
  transform: translateX(10px);
  fill: black;
}
</style>

<!-- @todo move this somewhere more sensible -->
<style lang="scss">
.country-enter-leave {
  transition: opacity 0.3s linear;

  &.country-list-enter,
  &.country-list-leave-to {
    opacity: 0;
  }
}

.country-move {
  transition: opacity 0.3s linear, transform 0.3s linear;

  &.country-list-enter,
  &.country-list-leave-to {
    opacity: 0;
  }
}
</style>
