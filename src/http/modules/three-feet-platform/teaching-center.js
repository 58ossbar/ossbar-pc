import axios from '../../axios'

/**
 * 新版，根据课堂id显示课堂详情信息
 * @param {*} id 课堂主键
 */
export const getClassroomInfo = id => {
  return axios({
    url: '/teachingCenter-api/getClassroomInfo/' + id,
    method: 'get'
  })
}

/**
 * 课堂成员列表
 * @param ctId 班级
 * @param traineeName 学员名称
 * @param pageNum
 * @param pageSize
 */
export const listClassroomTrainee = (params) => {
  return axios({
    url: '/teachingCenter-api/listClassroomTrainee',
    method: 'get',
    params
  })
}

/**
 * 设为助教
 * @param ctId 课堂主键
 * @param traineeId 学员主键
 */
export const setTraineeToTeachingAssistant = (data) => {
  return axios({
    url: '/teachingCenter-api/setTraineeToTeachingAssistant',
    method: 'POST',
    data
  })
}

/**
 * 删除课堂成员
 * @param {*} data
 */
export const deleteClassTrainee = (data) => {
  return axios({
    url: '/teachingCenter-api/deleteClassTrainee',
    method: 'POST',
    data
  })
}

/**
 *  新增手势签到
 */
export const saveSigninInfo = data => {
  return axios({
    url: '/activity/signin/saveSigninInfo?pkgId=' + data.pkgId,
    method: 'post',
    data
  })
}
