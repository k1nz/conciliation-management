import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import TDesignHeader from './components/Header.vue';
import TDesignBreadcrumb from './components/Breadcrumb.vue';
import TDesignFooter from './components/Footer.vue';
import TDesignSideNav from './components/SideNav';
import TDesignContent from './components/Content.vue';

import { prefix } from '@/config/global';
import TdesignSetting from './setting.vue';
import '@/style/layout.less';
import { useSettingStore } from '@/store/modules/setting';
import { usePermStore } from '@/store/modules/permission';

const name = `${prefix}-base-layout`;

export default defineComponent({
  name,
  setup() {
    const route = useRoute();
    const permStore = usePermStore();
    const settingStore = useSettingStore();

    const mainLayoutCls = computed(() => [
      {
        't-layout--with-sider': settingStore.showSidebar,
      },
    ]);

    const headerMenu = computed(() => {
      const { routers } = permStore;
      if (settingStore.layout === 'mix') {
        if (settingStore.splitMenu) {
          return routers.map((menu) => ({
            ...menu,
            children: [],
          }));
        }
        return [];
      }
      return routers;
    });

    const sideMenu = computed(() => {
      let { routers } = permStore;
      if (settingStore.layout === 'mix' && settingStore.splitMenu) {
        routers.forEach((menu) => {
          if (route.path.indexOf(menu.path) === 0) {
            routers = menu.children.map((subMenu) => ({ ...subMenu, path: `${menu.path}/${subMenu.path}` }));
          }
        });
        return routers;
      }
      return routers;
    });

    // render
    const RenderSidebar = () => {
      return (
        settingStore.showSidebar && (
          <TDesignSideNav
            showLogo={settingStore.showSidebarLogo}
            layout={settingStore.layout}
            isFixed={settingStore.isSidebarFixed}
            menu={sideMenu.value as any}
            theme={settingStore.mode}
            isCompact={settingStore.isSidebarCompact}
          />
        )
      );
    };

    const RenderHeader = () => {
      return (
        settingStore.showHeader && (
          <TDesignHeader
            showLogo={settingStore.showHeaderLogo}
            theme={settingStore.mode}
            layout={settingStore.layout}
            isFixed={settingStore.isHeaderFixed}
            menu={headerMenu.value as any}
            isCompact={settingStore.isSidebarCompact}
          />
        )
      );
    };
    const renderFooter = () => (
      <t-footer class={`${prefix}-footer-layout`}>
        <TDesignFooter />
      </t-footer>
    );

    const RenderContent = () => {
      return (
        <t-layout class={[`${prefix}-layout`]}>
          <t-content class={`${prefix}-content-layout`}>
            {settingStore.showBreadcrumb && <TDesignBreadcrumb />}
            <TDesignContent />
          </t-content>
          {settingStore.showFooter && renderFooter()}
        </t-layout>
      );
    };

    return () => (
      <div>
        {settingStore.layout === 'side' ? (
          <t-layout class={mainLayoutCls.value} key="side">
            <t-aside>
              <RenderSidebar />
            </t-aside>
            <t-layout>
              <RenderHeader />
              <RenderContent />
            </t-layout>
          </t-layout>
        ) : (
          <t-layout key="no-side">
            <RenderHeader />
            <t-layout class={mainLayoutCls.value}>
              <RenderSidebar />
              <RenderContent />
            </t-layout>
          </t-layout>
        )}
        <TdesignSetting />
      </div>
    );
  },
});
