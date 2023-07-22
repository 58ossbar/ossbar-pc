/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
import $ from 'jquery'
import webSockets from '@/utils/webSockets'
import Vue from 'vue'
import router from '../router'

export const tokenKeyName = 'evglToken'

export const baseUrl = process.env.baseUrl

// webSocket连接的url
export const webSocketUrl = process.env.webSocketUrl // 'wss://frp.creatorblue.com/sp/wss' //
// 文件预览的url的url
export const filePreviewUrl = process.env.filePreviewUrl
// 心跳超时时间，单位：毫秒
export const heartbeatTimeout = 5000
// 重连间隔时间 单位：毫秒
export const reconnInterval = 5000
// 消息间隔显示时间，单位分钟
export const msgIntervalTime = 5

// 域名 的url
export const doMainUrl = process.env.doMainUrl // 'wss://frp.creatorblue.com/sp/wss' //

export default {
  baseUrl,
  webSocketUrl,
  filePreviewUrl,
  doMainUrl,
  tokenKeyName
}

/** 模式窗口下，滚动鼠标，背景页面  阻止 滚动 ，modalIsShow为true时时弹出显示，为false时关闭 */
export function preventBackgroundScrolling(modalIsShow = false) {
  if (modalIsShow) {
    localStorage.setItem('scrollTopByModal', document.scrollingElement.scrollTop)
    document.body.classList.add('dialog-open')
    document.body.style.top = -localStorage.getItem('scrollTopByModal') + 'px'
  } else {
    document.body.classList.remove('dialog-open')
    document.scrollingElement.scrollTop = localStorage.getItem('scrollTopByModal')
    document.body.style.top = ''
    localStorage.removeItem('scrollTopByModal')
  }
}

/** 根据 list 数组中某个 字段 propertyName  排序 */
export function sortListByProperty(list, propertyName) {
  // 排序规则
  const compare = function(property) {
    return function(a, b) {
      var value1 = a[property]
      var value2 = b[property]
      return value1 - value2
    }
  }
  // 根据 propertyName 来排序
  list = list.sort(compare(propertyName))
  return list
}

/** 对象数组 arr 根据 name 字段的值去重  */
export function objectArrRemoveRepeat(arr, name) {
  // 去重
  const obj = {}
  arr = arr.reduce(function(item, next) {
    obj[next[name]] ? '' : obj[next[name]] = true && item.push(next)
    return item
  }, [])
  return arr
}

/** 从 object 中 寻找 包含 以name 开头 的 字段   */
export function findKeyFromObject(object = {}, name = '') {
  const result = {
    keyArr: [],
    keyObject: {}
  }
  result.keyArr = Object.keys(object).filter(function(k) {
    return k.indexOf(name) === 0
  })
  result.keyObject = Object.keys(object).filter(function(k) {
    return k.indexOf(name) === 0
  }).reduce(function(newData, k) {
    newData[k] = object[k]
    return newData
  }, {})
  return result
}

/** 题目 中 根据题目 的类型  获取 背景颜色 */
export function getQuestionsTypeBgColor(questionsType) {
  let result = ''
  if (questionsType && (questionsType === '1' || contains(questionsType, '单选'))) {
    result = 'backg-color-9b30ff'
  } else if (questionsType && (questionsType === '2' || contains(questionsType, '多选'))) {
    result = 'bg_blue_light'
  } else if (questionsType && (questionsType === '3' || contains(questionsType, '判断'))) {
    result = 'backg-color-ffa328'
  } else if (questionsType && (questionsType === '4' || contains(questionsType, '简答'))) {
    result = 'backg-color-019fdd'
  } else if (questionsType && (questionsType === '5' || contains(questionsType, '填空'))) {
    result = 'backg-color-2ed5ac'
  } else if (questionsType && (questionsType === '6' || contains(questionsType, '复合'))) {
    result = 'backg-colo-ff5f19'
  }
  return result
}

/** 题目 中 根据题目 的难易程度  获取 背景颜色 */
export function getQuestionsComplexityBgColor(questionsComplexity) {
  let result = ''
  if (questionsComplexity && (questionsComplexity === '1' || questionsComplexity === '简单')) {
    result = 'backg-color-2ed5ac'
  } else if (questionsComplexity && (questionsComplexity === '2' || questionsComplexity === '普通')) {
    result = 'backg-color-59b4ff'
  } else if (questionsComplexity && (questionsComplexity === '3' || questionsComplexity === '困难')) {
    result = 'backg-colo-ff5f19'
  }
  return result
}

