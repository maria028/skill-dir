import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getMall = (tenantId,current, size, name, areaId) => {
  return request({
    url: baseUrl + '/device/mall/list',
    method: 'get',
    params: {
      tenantId,
      current,
      size,
      name,
      areaId
    }
  })
}
export const remove = (ids) => {
  return request({
    url: baseUrl + '/device/mall/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request({
    url: baseUrl + '/device/mall/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: baseUrl + '/device/mall/submit',
    method: 'post',
    data: row
  })
}

export const getDeviceByMall = (mallId) => {
  return request({
    url: baseUrl + '/device/getDeviceByMall',
    method: 'get',
    params: {
      mallId
    }
  })
}

export const  getMallTree =(tenantId)=>{
  return request({
    url: baseUrl + '/device/mall/tree',
    method: 'get',
    params: {
      tenantId
    }
  })
}


export const  getMallByIds =(ids)=>{
  return request({
    url: baseUrl + '/device/mall/getMallByIds',
    method: 'get',
    params: {
      ids
    }
  })
}

export const  getHouseByMallId =(current, size,mallId,building,unit,room,garden)=>{
  return request({
    url: baseUrl + '/refuse/house/getHouseByMallId',
    method: 'get',
    params: {
      current,
      size,
      mallId,
      building,
      unit,
      room,
      garden
    }
  })
}
export const  addGarden =(mallId,gardens)=>{
  return request({
    url: baseUrl + '/device/mall/addGarden',
    method: 'POST',
    params: {
      gardens,
      mallId
    }
  })
}
export const  getGardenByMall =(mallId)=>{
  return request({
    url: baseUrl + '/device/mall/getGardenByMall',
    method: 'GET',
    params: {
      mallId
    }
  })
}
/**
 * 获取用户的角色对应的设备及网点信息
 * @param userId
 * @param roleId
 * @param tenantId
 */
export const  getMallByUser =()=>{
  return request({
    url: baseUrl + '/device/mall/getMallByUser',
    method: 'get'
  })
}

/**
 * 获取告警信息
 * @param mallId
 * @param startDate
 * @param endDate
 */
export const  getAlarmList =(mallId,startDate,endDate)=>{
  return request({
    url: baseUrl + '/device/alarm/list',
    method: 'get',
    params: {
      mallId,startDate,endDate
    }
  })
}

export const  getThresholdList =(orgType,orgValue)=>{
  return request({
    url: baseUrl + '/device/threshold/list',
    method: 'get',
    params: {
      orgType,orgValue
    }
  })
}
export const  updateThreshold =(dto)=>{
  return request({
    url: baseUrl + '/device/threshold/update',
    method: 'POST',
    data:dto
  })
}
// continuePowerLess,continuePowerMore,
//   continuePowerTime,continueWaterLess,
//   continueWaterMore,continueWaterTime,eleOver,
//   eleOverrun,powerLess,powerMore,powerTime,residueEleOver,tempOver,
//   tempOverTime,voltageOver,voltageOverrun,voltageUnder,waterLess,waterMore,waterTime

