import axios from '../axios'

// 所属课程
export const getCurrentSubject = params => {
  return axios({
    url: 'questions-api/getCurrentSubject?subjectId=' + params,
    method: 'get'
  })
}

// 获取题目类型
export const getQuestionsType = params => {
  return axios({
    url: 'questions-api/getQuestionsType',
    method: 'get',
    params
  })
}

// 获取题目种类
export const getQuestionsStyle = params => {
  return axios({
    url: 'questions-api/getQuestionsStyle',
    method: 'get',
    params
  })
}

// 获取题目难易程度
export const getQuestionsComplexity = params => {
  return axios({
    url: 'questions-api/getQuestionsComplexity',
    method: 'get',
    params
  })
}

// 获取教材
export const getSubjects = params => {
  return axios({
    url: 'questions-api/getSubjects',
    method: 'get',
    params
  })
}

// 获取章节
export const getChapters = params => {
  return axios({
    url: 'questions-api/getChapters?subjectId=' + params,
    method: 'get'
  })
}

// 题目列表
export const query = params => {
  return axios({
    url: 'questions-api/queryQuestions',
    method: 'get',
    params
  })
}

// 新增题目
export const saveQuestion = data => {
  return axios({
    url: 'questions-api/saveQuestion',
    method: 'post',
    data
  })
}
// 新增 复合题 题目
export const saveCompositeQuestionInfo = data => {
  return axios({
    url: 'questions-api/saveCompositeQuestionInfo',
    method: 'post',
    data
  })
}

// 删除题目
export const deleteQuestion = id => {
  return axios({
    url: 'questions-api/deleteQuestion/' + id,
    method: 'get'
  })
}

// 禁用题目
export const forbiddenQuestions = data => {
  return axios({
    url: 'questions-api/forbiddenQuestions',
    method: 'post',
    data
  })
}

// 纠错 题目  点击纠错
export const errorCorrectionQuestions = questionsId => {
  return axios({
    url: 'questions-api/errorCorrectionQuestions?questionsId=' + questionsId,
    method: 'get'
  })
}

// 纠错 题目  点击提交按钮
export const confirmErrorCorrection = data => {
  return axios({
    url: 'questions-api/confirmErrorCorrection',
    method: 'post',
    data
  })
}

// 根据questionsId查询指定题目
export const viewQuestion = params => {
  return axios({
    url: 'questions-api/viewQuestion/' + params,
    method: 'get'
  })
}

/**
 * 根据条件查询章节
 * @param subjectId 教材ID
 * @param type 注意:该值一般不需要传,当key为type,且值为 withQuestions:会查询每个章节下对应的题目数量
 */
export const getMyChapters = params => {
  return axios({
    url: 'questions-api/getChapters',
    method: 'get',
    params
  })
}

/**
 *
 * @param subjectId 教材ID
 * @param chapterId 章节ID
 * @param questionsComplexity 题目难易
 * @param questionsType 题目类型
 */
export const toAddQuestions = data => {
  return axios({
    url: 'questions-api/toAddQuestions',
    method: 'post',
    data
  })
}

/**
 * 收藏或取消收藏题目
 * @param {}
 * @param questionsId 被收藏或取消收藏的题目ID
 * @param state Y收藏N取消收藏
 */
export const collectQuestions = params => {
  return axios({
    url: 'questions-api/collectQuestions',
    method: 'get',
    params
  })
}

/**
 * 根据条件查询试卷列表
 * @param {}
 */
export const queryTestPapers = params => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/queryTestPapers',
    method: 'get',
    params
  })
}

/**
 * 开始考试，获得试卷的题目信息
 */
export const startTheExam = data => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/startTheExam',
    method: 'post',
    data
  })
}

/**
 * 定时保存试卷库的考试
 */
export const paperCommit = (dyId, data) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/paperCommit/' + dyId,
    method: 'post',
    data
  })
}

/**
 * 定时获取考试时间
 */
export const loadPaperTime = (dyId) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/loadPaperTime/' + dyId,
    method: 'get'
  })
}

/**
 * 提交试卷库的考试
 */
export const saveReplyInformation = (dyId, data) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/saveReplyInformation/' + dyId,
    method: 'post',
    data
  })
}

/**
 * 根据试卷的创建时间进行搜索
 */
export const queryTime = params => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/queryTime',
    method: 'get',
    params
  })
}

/** 【试卷库】教师组卷 选题 点击查询 表格 题目数量 */
export const teacherGenerateTestPaper = params => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/teacherGenerateTestPaper',
    method: 'get',
    params
  })
}

/** 【试卷库】教师组卷 选题 点击开始答题或者组卷 触发此接口， 根据选择的题目数量，获取试卷的所有题目信息 */
export const generateTestPaperQuestionsRandom = (data) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/generateTestPaperQuestionsRandom',
    method: 'post',
    data
  })
}

/** 【试卷库】教师组卷预览界面  重选题目
 * oldQuestionsId、newQuestionsId
*/
export const randomQuestions = (params) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/randomQuestions',
    method: 'get',
    params
  })
}

/** 【试卷库】教师组卷预览界面   点击【保存试卷】按钮生成试卷信息 */
export const generateTestPaper = (data) => {
  return axios({
    url: 'teachingCenter-api/testPaperLibrary/generateTestPaper',
    method: 'post',
    data
  })
}

/**
 * 手动组卷（根据用户勾选的题目，进行组卷）
 * @param {*} data 数组，示例数据：['1', '2']
 * @returns
 */
export const generateTestPaperQuestionsManual = data => {
  return axios({
    url: '/teachingCenter-api/testPaperLibrary/generateTestPaperQuestionsManual',
    method: 'post',
    data
  })
}
