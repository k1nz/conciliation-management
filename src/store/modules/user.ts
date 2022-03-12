// vuex
import { acceptHMRUpdate, defineStore } from 'pinia';
import { MessagePlugin } from 'tdesign-vue-next';
import * as USER_API from '@/api/user';
import { TOKEN_NAME } from '@/config/global';
import { ILoginInfoType, IUserType } from '@/types/user';
import router from '@/router';
import useSystemStore from './system';

const InitUserInfo: IUserType | Record<string, unknown> = {
  // roles: [],
};

// pinia
export interface IUserState {
  token: string;
  userInfo: IUserType;
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    token: localStorage.getItem(TOKEN_NAME) || '',
    userInfo: InitUserInfo,
  }),

  actions: {
    setToken(token: string | undefined) {
      if (token) {
        localStorage.setItem(TOKEN_NAME, token);
        this.token = token;
      } else {
        MessagePlugin.error('未知错误: 10001');
      }
    },
    removeToken() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
    },
    setUserInfo(userInfo: IUserType) {
      this.userInfo = userInfo;
    },
    async login(loginInfo: ILoginInfoType) {
      const loginResp = await USER_API.login(loginInfo);
      this.setToken(loginResp.data?.[0].authToken);
      localStorage.setItem('userInfo', JSON.stringify(loginResp.data?.[0].user)); // 存储用户信息至storage, 由路由守卫将用户信息存入store中
      const redirect = router.currentRoute.value.query?.redirect;
      // initialize
      const systemStore = useSystemStore();
      await systemStore.initSystem();
      if (typeof redirect === 'string') {
        await router.push(redirect);
      } else {
        await router.push('/home');
      }
    },
    async getUserInfo() {
      const userInfoOrigin = localStorage.getItem('userInfo');
      if (userInfoOrigin ?? false) {
        const userInfo: IUserType = JSON.parse(localStorage.getItem('userInfo')!);
        this.setUserInfo(userInfo);
      } else {
        router.push('/login');
        MessagePlugin.error('用户信息丢失，请重新登录');
      }
    },
    async logout() {
      this.removeToken();
      this.setUserInfo(InitUserInfo);
      await USER_API.logout();
    },
  },

  getters: {
    getToken(): string {
      return this.token;
    },
    getRoles(state): string[] {
      if (state.userInfo.admin) {
        return ['ADMIN'];
      }
      const roleList: string[] = [];
      const { roles } = state.userInfo;
      roles?.forEach((role) => {
        role?.privs?.forEach((priv) => {
          roleList.push(priv.privCode);
        });
      });
      return [...new Set(roleList)];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
