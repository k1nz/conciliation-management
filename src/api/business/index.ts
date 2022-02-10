import requestInstance from '../index';
import * as BIZ from '@/types/business';

enum SYS_PREFIX {
  case = '/med_case',
  party = '/party',
  mediator = '/mediator',
  pdf = '/pdf',
  report = '/report',
}
// 调解受理表
export const getCase = (data: BIZ.IReqGetCase) => {
  return requestInstance.get<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}`,
    data,
  });
};
export const createCase = (data: BIZ.IReqCreateCase) => {
  return requestInstance.post<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}`,
    data,
  });
};
export const updateCase = (data: BIZ.IReqUpdateCase) => {
  return requestInstance.put<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}`,
    data,
  });
};
export const deleteCase = (data: BIZ.IReqDeleteCase) => {
  return requestInstance.delete<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}/brief`,
    data,
  });
};
export const updateCaseArchive = (data: { acceptDate: string; caseId: string }) => {
  return requestInstance.get<BIZ.IMedCaseBrief>({
    url: `${SYS_PREFIX.case}/archive`,
    data,
  });
};
