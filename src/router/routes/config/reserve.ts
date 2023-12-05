import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const reserve: AppRouteModule = {
  path: '/checkIn',
  name: 'checkIn',
  component: LAYOUT,
  redirect: '/checkIn/userCheckIn',
  meta: {
    orderNo: 20,
    icon: 'mingcute:book-3-fill',
    title: '预约签到',
  },

  children: [
    {
      path: 'userCheckIn',
      name: 'userCheckIn',
      component: () => import('/@/views/checkIn/userCheckIn/index.vue'),
      meta: {
        title: '预约管理',
      },
    },
    {
      path: 'reserveManage',
      name: 'reserveManage',
      component: () => import('/@/views/checkIn/reserveManage/index.vue'),
      meta: {
        title: '签到管理',
      },
    },
  ],
};

export default reserve;
