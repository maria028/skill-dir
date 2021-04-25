import request from '@/router/axios';

import {baseUrl} from '@/config/env';

/**
 * 获取监控信息
 * @param deviceNo
 */
export const getMonitor = (deviceNo) => request({
  url: baseUrl + '/refuse/report/getMonitor',
  method: 'get',
  params: {
    deviceNo
  }
});

/**
 * 数据可视化
 * @param deviceNo
 * reqType， 请求类型：  1-区域id， 2-网点id， 3-设备编号
 */
export const getVisualData = (reqType,reqId) => request({
  url: baseUrl + '/refuse/report/getVisualData',
  method: 'get',
  params: {
    reqType,
    reqId
  }
});

export const getHealthVisualData = (reqType,reqId) => request({
  url: baseUrl + '/report/old/getVisualDate',
  method: 'get',
  params: {
    reqType,
    reqId
  }
});

