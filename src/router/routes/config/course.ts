import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/course',
  name: 'course',
  component: LAYOUT,
  redirect: '/course/list',
  meta: {
    // hideChildrenInMenu: true,
    icon: 'fa-solid:swatchbook',
    title: '课程管理',
    orderNo: 60,
  },
  children: [
    {
      path: 'group',
      name: 'group',
      component: () => import('/@/views/course/group/index.vue'),
      meta: {
        title: '团课管理',
        // hideMenu: true,
      },
    },

    {
      path: 'list',
      name: 'list',
      component: () => import('/@/views/course/index.vue'),
      meta: {
        title: '课程管理',
        // hideMenu: true,
      },
    },
  ],
};

export default course;
