// vuex
import { acceptHMRUpdate, defineStore } from 'pinia';
import * as USER_API from '@/api/user';
import { TOKEN_NAME } from '@/config/global';
// eslint-disable-next-line
import { ILoginInfoType, IRolesType, IUserType } from '@/interface';

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
    token: localStorage.getItem(TOKEN_NAME),
    userInfo: InitUserInfo,
  }),

  actions: {
    setToken(token: string) {
      localStorage.setItem(TOKEN_NAME, token);
      this.token = token;
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
      this.setToken(loginResp.authToken);
      localStorage.setItem('userInfo', JSON.stringify(loginResp.user)); // 存储用户信息至storage, 由路由守卫将用户信息存入store中
    },
    async getUserInfo() {
      const userInfo: IUserType = JSON.parse(localStorage.getItem('userInfo'));
      this.setUserInfo(userInfo);
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
