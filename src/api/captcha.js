import request from '@/utils/request'
import { aesEncrypt } from '@/utils/ase'

export function reqGet(data) {
  return request({
    url: '/admin/captcha/' + data.captchaType + '/code',
    method: 'post',
  })
}

export function reqMobileGet(data) {
  return request({
    url: '/admin/captcha/' + data.captchaType + '/code',
    method: 'post',
    params: {
      token: data.token,
      validate: data.validate,
      mobile: data.mobile,
      extraData: data.extraData,
    },
  })
}

//滑动或者点选验证
export function reqCheck(data) {
  return request({
    url: '/admin/captcha/' + data.captchaType + '/check',
    method: 'post',
    params: {
      token: data.token,
      data: data.data,
    },
  })
}

export function validate(data) {
  return request({
    url: '/admin/captcha/' + data.captchaType + '/validate',
    method: 'post',
    params: {
      data: aesEncrypt(data.phoneCode, data.secretKey),
      token: data.token,
    },
  })
}
