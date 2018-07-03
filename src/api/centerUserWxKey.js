import request from '@/utils/request'

export function infoData() {
  return request({
    url: '/user/centerUserWxKey/list',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/centerUserWxKey/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserWxKey/save',
    method: 'post',
    data: { ...data }
  })
}
