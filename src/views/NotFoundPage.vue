<template>
  <div>
    <TitledSection title="Callum Macrae" link-back :n="0">
      <h1 style="margin-bottom: 50px">404: page not found</h1>
      <p>
        There's no page here - sorry! I probably messed something up when I
        rebuilt this site.
      </p>
      <p>
        If you let me know
        <a href="https://twitter.com/callumacrae">on Twitter</a> what you were
        looking for, I'll help you find it, and I'll fix the site.
      </p>
      <hr />
      <p>
        In case it's what you were looking for, here's some fun facts about me:
      </p>
      <ul>
        <li>My favourite emoji is 🥳 (but my most recently used is 😂).</li>
        <li>I prefer dogs to cats, but am allergic to both.</li>
        <li>
          I've played the drums since I was nine, but play more piano now.
        </li>
        <li>
          I once attempted to cycle from Land's End to John O'Groats in six
          days—1000 miles in total! I failed, but made it to Scotland.
        </li>
        <li>
          My favourite rum is Doorly's XO - or sometimes Plantation XO 20th
          Anniversary.
        </li>
        <li>My favourite cocktail is a Godfather Sour.</li>
        <li>
          I'm a bit of an activist, mainly with a focus on climate justice. If
          you follow me on Twitter, you've probably already noticed this.
        </li>
        <li>
          I was too lazy to make the footer stick to the bottom of the page when
          the page is short, so I had to add some facts about me to my 404 page.
        </li>
      </ul>
      <router-link to="/">« Return to home</router-link>
    </TitledSection>

    <TheFooter :n="1" />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter';
import TitledSection from '@/components/TitledSection';

export default {
  metaInfo() {
    return {
      title: 'Page not found'
    };
  },
  components: {
    TheFooter,
    TitledSection
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}
</style>
