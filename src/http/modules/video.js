import axios from '../axios'

/**
 * 根据条件查询视频
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const queryVideoList = (params) => {
  return axios({
    url: '/site/video/queryVideoList',
    method: 'get',
    params
  })
}

/**
 * 保存
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const saveVideo = (data) => {
  return axios({
    url: '/site/video/saveVideo',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const deleteVideo = (data) => {
  return axios({
    url: '/site/video/deleteVideo',
    method: 'post',
    data
  })
}

export const viewVideo = (data) => {
  return axios({
    url: '/site/video/viewVideo',
    method: 'post',
    data
  })
}

/**
 * 字典-视频分类
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const getVideoTypeList = (params) => {
  return axios({
    url: '/site/video/getVideoTypeList',
    method: 'get',
    params
  })
}

/**
 * 正在进行中的课堂
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const getRoomList = (params) => {
  return axios({
    url: '/site/video/getRoomList',
    method: 'get',
    params
  })
}
