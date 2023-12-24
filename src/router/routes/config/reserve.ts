import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const reserve: AppRouteModule = {
  path: '/checkIn',
  name: 'checkIn',
  component: LAYOUT,
  redirect: '/checkIn/userCheckIn',
  meta: {
    orderNo: 20,
    icon: 'mingcute:book-3-fill',
    title: '预约签到',
    roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
  },

  children: [
    {
      path: 'userCheckIn',
      name: 'userCheckIn',
      component: () => import('/@/views/checkIn/userCheckIn/index.vue'),
      meta: {
        title: '入场签到',
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
      },
    },
    {
      path: 'reserveManage',
      name: 'reserveManage',
      component: () => import('/@/views/checkIn/reserveManage/index.vue'),
      meta: {
        title: '预约管理',
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
      },
    },
  ],
};

export default reserve;
