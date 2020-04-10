import Vue from 'vue';
import VueMeta from 'vue-meta';

import App from './App.vue';
import router from './router';
import './filters';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCodepen,
  faGithub,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCodepen, faGithub, faTwitter, faEnvelope, faArrowDown, faCircle);
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.use(VueMeta);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
