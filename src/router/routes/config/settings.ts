import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/settings',
  name: 'settings',
  component: LAYOUT,
  redirect: '/settings/logs',
  meta: {
    orderNo: 90,
    icon: 'mingcute:safe-shield-2-fill',
    title: '系统设置',
  },

  children: [
    {
      path: 'logs',
      name: 'logs',
      component: () => import('/@/views/settings/index.vue'),
      meta: {
        title: '操作日志',
      },
    },
    {
      path: 'changePassword',
      name: 'changePassword',
      component: () => import('/@/views/settings/changePassword/index.vue'),
      meta: {
        title: '修改密码',
      },
    },
  ],
};

export default course;
