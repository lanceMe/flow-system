import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const act: AppRouteModule = {
  path: '/act',
  name: 'act',
  component: LAYOUT,
  redirect: '/act/events',
  meta: {
    orderNo: 30,
    icon: 'ion:git-compare-outline',
    title: '活动管理',
  },

  children: [
    {
      path: 'events',
      name: 'events',
      component: () => import('/@/views/act/events/index.vue'),
      meta: {
        title: '活动列表',
      },
    },
    {
      path: 'applyFor',
      name: 'applyFor',
      component: () => import('/@/views/act/applyFor/index.vue'),
      meta: {
        title: '报名列表',
      },
    },
  ],
};

export default act;
