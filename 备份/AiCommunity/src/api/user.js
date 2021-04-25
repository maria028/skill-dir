import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const loginByUsername = (tenantId, loginName, password, type) => request({
  url: baseUrl + '/auth/token',
  method: 'post',
  params: {
    tenantId,
    loginName,
    password,
    type
  }
})

export const getButtons = () => request({
  url: baseUrl + '/system/menu/buttons',
  method: 'get'
});

export const getUserInfo = () => request({
  url: baseUrl + '/user/getUserInfo',
  method: 'get'
});

export const refeshToken = () => request({
  url: baseUrl + '/user/refesh',
  method: 'post'
})

export const getMenu = () => request({
  url: baseUrl + '/system/menu/routes',
  method: 'get'
});

export const getTopMenu = () => request({
  url: baseUrl + '/user/getTopMenu',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: baseUrl + '/user/logout',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: baseUrl + '/user/logout',
  method: 'get'
})

export const registerUserByPhone = (aliId, wxId, phone, sex, age) => request({
  url: baseUrl + '/user/account/registerUserByPhone',
  method: 'get',
  params: {
    aliId,
    wxId,
    phone,
    sex,
    age
  }
});

export const getAccountList = (current, size, updateTime, phone, mallId) => request({
  url: baseUrl + '/user/account/list',
  method: 'get',
  params: {
    current,
    size,
    updateTime,
    phone,
    mallId
  }
});


