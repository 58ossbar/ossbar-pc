import axios from '../axios'

// 根据id获取职业路径详情
export const findData = params => {
  return axios({
    url: 'major-api/view/' + params,
    method: 'get'
  })
}
