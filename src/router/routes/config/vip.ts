import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/vip',
  name: 'vip',
  component: LAYOUT,
  redirect: '/vip/member',
  meta: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
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
  ],
};

export default course;
