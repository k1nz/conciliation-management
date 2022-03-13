import { CASE_PROCEDURE_TYPE, CASE_TYPE, IDocType, PARTY_TYPE } from '@/types/business';
import { GetObjectValueType } from '@/types/utils';

// 合同状态枚举
export const CONTRACT_STATUS = {
  FAIL: 0,
  AUDIT_PENDING: 1,
  EXEC_PENDING: 2,
  EXECUTING: 3,
  FINISH: 4,
};

export const CONTRACT_STATUS_OPTIONS = [
  { value: CONTRACT_STATUS.FAIL, label: '审核失败' },
  { value: CONTRACT_STATUS.AUDIT_PENDING, label: '待审核' },
  { value: CONTRACT_STATUS.EXEC_PENDING, label: '待履行' },
  { value: CONTRACT_STATUS.EXECUTING, label: '审核成功' },
  { value: CONTRACT_STATUS.FINISH, label: '已完成' },
];

// 合同类型枚举
export const CONTRACT_TYPES = {
  MAIN: 0,
  SUB: 1,
  SUPPLEMENT: 2,
};

export const CONTRACT_TYPE_OPTIONS = [
  { value: CONTRACT_TYPES.MAIN, label: '主合同' },
  { value: CONTRACT_TYPES.SUB, label: '子合同' },
  { value: CONTRACT_TYPES.SUPPLEMENT, label: '补充合同' },
];

// 合同收付类型枚举
export const CONTRACT_PAYMENT_TYPES = {
  PAYMENT: 0,
  RECIPT: 1,
};

// 通知的优先级对应的TAG类型
export const NOTIFICATION_TYPES = {
  low: 'primary',
  middle: 'warning',
  high: 'danger',
};

export enum GENDER_TYPE {
  MALE = 1,
  FEMALE = 2,
}
export const GENDER_OPTIONS = [
  {
    label: '男',
    value: GENDER_TYPE.MALE,
  },
  {
    label: '女',
    value: GENDER_TYPE.FEMALE,
  },
];
// 字典类型枚举
export enum DICT_TYPES {
  City = 100,
  Region = 101,
  Court = 102,
  Street = 103,
  UnitCategory = 104,
  Unit = 105,
  Education = 106,
  Nation = 107,
  Career = 108,
  Dispute = 109,
  AcceptWay = 110,
  KeepDeadline = 111,
}

// 履行情况枚举
export enum EXECUTION_TYPES {
  Immediately = 1,
  Promise = 2,
}
export const EXECUTION_OPTIONS = [
  { value: EXECUTION_TYPES.Immediately, label: '当场履行' },
  { value: EXECUTION_TYPES.Promise, label: '承诺履行' },
];

// 履行情况枚举
export enum REVISIT_TYPES {
  Dispense = 1,
  Already = 2,
}
export const REVISIT_OPTIONS = [
  { value: REVISIT_TYPES.Dispense, label: '无需回访' },
  { value: REVISIT_TYPES.Already, label: '已经回访' },
];

// 案件情况
export const CASE_KIND_OPTIONS = [
  { label: '人民调解', value: CASE_TYPE.People },
  { label: '治安调解', value: CASE_TYPE.Public },
  { label: '终止调解', value: CASE_TYPE.Stop },
];

// 程序类别
export const PROCEDURE_KIND_OPTIONS = [
  { label: '简易程序', value: CASE_PROCEDURE_TYPE.Easy },
  { label: '普通程序', value: CASE_PROCEDURE_TYPE.Normal },
  { label: '司法确认', value: CASE_PROCEDURE_TYPE.Judicial },
];

// 当事人类别
export const PARTY_OPTIONS = [
  { label: '一方当事人', value: PARTY_TYPE.First },
  { label: '对方当事人', value: PARTY_TYPE.Second },
  { label: '第三人', value: PARTY_TYPE.Third },
];

export enum DOC_TYPES {
  cover = '卷宗（封皮）',
  catelog = '卷宗（卷内目录）',
  // eslint-disable-next-line camelcase
  close_rpt = '结案报告',
  agreement = '人民/治安调解协议书',
  acception = '民间纠纷受理表',
  notice = '权利义务告知书',
  application = '调解申请书',
  record = '调查笔录',
  // eslint-disable-next-line camelcase
  med_note = '调解笔录',
  mediation = '民间纠纷受理调解表',
  receipt = '收条',
  confirmation = '司法确认申请书',
  termination = '终止调解告知书',
  all = '所有文书',
}
export const DOC_OPTIONS: Record<IDocType, { content: string; value: IDocType | null; disabled?: boolean }> = {
  cover: { content: '卷宗（封皮）', value: 'cover' },
  catelog: { content: '卷宗（卷内目录）', value: 'catelog' },
  close_rpt: { content: '结案报告', value: 'close_rpt' },
  agreement: { content: '人民/治安调解协议书', value: 'agreement' },
  acception: { content: '民间纠纷受理表', value: 'acception' },
  notice: { content: '权利义务告知书', value: 'notice' },
  application: { content: '调解申请书', value: 'application' },
  record: { content: '调查笔录', value: 'record' },
  med_note: { content: '调解笔录', value: 'med_note' },
  mediation: { content: '民间纠纷受理调解表', value: 'mediation' },
  receipt: { content: '收条', value: 'receipt' },
  confirmation: { content: '司法确认申请书', value: 'confirmation' },
  termination: { content: '终止调解告知书', value: 'termination' },
  all: { content: '所有文书', value: 'all' },
};
const { agreement, receipt, termination } = DOC_OPTIONS;
const allDocValues = Object.values(DOC_OPTIONS);

export const CASE_PDF_OPTIONS: Record<
  CASE_TYPE,
  Record<CASE_PROCEDURE_TYPE, GetObjectValueType<typeof DOC_OPTIONS>[]>
> = {
  [CASE_TYPE.People]: {
    [CASE_PROCEDURE_TYPE.Easy]: [agreement, receipt, termination],
    [CASE_PROCEDURE_TYPE.Normal]: allDocValues,
    [CASE_PROCEDURE_TYPE.Judicial]: allDocValues,
  },
  [CASE_TYPE.Public]: {
    [CASE_PROCEDURE_TYPE.Easy]: [agreement, receipt, termination],
    [CASE_PROCEDURE_TYPE.Normal]: [],
    [CASE_PROCEDURE_TYPE.Judicial]: [],
  },
  [CASE_TYPE.Stop]: {
    [CASE_PROCEDURE_TYPE.Easy]: [],
    [CASE_PROCEDURE_TYPE.Normal]: [],
    [CASE_PROCEDURE_TYPE.Judicial]: [],
  },
};
