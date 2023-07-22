import axios from '../axios'

export const showNews = (params) => {
  return axios({
    url: 'news-api/view/' + params,
    method: 'get',
    params
  })
}

export const showNewsList = (params) => {
  return axios({
    url: 'news-api/list/',
    method: 'get',
    params
  })
}

export const showGetCategory = (params) => {
  return axios({
    url: 'news-api/getCategory',
    method: 'get',
    params
  })
}
