/**
 * 使用 WebSocket技术 进行通讯
 */
import {webSocketUrl, msgCommModal, getUserInfo, heartbeatTimeout, reconnInterval, toast, startWith, concatImgUrl, bytesToConversionUnit, objectIsNotNull, getActivitySvg} from '@/utils/global'
import router from '../router'
import Vue from 'vue'
let webSockets = {
  socketOpen: false, // WebSocket 连接是否 打开
  closeSocket: false, // 是否关闭 WebSocket 连接
  socketMsgQueue: [], // WebSocket 连接 发送消息数组
  receivedMsgData: null, // 收到的消息 数据
  webSocketBusitypeList: [
    '/public/chatlist', // 获取消息主界面列表数据  0
    '/privatechat/send', // 私聊发送消息   friendType为1私聊为2群聊  1
    '/privatechat/list', // 获取私聊历史消息  privatechat  2
    '/public/tagReaded', // 聊天列表消息标记为已读  3
    '/groupchat/send', // 群聊发送消息   4
    '/groupchat/list', // 群聊 获取历史消息  groupchat  5
    '/answerdiscusschat/send', // 答疑讨论发送消息  6
    '/answerdiscusschat/list', // 答疑讨论 获取历史消息  dytl 7
    '/classroomchat/send', // 课堂  发送消息  8
    '/classroomchat/list', // 课堂 获取历史消息 classroom  9
    '/classroomchat/bindGroup', // 扫码加入课堂成功后调用 10
    'activity', // 活动开始成功后在 所有页面 显示 弹窗 11
    'system', // 公告类型的 消息 在 所有页面 显示 弹窗 12
    'alert', // 提示类型的 消息 在 所有页面 显示 弹窗 13
    'numbers/get', // 是否有新消息，有则显示小红点  14
    'joinclassroom', // 这个消息 表示有人申请加入我创建的课堂 用于刷新成员列表   15
    'joinclassroomsuccess', // 当申请加入某个课堂时  这个消息表示课堂创建者“通过”了我的申请 用于刷新我学的课以及课堂列表   16
    'joinclassroomunsuccess', // 当申请加入某个课堂时  这个消息表示课堂创建者“不通过”了我的申请 用于刷新我学的课以及课堂列表   17
    'reloadmsglist', // 开始课堂，当别人创建课堂选择班级时我刚好在那个班级里面，此时会多一个课堂群 用于刷新消息列表   18
    'removeoutroom', // 当我被移出课堂时 用于我学的课以及课堂列表，并且当我在该课堂里面时此时会回到首页(消息列表是否刷新)   19
    'reloadresource', // 当pc端在资源树新增节点时以及设置学员是否可见  用于刷新小程序资源列表   20
    'reloadrescontent', // 当pc端在章节里面编辑内容以及创建分组时  用于刷新小程序章节列表   21
    'reloadactivity', // 当pc端更换版本时  用于刷新学生端活动列表   22
    'reloadactlist', // 结束活动时 刷新当前活动列表，如果在该活动里面则回到活动列表 23
    'endclassroom', // 结束课堂时 刷新当前活动列表，如果在该活动里面则回到活动列表，刷新首页和课堂模块列表 24
    'reloadtchsignlist', // 学生签到后 刷新 老师的学员签到情况列表页  25
    'fastanswertrainee', // 学生点击抢答按钮 进行 抢答，老师进入抢答列表页，刷新该页面  26
    'refreshTestPaperData', // 学生点击提交按钮提交测试活动，老师在测试活动结果列表页 ，刷新该页面  27
    'public/setTop', // 消息列表 置顶   刷新消息列表 28
    'public/cancelTop', // 消息列表 取消置顶  刷新消息列表  29
    'public/delChatList', // 消息列表 从会话列表中移除  刷新消息列表  30

  ], // busitype列表数组
  pageObjNameList: [ // WebSocket连接 当前页面的name
    'messageListPage', // 消息列表页
    'messageDetailPage' // 聊天列表页
  ],
  /**
   * 接收后端返回的数据，处理 返回的消息数据
   * @param res
   */
  onMessage (res) {
    let that = this
    if (!res.data) {
      return false
    }
    that.lastInteractionTime(new Date().getTime())
    let resData = ((res.data) && (typeof (res.data) === 'string') && (!startWith(res.data, '<'))) ? (JSON.parse(res.data)) : (res.data)
    // console.log('resData：', resData)
    let busitypeIndexNew = -1
    let userInfo = getUserInfo()
    if (resData.code === 0) {
      if (resData.data && resData.data.busitype && this.webSocketBusitypeList && this.webSocketBusitypeList.length > 0) {
        for (let i = 0; i < this.webSocketBusitypeList.length; i++) {
          if (this.webSocketBusitypeList[i] === resData.data.busitype) {
            busitypeIndexNew = i
            break
          }
        }
      }
      if (busitypeIndexNew === 0) {
        if (resData.data && resData.data.msg && resData.data.msg.length > 0) {
          let msg = resData.data.msg
          for (let i = 0; i < msg.length; i++) {
            msg[i].isIconalbb = false
            if (startWith(msg[i].img, 'iconfont')) {
              msg[i].isIconalbb = true
            }
            msg[i].update_old_time = msg[i].update_time
            msg[i].img = concatImgUrl(msg[i].img)
            msg[i].img = getActivitySvg(null, msg[i].img)
          }
        }
      } else if (busitypeIndexNew === 2 || busitypeIndexNew === 5 || busitypeIndexNew === 7 || busitypeIndexNew === 9) {
        if (resData.data && resData.data.msg && resData.data.msg.length > 0) {
          let msg = resData.data.msg
          for (let i = 0; i < msg.length; i++) {
            if (msg[i].msg_type === 'voice' || msg[i].msg_type === 'video' || msg[i].msg_type === 'file' || msg[i].msg_type === 'image') {
              msg[i].msg_content = concatImgUrl(msg[i].msg_content)
            }
            if (msg[i].msg_type === 'video') {
              msg[i].first_capture_access_url = concatImgUrl(msg[i].first_capture_access_url)
            }
            if (msg[i].file_size) {
              msg[i].file_size = bytesToConversionUnit(msg[i].file_size)
            }
            msg[i].send_time_old = msg[i].send_time
            msg[i].send_img = concatImgUrl(msg[i].send_img)
            msg[i].receive_img = concatImgUrl(msg[i].receive_img)
            msg[i].isPlayed = false
            msg[i].isMy = (msg[i].send_id === userInfo.traineeId)
          }
        }
      } else if (busitypeIndexNew === 1 || busitypeIndexNew === 4 || busitypeIndexNew === 6 || busitypeIndexNew === 8) {
        if (resData.data && resData.data.msg && objectIsNotNull(resData.data.msg)) {
          let msg = resData.data.msg
          let obj = Object.assign({}, msg)
          if (obj.msg_type === 'voice' || obj.msg_type === 'video' || obj.msg_type === 'file' || obj.msg_type === 'image') {
            obj.msg_content = concatImgUrl(obj.msg_content)
          }
          if (obj.msg_type === 'video') {
            obj.first_capture_access_url = concatImgUrl(obj.first_capture_access_url)
          }
          if (obj.file_size) {
            obj.file_size = bytesToConversionUnit(obj.file_size)
          }
          obj.send_time_old = obj.send_time
          obj.send_img = concatImgUrl(obj.send_img)
          // obj.receive_img = concatImgUrl(obj.receive_img)
          obj.isPlayed = false
          obj.isMy = (obj.send_id === userInfo.traineeId)

          if (obj.receiveChatMap && obj.receiveChatMap.length > 0) { // 处理 被删除的 消息列表  别人又发送消息过来就 要在消息列表加上 该消息
            obj.receiveChatMap.forEach((item,index) => {
              item.isIconalbb = false
              if (startWith(item.img, 'iconfont')) {
                item.isIconalbb = true
              }
              item.update_old_time = item.update_time
              item.img = concatImgUrl(item.img)
              item.img = getActivitySvg(null, item.img)
            });
          }

          resData.data.msg = []
          resData.data.msg.push(obj)
        }
      } else if (busitypeIndexNew === 11) {
        if (resData.data && resData.data.msg && objectIsNotNull(resData.data.msg)) {
          let msg = resData.data.msg
          let obj = Object.assign({}, msg)
          /** activityType的值来区别 1投票问卷2头脑风暴3答疑讨论5作业/小组任务6课堂表现7轻直播/讨论8签到   4测试活动 */
          // if (!obj.activity_pic) {
          //   obj.activity_pic = getActivitySvg(obj.activity_type, null)
          // }
          obj.activity_pic = getActivitySvg(obj.activity_type, obj.activity_pic)
          obj.isIconalbb = false
          if (startWith(obj.activity_pic, 'iconfont')) {
            obj.isIconalbb = true
          }
          obj.show = true
          obj.msgModalType = 'stuModal'
          obj.modalBodyTitle = obj.activity_title
          obj.modalbodyContent = obj.content
          obj.activity_pic = concatImgUrl(obj.activity_pic)
          if (obj.activity_type && obj.activity_type === '6') {
            obj.confirmText = '抢答'
          }
          obj.modalbodyImg = obj.activity_pic
          resData.data.msg = []
          resData.data.msg.push(obj)
          // 显示弹窗
          if (router.history.current.path !== '/teachingr-detail/file-preview') {
            msgCommModal(obj, function () {}, function () {
              if (obj.msgModalType && obj.msgModalType === 'stuModal') {
                that.activityMsgModalConfirm(obj)
              }
            }, function () {})
          }
        }
      } else if (busitypeIndexNew === 12) {
        if (resData.data && resData.data.msg && objectIsNotNull(resData.data.msg)) {
          let msg = resData.data.msg
          let obj = Object.assign({}, msg)
          obj.show = true
          obj.msgModalType = 'noticeModal'
          obj.modalHeaderTitle = obj.title
          obj.modalbodyContent = obj.content
          if (!obj.content) {
            obj.modalbodyContent = obj.title
            obj.modalHeaderTitle = '提示：'
          }
          resData.data.msg = []
          resData.data.msg.push(obj)
          // 显示弹窗
          if (router.history.current.path !== '/teachingr-detail/file-preview') {
            msgCommModal(obj, function () {}, function () {
              if (obj.msgModalType && obj.msgModalType === 'stuModal') {
                that.activityMsgModalConfirm(obj)
              }
            }, function () {})
          }
        }
      } else if (busitypeIndexNew === 13 || busitypeIndexNew === 15 || busitypeIndexNew === 16 || busitypeIndexNew === 17 || busitypeIndexNew === 18 || busitypeIndexNew === 19 || busitypeIndexNew === 23 || busitypeIndexNew === 24 || busitypeIndexNew === 25 || busitypeIndexNew === 27) {
        if (resData.data && resData.data.msg && objectIsNotNull(resData.data.msg)) {
          let msg = resData.data.msg
          let obj = Object.assign({}, msg)
          obj.show = true
          obj.msgModalType = 'alertModal'
          obj.modalHeaderTitle = obj.title
          obj.busitypeIndexNew = busitypeIndexNew
          obj.modalbodyContent = obj.content
          if (!obj.content) {
            obj.modalbodyContent = obj.title
            obj.modalHeaderTitle = '提示：'
          }
          resData.data.msg = []
          resData.data.msg.push(obj)
          if (obj.modalbodyContent) {
            // 显示弹窗
            if (router.history.current.path !== '/teachingr-detail/file-preview') {
              if (busitypeIndexNew === 19) {
                msgCommModal(obj, function () {}, function () {
                  if (obj.msgModalType && obj.msgModalType === 'stuModal') {
                    that.activityMsgModalConfirm(obj)
                  }
                }, function () {})
              } else if (busitypeIndexNew === 23 || busitypeIndexNew === 24) {
                if (obj.ctId && localStorage.getItem('ct_id') && localStorage.getItem('ct_id') === obj.ctId && (busitypeIndexNew === 24 || (busitypeIndexNew === 23 && localStorage.getItem('activityInfoByClassRomm') && localStorage.getItem('activityInfoByClassRomm') !== undefined && JSON.parse(localStorage.getItem('activityInfoByClassRomm')) && JSON.parse(localStorage.getItem('activityInfoByClassRomm')).activityId && obj.activityId && (obj.activityId === JSON.parse(localStorage.getItem('activityInfoByClassRomm')).activityId)))) {
                  msgCommModal(obj, function () {}, function () {
                    if (obj.msgModalType && obj.msgModalType === 'stuModal') {
                      that.activityMsgModalConfirm(obj)
                    }
                    //  else if (obj.msgModalType && obj.msgModalType === 'alertModal' && obj.busitypeIndexNew === 19) {
                    //   that.removeClassRoomModalConfirm(obj)
                    // }
                  }, function () {})
                } else {
                  Vue.prototype.$notify({
                    title: '消息',
                    message: obj.modalbodyContent,
                    type: 'success',
                    offset: 100,
                    position: 'bottom-right'
                  })
                }
              } else {
                Vue.prototype.$notify({
                  type: 'success',
                  title: '消息',
                  message: obj.modalbodyContent,
                  offset: 100,
                  position: 'bottom-right'
                })
 
                // msgCommModal(obj, function () {}, function () {
                //   if (obj.msgModalType && obj.msgModalType === 'stuModal') {
                //     that.activityMsgModalConfirm(obj)
                //   }
                //   //  else if (obj.msgModalType && obj.msgModalType === 'alertModal' && obj.busitypeIndexNew === 19) {
                //   //   that.removeClassRoomModalConfirm(obj)
                //   // }
                // }, function () {})
              }
            }
          }
        }
      } else if (busitypeIndexNew === 14) {
        if (resData.data && resData.data.msg && objectIsNotNull(resData.data.msg)) {
          let msg = resData.data.msg
          let obj = Object.assign({}, msg)
          resData.data.msg = []
          resData.data.msg.push(obj)
        }
      }
    }
    if (resData.code !== 0) {
      if (resData.msg) {
        toast(resData.msg)
      }
    }
    resData.busitypeIndex = that.busitypeIndex
    resData.busitypeIndexNew = busitypeIndexNew
 
    that.receivedMsgData = resData
    that.onMessageBack()
    window.eventBus.$emit('eventBusReceivedMsgData', resData)
  },
  /**
   * 设置参数
   * @param pageObj
   * @param option
   */
  setInit (pageObj, option) {
    this.pageObj = pageObj // 相当于 调用该js的页面的this对象
    this.url = (option && option.url) ? (option.url) : webSocketUrl // 路径
    if (option && option.paramStr) {
      this.url += '?' + option.paramStr
      this.reconnUrl = this.url + '&'
    } else {
      this.reconnUrl = this.url + '?'
    }
    this.reconnUrl += 'tiows_reconnect=true' // 重新连接url
    this.heartbeatTimeout = (option && option.heartbeatTimeout) ? (option.heartbeatTimeout) : heartbeatTimeout// 心跳超时时间
    this.reconnInterval = (option && option.reconnInterval) ? (option.reconnInterval) : reconnInterval// 重连间隔时间
    this.messageDataAll = (option && option.messageDataAll) ? (option.messageDataAll) : []
    this.init()
  },
  /**
   * 初始化 数据以及 连接，只调用一次
   */
  init () {
    this.socketMsgQueue = [] // WebSocket 连接 发送消息数组
    this.initWebSocket()
    this.lockReconnect = false // WebSocket 连接 是否重新连接
    this.heartbeatSendInterval = this.heartbeatTimeout / 2
  },
  /**
   * 初始化 WebSocket
   * @param isReconn
   */
  initWebSocket (isReconn) {
    this.closeWebSocket()
    let _url = this.url
    if (isReconn) {
      _url = this.reconnUrl
      // this.closeWebSocket()
    }
    this.socketOpen = false // WebSocket 连接是否 打开
    this.closeSocket = false // 是否关闭 WebSocket 连接
    this.isClosePing = false // 是否关闭心跳以及重连
    if (process.env.NODE_ENV === 'production') {
      this.isClosePing = false
    } else {
      this.isClosePing = false
    }
    let that = this
    if (typeof WebSocket === 'undefined') {
      toast('您的浏览器不支持WebSocket')
      return false
    }
    this.ws = new WebSocket(_url)
    // 监听 WebSocket 连接打开事件
    this.ws.onopen = function () {
      that.socketOpen = true
      that.lastInteractionTime(new Date().getTime())
      for (let i = 0; i < that.socketMsgQueue.length; i++) {
        that.sendSocketMessage(that.socketMsgQueue[i], true)
      }
      that.socketMsgQueue = []
      if (!that.isClosePing) {
        if (that.pingIntervalId) {
          clearInterval(that.pingIntervalId)
        }
        that.pingIntervalId = setInterval(function () {
          that.ping(that)
        }, that.heartbeatSendInterval)
      }
    }
    // 监听 WebSocket 接受到服务器的消息事件
    this.ws.onmessage = function (res) {
      that.onMessage(res)
    }
    // 监听 WebSocket 连接关闭事件
    this.ws.onclose = function () {
      // if (!that.closeSocket) {
      //   if (!that.isClosePing) {
      //     that.reconn()
      //   }
      // }
    }
    // 监听 WebSocket 错误事件
    this.ws.onerror = function (err) {
      if (!that.closeSocket) {
        if (!that.isClosePing) {
          that.reconn()
        }
      }
    }
  },
  /**
   * 通过 WebSocket 连接发送数据。需要先 connectSocket，并在 onSocketOpen 回调之后才能发送
   * @param params
   * @param isNotOne
   * @returns {boolean}
   */
  sendSocketMessage (params, isNotOne) {


    let msg = params;
    if (!isNotOne) {
      this.busitypeIndex = params.busitypeIndex // 对应webSocketBusitypeList 列表 的下标
      let data = {
        busitype: this.webSocketBusitypeList[this.busitypeIndex],
        msgtype: 'text',
        msg: {
          touser: (params.touser) ? (params.touser) : '', // 发送人
          toparty: (params.toparty) ? (params.toparty) : '', // 发送群
          pkgId: (params.pkgId) ? (params.pkgId) : '' // 答疑讨论需要pkgid
        }
      }
      if (params && params.msgtype === 'voice') { // 语音消息
        data.msgtype = 'voice'
        data.msg.msgtype = 'voice'
        data.msg.voice = {
          media_id: (params.mediaId) ? (params.mediaId) : ''
        }
      } else if (params && params.msgtype === 'video') { // 视频消息
        data.msgtype = 'video'
        data.msg.msgtype = 'video'
        data.msg.video = {
          media_id: (params.mediaId) ? (params.mediaId) : '',
          title: (params.title) ? (params.title) : '', // 视频消息的标题
          description: (params.description) ? (params.description) : '' // 视频消息的描述
        }
      } else if (params && params.msgtype === 'file') { // 文件消息
        data.msgtype = 'file'
        data.msg.msgtype = 'file'
        data.msg.file = {
          media_id: (params.mediaId) ? (params.mediaId) : ''
        }
      } else if (params && params.msgtype === 'image') { // 图片消息
        data.msgtype = 'image'
        data.msg.msgtype = 'image'
        data.msg.image = {
          media_id: (params.mediaId) ? (params.mediaId) : ''
        }
      } else if (params && params.msgtype === 'text') { // 文本消息
        data.msgtype = 'text'
        data.msg.msgtype = 'text'
        data.msg.text = {
          content: (params.content) ? (params.content) : ''
        }
        if (this.busitypeIndex === 4) {
          data.msg.fromuser = (params.fromuser) ? (params.fromuser) : ''
        }
      } else { // 其他
        data.msgtype = 'other'
        data.msg.lastid = (params.lastid) ? (params.lastid) : '' // 分页参数：上一次拉取到的最后一条记录的主键id
        if (this.busitypeIndex === 3 || this.busitypeIndex === 10 || this.busitypeIndex === 28 || this.busitypeIndex === 29 || this.busitypeIndex === 30) {
          data.msg = params.msg
        }
        if (this.busitypeIndex === 11) {
          data.msg.activityType = (params.activityType) ? (params.activityType) : ''
        }
        if (this.busitypeIndex === 0) {
          data.msg.nopage =  'Y'; // 不需要分页
          data.msg.ctId = (params.ctId) ? (params.ctId) : ''
          data.msg.name = (params.name) ? (params.name) : ''
        }
        data.msg.msgtype = 'other'
      }
      msg = JSON.stringify(data)
    }
    // this.ws.readyState   0 连接尚未建立，1连接已经建立，2 连接正在关闭，3连接已经关闭或不可用
    if (this.ws && this.ws.readyState && this.ws.readyState == 1) { //  this.socketOpen
      this.ws.send(msg)
    } else {
      this.socketMsgQueue.push(msg)

      // core.dialogUtil.showToast({title:'连接失败，暂不可发送消息'});
      this.reconn();
    }
  },
  /**
   * 重新连接
   */
  reconn () {
    if (this.lockReconnect) {
      return false
    }
    if (!this.closeSocket) {
      this.lockReconnect = true
      let that = this
      if (that.reconnTimeoutId) {
        clearTimeout(that.reconnTimeoutId)
      }
      that.reconnTimeoutId = setTimeout(() => {
        // that.closeWebSocket()
        that.initWebSocket(true)
        this.lockReconnect = false
      }, this.reconnInterval)
    }
  },
  /**
   * 调用 关闭连接方法 真正关闭连接
   */
  closeWebSocket () {
    this.closeSocket = true
    if (this.ws) {
      this.ws.close()
    }
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId)
    }
    if (this.reconnTimeoutId) {
      clearTimeout(this.reconnTimeoutId)
    }
  },
  /**
   * 获取 上一次发送消息的 时间
   * @returns {any}
   */
  lastInteractionTime () {
    if (arguments.length === 1) {
      this.lastInteractionTimeValue = arguments[0]
    }
    return this.lastInteractionTimeValue
  },
  /**
   * 发心跳
   */
  ping () {
    var iv = new Date().getTime() - this.lastInteractionTime() // 已经多久没发消息了
    // 单位：秒
    if ((this.heartbeatSendInterval + iv) >= this.heartbeatTimeout) {
      this.sendSocketMessage('1', true)
    }
  },
  /**
   * 活动类消息弹窗点击确定按钮后进入活动详情 的处理函数
   */
  activityMsgModalConfirm (currObj) {
    if (currObj) {
      localStorage.setItem('classname', currObj.name) // 课堂名称
      localStorage.setItem('class_id', currObj.classId) // 班级主键
      localStorage.setItem('subjectId', currObj.subjectId) // 教材主键
      localStorage.setItem('ct_id', currObj.ct_id) // 课堂主键
      localStorage.setItem('pkgId', currObj.pkgId) // 教学包主键
      localStorage.setItem('isShowActivityState', true)
 
      localStorage.setItem('isShowActMsgModal', 'true')
 
      localStorage.setItem('isFromMsgCommModal', 'true')
      let activity = {
        activityBeginTime: (currObj.activity_begin_time) ? (currObj.activity_begin_time) : '',
        activityEndTime: (currObj.activity_end_time) ? (currObj.activity_end_time) : '',
        activityId: (currObj.activity_id) ? (currObj.activity_id) : '',
        activityPic: (currObj.activity_pic) ? (currObj.activity_pic) : '',
        activityState: '1',
        activityTitle: (currObj.activity_title) ? (currObj.activity_title) : '',
        activityType: (currObj.activity_type) ? (currObj.activity_type) : '',
        activityTypeName: (currObj.activity_type_name) ? (currObj.activity_type_name) : '',
        answerNumber: (currObj.answer_number) ? (currObj.answer_number) : '',
        chapterId: (currObj.chapter_id) ? (currObj.chapter_id) : '',
        createTime: (currObj.create_time) ? (currObj.create_time) : '',
        createUserId: (currObj.create_user_id) ? (currObj.create_user_id) : '',
        empiricalValue: (currObj.empirical_value) ? (currObj.empirical_value) : '',
        hasBeenDone: (currObj.hasBeenDone) ? (currObj.hasBeenDone) : false,
        hasPermission: (currObj.hasPermission) ? (currObj.hasPermission) : false,
        isCreator: (currObj.isCreator) ? (currObj.isCreator) : false,
        pkgId: (currObj.pkg_id) ? (currObj.pkg_id) : '',
        purpose: (currObj.purpose) ? (currObj.purpose) : '',
        questionNumber: (currObj.question_number) ? (currObj.question_number) : '',
        resgroupId: (currObj.resgroup_id) ? (currObj.resgroup_id) : '',
        resgroupName: (currObj.resgroup_name) ? (currObj.resgroup_name) : '',
        content: (currObj.content) ? (currObj.content) : '',
        ctId: (currObj.ct_id) ? (currObj.ct_id) : '',
        sendId: (currObj.send_id) ? (currObj.send_id) : '',
        classId: (currObj.classId) ? (currObj.classId) : '',
        subjectId: (currObj.subjectId) ? (currObj.subjectId) : '',
        signType: (currObj.sign_type) ? (currObj.sign_type) : '',
        hasEligible: (currObj.hasEligible) ? (currObj.hasEligible) : false
      }
      activity.isSigned = false
      if (currObj.isSigned) {
        activity.isSigned = true
      }
      if (activity && activity.activityType && activity.activityType === '6') {
        activity.type = '1'
      }
      localStorage.setItem('activityInfoFromMsgCommModal', JSON.stringify(activity))
      if (router.history.current.path === '/teaching-center/teachingr-detail') {
        // router.go(0)
        router.push({
          path: '/my/learning-classroom'
        }) // replace
      } else {
        router.push({
          path: '/teaching-center/teachingr-detail'
        })
      }
    }
  },
  /**
   * 接收消息事件
   */
  onMessageBack (callback = function () {}) {
    callback(this.receivedMsgData)
  }
}
export default webSockets
