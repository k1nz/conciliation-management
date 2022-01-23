import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import * as I_USER from '@/interface/user';

export const login = (data: I_USER.ILoginInfoType): AxiosPromise<I_USER.IUserInfoType> => {
  return request({
    url: '/login',
    method: 'post',
    data,
  });
};

export const logout = () => {
  return request({
    url: '/logout',
    method: 'post',
  });
};

export const changePassword = (data: I_USER.IChangePasswordData) => {
  return request({
    url: '/change_pwd',
    method: 'post',
    data,
  });
};
