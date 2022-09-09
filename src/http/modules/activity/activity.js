import axios from '../../axios'

// 从字典获取活动状态(未开始、进行中、已结束)
export const listActivityState = params => {
  return axios({
    url: 'activity/listActivityState',
    method: 'get',
    params
  })
}

// 获取活动分组(包含字典默认、自己针对教学包的活动创建的分组)
export const listActivityGroup = params => {
  return axios({
    url: 'activity/listActivityGroup',
    method: 'get',
    params
  })
}

// 保存分组
export const saveResgroup = data => {
  return axios({
    url: 'activity/saveResgroup',
    method: 'post',
    data
  })
}

// 活动列表
export const listActivity = params => {
  return axios({
    url: 'activity/listActivity',
    method: 'get',
    params
  })
}

/**
 * 开始活动
 */
export const startActivity = data => {
  return axios({
    url: 'activity/startActivity',
    method: 'post',
    data
  })
}

/**
 * 结束活动
 */
export const endActivity = data => {
  return axios({
    url: 'activity/endActivity',
    method: 'post',
    data
  })
}

/**
 * 删除活动
 */
export const delActivity = data => {
  return axios({
    url: 'activity/deleteActivity',
    method: 'post',
    data
  })
}

export const queryActivityList = data => {
  return axios({
    url: 'activity/queryActivityList',
    method: 'post',
    data
  })
}

// 提交签到
export const signIno = data => {
  return axios({
    url: '/activity/signin/signIno',
    method: 'post',
    data
  })
}

// 开始抢答活动
export const startAnswerActivity = data => {
  return axios({
    url: '/activity/pere/startAnswerActivity',
    method: 'post',
    data
  })
}
