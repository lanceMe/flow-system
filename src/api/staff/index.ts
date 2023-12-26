import { request } from '/@/utils/http/axios';

/**
 * @description: 获取课程模版列表
 */
export function getStaffList(params) {
  return request.get(
    { url: '/v1/staff_list', params },
    { returnTransformResponseDataKey: 'staff_list' },
  );
}
