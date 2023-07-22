
<!-- 消息聊天组件 -->
<template>
    <div class="chat_interface_wrapper">
      <!-- 标题begin -->
      <div :class="['chat_interface_title bg_gray_light', isShowPageWriteAnswerDiscuss === 'true'?'chat_other_dytl':'']">
        <div class="hide_single chat_interface_title_label">{{titleNav}}</div>
        <div class="chat_interface_title_arr" v-show="messagingType === 'dytl'" @click="tapShowTheme">
          <span :class="['fa chat_interface_title_icon',isShowTheme?'fa-angle-up':'fa-angle-down']"></span>主题
        </div>
        <div class="chat_interface_title_arr" v-show="messagingType !== 'privatechat' && isShowPageWriteAnswerDiscuss !== 'true'" @click="tapShowChatsDetail" v-b-toggle.chats-detail>
          <!-- <span :class="['fa chat_interface_title_icon',isShowChatsDetail?'fa-angle-right':'fa-angle-left']"></span> -->
          <div class="chat_interface_title_arr_img">
            <img :src="movableImage" />
          </div>
          <div>群成员</div>
        </div>
      </div>
      <!-- 标题end-->
      <!-- 侧边栏 群聊详情 begin -->
<!--      <b-sidebar id="chats-detail" title="Sidebar with backdrop" backdrop-variant="dark" backdrop right aria-labelledby="chats-detail-title" shadow>-->

