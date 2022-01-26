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
  roles?: IRoleType[];
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
