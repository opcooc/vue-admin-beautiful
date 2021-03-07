import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/user/get',
    method: 'get',
    params: {
      id: '1367486742948536321',
    },
  })
}
