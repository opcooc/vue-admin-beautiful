import request from '@/utils/request'

export function reqGet(data) {
  return request({
    url: '/admin/captcha/' + data.captchaType + '/code',
    method: 'post',
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
