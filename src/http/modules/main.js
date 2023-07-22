import axios from '../axios'

export const showmain = (params) => {
  return axios({
    url: 'index-api/',
    method: 'get',
    params
  })
}

export const getMenu = (params) => {
  return axios({
    url: 'index-api/getInitMenu/',
    method: 'get',
    params
  })
}

export const getSubjectlist = (params) => {
  return axios({
    url: 'subject-api/list/',
    method: 'get',
    params
  })
}

export const getNews = (params) => {
  return axios({
    url: 'index-api/news/',
    method: 'get',
    params
  })
}

export const getMajor = (params) => {
  return axios({
    url: 'major-api/queryAll/',
    method: 'get',
    params
  })
}