<!--      </b-sidebar>-->
      <!--<div class="chats_detail_wrapper" v-show="isShowChatsDetail && messagingType !== 'privatechat'">
        <div class="search-box">
          <input type="text" v-model="groupUserName"  @keyup.enter="handleSearchTraineeName" placeholder="搜索">
          <img @click="handleSearchTraineeName" src="static/image/search_2.png" alt="搜索" title="搜索">
        </div>
        <ul class="group-user-list"  v-if="groupUserList.length>0">
          <li v-for="(item0,index0) in groupUserList" :key="index0" class="group-user-item">
            <div class="group-user-info">
              <div>{{(requestPageByGroupUser.pageNum-1) * (requestPageByGroupUser.pageSize) + (index0 + 1) | filterIndex}}</div>
              <img class="user-header-img" :src="item0.userimg" alt="" @click="toPrivateChat(index0, 'detail')">
              <div class="group-name">
                <p class="traineeName">{{item0.username}}</p>
                <p class="mobile">{{item0.mobile}}</p>
              </div>
            </div>
            <div class="classroom-student-state" v-show="item0.state === 'N'">
              <span>{{item0.stateName}}</span>
            </div>
          </li>
        </ul>
        <div class="no-data-hint" v-show="!groupUserList || (groupUserList && groupUserList.length<1)">
          <img src="static/image/manage_board/nodate.svg" alt="">
          <p>暂无数据</p>
        </div>
        <div class="scroll-btn">
          <img src="static/image/arrows_up.png" alt="" v-show="requestPageByGroupUser.pageNum != 1" @click="groupUserTurnPage(false)">
          <img src="static/image/arrws_down.png" alt="" v-show="requestPageByGroupUser.pageNum != requestPageByGroupUser.totalPage" @click="groupUserTurnPage(true)">
        </div>
      </div>-->
      <!-- 侧边栏 群聊详情 end -->
      <!-- 主题begin-->
      <transition name="el-zoom-in-center">
        <div :class="['chat_interface_title_content bg_white', isShowPageWriteAnswerDiscuss === 'true'?'chat_other_dytl':'']" v-show="isShowTheme && messagingType === 'dytl'">{{activityInfo.content}}</div>
      </transition>
      <!-- 主题end-->
      <!-- 历史记录  和 群成员  begin-->
      <div style="display: flex;height: calc(100% - 200px);" :class="['chat-record-area',isShowPageWriteAnswerDiscuss === 'true'?'chat_other_dytl':'']">
        <!-- 历史记录 begin-->
        <div class="chat_interface_history_list"  style="width: 100%;height: 100%"  @scroll="handleScrollByHistoryList">
          <div v-for="(item0,index0) in msgList" :key="index0">
            <div v-if="item0">
              <!--消息发送时间begin-->
              <div class="time dytl_center_time" v-if="item0.send_time">{{item0.send_time}}</div>
              <!--消息发送时间end-->
              <!-- 以下是最新消息begin -->
              <div id="newMsgTopLocation" v-if="item0.qdOtherType && item0.qdOtherType === 'newMsgTopLocation'" class="time dytl_center_time">
                <span>—————— </span>
                <span>以下为新消息</span>
                <span> ——————</span>
              </div>
              <!-- 以下是最新消息end -->
              <div v-else :id="'msg-'+index0" :class="['dytl_center_wrapper',!item0.send_time?'notime_dytl_center_wrapper':'',item0.isMy?'msg_isuser':'']">
                <!--消息头像begin-->
                <img v-if="item0.send_img" :src="item0.send_img" class="dytl_center_userimg" @click="toPrivateChat(index0, 'list')">
                <!--消息头像end-->
                <div class="dytl_center_content">
                  <!--头衔 以及名称begin-->
                  <div class="name_wrapper" v-if="!item0.isMy">
                    <span v-if="messagingType == 'dytl' && item0.isTeacher" class="biaoqian">老师</span>
                    <span class="time font_m">{{item0.send_name}}</span>
                  </div>
                  <!--头衔 以及名称end-->
                  <!--具体消息内容begin-->
                  <div :class="['msg_content',item0.isMy?'msg_isuser':'']">
                    <!--文本 消息 begin-->
                    <div v-if="item0.msg_type == 'text'" :class="['qibao',item0.isMy?'qibao_right bg_blue_light w_white':'qibao_left bg_gray']">
                      <div class="msg_text" v-html="item0.msg_content"></div>
                    </div>
                    <!--文本 消息 end-->
                    <!--语音 消息 begin-->
                    <!-- wx.createInnerAudioContext()使用其播放语音 -->
                    <div v-if="item0.msg_type == 'voice'" :class="['qibao',item0.isMy?'qibao_right bg_blue_light w_white':'qibao_left bg_gray']">
                      <div :class="['msg_audio',item0.isMy?'msg_isuser':'']">
                        <div :class="['msg_dianzan position_relative',item0.isMy?'rotate180':'']">
                          <span :class="['fa fa-rss rotate40',item0.isMy?'w_white':'']" style="font-size: 17px;"></span>
                          <span :class="['speeking_text',item0.isMy?'bg_blue_light':'bg_gray',item0.isPlayed?'speeking_anim':'']"></span>
                        </div>
                        <div>{{item0.duration_time}}''</div>
                      </div>
                    </div>
                    <!--语音 消息end-->
                    <!-- 文件  消息 begin-->
                    <div v-if="item0.msg_type == 'file'" :class="['qibao bg_gray width_file',item0.isMy?'qibao_right':'qibao_left']">
                      <div class="file_wrapper" @click="openFile(item0)">
                        <div class="file_name_wrapper" >
                          <div class="file_name">
                            <div class="hide_double ">{{item0.file_name}}</div>
                            <div class="time file_size">{{item0.file_size}}</div>
                          </div>
                          <div class="file_icon_wrapper">
                            <div class="icon_wrapper">
                              <span class="fa fa-file" style="font-size:24px ;color:#0485e8;"></span>
                            </div>
                          </div>
                        </div>
                        <!-- <a :id="item0.msg_id" :href="item0.msg_content" :download="item0.file_name" target="_blank"  v-show="false"></a> -->
                        <b-progress class="file_progress" v-if="item0.isTemp" height="3px" :value="item0.percent" max="100" variant="success"></b-progress>
                      </div>
                    </div>
                    <!-- 文件  消息 end-->
                    <!-- 视频 消息 begin-->
                    <div v-if="item0.msg_type == 'video'" :class="['qibao bgBaseGray width_video',item0.isMy?'qibao_right':'qibao_left']">
                      <div class="video_wrappers align-center-vertical" @click="openVideo(item0.msg_content)">
                        <img class="continaer img" v-show="item0.first_capture_access_url" :src="item0.first_capture_access_url">
                        <div class="icon_wrapper"><span class="fa fa-play-circle-o w_white" style="font-size:40px;"></span></div>
                      </div>
                      <b-progress class="file_progress" v-if="item0.isTemp" height="3px" :value="item0.percent" max="100" variant="success"></b-progress>
                    </div>
                    <!-- 视频  消息 end-->
                    <!-- 图片 消息 begin-->
                    <div v-if="item0.msg_type == 'image'" :class="['qibao width_image',item0.isMy?'qibao_right':'qibao_left']">
                      <viewer>
  <!--                      class="continaer"-->
                        <img style="width:100%;"  :src="item0.msg_content">
                      </viewer>
                    </div>
                    <!-- 图片 消息 end-->
                    <!-- 上传或者发送失败 感叹号图标begin     -->
                    <div class="msg_dianzan" @click="toReUpload(index0)" v-if="item0.sendupType == 'senderr'">
                      <span class="fa fa-exclamation-circle w_red" style="font-size:20px;" ></span>
                    </div>

                    <!-- 上传或者发送失败 感叹号图标end -->
                    <!--  叉图标begin    -->
                    <div class="msg_dianzan" @click="toCancelUploading(index0)"  v-if="item0.isTemp && (item0.msg_type == 'video' || item0.msg_type == 'file') && item0.sendupType == 'sending'">
                      <span class="fa fa-times-circle w_red" style="font-size:20px;" ></span>
                    </div>
                    <!-- 叉图标end -->
                    <!-- 发送中 转圈圈图标begin     turnLoading    -->
                    <div class="msg_dianzan " v-if="item0.sendupType == 'sended'">
                      <span class="fa fa-spinner fa-spin" style="font-size:19px;" ></span>
                    </div>
  <!--                  <div class="msg_dianzan " >-->
  <!--                    <b-spinner label="Spinning" style="width:1.1rem;height:1.1rem"></b-spinner>-->
  <!--                  </div>-->
                    <!-- 发送中 转圈圈图标end -->
                    <!-- 点赞 以及点赞数 begin  -->
                    <div v-if="messagingType == 'dytl' && !item0.isTemp" style="padding-bottom:3px">
                      <div class="msg_dianzan" @click="toClickLike(index0)" :title="item0.isLiked?'取消点赞':'点赞'">
                        <span :class="['fa fa-thumbs-up',item0.isLiked?'w_orange':'']" style="font-size:20px;"></span>
                      </div>
                      <!--                              <div>-->
                      <!--                                <span v-if="item0.like_num && item0.like_num != 0">{{item0.like_num}}</span>-->
                      <!--                                <span v-else>0</span>-->
                      <!--                              </div>-->
                    </div>
                    <!-- 点赞 以及点赞数 end -->
                  </div>
                  <!--具体消息内容end-->
                  <!--答疑 经验值begin   -->
                  <div  class="w_blue font-size-13" v-if="messagingType == 'dytl' && !item0.isTemp && item0.empirical_value && item0.empirical_value != 0">+{{item0.empirical_value}}经验值</div>
                  <!--答疑 经验值end-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 历史记录end-->
        <!-- 群成员 begin -->
        <transition name="chatsDetail">
          <div :class="['chats_detail_wrapper', isShowPageWriteAnswerDiscuss === 'true' ?'chats_detail_wrapper_dytl':'']" v-show="(isShowChatsDetail && messagingType !== 'privatechat') || (isShowPageWriteAnswerDiscuss === 'true')">
            <!-- <div class="group-user-count">群成员({{requestPageByGroupUser.totalCount}})</div> -->
            <div class="search-box">
              <el-input type="text" size="mini" suffix-icon="el-icon-search" v-model="groupUserName" @input="handleSearchTraineeName"  @keyup.enter.native="handleSearchTraineeName" placeholder="搜索"></el-input>
            </div>
            <ul class="group-user-list" v-if="groupUserList.length>0" @scroll="handleScrollByGroupUserList" >
               <!--  -->
              <li v-for="(item0,index0) in groupUserList" :key="index0" class="group-user-item" @click="toPrivateChat(index0, 'detail')">
                <div class="group-user-info">
                  <!-- {{(requestPageByGroupUser.pageNum-1) * (requestPageByGroupUser.pageSize) + (index0 + 1) | filterIndex}} -->
                  <div>{{index0+1}}</div>
                  <img class="user-header-img" :src="item0.userimg" alt="">
                  <div class="group-name">
                    <p class="traineeName">{{item0.username}}</p>
                    <p class="mobile">{{item0.mobile}}</p>
                  </div>
                </div>
                <div class="classroom-student-state" v-show="item0.state === 'N'">
                  <span>{{item0.stateName}}</span>
                </div>
              </li>
            </ul>
            <div class="no-data-hint" v-show="!groupUserList || (groupUserList && groupUserList.length<1)">
              <img src="static/image/manage_board/nodate.svg" alt="">
              <p>暂无数据</p>
            </div>
            <!-- <div class="scroll-btn" v-if="requestPageByGroupUser.totalPage && requestPageByGroupUser.totalPage > 1 && groupUserList.length>0" >
              <img src="static/image/arrows_up.png" alt="" v-show="requestPageByGroupUser.pageNum != 1" @click="groupUserTurnPage(false)" style="margin:0 10px;user-select: none;">
              <img src="static/image/arrws_down.png" alt="" v-show="requestPageByGroupUser.pageNum != requestPageByGroupUser.totalPage" @click="groupUserTurnPage(true)" style="margin:0 10px;user-select: none;">
            </div> -->
          </div>
        </transition>
        <!-- 群成员  end-->
      </div>
      <!-- 历史记录 和  群成员 end-->
      <!-- 输入框+工具栏+发送 begin -->
      <div :class="['class-message-content', isShowPageWriteAnswerDiscuss === 'true'?'chat_other_dytl':'']">
        <!-- 工具栏 begin-->
        <div class="discuss-input-tool">
          <span title="上传图片" class="el-icon-picture"  @click="toInputClick('image')" style="margin-left: 10px;"></span>
          <input  type="file" v-show="false" accept="image/gif,image/jpeg,image/jpg,image/png" @change="toAddFile($event,'image')" id="imageInput" ref="imageInput">
          <span title="上传视频" class="el-icon-video-camera-solid"  @click="toInputClick('video')" style="margin-left: 10px;"></span>
          <input  type="file" v-show="false" accept="video/*" @change="toAddFile($event,'video')" id="videoInput" ref="videoInput">
          <span title="上传文件" class="el-icon-folder-opened" @click="toInputClick('file')" style="margin-left: 10px;"></span>
          <input  type="file" v-show="false" @change="toAddFile($event,'file')" id="fileInput" ref="fileInput">
          <el-popover placement="top-start" width="400" trigger="click" popper-class="emoBox">
              <div class="emotionList">
                  <a href="javascript:void(0);" @click="getEmo(index)" v-for="(item,index) in emoji" :key="index" class="emotionItem">{{item}}</a>
              </div>
              <i class="fa fa-smile-o" style="margin-left: 10px;margin-bottom: 3px;" slot="reference" title="表情"></i>
          </el-popover>
        </div>
        <!-- 工具栏 end-->
        <!-- 输入栏 begin -->
        <!-- <div class="discuss-input-write"> -->
          <!-- <div contenteditable="true" id="inputWrite">
          </div> -->
          <!-- <textarea class="textarea" id="inputWrite" v-model="textareaValue"></textarea>
        </div> -->
        <textarea class="discuss-input-write" maxlength="1000" id="inputWrite" v-model="textareaValue" @keydown="handleKeyCode($event)"></textarea>
        <!-- 输入栏 end -->
        <!-- 按钮栏 begin-->
        <div class="discuss-input-btn">
          <button @click="toSendLabelMsg" title="按Enter键发送，按Ctrl+Enter换行">发送(S)</button>
        </div>
        <!-- 按钮栏 end-->
      </div>
      <!-- 输入框+工具栏+发送 end -->
    </div>
