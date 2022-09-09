import axios from '../axios'

// 获取方向
export const getMajor = params => {
  return axios({
    url: '/subject-api/getMajor',
    method: 'get',
    params
  })
}

// 获取技术
export const getSubjectTechnology = params => {
  return axios({
    url: 'examCenter-api/getSubjectTechnology',
    method: 'get',
    params
  })
}

// 试卷列表
export const queryPapers = params => {
  return axios({
    url: 'testPaper-api/queryPapers',
    method: 'get',
    params
  })
}

// 获取指定方向试卷
export const assignQueryPapers = params => {
  return axios({
    url: 'testPaper-api/queryPapers?subjectTechnology=' + params,
    method: 'get'
  })
}

/* 教师组卷 */

// 选题
export const constructing = params => {
  return axios({
    url: 'testPaper-api/constructing?subjectId=' + params,
    method: 'get'
  })
}

// 根据章节ID获取章节信息，题目数量
export const loadChapters = params => {
  return axios({
    url: 'testPaper-api/loadChapters',
    method: 'get',
    params
  })
}

// 定时发送请求，将选择的数据存到session
export const temporarySaveSession = data => {
  return axios({
    url: 'testPaper-api/temporarySaveSession',
    method: 'post',
    data
  })
}

// 点击【进入组卷】按钮，进入试卷编辑界面
export const combinationPaper = data => {
  return axios({
    url: 'testPaper-api/combinationPaper',
    method: 'post',
    data
  })
}

// 进入试卷编辑页面后，发送请求调该接口,获取到试卷的所有题目
export const loadCombinationPaper = data => {
  return axios({
    url: 'testPaper-api/loadCombinationPaper',
    method: 'post',
    data
  })
}

// 试卷编辑页面数据保存，保存试卷
export const save = data => {
  return axios({
    url: 'testPaper-api/save',
    method: 'post',
    data
  })
}

// 删除试卷编辑页中的题目，用户点击删除按钮来删除题目时的请求 匹配session的数据并过滤掉需要删除的那个元素
export const deleteQuestions = data => {
  return axios({
    url: 'testPaper-api/deleteQuestions',
    method: 'post',
    data
  })
}

// 重选
export const randomQuestions = data => {
  return axios({
    url: 'testPaper-api/randomQuestions',
    method: 'post',
    data
  })
}

// 试卷保存完毕，进入试卷详细页面，查看详细信息
export const viewPaper = id => {
  return axios({
    url: 'testPaper-api/viewPaper/' + id,
    method: 'get'
  })
}

// 获取试卷的日期
export const getDates = data => {
  return axios({
    url: 'examCenter-api/getDates',
    method: 'post',
    data
  })
}