/**
 * 文件预览
 * fileSrc文件的src
 * fileName文件的名称，没有则为‘’
 * fileType文件的类型，是'video'还是'file'
 */
export function openFilePreview(fileSrc, fileName, fileType, isFromMessage = false, fileDownUrl = '') {
  let suffix = ''
  const lastIndex = fileSrc.lastIndexOf('.')
  if (lastIndex > -1) {
    suffix = fileSrc.substr(lastIndex)
  }
  if (fileType === 'video' && suffix && suffix.toLocaleUpperCase() === '.MP4') {
    Vue.prototype.$videoPreview(fileSrc)
  } else if (fileType === 'file' && suffix && (suffix.toLocaleUpperCase() === '.XLS' || suffix.toLocaleUpperCase() === '.XLSX') && !isFromMessage) {
    const openUrl = 'https://officeonline.superlib.com/op/embed.aspx?src=' + fileSrc
    window.open(openUrl, '_blank')
  } else if (fileType === 'file' && suffix && suffix.toLocaleUpperCase() === '.PDF') {
    const routeData = router.resolve({
      path: '/teachingr-detail/file-preview',
      query: {
        fileSrc: fileSrc,
        fileName: fileName
      }
    })
    const openUrl = routeData.href
    window.open(openUrl, '_blank')
  } else {
    // window.open(fileSrc, '_blank')
    const a = document.createElement('a')

    // let last = fileName.lastIndexOf('.')
    // if (last > -1) {
    //   a.download = fileName.substr(0, last) + suffix
    // } else {
    //   a.download = fileName
    // }

    a.href = (isFromMessage && fileDownUrl) ? (fileDownUrl) : (fileSrc)
    a.target = '_blank'
    a.click()

    // // 使用浏览器下载图片
    // var image = new Image()
    // image.setAttribute('crossOrigin', 'anonymous')
    // image.onload = function() {
    //   var canvas = document.createElement('canvas')
    //   canvas.width = image.width
    //   canvas.height = image.height
    //   var context = canvas.getContext('2d')
    //   context.drawImage(image, 0, 0, image.width, image.height)
    //   var url = canvas.toDataURL('image/png')
    //   var a = document.createElement('a')
    //   var event = new MouseEvent('click')
    //   a.download = 'photo'
    //   a.href = url
    //   a.dispatchEvent(event)
    // }
    // image.src = 'static/img/excel.jpg'
  }

  // let endArr = []
  // if (fileType === 'video') {
  //   endArr = ['.mp4']
  // } else if (fileType === 'file') {
  //   endArr = ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx']
  //   // ,'.jar','.tar','.gzip','.txt','.java','.php','.py','.js','.css','.jpg','.png','.jpeg', '.gif','.zip','.rar','.7z','.wps', '.rtf'
  // }
  // let isCanPreview = false
  // let lastIndex = fileSrc.lastIndexOf('.')
  // let suffix = ''
  // if (lastIndex > -1) {
  //   suffix = fileSrc.substr(lastIndex)
  // }
  // if (endArr && endArr.length > 0 && suffix) {
  //   for (let i = 0; i < endArr.length; i++) {
  //     if (suffix.toLocaleUpperCase() === endArr[i].toLocaleUpperCase()) {
  //       isCanPreview = true
  //       break
  //     }
  //   }
  // }
  // if (isCanPreview) {
  //   if (fileType === 'video') {
  //     Vue.prototype.$videoPreview(fileSrc)
  //   } else if (fileType === 'file') {
  //     // let routeData = router.resolve({
  //     //   path: '/teachingr-detail/file-preview',
  //     //   query: {
  //     //     fileSrc: encodeURIComponent(fileSrc)
  //     //   }
  //     // })
  //     // 'https://view.officeapps.live.com/op/view.aspx?src='
  //     let openUrl = 'https://officeonline.superlib.com/op/embed.aspx?src=' + fileSrc // routeData.href //
  //     window.open(openUrl, '_blank')
  //   }
  // } else { // 下载
  //   let a = document.createElement('a')
  //   a.href = fileSrc
  //   a.target = '_blank'
  //   a.download = fileName
  //   a.click()
  // }
}
/**
 * 判断是否以指定字符串结束
 */
export function endWith(str, sub) {
  let result = false
  if (str.slice(-sub.length) === sub) {
    result = true
  }
  return result
}

/**
 * 获取个人信息
 */
