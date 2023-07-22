import axios from '@/http/axios'

// 获取校庆合作列表页
export const findData = params => {
  return axios({
    url: '/partner-api/list',
    method: 'get',
    params
  })
}
