import axios from '../axios'

// 获取实训故事列表页
export const findData = params => {
  return axios({
    url: 'trainee-story/list',
    method: 'get',
    params
  })
}
// 根据id获取实训故事详情页
export const findDataDtails = params => {
  return axios({
    url: 'trainee-story/view/' + params,
    method: 'get'
  })
}
