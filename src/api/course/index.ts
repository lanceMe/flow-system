import { request } from '/@/utils/http/axios';

enum Api {
  templeteList = '/v1/course_template_list',
  templete = '/v1/course_template',
  tagList = '/v1/course_tag_list',
  coachList = '/v1/coach_list',
  courseList = '/v1/course_list',
  course = '/v1/course',
  publishCourse = '/v1/publish_course_schedule',
}

/**
 * @description: 获取课程模版列表
 */
export function getTempleteList() {
  return request.get(
    { url: Api.templeteList },
    { returnTransformResponseDataKey: 'course_template_list' },
  );
}

/**
 * @description: 获取课程Tag列表
 */
export function getTagList() {
  return request.get({ url: Api.tagList }, { returnTransformResponseDataKey: 'course_tags' });
}

/**
 * @description: 修改模版
 */
export function editTemplete(params) {
  return request.put({ url: Api.templete, params }, { successMessageMode: 'message' });
}

/**
 * @description: 新建模版
 */
export function createTemplete(params) {
  return request.post({ url: Api.templete, params }, { successMessageMode: 'message' });
}

/**
 * @description: 删除模版
 */
export function deleteTemplete(id: string | number) {
  const params = { 'course-template-id': id };
  return request.delete({ url: Api.templete, params }, { successMessageMode: 'message' });
}

/**
 * @description: 获取教练列表
 */
export function getCoachList() {
  return request.get({ url: Api.coachList }, { returnTransformResponseDataKey: 'coaches' });
}

/**
 * @description: 获取课程列表
 */
export function getCourseList(startDate, endDate) {
  const params = {
    'from-date': startDate,
    'to-date': endDate,
    fields:
      'course_id, type, display_name, description, address, start_time, duration_minutes, max_attenders, current_attenders, waiting_attenders, coach_id, coach_nickname, coach_avatar_url, coach_liked_by_user, status,user_can_cancel_reserve,user_can_reserve,user_can_wait,cancel_waiting_minutes,no_cancel_reserve_minutes,min_attenders',
    //,address_lat,address_long
  };
  return request.get(
    { url: Api.courseList, params },
    { returnTransformResponseDataKey: 'courses' },
  );
}

/**
 * @description: 修改课程
 */
export function editCourse(params) {
  return request.put({ url: Api.course, params }, { successMessageMode: 'message' });
}

/**
 * @description: 新建课程
 */
export function createCourse(params) {
  return request.post({ url: Api.course, params }, { successMessageMode: 'message' });
}

/**
 * @description: 删除课程
 */
export function deleteCourse(id: string | number) {
  const params = { 'course-id': id };
  return request.delete({ url: Api.course, params }, { successMessageMode: 'message' });
}

/**
 * @description: 发布课程
 */
export function publishCourse(endTime: string, type = 'groupopen') {
  const params = { 'publish-date': endTime, 'publish-type': type };
  return request.post({ url: Api.publishCourse, params }, { successMessageMode: 'message' });
}
