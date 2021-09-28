import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from  '../views/Home.vue';
import About from  '../views/About.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/',
    name: 'home',
    component: Home,
  },
  { path: '/about',
    name: 'about',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})


export default router;