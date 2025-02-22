import request from '@/utils/request'
import { Base64 } from 'js-base64'
import { encryptedData } from '@/utils/encrypt'
import { clientId, clientSecret } from '@/config/settings'
import { loginRSA, tokenName } from '@/config/settings'
import store from '@/store'

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

export function bindingAccount(data, accessToken) {
  return request({
    url: '/admin/auth/binding-account',
    method: 'get',
    params: {
      account: data.account,
      source: data.source,
    },
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
}

export function getSocialBind() {
  return request({
    url: '/admin/auth/social/bind',
    method: 'get',
  })
}

export function checkBindMobile(accessToken) {
  return request({
    url: '/user/check-bind-mobile',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
}

export function getUserDetails(id) {
  return request({
    url: '/user/get',
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function simpleUpdateUser(data) {
  return request({
    url: '/user/simple-update',
    method: 'post',
    data,
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
