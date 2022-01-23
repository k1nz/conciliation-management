import STYLE_CONFIG from '@/config/style';

export interface ResDataType {
  code: number;
  data: any;
}

export interface MenuRoute {
  path: string;
  title?: string;
  icon?:
    | string
    | {
        render: () => void;
      };
  redirect?: string;
  children: MenuRoute[];
  meta: any;
}

export type ModeType = 'dark' | 'light';

export type SettingType = typeof STYLE_CONFIG;

export type ClassName = { [className: string]: any } | ClassName[] | string;

export type CommonObjType = {
  [key: string]: string | number;
};

export interface NotificationItem {
  id: string;
  content: string;
  type: string;
  status: boolean;
  collected: boolean;
  date: string;
  quality: 'high' | 'low' | 'middle';
}

// user

export interface IChangePasswordData {
  oldPwd: string;
  newPwd: string;
  reNewPwd: string;
}

export interface IRoleType {
  roleId: string;
  system: boolean;
  roleName: string;
  privs: {
    privCode: string;
    privName: string;
  }[];
}

export type IRolesType = Array<IRoleType>;

export interface IUserType {
  userId?: string;
  userName?: string;
  grpId?: string;
  grpName?: string;
  admin?: boolean;
  disabled?: boolean;
  personName?: string;
  description?: string;
  createTime?: number;
  createUser?: string;
  createUserName?: string;
  dataGrps?: string[];
  roles?: IRolesType;
}

export interface ILoginInfoType {
  userName: string;
  password: string;
  typ: 'web' | 'app';
  lang: 'zh' | 'en';
}

export interface IUserInfoType {
  authToken: string;
  lang?: string;
  user?: IUserType;
}
