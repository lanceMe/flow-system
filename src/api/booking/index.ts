import { request } from '/@/utils/http/axios';

enum Api {
  checkinList = '/v1/checkin_daypass',
  getUserInfo = '/v1/wxuser_by_phone',
  getCardInfo = '/v1/cardins',
}

/**
 * @description: 获取课程模版列表
 */
export function getCheckinList(params) {
  return request.get(
    { url: Api.checkinList, params },
    // { returnTransformResponseDataKey: 'checkin_daypass_list' },
  );
}

/**
 * @description: 签到
 */
export function postCheckinList(data) {
  return request.post({ url: Api.checkinList, data });
}

/**
 * @description: 获取登录信息
 */
export function getUserInfoByPhone(number) {
  return request.get(
    {
      url: Api.getUserInfo,
      params: {
        'phone-number': number,
      },
    },
    { returnTransformResponseDataKey: 'wxusers' },
  );
}

export function getCardInfo(token: string) {
  return request.get(
    {
      url: Api.getCardInfo,
      params: {
        'wxuser-token': token,
      },
    },
    { returnTransformResponseDataKey: 'cardins_list' },
  );
}

export function deleteCheckin(params) {
  return request.delete(
    {
      url: Api.checkinList,
      params,
    },
    { returnTransformResponseDataKey: 'cardins_list' },
  );
}
