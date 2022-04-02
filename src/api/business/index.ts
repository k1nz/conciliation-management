import requestInstance from '../index';
import * as BIZ from '@/types/business';
import { IDataType } from '@/types/request';

enum SYS_PREFIX {
  case = '/med_case',
  party = '/party',
  mediator = '/mediator',
  pdf = '/pdf',
  report = '/report',
  media = '/media',
}
// 调解受理表
export const getCase = (data: BIZ.IReqGetCase) => {
  return requestInstance.get<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}`,
    data,
  });
};
export const getBriefCase = (data: Omit<BIZ.IReqGetCase, 'closeDate'>) => {
  return requestInstance.get<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}/brief`,
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
  return requestInstance.delete<null>({
    url: `${SYS_PREFIX.case}`,
    data,
  });
};
export const caseArchive = (data: BIZ.IReqArchive) => {
  return requestInstance.put<BIZ.IMedCase>({
    url: `${SYS_PREFIX.case}/archive`,
    data,
  });
};
// 当事人
export const getParty = (data: BIZ.IReqGetParty) => {
  return requestInstance.get<BIZ.IParty>({
    url: `${SYS_PREFIX.party}`,
    data,
  });
};
export const createParty = (data: BIZ.IReqCreateParty[]) => {
  return requestInstance.post<BIZ.IParty>({
    url: `${SYS_PREFIX.party}`,
    data,
  });
};
export const updateParty = (data: Partial<BIZ.IParty>[]) => {
  return requestInstance.put<BIZ.IParty>({
    url: `${SYS_PREFIX.party}`,
    data,
  });
};
export const deleteParty = (data: BIZ.IReqDeleteParty) => {
  return requestInstance.delete<null>({
    url: `${SYS_PREFIX.party}`,
    data,
  });
};
// 媒体
export const upload = (data: FormData) => {
  return requestInstance.post<BIZ.IResUpload>({
    url: `${SYS_PREFIX.media}/content`,
    data,
  });
};
// PDF流
export const getPdfStream = (data: BIZ.IReqPdfStream) => {
  return requestInstance.get<ArrayBuffer>({
    url: `${SYS_PREFIX.pdf}`,
    data,
    responseType: 'arraybuffer',
  });
};

/**
 * 报表
 */
export const getMonthlyReport = (data: BIZ.IGetMonthlyReport) => {
  return requestInstance.get<BIZ.IMedMonthlyReport>({
    url: `${SYS_PREFIX.report}/monthly`,
    data,
  });
};
export const getQuarterlyReport = (data: BIZ.IGetMonthlyReport) => {
  return requestInstance.get<BIZ.IMedQuarterlyReport>({
    url: `${SYS_PREFIX.report}/quarterly`,
    data,
  });
};
export const getSemiannualReport = (data: BIZ.IGetMonthlyReport) => {
  return requestInstance.get<BIZ.IMedSemiannualReport>({
    url: `${SYS_PREFIX.report}/semiannually`,
    data,
  });
};
function getAnnualReport(data: BIZ.IGetPreciseAnnualReport): Promise<IDataType<BIZ.IMedAnnualReport>>;
function getAnnualReport(data: BIZ.IGetRangeAnnualReport): Promise<IDataType<BIZ.IMedAnnualReport>>;
function getAnnualReport(data: BIZ.IGetPreciseAnnualReport | BIZ.IGetRangeAnnualReport) {
  return requestInstance.get<BIZ.IMedAnnualReport>({
    url: `${SYS_PREFIX.report}/annually`,
    data,
  });
}
export { getAnnualReport };
