import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  { path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})


export default router;