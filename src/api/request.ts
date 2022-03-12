import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';
import { TOKEN_NAME } from '@/config/global';
import { IRequestInstanceConfig, IRequestConfig, IDataType } from '@/types/request';
import router from '@/router';

const CODE = {
  LOGIN_TIMEOUT: -5,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
  UNKNOWN_ERR: -1,
  SERVER_ERR: -2,
};

const ERR_MESSAGE = [
  { value: 0, message: 'OK' },
  { value: -1, message: '未知的错误' },
  { value: -2, message: '服务器内部错误' },
  { value: -5, message: '请求超时' },
  { value: -6, message: '当前的状态不能执行请求的操作' },
  { value: -7, message: '无效的参数' },
  { value: -8, message: '没有找到指定的记录' },
  { value: -9, message: '身份验证失败' },
  { value: -10, message: '无效的令牌' },
  { value: -11, message: '拒绝访问' },
  { value: -12, message: '会话超时' },
  { value: -19, message: '权限不足' },
  { value: -20, message: '当前用户信息不足' },
  { value: -21, message: '资源已被占用' },
  { value: -25, message: '没有控制权' },
  { value: -26, message: '违反规则' },
  { value: -104, message: '不支持所请求的HTTP方法' },
  { value: -105, message: '缺少必要的请求参数' },
  { value: -204, message: '重复的值' },
  { value: -206, message: '所引用的数据不存在或所要删除的记录被其它记录引用' },
];

const TOKEN_TIMEOUT_PERIOD = 60 * 1000 * 10;

class Request {
  public instance: AxiosInstance;

  private readonly instanceId: string;

  constructor(config: IRequestInstanceConfig) {
    const { interceptors, instanceId } = config;
    this.instanceId = instanceId;
    this.instance = axios.create(config);
    if (interceptors) {
      // 实例请求拦截器
      this.instance.interceptors.request.use(
        interceptors.requestSuccessInterceptor,
        interceptors.requestFailureInterceptor,
      );
      // 实例响应拦截器
      this.instance.interceptors.response.use(
        interceptors.responseSuccessInterceptor,
        interceptors.responseSuccessInterceptor,
      );
    }
    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config: IRequestConfig) => {
        // eslint-disable-next-line prefer-const
        let { headers, localTokenCheckDisabled } = config;
        const lastApiTime = parseInt(localStorage.getItem(`${this.instanceId}-LAST-API-TIME`) || '0', 10);
        if (localTokenCheckDisabled !== true && Date.now() - lastApiTime > TOKEN_TIMEOUT_PERIOD) {
          return Promise.reject({ response: { status: 403 } });
        }
        const token = localStorage.getItem(TOKEN_NAME);
        if (!headers) headers = {};
        if (token) headers['X-Auth-Token'] = token;
        // console.log(config);
        return config;
      },
      (err) => {
        console.log(err);
      },
    );
    // 全局响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<IDataType<any>, any>) => {
        if (response.status === 200) {
          this.handleRequestSuccess();
          const { data } = response;
          if (data.errCode === CODE.REQUEST_SUCCESS) {
            return data;
          }
          try {
            data.customMsg = ERR_MESSAGE.find((e) => e.value === data.errCode)?.message;
          } catch (err) {
            console.log(err);
          }
          MessagePlugin.error(data.customMsg || data.message);
          return Promise.reject(data);
        }
        return response;
      },
      (err) => {
        if (err.response === undefined) {
          MessagePlugin.error('网络异常');
          return Promise.reject(err);
        }

        switch (err.response.status) {
          case 403: {
            return Request.tokenTimeout(err);
          }
          default: {
            console.log('NETERROR', err);

            const { config } = err;
            MessagePlugin.error('网络异常');

            // 尝试重连
            if (!config || !config.retry) return Promise.reject(err);

            config.retryCount = config.retryCount || 0;
            if (config.retryCount >= config.retry) {
              return Promise.reject(err);
            }
            config.retryCount += 1;
            const backoff = new Promise((resolve) => {
              setTimeout(() => {
                resolve(null);
              }, config.retryDelay || 1);
            });
            return backoff.then(() => this.instance.request(config));
          }
        }
      },
    );
  }

  public get<ResponseType>({ data, ...config }: IRequestConfig): Promise<IDataType<ResponseType>> {
    return this.instance.request<any, IDataType<ResponseType>, any>({
      ...config,
      method: 'GET',
      params: data,
    });
  }

  public post<ResponseType>(config: IRequestConfig): Promise<IDataType<ResponseType>> {
    return this.instance.request<any, IDataType<ResponseType>, any>({ ...config, method: 'POST' });
  }

  public delete<ResponseType>({ data, url, ...config }: IRequestConfig): Promise<IDataType<ResponseType>> {
    return this.instance.request<any, IDataType<ResponseType>, any>({
      ...config,
      url: `${url}?${new URLSearchParams(data).toString()}`,
      method: 'DELETE',
    });
  }

  public patch<ResponseType>(config: IRequestConfig): Promise<IDataType<ResponseType>> {
    return this.instance.request<any, IDataType<ResponseType>, any>({ ...config, method: 'PATCH' });
  }

  public put<ResponseType>(config: IRequestConfig): Promise<IDataType<ResponseType>> {
    return this.instance.request<any, IDataType<ResponseType>, any>({ ...config, method: 'PUT' });
  }

  private static async tokenTimeout(err: any) {
    await MessagePlugin.error('无效令牌，请重新登录');
    await router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
    return Promise.reject(err);
  }

  private handleRequestSuccess() {
    localStorage.setItem(`${this.instanceId}-LAST-API-TIME`, Date.now().toString());
  }
}

export default Request;
