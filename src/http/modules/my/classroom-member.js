import axios from '../../axios'

// 课堂成员列表
export const listClassroomTrainee = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/listClassroomTrainee',
    method: 'get',
    params
  })
}

// 查询所有课堂成员id
export const queryAllTrainee = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/queryAllTrainee',
    method: 'post',
    data
  })
}

// 将某个成员设为助教
export const setTraineeToTeachingAssistant = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/setTraineeToTeachingAssistant',
    method: 'post',
    data
  })
}

export const cancelTeachingAssistant = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/cancelTeachingAssistant',
    method: 'post',
    data
  })
}

// 删除课堂成员
export const deleteClassTrainee = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/deleteClassTrainee',
    method: 'post',
    data
  })
}

// 班级成员列表
export const listClassTrainee = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/listClassTrainee',
    method: 'get',
    params
  })
}

// 将班级学员导入成课堂成员
export const importTraineeBatch = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/importTraineeBatch',
    method: 'post',
    data
  })
}

// 历史签到记录
export const historySignInRecord = params => {
  return axios({
    url: 'activity/signin/queryHistorySigninInfo',
    method: 'get',
    params
  })
}

// 删除历史签到记录
export const deleteHistorySigninInfo = data => {
  return axios({
    url: 'activity/signin/deleteHistorySigninInfo?activityId=' + data.activityId,
    method: 'post',
    data
  })
}

// 成员详情列表
export const queryTraineeSigninDetail = params => {
  return axios({
    url: 'teachingCenter-api/sign-api/queryTraineeSigninDetail',
    method: 'get',
    params
  })
}

// 查看课堂成员基本信息
export const viewTraineeBaseInfo = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/viewTraineeBaseInfo',
    method: 'get',
    params
  })
}

// 图形详细信息
export const viewTraineeDetailInfo = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/viewTraineeDetailInfo',
    method: 'get',
    params
  })
}

/* 课堂小组 */

// 课堂小组列表
export const listClassroomGroupSimpleInfo = params => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/listClassroomGroupSimpleInfo?ctId=' + params,
    method: 'get',
    params
  })
}

// 新增一个课堂小组
export const saveClassroomGroupInfo = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/saveClassroomGroupInfo',
    method: 'post',
    data
  })
}

// 新增多个课堂小组
export const saveGroupInfo = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/saveGroupInfo',
    method: 'post',
    data
  })
}

// 删除课堂小组
export const deleteClassroomGroup = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/deleteClassroomGroup',
    method: 'post',
    data
  })
}

// 重命名课堂小组
export const rename = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/rename',
    method: 'post',
    data
  })
}

// 查看课堂小组信息
export const viewClassroomGroupInfo = params => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/viewClassroomGroupInfo',
    method: 'get',
    params
  })
}

// 未加入课堂小组的成员列表
export const listClassroomTraineeExcludeJoinedGroup = params => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/listClassroomTraineeExcludeJoinedGroup',
    method: 'get',
    params
  })
}

// 将学员加入小组
export const setTraineeToGroup = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/setTraineeToGroup',
    method: 'post',
    data
  })
}

// 将成员移出小组
export const deleteClassroomGroupMember = params => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/deleteClassroomGroupMember',
    method: 'get',
    params
  })
}

// 待审核的成员列表
export const queryTraineeList = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-check-api/queryTraineeList',
    method: 'get',
    params
  })
}

// 获取个人经验值明细
export const viewEmpiricalValueLogs = params => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/viewEmpiricalValueLogs',
    method: 'get',
    params
  })
}

// 将待审核的学员加入成课程成员
export const setTraineeToClassroom = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-check-api/setTraineeToClassroom',
    method: 'post',
    data
  })
}

// 设置小组组长
export const setTraineeToLeader = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/setTraineeToLeader',
    method: 'post',
    data
  })
}

// 编辑学生基本信息
export const updateTraineeInfo = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/updateTraineeInfo',
    method: 'post',
    data
  })
}

// 获取属于当前教师的课堂
export const queryClassroomList = params => {
  return axios({
    url: '/classroom-api/queryClassroomList',
    method: 'get',
    params
  })
}

// 一键添加课堂成员
export const oneClickToJoinClassroom = (params, data) => {
  return axios({
    url: '/classroom-api/oneClickToJoinClassroom?ctId=' + params,
    method: 'post',
    data
  })
}

// 查看某学员的当前课堂的经验值、热心解答次数、获取点赞数、课堂表现次数、视频学习个数
export const viewNums = (data) => {
  return axios({
    url: '/classroom-api/icon/viewNums',
    method: 'post',
    data
  })
}

// 批量 删除课堂成员
export const deleteClassroomTraineeBatch = data => {
  return axios({
    url: 'teachingCenter-api/classroom-trainee-api/deleteClassroomTraineeBatch',
    method: 'post',
    data
  })
}

// 批量删除 小组成员
export const removeGroupMembers = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/removeGroupMembers',
    method: 'post',
    data
  })
}

// 获取课堂小组成员身份 ，用于小组成员 设为 组长、开发人员、项目经理等 身份
export const getIdentityList = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/getIdentityList',
    method: 'get'
  })
}

// 设置小组成员身份 ，用于小组成员 设为 组长、开发人员、项目经理等 身份
export const setIdentity = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/setIdentity',
    method: 'post',
    data
  })
}

// 批量 设置小组成员身份 ，用于小组成员 设为 组长、开发人员、项目经理等 身份
export const setIdentityBatch = data => {
  return axios({
    url: 'teachingCenter-api/classroom-group-api/setIdentityBatch',
    method: 'post',
    data
  })
}
