<!-- 答疑讨论活动页面 -->
<template>
    <div class="write-answer-discuss">
        <!------------ 导航路径区域开始 ------------->
      <!-- <div class="location">
        <div style="display: flex;width: 50%">
          <div class="localtion-title">
            <b>当前位置:</b>
          </div>
          <ul class="localtion-list">
            <li class="localtion-item" style="cursor: pointer" @click="goToPageActivityList">
              活动
            </li>
            <li class="localtion-item">
              <span style="color: #959da0">{{viewActivityInfo.activityTitle}}</span>
            </li>
          </ul>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
          <span @click="goToPageActivityList()">返回</span>
        </div>
      </div> -->
        <!------------ 导航路径区域结束 ------------->
        <!-- 位置导航模块开始 -->
        <div class="present-localtion">
          <div>
            当前位置：<a class="cursor" @click="goToPageActivityList">活动</a> > <span class="present-localtion-title">{{viewActivityInfo.activityTitle}}</span>
          </div>
          <div class="classroom-back">
            <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
            <span @click="goToPageActivityList()">返回</span>
          </div>
        </div>
        <!-- 位置导航模块结束 -->
        <!------------ 答疑讨论区域开始 ------------->
        <div class="discuss">
<!--            &lt;!&ndash; 讨论的标题 &ndash;&gt;-->
<!--            <div class="discuss-title">-->
<!--                {{viewActivityInfo.activityTitle}}讨论组-->
<!--                <span-->
<!--                  class="iconfont icon-jiantouarrow483"-->
<!--                  :class="['iconfont',isShowTheme?'icon-jiantouarrowhead7':'icon-jiantouarrow483']"-->
<!--                  @click="switchShowTheme">主题</span>-->
<!--                &lt;!&ndash; 讨论的主题 &ndash;&gt;-->
<!--                <div class="discuss-theme" v-show="isShowTheme">-->
<!--                  {{viewActivityInfo.content}}-->
<!--                </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 讨论的内容 &ndash;&gt;-->
<!--            <div class="discuss-content">-->
<!--                &lt;!&ndash; 别人的消息 &ndash;&gt;-->
<!--                <div class="discuss-content-others" v-for="(item) in [1,1,1,1,1,1,1,1,1,1,1,1,1]">-->
<!--                    &lt;!&ndash; 时间 &ndash;&gt;-->
<!--                    <div class="others-time">2020/9/2 10:13</div>-->
<!--                    &lt;!&ndash; 头像 &ndash;&gt;-->
<!--                    <div class="others-portrait">-->
<!--                        <img src="static\image\teaching_package\default_activity.png" />-->
<!--                    </div>-->
<!--                    &lt;!&ndash; 消息 &ndash;&gt;-->
<!--                    <div class="others-content bubbleItem">-->
<!--                        <span class="bubble leftBubble">-->
<!--                            我是左边的人-->
<!--                            <span class="bottomLevel"></span>-->
<!--                            <span class="topLevel"></span>-->
<!--                        </span>-->
<!--                    </div>-->
<!--                </div>-->
<!--                &lt;!&ndash; 自己的消息 &ndash;&gt;-->
<!--                <div class="discuss-content-oneself">-->
<!--                    <div class="oneself-time">2020/9/2 10:13</div>-->
<!--                    <div class="oneself-content bubbleItem clearfix" style="line-height: 40px">-->
<!--                        <span style="font-family: Arial, Helvetica, sans-serif;">-->
<!--                        <span class="bubble rightBubble">-->
<!--                            我是右边的人-->
<!--                          <span class="bottomLevel"></span>-->
<!--                          <span class="topLevel"></span>-->
<!--                        </span>-->
<!--                        </span>-->
<!--                    </div>-->
<!--                    <div class="oneself-portrait">-->
<!--                        <img src="static\image\teaching_package\default_activity.png"-->
<!--                             style="height: 40px;width: 40px;border-radius: 10%;cursor: pointer;" />-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 输入区域 &ndash;&gt;-->
<!--            <div class="discuss-input">-->
<!--                &lt;!&ndash; 工具栏 &ndash;&gt;-->
<!--                <div class="discuss-input-tool">-->
<!--                    <span-->
<!--                      class="iconfont icon-tupian1"-->
<!--                      v-if="viewActivityInfo.isAllowPic === 'Y'"-->
<!--                      onclick="this.nextElementSibling.click()"></span>-->
<!--                    <input-->
<!--                      type="file"-->
<!--                      v-show="false"-->
<!--                      accept="image/gif,image/jpeg,image/jpg,image/png"-->
<!--                      @click="">-->
<!--                </div>-->
<!--                &lt;!&ndash; 输入栏 &ndash;&gt;-->
<!--                <div class="discuss-input-write">-->
<!--                    <div contenteditable="true">-->
<!--                    </div>-->
<!--                </div>-->
<!--                &lt;!&ndash; 按钮栏 &ndash;&gt;-->
<!--                <div class="discuss-input-btn">-->
<!--                    <button>发送</button>-->
<!--                </div>-->
<!--            </div>-->


          <chat-interface ref="chatInterface"></chat-interface>


        </div>
        <!------------ 答疑讨论区域开始 ------------->
    </div>
