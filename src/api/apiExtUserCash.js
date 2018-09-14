import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtUserCash/list',
    method: 'post',
    data: { ...data }
  })
}
