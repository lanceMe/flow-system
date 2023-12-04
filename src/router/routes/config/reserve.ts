import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/checkIn',
  name: 'checkIn',
  component: LAYOUT,
  redirect: '/checkIn/userCheckIn',
  meta: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
    title: '预约签到',
  },

  children: [
    {
      path: 'userCheckIn',
      name: 'userCheckIn',
      component: () => import('/@/views/checkIn/userCheckIn/index.vue'),
      meta: {
        title: '入场签到',
      },
    },
    {
      path: 'reserveManage',
      name: 'reserveManage',
      component: () => import('/@/views/checkIn/reserveManage/index.vue'),
      meta: {
        title: '预约管理',
      },
    },
  ],
};

export default course;
