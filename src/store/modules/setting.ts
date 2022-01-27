import { acceptHMRUpdate, defineStore } from 'pinia';
import STYLE_CONFIG, { IDefaultStyle } from '@/config/style';
import { COLOR_TOKEN, ColorSeries, ColorToken, LIGHT_CHART_COLORS, DARK_CHART_COLORS } from '@/config/color';

type IInitStateType = IDefaultStyle & {
  showSettingPanel: boolean;
  colorList: typeof COLOR_TOKEN;
  chartColors: typeof LIGHT_CHART_COLORS;
};

interface IStateType extends IInitStateType {
  isAsideFooter: boolean;
}

// pinia
export const useSettingStore = defineStore('setting', {
  state: (): IStateType => ({
    ...STYLE_CONFIG,
    showSettingPanel: false,
    colorList: COLOR_TOKEN,
    chartColors: LIGHT_CHART_COLORS,
    isAsideFooter: true,
  }),
  actions: {
    async changeTheme(payload: Record<string, unknown>) {
      const newPayload = {
        showBreadcrumb: this.showBreadcrumb,
        mode: this.mode,
        layout: this.layout,
        isSidebarCompact: this.isSidebarCompact,
        splitMenu: this.splitMenu,
        isFooterAside: this.isFooterAside,
        isSidebarFixed: this.isSidebarFixed,
        isHeaderFixed: this.isHeaderFixed,
        showHeader: this.showHeader,
        showFooter: this.showFooter,
        backgroundTheme: this.backgroundTheme,
        brandTheme: this.brandTheme,
        showSettingPanel: this.showSettingPanel,
        colorList: this.colorList,
        chartColors: this.chartColors,
        isAsideFooter: this.isAsideFooter,
        // ...payload,
      };
      Object.assign(newPayload, payload);
      this.changeMode(newPayload);
      this.changeBrandTheme(newPayload);
      this.update(newPayload);
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
      if (payload.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          this.mode = 'dark';
        } else {
          this.mode = 'light';
        }
      } else {
        this.mode = payload.mode;
      }
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
    showSidebar(): boolean {
      return this.layout !== 'top';
    },
    showSidebarLogo(): boolean {
      return this.layout === 'side';
    },
    showHeaderLogo(): boolean {
      return this.layout !== 'side';
    },
    getMode(): 'dark' | 'light' {
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
