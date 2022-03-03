import { IReqCreateParty } from '@/types/business';

export const COLUMNS = [
  {
    title: '#',
    align: 'left',
    width: 80,
    colKey: 'index',
  },
  {
    title: '姓名',
    colKey: 'name',
    // cell: 'name',
    width: 100,
    align: 'left',
  },
  {
    title: '身份证号码',
    width: 200,
    colKey: 'idCardNum',
  },
  {
    title: '类别',
    colKey: 'partyKind',
    cell: 'party-kind',
    width: 130,
    align: 'left',
  },
  {
    title: '性别',
    colKey: 'gender',
    width: 80,
    align: 'left',
  },
  {
    title: '年龄',
    width: 80,
    colKey: 'age',
  },
  {
    title: '联系电话',
    width: 150,
    colKey: 'phoneNum',
  },
  {
    title: '教育程度',
    width: 120,
    colKey: 'edu',
  },
  {
    title: '民族',
    width: 100,
    colKey: 'race',
  },
  {
    title: '职业',
    width: 100,
    colKey: 'job',
  },
  {
    title: '单位/地址',
    width: 180,
    colKey: 'workLocOrAddr',
    cell: 'work-loc',
    ellipsis: true,
  },
  {
    title: '证件照片',
    width: 120,
    colKey: 'idCardPhotoMediaUrl',
    cell: 'id-card-photo',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 150,
    colKey: 'op',
    title: '操作',
  },
];

export const PARTY_INITIAL_DATA: Partial<IReqCreateParty> = {
  medOfficeId: '',
  name: '',
  // partyKind: 1,
  // gender: 1,
  idCardNum: '',
  phoneNum: '',
  edu: '',
  race: '',
  job: '',
  workLocOrAddr: '',
  statement: '',
};
