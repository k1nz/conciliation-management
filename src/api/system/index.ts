import requestInstance from '../index';
import * as SYS from '@/types/system';

enum SYS_PREFIX {
  role = 'role',
  user = '/user',
  log = '/log',
  group = '/grp',
  dict = '/dict',
  systemParam = '/sysparam',
}
// 字典
export const getDict = (data?: SYS.IReqGetDict) => {
  return requestInstance.get<SYS.IDictEntry>({
    url: `${SYS_PREFIX.dict}`,
    data,
  });
};
// 日志
export const getLog = (data?: SYS.IReqGetLog) => {
  return requestInstance.get<SYS.ILogEntry>({
    url: `${SYS_PREFIX.log}`,
    data,
  });
};
// 角色
export const getRoles = (data?: SYS.IReqGetRoles) => {
  return requestInstance.get<SYS.IResRoles>({
    url: `${SYS_PREFIX.role}`,
    data,
  });
};
export const createRole = (data: SYS.IReqCreateRole) => {
  return requestInstance.post<SYS.IResRoles>({
    url: `${SYS_PREFIX.role}`,
    data,
  });
};
export const updateRole = (data: SYS.IReqUpdateRole) => {
  return requestInstance.put<SYS.IResRoles>({
    url: `${SYS_PREFIX.role}`,
    data,
  });
};
export const deleteRole = (data: SYS.IReqDeleteRole) => {
  return requestInstance.delete<null>({
    url: `${SYS_PREFIX.role}`,
    data,
  });
};
export const updateRolePrivs = (data: SYS.IReqUpdateRole) => {
  return requestInstance.put<null>({
    url: `${SYS_PREFIX.role}/privs`,
    data,
  });
};
// 用户
export const getUser = (data: SYS.IReqGetUser) => {
  return requestInstance.get<SYS.IResGetUser>({
    url: `${SYS_PREFIX.user}`,
    data,
  });
};

export const createUser = (data: SYS.IReqCreateUser) => {
  return requestInstance.post<SYS.IResCreateUser>({
    url: `${SYS_PREFIX.user}`,
    data,
  });
};

export const updateUser = (data: SYS.IReqUpdateUser) => {
  return requestInstance.put<SYS.IResUpdateUser>({
    url: `${SYS_PREFIX.user}`,
    data,
  });
};

export const deleteUser = (data: { userId: string }) => {
  return requestInstance.delete<null>({
    url: `${SYS_PREFIX.user}`,
    data,
  });
};

export const disableUser = (data: { userId: string; disabled: boolean }) => {
  return requestInstance.put<null>({
    url: `${SYS_PREFIX.user}/disabled`,
    data,
  });
};

export const updateRoles = (data: SYS.IUpdateRoles) => {
  return requestInstance.put<null>({
    url: `${SYS_PREFIX.user}/roles`,
    data,
  });
};

export const updateDataGroups = (data: SYS.IUpdateDataGroups) => {
  return requestInstance.put<null>({
    url: `${SYS_PREFIX.user}/dataGrps`,
    data,
  });
};
// 分组
export const getGroups = (data?: SYS.IReqGetGroup) => {
  return requestInstance.get<SYS.IResGetGroup>({
    url: `${SYS_PREFIX.group}`,
    data,
  });
};

export const createGroups = (data: SYS.IReqCreateGroup) => {
  return requestInstance.post<SYS.IResCreateGroup>({
    url: `${SYS_PREFIX.group}`,
    data,
  });
};

export const updateGroups = (data: SYS.IReqUpdateGroup) => {
  return requestInstance.put<SYS.IResUpdateGroup>({
    url: `${SYS_PREFIX.group}`,
    data,
  });
};

export const deleteGroups = (data: { grpId: string }) => {
  return requestInstance.delete<null>({
    url: `${SYS_PREFIX.group}`,
    data,
  });
};
