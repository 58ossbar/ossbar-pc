import axios from '../../axios'

/**
 * 保存轻直播
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const save = data => {
  return axios({
    url: 'activity/live/save',
    method: 'post',
    data
  })
}

// 查看答疑讨论
export const viewLive = params => {
  return axios({
    url: 'activity/live/viewLive',
    method: 'get',
    params
  })
}
