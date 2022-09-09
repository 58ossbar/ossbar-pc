import axios from '../axios'

/**
 * 托拽节点
 * @param {*} data
 * @returns
 */
export const dragNode = (data) => {
  return axios({
    url: '/subject-api/dragNode',
    method: 'post',
    data
  })
}

// 获取技术领域信息
export const findDataJS = params => {
  return axios({
    url: 'major-api/queryAll',
    method: 'get',
    params
  })
}
// 根据条件查询除技术领域以外的所有信息
export const findData = params => {
  return axios({
    url: 'subject-api/query',
    method: 'get',
    params
  })
}
// 根据条件查询除技术领域以外的所有信息
export const findDataSelf = params => {
  return axios({
    url: 'subject-api/querySelf',
    method: 'get',
    params
  })
}
// 根据id查询书籍章节信息
export const findDataDetails = params => {
  return axios({
    url: 'subject-api/getBook/' + params,
    method: 'get'
  })
}
// 根据id查询书籍章节具体内容
export const findDataDetailsContent = params => {
  return axios({
    url: 'subject-api/viewChapter',
    method: 'get',
    params
  })
}
// 根据id查询书籍 信息
export const findDataView = params => {
  return axios({
    url: 'subject-api/view',
    method: 'get',
    params
  })
}
// 获取选修/必修等课程属性
export const findSubjectPropertyData = params => {
  return axios({
    url: 'subject-api/getSubjectProperty',
    method: 'get',
    params
  })
}
// 获取静态封面图
export const getSubjectLogo = params => {
  return axios({
    url: 'subject-api/getSubjectLogo',
    method: 'get',
    params
  })
}
// 获取学校/平台等课程类别
export const findSubjectTypeData = params => {
  return axios({
    url: 'subject-api/getSubjectType',
    method: 'get',
    params
  })
}
// 获取技术标签
export const getTechnology = params => {
  return axios({
    url: 'subject-api/getTechnology',
    method: 'get',
    params
  })
}
// 保存 教材基本信息
export const save = (data) => {
  return axios({
    url: 'subject-api/save',
    method: 'post',
    data
  })
}
// 保存 教材章节内容
export const updateChapter = (data) => {
  return axios({
    url: 'subject-api/updateChapter',
    method: 'post',
    data
  })
}
// add 教材章节内容
export const saveChapter = (data) => {
  return axios({
    url: 'subject-api/saveChapter',
    method: 'post',
    data
  })
}
// 根据id查询 教材ztree树
export const getChapterTree = params => {
  return axios({
    url: 'subject-api/getChapterTree/' + params,
    method: 'get'
  })
}
// 教材rename
export const rename = params => {
  return axios({
    url: 'subject-api/rename',
    method: 'get',
    params
  })
}
// 教材remove
export const remove = params => {
  return axios({
    url: 'subject-api/remove',
    method: 'get',
    params
  })
}
// 获取发布/不发布等课程属性
export const getDeployed = params => {
  return axios({
    url: 'subject-api/getState',
    method: 'get',
    params
  })
}
// 教材 move
export const move = params => {
  return axios({
    url: 'subject-api/move',
    method: 'get',
    params
  })
}
// 根据一个或者多个majorId查询教材名称
export const queryNoPage = params => {
  return axios({
    url: 'subject-api/queryNoPage?majorIds=' + params,
    method: 'get'
  })
}
// 活教材封面图 上传
export const uploadPic = (data) => {
  return axios({
    url: 'subject-api/uploadPic',
    method: 'post',
    data
  })
}
// 活教材 点赞数修改
export const updateNum = (data) => {
  return axios({
    url: 'subject-api/updateNum',
    method: 'post',
    data
  })
}
// 收藏
export const collect = params => {
  return axios({
    url: 'subject-api/collect?targetId=' + params,
    method: 'get'
  })
}
// 取消收藏
export const cancelCollect = params => {
  return axios({
    url: 'subject-api/cancelCollect?targetId=' + params,
    method: 'get'
  })
}
