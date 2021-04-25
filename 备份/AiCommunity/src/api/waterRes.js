import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const getThreshold = () => {
    return request({
        url: baseUrl + '/water/getThreshold',
        method: 'get',
        params: {}
    })
}

export const listThreshold = (deviceNo, size, current) => {
    return request({
        url: baseUrl + '/water/listThreshold',
        method: 'get',
        params: { deviceNo, size, current }
    })
}

export const setThreshold = (deviceNo, leakDuration, leakSpeed, boomDuration, boomSpeed, reverseDuration, reverseSpeed, nightTimes) => {
    return request({
        url: baseUrl + '/water/setThreshold',
        method: 'post',
        params: { deviceNo, leakDuration, leakSpeed, boomDuration, boomSpeed, reverseDuration, reverseSpeed, nightTimes }
    })
}

export const getDeviceGroup = (groupType) => {
    return request({
        url: baseUrl + '/water/getDeviceGroup',
        method: 'get',
        params: { groupType }
    })
}

export const getDeviceVisualData = (date, deviceNo) => {
    return request({
        url: baseUrl + '/water/getDeviceVisualData',
        method: 'get',
        params: { date, deviceNo }
    })
}

export const operate = (action, deviceNo) => {
    return request({
        url: baseUrl + '/water/operate',
        method: 'post',
        params: { action, deviceNo }
    })
}

export const startDemo = () => {
    return request({
        url: baseUrl + '/water/startDemo',
        method: 'post',
        params: {}
    })
}

export const endDemo = () => {
    return request({
        url: baseUrl + '/water/endDemo',
        method: 'post',
        params: {}
    })
}

export const getDemoStatus = () => {
    return request({
        url: baseUrl + '/water/getDemoStatus',
        method: 'get',
        params: {}
    })
}

export const getWaterVisualData = (building,dateType,endDate,mallId,startDate,unit) => {
  return request({
    url: baseUrl + '/water/report/getVisualData',
    method: 'get',
    params: {building,dateType,endDate,mallId,startDate,unit}
  })
}
export const getWaterDetail = (building,endDate,mallId,startDate,unit,room) => {
  return request({
    url: baseUrl + '/water/report/getWaterDetail',
    method: 'get',
    params: {building,endDate,mallId,startDate,unit,room}
  })
}

