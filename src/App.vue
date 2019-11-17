<template>
  <router-view />
</template>

<script>
export default {
  metaInfo() {
    return {
      titleTemplate: '%s | Callum Macrae',
      bodyAttrs: {
        class: [
          this.$route.path.includes('transform-when') ? 'transform-when' : ''
        ]
      }
    };
  }
};
</script>

<style src="./scss/style.scss" lang="scss"></style>
