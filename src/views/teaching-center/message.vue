<!-- 消息页面 -->
<template>
    <div class="message-box">
        <div class="news-con">
          
            <!-- 右键菜单begin -->
            <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
                  <li :title="rightMenuSelectedInfo.isTop && rightMenuSelectedInfo.isTop == 'Y'?'取消顶置':'顶置'" @click="toTopMessageList"> {{rightMenuSelectedInfo.isTop && rightMenuSelectedInfo.isTop == 'Y'?'取消顶置':'顶置'}}</li>
                  <li title="从会话列表中移除" @click="toDelMessageList">从会话列表中移除</li>
            </ul>
            <!-- 右键菜单end -->
            <div class="left-news-list ">
              <!-- 搜索框 begin -->
              <div class="search-box">
                <!-- <input type="text" v-model="mesShowListName"  @keyup.enter="handleSearchMesShowListName" placeholder="搜索">
                <img @click="handleSearchMesShowListName" src="static/image/search_2.png" alt="搜索" title="搜索"> -->
                <el-input
                  placeholder="搜索"
                  size="small"
                  @change="handleSearchMesShowListName"
                  @keyup.enter.native="handleSearchMesShowListName"
                  v-model="mesShowListName"
                  suffix-icon="el-icon-search">
                </el-input>
              </div>
              <!-- 搜索框 end -->
              <!-- 消息列表 begin   mesShowList   -->
              <ul class="news-list  message-lists" v-show="messageList && messageList.length>0" @scroll="handleScrollByMesList">
                  <li v-for="(item0,index0) in messageList" :key="index0" @contextmenu.prevent="openMenu($event,item0,index0)" :class="['news-item', currLeftGroupTip === index0 ?'active-news-item':'', item0.isTop && item0.isTop == 'Y' ?'top-news-item':'']"  :data-lefttip="currLeftGroupTip" :data-inex="index0" @click="activeSelected(index0,'true')">
                    <div class="news-item-img ">
                      <img class="list-img" :src="item0.img" alt="">
                      <div class="tips" v-if="item0.unread_num && item0.unread_num != 0">{{item0.unread_num}}</div>
                    </div>
                    <div class="inform">
                      <p class="inform-type text-ellipsis">{{item0.name}}</p>
                      <div class="inform_new_wrap font-size-13">
                        <p class="inform-content text-ellipsis">{{item0.content}}</p>
                        <p class="inform-time text-ellipsis">{{item0.update_time}}</p>
                      </div>
                    </div>
                  </li>
              </ul>
              <div class="no-data-hint" v-show="!messageList || (messageList && messageList.length<1)">
                <img src="static/image/manage_board/nodate.svg" alt="">
                <p>暂无数据</p>
              </div>
              <!-- 消息列表 end -->
              <!-- 消息列表 上一页 下一页 begin -->
              <!-- <div class="scroll-btn" v-if="requestPageByMesShow.totalPage && requestPageByMesShow.totalPage > 1">
                <img src="static/image/arrows_up.png" alt="" v-show="requestPageByMesShow.pageNum != 1" @click="mesShowTurnPage(false)" style="margin:0 20px;user-select: none;">
                <img src="static/image/arrws_down.png" alt="" v-show="mesShowList.length >= requestPageByMesShow.pageSize" @click="mesShowTurnPage(true)" style="margin:0 20px;user-select: none;">
              </div> -->
              <!-- 消息列表 上一页 下一页 end -->
            </div>
            <!-- 班课通知信息框开始   isShowChatIndex -->
            <div class="notification-box " @scroll="handleScrollByNotify" v-show="currLeftGroupTip === 0">
              <div class="new-info" v-show="isShowGroup && hasPermission">
                <b-button variant="outline-primary" size="sm" @click="ShowGroupBox(null)">+新增通知</b-button>
              </div>
              <div v-show="sysList && sysList.length>0">
                <!-- 搜索框 begin -->
                <div class="search-box">
                  <!-- <input type="text" v-model="sysListName"  @keyup.enter="handleSearchSysListName" placeholder="搜索">
                  <img @click="handleSearchSysListName" src="static/image/search_2.png" alt="搜索" title="搜索"> -->
                  <el-input
                    placeholder="搜索"
                    size="small"
                    @change="handleSearchSysListName"
                    @keyup.enter.native="handleSearchSysListName"
                    v-model="sysListName"
                    suffix-icon="el-icon-search">
                  </el-input>
                </div>
                <!-- 搜索框 end -->
                <div class="notification-box-msg" v-for="(item0,index0) in sysList" :key="index0">
                  <div class="newmsg_tag" v-show="item0.readState && item0.readState === 'N'"></div>
                  <!-- 发布人 -->
                  <div v-show="item0.createUserName" class="notification-content"><span class="baseOrange">{{item0.createUserName}}</span> 发布了消息：</div>
                  <!-- 通知内容 -->
                  <div class="notification-content">{{item0.msgContent}}</div>
                  <!-- 通知时间 -->
                  <div class="notification-time">{{item0.createTime}}</div>
                </div>
              </div>
              <div class="no-news-hint" v-show="!sysList || (sysList && sysList.length<1)">
                <img src="static/image/manage_board/nodate.svg" alt="">
                <p>暂时没有新消息哦~</p>
                <p v-show="isShowGroup && hasPermission">快点击左上方“新建通知”，给学生发送消息吧~</p>
                <!-- <p class="hint-button-msg">可以在云班课移动端使用 [私聊] 功能，随时随地沟通哦~</p> -->
              </div>
            </div>
            <!-- 班课通知信息框结束 -->
            <!-- 班课消息信息框开始   isShowChatIndex -->
            <transition name="el-fade-in">
              <div class="class-message-box " v-show="currLeftGroupTip !== 0">
                <chat-interface @toPrivateChat="toPrivateChat" ref="chatInterface"></chat-interface>
              </div>
            </transition>
            <!-- 班课消息信息框结束 -->
            <!-- 保存begin -->
            <div class="modal fade" tabindex="-1" role="dialog" id="addGroupBox2">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title" id="modal-title">新建通知</div>
                            <button type="button" @click="resetNewNotice('ruleForm')" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <el-form :model="notice" :rules="rules" label-width="79px" ref="ruleForm" class="demo-ruleForm">
                                <el-form-item label="标题：" prop="title">
                                    <el-input
                                      placeholder="请输标题"
                                      v-model="notice.title"
                                      maxlength="20"
                                      show-word-limit
                                      clearable>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="收件人：" prop="addressee">
                                    <el-select
                                      v-model="notice.addressee"
                                      :popper-append-to-body="false"
                                      popper-class="select-popper"
                                      style="width: 100%"
                                      multiple
                                      @change="changeSelect"
                                      allow-create
                                      default-first-option
                                      placeholder="选中收件人">
                                      <el-checkbox v-model="checkedAll" @change="clickCheckedAll">全选</el-checkbox>
                                      <el-option
                                        v-for="(item,index) in addressee"
                                        :key="index"
                                        :label="item.traineeName"
                                        :value="item.traineeId">
                                      </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="content">
                                    <el-input
                                      type="textarea"
                                      placeholder="请输入通知内容"
                                      :autosize="{ minRows: 6, maxRows: 8}"
                                      v-model="notice.content"
                                      maxlength="200"
                                      show-word-limit
                                    >
                                    </el-input>
                                </el-form-item>
                                <div class="news-info-btn-list">
                                    <b-button variant="outline-primary" size="sm" @click="submitNewNotice('ruleForm')">确定</b-button>
                                    <b-button variant="outline-secondary" size="sm" @click="resetNewNotice('ruleForm')">取消</b-button>
                                </div>
                            </el-form>
                        </div>
                    </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->
            <!-- 保存end -->
        </div>
        <!-- 消息end -->
    </div>
