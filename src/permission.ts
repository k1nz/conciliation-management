import { MessagePlugin } from 'tdesign-vue-next';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import router from '@/router';
import { useUserStore } from '@/store/modules/user';
import { usePermStore } from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permStore = usePermStore();
  const { whiteListRouters } = permStore;
  NProgress.start();

  const { token } = userStore;

  if (token) {
    if (to.path === '/login') {
      setTimeout(() => {
        userStore.logout();
        permStore.restore();
      });
      next();
      return;
    }

    const roles = userStore.getRoles;
    if (roles && roles.length > 0) {
      next();
    } else {
      try {
        if (!userStore.userInfo.userId) await userStore.getUserInfo();

        permStore.initRoutes(userStore.getRoles);

        next({ ...to });
      } catch (error) {
        console.error(error);
        MessagePlugin.error(error);
        await userStore.removeToken();
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
