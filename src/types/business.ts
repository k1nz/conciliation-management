import { GENDER_TYPE, QuarterType, SemiannualType } from '@/constants';
import { WithCondition } from './request';
import { GetPartsRequired } from '@/types/utils';

export type MonthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export enum PARTY_TYPE {
  First = 1,
  Second = 2,
  Third = 3,
}
export enum CASE_TYPE {
  People = 1,
  Public = 2,
  Stop = 3,
}
export enum CASE_PROCEDURE_TYPE {
  Easy = 1,
  Normal = 2,
  Judicial = 3,
}

export interface IParty {
  partyId: string;
  medOfficeId: string;
  name: string;
  partyKind: PARTY_TYPE;
  gender: GENDER_TYPE;
  idCardNum: string;
  birthday: string;
  age: number;
  phoneNum: string;
  edu: string;
  race: string;
  job: string;
  workLocOrAddr: string;
  applicationDate: string;
  accepted: boolean;
  idCardPhotoMediaTm?: string;
  idCardPhotoMediaId?: string;
  idCardPhotoMediaUrl?: string;
  statement?: string;
  openId?: string;
  investigateDate?: string;
  investigateLoc?: string;
  dispute?: string;
  investigator?: string;
  recorder?: string;
  note?: string;
  caseId?: string;
  caseAcceptDate?: string;
}

export interface IMedCase {
  acceptDate: string;
  caseId: string;
  medOfficeId: string;
  officeFullName: string;
  committeeName: string;
  docNum: string;
  failedDocNum: string;
  caseName: string;
  caseKind: CASE_TYPE;
  procedureKind: CASE_PROCEDURE_TYPE;
  disputeKind: string;
  partyNum: number;
  moneyInvolved: string;
  synopsis: string;
  agreement: string;
  executionState: string;
  acceptMode: string;
  transferor: string;
  acceptor: string;
  medDate: string;
  medAddr: string;
  medDispute: string;
  participants: string;
  mediator?: string;
  mediatorDuty: string;
  medRecorder: string;
  closeDate: string;
  closingStatement: string;
  executionKind: string;
  revisit: number;
  archiveDate: string;
  retentionPeriod: string;
  closingNote: string;
  receiptContent: string;
  receiptDate: string;
  court: string;
  parties: IParty[];
}

export type IDocType =
  | 'cover'
  | 'catalog'
  | 'close_rpt'
  | 'agreement'
  | 'acception'
  | 'notice'
  | 'application'
  | 'record'
  | 'med_note'
  | 'mediation'
  | 'receipt'
  | 'confirmation'
  | 'termination'
  | 'all';

export interface IDocPreviewHooksOptions {
  partyId?: string;
  caseId: string;
  acceptDate: string;
  docTyp: IDocType;
}

// API
export type IReqGetCase = WithCondition<{
  acceptDate: string;
  caseId?: string;
  medOfficeId?: string;
  docNum?: string;
  caseKind?: CASE_TYPE;
  procedureKind?: CASE_PROCEDURE_TYPE;
  disputeKind?: string;
  acceptor?: string;
  mediator?: string;
  closeDate?: string;
}>;
export interface IReqCreateCase extends Partial<Omit<IMedCase, 'parties'>> {
  medOfficeId: string;
  caseKind: CASE_TYPE;
  procedureKind: CASE_PROCEDURE_TYPE;
  disputeKind: string;
  moneyInvolved: string;
  synopsis: string;
  agreement: string;
  parties?: GetPartsRequired<Partial<IParty>, 'partyId' | 'applicationDate'>[];
}
export type IReqUpdateCase = IReqCreateCase;
export interface ICasePrimaryKey {
  acceptDate: string;
  caseId: string;
}
export type IReqDeleteCase = ICasePrimaryKey;
export type IReqArchive = ICasePrimaryKey;

// 当事人
export type IReqGetParty = WithCondition<{
  applicationDate: string;
  partyId?: string;
  medOfficeId?: string;
  name?: string;
  idCardNum?: string;
  phoneNum?: string;
  openId?: string;
  caseAcceptDate?: string;
  caseId?: string;
}>;
export interface IReqCreateParty extends Partial<Omit<IParty, 'partyId'>> {
  medOfficeId: string;
  name: string;
  partyKind: PARTY_TYPE;
  gender: GENDER_TYPE;
  idCardNum: string;
  birthday: string;
  age: number;
  phoneNum: string;
  edu: string;
  race: string;
  job: string;
  workLocOrAddr: string;
  idCardPhotoMediaTm?: string;
  idCardPhotoMediaId?: string;
  statement?: string;
  caseAcceptDate?: string;
  caseId?: string;
}
export interface IReqDeleteParty {
  applicationDate: string;
  partyId: string;
}
// upload
export interface IReqUpload {
  usage?: 'party-id-card-photo';
  mediaTm?: string;
  mediaId?: string;
  typ?: string;
  refTm?: string;
  refId?: string;
}
export interface IResUpload extends IReqUpload {
  url: string;
  usage: 'party-id-card-photo';
  mediaTm: string;
  mediaId: string;
  typ: string;
  sz?: string;
  uploadTm?: string;
}

// pdf stream
export interface IReqPdfStream {
  acceptDate: string;
  caseId: string;
  docTyp: IDocType;
  partyId?: string;
  disposition?: 'attachment' | 'inline';
  __token: string;
}

/**
 * 报表
 */
// 请求数据类型
export interface IRootGetReport {
  city?: string;
  district?: string;
  medOfficeId?: string;
  year: number;
}
export interface IGetMonthlyReport extends IRootGetReport {
  month?: MonthType;
}
export interface IGetQuarterlyReport extends IRootGetReport {
  quarter?: QuarterType;
}
export interface IGetSemiannualReport extends IRootGetReport {
  half?: SemiannualType;
}
export interface IGetRangeAnnualReport extends Omit<IRootGetReport, 'year'> {
  yearStart: number;
  yearEnd: number;
}
export type IGetPreciseAnnualReport = IRootGetReport;

// 返回数据类型
export interface IMedReport {
  year: number;
  /**
   * 案件数量
   */
  caseCnt: number;
  /**
   * 涉案人数
   */
  partyCnt: number;
  /**
   * 涉案金额
   */
  moneyInvolved: string;
  /**
   * 人民调解编号
   */
  peopleMedDocNumList: string;
  /**
   * 治安调解编号
   */
  securityMedDocNumList: string;
}
export interface IMedMonthlyReport extends IMedReport {
  month: MonthType;
}

export interface IMedQuarterlyReport extends IMedReport {
  quarter: QuarterType;
}

export interface IMedSemiannualReport extends IMedReport {
  half: SemiannualType;
}

export type IMedAnnualReport = IMedReport;
// API END
