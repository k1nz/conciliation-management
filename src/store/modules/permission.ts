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

const state = {
  whiteListRouters: ['/login'],
  routers: [],
};

const mutations = {
  setRouters: (state, routers) => {
    state.routers = routers;
  },
};

const getters = {
  routers: (state) => {
    return state.routers;
  },
  whiteListRouters: (state) => {
    return state.whiteListRouters;
  },
};

const actions = {
  async initRoutes({ commit }, roles) {
    let accessedRouters;

    // special token
    if (roles.includes('ALL_ROUTERS')) {
      accessedRouters = asyncRouterList;
    } else {
      accessedRouters = filterPermissionsRouters(asyncRouterList, roles);
    }

    commit('setRouters', accessedRouters);

    // register routers
    state.routers.concat(page404).forEach((item) => {
      router.addRoute(item);
    });
  },
  async restore({ commit, state }) {
    // remove routers
    state.routers.concat(page404).forEach((item) => {
      router.removeRoute(item.name);
    });
    commit('setRouters', []);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

// pinia
import { defineStore } from 'pinia';

export const usePermStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
  }),
  actions: {
    setRouters(routers) {
      this.routers = routers;
    },
    async initRoutes(roles) {
      let accessedRouters;

      // admin
      if (roles.includes('ALL_ROUTERS')) {
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
    // whiteListRouters() {
    //   return this.whiteListRouters;
    // },
  },
});
