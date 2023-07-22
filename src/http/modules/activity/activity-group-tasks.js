import axios from '../../axios'

// 保存作业/小组任务
export const saveTaskInfo = data => {
  return axios({
    url: '/activity/task/saveTaskInfo',
    method: 'post',
    data
  })
}

// 字典接口任务小组划分方式
export const getDivideGroupType = params => {
  return axios({
    url: '/activity/task/getDivideGroupType',
    method: 'get',
    params
  })
}

// 字典接口
// 评分方式、作业分值及评分点
export const getScoreType = params => {
  return axios({
    url: '/activity/task/getScoreType',
    method: 'get',
    params
  })
}

// 查看头脑风暴
export const viewActivityGroupTasksInfo = params => {
  return axios({
    url: 'activity/task/viewActivityGroupTasksInfo?activityId=' + params,
    method: 'get',
    params
  })
}

// 附件上传
export const tasksUpload = (data, callbackpro, cancelback) => {
  return axios({
    url: '/activity/task/upload',
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

// 查询小组/作业活动信息
export const tasksView = data => {
  return axios({
    url: '/activity/task/view',
    method: 'post',
    data
  })
}

export const viewTraineeAnswerContent = data => {
  return axios({
    url: '/activity/task/viewTraineeAnswerContent',
    method: 'post',
    data
  })
}

/**
 * 学生提交作业/小组任务
 * @param {*} data
 * @returns
 */
export const commitTask = data => {
  return axios({
    url: '/activity/task/commitTask',
    method: 'post',
    data
  })
}
