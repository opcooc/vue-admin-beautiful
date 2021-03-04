import request from '@/utils/request'
import { Base64 } from 'js-base64'
import { encryptedData } from '@/utils/encrypt'
import { clientId, clientSecret } from '@/config/settings'
import { loginRSA, tokenName } from '@/config/settings'

export async function login(data) {
  // if (loginRSA) {
  //   data = await encryptedData(data)
  // }
  return request({
    url: '/oauth/token',
    method: 'post',
    headers: {
      Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
    },
    params: {
      username: data.username,
      password: data.password,
      grant_type: 'password',
      scope: 'userInfo',
    },
  })
}

export async function socialLogin(providerId, routeUrl) {
  return request({
    url: '/admin/oauth/social/before-bind',
    method: 'get',
    params: {
      source: providerId,
      routeUrl: routeUrl,
    },
  })
}

export async function mobileLogin(mobile, autoSignUp) {
  return request({
    url: '/admin/oauth/mobile',
    method: 'get',
    params: {
      mobile: mobile,
      autoSignUp: autoSignUp,
    },
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
