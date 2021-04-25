import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getArea = () => {
  return request({
    url: baseUrl + '/device/area/tree',
    method: 'get',
    params: {}
  })
}
export const getDeviceList = (tenantId,current, size, mallId, deviceType, deviceName,isOnline,deviceNo) => {
  return request({
    url: baseUrl + '/device/list',
    method: 'get',
    params: {
      tenantId,
      current,
      size,
      mallId,
      deviceType,
      deviceName,
      isOnline,
      deviceNo
    }
  })
}

export const remove = (ids) => {
  return request({
    url: baseUrl + '/device/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
export const add = (row) => {
  return request({
    url: baseUrl + '/device/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: baseUrl + '/device/submit',
    method: 'post',
    data: row
  })
}


/**
 * 查询设备
 */
export const getDeviceByTenant=()=>request({
  url: baseUrl + '/device/getDeviceByTenant',
  method: 'get',
  params: {
  }
});

export const getDeviceConfig = (tenantId,current, size, deviceNo) => {
  return request({
    url: baseUrl + '/update/dict/getDeviceConfig',
    method: 'get',
    params: {
      tenantId,
      current,
      size,
      deviceNo
    }
  })
}


