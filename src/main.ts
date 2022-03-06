import { createApp } from 'vue';

import TDesign, { MessagePlugin } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import VueClipboard from 'vue3-clipboard';
import { createPinia } from 'pinia';
import router from './router';
import '@/style/index.less';
import './permission';

import App from './App.vue';
import { useSystemStore } from './store';

const app = createApp(App);

app.use(TDesign);
app.use(createPinia());
app.use(router);
app.use(VueClipboard);

app.mount('#app');

const systemStore = useSystemStore();
systemStore.initSystem();

window.addEventListener(
  'error',
  (err) => {
    console.log('window error catch', err);
    /**
     * 图片异常捕获
     */
    if (err.target instanceof Image) {
      MessagePlugin.error('无效令牌，请重新登录');
      router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
    }
  },
  true,
);
