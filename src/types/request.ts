import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IRequestInterceptor<ResponseType = AxiosResponse> {
  requestSuccessInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestFailureInterceptor?: (err: any) => any;
  responseSuccessInterceptor?: (response: AxiosResponse<ResponseType>) => AxiosResponse<ResponseType>;
  responseFailureInterceptor?: (err: any) => any;
}

export interface IRequestConfig<ResponseType = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: IRequestInterceptor<ResponseType>;
}

export interface IDataType<T> {
  errCode: number;
  message: string;
  data?: Array<T>;
  count?: number;
  customMsg?: string;
}
