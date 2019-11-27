import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Article from './views/Article.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/article/:slug.html',
      redirect: to => `/article/${to.params.slug}`
    },
    {
      path: '/article/:slug',
      name: 'article',
      component: Article
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return { selector: to.hash };
    }

    return { x: 0, y: 0 };
  }
});
