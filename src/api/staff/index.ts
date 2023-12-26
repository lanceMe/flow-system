import { request } from '/@/utils/http/axios';

/**
 * @description: 获取员工列表
 */
export function getStaffList(params) {
  return request.get(
    { url: '/v1/staff_list', params },
    { returnTransformResponseDataKey: 'staff_list' },
  );
}

/**
 * @description: 获取员工信息
 */
export function getStaffInfo(params) {
  return request.get({ url: '/v1/staff', params }, { returnTransformResponseDataKey: 'staff' });
}
