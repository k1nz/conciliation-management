// pinia
import { acceptHMRUpdate, defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import router, { asyncRouterList, page404 } from '@/router';

function filterPermissionsRouters(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const children = [];
    route.children?.forEach((childRouter) => {
      const roleCode = childRouter.meta?.roleCode || childRouter.name;
      if (roles.indexOf(roleCode) !== -1) {
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
  routers: Array<RouteRecordRaw>;
}

export const usePermStore = defineStore('permission', {
  state: (): permissionState => ({
    whiteListRouters: ['/login'],
    routers: [],
  }),
  actions: {
    setRouters(routers) {
      this.routers = routers;
    },
    async initRoutes(roles: string[]) {
      let accessedRouters;

      // admin
      if (roles.includes('ADMIN')) {
        accessedRouters = asyncRouterList;
      } else {
        accessedRouters = filterPermissionsRouters(asyncRouterList, roles);
      }

      this.setRouters(accessedRouters);
      // register routers
      this.routers.concat(page404).forEach((item) => {
        router.addRoute(item);
      });
    },
    async restore() {
      // remove routers
      this.routers.concat(page404).forEach((item) => {
        router.removeRoute(item.name);
      });
      this.setRouters([]);
    },
  },
  getters: {
    getRouters() {
      return this.routers;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermStore, import.meta.hot));
}
