import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const vip: AppRouteModule = {
  path: '/vip',
  name: 'vip',
  component: LAYOUT,
  redirect: '/vip/member',
  meta: {
    orderNo: 50,
    icon: 'bxs:id-card',
    title: '会员管理',
  },

  children: [
    {
      path: 'member',
      name: 'member',
      component: () => import('/@/views/vip/member/index.vue'),
      meta: {
        title: '会员列表',
      },
    },
    {
      path: 'cards',
      name: 'cards',
      component: () => import('/@/views/vip/cards/index.vue'),
      meta: {
        title: '会员卡',
      },
    },
    {
      path: 'memberDetail',
      name: 'memberDetail',
      component: () => import('/@/views/vip/member/detail/index.vue'),
      meta: {
        hideMenu: true,
        title: '会员详情',
      },
    },
  ],
};

export default vip;
