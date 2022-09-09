import axios from '../axios'

export const showLogin = (data) => {
  return axios({
    url: 'login-api/login',
    dataType: 'formData',
    method: 'post',
    data
  })
}
export const checkToken = (data) => {
  return axios({
    url: 'login-api/checkToken',
    dataType: 'formData',
    method: 'post',
    data
  })
}
export const showRegister = (data) => {
  return axios({
    url: 'login-api/register',
    method: 'post',
    dataType: 'formData',
    data
  })
}

export const showSendregsms = (data) => {
  return axios({
    url: 'login-api/sendregsms',
    method: 'post',
    dataType: 'formData',
    data
  })
}
export const getUser = (params) => {
  return axios({
    url: 'login-api/user',
    method: 'get',
    dataType: 'formData',
    params
  })
}
export const getBindmobile = (params) => {
  return axios({
    url: 'login-api/bindmobile',
    method: 'get',
    dataType: 'formData',
    params
  })
}

export const showSendbindsms = (params) => {
  return axios({
    url: 'login-api/sendbindsms',
    method: 'get',
    dataType: 'formData',
    params
  })
}

export const outLogin = (params) => {
  return axios({
    url: 'login-api/loginout',
    method: 'get',
    dataType: 'formData',
    params
  })
}

export const checkIsLogin = (data) => {
  if (!data) { data = {} }
  return axios({
    url: 'login-api/checkIsLogin',
    method: 'post',
    dataType: 'formData',
    data
  })
}

export const sendloginsms = (params) => {
  return axios({
    url: 'login-api/sendloginsms',
    method: 'get',
    dataType: 'formData',
    params
  })
}
