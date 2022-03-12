// pinia
import { acceptHMRUpdate, defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import router, { asyncRouterList, page404 } from '@/router';
import { MenuRoute } from '@/interface';

function filterPermissionsRouters(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const children: RouteRecordRaw[] = [];
    route.children?.forEach((childRouter) => {
      const permsCode: string = (childRouter.meta?.permsCode as string) || (childRouter.name as string);
      if (permsCode && roles.indexOf(permsCode) !== -1) {
        children.push(childRouter);
      }
    });
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  return res;
}

export interface permissionState {
  whiteListRouters: Array<string>;
  routers: MenuRoute[];
}

export const usePermStore = defineStore('permission', {
  state: (): permissionState => ({
    whiteListRouters: ['/login'],
    routers: [],
  }),
  actions: {
    setRouters(routers: RouteRecordRaw[]) {
      this.routers = routers as MenuRoute[];
    },
    initRoutes(roles: string[]) {
      let accessedRouters;

      // admin
      if (roles.includes('ADMIN')) {
        accessedRouters = asyncRouterList;
      } else {
        accessedRouters = filterPermissionsRouters(asyncRouterList, roles);
      }

      this.setRouters(accessedRouters);
      // register routers
      (this.routers as RouteRecordRaw[]).concat(page404).forEach((item) => {
        router.addRoute(item);
      });
    },
    async restore() {
      // remove routers
      (this.routers as RouteRecordRaw[]).concat(page404).forEach((item) => {
        if (item.name) router.removeRoute(item.name);
      });
      this.setRouters([]);
    },
  },
  getters: {
    getRouters(state) {
      return state.routers;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermStore, import.meta.hot));
}
