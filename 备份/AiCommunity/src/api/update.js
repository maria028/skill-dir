import request from '@/router/axios';
import {baseUrl} from '@/config/env';


export const saveAndUploadImage = (data) => request({
  url: baseUrl + '/update/submit',
  method: 'post',
  data: data
});

export const getOrg = (orgType) => request({
  url: baseUrl + '/update/getOrg',
  method: 'get',
  params: {orgType}
});

export const  list= (current, size,packageName,updateType,fileType,orgValue) => request({
  url: baseUrl + '/update/list',
  method: 'get',
  params: {current,size,packageName,updateType,fileType,orgValue}
});

export const remove = (ids) => {
  return request({
    url: baseUrl + '/update/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
export const update = (row) => {
  return request({
    url: baseUrl + '/update/update',
    method: 'post',
    data: row
  })
}

export const updateFile = (data) => request({
  url: baseUrl + '/update/updateFile',
  method: 'post',
  data: data
});

export const  getUpdateByDevice= (deviceType,deviceNo,packageName) => request({
  url: baseUrl + '/update/getUpdateByDevice',
  method: 'get',
  params: {deviceType,deviceNo,packageName}
});


export const  dictList= (current, size,dictKey,orgValue,dictLabel) => request({
  url: baseUrl + '/update/dict/list',
  method: 'get',
  params: {current,size,dictKey,orgValue,dictLabel}
});


export const  dictSubmit= (row) => request({
  url: baseUrl + '/update/dict/submit',
  method: 'post',
  data: row
});
export const  dictRemove= (ids) => request({
  url: baseUrl + '/update/dict/remove',
  method: 'post',
  params: {
    ids
  }
});

export const  dictUpdate= (row) => request({
  url: baseUrl + '/update/dict/update',
  method: 'post',
  data: row
});

export const  tree= () => request({
  url: baseUrl + '/update/dict/tree',
  method: 'get'
});

export const  listUpdateConfig= () => request({
  url: baseUrl + '/update/listUpdateConfig',
  method: 'get'
});