</template>

<script>
import $ from 'jquery';
import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global'
import ChatInterface from '@/components/message-chat-interface/chat-interface'
export default {
  name: "write-answer-discuss",
  components: {
    'chat-interface': ChatInterface
  },
  props: {
    activityInfo: {
      type: Object,
      required: true,
    },
    ctId: {
      type: String,
      required: true,
    },
    pkgId: {
      type: String,
      required: true,
    },
  },
  data() {
    return{
      isShowTheme: true, //主题是否隐藏
      viewActivityInfo:{activityPic:""},//查看答疑讨论题目
      voteQuestionResult:[],//学员的讨论回答
      viewAccessoryList:[], //附件显示列表
      MsgDataCom: {
        msgCurrData: {},
        messagingType: '',
        activityId: '',
        movableImage: ''
      } // 聊天组件要传的参数
    }
  },
  watch: {},
  filter: {
    filterPercent(value){
      return value.split('.')[0];
    },
  },
  methods: {
    /**
     *  返回到活动主页面
     */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false);
    },
    /**
     *  查看活动信息
     * @param activityInfo
     */
    getViewActivityInfo(activityInfo){
      this.$api.activityAnswerDiscuss.viewAnswerDiscussInfo(activityInfo.activityId).then(res => {
        if(res.code === 0){
          this.viewActivityInfo=res.data;
        }
      })
    },
    /**
     *  聊天滚动条在最下方
     */
    scrollToBottom: function () {
      this.$nextTick(() => {
        let container = this.$el.querySelector(".discuss-content");
        container.scrollTop = container.scrollHeight;
      })
    },
    /**
     *  切换显示主题
     */
    switchShowTheme(){
      this.isShowTheme = !this.isShowTheme;
    },

  },
  created () {
    //查看活动信息
    this.getViewActivityInfo(this.activityInfo);
    let that = this
    window.eventBus.$on('eventBusReceivedMsgData', function (data) {
      let res = data
      if (res.busitypeIndexNew === 23 || res.busitypeIndexNew === 24) { // 活动开始、结束
        if (res.code === 0) {
          if (res.data && res.data.msg && res.data.msg.length > 0) {
            for (let i = 0; i < res.data.msg.length; i++) {
              if (res.data.msg[i].ctId && that.ctId && that.ctId === res.data.msg[i].ctId) {
                if (res.busitypeIndexNew === 24 || (res.busitypeIndexNew === 23 && that.viewActivityInfo && that.viewActivityInfo.activityId && res.data.msg[i].activityId && (res.data.msg[i].activityId === that.viewActivityInfo.activityId))) {
                  that.goToPageActivityList()
                }
              }
            }
          }
        }
      }
    })
  },
  mounted () {
    // this.scrollToBottom();
    this.MsgDataCom.messagingType = 'dytl'
    this.MsgDataCom.activityState = this.activityInfo.activityState
    this.MsgDataCom.activityId = this.activityInfo.activityId
    this.MsgDataCom.groupId = this.activityInfo.groupId
    this.MsgDataCom.movableImage = this.activityInfo.activityPic
    this.MsgDataCom.msgCurrData = []
    this.MsgDataCom.ctId = this.ctId
    this.MsgDataCom.pkgId = this.pkgId
    this.MsgDataCom.isShowPageWriteAnswerDiscuss = 'false';
    this.$store.commit('setChatDatas', this.MsgDataCom)
    localStorage.setItem('setChatDatas', JSON.stringify(this.MsgDataCom) );

    // this.$refs.chatInterface.tapShowChatsDetail()
    this.$refs.chatInterface.inShowFun()

  },
  beforeDestroy: function () {
  },
  //每次页面渲染完之后滚动条在最底部
  updated:function(){
    // this.scrollToBottom();
  }
}
</script>

