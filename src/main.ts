import { createApp } from 'vue';
import MasonryWall from '@yeger/vue-masonry-wall';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import SvgIconPlugin from './plugins/svg-icon';
import { initializeBrowserTheme } from './utils/browser-theme';
import './app.css';
// import AMap from './plugins/amap.js';

const pinia = createPinia();

if (typeof document !== 'undefined') {
  initializeBrowserTheme(document);
}

const app = createApp(App)
  .use(MasonryWall)
  .use(pinia)
  .use(router)
  .use(SvgIconPlugin)
  .mount('#root');
// app.config.globalProperties.AMap = AMap;
