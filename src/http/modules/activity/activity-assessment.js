import axios from '../../axios'

// 保存分组
export const queryTraineeList = data => {
  return axios({
    url: '/activity/traineeExam/queryTraineeList',
    method: 'post',
    data
  })
}

// 查看当前实践考核活动的信息
export const viewExamroomInfo = params => {
  return axios({
    url: '/activity/traineeExam/viewExamroomInfo?activityId=' + params,
    method: 'get'
  })
}

// 查询所有教师
export const queryTeacherList = data => {
  return axios({
    url: '/activity/traineeExam/queryTeacherList',
    method: 'post',
    data
  })
}

// 新增修改实践考核
export const saveActivityExamroomInfo = data => {
  return axios({
    url: '/activity/traineeExam/saveActivityExamroomInfo',
    method: 'post',
    data
  })
}

// 获取考核规则分数填写页面的基本信息
export const getAssessmentInfo = data => {
  return axios({
    url: '/activity/traineeExam/list',
    method: 'post',
    data
  })
}

// 临时保存实践考核评分
export const precommit = data => {
  return axios({
    url: '/activity/traineeExam/precommit',
    method: 'post',
    data
  })
}

// 提交实践考核评分
export const commit = data => {
  return axios({
    url: '/activity/traineeExam/commit',
    method: 'post',
    data
  })
}

// 查看排名结果
export const viewExamResultInfo = params => {
  return axios({
    url: '/activity/traineeExam/viewExamResultInfo?activityId=' + params.activityId + '&traineeName=' + params.traineeName,
    method: 'get'
  })
}

// 查看某人某次考核具体得分
export const viewExamDetailInfo = params => {
  return axios({
    url: '/activity/traineeExam/viewExamDetailInfo?activityId=' + params.activityId + '&traineeId=' + params.traineeId + '&type=' + params.type,
    method: 'get'
  })
}
