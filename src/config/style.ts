export interface IDefaultStyle {
  showFooter: boolean;
  isSidebarCompact: boolean;
  showBreadcrumb: boolean;
  mode: 'light' | 'dark' | 'auto';
  layout: 'side' | 'top' | 'mix';
  splitMenu: boolean;
  isFooterAside: boolean;
  isSidebarFixed: boolean;
  isHeaderFixed: boolean;
  showHeader: boolean;
  backgroundTheme: string;
  brandTheme: string;
}

const defaultStyle: IDefaultStyle = {
  showFooter: true,
  isSidebarCompact: false,
  showBreadcrumb: false,
  mode: 'light',
  layout: 'side',
  splitMenu: false,
  isFooterAside: false,
  isSidebarFixed: true,
  isHeaderFixed: true,
  showHeader: true,
  backgroundTheme: 'blueGrey',
  brandTheme: 'default',
};

export default defaultStyle;