</template>

<script>
// , filePreviewUrl, endWith
import {getMsgTime, toast, getUserInfo, trim, convertToString, concatImgUrl, bytesToConversionUnit, openFilePreview, objectIsNotNull, objectArrRemoveRepeat,baseUrl, sortListByProperty} from '@/utils/global';
import {data} from '@/utils/emoji';
export default {
  name: 'chat-interface',
  props: {
    hasPermission: {
      type: Boolean,
      default: true
    }
  },
  components: {
  },
  watch: {
    textareaValue:function(n, o){
      if (this.textareaValue.length > 1000) {
        this.textareaValue = this.textareaValue.substring(0,1000);
      }
    },
  },
  data () {
    return {
      isShowPageWriteAnswerDiscuss: 'false', //是否是 活动列表进来的答疑讨论 聊天页面
      ctId: '', // 课堂id
      pkgId: '', // 教学包id
      msgCurrData: {}, // 消息列表被点击的的数据
      messagingType: '', // 类型：答疑讨论'dytl' 私聊'privatechat' 群聊'groupchat'
      activityId: '', // 活动id
      movableImage: '', // 聊天头像
      msgList: [], // 历史消息
      titleNav: '消息通讯', // 标题
      isShowChatsDetail: false, // 群详情是否显示
      isShowTheme: false, // 主题是否显示
      isAddNewMsgLocation: false, // 是否添加最新消息
      userInfo: getUserInfo(),
      isOneInto: true, // 第一次进入
      isAllowFileList: {
        isAllowPic: 'Y', // 允许图片消息
        isAllowVideo: 'Y', // 允许视频消息
        isAllowVoice: 'Y', // 允许语音消息
        isAllowFile: 'Y' // 允许文件消息
      }, // 允许列表
      groupUserList: [], // 群成员列表
      groupUserName: '', // 群成员列表搜索的input的值
      isLoadingByGroupUserList: false,// 群成员列表   是否在加载
      requestPageByGroupUser: {
        pageNum: 1, // 当前第几页
        totalPage: null, // 总页数
        pageSize: 15, // 每页多少条
        totalCount: 0 // 总共几条数据
      }, // 群成员列表页面 数据
      groupId: '', // 群id
      isLoadingByChat: false, // 历史消息是否在加载
      activityInfo: {}, // 答疑讨论活动信息
      textareaValue: '', // 输入框的值
      isFindChatList: false, // 是否执行了findChatList犯法
      emoji: [],    //表情
    }
  },
  filters: {
    filterIndex (value) {
      return value >= 10 ? value : '0' + value
    }
  },
  methods: {
    // 表情输入
    getEmo(index){
      var textArea=document.querySelector('.discuss-input-write');
      //将选中的表情插入到输入文本的光标之后
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea,this.emoji[index]);
      this.textareaValue=textArea.value;// 要同步data中的数据
      return;
    },
    /** 预览文件 */
    openFile (obj) {
      // document.getElementById(obj.msg_id).click();

      // let a = document.createElement('a')
      // a.href = `${baseUrl}cbim/file/downloadFile?fileId=${obj.attach_id}`;
      // // a.href = `${baseUrl}cbim/file/downloadFile?attachId=${obj.attach_id}`;
      // a.target = '_blank';
      // console.log('a.href', a.href)
      // a.download = obj.file_name;
      // a.click();

      openFilePreview(obj.msg_content, obj.file_name, 'file', true, `${baseUrl}cbim/file/downloadFile?fileId=${obj.attach_id}`)


      // 支持在线预览Word文档（.doc、.docx、.rtf格式的文件预览）
      // 支持在线预览PDF文档（.pdf格式的文件预览）
      // 支持在线预览Excel文档（.xls、.xlsx格式的文件预览）
      // 支持在线预览PowerPoint文档（.ppt、.pptx格式的文件预览）
      // 支持压缩包打开后并预览（压缩包里可支持的文件格式）（.zip .rar .7z）
      // 支持金山WPS文档预览（.wps格式的文件预览）
      // let src = obj.msg_content // 'https://www.budaos.com/bds/uploads/file/b04891f8-7284-4d89-bc74-f361bfe93ff6.docx' //
      // if (endWith(src, '.doc') || endWith(src, '.docx') || endWith(src, '.rtf') || endWith(src, '.pdf') || endWith(src, '.xls') || endWith(src, '.xlsx') || endWith(src, '.ppt') || endWith(src, '.pptx') || endWith(src, '.zip') || endWith(src, '.rar') || endWith(src, '.7z') || endWith(src, '.wps')) { // 使用office在线预览
      // let routeData = this.$router.resolve({
      //   path: '/teachingr-detail/file-preview',
      //   query: {
      //     fileSrc: encodeURIComponent(src)
      //   }
      // })
      // let openUrl = routeData.href // 'http://localhost:8888/#/TeachingCenter/FilePreview?fileSrc=' + encodeURIComponent(src)
      // window.open(openUrl, '_blank')
      // window.open(filePreviewUrl+'?url=' + src, '_blank')
      // } else { // 下载

      //   // this.content = obj.msg_content
      //   // this.filename = obj.file_name
      //   // const blob = new Blob([this.content])
      //   // if (window.navigator.msSaveOrOpenBlob) {
      //   //   // 兼容IE10
      //   //   navigator.msSaveBlob(blob, this.filename)
      //   // } else {
      //   //   //  chrome/firefox
      //   //   let aTag = document.createElement('a')
      //   //   aTag.download = this.filename
      //   //   aTag.target = '_blank'
      //   //   aTag.href = URL.createObjectURL(blob)
      //   //   aTag.click()
      //   //   URL.revokeObjectURL(aTag.href)
      //   // }

      //   let a = document.createElement('a')
      //   a.href = src
      //   a.target = '_blank'
      //   a.download = obj.file_name
      //   a.click()
      // }
    },
    /** 初始化数据 */
    initDatas: function (val) {
      if (val) {
        this.ctId = ((val.ctId) ? (val.ctId) : '');
        this.pkgId = ((val.pkgId) ? (val.pkgId) : '');
        this.groupId = ((val.groupId) ? (val.groupId) : '');
        
        this.msgCurrData = ((val.msgCurrData) ? (val.msgCurrData) : {})
        this.messagingType = ((val.messagingType) ? (val.messagingType) : '')
        this.activityId = ((val.activityId) ? (val.activityId) : '')
        this.movableImage = ((val.movableImage) ? (val.movableImage) : '')
        this.isShowPageWriteAnswerDiscuss = ((val.isShowPageWriteAnswerDiscuss) ? (val.isShowPageWriteAnswerDiscuss) : 'false');
        if (this.messagingType && this.messagingType === 'dytl') {
          this.findIsCanSendFile()
        }
        this.titleNav = '消息通讯'
        if (this.msgCurrData && this.msgCurrData.name) {
          this.titleNav = this.msgCurrData.name
        } else if (this.messagingType && (this.messagingType === 'privatechat' || this.messagingType === 'groupchat')) {
          this.titleNav = '消息通讯'
        } else if (this.messagingType && this.messagingType === 'dytl') {
          this.titleNav = '答疑讨论'
        } else if (this.messagingType && this.messagingType === 'classroom') {
          this.titleNav = '课堂'
        }
        this.msgList = []
        this.groupUserList = []
        this.isShowChatsDetail = false // 群详情是否显示
        this.isShowTheme = false // 主题是否显示
        this.textareaValue = ''
        this.groupUserName = ''

        if (this.isShowPageWriteAnswerDiscuss && this.isShowPageWriteAnswerDiscuss === 'true') {
          // this.groupId = this.activityId // 聊天目标id
          this.findGroupUserList(this.requestPageByGroupUser, false)
        }
      }
    },
    /** 该组件显示时要做的事情 */
    inShowFun: function () {
      let val = {};
      if (localStorage.getItem('setChatDatas') && localStorage.getItem('setChatDatas') !== undefined && JSON.parse(localStorage.getItem('setChatDatas')) && objectIsNotNull(JSON.parse(localStorage.getItem('setChatDatas')))  ) {
        val = JSON.parse(localStorage.getItem('setChatDatas'));
      }
      this.initDatas(val);
      // this.initDatas(this.$store.getters.getChatDatas)
      this.findChatList({ lastid: '' }, false)
    },
    /** 点击头像 进入私聊 */
    toPrivateChat: function (currindex, type) {
      let currData = {
        list_id: '',
        friend_id: ((type === 'detail') ? (this.groupUserList[currindex].userId) : (this.msgList[currindex].send_id)),
        friend_type: '1',
        name: ((type === 'detail') ? (this.groupUserList[currindex].username) : (this.msgList[currindex].send_name)),
        img: ((type === 'detail') ? (this.groupUserList[currindex].userimg) : (this.msgList[currindex].send_img)),
        content: '',
        unread_num: 0,
        update_time: ''
      }
      this.$emit('toPrivateChat', currData)
    },
    /** 群成员翻页，value为true意思为向下翻页，否则向上  */
    groupUserTurnPage (value) {
      if (value) {
        if (this.requestPageByGroupUser.pageNum <= this.requestPageByGroupUser.totalPage) {
          this.requestPageByGroupUser.pageNum = this.requestPageByGroupUser.pageNum + 1
          this.findGroupUserList(this.requestPageByGroupUser, true)
        }
      } else {
        if (this.requestPageByGroupUser.pageNum > 0) {
          this.requestPageByGroupUser.pageNum = this.requestPageByGroupUser.pageNum - 1
          this.findGroupUserList(this.requestPageByGroupUser, true)
        }
      }
    },
    /**群成员列表滚动   实现下拉加载 */
    handleScrollByGroupUserList : function (event) {
      // 滚动的像素 + 容器的高度>可滚动的总高度-100像素
      if ((event.target.scrollTop + event.target.offsetHeight > event.target.scrollHeight - 100) && (!this.isLoadingByGroupUserList)) {
        let pageNum = parseInt(this.requestPageByGroupUser.pageNum) + 1
        if (pageNum <= parseInt(this.requestPageByGroupUser.totalPage)) {
          this.requestPageByGroupUser.pageNum = pageNum
          this.isLoadingByGroupUserList = true
          this.findGroupUserList(this.requestPageByGroupUser, true)
        }
      }
    },
    /** 获取 群成员列表  */
    findGroupUserList: function (requestPageByGroupUser, isLazy) {
      let that = this
      let data = {
        pageNum: requestPageByGroupUser.pageNum,
        pageSize: requestPageByGroupUser.pageSize,
        groupId: that.groupId,
        pkgId: that.pkgId,
        username: that.groupUserName
      }
      if (!isLazy) {
        data.pageNum = 1
        that.groupUserList = []
      }
      // that.groupUserList = [
      //   {userimg: 'static/image/knowledge_a2.png', username: '张三'},
      //   {userimg: 'static/image/knowledge_a2.png', username: '张三'},
      //   {userimg: 'static/image/knowledge_a2.png', username: '张三'},
      //   {userimg: 'static/image/knowledge_a2.png', username: '张三'}
      // ]
      // return false
      this.$api.chat.getGroupUserList(data).then(res => {
        if (res.code === 0) {
          let ss = [];
          // that.groupUserList = [];
          if (res.data && res.data.list && res.data.list.length > 0) {
            ss = res.data.list
            for (let i = 0; i < ss.length; i++) {
              ss[i].userimg = concatImgUrl(ss[i].userimg)
              that.groupUserList.push(ss[i])
            }
          }

          // 数组去重
          that.groupUserList = objectArrRemoveRepeat(that.groupUserList, 'userId')

          if (res.data && res.data.currPage) {
            that.requestPageByGroupUser.pageNum = res.data.currPage
          }
          if (res.data && res.data.totalPage) {
            that.requestPageByGroupUser.totalPage = res.data.totalPage
          }
          if (res.data && res.data.totalPage) {
            that.requestPageByGroupUser.pages = res.data.totalPage
          }
          that.requestPageByGroupUser.totalCount = 0
          if (res.data && res.data.totalCount) {
            that.requestPageByGroupUser.totalCount = res.data.totalCount
          }
        }
        that.isLoadingByGroupUserList = false;
      }).catch(()=>{
        that.isLoadingByGroupUserList = false;
      });
    },
    /**
     *  监听文本域键盘事件触发 
     */
    handleKeyCode(event){
      if (event.keyCode == 13) {
        if (!event.ctrlKey) {
          event.preventDefault();
          this.toSendLabelMsg();
        } else {
          let temp = document.getElementById('inputWrite').selectionStart;
          this.textareaValue = this.textareaValue.substring(0,temp) + '\n' + this.textareaValue.substring(temp);
          
        }
      }
    },
    /** 发送文字消息 */
    toSendLabelMsg: function () {
      if (!this.addFileChecked('text')) {
        return false
      }
      let value = this.textareaValue // document.getElementById('inputWrite').innerText
      if (!(trim(value))) {
        toast('内容不能为空，请输入内容')
        return false
      }
      this.sendingMsgAddDate({path: value}, 'text', false)
      this.sendMessage({content: value, msgtype: 'text'})
      this.textareaValue = ''
      // document.getElementById('inputWrite').innerText = ''
    },
    /** 添加附件 */
    toAddFile: function (event, type) {
      let files = event.target.files
      if (files && files.length > 0) {
        for (let a = 0; a < files.length; a++) {
          if (files[a]) {
            // console.log('files[a]', files[a])
            // let type = files[a].type.split('/')[0]
            // files[a].type = type
            let reader = new FileReader()
            reader.readAsDataURL(files[a])
            reader.onload = function (e) {
              files[a].path = this.result
              // files[a].type = files[a].type.split('/')[0]
            }
          }
        }
      }
      this.uploadFileReq(files, type, false)
    },
    /** 上传 接口 方法  isReUpload是否重新上传 */
    uploadFileReq: function (files, type, isReUpload) {
      if (files && files.length > 0) {
        for (let a = 0; a < files.length; a++) {
          if (files[a]) {
            let fileType = files[a].type
            if (files[a].type.split('/')[0]) {
              fileType = files[a].type.split('/')[0]
            }
            let msgType = (fileType === 'image') ? '1' : ((fileType === 'video') ? '2' : ((fileType === 'file') ? '4' : ((fileType === 'voice') ? '3' : '')))
            let index = this.sendingMsgAddDate(files[a], type, isReUpload)
            let formData = new FormData()
            formData.append('files', files[a])
            formData.append('msgType', msgType)
            formData.append('ctId', this.ctId)
            formData.append('activityId', this.groupId)
            formData.append('fileName', files[a].name)
            formData.append('im-token', this.userInfo.token)
            // loadingModal(true)
            let that = this
            this.$api.chat.upload(formData, (progress) => {
              if (progress) {
                that.msgList[index].percent = progress
              }
            }, (cancel) => {
              that.msgList[index].cancelFun = cancel
            }).then(res => {
              if (res.code === 0 && res.media_id) { // 上传成功
                that.msgList[index].percent = 100;
                that.msgList[index].percentOneHundredTime = new Date().getTime();
                that.msgList[index].sendupType = 'sended';
                let noSendedIndex = that.findIndexFromMsgListComm('percent', 0, '>=', 'isTemp', 100)
                if (noSendedIndex > -1 && noSendedIndex < index) { // 如果前面有进度未满100的则排到前面去
                  let sendedList = that.msgList[index]
                  that.msgList.splice(index, 1)
                  let noSendedIndex2 = that.findIndexFromMsgListComm('percent', 0, '>=', 'isTemp', 100)
                  that.msgList.splice(noSendedIndex2, 0, sendedList)
                }
                // loadingModal(false)
                that.sendMessage({mediaId: res.media_id, msgtype: 'file'})
              } else {
                // loadingModal(false)
                toast('上传失败')
                that.msgList[index].sendupType = 'senderr'
              }
            }).catch((err) => {
              if (err && err.message && err.message === 'cancel') {
                that.msgList.splice(index, 1)
              } else {
                that.msgList[index].sendupType = 'senderr'
              }
              // if (!err || (err && !err.message) || (err && err.message && err.message !== 'cancel')) {
              //   that.msgList[index].sendupType = 'senderr'
              // }
            })
          }
        }
      }
    },
    /** 发送消息 */
    sendMessage: function (params) {
      let data = {}
      if (this.messagingType === 'privatechat') { // 私聊发送消息
        data = {
          busitypeIndex: 1,
          touser: this.msgCurrData.friend_id // 发送人
        }
      } else if (this.messagingType === 'dytl') { // 答疑讨论发送消息
        data = {
          busitypeIndex: 6,
          fromuser: this.userInfo.traineeId, // 发送人
          toparty: this.groupId,
          pkgId: this.pkgId,
        }
      } else if (this.messagingType === 'groupchat') { // 群聊 发送消息
        data = {
          busitypeIndex: 4,
          toparty: this.msgCurrData.friend_id
        }
      } else if (this.messagingType === 'classroom') { //  课堂 发送消息
        data = {
          busitypeIndex: 8,
          toparty: this.ctId
        }
      }

      data = Object.assign(data, params)
      this.webSockets.sendSocketMessage(data, false)
    },
    /** msgList添加一个临时的 数据  */
    sendingMsgAddDate: function (tempFile, type, isReUpload) {
      let that = this
      if (isReUpload) {
        let index = that.findIndexFromMsgListComm('msg_content', tempFile.path)
        if (index > -1 && that.msgList[index].isTemp) {
          that.msgList.splice(index, 1)
        }
      }
      let currTime = convertToString(new Date())
      let sendTime = currTime
      if (that.msgList && that.msgList.length > 0) {
        sendTime = getMsgTime(sendTime, true, that.msgList[that.msgList.length - 1].send_time_old, null)
      } else {
        sendTime = getMsgTime(sendTime)
      }
      that.msgList.push({
        isMy: true,
        isPlayed: false,
        send_img: concatImgUrl(this.userInfo.traineeHead),
        send_name: this.userInfo.traineeName,
        send_time_old: currTime,
        send_time: sendTime,
        msg_id: 'tempFile' + (that.msgList.length - 1),
        sendupType: (type === 'text') ? 'sended' : 'sending', // 发送状态：'sending'发送中
        msg_type: type,
        msg_content: tempFile.path,
        file_name: (tempFile.name) ? (tempFile.name) : ((tempFile.file_name) ? (tempFile.file_name) : ''),
        file_size: (tempFile.size) ? (bytesToConversionUnit(tempFile.size)) : ((tempFile.file_size) ? (bytesToConversionUnit(tempFile.file_size)) : ''),
        isTemp: true, // 是否是临时对象
        currTempIndex: that.msgList.length,
        percent: (type === 'text') ? 100 : 0,
        percentOneHundredTime: (type === 'text') ? ( new Date().getTime() ) : 0, //进度条为100的时候的时间
        first_capture_access_url: (tempFile.thumbTempFilePath) ? (tempFile.thumbTempFilePath) : ((tempFile.first_capture_access_url) ? (tempFile.first_capture_access_url) : ''),
        duration_time: (tempFile.duration) ? (tempFile.duration) : ((tempFile.duration_time) ? (tempFile.duration_time) : ''),
        videoWidth: (tempFile.width) ? (tempFile.width) : 0,
        videoHeight: (tempFile.height) ? (tempFile.height) : 0
      })
      that.scrollToBottom()
      return (that.msgList.length - 1)
    },
    /** 根据 data 来查找 msgList 列表中的msgParam字段 来 获取下标 */
    findIndexFromMsgListComm: function (msgParam, data, sub = '=', otherParam = 'send_name', max = null) {
      if ((data || data === 0) && this.msgList && this.msgList.length > 0) {
        let msgList = this.msgList
        for (let a = 0; a < msgList.length; a++) {
          if (sub === '=' && (msgList[a][msgParam] || msgList[a][msgParam] === 0) && msgList[a][msgParam] === data) {
            return a
          } else if (sub === '>=' && (msgList[a][otherParam]) && (msgList[a][msgParam] || msgList[a][msgParam] === 0) && msgList[a][msgParam] >= data && msgList[a][msgParam] < max) {
            return a
          }
        }
      }
      return -1
    },
    /** 预览视频 */
    openVideo (url) {
      openFilePreview(url, '', 'video', true)
      // this.$videoPreview(url)
    },
    /** 重新上传 */
    toReUpload: function (currIndex) {
      if (!this.addFileChecked(this.msgList[currIndex].msg_type)) {
        return false
      }
      this.msgList[currIndex].sendupType = 'sending'
      let dataA = []
      this.msgList[currIndex].path = this.msgList[currIndex].msg_content
      this.msgList[currIndex].type = this.msgList[currIndex].msg_type
      this.msgList[currIndex].name = this.msgList[currIndex].file_name
      dataA.push(this.msgList[currIndex])
      this.uploadFileReq(dataA, this.msgList[currIndex].msg_type, true)
    },
    /** 取消上传 */
    toCancelUploading: function (currIndex) {
      this.msgList[currIndex].cancelFun('cancel')
      // this.msgList.splice(currIndex, 1)
    },
    /** 点赞 与取消点赞  */
    toClickLike: function (currIndex) {
      let that = this
      let value = (that.msgList[currIndex].isLiked) ? 'N' : 'Y' // value：Y点赞/N取消点赞
      let formData = new FormData()
      formData.append('msgId', ((that.msgList[currIndex].msg_id) ? (that.msgList[currIndex].msg_id) : ''))
      formData.append('value', value)
      this.$api.chat.clickLike(formData).then(res => {
        if (res.code === 0) {
          that.msgList[currIndex].isLiked = false
          if (value === 'Y') {
            that.msgList[currIndex].isLiked = true
          }
          if (that.msgList[currIndex].isLiked) {
            that.msgList[currIndex].like_num = ((that.msgList[currIndex].like_num) ? (that.msgList[currIndex].like_num) : 0) + 1
          } else {
            that.msgList[currIndex].like_num = that.msgList[currIndex].like_num - 1
          }
        }
      })
    },
    /** 图片调用input来实现上传 */
    toInputClick: function (type) {
      if (!this.addFileChecked(type)) {
        return false
      }
      if (type && type === 'image') {
        this.$refs.imageInput.click()
      } else if (type && type === 'video') {
        this.$refs.videoInput.click()
      } else if (type && type === 'file') {
        this.$refs.fileInput.click()
      }
    },
    /** 上传附件验证规则-活动未开始或已结束或已禁止  */
    addFileChecked: function (type) {
      if (this.msgCurrData && (this.msgCurrData.activityState === '0' || this.msgCurrData.activityState === '2')) {
        toast('当前活动未开始或者已结束，不可发送消息')
        return false
      }
      // if (this.activityInfo && (this.activityInfo.activityState === '0' || this.activityInfo.activityState === '2')) {
      //   toast('当前活动未开始或者已结束，不可发送消息')
      //   return false
      // }
      if (type === 'image' && this.isAllowFileList.isAllowPic === 'N') {
        toast('当前已禁止发送图片消息')
        return false
      }
      if (type === 'video' && this.isAllowFileList.isAllowVideo === 'N') {
        toast('当前已禁止发送视频消息')
        return false
      }
      if (type === 'file' && this.isAllowFileList.isAllowFile === 'N') {
        toast('当前已禁止发送文件消息')
        return false
      }
      if (type === 'voice' && this.isAllowFileList.isAllowVoice === 'N') {
        toast('当前已禁止发送语音消息')
        return false
      }
      return true
    },
    /** 历史消息，实现上拉加载 */
    handleScrollByHistoryList: function (event) {
      // 滚动的像素 + 容器的高度>可滚动的总高度-100像素
      if ((event.target.scrollTop < 100) && (!this.isLoadingByChat)) {
        let lastId = (this.msgList[0] && this.msgList[0].msg_id) ? (this.msgList[0].msg_id) : ''
        this.findChatList({lastid: lastId}, true)
        this.isLoadingByChat = true
      }
    },
    /** 查询是否可以发送 语音、图片、视频等消息 */
    findIsCanSendFile: function () {
      let that = this
      this.$api.activityAnswerDiscuss.viewAnswerDiscussInfo(that.activityId).then(res => {
        if (res.code === 0) {
          that.activityInfo = (res.data) ? (res.data) : {}
          if (that.activityInfo && that.activityInfo.activityTitle) {
            that.titleNav = that.activityInfo.activityTitle
          }
          that.isAllowFileList.isAllowPic = (res.data && res.data.isAllowPic && res.data.isAllowPic === 'N') ? 'N' : 'Y'
          that.isAllowFileList.isAllowVideo = (res.data && res.data.isAllowVideo && res.data.isAllowVideo === 'N') ? 'N' : 'Y'
          that.isAllowFileList.isAllowVoice = (res.data && res.data.isAllowVoice && res.data.isAllowVoice === 'N') ? 'N' : 'Y'
          that.isAllowFileList.isAllowFile = (res.data && res.data.isAllowFile && res.data.isAllowFile === 'N') ? 'N' : 'Y'
        }
      })
    },
    /**
     *  聊天滚动条在最下方
     */
    scrollToBottom: function () {
      this.$nextTick(() => {
        let container = this.$el.querySelector('.chat_interface_history_list');
        container.scrollTop = container.scrollHeight;
      })
    },
    /**
     *  切换显示群详情
     */
    tapShowChatsDetail: function () {
      this.isShowTheme = false // 主题是否显示
      this.isShowChatsDetail = !this.isShowChatsDetail
      if (this.isShowChatsDetail) {
        if (this.messagingType === 'dytl') {
          this.groupId = this.groupId // 聊天目标id
        } else if (this.messagingType === 'groupchat') { //  群聊
          this.groupId = this.msgCurrData.friend_id // 聊天目标id
        } else if (this.messagingType === 'classroom') { //  群聊
          this.groupId = this.ctId // 聊天目标id
        }
        this.findGroupUserList(this.requestPageByGroupUser, false)
      }
    },
    /** 搜索 群成员 */
    handleSearchTraineeName: function () {
      this.findGroupUserList(this.requestPageByGroupUser, false)
    },
    /**
     *  切换显示主题
     */
    tapShowTheme: function () {
      this.isShowChatsDetail = false
      this.isShowTheme = !this.isShowTheme
    },
    /** 聊天列表消息标记为已读 */
    tagReaded: function () {
      let data = {
        busitypeIndex: 3,
        msg: {
          listId: (this.msgCurrData && this.msgCurrData.list_id) ? (this.msgCurrData.list_id) : '',
          friendId: (this.msgCurrData && this.msgCurrData.friend_id) ? (this.msgCurrData.friend_id) : '',
          friendType: (this.msgCurrData && this.msgCurrData.friend_type) ? (this.msgCurrData.friend_type) : ''
        }
      }
      if (this.messagingType === 'dytl') {
        data.msg.friendId = this.groupId
        data.msg.friendType = '2'
      }
      this.webSockets.sendSocketMessage(data, false)
    },
    /** 获取历史消息 */
    findChatList: function (params, isLazy) {
      if (this.isFindChatList) {
        return false
      }
      this.isFindChatList = true
      let data = {}
      if (this.messagingType && this.messagingType === 'privatechat') { // 私聊
        data = {
          busitypeIndex: 2,
          touser: this.msgCurrData.friend_id // 聊天目标id
        }
      } else if (this.messagingType === 'dytl') {
        data = {
          busitypeIndex: 7,
          toparty: this.groupId, // 聊天目标id
          pkgId: this.pkgId,
        }
      } else if (this.messagingType === 'groupchat') { //  群聊
        data = {
          busitypeIndex: 5,
          toparty: this.msgCurrData.friend_id // 聊天目标id
        }
      } else if (this.messagingType === 'classroom') { //  群聊
        data = {
          busitypeIndex: 9,
          toparty: this.ctId // 聊天目标id
        }
      }
      data.lastid = (params && params.lastid) ? (params.lastid) : ''
      this.isOneInto = isLazy
      if (!isLazy) {
        data.lastid = ''
      }
      data.isLazy = isLazy ? 'true' : 'false'
      this.webSockets.sendSocketMessage(data, false)

      this.webSockets.sendSocketMessage({
        busitypeIndex: 14
      })
    },
    /** 处理 返回的消息数据  */
    handleMessBackData: function (res) {
      let that = this
      let busitypeIndexListpb = -1
      let busitypeIndexSendpb = -1
      let msgTypeName = '-1'
      let msgTypeId = '-1'
      if (that.messagingType === 'privatechat') { // 私聊发送消息
        busitypeIndexListpb = 2
        busitypeIndexSendpb = 1
        msgTypeName = 'send_id'
        msgTypeId = this.msgCurrData.friend_id
      } else if (that.messagingType === 'dytl') { // 答疑讨论发送消息
        busitypeIndexListpb = 7
        busitypeIndexSendpb = 6
        msgTypeName = 'toparty'
        msgTypeId = this.groupId
      } else if (that.messagingType === 'groupchat') { //  群聊 发送消息
        busitypeIndexListpb = 5
        busitypeIndexSendpb = 4
        msgTypeName = 'toparty'
        msgTypeId = this.msgCurrData.friend_id
      } else if (that.messagingType === 'classroom') { //  课堂 发送消息
        busitypeIndexListpb = 9
        busitypeIndexSendpb = 8
        msgTypeName = 'toparty'
        msgTypeId = this.ctId
      }
      // that.$store.getters.getChatDatas && objectIsNotNull(that.$store.getters.getChatDatas)
      if ((res.busitypeIndexNew === busitypeIndexListpb || res.busitypeIndexNew === busitypeIndexSendpb) &&  localStorage.getItem('setChatDatas') && localStorage.getItem('setChatDatas') !== undefined && JSON.parse(localStorage.getItem('setChatDatas')) && objectIsNotNull(JSON.parse(localStorage.getItem('setChatDatas')))   ) { // 获取 历史消息
        if (res.code === 0) {
          if (res.data && res.data.msg) {
            if (!that.isOneInto && res.busitypeIndexNew === busitypeIndexListpb) {
              that.msgList = []
            }
            if (res.data.msg && res.data.msg.length > 0) {
              if (res.busitypeIndexNew === busitypeIndexSendpb) { // 收到消息
                for (let i = 0; i < res.data.msg.length; i++) {
                  // res.data.msg[i][msgTypeName] == msgTypeId
                  
                  if ((that.messagingType === 'privatechat' && (res.data.msg[i][msgTypeName] === msgTypeId || res.data.msg[i][msgTypeName] === that.userInfo.traineeId)) || (that.messagingType !== 'privatechat' && res.data.msg[i][msgTypeName] === msgTypeId)) {

                    // let sendSucListM = []; // 发送成功的 数组
                    // if (that.msgList && that.msgList.length > 0) {
                    //   sendSucListM = that.msgList.filter(item=> (item.sendupType && item.sendupType == 'sended'));
                    // }
                    // // 对进度条100的时间 进行排序
                    // let sortListM = sortListByProperty(sendSucListM,'percentOneHundredTime');
                    
                  
                    let delIndex = that.findIndexFromMsgListComm('percent', 100)
                    if (delIndex > -1) {
                      that.msgList.splice(delIndex, 1);
                    }

                    // if (sortListM && sortListM[0] && sortListM[0].currTempIndex > -1) {
                    //   that.msgList.splice(sortListM[0].currTempIndex, 1);
                    // }

                    // res.data.msg[i].send_time_old = res.data.msg[i].send_time
                    if (that.msgList && that.msgList.length > 0) {
                      res.data.msg[i].send_time = getMsgTime(res.data.msg[i].send_time_old, true, that.msgList[that.msgList.length - 1].send_time_old, null)
                    } else {
                      res.data.msg[i].send_time = getMsgTime(res.data.msg[i].send_time_old)
                    }
                    res.data.msg[i].msg_content = res.data.msg[i].msg_content.replace(/(\r\n|\n|\r)/gm, "<br />");
                    that.msgList.push(res.data.msg[i])

                    

                    that.tagReaded()
                  }
                }
              } else if (res.busitypeIndexNew === busitypeIndexListpb) {
                for (let i = 0; i < res.data.msg.length; i++) {
                  res.data.msg[i].msg_content = res.data.msg[i].msg_content.replace(/(\r\n|\n|\r)/gm, "<br />");
                  // res.data.msg[i].send_time_old = res.data.msg[i].send_time
                  if (that.msgList && that.msgList.length > 0) {
                    that.msgList[0].send_time = getMsgTime(that.msgList[0].send_time_old, true, res.data.msg[i].send_time_old, null)
                  }
                  res.data.msg[i].send_time = getMsgTime(res.data.msg[i].send_time_old)
                  that.msgList.unshift(res.data.msg[i])
                }

                if (that.msgList && that.msgList.length > 0 && !that.isAddNewMsgLocation) {
                  let noreadIndex = -1
                  for (let i2 = (that.msgList.length - 1); i2 >= 0; i2--) {
                    // read_state 1未读2已读
                    if (that.msgList[i2].read_state && that.msgList[i2].read_state === '2') {
                      noreadIndex = i2
                      break
                    }
                  }
                  if (noreadIndex > -1 && noreadIndex !== (that.msgList.length - 1)) {
                    that.isAddNewMsgLocation = true
                    that.msgList.splice(noreadIndex + 1, 0, {
                      qdOtherType: 'newMsgTopLocation'
                    })
                    that.tagReaded()
                  } else {
                    if (!that.isOneInto && res.data.msg.length < 10) {
                      that.tagReaded()
                    }
                  }
                }
              }
            } else {
              if (that.isOneInto && that.msgList && that.msgList[0] && that.msgList[0].read_state && that.msgList[0].read_state === '1') {
                that.tagReaded()
              }
            }
            if (!that.isOneInto && res.busitypeIndexNew === busitypeIndexListpb && !that.isLoadingByChat) {
              that.scrollToBottom()
            }
          }
        }
      }
      that.isLoadingByChat = false
      that.isFindChatList = false
    },
    //去重
    unique(arr){
        return Array.from(new Set(arr));
    },
    //获取拖拽的文件并上传
    enentDrop: function(e){
      e.stopPropagation();
      e.preventDefault();  //必填字段
      let fileData = [...e.dataTransfer.files];
      this.uploadFileReq(fileData,'file',false);
    },
  },
  mounted () {
    //获取表情
    this.emoji = [];
    for(let i in data){
      this.emoji.push(data[i]);
    }
    //监听文件拖拽到聊天框内
    let chat = document.querySelector('.chat-record-area');
    chat.addEventListener("drop",this.enentDrop,false)
    chat.addEventListener("dragleave",function (e) {
      e.stopPropagation();
      e.preventDefault();
    })
    chat.addEventListener("dragenter",function (e) {
      e.stopPropagation();
      e.preventDefault();
    })
    chat.addEventListener("dragover",function (e) {
      e.stopPropagation();
      e.preventDefault();
    })
  },
  created () {
    let that = this
    window.eventBus.$on('eventBusReceivedMsgData', function (data) {
      that.handleMessBackData(data)
    })
    this.scrollToBottom()
  },
  // 每次页面渲染完之后滚动条在最底部
  updated: function () {
    //this.scrollToBottom()
  }
}
</script>

