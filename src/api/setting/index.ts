import { request } from '/@/utils/http/axios';

/**
 * @description: 获取操作列表
 */
export function getOperationList(params) {
  return request.get(
    { url: '/v1/operation_list', params },
    { returnTransformResponseDataKey: 'operations' },
  );
}
export function getOperationModuleList(params) {
  return request.get(
    { url: '/v1/operation_module_list', params },
    { returnTransformResponseDataKey: 'operation_modules' },
  );
}
