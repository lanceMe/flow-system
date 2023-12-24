import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const course: AppRouteModule = {
  path: '/course',
  name: 'course',
  component: LAYOUT,
  redirect: '/course/group',
  meta: {
    // hideChildrenInMenu: true,
    icon: 'fa-solid:swatchbook',
    title: '课程管理',
    orderNo: 60,
    roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
  },
  children: [
    {
      path: 'groupopen',
      name: 'groupopen',
      props: {
        type: 'groupopen',
      },
      component: () => import('/@/views/course/group/index.vue'),
      meta: {
        title: '团课管理',
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
        // hideMenu: true,
      },
    },
    {
      path: 'private',
      name: 'private',
      component: () => import('/@/views/course/group/index.vue'),
      props: {
        type: 'private',
      },
      meta: {
        title: '私教课管理',
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
        // hideMenu: true,
      },
    },
    {
      path: 'index',
      name: 'CourseList',
      component: () => import('/@/views/course/index.vue'),
      meta: {
        title: '课程模版',
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION, RoleEnum.COACH],
        // hideMenu: true,
      },
    },
  ],
};

export default course;
