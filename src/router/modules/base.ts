import DashboardIcon from '@/assets/assets-slide-dashboard.svg';

export default [
  {
    path: '/dashboard',
    component: () => import('@/layouts'),
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: { title: '调解管理', icon: DashboardIcon },
    children: [
      {
        path: 'base',
        name: 'dashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: { title: '调解台账' },
      },
      // {
      //   path: 'detail',
      //   name: 'dashboardDetail',
      //   component: () => import('@/pages/dashboard/detail/index.vue'),
      //   meta: { title: '统计报表' },
      // },
    ],
  },
];
