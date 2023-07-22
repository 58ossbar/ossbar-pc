import axios from '../../axios'

// 获取题库章节数据
export const queryTopChapter = data => {
  return axios({
    url: '/activity/testPaper/queryTopChapter',
    method: 'post',
    data
  })
}

// 根据章节ID获取章节信息，题目数量
export const loadChapters = params => {
  return axios({
    url: '/activity/testPaper/loadChapters',
    method: 'get',
    params
  })
}

// 存入选题
export const temporarySaveSession = data => {
  return axios({
    url: '/activity/testPaper/temporarySaveSession',
    method: 'post',
    data
  })
}

// 获取预览试卷
export const loadCombinationPaper = data => {
  return axios({
    url: '/activity/testPaper/loadCombinationPaper',
    method: 'post',
    data
  })
}

// 重选题目
export const randomQuestions = data => {
  return axios({
    url: '/activity/testPaper/randomQuestions',
    method: 'post',
    data
  })
}

// 删除题目
export const deleteQuestions = data => {
  return axios({
    url: '/activity/testPaper/deleteQuestions',
    method: 'post',
    data
  })
}

// 提交测试活动
export const saveTestPaperInfo = data => {
  return axios({
    url: '/activity/testPaper/saveTestPaperInfo',
    method: 'post',
    data
  })
}

// 编辑测试活动
export const updateTestPaperInfo = data => {
  return axios({
    url: '/activity/testPaper/updateTestPaperInfo',
    method: 'post',
    data
  })
}

// 获取作答题目信息
export const viewTestPaperInfo = data => {
  return axios({
    url: '/activity/testPaper/viewTestPaperInfo',
    method: 'post',
    data
  })
}

// 获取作答题目信息
export const examineList = data => {
  return axios({
    url: '/activity/testPaper/examine/list',
    method: 'post',
    data
  })
}

// 作答时轮询刷新
export const examinePreCommit = (dyId, data) => {
  return axios({
    url: '/activity/testPaper/examine/examinePreCommit/' + dyId,
    method: 'post',
    data
  })
}

// 作答时5s刷新
export const loadPaperTime = (dyId) => {
  return axios({
    url: '/activity/testPaper/examine/loadPaperTime/' + dyId,
    method: 'post'
  })
}

// 学员提交作答
export const examineCommit = (ctId, dyId, data) => {
  return axios({
    url: '/activity/testPaper/examine/examineCommit/' + dyId + '?ctId=' + ctId,
    method: 'post',
    data
  })
}

// 测试活动信息预览
export const queryTestPaper = (data) => {
  return axios({
    url: '/activity/testPaper/queryTestPaper',
    method: 'post',
    data
  })
}

// 所有学员答题信息查询
export const queryTraineeAnswerInfo = (data) => {
  return axios({
    url: '/activity/testPaper/examine/queryTraineeAnswerInfo',
    method: 'post',
    data
  })
}

// 学员答题试卷信息查询
export const examineResult = (data) => {
  return axios({
    url: '/activity/testPaper/examine/viewExamineResult',
    method: 'post',
    data
  })
}

// 给简答题打分
export const giveScore = (data) => {
  return axios({
    url: '/activity/testPaper/examine/giveScore',
    method: 'post',
    data
  })
}

// 重置学生做答
export const resetTestPaper = (data) => {
  return axios({
    url: '/activity/testPaper/resetTestPaper',
    method: 'post',
    data
  })
}

// 填空题 修正
export const saveScoreGapAmend = (data) => {
  return axios({
    url: '/activity/testPaper/saveScoreGapAmend',
    method: 'post',
    data
  })
}
