import request from '@/router/axios';

import {baseUrl} from '@/config/env';

/**
 * 获取小区
 */
export const getResidential = () => request({
  url: baseUrl + '/refuse/house/getMall',
  method: 'get',
});

/**
 * 获取房号
 */
export const getRoomNumRule = (mallId) => request({
  url: baseUrl + '/refuse/house/getRoomNumRule',
  params: {
    mallId
  },
  method: 'get',
});


/**
 *
 * @param residentialId 是小区ID
 * @param building  XX幢
 * @param unit XX单元
 * @param room 20室
 * @param holder 业主名
 * @param phone  手机号码
 * @param cardNum 卡号
 * @param faceFile 人脸图片
 */
export const save = (mallId, building, unit, room, holder, phone, cardNum, faceFile, faceBase64Str) => request({
  url: baseUrl + '/refuse/house/save',
  method: 'post',
  params: {
    mallId,
    building,
    unit,
    room,
    holder,
    phone,
    cardNum,
    faceFile,
    faceBase64Str

  }
});

export const saveAndUploadImage = (data) => request({
  url: baseUrl + '/refuse/house/save',
  method: 'post',
  data: data
});


/**
 * 查询投放记录
 * @param dateStr
 * @param current
 * @param size
 */
export const queryList = (dateStr, current, size, mallId) => request({
  url: baseUrl + '/refuse/throw/list',
  method: 'get',
  params: {
    dateStr,
    current,
    size,
    mallId
  }
});

/**
 * 垃圾详情分页
 * @param startDate
 * @param endDate
 * @param type
 * @param manualDetect
 * @param deviceType
 * @param deviceNo
 * @param current
 * @param size
 */
export const descList = (startDate, endDate, type, manualDetect,deviceType,deviceNo,current,size) => request({
  url: baseUrl + '/refuse/throw/desc/list',
  method: 'get',
  params: {
    startDate,
    endDate,
    type,
    manualDetect,
    deviceType,
    deviceNo,
    current,
    size
  }
});

/**
 *
 * @param descId
 * @param manualDetect  -1 不通过；0:待识别（未审核）； 1-通过； 99-无效记录;  100-已审核
 * @param manualTag
 */
export const manualDetect = (descId, manualDetect, manualTag) => request({
  url: baseUrl + '/refuse/throw/desc/manualDetect',
  method: 'post',
  params: {
    descId,
    manualDetect,
    manualTag
  }
});


/**
 *
 * @param descId
 * @param manualDetect  -1 不通过；0:待识别（未审核）； 1-通过； 99-无效记录;  100-已审核
 * @param manualTag
 */
export const manualCount = (startDate, endDate, type, manualDetect,deviceType,deviceNo,current,size) => request({
  url: baseUrl + '/refuse/throw/desc/manualCount',
  method: 'get',
  params: {
    startDate,
    endDate,
    type,
    manualDetect,
    deviceType,
    deviceNo

  }
});

/**
 * 获取人脸信息
 * @param current
 * @param size
 * @param mallId
 * @param cardNum
 * @param userName
 */
export const getHoseList=(current, size,mallId,cardNum,userName)=> request({
  url: baseUrl + '/refuse/house/list',
  method: 'get',
  params: {
    current,
    size,
    mallId,
    cardNum,
    userName
  }
});


export const getHouseMemberList=(current, size,mallId,cardNum,userName,building,unit,room,garden)=> request({
  url: baseUrl + '/refuse/house/list',
  method: 'get',
  params: {
    current,
    size,
    mallId,
    cardNum,
    userName,
    building,
    unit,
    room,
    garden
  }
});







