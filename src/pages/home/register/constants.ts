import dayjs from 'dayjs';
import { CASE_PROCEDURE_TYPE, CASE_TYPE, IReqCreateCase } from '@/types/business';

export const COLUMNS = [
  {
    title: '#',
    align: 'left',
    width: 80,
    colKey: 'index',
  },
  {
    title: '受理日期',
    colKey: 'acceptDate',
    cell: 'accept-date',
    width: 150,
    align: 'left',
  },
  {
    title: '案件名称',
    colKey: 'caseName',
    width: 170,
    align: 'left',
  },
  {
    title: '纠纷类别',
    width: 150,
    colKey: 'disputeKind',
  },
  {
    title: '涉案人数',
    width: 80,
    colKey: 'partyNum',
  },
  {
    title: '涉案金额',
    width: 120,
    colKey: 'moneyInvolved',
  },
  {
    title: '接办调解员',
    width: 120,
    colKey: 'acceptor',
  },
  {
    title: '移交民警',
    width: 110,
    colKey: 'transferor',
  },
  {
    title: '案号',
    width: 250,
    colKey: 'docNum',
  },
  {
    title: '是否归档',
    width: 80,
    colKey: 'archiveDate',
    cell: 'archive-date',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 200,
    colKey: 'op',
    title: '操作',
  },
];

export const CASE_INITIAL_DATA: IReqCreateCase = {
  medOfficeId: '6',
  caseKind: CASE_TYPE.People,
  procedureKind: CASE_PROCEDURE_TYPE.Easy,
  disputeKind: '',
  moneyInvolved: '0.00',
  synopsis: '',
  agreement: `一、双方对自身伤情有充分认识，双方自愿一次性解决此事。
二、经调解双方和解，双方互不追究对方责任，此事了结。
三、双方经协商后达成谅解，此事互不追究。
四、双方保证今后不得威胁、恐吓、殴打对方，此事对方，此事了结。
五、双方签字后，不得再追究对方此事法律责任。
六、双方签字履行后协议即时生效。`,
  executionState: `${dayjs().format('YYYY年MM月DD日')}，双方在，双方当场履行协议约定的内容`,
  receiptContent: '由 XXX 支付现金/自愿退回定金 XX 元给 XXX。（￥XX.00）',
};

export const AUTO_SIZE_OPTIONS: boolean | { minRows?: number; maxRows?: number } = { minRows: 3 };

export const DEFAULT_PAGINATION = {
  pageSize: 20,
  current: 1,
};

export const DEFAULT_SEARCH_PARAMS = {
  acceptDate$ge: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
  acceptDate$lt: dayjs().format('YYYY-MM-DD'),
  docNum: '',
  medOfficeId: '',
  caseKind: undefined,
  procedureKind: undefined,
  disputeKind: '',
  acceptor: '',
  closeDate: '',
  __limit: DEFAULT_PAGINATION.pageSize,
  __page: DEFAULT_PAGINATION.current,
  __sortBy: 'acceptDate$desc',
};