export function getUserInfo() {
  let userInfo = (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined') ? (JSON.parse(localStorage.getItem('userInfo'))) : {}
  if (!userInfo) {
    Vue.prototype.$api.login.getUser().then((resu) => {
      if (resu.code === 0) {
        localStorage.setItem('userInfo', JSON.stringify(resu.data)) // 保存用户到本地会话
        userInfo = resu.data
      } else if (resu.code === 500 && resu.msg === '未登陆') {
        router.push('/login')
        userInfo = {}
      }
      return userInfo
    }).catch(() => {
      userInfo = {}
      return userInfo
    })
  }
  return userInfo
}
/**
 * 弹出消息弹窗
 * @param param  参数
 * @param confirm  点击确定按钮的回调函数
 * @param cancel  点击取消按钮的回调函数
 */
export function msgCommModal(param, modalBtnAll, confirm, cancel) {
  const headerTitle = (param.modalHeaderTitle) ? (param.modalHeaderTitle) : ''
  const bodyTitle = (param.modalBodyTitle) ? (param.modalBodyTitle) : ''
  const bodyContent = (param.modalbodyContent) ? (param.modalbodyContent) : ''
  const bodyImg = (param.modalbodyImg) ? (param.modalbodyImg) : ''
  const msgModalType = param.msgModalType
  const index = $('body #app .msgModalComm').length
  const allIndex = $('body .modal-backdrop').length
  const id = 'msgModalComm' + index
  const confirmText = (param.confirmText) ? (param.confirmText) : '确定'
  // $('body #app #' + id).remove()
  let str = '<div class="modal fade msgModalComm ' + msgModalType + '" tabindex="-1" role="dialog" id="' + id + '" data-backdrop="static" data-keyboard="false" aria-labelledby="' + id + 'Label" aria-hidden="true">\n'
  str += '          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">\n' +
    '            <div class="modal-content">\n' +
    '              <div class="modal-header">\n'
  if (headerTitle) {
    str += '        <div class="modal-title" id="' + id + 'Title">' + headerTitle + '</div>\n'
  }
  str += '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                  <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '              </div>\n' +
    '              <div class="modal-body">\n'
  if (bodyImg) {
    str += '         <img class="activityImg" src="' + bodyImg + '" title="活动图片">\n'
  }
  if (bodyTitle) {
    str += '         <div class="activityTitle">' + bodyTitle + '</div>\n'
  }
  if (bodyContent) {
    if (msgModalType && msgModalType === 'stuModal') {
      str += '         <div class="hide_double">' + bodyContent + '</div>\n'
    } else {
      str += '         <div class="">' + bodyContent + '</div>\n'
    }
  }
  str += '         </div>\n'
  if (msgModalType && (msgModalType === 'stuModal' || msgModalType === 'alertModal')) {
    str += '       <div class="modal-footer">\n'
  }
  if (msgModalType && msgModalType === 'stuModal') {
    str += '         <button type="button" class="btn btn-outline-secondary btn-sm msgModalCommBtn cancel" data-dismiss="modal">取消</button>\n'
  }
  if (msgModalType && (msgModalType === 'stuModal' || msgModalType === 'alertModal')) {
    str += '         <button type="button" class="btn btn-outline-primary btn-sm msgModalCommBtn confirm">' + confirmText + '</button>\n' +
    '              </div>\n'
  }
  str += '       </div>\n' +
    '          </div>\n' +
    '        </div>'
  $('body #app').append($(str))
  $('#' + id).on('hide.bs.modal', function(e) {
    if (index === 0) {
      preventBackgroundScrolling(false)
    }
  })
  $('#' + id).on('show.bs.modal', function(e) {
    if (index === 0) {
      preventBackgroundScrolling(true)
    }
  })
  $('#' + id).modal('show')
  $('body .modal-backdrop').eq(allIndex).addClass('msgModalCommBackdrop')

  $('#' + id).on('show.bs.modal', function(e) {
    if (index - 1 >= 0) {
      $('body #app #msgModalComm' + (index - 1)).css('display', 'none')
      $('body .modal-backdrop').eq(index - 1).css('display', 'none')
    }
  })
  if (index - 1 >= 0) {
    $('body #app #msgModalComm' + (index - 1)).css('display', 'none')
    $('body .modal-backdrop').eq(index - 1).css('display', 'none')
  }
  $('#' + id).on('shown.bs.modal', function(e) {
    if (index - 1 >= 0) {
      $('body #app #msgModalComm' + (index - 1)).css('display', 'none')
      $('body .modal-backdrop').eq(index - 1).css('display', 'none')
    }
  })
  $('#' + id).on('hidden.bs.modal', function(e) {
    if (index - 1 >= 0) {
      $('body #app #msgModalComm' + (index - 1)).css('display', 'block')
      $('body .modal-backdrop').eq(index - 1).css('display', 'block')
    }
    $('body #app #' + id).remove()
    // if (index === 0) {
    //   $('body .modal-backdrop').remove()
    // }
    if (modalBtnAll) {
      modalBtnAll()
    }
  })
  if (msgModalType && (msgModalType === 'stuModal' || msgModalType === 'alertModal')) {
    $('#' + id).on('click', '.confirm', function() {
      if (confirm) {
        confirm()
      }
      $('#' + id).modal('hide')
    })
  }
  if (msgModalType && msgModalType === 'stuModal') {
    $('#' + id).on('click', '.cancel', function() {
      if (cancel) {
        cancel()
      }
      $('#' + id).modal('hide')
    })
  }
}

/**
 * 获取图片路径
 */
export function concatImgUrl(url) {
  if (url) {
    if (!contains(url, 'http') && !startWith(url, 'data:image/svg+xml,') && !startWith(url, 'iconfont') && !startWith(url, 'static/image/')) {
      url = baseUrl + url
    }
  }
  return url
}

/**
 * 根据 activityType 和 activityPic来 转换 图标
 * @param activityType
 * @param activityPic
 * @returns {string}
 */
export function getActivitySvg(activityType, activityPic) {
  var result = activityPic
  if ((activityType && activityType === '1' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconwenjuantiaocha')) { // 投票/问卷
    result = 'static/image/teaching_center/activ_wj.svg'
  } else if ((activityType && activityType === '2' && !activityPic) || (activityPic && activityPic === 'iconfont_svg icontounaosiwei')) { // 头脑风暴
    result = 'static/image/teaching_center/activ_tn.svg'
  } else if ((activityType && activityType === '3' && !activityPic) || (activityPic && (activityPic === 'iconfont_svg iconzhuanjiaxianshangdayi' || activityPic === 'iconfont_svg icondayitaolun'))) { // 答疑/讨论
    result = 'static/image/teaching_center/activ_dy.svg'
  } else if ((activityType && activityType === '4' && !activityPic) || (activityPic && activityPic === 'iconfont_svg icontestactivity')) { // 测试活动
    result = 'static/image/teaching_center/acitv_test.svg'
  } else if ((activityType && activityType === '5' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconxiaozumubiao')) { // 作业/小组任务
    result = 'static/image/teaching_center/activ_zy.svg'
  } else if ((activityType && activityType === '6' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconketangbiaoxian')) { // 课堂表现
    result = 'static/image/teaching_center/acitv_show.svg'
  } else if ((activityType && activityType === '7' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconzhibo')) { // 轻直播/讨论
    result = 'static/image/teaching_center/activ_tl.svg'
  } else if ((activityType && activityType === '8' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconqiandao')) { // 签到
    result = 'static/image/teaching_center/acitv_signin.svg'
  } else if ((activityType && activityType === '9' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconpracticeassessment')) { // 实践考核
    result = 'static/image/teaching_center/activ_kh.svg'
  }
  return result
}

// 去两端空格
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
// 去左边空格
export function lTrim(str) {
  return str.replace(/(^\s*)/g, '')
}
// 去右边空格
export function rTrim(str) {
  return str.replace(/(\s*$)/g, '')
}

/**
 * 日期按格式转换成字符串
 */
export function convertToString(date, pattern = 'yyyy-MM-dd HH:mm:ss') {
  const year = date.getFullYear()
  pattern = pattern.replace('yyyy', year)
  const month = date.getMonth() + 1
  pattern = pattern.replace('MM', addZero(month, 2))
  const d = date.getDate()
  pattern = pattern.replace('dd', addZero(d, 2))
  const h = date.getHours()
  pattern = pattern.replace('HH', addZero(h, 2))
  pattern = pattern.replace('hh', addZero(h > 12 ? (h - 1) : h, 2))
  const m = date.getMinutes()
  pattern = pattern.replace('mm', addZero(m, 2))
  const s = date.getSeconds()
  pattern = pattern.replace('ss', addZero(s, 2))
  return pattern
}

/**
 * 给指定字符串前、后补零
 * len:补零后的长度
 * pos :补零的位置，0为前，1为后
 */
export function addZero(str, len = 0, pos = 0) {
  str += ''
  while (str.length < len) {
    if (pos === 0) {
      str = '0' + str
    } else {
      str += '0'
    }
  }
  return str
}

/**
 * 过滤破万数值格式
 * @param {*} num 需要过滤格式的数值
 */
export function filterNumerical(num) {
  const tempNum = parseInt(num)
  if (tempNum / 10000 < 1) {
    return tempNum.toString()
  } else {
    const realVal = tempNum.toString().substring(0, tempNum.toString().length - 3)
    const temp = parseInt(realVal) / 10
    const str = temp + 'w'
    return str
  }
}

/** 将 日期格式换成 消息的时间 显示
 * 如果是 【当天】 则显示   【时分】  例如：09:04
 * 如果是【昨天或者前天】 则显示   【昨天或者前天 时分】 例如： 昨天 09:04
 * 如果是【当年】  则显示 【月日 时分】 例如：8月20日 21:04
 * 如果不是【当年】  则显示 【年月日 时分】 例如：2019年8月20日 21:04
 * 如果该消息与上一条消息 没有 5分钟间隔 则不显示
 * currTime 当前消息时间
 * isCompare 是否比较时间
 * LastTime 上一条消息时间
 * splitor 分隔符，如果没有则是中文的年月日
 * isHasMinu  如果不是当天是否添加时分
 */
export function getMsgTime(currTime, isCompare = false, LastTime = '', splitor = '', isHasMinu = true) {
  let result = ''

  if (isCompare && LastTime && ((new Date(currTime).getTime() - new Date(LastTime).getTime()) <= ((msgIntervalTime) * 60 * 1000))) {
    result = ''
  } else {
    var year = new Date(currTime).getFullYear()
    var month = addZeroPrefix(new Date(currTime).getMonth() + 1)
    var day = addZeroPrefix(new Date(currTime).getDate())
    var hour = addZeroPrefix(new Date(currTime).getHours())
    var minute = addZeroPrefix(new Date(currTime).getMinutes())
    // var second = addZeroPrefix(new Date(currTime).getSeconds())

    if (isToday(currTime)) { // 是今天
      result = hour + ':' + minute
    } else if (isLastDay(currTime, 1)) { // 是昨天
      result = (!isHasMinu) ? ('昨天') : ('昨天 ' + hour + ':' + minute)
    } else if (isLastDay(currTime, 2)) { // 是前天
      result = (!isHasMinu) ? ('前天') : ('前天 ' + hour + ':' + minute)
    } else if (isToYear(currTime)) { // 是当年
      if (splitor) {
        result = month + splitor + day + ((!isHasMinu) ? ('') : (splitor + hour + ':' + minute))
      } else {
        result = (!isHasMinu) ? (month + '月' + day + '日') : (month + '月' + day + '日 ' + hour + ':' + minute)
      }
    } else {
      if (splitor) {
        result = year + splitor + month + splitor + day + ((!isHasMinu) ? ('') : (splitor + hour + ':' + minute))
      } else {
        result = (!isHasMinu) ? (year + '年' + month + '月' + day + '日') : (year + '年' + month + '月' + day + '日 ' + hour + ':' + minute)
      }
    }
  }
  return result
}

/** 个位数 数字 前面追加0 */
export function addZeroPrefix(number) {
  return (((number || number === 0) && number < 10) ? '0' + number : number)
}
/** 判断是否是当年 */
export function isToYear(date) {
  return new Date(date).getFullYear() === new Date().getFullYear()
}
/** 判断是否是昨天还是前天
 * num为1是昨天，num为2是前天
 */
export function isLastDay(date, num) {
  var time = (new Date()).getTime() - (24 * 60 * 60 * 1000 * num)
  return new Date(date).toDateString() === new Date(time).toDateString()
}
/** 判断是否是今天 */
export function isToday(date) {
  return new Date(date).toDateString() === new Date().toDateString()
}

/**
 * 判断object对象{}是否不为空
 */
export function objectIsNotNull(object) {
  if (object && JSON.stringify(object) !== '{}') {
    return true
  } else {
    return false
  }
}

/**
 * Bytes 换算为比它最大一级的单位
 * @param bytes
 * @returns {string}
 */
export function bytesToConversionUnit(bytes) {
  let result = '0B'
  if (bytes) {
    var kb = (+bytes) / 1024 // parseInt(bytes) / 1024
    if (kb < 1) {
      result = bytes + 'B' // Bytes
    } else {
      var mb = kb / (1024)
      if (mb < 1) {
        result = kb.toFixed(2) + 'KB'
      } else {
        var gb = mb / (1024)
        if (gb < 1) {
          result = mb.toFixed(2) + 'MB'
        } else {
          var tb = gb / (1024)
          if (tb < 1) {
            result = gb.toFixed(2) + 'GB'
          } else {
            var pb = tb / (1024)
            if (pb < 1) {
              result = tb.toFixed(2) + 'TB'
            } else {
              var eb = pb / (1024)
              if (eb < 1) {
                result = pb.toFixed(2) + 'PB'
              } else {
                var zb = eb / (1024)
                if (zb < 1) {
                  result = eb.toFixed(2) + 'EB'
                } else {
                  var yb = zb / (1024)
                  if (yb < 1) {
                    result = zb.toFixed(2) + 'ZB'
                  } else {
                    result = yb.toFixed(2) + 'YB'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return result
}

/**
 * 判断是否包含指定字符串
 */
export function contains(str, sub) {
  let result = false
  if ((str) && (str.indexOf(sub) >= 0)) {
    result = true
  }
  return result
}

/**
 * 判断是否以指定字符串开头
 */
export function startWith(str1, sub) {
  let result = false
  if (str1 && str1.indexOf(sub) === 0) {
    result = true
  }
  return result
}

/**
 * 设置cookie
 * @param {*} name 名称
 * @param {*} value 具体的值
 * @param {*} expiredDay 过期天数,数值类型
 */
export function setCookie(value, expiredDay) {
  expiredDay = !expiredDay ? 7 : expiredDay
  const date = new Date()
  date.setDate(date.getDate() + expiredDay)
  document.cookie = tokenKeyName + '=' + escape(value) + ((expiredDay == null) ? '' : ';expires=' + date.toGMTString())
}

// /删除Cookie
export function delCookies() {
  var myDate = new Date()
  myDate.setTime(myDate.getTime() - 1000)// 设置时间
  var data = document.cookie
  var dataArray = data.split('; ')
  localStorage.removeItem('username')
  localStorage.removeItem('userimg')
  localStorage.removeItem('userInfo')// 保存用户到本地会话
  for (var i = 0; i < dataArray.length; i++) {
    var varName = dataArray[i].split('=')
    if (varName[0] === tokenKeyName || varName[0] === 'userInfo' /* || varName[0] == "token"*/) {
      document.cookie = varName[0] + "='';path=/;expires=" + myDate.toGMTString()
    }
  }
  localStorage.clear()
  // console.log(document.cookie)
  // if (webSockets.socketOpen) {
  webSockets.closeWebSocket()
  // }
}

// 将数据导出为Excel
export function export2Excel(header, val, tableData) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('../../static/creatorblue/vendor/Export2Excel')
    const tHeader = header // 对应表格输出的title
    const filterVal = val // 对应表格输出的数据
    const list = tableData
    const data = formatJson(filterVal, list)
    export_json_to_excel(tHeader, data, '列表excel') // 对应下载文件的名字
  })
}
// 将数据转为json
export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
// 提示框
export function toast(msg, cb) {
  const ss = '<div class="message-hint alert alert-info alert-dismissible fade show alertContent" role="alert">' +
    '      <div class="toast-text">' + msg + '</div>' +
    '    </div>'
  $('body #app').append($(ss))
  setTimeout(function() {
    $('.alert').alert('close')
    if (cb) {
      cb()
    }
  }, 3000)
}

export function alert(msg, funct) {
  const ss = '<div class="alert alert-info alert-dismissible fade show alertContent" role="alert">' +
    '      <strong>' + msg + '</strong>' +
    '      <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '        <span aria-hidden="true">&times;</span>' +
    '      </button>' +
    '    </div>'
  $('body #app').append($(ss))
  if (funct) {
    funct()
  }
  setTimeout(function() {
    $('.alert').alert('close')
  }, 2000)
}
export function confirm(msg, func) {
  $('body #app #exampleModalCenter').remove()
  const xx = '<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <h5 class="modal-title" id="exampleModalLongTitle">温馨提示：</h5>\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '          <span aria-hidden="true">&times;</span>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="modal-body">' + msg + '</div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary commit" >确定</button>' +
    '        <button type="button" class="btn btn-secondary" data-dismiss="modal" >取消</button>' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>'
  $('body #app').append($(xx))
  $('#exampleModalCenter').on('show.bs.modal', function() {
    preventBackgroundScrolling(true)
  })
  $('#exampleModalCenter').modal('show')
  $('#exampleModalCenter').on('hide.bs.modal', function() {
    preventBackgroundScrolling(false)
  })
  $('#exampleModalCenter').on('click', '.commit', function() {
    $('#exampleModalCenter').modal('hide')
    if (func) {
      func()
    }
    /* func()*/
  })
}
/** bootstrap4.0表单验证  通过   样式
 *  @param  feed 为文字提示的class或者id，例如 .js 、 # js
 *  @param  e 为input、select、textarea 标签的class或者id，例如 .js 、 # js
 *
 */
export function formVaildStyle(feed, e) {
  if (feed) {
    $(feed).css('display', 'none')
  }
  if (e === '#subjectTechnology') {
    $('.subjectTechnology').css('border', '1px solid #28a745')
  }
  if (e === '#starLevel' || e === '.imgShowSelect') {
    $('div[class$="HelpBlock"]').css('display', 'none')
    $('small[class$="HelpBlock"]').css('display', 'none')
  }
  $(e).addClass('cb-form-valid')// 清除合法状态
  $(e).removeClass('cb-form-invalid')// 添加非法状态
}
/** bootstrap4.0表单验证   不通过  样式
 *  @param  feed 为文字提示的class或者id，例如 .js 、 # js
 *  @param  e 为input、select、textarea 标签的class或者id，例如 .js 、 # js
 *  isinlineBlock 是否是行内
 */
export function formInVaildStyle(feed, e, isinlineBlock = false) {
  if (feed) {
    $(feed).css('display', isinlineBlock ? 'inline-block' : 'block')
  }
  if (e === '#subjectTechnology') {
    $('.subjectTechnology').css('border', '1px solid #dc3545')
  }
  if (e === '#starLevel' || e === '.imgShowSelect') {
    $('div[class$="HelpBlock"]').css('display', 'none')
    $('small[class$="HelpBlock"]').css('display', 'none')
  }
  $(e).removeClass('cb-form-valid')// 清除合法状态
  $(e).addClass('cb-form-invalid')// 添加非法状态
}
/**
 * @param zTreeId ztree对象的id,不需要#
 * @param searchField 输入框选择器
 * @param isHighLight 是否高亮,默认高亮,传入false禁用
 * @param isExpand 是否展开,默认合拢,传入true展开
 * @returns
 */
export function fuzzySearch(zTreeId, searchField, isHighLight, isExpand) {
  var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId) // 获取树对象
  if (!zTreeObj) {
    // alter('获取树对象失败')
    console.log('获取树对象失败')
    return false
  }
  var nameKey = zTreeObj.setting.data.key.name // 获取name属性的key
  isHighLight = isHighLight !== false// 除直接输入false的情况外,都默认为高亮
  isExpand = !!isExpand
  zTreeObj.setting.view.nameIsHTML = isHighLight// 允许在节点名称中使用html,用于处理高亮

  var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]' // js正则表达式元字符集
  var rexMeta = new RegExp(metaChar, 'gi')// 匹配元字符的正则表达式

  // 过滤ztree显示数据
  function ztreeFilter(zTreeObj, _keywords, callBackFunc) {
    if (!_keywords) {
      _keywords = '' // 如果为空，赋值空字符串
    }

    // 查找符合条件的叶子节点
    function filterFunc(node) {
      if (node && node.oldname && node.oldname.length > 0) {
        node[nameKey] = node.oldname // 如果存在原始名称则恢复原始名称
      }
      // node.highlight = false //取消高亮
      zTreeObj.updateNode(node) // 更新节点让之前对节点所做的修改生效
      if (_keywords.length === 0) {
        // 如果关键字为空,返回true,表示每个节点都显示
        zTreeObj.showNode(node)
        zTreeObj.expandNode(node, isExpand) // 关键字为空时是否展开节点
        return true
      }
      // 节点名称和关键字都用toLowerCase()做小写处理
      if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) !== -1) {
        if (isHighLight) { // 如果高亮，对文字进行高亮处理
          // 创建一个新变量newKeywords,不影响_keywords在下一个节点使用
          // 对_keywords中的元字符进行处理,否则无法在replace中使用RegExp
          var newKeywords = _keywords.replace(rexMeta, function(matchStr) {
            // 对元字符做转义处理
            return '\\' + matchStr
          })
          node.oldname = node[nameKey] // 缓存原有名称用于恢复
          // 为处理过元字符的_keywords创建正则表达式,全局且不分大小写
          var rexGlobal = new RegExp(newKeywords, 'gi')// 'g'代表全局匹配,'i'代表不区分大小写
          // 无法直接使用replace(/substr/g,replacement)方法,所以使用RegExp
          node[nameKey] = node.oldname.replace(rexGlobal, function(originalText) {
            // 将所有匹配的子串加上高亮效果
            var highLightText =
              '<span style="color: whitesmokebackground-color: darkred">' +
              originalText +
              '</span>'
            return highLightText
          })
          // ================================================//
          // node.highlight用于高亮整个节点
          // 配合setHighlight方法和setting中view属性的fontCss
          // 因为有了关键字高亮处理,所以不再进行相关设置
          // node.highlight = true
          // ================================================//
          zTreeObj.updateNode(node) // update让更名和高亮生效
        }
        zTreeObj.showNode(node)// 显示符合条件的节点
        return true // 带有关键字的节点不隐藏
      }

      zTreeObj.hideNode(node) // 隐藏不符合要求的节点
      return false // 不符合返回false
    }
    var nodesShow = zTreeObj.getNodesByFilter(filterFunc) // 获取匹配关键字的节点
    processShowNodes(nodesShow, _keywords)// 对获取的节点进行二次处理
  }

  /**
   * 对符合条件的节点做二次处理
   */
  function processShowNodes(nodesShow, _keywords) {
    if (nodesShow && nodesShow.length > 0) {
      // 关键字不为空时对关键字节点的祖先节点进行二次处理
      if (_keywords.length > 0) {
        $.each(nodesShow, function(n, obj) {
          var pathOfOne = obj.getPath()// 向上追溯,获取节点的所有祖先节点(包括自己)
          if (pathOfOne && pathOfOne.length > 0) { // 对path中的每个节点进行操作
            // i < pathOfOne.length-1, 对节点本身不再操作
            for (var i = 0; i < pathOfOne.length - 1; i++) {
              zTreeObj.showNode(pathOfOne[i]) // 显示节点
              zTreeObj.expandNode(pathOfOne[i], true) // 展开节点
            }
          }
        })
      } else { // 关键字为空则显示所有节点, 此时展开根节点
        var rootNodes = zTreeObj.getNodesByParam('level', '0')// 获得所有根节点
        $.each(rootNodes, function(n, obj) {
          zTreeObj.expandNode(obj, true) // 展开所有根节点
        })
      }
    }
  }

  // 监听关键字input输入框文字变化事件
  $(searchField).bind('input propertychange', function() {
    var _keywords = $(this).val()
    searchNodeLazy(_keywords) // 调用延时处理
  })

  var timeoutId = null
  // 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
  function searchNodeLazy(_keywords) {
    if (timeoutId) { // 如果不为空,结束任务
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(function() {
      ztreeFilter(zTreeObj, _keywords) // 延时执行筛选方法
      $(searchField).focus()// 输入框重新获取焦点
    }, 500)
  }
}
/** 正在加载中弹窗
*  @param  boolean 为true时显示弹窗，为false时关闭弹窗
*/
export function loadingModal(boolean, title = '正在加载中……', func) {
  if (boolean) {
    $('body #loadingModal').remove()
    const xx = '<div id="loadingModal" class="message-hint alert alert-info alert-dismissible fade show alertContent" role="alert">' +
      '      <div class="toast-text">' +
      '           <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>\n' +
      '            ' + title + '\n' +
       '     </div>' +
      '    </div>'
      // let xx = '<div class="modal fade" id="loadingModal" tabindex="-1" role="dialog"  aria-hidden="true"  data-backdrop="static" data-keyboard="false">\n' +
      // '      <div class="modal-dialog modal-dialog-centered" role="document">\n' +
      // '        <div class="modal-content">\n' +
      // '          <div class="modal-body">\n' +
      // '            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>\n' +
      // '            正在加载中……\n' +
      // '          </div>\n' +
      // '        </div>\n' +
      // '      </div>\n' +
      // '    </div>'

      // $('body #app').append($(xx))
    $('body').append($(xx))
    $('#loadingModal').modal('show')
  } else {
    $('#loadingModal').modal('hide')
    $('body #loadingModal').remove()
    $('.modal-backdrop').remove()
  }
}
