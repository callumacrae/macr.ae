import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Article from './views/Article.vue';
import NotFoundPage from './views/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(),
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
      path: '/:catchAll(.*)',
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

    return { left: 0, top: 0 };
  }
});

router.afterEach(to => {
  if (window.ga) {
    window.ga('set', 'page', to.path);
    window.ga('send', 'pageview');
  }
});

export default router;
