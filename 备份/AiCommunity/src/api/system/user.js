import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const resetPassword = (userIds) => {
  return request({
    url: baseUrl + '/user/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}
export const getList = (current, size, params) => {
  return request({
    url: baseUrl + '/user/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const remove = (ids) => {
  return request({
    url: baseUrl + '/user/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: baseUrl + '/user/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: baseUrl + '/user/update',
    method: 'post',
    data: row
  })
}

export const getUser = (id) => {
  return request({
    url: baseUrl + '/user/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getUserInfo = () => {
  return request({
    url: baseUrl + '/user/info',
    method: 'get',
  })
}
export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: baseUrl + '/user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}
export const getUserOrg= () => {
  return request({
    url: baseUrl + '/user/userOrg',
    method: 'get',
  })
}

/**
 * 获取有权限的组织架构
 */
export const  getPermissionOrgData=(roleId) => {
  return request({
    url: baseUrl + '/user/getPermissionOrgData',
    method: 'get',
    params: {
      roleId
    }
  })
}



