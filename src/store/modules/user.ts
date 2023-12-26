import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  USERID_KEY,
  FIRSTLOGIN_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, changePassword } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  userId?: string;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  [props: string]: any;
  firstLogin: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    userId: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    firstLogin: false,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getUserId(state): string {
      return state.userId || getAuthCache<string>(USERID_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
    getFirstLogin(state): boolean {
      return state.firstLogin || getAuthCache<boolean>(FIRSTLOGIN_KEY);
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserId(info: string | undefined) {
      this.userId = info ? info : ''; // for null or undefined value
      setAuthCache(USERID_KEY, this.userId);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },

    setFirstLogin(flag: boolean) {
      this.firstLogin = flag ? flag : false; // for null or undefined value
      setAuthCache(FIRSTLOGIN_KEY, flag);
    },

    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
      this.firstLogin = false;
      this.userId = undefined;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        // const { token, user_token } = data;
        const token = data?.user_token || data?.token;
        // save token
        this.setToken(token);
        this.setUserId(data?.staff_id);

        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();
      const { firstLogin = false } = userInfo || {};
      this.setFirstLogin(firstLogin);
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        if (firstLogin) {
          await router.replace(userInfo?.homePath || PageEnum.BASE_CHANGE_PASSWORD);
        } else if (goHome) {
          await router.replace(userInfo?.homePath || PageEnum.BASE_HOME);
        }
      }

      return userInfo;
    },

    async getUserInfoAction() {
      if (!this.getToken) return null;
      const data = await getUserInfo(this.getToken, this.getUserId);
      const userInfo = this.transferToUsers(data);
      let { roles = [] } = userInfo;

      if (userInfo?.firstLogin) roles = [RoleEnum.FIRSTLOGIN];
      if (isArray(roles)) {
        const roleList = roles; //roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList as RoleEnum[]);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },

    async changePassword(pwds) {
      if (!this.getToken) return null;
      changePassword(this.getUserId, pwds).then(() => {
        const { createMessage } = useMessage();
        createMessage.success('密码修改成功，将跳转到登录页');
        setTimeout(() => {
          this.logout(true);
        }, 1.5 * 1000);
      });
    },

    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setUserId(undefined);
      this.setFirstLogin(false);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },

    transferToUsers(data) {
      const userInfo: UserInfo = {
        userId: data?.['staff_id'],
        username: data?.['staff_nickname'],
        realName: data?.['staff_nickname'],
        avatar: data?.['staff_avatar_url'],
        desc: data?.['staff_short_description'],
        firstLogin: data?.['staff_update_password_immediately'] === 1,
        roles: data?.['staff_role'],
        ...data,
      };
      return userInfo;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
