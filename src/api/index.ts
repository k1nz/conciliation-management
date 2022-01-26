import Request from './request';
import proxy from '../config/proxy';

const env = import.meta.env.MODE || 'development';

const host = env === 'mock' ? '/' : proxy[env].host; // 如果是mock模式 就不配置host 会走本地Mock拦截
const requestInstance = new Request({
  baseURL: host,
  timeout: 5000,
  withCredentials: true,
});

export default requestInstance;
