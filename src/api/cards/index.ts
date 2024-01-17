import { request } from '/@/utils/http/axios';
import dayjs from 'dayjs';

enum Api {
  getCardList = '/v1/cardcat',
  getVipList = '/v1/wxuser_by_daypass_list',
  getExpreingList = '/v1/cardins_expiring_list',
  getCourseHistory = '/v1/attend_course_history',
  getAccessList = '/v1/checkin_daypass',
  getUserCardList = '/v1/cardins',
  getWxUser = '/v1/wxuser',
  getcardRecordList = '/v1/cardins_record',
  bindCard = '/v1/manual_cardins',
  stopCard = '/v1/cardins_suspend',
}
/**
 * @description: 获取会员卡列表
 */
export function getCardList() {
  return request.get({ url: Api.getCardList }, { returnTransformResponseDataKey: 'cardcat_list' });
}
/**
 * @description: 获取会员列表
 */
export function getVipList(data) {
  const params = {
    'cardcat-class': data['cardcat-class'] || 'bundle,time',
    'new-or-all': data['new-or-all'] || 'all',
    'phone-number': data['phone-number'] || undefined,
  };

  return request.get(
    { url: Api.getVipList, params },
    { returnTransformResponseDataKey: 'cardins_list' },
  );
}

/**
 * @description: 获取即将过期会员列表
 */
export function getVipExpiring(data) {
  const params = {
    'cardcat-class': data['cardcat-class'] || 'bundle,time',
    'cardcat-type': data['cardcat-type'] || 'daypass',
    'phone-number': data['phone-number'] || undefined,
  };

  return request.get(
    { url: Api.getExpreingList, params },
    { returnTransformResponseDataKey: 'cardins_list' },
  );
}

export function getCourseHistory(data) {
  const params = {
    'wxuser-token': data['wxuser-token'],
    'to-date': dayjs().format('YYYY-MM-DD'),
  };

  return request.get(
    { url: Api.getCourseHistory, params },
    { returnTransformResponseDataKey: 'courses' },
  );
}

export function getAccessList(data) {
  const params = {
    'wxuser-token': data['wxuser-token'],
    'to-date': dayjs().format('YYYY-MM-DD'),
    'from-date': '1970-01-01',
    'cardcat-class': 'bundle,time',
  };

  return request.get(
    { url: Api.getAccessList, params },
    { returnTransformResponseDataKey: 'checkin_daypass_list' },
  );
}

/**
 * @description: 获取用户拥有的会员卡列表
 */
export function getUserCardList(data) {
  const params = {
    'wxuser-token': data['wxuser-token'],
  };

  return request.get(
    { url: Api.getUserCardList, params },
    { returnTransformResponseDataKey: 'cardins_list' },
  );
}
export function getcardRecordList(data) {
  const params = {
    'wxuser-token': data['wxuser-token'],
  };

  return request.get(
    { url: Api.getcardRecordList, params },
    { returnTransformResponseDataKey: 'cardins_record_list' },
  );
}

export function getWxUser(wxId) {
  const params = {
    'wxuser-token': wxId,
  };

  return request.get({ url: Api.getWxUser, params });
}

/**
 * @description: 延卡/扣费
 */
export function changeCardins(params) {
  return request.put({ url: Api.getUserCardList, params }, { successMessageMode: 'message' });
}

/**
 * @description: 绑卡
 */
export function bindCard(params) {
  return request.post({ url: Api.bindCard, params }, { successMessageMode: 'message' });
}

/**
 * @description: 停卡
 */
export function stopCard(params) {
  return request.post({ url: Api.stopCard, params }, { successMessageMode: 'message' });
}

/**
 * @description: 恢复停卡
 */
export function resumeCard(params) {
  return request.delete({ url: Api.stopCard, params }, { successMessageMode: 'message' });
}
