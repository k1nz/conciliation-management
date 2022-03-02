import Request from './request';
import proxy from '../config/proxy';
import { removeNullProperty } from '@/utils/common';

const env = import.meta.env.MODE || 'development';

let host: string;
if (env === 'mock') {
  // 如果是mock模式 就不配置host 会走本地Mock拦截
  host = '/';
} else if (['development', 'release', 'test'].includes(env)) {
  host = proxy[env as keyof typeof proxy].host;
} else {
  throw new Error(`未找到${env}模式`);
}

export function getBaseURL() {
  return host;
}

const requestInstance = new Request({
  baseURL: host,
  timeout: 5000,
  withCredentials: true,
  interceptors: {
    requestSuccessInterceptor: ({ params, data, ...config }) => {
      const requestData = config.method === 'get' ? params : data;
      // debugger;
      removeNullProperty(requestData);
      if (config.method === 'get') {
        return { ...config, params: requestData };
      }
      return { ...config, data: requestData };
    },
  },
});

export default requestInstance;
export * from './system';
export * from './user';
export * from './business';
export * from './mediation';
