import axios from '../axios'

// 课堂成员
export const queryClassTrainee = params => {
  return axios({
    url: `teachingCenter-api/queryClassTrainee?pageNum=${params.pageNum}&pageSize=${params.pageSize}&classId=${params.classId}`,
    methods: 'get'
  })
}
