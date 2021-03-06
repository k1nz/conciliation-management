import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import baseRouters from './modules/base';
// import componentsRouters from './modules/components';

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [...baseRouters];

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layouts/blank.vue'),
  },
];

export const page404: RouteRecordRaw = {
  path: '/:w+',
  name: '404Page',
  // redirect: '/result/404',
  component: () => import('@/pages/result/404/index.vue'),
  meta: { title: '访问页面不存在页' },
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: defaultRouterList,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;
