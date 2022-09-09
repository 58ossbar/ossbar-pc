import axios from '../axios'

/**
 * 数据字典接口
 * @param params
 * @returns {*|Promise|Promise<any>}
 */

// 获取资源分组
export const getResourceGroup = params => {
  return axios({
    url: 'dict-api/getResourceGroup',
    method: 'get',
    params
  })
}

// 教学包适用层次
export const listPkgLevel = params => {
  return axios({
    url: 'dict-api/listPkgLevel',
    method: 'get',
    params
  })
}

// 教学包使用限制
export const listPkgLimit = params => {
  return axios({
    url: 'dict-api/listPkgLimit',
    method: 'get',
    params
  })
}

// 教学包发布方大类
export const listDeployMainType = params => {
  return axios({
    url: 'dict-api/listDeployMainType',
    method: 'get',
    params
  })
}
