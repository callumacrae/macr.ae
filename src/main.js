import { createApp } from 'vue';
// import VueMeta from 'vue-meta';

import WebFontLoader from 'webfontloader';

import App from './App.vue';
import router from './router';
import globalMixin from './global-mixin';

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

// Don't prerender this or it'll be included in the <head>
if (!navigator.userAgent.includes('HeadlessChrome')) {
  WebFontLoader.load({
    google: {
      families: ['Literata:500', 'Open+Sans:400,400i,700&display=swap']
    }
  });
}

createApp(App)
  .use(router)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mixin(globalMixin)
  .mount('#app');
