import axios from '../../axios'

// 聊天上传附件
export const upload = (data, callbackpro, cancelback) => {
  return axios({
    url: 'cbim/file/upload',
    method: 'post',
    isOnUploadProgress: true,
    isCancel: true,
    data
  }, (progress) => {
    callbackpro(progress)
  }, (cancel) => {
    cancelback(cancel)
  })
}

/**
 * 获取系统通知 列表
 * @param {*} params
 */
export const getSysList = params => {
  return axios({
    url: 'site/sys-msg/query',
    method: 'get',
    params
  })
}

// 答疑讨论 点赞/取消点赞
export const clickLike = data => {
  return axios({
    url: 'activity/answerDiscuss/clickLike',
    method: 'post',
    data
  })
}

/**
 * 获取 群成员列表
 * @param {*} params
 */
export const getGroupUserList = params => {
  return axios({
    url: 'cbim/group/queryGroupUserList',
    method: 'get',
    params
  })
}

// 消息页面 新增通知
export const sendText = data => {
  return axios({
    url: '/site/sys-msg/sendText',
    method: 'post',
    data
  })
}
