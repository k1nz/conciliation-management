import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ICustomConfig extends AxiosRequestConfig {
  notNullExclude?: string[];
  deleteValue?: any[];
}
export interface IRequestInterceptor<ResponseType = AxiosResponse> {
  requestSuccessInterceptor?: (config: ICustomConfig) => ICustomConfig;
  requestFailureInterceptor?: (err: any) => any;
  responseSuccessInterceptor?: (response: AxiosResponse<ResponseType>) => AxiosResponse<ResponseType>;
  responseFailureInterceptor?: (err: any) => any;
}

export interface IRequestConfig<ResponseType = AxiosResponse> extends ICustomConfig {
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