</template>

<script>
import $ from 'jquery'
import {getMsgTime, toast, concatImgUrl, getUserInfo, objectIsNotNull, confirm} from '@/utils/global'
import ChatInterface from '@/components/message-chat-interface/chat-interface'

export default {
  name: 'Message',
  components: {
    'chat-interface': ChatInterface
  },
  props: {
    hasPermission: {
      type: Boolean,
      default: true
    },
    // isShowMes: { // 组件是否显示
    //   type: Boolean,
    //   default: false
    // },
    ctId: {
      type: String,
      default: ''
    },
    pkgId: {
      type: String,
      default: ''
    }
    // activityId: {
    //   type: String,
    //   default: ''
    // }
  },
  watch: {
    // isShowMes: function (val) {
    //   if (val) {
    //     this.messageList = []
    //     this.messageList.push({content: '', img: 'static/image/bdsLogo.png', isSys: true, name: '系统通知', unread_num: '', update_time: ''})
    //     this.mesShowList = []
    //     this.mesShowList.push(this.messageList[0])
    //     this.currLeftGroupTip = 0
    //     this.isShowChatIndex = 0
    //     this.findMessageList({lastid: ''}, false)
    //   }
    //   if (this.isShowChatIndex === 0) {
    //     this.findSysList(this. requestSysPage, false)
    //     this.scrollToTopByNotify()
    //   }
    // }
    //监听右键菜单的显示隐藏
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
        window.addEventListener('scroll', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
        window.removeEventListener('scroll', this.closeMenu)
      }
    }
  },
  data () {
    return {

      // 右键菜单的一些属性
      visible: false,
      top: 0,
      left: 0,
      rightMenuSelectedInfo:{},// 右键菜单 选中的 当前 消息列表 数据

      // ctId: '',
      // pkgId: '',
      activityId: '',
      isShowChatIndex: 0,
      isShowGroup: true, // 显示的组
      MsgDataCom: {
        ctId: '',
        pkgId: '',
        msgCurrData: {},
        messagingType: '',
        activityId: '',
        movableImage: ''
      }, // 聊天组件要传的参数
      currLeftGroupTip: 0, // 当前选中的列表 的标识
      messageList: [
        {content: '', img: 'static/image/bdsLogo.png', isSys: true, name: '系统通知', unread_num: '', update_time: ''}
      ], // 消息列表数据
      mesShowList: [], // 当前显示的消息列表数据
      requestPageByMesShow: {
        pageNum: 1, // 当前第几页
        totalPage: null, // 总页数
        pageSize: 10 // 每页多少条
      }, // 当前显示的消息列表数据 页面 数据
      isLazy: false, // 是否懒加载
      notificationBoxOldHeight: 0, // 系统消息'.notification-box'对象原来的scrollHeight
      requestSysPage: {
        pageNum: 1, // 当前第几页
        pageSize: 10 // 每页多少条
      }, // 页面 数据
      isLoadingByMes: false, // 历史消息是否在加载
      isFindMesList: false, // 是否执行了 findMessageList 犯法
      mesShowListName: '', // 消息列表搜索框的值
      isLoadingBySys: false, // 系统消息是否在加载
      sysList: [], // 系统消息列表
      sysListName: '', // 系统消息列表索框的值
      // 新建通知对象
      notice: {
        title: '',
        addressee: [],
        content: ''
      },
      checkedAll: false, // 是否全选
      // 收件人
      addressee: [
        {value: '周芷若', label: '周芷若'},
        {value: '肖家河', label: '肖家河'},
        {value: '柳公权', label: '柳公权'},
        {value: '之首府', label: '之首府'},
        {value: '云闪付', label: '云闪付'},
        {value: '刘居冠', label: '刘居冠'}
      ],
      // 通知验证
      rules: {
        title: [
          { required: true, message: '请输入通知标题', trigger: 'blur' }
        ],
        addressee: [
          { required: true, message: '请选择发送人', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入通知内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let that = this
    window.eventBus.$on('eventBusReceivedMsgData', function (res) {
      that.handleMessBackData(res)
    })
    this.ctId = localStorage.getItem('ct_id')
    let formData = new FormData();
    formData.append("ctId",this.ctId)
    this.$api.classroomMember.queryAllTrainee(formData).then(res => {
      if (res.code === 0) {
        this.addressee = res.data;
      }
    })
    
  },
  methods: {
    
    handleScrollByMesList: function (event) { // 左边 消息列表的 滚动事件

      
      // // 滚动的像素 + 容器的高度>可滚动的总高度-100像素
      // if ((event.target.scrollTop + event.target.offsetHeight > event.target.scrollHeight - 100)  && (!this.isLoadingByMes)) {
      //   let lastId = (this.messageList && this.messageList[this.messageList.length - 1] && this.messageList[this.messageList.length - 1].list_id) ? (this.messageList[this.messageList.length - 1].list_id) : '';
      //   this.findMessageList({lastid: lastId}, true)
      //   this.isLoadingByMes = true;
      // }
      this.closeMenu();
    },
    /** 消息列表 从会话列表中移除 */
    toDelMessageList: function () {
      // console.log('this.rightMenuSelectedInfo', this.rightMenuSelectedInfo)
      let that = this;
      confirm("确定要从会话列表中移除该消息吗？",function () {
        
        let data = {
          busitypeIndex:  30,
          msg: {
            listId: (that.rightMenuSelectedInfo && that.rightMenuSelectedInfo.list_id) ? (that.rightMenuSelectedInfo.list_id) : '',
          }
        }
        that.webSockets.sendSocketMessage(data, false)  

        
        //更新一下选中的下标
        if (that.rightMenuSelectedInfo.listIndex <= that.currLeftGroupTip) {
          that.activeSelected(that.currLeftGroupTip-1);
        }
        that.messageList.splice(that.rightMenuSelectedInfo.listIndex,1);

      })

    },
    /** 消息列表 置顶 */
    toTopMessageList: function () {
      
      // console.log('this.rightMenuSelectedInfo', this.rightMenuSelectedInfo)
      let data = {
        busitypeIndex:  (this.rightMenuSelectedInfo.isTop && this.rightMenuSelectedInfo.isTop == 'Y')? 29:28,
        msg: {
          listId: (this.rightMenuSelectedInfo && this.rightMenuSelectedInfo.list_id) ? (this.rightMenuSelectedInfo.list_id) : '',
        }
      }
      this.webSockets.sendSocketMessage(data, false)  
      
      //更新一下选中的下标
      this.scrollToTopByMesList();
      this.activeSelected(0);
    },
    //打开右键菜单事件
    openMenu(e,value,index) {
      if (value.name === '系统通知') {
        return false;
      }
      this.top = e.clientY;
      this.left = e.clientX;
      this.visible = true;
      this.rightMenuSelectedInfo = value;
      this.rightMenuSelectedInfo.listIndex = index;
    },
    //关闭右键菜单事件
    closeMenu() {
      this.visible = false
    },
    /** 该组件显示时要做的事情 */
    isShowMes: function () {
      // this.initDatas(this.$store.getters.getMessageCDatas)
      this.initDatas()
      // this.findChatList({ lastid: '' }, false)
    },
    initDatas: function (val) {
      this.webSockets.sendSocketMessage({
        busitypeIndex: 14
      })
      // if (val) {
      //   this.ctId = ((val.ctId) ? (val.ctId) : '')
      //   this.pkgId = ((val.pkgId) ? (val.pkgId) : '')
        // this.activityId = ((val.activityId) ? (val.activityId) : '')

        this.messageList = []
        this.messageList.push({content: '', img: 'static/image/bdsLogo.png', isSys: true, name: '系统通知', unread_num: '', update_time: ''})
        // this.mesShowList = []
        // this.mesShowList.push(this.messageList[0])
        this.currLeftGroupTip = 0
        // this.isShowChatIndex = 0
        this.findMessageList({lastid: ''}, false)
      // }
      if (this.currLeftGroupTip === 0) {
        this.findSysList(this.requestSysPage, false)
        this.scrollToTopByMesList();
        this.scrollToTopByNotify()
      }
      // if (this.isShowChatIndex === 0) {
      //   this.findSysList(this.requestSysPage, false)
      //   this.scrollToTopByNotify()
      // }
    },
    // 显示新增、修改分组box
    ShowGroupBox: function (queryResGroup) {
      if (queryResGroup !== null) {
        this.addGroupDataFrom.resgroupId = queryResGroup.resgroupId
        this.addGroupDataFrom.resgroupName = queryResGroup.resgroupName
        this.resourceGroup.map((item, index) => {
          if (item.dictValue === queryResGroup.resType) {
            this.addGroupDataFrom.resType = item.dictCode
          }
        })
        $('#modal-title').html('修改通知信息')
      } else {
        $('#modal-title').html('新建通知')
      }
      $('#addGroupBox2').modal('show')
    },
    /**
     *  系统通知消息 滚动 条在最上方
     */
    scrollToTopByNotify: function () {
      this.$nextTick(() => {
        let container = this.$el.querySelector('.notification-box')
        container.scrollTop = 0
      })
    },
    /**
     *  消息列表 滚动 条在最上方
     */
    scrollToTopByMesList: function () {
      
      this.$nextTick(() => {
        let containern = this.$el.querySelector('.message-lists');
        console.log('container', containern.scrollTop)
        containern.scrollTop =  0;
        this.$forceUpdate();
      })
    },
    /** 系统消息滚动通知，实现下拉加载 */
    handleScrollByNotify: function (event) {
      // 滚动的像素 + 容器的高度>可滚动的总高度-100像素
      if ((event.target.scrollTop + event.target.offsetHeight > event.target.scrollHeight - 100) && (!this.isLoadingBySys)) {
        let pageNum = parseInt(this.requestSysPage.pageNum) + 1
        if (pageNum <= parseInt(this.requestSysPage.pages)) {
          this.requestSysPage.pageNum = pageNum
          this.isLoadingBySys = true
          this.findSysList(this.requestSysPage, true)
        }
      }
    },
    /** 聊天列表消息标记为已读 */
    tagReaded: function (param) {
      let data = {
        busitypeIndex: 3,
        msg: {
          listId: (param && param.msgCurrData && param.msgCurrData.list_id) ? (param.msgCurrData.list_id) : '',
          friendId: (param && param.msgCurrData && param.msgCurrData.friend_id) ? (param.msgCurrData.friend_id) : '',
          friendType: (param && param.msgCurrData && param.msgCurrData.friend_type) ? (param.msgCurrData.friend_type) : ''
        }
      }
      if (param.messagingType && param.messagingType === 'dytl') {
        data.msg.friendId = ((param.activityId) ? (param.activityId) : '')
        data.msg.friendType = '2'
      }
      this.webSockets.sendSocketMessage(data, false)
    },
    /**
     *  切换选中的组
     */
    activeSelected (value, isListClick = 'false') {
      if (this.currLeftGroupTip === value && isListClick === 'true') {
        return false
      }
      
      this.currLeftGroupTip = value
      // this.isShowChatIndex = (this.requestPageByMesShow.pageNum - 1) * this.requestPageByMesShow.pageSize + this.currLeftGroupTip
      if (value !== 'message') {
        this.isShowGroup = true
      } else {
        this.isShowGroup = false
      }
      this.sysList = [];
      if (value === 0) {
        this.$store.commit('setChatDatas', {})
        // localStorage.setItem('setChatDatas', JSON.stringify({}) );
        localStorage.removeItem('setChatDatas');

        this.findSysList(this.requestSysPage, false)
        this.scrollToTopByNotify()
      } else if (this.messageList && this.messageList[value]) {
        let lastChatDatas = (localStorage.getItem('setChatDatas') && localStorage.getItem('setChatDatas') !== undefined && JSON.parse(localStorage.getItem('setChatDatas')) && objectIsNotNull(JSON.parse(localStorage.getItem('setChatDatas')))  ) ? ( JSON.parse(localStorage.getItem('setChatDatas')) ) : {}; // this.$store.getters.getChatDatas

        if (lastChatDatas && lastChatDatas.msgCurrData && lastChatDatas.msgCurrData.list_id && this.messageList && this.messageList[value] && this.messageList[value].list_id && (lastChatDatas.msgCurrData.list_id === this.messageList[value].list_id)) {
          return false
        }
        if (lastChatDatas && lastChatDatas.messagingType) {
          this.tagReaded(lastChatDatas)
        }
        this.MsgDataCom.isShowPageWriteAnswerDiscuss = 'false';
        // if (this.messageList && this.messageList[value]) {
          this.messageList[value].unread_num = 0
        // }
        this.MsgDataCom.msgCurrData = this.messageList[value]
        this.MsgDataCom.messagingType = (this.messageList[value].friend_type === '1') ? 'privatechat' : (this.messageList[value].friend_type === '2' ? 'groupchat' : '')
        this.MsgDataCom.activityId = '';
        this.MsgDataCom.groupId = '';
        this.MsgDataCom.pkgId = this.pkgId;
        // target_type 1答疑讨论
        if (this.messageList[value].target_type && this.messageList[value].target_type === '1') {
          this.MsgDataCom.messagingType = 'dytl'
          this.MsgDataCom.activityId = this.messageList[value].target_id;
          this.MsgDataCom.groupId = this.messageList[value].target_id;
          this.MsgDataCom.pkgId = this.messageList[value].pkg_id
        }
        this.MsgDataCom.movableImage = this.messageList[value].img

        this.MsgDataCom.ctId = this.ctId
        
        this.$store.commit('setChatDatas', this.MsgDataCom)
        localStorage.setItem('setChatDatas', JSON.stringify(this.MsgDataCom) );

        this.$refs.chatInterface.inShowFun()
        this.$emit('unreadNumAdd', {messageList: this.messageList})
      }
    },
    /** 点击头像 进入私聊 子组件传入 父组件  */
    toPrivateChat: function (obj) {
      let that = this;
      let index = -1
      if (obj && obj.friend_id && this.messageList && this.messageList.length > 0) {
        for (let i = 0; i < this.messageList.length; i++) {
          if (this.messageList[i].friend_id === obj.friend_id) {
            index = i
            break;
          }
        }
       
        let noIsTopIndex = -1;// 置顶下标的下一个
        for (let i = 1; i < that.messageList.length; i++) {
          if (!that.messageList[i].isTop || that.messageList[i].isTop == 'N') {
            noIsTopIndex = i;
            break;
          }
        }
        if (noIsTopIndex < 0) {
          if (that.messageList[1] && that.messageList[1].isTop && that.messageList[1].isTop == 'Y') {
            noIsTopIndex = that.messageList.length -1;
          } else {
            noIsTopIndex = 1;
          }
        }
        
        let currList = obj;
        if (index > -1 ) { // 当前列表中 有 该想要私聊的人，则替换顺序
          currList = this.messageList[index];
          this.messageList.splice(index, 1);
        }
        // 在 置顶的最后一个的下标  后面添加 列表
        that.messageList.splice(noIsTopIndex, 0, currList);
        // 切换显示 当前私聊
        this.activeSelected(noIsTopIndex)


      }
    },
    /** 联系人列表翻页，value为true意思为向下翻页，否则向上  */
    mesShowTurnPage (value) {
      if (value) {
        // if (this.requestPageByMesShow.pageNum <= this.requestPageByMesShow.totalPage) {
        this.requestPageByMesShow.pageNum = this.requestPageByMesShow.pageNum + 1
        this.mesShowList = []
        let currStartIndex = (this.requestPageByMesShow.pageNum - 1) * this.requestPageByMesShow.pageSize
        if (this.messageList.length - currStartIndex <= this.requestPageByMesShow.pageSize) {
          let lastId = this.messageList[this.messageList.length - 1].list_id
          this.findMessageList({lastid: lastId}, true)
        } else {
          for (let i = 0; i < this.requestPageByMesShow.pageSize; i++) {
            if ((currStartIndex + i) < this.messageList.length) {
              this.mesShowList.push(this.messageList[currStartIndex + i])
            }
          }
          // this.currLeftGroupTip = 0
          // this.activeSelected(0)
        }
        // }
      } else {
        if (this.requestPageByMesShow.pageNum > 0) {
          this.requestPageByMesShow.pageNum = this.requestPageByMesShow.pageNum - 1
          this.mesShowList = []
          let currStartIndex = (this.requestPageByMesShow.pageNum - 1) * this.requestPageByMesShow.pageSize
          for (let i = 0; i < this.requestPageByMesShow.pageSize; i++) {
            if ((currStartIndex + i) < this.messageList.length) {
              this.mesShowList.push(this.messageList[currStartIndex + i])
            }
          }
          // this.currLeftGroupTip = 0
          // this.activeSelected(0)
        }
      }
      this.currLeftGroupTip = 0
      this.activeSelected(0)
    },
    /** 搜索 系统消息列表 */
    handleSearchSysListName: function () {
      this.findSysList(this.requestSysPage, false)
      this.scrollToTopByNotify()
    },
    /** 获取 系统消息列表 */
    findSysList: function (requestSysPage, isLazy) {
      let that = this
      let data = {
        pageNum: requestSysPage.pageNum,
        pageSize: requestSysPage.pageSize,
        name: that.sysListName
      }
      if (!isLazy) {
        data.pageNum = 1
        that.sysList = []
      }
      this.$api.chat.getSysList(data).then(res => {
        if (res.code === 0) {
          let ss = []
          if (res.data && res.data.list && res.data.list.length > 0) {
            ss = res.data.list
            for (let i = 0; i < ss.length; i++) {
              ss[i].msgPic = concatImgUrl(ss[i].msgPic)
              ss[i].createTime = getMsgTime(ss[i].createTime)
              that.sysList.push(ss[i])
            }
            that.messageList[0].update_time = ss[0].createTime
          }
          if (res.data && res.data.currPage) {
            that.requestSysPage.pageNum = res.data.currPage
          }
          if (res.data && res.data.totalPage) {
            that.requestSysPage.pages = res.data.totalPage
          }
        }
        that.isLoadingBySys = false
      })
    },
    /** 搜索 消息列表 */
    handleSearchMesShowListName: function () {
      this.webSockets.sendSocketMessage({
        busitypeIndex: 14
      })
      this.messageList = []
      this.messageList.push({content: '', img: 'static/image/bdsLogo.png', isSys: true, name: '系统通知', unread_num: '', update_time: ''})
      // this.mesShowList = []
      // this.mesShowList.push(this.messageList[0])
      this.currLeftGroupTip = 0
      this.isShowChatIndex = 0
      this.findMessageList({lastid: ''}, false)
      this.findSysList(this.requestSysPage, false)
      this.scrollToTopByMesList()
      this.scrollToTopByNotify()
    },
    /** 获取联系人列表数据 */
    findMessageList: function (params, isLazy) {
      if (this.isFindMesList) {
        return false
      }
      this.isFindMesList = true
      if (!isLazy) {
        this.scrollToTopByMesList();
        this.messageList = [];
      }


      this.isLazy = isLazy
      let data = {
        busitypeIndex: 0,
        ctId: this.ctId,
        lastid: (params && params.lastid) ? (params.lastid) : '',
        name: this.mesShowListName
      }
      if (!isLazy) {
        data.lastid = ''
      }
      data.isLazy = isLazy ? 'true' : 'false'
      this.webSockets.sendSocketMessage(data, false)
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function (res) {
      let that = this
      if (res.busitypeIndexNew === 0 || res.busitypeIndexNew === 1 || res.busitypeIndexNew === 4 || res.busitypeIndexNew === 6 || res.busitypeIndexNew === 8 || res.busitypeIndexNew === 14 || res.busitypeIndexNew === 18 || res.busitypeIndexNew === 19 || res.busitypeIndexNew === 28  || res.busitypeIndexNew === 29  || res.busitypeIndexNew === 30) { // 获取消息主界面列表数据
        if (res.code === 0) {
          if (res.busitypeIndexNew === 0) {
            if (!that.isLazy) {
              that.messageList = []
              that.messageList.push({content: '', img: 'static/image/bdsLogo.png', isSys: true, name: '系统通知', unread_num: '', update_time: ''})
            }
            if (res.data && res.data.msg && res.data.msg.length > 0) {
              for (let i = 0; i < res.data.msg.length; i++) {
                // res.data.msg[i].update_old_time = res.data.msg[i].update_time
                res.data.msg[i].update_time = getMsgTime(res.data.msg[i].update_old_time, false, '', '', false)
                that.messageList.push(res.data.msg[i])
              }
            }
          } else if (res.busitypeIndexNew === 1 || res.busitypeIndexNew === 4 || res.busitypeIndexNew === 6 || res.busitypeIndexNew === 8) {
            that.webSockets.sendSocketMessage({
              busitypeIndex: 14
            })

            if (res.data && res.data.msg && res.data.msg.length > 0 && that.messageList && that.messageList.length > 0) {
              let msg = res.data.msg
              let bpName = (res.busitypeIndexNew === 1) ? 'send_id' : 'toparty'
              for (let a = 0; a < msg.length; a++) {

                let currIndex = -1;
                for (let i = 0; i < that.messageList.length; i++) {
                  if (that.messageList[i].friend_id === msg[a][bpName]) {
                    currIndex = i;
                    break;
                  }
                }
                
                // 如果当前 别人发过来的消息没有在列表里面  、并且 有receiveChatMap    私聊取msg[a].receiveChatMap[0]
                if (currIndex < 0 && msg[a].receiveChatMap  && msg[a].receiveChatMap.length > 0 && msg[a].send_id && msg[a].send_id != getUserInfo().traineeId) {
               
                  let noIsTopIndex = -1;// 置顶下标的下一个   
                  for (let i = 1; i < that.messageList.length; i++) {
                    if (!that.messageList[i].isTop || that.messageList[i].isTop == 'N') {
                      noIsTopIndex = i;
                      break;
                    }
                  }
                  if (noIsTopIndex < 0) {
                    if (that.messageList[1] && that.messageList[1].isTop && that.messageList[1].isTop == 'Y') {
                      noIsTopIndex = that.messageList.length -1;
                    } else {
                      noIsTopIndex = 1;
                    }
                  }
                  let  currIndexr = -1;
                  if (res.busitypeIndexNew === 1) { // 私聊
                    currIndexr = 0;
                  }
                  for (let m = 0;m < msg[a].receiveChatMap.length;m++) {
                    if (msg[a].receiveChatMap[m].user_id && msg[a].receiveChatMap[m].user_id == getUserInfo().traineeId) {
                      currIndexr = m;
                      break;
                    }
                  }

                  msg[a].receiveChatMap[currIndexr].unread_num = (msg[a].receiveChatMap[currIndexr].unread_num &&  msg[a].receiveChatMap[currIndexr].unread_num >=1 ) ? (msg[a].receiveChatMap[currIndexr].unread_num -1) : 0;
                  msg[a].receiveChatMap[currIndexr].isSys = false;
                  msg[a].receiveChatMap[currIndexr].isTop = 'N';
                  // 在 置顶的最后一个的下标  后面添加 列表
                  that.messageList.splice(noIsTopIndex, 0,msg[a].receiveChatMap[currIndexr]);

                  // msg[a].receiveChatMap.isSys = false;
                  // msg[a].receiveChatMap.isTop = 'N';
                  // // 在 置顶的最后一个的下标  后面添加 列表
                  // that.messageList.splice(noIsTopIndex, 0, msg[a].receiveChatMap);
                  currIndex = noIsTopIndex;//  that.messageList.length - 1;

                  
                  // console.log('this.isShowChatIndex', this.isShowChatIndex)
                  // 如果 当前 选中的消息列表 大于 置顶的最后一个的下标  则 更新一下选中的下标
                  if (this.currLeftGroupTip >= noIsTopIndex) {
                    this.currLeftGroupTip = this.currLeftGroupTip +1;

                  }

                  
                  


                  
                }
                if (currIndex > -1) {
                  that.messageList[currIndex].content = msg[a].msg_content.replace("<br />"," ")
                    that.messageList[currIndex].update_old_time = msg[a].send_time_old
                    that.messageList[currIndex].update_time = getMsgTime(that.messageList[currIndex].update_old_time, false, '', '', false)
                    if (msg[a].send_id && msg[a].send_id === getUserInfo().traineeId) {
                    } else {
                      that.messageList[currIndex].unread_num = that.messageList[currIndex].unread_num + 1
                      that.$emit('unreadNumAdd', {messageList: that.messageList})
                    }
                }

                // for (let i = 0; i < that.messageList.length; i++) {
                //   if (that.messageList[i].friend_id === msg[a][bpName]) {
                //     that.messageList[i].content = msg[a].msg_content.replace("<br />"," ")
                //     that.messageList[i].update_old_time = msg[a].send_time_old
                //     that.messageList[i].update_time = getMsgTime(that.messageList[i].update_old_time, false, '', '', false)
                //     if (msg[a].send_id && msg[a].send_id === getUserInfo().traineeId) {
                //     } else {
                //       that.messageList[i].unread_num = that.messageList[i].unread_num + 1
                //       that.$emit('unreadNumAdd', {messageList: that.messageList})
                //     }
                //     break
                //   }
                // }
              }
            }
          } else if (res.busitypeIndexNew === 14) {
            if (res.data && res.data.msg && res.data.msg.length > 0) {
              for (let i = 0; i < res.data.msg.length; i++) {
                if (that.messageList && that.messageList[0]) {
                  that.messageList[0].unread_num = (res.data.msg[i] && res.data.msg[i].unReadMsgNum) ? (res.data.msg[i].unReadMsgNum) : 0
                }
                // that.$emit('unreadNumAdd', {messageList: that.messageList})
              }
            }
          } else if (res.busitypeIndexNew === 18 || res.busitypeIndexNew === 19 || res.busitypeIndexNew === 28  || res.busitypeIndexNew === 29) { //  || res.busitypeIndexNew === 30
            that.findMessageList({lastid: ''}, false)
          }
        }

        

        // if (that.messageList && that.messageList.length > 0) {
        //   that.mesShowList = []
        //   if (!that.isLazy) {
        //     that.requestPageByMesShow.pageNum = 1
        //   }
        //   that.requestPageByMesShow.totalPage = Math.ceil((that.messageList.length) / (that.requestPageByMesShow.pageSize))
        //   if (that.requestPageByMesShow.pageNum > that.requestPageByMesShow.totalPage) {
        //     that.requestPageByMesShow.pageNum = that.requestPageByMesShow.totalPage
        //   }
        //   let currStartIndex = (that.requestPageByMesShow.pageNum - 1) * that.requestPageByMesShow.pageSize
        //   for (let i = 0; i < that.requestPageByMesShow.pageSize; i++) {
        //     if ((currStartIndex + i) < that.messageList.length) {
        //       that.mesShowList.push(that.messageList[currStartIndex + i])
        //     }
        //   }
        //   if (that.isLazy && res.busitypeIndexNew === 0) {
        //     that.currLeftGroupTip = 0
        //     that.activeSelected(0)
        //   }
        // }
      }
      this.isLoadingByMes = false;
      this.isFindMesList = false;
    },
    /**
     *  提交新建通知
     */
    submitNewNotice (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            ctId: this.ctId,
            title: this.notice.title,
            content: this.notice.content,
            traineeIds: this.notice.addressee
          }
          $('#addGroupBox2').modal('hide')
          this.$refs[formName].resetFields()
          this.$api.chat.sendText(obj).then(res => {
            toast(res.msg)
          })
        } else {
          return false
        }
      })
    },
    /**
     *  取消提交新建通知
     */
    resetNewNotice (formName) {
      this.$refs[formName].resetFields()
      this.checkedAll = false
      $('#addGroupBox2').modal('hide')
    },
    /**
     *  收件人选择改变事件
     */
    changeSelect (val) {
      this.checkedAll = val.length === this.addressee.length
    },
    /**
     *  收件人全选单击事件
     */
    clickCheckedAll () {
      this.notice.addressee = []
      if (this.checkedAll) {
        this.addressee.map((item) => {
          this.notice.addressee.push(item.traineeId)
        })
      } else {
        this.notice.addressee = []
      }
    }
  },
  computed: {
  },
  destroyed () {
  },
  mounted () {
    // window.addEventListener('scroll', this.handleScroll) // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
  },
  // 每次页面渲染完之后滚动条在最底部
  updated: function () {
  }
}
</script>

