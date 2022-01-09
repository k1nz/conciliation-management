import { MessagePlugin } from 'tdesign-vue-next';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import store from '@/store';
import router from '@/router';
import { useUserStore } from '@/store/modules/user';
import { usePermStore } from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });

// const whiteListRouters = store.getters['permission/whiteListRouters'];

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permStore = usePermStore();
  const whiteListRouters = permStore.whiteListRouters;
  NProgress.start();

  // const token = store.getters['user/token'];
  const token = userStore.token;

  if (token) {
    if (to.path === '/login') {
      setTimeout(() => {
        // store.dispatch('user/logout');
        // store.dispatch('permission/restore');
        userStore.logout();
        permStore.restore();
      });
      next();
      return;
    }

    // const roles = store.getters['user/roles'];
    const roles = userStore.getRoles;
    if (roles && roles.length > 0) {
      next();
    } else {
      try {
        // await store.dispatch('user/getUserInfo');
        await userStore.getUserInfo;

        // await store.dispatch('permission/initRoutes', store.getters['user/roles']);
        permStore.initRoutes(userStore.getRoles);

        next({ ...to });
      } catch (error) {
        console.log(error);
        MessagePlugin.error(error);
        // await store.commit('user/removeToken');
        await userStore.removeToken;
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
  } else {
    /* white list router */
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
