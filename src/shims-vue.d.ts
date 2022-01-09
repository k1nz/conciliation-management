import { AxiosRequestConfig } from 'axios';
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
