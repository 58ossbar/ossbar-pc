import axios from '../axios'

/**
 * 根据条件查询授课记录
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const queryScheduleData = data => {
  return axios({
    url: '/site/schedule/queryScheduleDataForWeb',
    method: 'post',
    data
  })
}

/**
 * 查询实训室
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const queryTrainingRoomList = params => {
  return axios({
    url: '/site/schedule/queryTrainingRoomList',
    method: 'get',
    params
  })
}

export const findMyClassList = data => {
  return axios({
    url: '/site/schedule/findMyClassList',
    method: 'post',
    data
  })
}

export const findMyJoinedClassList = data => {
  return axios({
    url: '/site/schedule/findMyJoinedClassList',
    method: 'post',
    data
  })
}

export const findMyTeacherList = data => {
  return axios({
    url: '/site/schedule/findMyTeacherList',
    method: 'post',
    data
  })
}

export const getDictScheduleState = params => {
  return axios({
    url: '/site/schedule/getDictScheduleState',
    method: 'get',
    params
  })
}
