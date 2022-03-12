import { AxiosRequestConfig, AxiosResponse } from 'axios';
// 调用实例方法时传入的类型
export interface IRequestConfig extends AxiosRequestConfig {
  notNullExclude?: string[];
  deleteValue?: any[];
  localTokenCheckDisabled?: boolean;
}
export interface IRequestInterceptor<ResponseType = AxiosResponse> {
  requestSuccessInterceptor?: (config: IRequestConfig) => IRequestConfig;
  requestFailureInterceptor?: (err: any) => any;
  responseSuccessInterceptor?: (response: AxiosResponse<ResponseType>) => AxiosResponse<ResponseType>;
  responseFailureInterceptor?: (err: any) => any;
}
// 创建实例构造函数参数类型
export interface IRequestInstanceConfig<ResponseType = AxiosResponse> extends AxiosRequestConfig {
  instanceId: string;
  interceptors?: IRequestInterceptor<ResponseType>;
}

export interface IDataType<T> {
  errCode: number;
  message: string;
  data?: Array<T>;
  count?: number;
  customMsg?: string;
}

export interface IReqCondition {
  __limit?: number | string;
  __page?: number | string;
  __sortBy?: string;
  __fields?: string;
}

type GetConditionSuffixType =
  | '$in'
  | '$null'
  | '$notnull'
  | '$gt'
  | '$ge'
  | '$lt'
  | '$le'
  | '$under'
  | '$start'
  | '$like'
  | '$end';
export type WithCondition<T extends Record<string, any>> = IReqCondition &
  Partial<T> & {
    [P in keyof T as `${string & P}${GetConditionSuffixType}`]?: string;
  };
