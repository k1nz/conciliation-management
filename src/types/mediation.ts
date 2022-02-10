// 调解员
export interface IMediatorType {
  mediatorId: string;
  officeId?: string;
  officeFullName?: string;
  name: string;
  gender: 1 | 2;
  idCardNum: string;
  cellPhone: string;
  residentialAddr: string;
}
// 调解室
export interface IMedOfficeType {
  officeId: string;
  officeName: string;
  officeFullName: string;
  committeeName: string;
  grpId?: string;
  officer: string;
  officerTel: string;
  city: string;
  district?: string;
  street?: string;
  orgKind?: string;
  orgName?: string;
  peopleMedSn: number;
  peopleMedSnYear: number;
  securityMedSn: number;
  securityMedSnYear: number;
  medSnPrefix: string;
  mediators?: IMediatorType[];
}

// API

// /mediator
export interface IReqGetMediator {
  mediator?: string;
  officeId?: string;
  name?: string;
  idCardNum?: string;
  cellPhone?: string;
}
export type IResGetMediator = IMediatorType;

// API END
