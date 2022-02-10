export const COLUMNS = [
  {
    title: '序号',
    align: 'left',
    width: 80,
    colKey: 'index',
  },
  {
    title: '用户账号',
    colKey: 'userName',
    width: 200,
    align: 'left',
  },
  {
    title: '用户姓名',
    colKey: 'personName',
    width: 200,
    align: 'left',
  },
  {
    title: '所属分组',
    width: 200,
    colKey: 'grpName',
  },
  {
    title: '备注',
    width: 200,
    colKey: 'description',
  },
  {
    title: '账号状态',
    width: 150,
    colKey: 'disabled',
  },
  {
    title: '创建人',
    width: 200,
    colKey: 'createUserName',
  },
  {
    title: '创建时间',
    width: 200,
    colKey: 'createTime',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 200,
    colKey: 'op',
    title: '操作',
  },
];
