import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/centerUserDomain/list',
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
    url: '/user/centerUserDomain/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserDomain/save',
    method: 'post',
    data: { ...data }
  })
}

export function getPayData(domainId) {
  return request({
    url: '/buy/domain/getPayData',
    method: 'post',
    data: { domainId }
  })
}
