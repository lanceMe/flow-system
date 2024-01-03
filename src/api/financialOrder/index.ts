import { request } from '/@/utils/http/axios';

/**
 * @description: 获取确收列表
 */
export function getRevenueList(params) {
  return request.get(
    { url: '/v1/recognized_revenue_list', params },
    { returnTransformResponseDataKey: 'recognized_revenue_list' },
  );
}
