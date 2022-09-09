import axios from '../../axios'

// 发起抢答
export const launchAnswer = data => {
  return axios({
    url: 'activity/pere/launchAnswer',
    method: 'post',
    data
  })
}

// 获取课堂所有学员
export const selectClassroomTraineeInfo = data => {
  return axios({
    url: 'activity/pere/selectClassroomTraineeInfo?ctId=' + data,
    method: 'get'
  })
}

// 提交评分
export const selectPeopleToAnswer = data => {
  return axios({
    url: 'activity/pere/selectPeopleToAnswer',
    method: 'post',
    data
  })
}

// 获取已抢答的学员
export const answerActivityTraineeInfo = params => {
  return axios({
    url: 'activity/pere/answerActivityTraineeInfo?ctId=' + params.ctId + '&activityId=' + params.activityId,
    method: 'get'
  })
}

// 学员抢答
export const traineeAnswer = data => {
  return axios({
    url: 'activity/traineeAnswer/traineeAnswer',
    method: 'post',
    data
  })
}

// 获取老师评分信息
export const answerSummaryResults = params => {
  return axios({
    url: 'activity/pere/answerSummaryResults?ctId=' + params.ctId + '&activityId=' + params.activityId,
    method: 'get'
  })
}
