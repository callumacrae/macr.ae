import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Article from './views/Article.vue';
import NotFoundPage from './views/NotFoundPage.vue';

Vue.use(Router);

const router = new Router({
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
    },
    {
      path: '*',
      name: '404',
      component: NotFoundPage
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

router.afterEach(to => {
  if (window.ga) {
    window.ga('set', 'page', to.path);
    window.ga('send', 'pageview');
  }
});

export default router;
