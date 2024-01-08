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

/**
 * @description: 新建员工信息
 */
export function postStaffInfo(params) {
  return request.post({ url: '/v1/staff', params }, { returnTransformResponseDataKey: 'staff' });
}

/**
 * @description: 编辑员工信息
 */
export function putStaffInfo(params) {
  return request.put({ url: '/v1/staff', params }, { returnTransformResponseDataKey: 'staff' });
}

export function postStaffRole(params) {
  return request.post({ url: '/v1/staff_role', params });
}

export function postStaffEnable(params) {
  return request.post({ url: '/v1/staff_enable', params });
}

export function deleteStaffEnable(params) {
  return request.delete({ url: '/v1/staff', params });
}
