let qs = require('querystring')
export const getQueryStringFromJson = function (json) {
  return qs.stringify(json)
}

// 时间格式化-yyyy-MM-dd 00or24
export const getFormatYMDDateStr = function (date, isEnd = false) {
  if (!date) {
    return ''
  }
  var time = new Date(date)
  return `${time.getFullYear()}-${(time.getMonth() + 1)}-${time.getDate()} ${isEnd ? '23:59:59' : '00:00:00'}`
}

//格式化str时间为yyyy-MM-dd的字符串
export const formatStrDataToYMDStr = function (date) {
  if (!date) {
    return ''
  }
  date = date.replace(/-/g, '/');
  let time = new Date(date);
  return `${time.getFullYear()}-${(time.getMonth() + 1)}-${time.getDate()}`
}

// 判断是否是ie浏览器
export const isIE = () => {
  if (window.navigator.userAgent.indexOf('MSIE') >= 1 || (!!window.ActiveXObject || 'ActiveXObject' in window)) {
    return true
  }
  return false
}

//创建全局遮罩层
export const createMask=function(data){
    let mask=document.createElement('div');
    mask.style.cssText ="position: fixed;left: 0;top: 0;right: 0;bottom: 0;z-index: 1110;background:#fff;opacity:0;";
    document.body.appendChild(mask);
    return mask;
}

// 判断是否是safari
export const isSafari = () => {
  if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
    return true
  }
  return false
}
// 判断是否是FF
export const isFireFox = () => {
  if (/Firefox/.test(navigator.userAgent)) {
    return true
  }
  return false
}

// 判断是否是Chrome
export const isChrome = () => {
  if (/Chrome/.test(navigator.userAgent)) {
    return true
  }
  return false
}