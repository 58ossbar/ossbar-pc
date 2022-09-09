import axios from '../../axios'

// 根据邀请码查询课堂
export const serachClassroom = params => {
  return axios({
    url: 'classroom-api/serach',
    method: 'get',
    params
  })
}

// 加入课堂
export const joinTheClassroom = params => {
  return axios({
    url: 'classroom-api/joinTheClassroom',
    method: 'post',
    params
  })
}