<style scoped>
  .chat_interface_wrapper{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .chat_interface_wrapper .b-sidebar{
    position:absolute !important;
  }

  .chats_detail_wrapper{
    border-bottom: 1px solid #E7E7E7;
    border-left: 1px solid #E7E7E7;
    height: 100%;
    width: 40%;
    overflow-y: scroll;
    background-color: #fafafa;
  }

  
   /* 动画效果 */
  .chatsDetail-leave ,
  .chatsDetail-enter-to{ width: 40%; opacity: 1; }
  .chatsDetail-leave-active,
  .chatsDetail-enter-active { transition: all 0.7s; }
  .chatsDetail-leave-to,
  .chatsDetail-enter { width: 0%; opacity: 0; }
  /* .chatsDetail-enter { width: 0%; opacity: 0; } */
  /* .chatsDetail-enter-active { transition: all 1s; } */
  /* .chatsDetail-enter-to { width: 40%; opacity: 1; } */

  .chats_detail_wrapper .group-user-count{
    position: relative;
    width: 90%;
    /* margin:10px auto 5px; */
    height: 45px;
    line-height: 45px;
    margin: 0 auto;
  }

  .chats_detail_wrapper .search-box{
    position: relative;
    width: 90%;
    height: 35px;
    line-height: 35px;
    /* margin: -5px auto 10px; */
    margin: 10px auto 10px;
  }
  .chats_detail_wrapper .search-box >input{
    width:90%;
    height:31px;
    line-height: 31px;
    border: 0;
    font-size: 16px;
    outline: none;
    background-color: inherit;
  }
  .chats_detail_wrapper .search-box > img{
    cursor: pointer;
    position: absolute;
    top:3px;
    right:10px;
  }
  ::-webkit-input-placeholder{
    color: #bbb;
  }

  .chats_detail_wrapper .group-user-list{
    height: calc(100% - 55px) !important;
    /* height: calc(100% - 105px) !important; */
    /* height: calc(100% - 135px) !important; */
    overflow-y: scroll;
  }

  .chats_detail_wrapper .group-user-list .group-user-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    cursor: pointer;
    /*overflow: hidden;*/
    position: relative;
  }
  .chats_detail_wrapper .group-user-list .group-user-item:hover{
    background-color: #edf6f9;
  }
  .chats_detail_wrapper .group-user-list .group-user-item .group-user-info{
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    /* width:45%; */
    font-size: 12px;
    padding:0 10px;
  }
  .group-user-list .group-user-item .group-user-info .user-header-img{
    width:30px;
    height:30px;
    border-radius: 50%;
    margin: 0 15px;
    border: 1px solid #959da0;
  }
  .group-user-list .group-user-item .group-user-info .group-name .mobile{
    color: #aaa;
    padding:2px 0;
  }
  .group-user-list .group-user-item .group-user-info:hover .group-name .traineeName{
    /* color: #15c1e0; */
    color: #007bff;
  }

  .classroom-student-state{
    position: absolute;
    top: 0px;
    left:0px;
    width: 50px;
    height:20px;
    font-size: 12px;
    line-height:20px;
    text-align: center;
    background-color: #ff767c;
    color: #fff;
  }
  .chats_detail_wrapper .scroll-btn{
    width: 100%;
    height:50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #E7E7E7;
    border-bottom: 1px solid #f6f6f6;
  }
  .chats_detail_wrapper .scroll-btn > img{
    margin-right:20px;
    cursor: pointer;
  }

  .chat_interface_history_list{
    border-bottom: 1px solid #E7E7E7;
    overflow-y: scroll;
    padding: 0 10px;
  }
  .chat_interface_title{
    /*background-color: #FAFAFA;*/
    padding: 10px;
    border-bottom: 1px solid #E7E7E7;
    height: 45px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .chat_interface_title_arr:hover{
    color:#fd7512 ;
  }
  .chat_interface_title_label{
    flex: 1;
    padding-right: 20px;
  }
  .chat_interface_title_arr{
    display: flex;
    align-items: center;
    width: auto;
    padding: 0 10px;
  }
  .chat_interface_title_arr .chat_interface_title_arr_img{
    width: 20px;
    height: 20px;
    margin-right: 5px;
    display: flex;
    align-content: center;
  }
  .chat_interface_title_arr .chat_interface_title_arr_img img{
    width: 100%;
    height: 100%;
    background-color: #c9c9c9;
    border-radius: 50%;
  }
  .chat_interface_title_icon{
    font-size: 20px;
    margin-right: 5px;
  }
  .chat_interface_title_content{
    padding: 10px;
    border-radius:0 0 5px 5px;
    box-sizing: border-box;
    box-shadow: 0 2px 2px 1px rgba(0,0,0,0.15);
    font-size: 14px;
    left: 2px;
    right: 2px;
    position: absolute;
    z-index: 20;
  }
  .bg_white {
    background-color: #FFF !important;
  }
  .bg_black{
    background-color: #000 !important;
  }
  .bg_blue {
    background-color: #007bff !important;
  }
  .bg_blue_light {
    background-color:#007bffc0 !important;
  }
  .bg_orange {
    background-color: #fd7512 !important;
  }
  .bg_red{
    background-color:#F00 !important;
  }
  .w_white {
    color: #FFF !important;
  }
  .w_green {
    color: #11b928 !important;
  }
  .w_blue {
    color: #007bff !important;
  }
  .w_noedit{
    color: #353535 !important;
  }
  .w_orange {
    color: #fd7512 !important;
  }
  .w_gray {
    color: #959595 !important;
  }
  .w_red{
    color: #F00 !important;
    /* #e64340; */
  }
  .bg_gray_light{
    background-color: #FAFAFA !important;
  }
  .bg_gray{
    background-color: #efeef4 !important;
  }
  /*单行超出隐藏*/
  .hide_single {
    /*letter-spacing: 2px;  字间距*/
    display:block;/*内联对象需加*/
    /*width:5em;指定宽度*/
    word-break:keep-all;/* 不换行 */
    white-space:nowrap;/* 强制在同一行内显示所有文本,直到文本结束或者遭遇 br 对象。不换行 */
    overflow:hidden !important;/* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow:ellipsis;
  }
  /**多行超出显示省略号*/
  .hide_double{
    display: -webkit-box;
    overflow: hidden !important;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;/*这是设置显示的多少行 */
  }
  .icon_wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    vertical-align: middle;
  }
  .dytl_center_time{
    text-align: center;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .time {
    color: #959595;
    font-size: 12px;
  }
  .dytl_center_wrapper{
    display: flex;
    justify-content: space-between;
    padding: 3px 10px;
    box-sizing: border-box;
  }
  .dytl_center_userimg{
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
  .dytl_center_content{
    width: calc(100% - 50px);
    padding-top: 3px ;
    box-sizing: border-box;
  }
  .msg_content{
    display: flex;
    align-items: flex-end;
  }
  .qibao{
    padding: 5px 10px;
    box-sizing: border-box;
    max-width: 75%;
    box-sizing: border-box;
    position: relative;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  .qibao_left{
    border-top-left-radius: 0;
    margin-right: 5px;
  }
  .qibao_right{
    border-top-right-radius: 0;
    margin-left: 5px;
  }

  .width_image{
    /* width: 30%; */
    width: 100px;
    /*min-height: 100px;*/
    padding: 0;
    border: 1px solid #efeef4;
  }
  .width_file{
    /*width: 75%;*/
    max-width: 350px;
    min-height: 28px;
  }
  .width_video{
    padding: 0;
    /* border: 2rpx solid #efeef4; */
  }
  .msg_audio{
    display: flex;
    align-items: center;
    height: 25px;
  }
  .msg_dianzan{
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    margin-right: 5px;
    cursor: pointer;
  }

  .msg_isuser{
    flex-direction: row-reverse;
    text-align: right;
  }
  .name_wrapper{
    margin-bottom: 5px;
  }
  .biaoqian{
    display: inline-block;
    box-sizing: border-box;
    padding: 0.5px 5px;
    margin-right: 5px;
    background-color: #fd7512;
    color: #fff;
    font-size: 12px;
  }
  /* 正在播放录音样式 begin */
  .speeking_text{
    width: 0px;
    /* background-color: initial; */
    height: 100%;
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .speeking_anim{
    animation: speeking_anim 1s linear infinite;
  }
  @keyframes  speeking_anim{
    0% { width: 100% ; }
    100% { width: 0px; }
  }
  /* 正在播放录音样式 end */

  /* 文件的 显示样式begin */
  .file_wrapper{
    text-align: left;
    padding: 2px;
    box-sizing: border-box;
  }
  .file_name_wrapper{
    display: flex;
    justify-content: space-between;
  }
  .file_progress{
    margin-top: 7px;
  }
  .file_name{
    flex: 1;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .file_size{
    padding-top: 5px;
  }
  .file_icon_wrapper{
    width: 35px;
    height: 40px;
    border: #efeef4 solid 1px;
  }
  /* 文件的 显示样式end */

  .turnLoading{
    animation:turn 1s linear infinite;
  }
  @keyframes turn{
    0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}
  }

  .video_wrappers{
    position: relative;
    width: 100px;
    height: 100px;
    background-color: #000;
  }
  .video_wrappers .icon_wrapper{
    position: absolute;
    top:0;
    left: 0;
  }
  .qibao_right .video_wrappers .img{
     border-radius: 5px 0 5px 5px;
   }
  .qibao_left .video_wrappers .img{
    border-radius: 0px 5px 5px 5px;
  }
  .msg_text{
    min-height: 15px;
    min-width: 15px;
    text-align:left;
    padding:1px 0;
    word-wrap: break-word;
  }
  .notime_dytl_center_wrapper{
    margin-top: 10px;
  }
  /* 消息end */

  .class-message-content{
    height: 150px;
  }
  /* 输入栏样式 */
  .discuss-input-tool{
    height: 30px;
    line-height: 30px;
    width: 90%;
    /*margin-left: 5%;*/
    margin-left: 10px;
  }
  .discuss-input-tool > span{
    font-size: 20px;
    cursor: pointer;
    color: #959595;
    margin-right: 2px;
  }
  .discuss-input-tool > span:hover{
    color: #007bff;
  }
  .discuss-input-tool > span:active{
    color: #4c4c4c;
  }
  .discuss-input-write{
    height: calc(100% - 65px);
    resize: none;
    width: 95%;
    /*margin-left: 5%;*/
    margin-left: 10px;

    border-style: none;
    outline:none;
    overflow-y:scroll;
  }
  .discuss-input-write .textarea{
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
    /*margin-left: 5%;*/
    width: 90%;
    height: 35px;
    margin-left: 9%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
  .discuss-input-btn button{
    background-color: #ffffff;
    border: none;
    /* border: 1px solid #e5e5e5; */
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
    /* color: #ffffff;
    background-color: #11b928; */
    color: #007bff;
  }
  .discuss-input-btn button:active{
    color: #007bff;
    /* color: #1E9FFF; */
  }

  /* 修改滚动条样式 */
  body::-webkit-scrollbar{
    width: 6px;
    background-color: #fff;
  }
  body::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);
    background:  rgba(0,0,0,0.2);
  }
  body::-webkit-scrollbar-track {
    background: #f5f5f5;
    -webkit-box-shadow:none;
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
  /* 表情 */
  #emojiBtn{
    border: none;
    padding-right: 0px;
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
  #emojiBtn:hover{
    background-color: white;
  }
  .emotionList{
    display: flex;
    flex-wrap: wrap;
    padding:5px;
  }
  .emotionItem{
    width:10%;
    font-size:20px;
    text-align:center;
  }
  /*包含以下四种的链接*/
  .emotionItem {
    text-decoration: none;
  }
  /*正常的未被访问过的链接*/
  .emotionItem:link {
    text-decoration: none;
  }
  /*已经访问过的链接*/
  .emotionItem:visited {
    text-decoration: none;
  }
  /*鼠标划过(停留)的链接*/
  .emotionItem:hover {
    text-decoration: none;
  }
  /* 正在点击的链接*/
  .emotionItem:active {
    text-decoration: none;
  }  

  /** 答疑讨论 时  的 群成员 样式 */
  .chat_other_dytl{
    width: 80%;
  }
  .chats_detail_wrapper_dytl{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20%;
  }
</style>
