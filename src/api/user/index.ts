import requestInstance from '../index';
import * as USER from '@/types/user';

export const login = (data: USER.ILoginInfoType) => {
  return requestInstance.post<USER.IUserInfoType>({
    url: '/login',
    method: 'post',
    data,
  });
};

export const logout = () => {
  return requestInstance.post<undefined>({
    url: '/logout',
    method: 'post',
  });
};

export const changePassword = (data: USER.IChangePasswordData) => {
  return requestInstance.post<undefined>({
    url: '/change_pwd',
    method: 'post',
    data,
  });
};
