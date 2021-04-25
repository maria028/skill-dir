/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import {serialize} from '@/util/util'
import {getToken,setToken} from '@/util/auth'
import {Message} from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {Base64} from 'js-base64';
import en from "../lang/en";


axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `cngh${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  if (getToken() && !isToken) {
    config.headers['accessToken'] = getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
      setToken(getToken());
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done();
  const status = res.data.code || 0
  const statusWhiteList = website.statusWhiteList || [];
  let message = res.data.msg || '未知错误';
  let enMessage=en[message];
  var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2);//截取lang前2位字符
  console.log("lang=="+lang);
  if(lang == 'zh'){

  }else{
    if(enMessage!=undefined){
      message=enMessage;
    }
  }

  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401){
    console.log("status=="+status)
    window.location.href="/login";
    // this.$router.push({path: "/login"});
  }

  // 如果请求为非200否者默认统一处理
  if (status !== 0) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
})


export default axios;
