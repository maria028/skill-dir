import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const getHose = (mallId, building, unit, room) => {
  return request({
    url: baseUrl + '/refuse/house/getHouse',
    method: 'get',
    params: {
      mallId,
      building,
      unit,
      room
    }
  })
}

export const getHouseMember = (houseId) => {
  return request({
    url: baseUrl + '/refuse/member/getHouseMember',
    method: 'get',
    params: {
      houseId
    }
  })
}

/**
 *
 * @param houseId
 */
export const getCardByHouseId = (houseId) => {
  return request({
    url: baseUrl + '/refuse/card/getCardByHouseId',
    method: 'get',
    params: {
      houseId
    }
  })
}


export const addHose = (row) => {
  return request({
    url: baseUrl + '/refuse/house/submit',
    method: 'post',
    data: row
  })
}

export const addHoseMember = (row) => {
  return request({
    url: baseUrl + '/refuse/member/submit',
    method: 'post',
    data: row
  })
}


export const addCard = (row) => {
  return request({
    url: baseUrl + '/refuse/card/submit',
    method: 'post',
    data: row
  })
}

export const removeCard = (row) => {
  return request({
    url: baseUrl + '/refuse/card/remove',
    method: 'post',
    params: row
  })
}

export const removeHoseMember = (ids) => {
  return request({
    url: baseUrl + '/refuse/member/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const addTempCheck = (row) => {
  return request({
    url: baseUrl + '/temp/check/submit',
    method: 'post',
    data: row
  })
}

export const getCardByMallId = (mallId) => {
  return request({
    url: baseUrl + '/refuse/card/getCardByMallId',
    method: 'get',
    params: { mallId }
  })
}

export const getAllAccount = () => {
  return request({
    url: baseUrl + '/user/account/getAllAccount',
    method: 'get',
    params: {}
  })
}

export const bindAccount = (memberId, userId) => {
  return request({
    url: baseUrl + '/refuse/member/bindAccount',
    method: 'post',
    params: { memberId, userId }
  })
}
export const unBindAccount = (memberId) => {
  return request({
    url: baseUrl + '/refuse/member/unBindAccount',
    method: 'post',
    params: { memberId }
  })
}

export const unBindCard = (mallId, cardNum) => {
  return request({
    url: baseUrl + '/refuse/card/unBindCard',
    method: 'post',
    params: { mallId, cardNum }
  })
}

export const getBigScreenData = (reqType, reqId) => {
  return request({
    url: baseUrl + '/report/sq/getBigScreenData',
    method: 'get',
    params: { reqType, reqId }
  })
}

export const getUserMessage = (userOrg, userOrgDesc, roleType, deviceType) => {
  return request({
    url: baseUrl + '/user/getUserOrgData',
    method: 'get',
    params: { userOrg, userOrgDesc, roleType, deviceType }
  })
}

export const findMemberMsg = (phone) => {
  return request({
    url: baseUrl + '/door/person/getPersonInfo',
    method: 'get',
    params: { phone }
  })
}


export const unbindCarPlate = (memberId, carPlate) => {
  return request({
    url: baseUrl + '/refuse/member/unBindCarPlate',
    method: 'post',
    params: { memberId, carPlate }
  })
}



export const bindCarPlate = (memberId, carPlate) => {
  return request({
    url: baseUrl + '/refuse/member/bindCarPlate',
    method: 'post',
    params: { memberId, carPlate }
  })
}


export const cardFind = (cardStatus, mallId, cardNum, size, current) => {
  return request({
    url: baseUrl + '/refuse/card/list',
    method: 'get',
    params: { cardStatus, mallId, cardNum, size, current }
  })
}



export const cardSubmit = (id, mallId, cardNum, houseId, fullRoom, building, createTime, createUser, mallName, memberId, room, unit, updateTime, updateUser) => {
  return request({
    url: baseUrl + '/refuse/card/submit',
    method: 'post',
    params: { id, mallId, cardNum, houseId, fullRoom, building, createTime, createUser, mallName, memberId, room, unit, updateTime, updateUser }
  })
}



export const cardRemove = (id) => {
  return request({
    url: baseUrl + '/refuse/card/remove',
    method: 'post',
    params: { id }
  })
}


export const getAccountList = (phone, mallId, size, current) => {
  return request({
    url: baseUrl + '/user/account/list',
    method: 'get',
    params: { phone, mallId, size, current }
  })
}

export const accountLogList = (phone, startDate, endDate, mallId, type, size, current) => {
  return request({
    url: baseUrl + '/user/accountLog/list',
    method: 'get',
    params: { phone, startDate, endDate, mallId, type, size, current }
  })
}

export const pcChargeCode = (mallId, product, totalPay) => {
  return request({
    url: baseUrl + '/p/pcChargeCode',
    method: 'post',
    params: { mallId, product, totalPay }
  })
}

export const payResultQuery = (outTradeNo) => {
  return request({
    url: baseUrl + '/p/payResultQuery',
    method: 'get',
    params: { outTradeNo }
  })
}

export const getTrading = (phone, mallId, deviceNo, payStatus, startDate, endDate, size, current) => {
  return request({
    url: baseUrl + '/p/list',
    method: 'get',
    params: { phone, mallId, deviceNo, payStatus, startDate, endDate, size, current }
  })
}

export const chargeAccount = (mallId, outTradeNo, payMoney, userId) => {
  return request({
    url: baseUrl + '/user/account/chargeAccount',
    method: 'post',
    params: { mallId, outTradeNo, payMoney, userId }
  })
}

export const addRoomNum = (mallId,buildBegin,buildEnd,floorNum,garden,roomBegin,roomEnd,roomNum,unitNum) => {
  return request({
    url: baseUrl + '/refuse/house/add',
    method: 'post',
    params: {mallId,buildBegin,buildEnd,floorNum,garden,roomBegin,roomEnd,roomNum,unitNum}
  })
}
export const removeRoomNum = (id) => {
  return request({
    url: baseUrl + '/refuse/house/remove',
    method: 'post',
    params: {id}
  })
}

export const updateRoomNum = (id,building,garden,room,unit) => {
  return request({
    url: baseUrl + '/refuse/house/update',
    method: 'post',
    params: {id,building,garden,room,unit}
  })
}
export const getByUint = (build,mallId,uint) => {
  return request({
    url: baseUrl + '/refuse/house/getByUint',
    method: 'get',
    params: {build,mallId,uint}
  })
}

