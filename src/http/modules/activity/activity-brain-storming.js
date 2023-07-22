import axios from '../../axios'

// 保存头脑风暴
export const saveActivityBrainstorming = data => {
  return axios({
    url: 'activity/brainstorming/saveActivityBrainstorming',
    method: 'post',
    data
  })
}

// 查看头脑风暴
export const viewActivityBrainstormingInfo = params => {
  return axios({
    url: 'activity/brainstorming/viewActivityBrainstormingInfo?activityId=' + params,
    method: 'get',
    params
  })
}
/**
 * 保存学员提交风暴头脑的作答内容
 */
export const saveActivityBrainstormingTraineeAnswerInfo = data => {
  return axios({
    url: 'activity/brainstorming/saveActivityBrainstormingTraineeAnswerInfo',
    method: 'post',
    data
  })
}
/**
 * 查看所有学员提交风暴头脑的作答内容
 */
export const viewTraineeAnswerListData = params => {
  return axios({
    url: 'activity/brainstorming/viewTraineeAnswerListData',
    method: 'get',
    params
  })
}
/**
 * 学员查看自己提交风暴头脑的作答内容
 */
export const viewTraineeAnswerInfo = params => {
  return axios({
    url: 'activity/brainstorming/viewTraineeAnswerInfo',
    method: 'get',
    params
  })
}
/**
 * 上传附件
 */
export const uploads = data => {
  return axios({
    url: '/activity/brainstorming/upload',
    method: 'post',
    data
  })
}

/**
 * 改版上传
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const upload = data => {
  return axios({
    url: '/activity/brainstorming/upload',
    method: 'post',
    data
  })
}

/**
 * 点赞和取消
 */
export const brainstorming = data => {
  return axios({
    url: '/activity/brainstorming/clickLike?anId=' + data.anId + '&value=' + data.value,
    method: 'post'
  })
}
