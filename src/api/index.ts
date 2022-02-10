import Request from './request';
import proxy from '../config/proxy';

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

const requestInstance = new Request({
  baseURL: host,
  timeout: 5000,
  withCredentials: true,
});

export default requestInstance;
export * from './system';
export * from './user';
