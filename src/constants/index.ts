import { CASE_PROCEDURE_TYPE, CASE_TYPE, PARTY_TYPE } from '@/types/business';

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
