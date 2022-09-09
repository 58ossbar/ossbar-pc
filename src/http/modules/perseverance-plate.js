import axios from '../axios'

// 获得技术
export const listSubjects = params => {
  return axios({
    url: 'classroom-api/listSubjects',
    method: 'get',
    params
  })
}

// 获得课堂状态
export const listClassroomState = params => {
  return axios({
    url: 'classroom-api/listClassroomState',
    method: 'get',
    params
  })
}

//  根据课程subjectId 获得一级章节
export const listChapters = params => {
  return axios({
    url: 'subject-api/listChapters',
    method: 'get',
    params
  })
}
