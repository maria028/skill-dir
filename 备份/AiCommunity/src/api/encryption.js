import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getLoginEncryptionInfo = (sysType, userName, userPwd) => request({
  url: baseUrl + '/encryption/getLoginEncryptionInfo',
  method: 'get',
  params: {
    sysType,
    userName,
    userPwd
  }
})


