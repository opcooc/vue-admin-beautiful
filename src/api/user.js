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
    url: '/admin/oauth/token',
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

export async function mobileLogin(data) {
  return request({
    url: '/admin/oauth/mobile',
    method: 'post',
    params: {
      data: data.data,
      token: data.token,
      mobile: data.mobile,
      autoSignUp: data.autoSignUp,
    },
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/auth/getUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/oauth/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
