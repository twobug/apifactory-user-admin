import request from '@/utils/request'

export function spreadData() {
  return request({
    url: '/user/spread/index',
    method: 'get'
  })
}

export function bindAlipay(alipay) {
  return request({
    url: '/user/spread/alipay',
    method: 'post',
    data: { 
      alipay
    }
  })
}

export function applyAmount(amount) {
  return request({
    url: '/user/spread/apply',
    method: 'post',
    data: { amount }
  })
}
