import { DICT_TYPES } from '@/constants';
import * as USER from '@/types/user';
import { WithCondition } from './request';
import { GetPartsRequired } from '@/types/utils';

export interface IDictEntry {
  id: string;
  parentId?: string;
  category: DICT_TYPES;
  code?: string;
  value: string;
  orderNum?: number;
  extraData?: string;
}

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

export type UserOperateKind =
  | 'login'
  | 'logout'
  | 'update'
  | 'delete'
  | 'insert'
  | 'enable'
  | 'disable'
  | 'chg_pwd'
  | 'chg_other_pwd'
  | 'update_roles'
  | 'update_data_grps';
export type SysOperateKind = 'update';
export type DictOperateKind = 'insert' | 'update' | 'delete.id' | 'delete.category' | 'delete.code';
export type GroupOperateKind = 'insert' | 'update' | 'delete';
export type RoleOperateKind = 'insert' | 'update' | 'delete' | 'update_privs';
export type MediaOperateKind = 'insert' | 'update' | 'download';

export type OperateKind =
  | UserOperateKind
  | SysOperateKind
  | DictOperateKind
  | GroupOperateKind
  | RoleOperateKind
  | MediaOperateKind;

export interface ILogEntry {
  logId: string;
  time: number;
  userId: string;
  userName: string;
  grpId: string;
  clientIp: string;
  op: OperateKind;
  success: boolean;
  targetType: string;
  targetId: string;
  description: string;
  data: ILogEntry[];
}

// API
// /dict
export type IReqGetDict = WithCondition<{
  id?: string;
  parentId?: string;
  category?: number;
  code?: string;
  value?: string;
  extraData?: string;
  parentCode?: string;
  parentValue?: string;
}>;

// /log
export type IReqGetLog = GetPartsRequired<ILogEntry, 'time'>;

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
export type IReqGetUser = WithCondition<{
  userId?: string;
  userName?: string;
  grpId?: string;
  admin?: boolean;
  disabled?: boolean;
  personName?: string;
  createTime?: string;
  createUser?: string;
}>;
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
