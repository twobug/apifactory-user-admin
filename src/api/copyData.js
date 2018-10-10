import request from '@/utils/request'

export function saveData(data) {
  return request({
    url: '/user/copyData/save',
    method: 'post',
    data: { ...data }
  })
}
