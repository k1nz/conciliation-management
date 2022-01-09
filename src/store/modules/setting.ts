import STYLE_CONFIG from '@/config/style';
import { COLOR_TOKEN, ColorSeries, ColorToken, LIGHT_CHART_COLORS, DARK_CHART_COLORS } from '@/config/color';
import { defineStore } from 'pinia';

// 定义的state初始值
const state = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
  colorList: COLOR_TOKEN,
  chartColors: LIGHT_CHART_COLORS,
};

type IInitStateType = typeof state;

interface IStateType extends IInitStateType {
  isAsideFooter: boolean;
  showSettingPanel: boolean;
}

const mutations = {
  update(state: IStateType, payload: IStateType) {
    state.showBreadcrumb = payload.showBreadcrumb;
    state.mode = payload.mode;
    state.layout = payload.layout;
    state.isSidebarCompact = payload.isSidebarCompact;
    state.splitMenu = payload.splitMenu;
    state.isFooterAside = payload.isFooterAside;
    state.isSidebarFixed = payload.isSidebarFixed;
    state.isHeaderFixed = payload.isHeaderFixed;
    state.showHeader = payload.showHeader;
    state.showFooter = payload.showFooter;
    state.backgroundTheme = payload.backgroundTheme;
    state.brandTheme = payload.brandTheme;
  },
  toggleSidebarCompact(state: IStateType) {
    state.isSidebarCompact = !state.isSidebarCompact;
  },
  showSidebarCompact(state: IStateType, payload: boolean) {
    state.isSidebarCompact = payload;
  },

  toggleSettingPanel(state: IStateType, payload: boolean) {
    state.showSettingPanel = payload;
  },
  addColor(state: IStateType, payload: ColorSeries) {
    state.colorList = { ...state.colorList, ...payload };
  },
  changeChartColor(state: IStateType, payload: ColorToken) {
    state.chartColors = { ...payload };
  },
};

const getters = {
  showHeader: (state: IStateType) => state.showHeader,
  showSidebar: (state: IStateType) => state.layout !== 'top',
  showSidebarLogo: (state: IStateType) => state.layout === 'side',
  showHeaderLogo: (state: IStateType) => state.layout !== 'side',
  showFooter: (state: IStateType) => state.showFooter,
  mode: (state: IStateType) => {
    if (state.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)');
      if (media.matches) {
        return 'dark';
      }
      return 'light';
    }
    return state.mode;
  },
};

const actions = {
  async changeTheme({ commit, dispatch }, payload) {
    dispatch('changeMode', payload);
    dispatch('changeBrandTheme', payload);
    commit('update', payload);
  },
  async changeMode({ commit, state }, payload: IStateType) {
    let theme = payload.mode;

    if (payload.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)');
      if (media.matches) {
        theme = 'dark';
      } else {
        theme = 'light';
      }
    }
    const isDarkMode = theme === 'dark';
    if (theme !== state.mode) {
      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');
    }

    commit('changeChartColor', isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS);
  },
  changeBrandTheme({ state }: { state: IStateType }, payload: IStateType) {
    const { brandTheme, mode } = payload;
    if (brandTheme !== state.brandTheme) {
      document.documentElement.setAttribute(
        'theme-color',
        /^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/.test(brandTheme) && mode === 'dark' ? `${brandTheme}` : brandTheme,
      );
    }
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
export const useSettingStore = defineStore('setting', {
  state: () => ({
    ...STYLE_CONFIG,
    showSettingPanel: false,
    colorList: COLOR_TOKEN,
    chartColors: LIGHT_CHART_COLORS,
  }),
  actions: {
    async changeTheme(payload: IStateType) {
      this.changeMode(payload);
      this.changeBrandTheme(payload);
      this.update(payload);
    },
    async changeMode(payload: IStateType) {
      let theme = payload.mode;

      if (payload.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          theme = 'dark';
        } else {
          theme = 'light';
        }
      }
      const isDarkMode = theme === 'dark';
      if (theme !== this.mode) {
        document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');
      }

      this.changeChartColor(isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS);
    },
    changeBrandTheme(payload: IStateType) {
      const { brandTheme, mode } = payload;
      if (brandTheme !== this.brandTheme) {
        document.documentElement.setAttribute(
          'theme-color',
          /^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/.test(brandTheme) && mode === 'dark' ? `${brandTheme}` : brandTheme,
        );
      }
    },
    update(payload: IStateType) {
      this.showBreadcrumb = payload.showBreadcrumb;
      this.mode = payload.mode;
      this.layout = payload.layout;
      this.isSidebarCompact = payload.isSidebarCompact;
      this.splitMenu = payload.splitMenu;
      this.isFooterAside = payload.isFooterAside;
      this.isSidebarFixed = payload.isSidebarFixed;
      this.isHeaderFixed = payload.isHeaderFixed;
      this.showHeader = payload.showHeader;
      this.showFooter = payload.showFooter;
      this.backgroundTheme = payload.backgroundTheme;
      this.brandTheme = payload.brandTheme;
    },
    toggleSidebarCompact() {
      this.isSidebarCompact = !this.isSidebarCompact;
    },
    showSidebarCompact(payload: boolean) {
      this.isSidebarCompact = payload;
    },

    toggleSettingPanel(payload: boolean) {
      this.showSettingPanel = payload;
    },
    addColor(payload: ColorSeries) {
      this.colorList = { ...this.colorList, ...payload };
    },
    changeChartColor(payload: ColorToken) {
      this.chartColors = { ...payload };
    },
  },
  getters: {
    // showHeader() { return this.showHeader },
    showSidebar() {
      return this.layout !== 'top';
    },
    showSidebarLogo() {
      return this.layout === 'side';
    },
    showHeaderLogo() {
      return this.layout !== 'side';
    },
    showFooter() {
      return this.showFooter;
    },
    mode() {
      if (this.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          return 'dark';
        }
        return 'light';
      }
      return this.mode;
    },
  },
});
