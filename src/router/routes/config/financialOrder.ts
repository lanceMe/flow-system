import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const financialOrder: AppRouteModule = {
  path: '/financialOrder',
  name: 'financialOrder',
  component: LAYOUT,
  redirect: '/financialOrder/order',
  meta: {
    orderNo: 70,
    icon: 'solar:card-bold',
    title: '财务与订单',
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
      path: 'order',
      name: 'order',
      component: () => import('/@/views/financialOrder/order/index.vue'),
      meta: {
        title: '订单',
        roles: [
          RoleEnum.ADMIN,
          RoleEnum.MANAGER,
          RoleEnum.FINANCIAL,
          RoleEnum.RECEPTION,
          RoleEnum.COACH,
        ],
      },
    },
    {
      path: 'flow',
      name: 'flow',
      component: () => import('/@/views/financialOrder/flow/index.vue'),
      meta: {
        title: '交易流水',
        roles: [
          RoleEnum.ADMIN,
          RoleEnum.MANAGER,
          RoleEnum.FINANCIAL,
          RoleEnum.RECEPTION,
          RoleEnum.COACH,
        ],
      },
    },
    {
      path: 'revenueReport',
      name: 'revenueReport',
      component: () => import('/@/views/financialOrder/revenueReport/index.vue'),
      meta: {
        title: '营收报表',
        roles: [RoleEnum.ADMIN, RoleEnum.FINANCIAL],
      },
    },
  ],
};

export default financialOrder;
