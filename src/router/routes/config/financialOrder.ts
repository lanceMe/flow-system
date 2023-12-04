import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/financialOrder',
  name: 'financialOrder',
  component: LAYOUT,
  redirect: '/financialOrder/order',
  meta: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
    title: '财务与订单',
  },
  children: [
    {
      path: 'order',
      name: 'order',
      component: () => import('/@/views/financialOrder/order/index.vue'),
      meta: {
        title: '订单',
      },
    },
    {
      path: 'flow',
      name: 'flow',
      component: () => import('/@/views/financialOrder/flow/index.vue'),
      meta: {
        title: '交易流水',
      },
    },
    {
      path: 'revenueReport',
      name: 'revenueReport',
      component: () => import('/@/views/financialOrder/revenueReport/index.vue'),
      meta: {
        title: '营收报表',
      },
    },
  ],
};

export default course;
