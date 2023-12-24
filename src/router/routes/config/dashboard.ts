import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    hideChildrenInMenu: true,
    icon: 'ant-design:home-filled',
    title: '首页',
    roles: [
      RoleEnum.ADMIN,
      RoleEnum.MANAGER,
      RoleEnum.FINANCIAL,
      RoleEnum.RECEPTION,
      RoleEnum.COACH,
    ],
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        hideMenu: true,
        title: '首页',
        roles: [
          RoleEnum.ADMIN,
          RoleEnum.MANAGER,
          RoleEnum.FINANCIAL,
          RoleEnum.RECEPTION,
          RoleEnum.COACH,
        ],
      },
    },
  ],
};

export default dashboard;
