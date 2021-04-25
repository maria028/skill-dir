import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const electricMomentList = (cumulant,mallId,mallNodeId,reportStatus,size, current,condition) => {
  return request({
    url: baseUrl + '/electric/electricMoment/report/list',
    method: 'get',
    params: { cumulant,mallId,mallNodeId,reportStatus,size, current,condition }
  })
}

export const cumulantList = (mallId,mallNodeId,reportStatus,size, current,condition,rate) => {
  return request({
    url: baseUrl + '/electric/electricMoment/report/cumulantList',
    method: 'get',
    params: {mallId,mallNodeId,reportStatus,size, current,condition,rate}
  })
}

//历史数据 累积量查询
export const historyCumulantList = (condition,current,mallId,mallNodeId, rate,size,time) => {
  return request({
    url: baseUrl + '/electric/electricHistory/report/cumulantList',
    method: 'get',
    params: {condition,current,mallId,mallNodeId, rate,size,time}
  })
}

//历史数据 瞬时量查询
export const historyMomentList = (condition,cumulant,current,mallId, mallNodeId,size,time) => {
  return request({
    url: baseUrl + '/electric/electricHistory/report/momentList',
    method: 'get',
    params: {condition,cumulant,current,mallId, mallNodeId,size,time}
  })
}

//历史数据需量查询
export const historyNeedList = (condition,current,mallId,mallNodeId,size,time) => {
  return request({
    url: baseUrl + '/electric/electricHistory/report/needList',
    method: 'get',
    params: {condition,current,mallId,mallNodeId,size,time}
  })
}

/**
 * 获取电的大屏数据
 * @param building
 * @param dateType
 * @param endDate
 * @param mallId
 * @param startDate
 * @param unit
 */
export const getElectricVisualData = (building,dateType,endDate,mallId,startDate,unit) => {
  return request({
    url: baseUrl + '/electric/report/getVisualData',
    method: 'get',
    params: {building,dateType,endDate,mallId,startDate,unit}
  })
}

export const getElectricDetail = (building,mallId,unit,endDate,startDate,room) => {
  return request({
    url: baseUrl + '/electric/report/getElectricDetail',
    method: 'get',
    params: {building,mallId,unit,endDate,startDate,room}
  })
}


