import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const course: AppRouteModule = {
  path: '/course',
  name: 'course',
  component: LAYOUT,
  redirect: '/course/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:aperture-outline',
    title: '课程',
    orderNo: 100001,
  },
  children: [
    {
      path: 'index',
      name: 'MemberCard',
      component: () => import('/@/views/course/management/index.vue'),
      meta: {
        title: '课程管理',
        hideMenu: true,
      },
    },
    {
      path: 'detail',
      name: 'detail',
      component: () => import('/@/views/course/management/detail.vue'),
      meta: {
        title: '课程详情',
        hideMenu: true,
      },
    },
  ],
};

export default course;