<style scoped>
  .write-answer-discuss{
    width: 100%;
    text-align: left;
  }
  .discuss{
    margin: 20px 20%;
    width: 60%;
    /* width: 90%;
    margin: 20px auto; */
    box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.2);
    /* height: 600px; */
    height: calc(100vh - 150px);
    min-height: 400px;
  }
  /* 返回 */
  .classroom-back{
    text-align: right;
    font-size: 14px;
    cursor: pointer;
    color: #158aeb;
    margin-right: 20px;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 当前位置 */
  .present-localtion{
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 讨论标题样式 */
  .discuss-title{
    background-color: #FAFAFA;
    padding: 10px;
    border-bottom: 1px solid #E7E7E7;
    position: relative;
  }
  .discuss-title > span{
    float: right;
    cursor: pointer;
    font-weight: normal;
  }
  .discuss-title > span:hover{
    color: #f1a723;
  }
  .discuss-title > span:active{
    color: #dfd525;
  }
  /* 讨论主题样式 */
  .discuss-theme{
    position: absolute;
    top: 45px;
    width: 100%;
    background: #FFFFFF;
    right: 0;
    z-index: 101;
    text-indent: 2em;
    padding: 5px;
    font-size: 14px;
  }
  /* 讨论内容样式 */
  .discuss-content{
    height: 350px;
    background-color: #FAFAFA;
    border-bottom: 1px solid #E7E7E7;
    overflow-y: scroll;
  }
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
  /* 输入区域样式 */
  .discuss-input{
    height: 160px;
  }
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
    height: 90px;
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
    background-color: #FAFAFA;
    border: 1px solid #e5e5e5;
    float: right;
    width: 60px;
    height: 25px;
    font-size: 14px;
    line-height: 25px;
    outline:none;
    padding: 0;
    cursor: pointer;
    color: #7c7c7c;
    margin-top: 10px;
  }
  .discuss-input-btn button:hover{
    background-color: #dfd525;
    color: #FFFFFF;
  }
  .discuss-input-btn button:active{
    opacity: 0.5;
  }
  /* 聊天气泡 */
  .bubbleItem{
    width: 82%;
  }
  .bubble{
    max-width: 655px;
    position: relative;
    line-height: 30px;
    padding: 3px 10px 0;
    border-radius: 7px;
    display: inline-block;
  }
  .leftBubble{
    position: relative;
    margin-left: 12px;
    border: 1px solid #00b6b6;
    background-color: #f8fdfc;
  }
  .leftBubble .bottomLevel{
    position: absolute;
    top: 10px;
    left: -10px;
    border-top: 10px solid #00b6b6;
    border-left: 10px solid transparent;
  }
  .leftBubble .topLevel{
    position: absolute;
    top: 11px;
    left: -8px;
    border-top: 10px solid #f8fdfc;
    border-left: 10px solid transparent;
    z-index: 100;
  }
  .rightBubble{
    position: relative;
    margin-top: 2px;
    margin-right: 12px;
    float: right;
    border: 1px solid #aaa;
  }
  .rightBubble .bottomLevel{
    position: absolute;
    top: 11px;
    right: -10px;
    border-bottom: 10px solid #aaa;
    border-right: 10px solid transparent;
  }
  .rightBubble .topLevel{
    position: absolute;
    top: 10px;
    right: -8px;
    border-bottom: 10px solid #FAFAFA;
    border-right: 10px solid transparent;
    z-index: 100;
  }
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
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
</style>
