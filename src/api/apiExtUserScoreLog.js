import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtUserScoreLog/list',
    method: 'post',
    data: { ...data }
  })
}

export function modifyUserScore(data) {
  return request({
    url: '/user/apiExtUserScoreLog/save',
    method: 'post',
    data: { ...data }
  })
}
