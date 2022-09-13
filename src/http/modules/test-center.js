import axios from '../axios'

// 获取方向
export const getMajor = params => {
  return axios({
    url: '/subject-api/getMajor',
    method: 'get',
    params
  })
}
