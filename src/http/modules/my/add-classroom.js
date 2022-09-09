import axios from '../../axios'

// 职业课程路径
export const getMajorList = params => {
  return axios({
    url: 'classroom-api/getMajorList',
    method: 'get',
    params
  })
}

/**
 * 课程下拉列表
 * @param params
 * @returns {*|Promise|Promise<any>|Promise|Promise|Promise}
 */
export const listSelectSubject = params => {
  return axios({
    url: 'subject-api/listSelectSubject',
    method: 'get',
    params
  })
}

// 上课班级
export const getClassList = params => {
  return axios({
    url: 'classroom-api/getClassList',
    method: 'get',
    params
  })
}
// 是否发布
export const getIsPublic = params => {
  return axios({
    url: 'classroom-api/getIsPublic',
    method: 'get'
  })
}
// 邀请码
export const getInvitationCode = params => {
  return axios({
    url: 'classroom-api/getInvitationCode',
    method: 'get'
  })
}
// 指定教材
export const getBookList = params => {
  return axios({
    url: 'classroom-api/getBookList',
    method: 'get'
  })
}

// 提交
export const save = (data) => {
  return axios({
    url: 'classroom-api/save',
    method: 'post',
    data
  })
}

// 图片
export const uploadPic = data => {
  return axios({
    url: 'classroom-api/uploadPic',
    method: 'post',
    data
  })
}

