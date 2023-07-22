import axios from '../axios'

// 根据id获取教学包详情
export const findData = params => {
  return axios({
    url: 'pkginfo-api/getPkgInfo/' + params,
    method: 'get'
  })
}

// 根据id获取教学包详情
export const findPkgInfo = params => {
  return axios({
    url: 'pkginfo-api/query/',
    method: 'get',
    params
  })
}
