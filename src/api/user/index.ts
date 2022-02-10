import requestInstance from '../index';
import * as USER from '@/types/user';

enum USER_PREFIX {
  login = '/login',
  logout = '/logout',
  changePassword = '/change_pwd',
}

export const login = (data: USER.ILoginInfoType) => {
  return requestInstance.post<USER.IUserInfoType>({
    url: `${USER_PREFIX.login}`,
    data,
  });
};

export const logout = () => {
  return requestInstance.post<undefined>({
    url: `${USER_PREFIX.logout}`,
  });
};

export const changePassword = (data: USER.IChangePasswordData) => {
  return requestInstance.post<undefined>({
    url: `${USER_PREFIX.changePassword}`,
    data,
  });
};
