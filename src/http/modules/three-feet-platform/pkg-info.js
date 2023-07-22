import axios from '@/http/axios'

export const exportWord = (data) => {
  return axios({
    url: '/pkginfo-api/export/toexport',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export const getFilterTypeList = params => {
  return axios({
    url: '/pkginfo-api/getFilterTypeList',
    method: 'get',
    params
  })
}

/**
 * 我的教学包列表
 * @param pkgName
 * @returns {*|Promise|Promise<any>|Promise|Promise|Promise}
 */
export const listPkgInfo = params => {
  return axios({
    url: '/pkginfo-api/listMyPkgInfo',
    method: 'get',
    params
  })
}

/**
 * 教学包下拉列表
 * @returns {*|Promise|Promise<any>|Promise|Promise|Promise}
 */
export const listPkgInfoSelect = params => {
  return axios({
    url: '/pkginfo-api/listPkgInfoSelect',
    method: 'get',
    params
  })
}

/**
 * 保存教学包基本信息
 * @param data
 * @returns {*|Promise|Promise<any>|Promise|Promise|Promise}
 */
export const saveInfo = (data) => {
  return axios({
    url: '/pkginfo-api/saveInfo',
    method: 'post',
    data
  })
}

export const viewPkgInfoForUpdate = (pkgId) => {
  return axios({
    url: '/pkginfo-api/view/' + pkgId,
    method: 'get'
  })
}

export const deletePkg = (data) => {
  return axios({
    url: '/pkginfo-api/deletePkg',
    method: 'post',
    data
  })
}

/* 详情接口 */
export const viewPkgInfo = (params) => {
  return axios({
    url: '/pkginfo-api/viewPkgInfo?pkgId=' + params,
    method: 'get',
    params
  })
}

/* 左侧树形接口 */
export const getBookTreeData = (params) => {
  return axios({
    url: '/resourceCenter-api/getBookTreeData',
    method: 'get',
    params
  })
}

export const getBookTreeDataNew = (params) => {
  return axios({
    url: '/resourceCenter-api/getBookTreeDataNew',
    method: 'get',
    params
  })
}

// 根据id查询教材章节具体内容
export const viewChapterInfo = (params) => {
  return axios({
    url: '/resourceCenter-api/viewChapterInfo',
    method: 'get',
    params: params
  })
}

// 保存资源
export const saveResource = (data) => {
  return axios({
    url: '/resourceCenter-api/saveResource',
    method: 'post',
    data
  })
}

export const viewResInfo = data => {
  return axios({
    url: '/resourceCenter-api/viewResInfo?resgroupId=' + data,
    method: 'get',
    data
  })
}

export const saveResourceGroup = data => {
  return axios({
    url: '/resourceCenter-api/saveResourceGroup',
    method: 'post',
    data
  })
}

// 移动资源分组
export const moveResourceGroup = data => {
  return axios({
    url: '/resourceCenter-api/sort',
    method: 'post',
    data
  })
}

// 删除资源分组
export const deleteResourceGroup = (params) => {
  return axios({
    url: '/resourceCenter-api/deleteResourceGroup?resgroupId=' + params,
    method: 'get',
    params: params
  })
}

// 修改资源分组是否可以复制内容
export const updateValue = (data) => {
  return axios({
    url: 'resourceCenter-api/updateValue',
    method: 'post',
    data
  })
}

// 修改视频资源分组是否可见
export const setTraineesVisibleResgroup = (data) => {
  return axios({
    url: '/resourceCenter-api/setTraineesVisibleResgroup',
    method: 'post',
    data
  })
}

// 重命名资源分组
export const renameResourceGroup = params => {
  return axios({
    url: '/resourceCenter-api/renameResourceGroup',
    method: 'get',
    params
  })
}

// 获取默认资源分组
export const listResourceGroup = (params) => {
  return axios({
    url: '/resourceCenter-api/listResourceGroup',
    method: 'get',
    params
  })
}

// 教学包的发布
export const releaseTeachingPackage = data => {
  return axios({
    url: '/pkginfo-api/releaseTeachingPackage',
    method: 'post',
    timeout: 60000,
    data
  })
}

// 教学包封面娜图片上传
export const uploads = data => {
  return axios({
    url: '/pkginfo-api/uploads',
    method: 'post',
    data
  })
}

/** *
 * 获取可升级的教学包版本
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const queryUpgradeList = data => {
  return axios({
    url: '/pkginfo-api/queryUpgradeList',
    method: 'post',
    data
  })
}

/**
 * 更换版本
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const doUpgradePkg = data => {
  return axios({
    url: '/pkginfo-api/doUpgradePkg',
    method: 'post',
    data
  })
}

/**
 * 将正式发布状态的教学包授权其它人使用
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const authorizationPkg = (data) => {
  return axios({
    url: '/pkginfo-api/authorizationPkg',
    method: 'post',
    data
  })
}

/**
 * 取消授权
 * @param data
 * @returns {Promise<any>}
 */
export const unauthorization = (data) => {
  return axios({
    url: '/pkginfo-api/unauthorization',
    method: 'post',
    data
  })
}

// 获取云盘目录
export const getTree = data => {
  return axios({
    url: '/cloud-api/directory/getTree',
    method: 'post',
    data
  })
}

// 获取当前用户所有教学包的课程体系
export const selectSubjectRefList = () => {
  return axios({
    url: '/pkginfo-api/selectSubjectRefList',
    method: 'post'
  })
}

// 修改教学包封面
export const updatePkgLogo = (data) => {
  return axios({
    url: '/pkginfo-api/updatePkgLogo',
    method: 'post',
    data
  })
}

// 查询我的书架列表数据
export const queryBookList = params => {
  return axios({
    url: '/subject-api/book/queryBookList',
    method: 'get',
    params
  })
}

// 查询我的书架列表数据
export const queryDataList = data => {
  return axios({
    url: '/pkginfo-api/queryDataList',
    method: 'post',
    data
  })
}

// 查询我的书架  书籍详情 数据
export const viewBookInfo = params => {
  return axios({
    url: '/subject-api/book/viewSubjectInfo',
    method: 'get',
    params
  })
}

// 查询我的书架  书籍详情 根据chapterId 查询章节内容 数据
export const viewBookChapterInfo = params => {
  return axios({
    url: '/subject-api/book/viewChapterInfo',
    method: 'get',
    params
  })
}

// 收藏书籍到我的书架
export const collectionThisSubject = (data) => {
  return axios({
    url: '/subject-api/book/collectionThisSubject?pkgId=' + data.pkgId + '&subjectId=' + data.subjectId,
    method: 'get'
  })
}

/** *
 * 获取当前教学包是否在审核
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const check = data => {
  return axios({
    url: '/pkginfo-api/check',
    method: 'post',
    data
  })
}

/** *
 * 获取教学包的审核信息
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const querMyWaitCheckPkgList = data => {
  return axios({
    url: '/pkginfo-api/querMyWaitCheckPkgList',
    method: 'post',
    data
  })
}

/** *
 * 活教材获取信息
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const queryLiveBookList = params => {
  return axios({
    url: '/subject-api/book/queryLiveBookList',
    method: 'get',
    params
  })
}

export const getChapterTreeVisible = (data) => {
  return axios({
    url: '/resourceCenter-api/getChapterTreeVisible',
    method: 'POST',
    data
  })
}

export const setTraineesVisibleBatch = (data) => {
  return axios({
    url: '/resourceCenter-api/setTraineesVisibleBatch',
    method: 'POST',
    data
  })
}

export const queryDefaultNameList = (data) => {
  return axios({
    url: '/pkginfo-api/queryDefaultNameList',
    method: 'POST',
    data
  })
}

export const saveDefaultChapterBatch = (data) => {
  return axios({
    url: '/pkginfo-api/saveBatch',
    method: 'POST',
    data
  })
}

export const getHistoryPkgList = params => {
  return axios({
    url: '/pkginfo-api/getHistoryPkgList',
    method: 'get',
    params
  })
}
