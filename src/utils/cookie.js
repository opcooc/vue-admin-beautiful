import { tokenTableName } from '@/config/settings'

/**
 * @description 保存cookie
 * @param {Object} json 需要存储cookie的对象
 * @param {Number} days 默认存储多少天
 */
export function setCookie(json, days) {
  // 设置过期时间
  let data = new Date(
    new Date().getTime() + days * 24 * 60 * 60 * 1000
  ).toUTCString()

  for (const key in json) {
    document.cookie = key + '=' + json[key] + '; expires=' + data
  }
}

/**
 * @description 获取cookie
 * @param {String} name 需要获取cookie的key
 */
export function getCookie(name) {
  const arr = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  )
  if (arr != null) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * @description 获取cookie中的token
 * @param {String} name 需要获取cookie的key
 */
export function getTokenByCookie() {
  const arr = document.cookie.match(
    new RegExp('(^| )' + tokenTableName + '=([^;]*)(;|$)')
  )
  if (arr != null) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
export function clearTokenCookie() {
  let json = {}
  json[tokenTableName] = ''
  setCookie(json, -1)
}

/**
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
export function clearCookie(name) {
  let json = {}
  json[name] = ''
  setCookie(json, -1)
}
