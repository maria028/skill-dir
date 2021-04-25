import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const findBickMsg = (mallId, deviceNo, connectorNumber, startDate, endDate, status, payType, size, current) => {
    return request({
        url: baseUrl + '/bike/charge/list',
        method: 'get',
        params: { mallId, deviceNo, connectorNumber, startDate, endDate, status, payType, size, current }
    })
}

export const getPermissionDevice = (userOrg, userOrgDesc, roleType, deviceType) => {
    return request({
        url: baseUrl + '/user/getPermissionDevice',
        method: 'get',
        params: { userOrg, userOrgDesc, roleType, deviceType }
    })
}

export const healthStationMsg = (mallId, startDate, endDate, phone, size, current) => {
    return request({
        url: baseUrl + '/healthy/log/list',
        method: 'get',
        params: { mallId, startDate, endDate, phone, size, current }
    })
}

export const getDeviceStatusExt = (deviceType, deviceNo) => {
    return request({
        url: baseUrl + '/device/connector/getDeviceStatusExt',
        method: 'get',
        params: { deviceType, deviceNo }
    })
}

export const getDeviceList = (mallId, deviceType,size) => {
    return request({
        url: baseUrl + '/device/list',
        method: 'get',
        params: { mallId, deviceType,size }
    })
}

export const getVisualData = (reqType, reqId) => {
    return request({
        url: baseUrl + '/bike/report/getVisualData',
        method: 'get',
        params: { reqType, reqId }
    })
}

export const getPersonList = (mallId, userName, startDate, endDate, size, current) => {
    return request({
        url: baseUrl + '/door/person/list',
        method: 'get',
        params: { mallId, userName, startDate, endDate, size, current }
    })
}

export const getCarList = (cardNo, parkName, startDate, endDate, size, current) => {
    return request({
        url: baseUrl + '/door/car/list',
        method: 'get',
        params: { cardNo, parkName, startDate, endDate, size, current }
    })
}

export const getCarPark = () => {
    return request({
        url: baseUrl + '/door/car/getCarPark',
        method: 'get',
        params: {}
    })
}

export const getChargingList = (startDate, endDate, phone, status, payType, size, current) => {
    return request({
        url: baseUrl + '/car/charge/list',
        method: 'get',
        params: { startDate, endDate, phone, status, payType, size, current }
    })
}

export const getBusinessIncome = (mallId, startDate, endDate, size, current, orderType) => {
    return request({
        url: baseUrl + '/p/getBusinessIncome',
        method: 'get',
        params: { mallId, startDate, endDate, size, current, orderType }
    })
}

export const getRechargeStatistics = (mallId, startDate, endDate, size, current, payType) => {
    return request({
        url: baseUrl + '/p/getRechargeStatistics',
        method: 'get',
        params: { mallId, startDate, endDate, size, current, payType }
    })
}

export const getConfigList = (mallId, deviceNo, size, current) => {
    return request({
        url: baseUrl + '/bike/config/list',
        method: 'get',
        params: { mallId, deviceNo, size, current }
    })
}

export const callDownloadCfg = (mallId, deviceNo, fullPower, fullTime, maxPower, noLoadPower, noLoadTime, overloadDuration, overloadPower, startNoLoadTime, id) => {
    return request({
        url: baseUrl + '/bike/config/callDownloadCfg',
        method: 'post',
        params: { mallId, deviceNo, fullPower, fullTime, maxPower, noLoadPower, noLoadTime, overloadDuration, overloadPower, startNoLoadTime, id }
    })
}

export const getScoreLogList = (mallId, fullRoom, startDate, endDate, addType, size, current) => {
    return request({
        url: baseUrl + '/user/score/log/list',
        method: 'get',
        params: { mallId, fullRoom, startDate, endDate, addType, size, current }
    })
}

export const getConfig = (mallId, deviceNo, size, current) => {
    return request({
        url: baseUrl + '/bike/fee/config/list',
        method: 'get',
        params: { mallId, deviceNo, size, current }
    })
}

export const rateSubmit = (mallId, deviceNo, feeType, config, id, isDeleted) => {
    return request({
        url: baseUrl + '/bike/fee/config/submit',
        method: 'post',
        params: { mallId, deviceNo, feeType, config, id, isDeleted }
    })
}

export const getScoreList = (mallId, fullRoom, relateType, size, current) => {
    return request({
        url: baseUrl + '/user/score/list',
        method: 'get',
        params: { mallId, fullRoom, relateType, size, current }
    })
}

export const getOperatingIncomeDetails = (mallId, queryType, startDate, endDate, size, current) => {
    return request({
        url: baseUrl + '/p/getOperatingIncomeDetails',
        method: 'get',
        params: { mallId, queryType, startDate, endDate, size, current }
    })
}

export const getDateByMonth = (mallId,size, current,beginDate,endDate) => {
  return request({
    url: baseUrl + '/bike/report/getDateByMonth',
    method: 'get',
    params: {mallId,size, current,beginDate,endDate}
  })
}
