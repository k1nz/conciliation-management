import { GENDER_TYPE } from '@/constants';

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
  genderText: string;
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
  moneyInvolved: number;
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
export interface IReqGetCase {
  acceptDate: string;
  caseId?: string;
  medOfficeId?: string;
  docNum?: string;
  caseKind?: CASE_TYPE;
  proccesdureKind?: CASE_PROCEDURE_TYPE;
  disputeKind?: string;
  acceptor?: string;
  mediator?: string;
  closeDate?: string;
}
// API END
