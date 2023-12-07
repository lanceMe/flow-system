import { request } from '/@/utils/http/axios';

enum Api {
  getCardList = '/v1/cardcat',
}

/**
 * @description: 获取会员卡列表
 */
export function getCardList() {
  return request.get({ url: Api.getCardList }, { returnTransformResponseDataKey: 'cardcat_list' });
}
