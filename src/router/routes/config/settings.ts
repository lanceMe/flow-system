import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/settings',
  name: 'settings',
  component: LAYOUT,
  redirect: '/settings/logs',
  meta: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
    title: '活动管理',
  },

  children: [
    {
      path: 'logs',
      name: 'logs',
      component: () => import('/@/views/settings/logs/index.vue'),
      meta: {
        title: '操作日志',
      },
    },
  ],
};

export default course;
