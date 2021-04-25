import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getList = (current, size, params) => {
  return request({
    url: baseUrl + '/system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const grantTree = () => {
  return request({
    url: baseUrl + '/system/menu/grant-tree',
    method: 'get',
  })
}

export const grant = (roleIds, menuIds) => {
  return request({
    url: baseUrl + '/system/role/grant',
    method: 'post',
    params: {
      roleIds,
      menuIds
    }
  })
}

export const remove = (ids) => {
  return request({
    url: baseUrl + '/system/role/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: baseUrl + '/system/role/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: baseUrl + '/system/role/submit',
    method: 'post',
    data: row
  })
}


export const getRole = (roleIds) => {
  return request({
    url: baseUrl + '/system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: baseUrl + '/system/role/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const  getRoleDetail=(id)=>{
  return request({
    url: baseUrl + '/system/role/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const  getRoleListByIds=(roleIds)=>{
  return request({
    url: baseUrl + '/system/role/getRoleListByIds',
    method: 'get',
    params: {
      roleIds,
    }
  })
}

