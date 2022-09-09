import axios from '../axios'

// 查询
export const queryResGroup = params => {
  return axios({
    url: 'teachingCenter-api/queryResGroup',
    method: 'get',
    params
  })
}

// 保存
export const saveResGroup = data => {
  return axios({
    url: 'teachingCenter-api/saveResGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteResGroup = data => {
  return axios({
    url: 'teachingCenter-api/deleteResGroup',
    method: 'post',
    data
  })
}

// 排序
export const sortNumResGroup = params => {
  return axios({
    url: `teachingCenter-api/sortNumResGroup?currentId=${params.currentId}&targetId=${params.targetId}`,
    method: 'get'
  })
}
