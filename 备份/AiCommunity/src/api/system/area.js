import request from '@/router/axios';
import {baseUrl} from '@/config/env';
export const submitArea = (id,name,type,parentId) => {
  return request({
    url: baseUrl + '/device/area/submit',
    method: 'post',
    data: {id,name,type,parentId}
  })
}

export const removeArea = (ids) => {
  return request({
    url: baseUrl + '/device/area/remove',
    method: 'post',
    params: {ids}
  })
}

export const detailArea = (id) => {
  return request({
    url: baseUrl + '/device/area/detail',
    method: 'get',
    params: {id}
  })
}

export const  getAreaByType = (type,parentId) => {
  return request({
    url: baseUrl + '/device/area/getAreaByType',
    method: 'get',
    params: {type,parentId}
  })
}


