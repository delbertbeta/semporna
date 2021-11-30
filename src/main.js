import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import SvgIconPlugin from './plugins/svg-icon/index.js';

createApp(App).use(store).use(router).use(SvgIconPlugin).mount('#app');