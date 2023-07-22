import axios from '../../axios'

// 保存答疑讨论
export const saveActivityAnswerDiscuss = data => {
  return axios({
    url: 'activity/answerDiscuss/saveActivityAnswerDiscuss',
    method: 'post',
    data
  })
}

// 查看答疑讨论
export const viewAnswerDiscussInfo = params => {
  return axios({
    url: 'activity/answerDiscuss/viewAnswerDiscussInfo?activityId=' + params,
    method: 'get',
    params
  })
}
