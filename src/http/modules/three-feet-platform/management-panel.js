import axios from '../../axios'

// 管理看板，相关接口

/**
 * 获取个人信息
 * @param {} params
 */
export const getPersonalInfo = params => {
  return axios({
    url: 'managementPanel-api/getPersonalInfo',
    method: 'get'
  })
}

/**
 * 获取消息数
 * @param {*} params
 */
export const getMsgNum = params => {
  return axios({
    url: 'managementPanel-api/getMsgNum',
    method: 'get'
  })
}

/**
 * 获取滚动新闻
 * @param {*} params
 */
export const listNews = params => {
  return axios({
    url: 'managementPanel-api/listNews',
    method: 'get'
  })
}

/**
 * 保存信息
 * @param {*} data
 */
export const saveInfo = (data) => {
  return axios({
    url: 'managementPanel-api/saveInfo',
    method: 'post',
    data
  })
}

/**
 * 头像上传
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const uploadPic = (data) => {
  return axios({
    url: 'managementPanel-api/uploadPic',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const updatePassword = (data) => {
  return axios({
    url: '/managementPanel-api/updatePassword',
    method: 'post',
    data
  })
}
