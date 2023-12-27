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

export function getCourseList(params) {
  return request.get(
    { url: '/v1/course_by_staff_list', params },
    { returnTransformResponseDataKey: 'courses' },
  );
}

/**
 * @description: 获取员工信息
 */
export function getStaffInfo(params) {
  return request.get({ url: '/v1/staff', params }, { returnTransformResponseDataKey: 'staff' });
}
