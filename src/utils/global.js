/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
import $ from '@/assets/jquery-vendor'

export const tokenKeyName = 'evglToken'

export const baseUrl = process.env.baseUrl

// 域名 的url
export const doMainUrl = process.env.doMainUrl // 'wss://frp.creatorblue.com/sp/wss' //

export default {
  baseUrl,
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
  } else if ((activityType && activityType === '6' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconketangbiaoxian')) { // 课堂表现
    result = 'static/image/teaching_center/acitv_show.svg'
  } else if ((activityType && activityType === '8' && !activityPic) || (activityPic && activityPic === 'iconfont_svg iconqiandao')) { // 签到
    result = 'static/image/teaching_center/acitv_signin.svg'
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

    $('body').append($(xx))
    $('#loadingModal').modal('show')
  } else {
    $('#loadingModal').modal('hide')
    $('body #loadingModal').remove()
    $('.modal-backdrop').remove()
  }
}
