import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import SvgIconPlugin from './plugins/svg-icon/index.js';
// import AMap from './plugins/amap.js';

const app = createApp(App).use(store).use(router).use(SvgIconPlugin).mount('#root');
// app.config.globalProperties.AMap = AMap;