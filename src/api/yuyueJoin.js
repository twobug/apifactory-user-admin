import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/yuyueJoin/list',
    method: 'post',
    data: { 
      page,
      pageSize,
      ...data 
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/yuyueJoin/del',
    method: 'post',
    data: { id }
  })
}

export function successData(id) {
  return request({
    url: '/user/yuyueJoin/success',
    method: 'post',
    data: { id }
  })
}
