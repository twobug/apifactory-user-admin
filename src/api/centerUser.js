import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/centerUser/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function infoData(id) {
  return request({
    url: '/user/centerUser/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/centerUser/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUser/save',
    method: 'post',
    data: { ...data }
  })
}

export function getPayData(userId) {
  return request({
    url: '/vip/getPayData',
    method: 'post',
    data: { userId }
  })
}

export function statisticsData() {
  return request({
    url: '/user/statistics',
    method: 'get'
  })
}