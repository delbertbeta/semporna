import { createApp } from "vue";
import MasonryWall from "@yeger/vue-masonry-wall";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import SvgIconPlugin from "./plugins/svg-icon";
// import AMap from './plugins/amap.js';

const app = createApp(App)
  .use(MasonryWall)
  .use(store)
  .use(router)
  .use(SvgIconPlugin)
  .mount("#root");
// app.config.globalProperties.AMap = AMap;
