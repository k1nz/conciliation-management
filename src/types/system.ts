import * as USER from '@/types/user';
import { IReqCondition } from './request';

export interface IFlatGroup {
  grpId: string;
  grpName: string;
  grpKind?: 0 | 1;
  parentGrpId?: string;
  description?: string;
  createTime: number | string;
  createUser: string;
  createUserName: string;
}

export type ITreeGroupObject = IFlatGroup & {
  children: IFlatGroup[];
};

export type ITreeGroup = ITreeGroupObject[];

// API
// /log
export interface IReqGetLog {
  logId?: string;
  time: string;
  userId?: string;
  userName?: string;
  grpId?: string;
  clientIp?: string;
  op?: string;
  success?: boolean;
  targetType?: string;
  targetId?: string;
}
export interface IResGetLog extends IReqGetLog {
  logId: string;
  time: string;
  op: string;
  success: boolean;
}

// /role
export interface IReqGetRoles {
  roleId?: string;
  roleCode?: string;
  roleName?: string;
}
export type IResRoles = USER.IRoleType;
export interface IReqCreateRole {
  roleName: string;
  description?: string;
  privs?: USER.IPrivateObject[];
}
export interface IReqUpdateRole extends IReqCreateRole {
  roleId: string;
}
export interface IReqUpdateRolePrivs {
  roleId: string;
  privs?: USER.IPrivateObject[];
}
export interface IReqDeleteRole {
  roleId: string;
}

// /user
export interface IReqGetUser extends IReqCondition {
  userId?: string;
  userName?: string;
  grpId?: string;
  admin?: boolean;
  disabled?: boolean;
  personName?: string;
  createTime?: string;
  createUser?: string;
}
export type IResGetUser = USER.IUserType;

export interface IReqCreateUser extends Omit<USER.IUserType, 'roles'> {
  userName: string;
  grpId: string;
  initPwd: string;
  personName?: string;
  description?: string;
  roles?: { roleId: string }[];
  dataGrps: string[];
}
export type IResCreateUser = USER.IUserType;

export interface IReqUpdateUser extends Omit<USER.IUserType, 'roles'> {
  userId: string;
  userName: string;
  grpId: string;
  personName?: string;
  description?: string;
  roles?: { roleId: string }[];
  dataGrps?: string[];
}
export type IResUpdateUser = USER.IUserType;

// /user/roles
export interface IUpdateRoles {
  userId: string;
  roles: { roleId: string }[];
}

// /user/dataGrps
export interface IUpdateDataGroups {
  userId: string;
  dataGrps: string[];
}

// /grp
export interface IReqGetGroup {
  grpId?: string;
  grpName?: string;
  parentGrpId?: string;
  createTime?: string;
  createUser?: string;
}
export type IResGetGroup = IFlatGroup;

export interface IReqCreateGroup {
  grpName: string;
  parentGrpId: string;
  description?: string;
}
export type IResCreateGroup = IFlatGroup;

export type IReqUpdateGroup = IFlatGroup;
export type IResUpdateGroup = IFlatGroup;
// API END
