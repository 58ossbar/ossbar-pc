import axios from '../../axios'

/**
 * 获取云盘分类列表
 */
export const queryDirList = params => {
  return axios({
    url: '/cloud-api/directory/queryDirListNew',
    method: 'get',
    params
  })
}

/**
 * 新建文件夹
 */
export const createDir = data => {
  return axios({
    url: '/cloud-api/directory/createDir',
    method: 'post',
    data
  })
}

/**
 * 查看目录
 */
export const viewDetail = data => {
  return axios({
    url: '/cloud-api/directory/viewDetail',
    method: 'post',
    data
  })
}

/**
 * 文件上传
 */
export const uploadFile = (data, callbackpro, cancelback, isBoard = false) => {
  let url = '/cloud-api/file/uploadFile'
  if (isBoard) {
    url = '/cloud-api/file/uploadFile?type=' + 'baiban'
  }
  return axios({
    url: url,
    method: 'post',
    timeout: 1200000,
    /* onUploadProgress: (progressEvent) => {
      let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
      params.onProgress({percent: num});     //进度条
    },*/
    isOnUploadProgress: true,
    isCancel: true,
    data
  }, (progress) => {
    callbackpro(progress)
  }, (cancel) => {
    cancelback(cancel)
  })
}

/**
 * 文件重命名
 */
export const rename = data => {
  return axios({
    url: '/cloud-api/directory/rename',
    method: 'post',
    data
  })
}

/**
 * 文件删除
 */
export const deletes = data => {
  return axios({
    url: '/cloud-api/directory/deletes',
    method: 'post',
    data
  })
}

/**
 * 获取文件夹树控件数据
 */
export const getDirectoryTree = (data) => {
  return axios({
    url: '/cloud-api/directory/getDirectoryTree',
    method: 'post',
    data
  })
}

/**
 * 移动文件
 */
export const moveFile = (data) => {
  return axios({
    url: '/cloud-api/directory/move',
    method: 'post',
    data
  })
}

/**
 * 复制文件
 */
export const copyFile = (data) => {
  return axios({
    url: '/cloud-api/directory/copy',
    method: 'post',
    data
  })
}

/**
 * 获取右侧快捷面板
 */
export const queryRightList = (data) => {
  return axios({
    url: '/cloud-api/navbar/queryRightList',
    method: 'post',
    data
  })
}

/**
 * 获取目录显示管理列表信息
 * @param {*} params
 */
export const queryDirectoryDisplay = params => {
  return axios({
    url: '/cloud-api/cloudpanpermissions/queryDirectoryDisplay?ctId=' + params,
    method: 'get'
  })
}

/**
 * 获取所有文件目录
 * @param {*} params
 */
export const getTreeDataForAuth = params => {
  return axios({
    url: '/cloud-api/cloudpanpermissions/getTreeDataForAuth',
    method: 'get',
    params
  })
}

export const uploadFolder = (data) => {
  return axios({
    url: '/cloud-api/directory/uploadFolder',
    method: 'post',
    timeout: 1200000,
    isOnUploadProgress: false,
    isCancel: false,
    data
  })
}
