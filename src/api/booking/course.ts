import { request } from '/@/utils/http/axios';

/**
 * @description: 获取课程模版列表
 */
export function getCheckinList(params) {
  return request.get(
    { url: '/v1/checkin_course', params },
    // { returnTransformResponseDataKey: 'checkin_daypass_list' },
  );
}

export function getCoachList() {
  return request.get({ url: '/v1/coach_list' }, { returnTransformResponseDataKey: 'coaches' });
}

/**
 * @description: 预约课程
 */
export function postReserveCourse(data) {
  return request.post({ url: '/v1/reserve_course', data });
}

/**
 * @description: 取消预约课程
 */
export function deleteReserveCourse(data) {
  return request.delete({ url: '/v1/reserve_course', data });
}

/**
 * @description: 取消候补课程
 */
export function deleteWaitingCourse(data) {
  return request.delete({ url: '/v1/wait_course', data });
}

/**
 * @description: 未到场课程
 */
export function noShowReserveCourse(data) {
  return request.post({ url: '/v1/noshow_course', data });
}

/**
 * @description: 取消签到课程
 */
export function deleteCheckinCoures(data) {
  return request.delete({ url: '/v1/checkin_course', data });
}
