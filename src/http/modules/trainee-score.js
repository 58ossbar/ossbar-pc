import axios from '@/http/axios'

export const findTraineeScoreList = params => {
  return axios({
    url: '/teachingCenter-api/score-api/findTraineeScoreList',
    method: 'get',
    params
  })
}

export const getClassList = params => {
  return axios({
    url: '/teachingCenter-api/score-api/getClassList',
    method: 'get',
    params
  })
}

export const findStudentInfo = params => {
  return axios({
    url: '/teachingCenter-api/score-api/findStudentInfo',
    method: 'get',
    params
  })
}
