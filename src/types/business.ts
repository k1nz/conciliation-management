import { GENDER_TYPE } from '@/constants';
import { WithCondition } from './request';
import { GetPartsRequired } from '@/types/utils';

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
export interface IReqDeleteCase {
  acceptDate: string;
  caseId: string;
}
export type IReqArchive = IReqDeleteCase;

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

// API END
