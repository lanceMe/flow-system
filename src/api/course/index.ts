import { request } from '/@/utils/http/axios';

enum Api {
  templeteList = '/v1/course_template_list',
  templete = '/v1/course_template',
  tagList = '/v1/course_tag_list',
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
