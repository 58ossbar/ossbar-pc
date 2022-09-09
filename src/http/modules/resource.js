import axios from '../axios'

/**
 * 资源相关接口
 * @param params
 * @returns {*|Promise|Promise<any>}
 */

// 保存资源
export const saveResource = (data) => {
  return axios({
    url: 'resourceCenter-api/saveResource',
    method: 'post',
    data
  })
}

// 上传文件
/* export const uploadFile=params=>{
    return axios({
        url:'resourceCenter-api/uploadFile',
        methods:'post',
        params
    })
}*/

export const uploadFile = data => {
  return axios({
    url: 'resourceCenter-api/uploadFile',
    method: 'post',
    data
  })
}

/**
 * 设置章节对学员是否可见
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const setTraineesVisible = data => {
  return axios({
    url: 'resourceCenter-api/setTraineesVisible',
    method: 'post',
    data
  })
}

/**
 * 一键生成默认章节
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const createDefaultChapter = data => {
  return axios({
    url: 'resourceCenter-api/create',
    method: 'post',
    data
  })
}

export const upgradeNodes = data => {
  return axios({
    url: '/subject-api/upgradeNodes',
    method: 'post',
    data
  })
}
