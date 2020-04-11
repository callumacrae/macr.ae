<template>
  <div>
    <p v-if="!expanded">
      {{ truncatedText }}
      <a href title="See more" @click.prevent="expanded = true">[&hellip;]</a>
    </p>
    <p v-else-if="!Array.isArray(text)">
      {{ text }}
    </p>
    <p v-else v-for="line of text" :key="line">
      {{ line }}
    </p>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  props: {
    text: {
      type: [String, Array],
      required: true
    },
    lines: {
      type: Number,
      default: 2
    }
  },
  data: () => ({
    truncatedText: '',
    expanded: true
  }),
  mounted() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(this.generateTruncated);
    } else {
      this.generateTruncated();
    }
  },
  methods: {
    generateTruncated() {
      // Don't truncate server-side
      if (navigator.userAgent.includes('HeadlessChrome')) {
        return;
      }

      this.expanded = false;

      const firstLine = Array.isArray(this.text) ? this.text[0] : this.text;
      const splitText = firstLine.split(' ');

      let truncatedText = '';

      let i = 0;

      // Start with averageLength to minimise the amount of work to be done
      const averageLength = window.innerWidth <= 500 ? 70 : 180;
      for (
        ;
        i < splitText.length && truncatedText.length < averageLength;
        i++
      ) {
        truncatedText += splitText[i] + ' ';
      }

      this.truncatedText = truncatedText;

      const MAX_HEIGHT = 60;

      // Here be layout thrashing
      const getHeight = () => this.$el.getBoundingClientRect().height;

      let j = 0;

      const subtractWords = () => {
        i--;
        this.truncatedText = splitText.slice(0, i).join(' ');

        if (j++ > 200) {
          console.error('Oh no infinite loop');
          return;
        }

        Vue.nextTick(() => {
          if (getHeight() > MAX_HEIGHT) {
            subtractWords();
          }
        });
      };

      const addWords = () => {
        i++;
        this.truncatedText = splitText.slice(0, i).join(' ');

        if (j++ > 200) {
          console.error('Oh no infinite loop');
          return;
        }

        Vue.nextTick(() => {
          if (getHeight() < MAX_HEIGHT) {
            addWords();
          } else {
            // It's too long now - remove the word just added
            i--;
            this.truncatedText = splitText.slice(0, i).join(' ');
          }
        });
      };

      Vue.nextTick(() => {
        const height = getHeight();

        if (height > MAX_HEIGHT) {
          subtractWords();
        } else if (height < MAX_HEIGHT) {
          if (i === splitText.length) {
            if (!Array.isArray(this.text)) {
              this.expanded = true;
            }
          } else {
            addWords();
          }
        }
      });
    }
  }
};
</script>
