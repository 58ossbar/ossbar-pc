import axios from '../../axios'

// 获取左侧资源列表
export const queryTypeList = () => {
  return axios({
    url: '/site/forum/friend/queryTypeList',
    method: 'get'
  })
}
