import { LAYOUT } from '../../constant';
import { RoleEnum } from '/@/enums/roleEnum';
import type { AppRouteModule } from '/@/router/types';

const noti: AppRouteModule = {
  path: '/noti',
  name: 'noti',
  component: LAYOUT,
  redirect: '/noti/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'clarity:notification-solid',
    title: '通知管理',
    orderNo: 40,
    roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION],
  },
  children: [
    {
      path: 'index',
      name: 'NotiPage',
      component: () => import('/@/views/noti/index.vue'),
      meta: {
        title: '通知管理',
        hideMenu: true,
        roles: [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.RECEPTION],
      },
    },
  ],
};

export default noti;
