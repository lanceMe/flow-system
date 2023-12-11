import { request } from '/@/utils/http/axios';

/**
 * @description: 获取课程模版列表
 */
export function getOrderList(params) {
  return request.get(
    { url: '/v1/order_list', params },
    { returnTransformResponseDataKey: 'orders' },
  );
}
