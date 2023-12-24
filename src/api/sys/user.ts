import { defHttp, request } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

import { encode } from '/@/utils/base64';

enum Api {
  Login = '/v1/login',
  Logout = '/v1/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
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
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  // return request.post<LoginResultModel>({ url: Api.Login, params }, { errorMessageMode: mode });
  return defHttp.get({ url: Api.Logout });
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
