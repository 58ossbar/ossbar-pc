import axios from '../../axios'

// 自己创建的教学包
export const queryMyPkg = params => {
  return axios({
    url: '/pkginfo-api/queryMyPkg',
    method: 'get',
    params
  })
}

export const getBook = params => {
  return axios({
    url: '/resourceCenter-api/subject/getBook',
    method: 'get',
    params
  })
}

export const getBookLine = params => {
  return axios({
    url: '/resourceCenter-api/subject/getBookLine',
    method: 'get',
    params
  })
}

// 教师列表
export const queryTeacherList = params => {
  return axios({
    url: '/teachingCenter-api/teacher-api/queryTeacherList',
    method: 'get',
    params
  })
}

// 章节权限列表
export const queryAuthorization = data => {
  return axios({
    url: '/resourceCenter-api/subject/queryAuthorization',
    method: 'post',
    data
  })
}

// 保存章节权限信息
export const saveAuthInfo = data => {
  return axios({
    url: '/resourceCenter-api/subject/saveAuthInfo',
    method: 'post',
    data
  })
}

// 查询章节所授权的教师信息
export const getChapterTreeWithTeacherName = data => {
  return axios({
    url: '/resourceCenter-api/subject/getChapterTreeWithTeacherName',
    method: 'post',
    data
  })
}
