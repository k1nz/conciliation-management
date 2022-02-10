import DashboardIcon from '@/assets/assets-slide-dashboard.svg';

export default [
  {
    path: '/home',
    component: () => import('@/layouts'),
    redirect: '/home/dashboard',
    name: 'dashboard',
    meta: { title: '调解管理', icon: DashboardIcon },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: { title: '调解台账', permsCode: 'mediate_sum' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/home/register/index.vue'),
        meta: { title: '调解登记', permsCode: 'med_case:read' },
      },
    ],
  },
  // {
  //   path: '/mediation',
  //   component: () => import('@/layouts'),
  //   redirect: '/mediation/office',
  //   name: 'mediation',
  //   meta: { title: '调解室管理', icon: 'desktop', permsCode: 'mediationRoomMG' },
  //   children: [
  //     {
  //       path: 'office',
  //       name: 'mediationOffice',
  //       component: () => import('@/pages/mediation/office/index.vue'),
  //       meta: { title: '调解室管理', permsCode: 'med_office:read' },
  //     },
  //     {
  //       path: 'mediator',
  //       name: 'mediator',
  //       component: () => import('@/pages/mediation/mediator/index.vue'),
  //       meta: { title: '调解员管理', permsCode: 'mediator:read' },
  //     },
  //   ],
  // },
  {
    path: '/list',
    component: () => import('@/layouts'),
    redirect: '/list/office',
    name: 'list',
    meta: { title: '调解报表', icon: 'dashboard' },
    children: [
      {
        path: 'office',
        name: 'officeList',
        component: () => import('@/pages/list/office/index.vue'),
        meta: { title: '调解室清单', permsCode: 'user:read' },
      },
      {
        path: 'mediator',
        name: 'mediatorList',
        component: () => import('@/pages/list/mediator/index.vue'),
        meta: { title: '调解员清单', permsCode: 'log:read' },
      },
      {
        path: 'case',
        name: 'caseList',
        component: () => import('@/pages/list/case/index.vue'),
        meta: { title: '案件清单', permsCode: 'case:read' },
      },
      {
        path: 'dashboard',
        name: 'mediationDashboard',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: { title: '调解台账', permsCode: 'mediate_sum' },
      },
    ],
  },
  {
    path: '/system',
    component: () => import('@/layouts'),
    redirect: '/system/user',
    name: 'system',
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: 'userManagement',
        component: () => import('@/pages/system/user/index.vue'),
        meta: { title: '用户管理', permsCode: 'user:read' },
      },
      {
        path: 'group',
        name: 'groupManagement',
        component: () => import('@/pages/system/group/index.vue'),
        meta: { title: '分组管理', permsCode: 'grp:read' },
      },
      {
        path: 'log',
        name: 'logManagement',
        component: () => import('@/pages/system/log/index.vue'),
        meta: { title: '操作日志', permsCode: 'log:read' },
      },
    ],
  },
];
