import { defHttp, request } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

import { encode } from '/@/utils/base64';

enum Api {
  Login = '/v1/login',
  Logout = '/v1/logout',
  GetUserInfo = '/v1/staff',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  ChangePassword = '/v1/staff_password',
}

/**
 * @description: user login api
 */
export function loginApi(paramsUser: LoginParams, mode: ErrorMessageMode = 'modal') {
  const params = {
    'staff-phone-number': paramsUser.username,
    'staff-password': encode(paramsUser.password),
  };
  return request.post<LoginResultModel>({ url: Api.Login, params }, { errorMessageMode: mode });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(userToken, staffId) {
  const params = {
    'user-token': userToken,
    'staff-id ': staffId,
  };
  return request.get(
    { url: Api.GetUserInfo, params },
    { returnTransformResponseDataKey: 'staff', errorMessageMode: 'none' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return request.post({ url: Api.Logout });
  // return defHttp.get({ url: Api.Logout });
}

export function changeUser(params) {
  return request.post({ url: '/v1/wxuser/info', params }, { successMessageMode: 'message' });
  // return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * @description: user login api
 */
export function changePassword(staffId, pwds) {
  const params = {
    'staff-id': staffId,
    'staff-password': encode(pwds['staff-password']),
    'staff-password-old': encode(pwds['staff-password-old']),
  };
  return request.post({ url: Api.ChangePassword, params });
}
