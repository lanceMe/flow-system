import { request } from '/@/utils/http/axios';

/**
 * @description: 获取通知模板
 */
export function getNotificationList(params) {
  return request.get(
    { url: '/v1/notification_list', params },
    { returnTransformResponseDataKey: 'notifications' },
  );
}

export function postSortList(data) {
  return request.post({ url: '/v1/sort_notification', data });
}

export function postUploadFile(params) {
  return request.uploadFile(
    {
      url: '/basic-api/v1/upload_public_file',
    },
    params,
  );
}

export function postNotification(data) {
  return request.post({
    url: '/v1/notification',
    data,
  });
}

export function postOffline(data) {
  return request.post({
    url: '/v1/offline_notification',
    data,
  });
}

export function putNotification(data) {
  return request.put({
    url: '/v1/notification',
    data,
  });
}
