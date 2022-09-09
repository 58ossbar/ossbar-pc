import axios from '../../axios'

// 查看学员签到情况
export const queryTraineeList = params => {
  return axios({
    url: '/activity/signin/queryTraineeList?ctId=' + params.ctId + '&activityId=' + params.activityId,
    method: 'get'
  })
}

// 查看签到设置常量
export const getDictList = params => {
  return axios({
    url: 'activity/signin/getDictList',
    method: 'get',
    params
  })
}

// 改变学员签到状态
export const setTraineeSignState = data => {
  return axios({
    url: '/activity/signin/setTraineeSignState',
    method: 'post',
    data
  })
}

// 获取签到 统计图 数据
export const viewAttendanceStatisticsChart = params => {
  return axios({
    url: 'activity/signin/viewAttendanceStatisticsChart',
    method: 'get',
    params
  })
}
