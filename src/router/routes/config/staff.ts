import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/staff',
  name: 'staff',
  component: LAYOUT,
  redirect: '/staff',
  meta: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
    title: '员工管理',
  },

  children: [
    {
      path: 'list',
      name: 'list',
      component: () => import('/@/views/staff/index.vue'),
      meta: {
        title: '员工列表',
      },
    },
    {
      path: 'detail',
      name: 'detail',
      component: () => import('/@/views/staff/detail/index.vue'),
      meta: {
        title: '员工详情',
      },
    },
  ],
};

export default course;
