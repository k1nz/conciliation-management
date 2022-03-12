import { createApp } from 'vue';

import TDesign, { MessagePlugin } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import VueClipboard from 'vue3-clipboard';
import { createPinia } from 'pinia';
import router from './router';
import '@/style/index.less';
import './permission';

import App from './App.vue';
import { useSystemStore, useUserStore } from './store';

const app = createApp(App);

app.use(TDesign);
app.use(createPinia());
app.use(router);
app.use(VueClipboard);

app.mount('#app');

if (useUserStore().token) useSystemStore().initSystem();

window.addEventListener(
  'error',
  async (err) => {
    console.log('window error catch', err);
    /**
     * 图片异常捕获
     */
    if (err.target instanceof Image) {
      await MessagePlugin.error('无效令牌，请重新登录');
      await router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
    }
  },
  true,
);
