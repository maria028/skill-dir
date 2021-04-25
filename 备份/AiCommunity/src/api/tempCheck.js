import request from '@/router/axios';
import {baseUrl} from '@/config/env';



export const getTempList = (current,size,startDate,endDate,mallId,deviceNo,tempState,userOrg,
                            userOrgDesc,roleType,orgId) => {
  return request({
    url: baseUrl + '/temp/check/list',
    method: 'get',
    params: {
      current,
      size,
      startDate,
      endDate,
      mallId,
      deviceNo,
      tempState,
      userOrg,
      userOrgDesc,
      roleType,
      orgId
    }
  })
}

export const  getVitalTemp =(startDate,endDate,areaIds,roleType,userOrg) =>{
  return request({
    url: baseUrl + '/temp/check/getVitalTemp',
    method: 'get',
    params: {
      startDate,
      endDate,
      areaIds,
      roleType,
      userOrg
    }
  })
}

export const  getPermissionTempOrgData =(userOrg,userOrgDesc,roleType) =>{
  return request({
    url: baseUrl + '/temp/check/getPermissionTempOrgData',
    method: 'get',
    params: {
      userOrg,
      userOrgDesc,
      roleType
    }
  })
}

export const getExcelData = (startDate,endDate,mallId,deviceNo,tempState,userOrg,
                            userOrgDesc,roleType,orgId,isExportImg) => {
  return request({
    url: baseUrl + '/temp/check/getExcelData',
    method: 'get',
    responseType: 'blob',
    params: {
      startDate,
      endDate,
      mallId,
      deviceNo,
      tempState,
      userOrg,
      userOrgDesc,
      roleType,
      orgId,
      isExportImg
    }
  })
}


export const send = (versionCode,versionName,deviceType,deviceNo,packageName,sdkInt) => {
  return request({
    url: baseUrl + '/temp/heart/send',
    method: 'get',
    params: {
      versionCode,
      versionName,
      deviceType,
      deviceNo,
      packageName,
      sdkInt
    }
  })
}

export const tempUnusualStatistics = (startDate,endDate) => {
  return request({
    url: baseUrl + '/temp/check/tempUnusualStatistics',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

/**
 * 对源数据截取decimals位小数，不进行四舍五入
 * @param {*} num 源数据
 * @param {*} decimals 保留的小数位数
 */
export const cutOutNum = (num, decimals) => {
  if (isNaN(num) || (!num && num !== 0)) {
    return '--'
  }
  // 默认为保留的小数点后两位
  let dec = decimals ? decimals : 2
  let tempNum = Number(num)
  let pointIndex = String(tempNum).indexOf('.') + 1 // 获取小数点的位置 + 1
  let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  // 源数据为整数或者小数点后面小于decimals位的作补零处理
  if (pointIndex === 0 || pointCount <= dec) {
    let tempNumA = tempNum
    if (pointIndex === 0) {
      tempNumA = `${tempNumA}.`
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    } else {
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    }
    return tempNumA
  }
  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(tempNum).split('.')[0]}.${String(tempNum)
    .split('.')[1]
    .substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal == 0) {
    realVal = 0
  }
  return realVal
}

