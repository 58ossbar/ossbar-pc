import axios from '../axios'

// 获取校庆合作列表页
export const findData = params => {
  return axios({
    url: 'partner-api/list',
    method: 'get',
    params
  })
}

// 提交合作意向
export const commit = data => {
  return axios({
    url: '/site/join-us/commit',
    method: 'post',
    data
  })
}
