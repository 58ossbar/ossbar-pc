import axios from '../axios'
import $ from 'jquery'

export {
  myFunction,
  commitPaper,
  formatDate,
  getInputCheckLength
}

export const checkHas = (data) => {
  return axios({
    url: 'paperExamine/checkHas',
    method: 'post',
    data
  })
}

/**
 * 第一步，点击按钮，开始考试，进入试卷考试考核界面
 * @param data {isDynamic:'Y/N是否为动态试卷', paperId:'试卷ID', paperType:'值为1代表是教师组的卷，2为学员组的卷'}
 * @returns {*|Promise|Promise<any>}
 */
export const list = (data) => {
  data.isDynamic = 'N'
  return axios({
    url: 'paperExamine/list',
    method: 'post',
    data
  })
}

/**
 * 第一步，进入试卷答题页面请求一次即可，用途:每隔30秒保存之后 如果用户断网或者其他操作能够将用户先前的数据回显出来
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export const loadHistoryPaperInfo = (id) => {
  return axios({
    url: 'paperExamine/loadHistoryPaperInfo/' + id,
    method: 'post'
  })
}

/**
 * 第二步，从系统加载试卷的最终时间
 * @param id
 * @returns {*|Promise|Promise<any>}
 */
export const loadPaperTime = (id) => {
  return axios({
    url: 'paperExamine/loadPaperTime/' + id,
    method: 'post'
  })
}

/**
 * 第二步， 每隔30秒提交一次题目答案 需要传递题目号
 * @param data [{questionsId:'', questionsNum:'', questionsScore:'', replyId:''}]
 * @param id
 * @returns {*|Promise|Promise<any>}
 */
export const examinePreCommit = (data, id) => {
  return axios({
    url: 'paperExamine/examinePreCommit/' + id,
    method: 'post',
    data
  })
}

/**
 * 第三步，最终提交试卷
 * @param data [{questionsId:'', questionsNum:'', questionsScore:'', replyId:''}]
 * @param dyId
 * @returns {*|Promise|Promise<any>}
 */
export const finishExamineCommit = (data, dyId) => {
  return axios({
    url: 'paperExamine/examineCommit/' + dyId,
    method: 'post',
    data
  })
}

/**
 * 试卷结算结果
 * @param dyId
 * @returns {*|Promise|Promise<any>}
 */
export const examineResult = (dyId) => {
  return axios({
    url: 'paperExamine/examineResult/' + dyId,
    method: 'post'
  })
}

function myFunction(data) {
  return data
}

/**
 * 组装用户作答的数据，
 * 返回的数据格式:[{questionsId:'当前题目', questionsNum:'题目编号', questionsScore:'题目得分', replyId:'用户选择的该题目的选项ID'}]
 * @returns {Array}
 */
function commitPaper() {
  const paperArrays = []
  document.querySelectorAll('.quesBox').forEach(ele => {
    // 题目ID
    const questionsId = ele.getAttribute('id')
    const questionsNumHTML = document.getElementById(questionsId + '_questionsNum')
    // 题目编号
    const questionsNum = questionsNumHTML.innerText.substring(0, 1)
    // 每题得分
    const questionsScoreHTML = document.getElementById(questionsId + '_questionsScore')
    const questionsScore = questionsScoreHTML.getAttribute('questionsScore')
    // 选择的答案多个逗号隔开
    let replyId = ''
    const divs = ele.querySelectorAll('.iradio_flat-green')
    divs.forEach(a => {
      const inputs = a.querySelectorAll('input')
      inputs.forEach(input => {
        if (input.checked) {
          replyId += input.id + ','
        }
      })
    })
    const paperScore = {
      questionsId: questionsId,
      questionsNum: questionsNum,
      questionsScore: questionsScore,
      replyId: replyId.substring(0, replyId.length - 1)
    }
    paperArrays.push(paperScore)
  })
  return paperArrays
}

/**
 * 获取用户已作答的题目数量
 * @returns {number}
 */
function getInputCheckLength() {
  let length = 0
  /*
  let ele = document.querySelectorAll(".changebox");
  if (ele) {
    ele.forEach(item => {
      let inputs = item.querySelectorAll("input");
      if (inputs) {
        inputs.forEach(input => {
          if (input.checked) {
            length ++;
          }
        })
      }
    })
  }
  */

  $('.changebox').each(function() {
    if ($(this).find('input').is(':checked') === true) {
      length++
    }
  })
  return length
}

/**
 * 将时间转为 HH:mm:ss 格式
 * @param time 时间戳如46511245
 */
function formatDate(leftTime) {
  if (!leftTime || leftTime === 'null' || undefined === leftTime) {
    return '00:00:00'
  }
  let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10) // 计算剩余的分钟
  let minutes = parseInt(leftTime / 1000 / 60 % 60, 10) // 计算剩余的分钟
  let seconds = parseInt(leftTime / 1000 % 60, 10) // 计算剩余的秒数
  minutes = checkTime(minutes)
  seconds = checkTime(seconds)
  hours = checkTime(hours)
  return hours + ':' + minutes + ':' + seconds
}

// 将0-9的数字前面加上0，例1变为01
function checkTime(i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

export const test = (data) => {
  return axios({
    url: 'teachingCenter-api/savePkg',
    method: 'post',
    data
  })
}

