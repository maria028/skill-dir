import Cookies from 'js-cookie'

const TokenKey = 'x-access-token'
var inFifteenMinutes = new Date(new Date().getTime() + 1200 * 60 * 1000);

var loginMinutes = new Date(new Date().getTime() + 24*120 * 60 * 1000);

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: inFifteenMinutes})
}

export function setLoginInfo(loginInfo) {
 return  Cookies.set('loginInfo', loginInfo, {expires: loginMinutes})
}
export function getLoginInfo() {
  return Cookies.get("loginInfo");
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
