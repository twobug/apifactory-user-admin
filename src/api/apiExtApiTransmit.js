import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtApiTransmit/list',
    method: 'post',
    data: { ...data }
  })
}

export function infoData(id) {
  return request({
    url: '/user/apiExtApiTransmit/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtApiTransmit/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtApiTransmit/save',
    method: 'post',
    data: { ...data }
  })
}