<style scoped>
    .message-box{
      height: 100%;

      padding-bottom: 10px;
      box-sizing: border-box;
      /* height: calc(100vh - 50px - 40px - 80px) !important; */
    }
    .news-con {
      /* height: calc(100%-30px) !important; */
    }
    .notification-box,
    .class-message-box,
    .news-con .left-news-list{
       /* height: calc(100vh - 150px); */
      min-height: 400px;
       height: calc(100vh - 300px);



      /* height: 100%; */
      /* height: calc(100vh-250px) !important; */
      /* height: calc(100%-40px) !important; */
      /* height: 860px; */
      /* height: 780px; */
      /* height: calc(100vh - 100px); */
      
      /* height: calc(100vh - 50px - 40px - 80px) !important; */
    }
    /* 左边分组样式 */
    /* 右边消息框样式 */
    .hint-button-msg{
      margin-top: 50px;
      color: #868f92;
    }
    .notification-box{
      /* height: 400px; */
      /* height: 860px; */
      padding: 0 30px 10px 30px;
      /* margin-bottom: 10px; */
      width: 69%;
      box-sizing: border-box;
      overflow-y: scroll;
      
    }
    .notification-box .new-info{
      position: absolute;
      right: 20px;
      top: 23px;
    }
    .notification-box .new-info .btn{
      height: 31px !important;
      /* top: 23px; */
    }
    .notification-box-msg{
      /*box-shadow: 0 -2px 2px 1px rgba(0,0,0,0.15), 0 2px 2px 1px rgba(0,0,0,0.15);*/
      box-shadow: 0 2px 2px 1px rgba(0,0,0,0.15);
      width: 90%;
      padding: 15px 10px;
      /*margin: 20px 0;*/
      margin-bottom: 30px;
      border-radius: 5px;
      box-sizing: border-box;
      position: relative;
      border: 1px solid #f5f5f5;
    }
    .notification-box-msg:first-child{
      margin-top: 10px;
    }
    /*新消息提醒标志*/
    .notification-box-msg .newmsg_tag {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: #fd7512;
      border: #FFF solid 2px;
      top: -6px;
      left: -6px;
      position: absolute;
      box-sizing: border-box;
    }
    .notification-time{
      font-size: 14px;
      color: #6a7275;
      text-align: right;
    }
    .class-message-box{
      /* height: 400px; */
      /* height: 860px; */
      width: 69%;
      /* overflow-y: scroll; */
    }
    .class-message-show{
      height: 69%;
      border-bottom: 1px solid #E7E7E7;
      overflow-y: scroll;
      padding-top: 10px;
    }
    .class-message-content{
      height: 25%;
    }
    /* 聊天室样式 */
    .others-content{
      line-height: 40px;
    }
    .others-portrait img{
      height: 40px;
      width: 40px;
      border-radius: 10%;
      cursor: pointer;
    }
    .discuss-content-others{
      margin-left: 5%;
      display: flex;
      padding: 10px 0;
      position: relative;
    }
    .others-time{
      font-size: 12px;
      color: #7a7a7a;
      position: absolute;
      top: -4px;
      left: 55px;
    }
    .discuss-content-oneself{
      margin-right: 5%;
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      position: relative;
    }
    .oneself-time{
      font-size: 12px;
      color: #7a7a7a;
      position: absolute;
      top: -4px;
      right: 55px;
    }
    .bubbleItem{
      margin: 0 15px;

    }
    /* 输入栏样式 */
    .discuss-input-tool{
      height: 30px;
      line-height: 30px;
      width: 90%;
      margin-left: 5%;
    }
    .discuss-input-tool > span{
      font-size: 25px;
      cursor: pointer;
      color: #959595;
    }
    .discuss-input-tool > span:hover{
      color: #4c4c4c;
    }
    .discuss-input-tool > span:active{
      color: #747474;
    }
    .discuss-input-write{
      height: 40px;
      width: 95%;
      margin-left: 5%;
    }
    .discuss-input-write div{
      height: 100%;
      width: 100%;
      border-style: none;
      outline:none;
      overflow-y:scroll;
      padding-right: 4%;
    }
    .discuss-input-write img{
      width: 70px;
      height: 70px;
      vertical-align: text-bottom;
    }
    .discuss-input-btn{
      margin-left: 5%;
      width: 90%;
    }
    .discuss-input-btn button{
      background-color: #ffffff;
      border: none;
      border-bottom: 1px solid #e5e5e5;
      float: right;
      width: 60px;
      height: 25px;
      font-size: 14px;
      line-height: 25px;
      outline:none;
      padding: 0;
      cursor: pointer;
      color: #7c7c7c;
    }
    .discuss-input-btn button:hover{
      color: #252525;
      border-bottom: 1px solid #252525;
    }
    .discuss-input-btn button:active{
      color: #1E9FFF;
      border-bottom: 1px solid #1E9FFF;
    }
    /* 消息start */
    .news-con{
        display: flex;
        width: 100%;
        padding-top:10px;
        background-color: #fff;
        text-align: left;
        position: relative;
    }
    .news-con .left-news-list{
      min-width:372px;
      max-width:372px;
      position: relative;
      border-right: 1px solid #eee;
      /* padding-bottom: 10px; */
      box-sizing: border-box;
      /* height: 100%; */
      /* height: 860px; */
    }
    .left-news-list .news-list{
      /* height: calc(100% - 50px - 35px); */
       height: calc(100% - 54px);
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .left-news-list .news-list .news-item{
        display: flex;
        padding: 13px 20px;
        background: #fff;
        cursor:pointer;
    }
    .left-news-list .news-list .top-news-item{
      background-color: #f5f5f5;
    }
    .left-news-list .news-list .active-news-item{
        border-left:3px solid #007bff;
        margin-right:-1px;
    }
    .left-news-list .news-list .news-item:hover{
        background-color: #f1f1f1;
    }
    .left-news-list .news-list .news-item .news-item-img{
      width:40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      position: relative;
      border: 1px solid #959da0;
    }
    .left-news-list .news-list .news-item .news-item-img .list-img{
      width: 100%;
      height: 100%;
      /* background-color: #f5f5f5; */
      border-radius: 50%;
    }
    /*提示标识*/
    .left-news-list .news-list .news-item .news-item-img .tips {
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 50%;
      color: #FFF;
      font-size: 10px;
      background-color:#fd7512;
      z-index: 5;
      position: absolute;
      top: -8px;
      right: -8px;
    }
    .left-news-list .news-list .news-item .inform{
      width: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      align-content: center;
    }
    .left-news-list .news-list .news-item .inform-type{
      height: 20px;
    }
    .left-news-list .news-list .news-item .inform .inform_new_wrap{
      display: flex;
      justify-content: space-between;
      height: 20px;
      color:#999;
      overflow: hidden;
    }
    .left-news-list .news-list .news-item .inform .inform_new_wrap .inform-content{
      width: 62%;
    }
    .left-news-list .news-list .news-item .inform .inform_new_wrap .inform-time{
      width: 38%;
      /* padding-left: 10px; */
      text-align: right;
    }
    .left-news-list .news-list .news-item{
        border-bottom: 1px solid #eee;
    }
    .modal-header{
        border: 0;
    }
    .textarea-box{
        width: 100%;
        height:120px;
        border: 1px solid #eee;
    }
    .textarea-box .form-control{
        border: 0;
        outline: none;
        height:100%;
    }
    .char-num-hint{
        font-size: 14px;

    }
    .news-info-btn-list{
        margin-top:10px;
        text-align: center;
    }
    .news-info-btn-list button{
        width: 100px;
        margin-right:10px;
    }
    .news-con .right-news-con{
        width:75%;
        padding:10px;
    }
    .no-news-hint {
      margin-top: 60px;
      /* min-height:300px; */
      padding: 25px 0;
      text-align: center;
    }
    .left-news-list .scroll-btn{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      border-right: 1px solid #eee;
      background-color: #fff;
    }
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track-piece {

    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  /* 饿了么下拉框的样式 */
  .el-select /deep/ .select-popper {
    z-index: 8888 !important;
    top: auto !important;
    left: auto !important;
    text-align: left;
  }
  .el-checkbox{
    text-align: right;
    width: 100%;
    padding-right: 10px;
  }


  .left-news-list .search-box,
  .notification-box .search-box{
    position: relative;
    width: 90%;
    height: 35px;
    border-radius: 3px;
    line-height: 35px;
    margin:10px auto 10px;
    padding:0 10px;
  }
  .notification-box .search-box{
    margin: 10px 0 20px 0;
    padding: 0;
  }
  .left-news-list .search-box >input,
  .notification-box .search-box >input{
    width:90%;
    height:31px;
    line-height: 31px;
    border: 0;
    font-size: 16px;
    outline: none;
    background-color: inherit;
  }
  .left-news-list .search-box > img,
  .notification-box .search-box > img{
    cursor: pointer;
    position: absolute;
    top:3px;
    right:10px;
  }

  .notification-content{
    margin-bottom: 5px;
  }
  /* 右键样式 */
  .contextmenu{
    position: fixed;
    z-index: 500;
    border: 1px solid #f2f2f2;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  .contextmenu li{
    padding: 10px 20px;
    background-color: #ffffff;
  }
  .contextmenu li:hover{
    background-color: #f2f2f2;
    cursor: pointer;
  }
</style>
