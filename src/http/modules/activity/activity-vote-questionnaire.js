import axios from '../../axios'

// 保存投票/问卷
export const saveVoteQuestionnaireInfo = data => {
  return axios({
    url: 'activity/voteQuestionnaire/saveVoteQuestionnaireInfo',
    method: 'post',
    data
  })
}

// 查看投票/问卷
export const viewVoteQuestionnaireInfo = params => {
  return axios({
    url: 'activity/voteQuestionnaire/viewVoteQuestionnaireInfo?activityId=' + params,
    method: 'get',
    params
  })
}

// 问题类型
export const listQuestionType = params => {
  return axios({
    url: 'dict-api/listQuestionType',
    method: 'get',
    params
  })
}

/**
 * 保存学员提交投票/问卷的作答内容
 */
export const saveTraineeCommitAnswerContent = data => {
  return axios({
    url: 'activity/voteQuestionnaire/saveTraineeCommitAnswerContent',
    method: 'post',
    data
  })
}

/**
 * 查看学员针对投票/问卷的作答内容
 */
export const viewTraineeAnswerListData = params => {
  return axios({
    url: 'activity/voteQuestionnaire/viewTraineeAnswerListData',
    method: 'get',
    params
  })
}

/**
 * 查看作答题目列表
 */
export const viewActivityInfo = params => {
  return axios({
    url: 'activity/viewActivityInfo',
    method: 'get',
    params
  })
}

/**
 * 上传附件
 */
export const uploads = data => {
  return axios({
    url: 'activity/voteQuestionnaire/upload',
    method: 'post',
    data
  })
}
