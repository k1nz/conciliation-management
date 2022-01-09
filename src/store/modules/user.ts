// vuex
import { login } from '@/api/user';
import { TOKEN_NAME } from '@/config/global';

const InitUserInfo = {
  roles: [],
};

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
  userInfo: InitUserInfo,
};

const mutations = {
  setToken(state, token) {
    localStorage.setItem(TOKEN_NAME, token);
    state.token = token;
  },
  removeToken(state) {
    localStorage.removeItem(TOKEN_NAME);
    state.token = '';
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};

const getters = {
  token: (state) => {
    return state.token;
  },
  roles: (state) => {
    return state.userInfo?.roles;
  },
};

const actions = {
  async login({ commit }, loginInfo) {
    const mockLogin = async (loginInfo) => {
      // 登录请求流程
      console.log(loginInfo);
      // const { account, password } = userInfo;
      // if (account !== 'td') {
      //   return {
      //     code: 401,
      //     message: '账号不存在',
      //   };
      // }
      // if (['main_', 'dev_'].indexOf(password) === -1) {
      //   return {
      //     code: 401,
      //     message: '密码错误',
      //   };
      // }
      // const token = {
      //   main_: 'main_token',
      //   dev_: 'dev_token',
      // }[password];
      return {
        code: 200,
        message: '登陆成功',
        data: 'main_token',
      };
    };

    // const res = await mockLogin(loginInfo);
    // if (res.code === 200) {
    //   commit('setToken', res.data);
    // } else {
    //   throw res;
    // }

    try {
      const { data } = await login(loginInfo);
      commit('setToken', data.authToken);
      localStorage.setItem('userInfo', JSON.stringify(data.user)); // 存储用户信息至storage, 由路由守卫将用户信息存入store中
    } catch (err) {
      throw err;
    }
  },
  async getUserInfo({ commit, state }) {
    const mockRemoteUserInfo = async (token) => {
      if (token === 'main_token') {
        return {
          name: 'td_main',
          roles: ['ALL_ROUTERS'],
        };
      }
      return {
        name: 'td_dev',
        roles: ['userIndex', 'dashboardBase', 'login'],
      };
    };

    // const res = await mockRemoteUserInfo(state.token);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    commit('setUserInfo', userInfo);
  },
  async logout({ commit }) {
    commit('removeToken');
    commit('setUserInfo', InitUserInfo);
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
type rolesType = {};

type dataGrpsType = {};

type userType = {
  admin: boolean;
  createTime: string;
  createUser: string;
  createUserName: string;
  dataGrps: dataGrpsType;
  description: string;
  disabled: boolean;
  grpId: string;
  grpName: string;
  roles: rolesType;
  userId: string;
  userName: string;
};

export interface userInfoType {
  authToken: string;
  lang: string;
  user: userType;
}

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME),
    userInfo: InitUserInfo,
  }),

  actions: {
    setToken(token) {
      localStorage.setItem(TOKEN_NAME, token);
      this.token = token;
    },
    removeToken() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    async login(loginInfo) {
      try {
        const data: userInfoType = await login(loginInfo);
        this.setToken(data.authToken);
        localStorage.setItem('userInfo', JSON.stringify(data.user)); // 存储用户信息至storage, 由路由守卫将用户信息存入store中
      } catch (err) {
        throw err;
      }
    },
    async getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.setUserInfo(userInfo);
    },
    async logout() {
      this.removeToken;
      this.setUserInfo(InitUserInfo);
    },
  },

  getters: {
    getToken(): string {
      return this.token;
    },
    getRoles(): object[] | undefined {
      return this.userInfo?.roles;
    },
  },
});
