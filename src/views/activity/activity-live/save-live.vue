<!-- 新增头脑风暴活动页面 -->
<template>
  <div v-if="!isView" class="storm-mind brainstorming-box">
    <!-- 当前位置路径导航开始 -->
    <div class="present-localtion">
      <!-- 当前位置显示开始 -->
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
      </div>
      <!-- 当前位置显示结束 -->
      <!-- 返回显示开始 -->
      <div class="classroom-back">
        <!-- 返回图标 -->
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
        <!-- 返回文字 -->
        <span @click="goToPageActivityList()">返回</span>
      </div>
      <!-- 返回显示结束 -->
    </div>
    <!-- 当前位置路径导航结束 -->
    <!-- 提交表单开始 -->
    <form>
      <!-- 标题开始 -->
      <div style="width: 95%;margin: 20px auto;display: flex;">
        <div style="width: 48%;">
          <!-- 标题文字 -->
          <div style="text-align: left">活动主题</div>
          <!-- 标题输入框 -->
          <el-input
            :disabled="presentIsEditStates"
            v-model="dataForm.activityTitle"
            id="brainstormingTitle"
            type="text"
            placeholder="请输入轻直播活动主题"
            style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
          <!-- 错误提示 -->
          <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingTitleHint"><small >请填写活动主题！</small></div>
        </div>
        <!--<div style="width: 48%;margin-left:4%;">
          <div style="text-align: left">所属章节</div>
          <div style="margin-top: 9px">
            <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="dataForm.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || isView">
            </el-cascader>
          </div>
        </div>-->

      </div>
      <!-- 标题结束 -->

      <!-- 主题、基本信息的填写和操作按钮开始 -->
      <div style="width: 100%;font-size: 14px;padding-bottom: 5px;">
        <!-- 主题开始 -->
        <div style="width: 95%;margin: 20px auto">
          <!-- 主题文字 -->
          <div style="text-align: left">活动介绍</div>
          <!-- 主题文本输入域 -->
          <el-input
            type="textarea"
            :disabled="presentIsEditStates"
            v-model="dataForm.content"
            id="brainstormingContent"
            rows="5"
            cols="100"
            placeholder="请输入轻直播活动介绍"
            maxlength="3000"
            style="margin-top: 10px;font-size: 14px;"></el-input>
          <!-- 主题字数提示 -->
          <!--<div style="font-size: 14px;text-align: left;">最多3000字</div>-->
          <!-- 错误提示 -->
          <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingContentHint"><small >请填写活动介绍！</small></div>
        </div>
        <!-- 主题结束 -->

        <!-- 温馨提示 -->
        <!--<div style="font-size: 14px;color: #ff5524;text-align: left;width: 95%;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>-->
        <!-- 操作按钮开始 -->
        <div style="width: 94%;margin: 20px 3%;text-align: center" v-if="!presentIsEditStates">
          <!-- 确定提交按钮 -->
          <button
            v-if="!presentIsEditStates"
            @click="sureCreateLive"
            type="button"
            :disabled="isViewSave"
            class="btn btn-outline-primary"
            style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
          <!-- 返回取消按钮 -->
          <button
            @click="handleCancelCreateLive"
            type="button"
            class="btn btn-outline-secondary"
            style="font-size: 14px;width: 100px;margin-left: 10px">{{presentIsEditStates?'返回':'取消'}}</button>
        </div>
        <!-- 操作按钮结束 -->
      </div>
      <!-- 主题、基本信息的填写和操作按钮结束 -->
    </form>
    <!-- 提交表单结束 -->
  </div>
  <div v-else>
    <!-- 当前位置路径导航开始 -->
    <div class="present-localtion">
      <!-- 当前位置显示开始 -->
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
      </div>
      <!-- 当前位置显示结束 -->
      <!-- 返回显示开始 -->
      <div class="classroom-back">
        <!-- 返回图标 -->
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
        <!-- 返回文字 -->
        <span @click="goToPageActivityList()">返回</span>
      </div>
      <!-- 返回显示结束 -->
    </div>

    <!--推流-->
    <div v-if="activityItem.isRoomCreator">
      <div class="push-area">
        <video id="rtc_media_player" height="400" width="900" autoplay muted></video>
      </div>
      <!-- 操作按钮开始  -->
      <div style="width: 94%;margin: 20px 3%;text-align: center">
        <button class="btn btn-outline-primary" id="btn_publish1" type="button" @click="startPublish1" style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">摄像头直播</button>
        <button class="btn btn-outline-secondary" id="btn_publish2" type="button" @click="startPublish2" style="font-size: 14px;width: 100px;margin-left: 10px">共享屏幕</button>
      </div>
    </div>
    <!--播放 -->
    <div v-else>
      <!--<button class="btn btn-primary" id="btn_play" @click="startPlay">播放视频</button>-->
      <video id="rtc_media_player2" controls autoplay></video>
    </div>

    <div style="display: none;">
      <input type="text" id="txt_url" class="input-xxlarge" value="">
      SessionID: <span id='sessionid'></span>
      SessionIDForPlay: <span id='sessionidplay'></span>
      Audio: <span id='acodecs'></span><br/>
      Video: <span id='vcodecs'></span>
    </div>
  </div>
</template>

<script>
// 导入一些显示工具
import {toast, formVaildStyle, formInVaildStyle} from '@/utils/global'
export default {
  name: 'SaveLive',
  components: {},
  props: {
    activityItem: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    // 教学包id
    pkgId: {
      type: String,
      required: true
    },
    // 是否处于查看状态
    presentIsEditStates: {
      type: Boolean,
      required: true
    },
    // 活动主键，修改、查看、时必传
    activityId: {
      type: String,
      required: true,
      default: ''
    },
    // 是否为编辑状态，编辑状态下，原有的题目不允许修改题目类型
    isEdit: {
      type: Boolean,
      required: true,
      default: true
    },
    // 所属章节
    chapterId: {
      type: String,
      required: true,
      default: ''
    },
    // 课程id
    subjectId: {
      type: String,
      required: true,
      default: ''
    },
    // 是否为查看状态，所有按钮禁用，也不允许输入任何文本
    isView: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      pageTitle: '轻直播', // 页面名字
      sdk: null,
      props: {
        checkStrictly: true,
        value: 'chapterId',
        label: 'chapterName'
      },
      disabledSelectTree: false, // 是否禁选下拉树
      zNodes: [], // 章节树形图数据
      brainstormingUploadPic: '', // 上传头像
      // 轻直播信息
      dataForm: {
        activityId: '', // 活动id
        resgroupId: '0', // 分组id
        activityTitle: '', // 活动主题
        content: '', // 活动内容
        chapterId: '', // 章节id
        purpose: '', // 经验值
        file: '', // 活动图片
        sortNum: 0, // 排序
        resgroupName: '' // 分组名称
      },
      isViewSave: false // 是否禁用新增按钮
    }
  },
  created () {
    // 查询活动基本信息
    if (this.activityId) {
      this.$api.activityLive.viewLive({activityId: this.activityId}).then(res => {
        if (res.code === 0) {
          this.dataForm = res.data
        }
      })
    }
  },
  mounted () {
    let that = this
    if (this.activityItem.isRoomCreator) {
      $('#rtc_media_player').hide();
      var query = parse_query_string();
      srs_init_rtc("#txt_url", query);
      console.log(query)
      if (query.autostart === 'true') {
        startPublish();
      }
    }
    if (!this.activityItem.isRoomCreator) {
      $('#rtc_media_player').hide();
      var query = parse_query_string();
      srs_init_rtc("#txt_url", query);

      $("#btn_play").click(function() {
        $('#rtc_media_player').prop('muted', false);
        that.startPlay();
      });

      if (query.autostart === 'true') {
        $('#rtc_media_player').prop('muted', true);
        console.warn('For autostart, we should mute it, see https://www.jianshu.com/p/c3c6944eed5a ' +
          'or https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#audiovideo_elements');

        that.startPlay();
      }

      that.startPlay();

    }
  },
  methods: {
    startPublish2 () {
      const that = this
      $('#rtc_media_player').show()
      console.log('1', that.sdk)
      // Close PC when user replay.
      if (that.sdk) {
        that.sdk.close()
      }
      console.log('2 that.sdk', that.sdk)
      that.sdk = new SrsRtcPublisherAsync()
      console.log('3', that.sdk)
      // User should set the stream when publish is done, @see https://webrtc.org/getting-started/media-devices
      // However SRS SDK provides a consist API like https://webrtc.org/getting-started/remote-streams
      $('#rtc_media_player').prop('srcObject', that.sdk.stream)
      // Optional callback, SDK will add track to stream.
      // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };
      // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/WebRTC_codecs#getting_the_supported_codecs
      that.sdk.pc.onicegatheringstatechange = function (event) {
        if (that.sdk.pc.iceGatheringState === 'complete') {
          $('#acodecs').html(SrsRtcFormatSenders(that.sdk.pc.getSenders(), 'audio'))
          $('#vcodecs').html(SrsRtcFormatSenders(that.sdk.pc.getSenders(), 'video'))
        }
      }
      // For example: webrtc://r.ossrs.net/live/livestream
      var url = $('#txt_url').val() + '/' + that.activityItem.activityId
      console.log('推流地址', url)
      console.log('sdk', that.sdk)
      that.sdk.publish(url).then(function (session) {
        $('#sessionid').html(session.sessionid)
        $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid)
      }).catch(function (reason) {
        that.sdk.close()
        $('#rtc_media_player').hide()
        console.error(reason)
      })
    },
    startPublish1 () {
      let that = this
      $('#rtc_media_player').show()

      // Close PC when user replay.
      if (that.sdk) {
        that.sdk.close()
      }
      var sdk = that.sdk
      sdk = new SrsRtcPublisherAsync()

      // User should set the stream when publish is done, @see https://webrtc.org/getting-started/media-devices
      // However SRS SDK provides a consist API like https://webrtc.org/getting-started/remote-streams
      $('#rtc_media_player').prop('srcObject', sdk.stream)
      // Optional callback, SDK will add track to stream.
      // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };

      // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/WebRTC_codecs#getting_the_supported_codecs
      sdk.pc.onicegatheringstatechange = function (event) {
        if (sdk.pc.iceGatheringState === 'complete') {
          $('#acodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), 'audio'))
          $('#vcodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), 'video'))
        }
      }

      // For example: webrtc://r.ossrs.net/live/livestream
      var url = $('#txt_url').val() + '/' + that.activityItem.activityId
      sdk.publish(url, 1).then(function (session) {
        $('#sessionid').html(session.sessionid)
        $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid)
      }).catch(function (reason) {
        sdk.close()
        $('#rtc_media_player').hide()
        console.error(reason)
      })
    },
    startPlay () {
      let that = this
      $('#rtc_media_player2').show();

      // Close PC when user replay.
      if (that.sdk) {
        that.sdk.close();
      }
      let sdk = that.sdk
      sdk = new SrsRtcPlayerAsync();

      // https://webrtc.org/getting-started/remote-streams
      $('#rtc_media_player2').prop('srcObject', sdk.stream);
      // Optional callback, SDK will add track to stream.
      // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };

      // For example: webrtc://r.ossrs.net/live/livestream
      var url = $("#txt_url").val() + '/' + that.activityItem.activityId;
      console.log('播放地址', url)
      sdk.play(url).then(function(session){
        $('#sessionidplay').html(session.sessionid);
        $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid);
      }).catch(function (reason) {
        sdk.close();
        $('#rtc_media_player2').hide();
        console.error(reason);
      });
    },

    /**
       * 存入当前选择的章节id
       * @param treeNode
       * @param nodes
       * @param isMultiple
       */
    onclick (treeNode, nodes, isMultiple) {
      this.dataForm.chapterId = treeNode.chapterId
    },

    /**
       * 返回到活动主页面
       */
    goToPageActivityList () {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false)
    },

    /**
       * 头脑风暴表单验证
       * @returns {boolean}
       */
    formBrainstormingVerifyBoolean () {
      // 活动主题验证
      if (!this.dataForm.activityTitle) {
        // 出现提示
        formInVaildStyle('.brainstormingTitleHint', '#brainstormingTitle')
        $('#brainstormingTitle').css('borderColor', '#dc3545')
        return false
      }
      // 清除提示
      $('#brainstormingTitle').removeAttr('style')
      formVaildStyle('.brainstormingTitleHint', '#brainstormingTitle')
      // 活动内容验证
      if (!this.dataForm.content) {
        formInVaildStyle('.brainstormingContentHint', '#brainstormingContent')
        $('#brainstormingContent').css('borderColor', '#dc3545')
        return false
      }
      $('#brainstormingContent').removeAttr('style')
      formVaildStyle('.brainstormingContentHint', '#brainstormingContent')
      // 图片验证
      if (!this.dataForm.activityTitle) {
        formInVaildStyle('.brainstormingFileHint', '#brainstormingFile')
        return false
      }
      formVaildStyle('.brainstormingFileHint', '#brainstormingFile')
      // 分组验证
      if (!this.dataForm.resgroupId) {
        formInVaildStyle('.brainstormingGroupHint', '#brainstormingGroup')
        return false
      }
      formVaildStyle('.brainstormingGroupHint', '#brainstormingGroup')
      return true
    },

    /**
       * 清除头脑风暴表单信息
       */
    clearCreateLiveInfo () {
      this.brainstormingUploadPic = ''
      this.dataForm = {
        activityId: '',
        resgroupId: '',
        activityTitle: '',
        content: '',
        chapterId: '',
        purpose: '',
        file: ''
      }
      // 调用返回到活动主页面事件
      this.goToPageActivityList()
    },

    /**
       * 取消创建头脑风暴
       */
    handleCancelCreateLive () {
      this.clearCreateLiveInfo()
    },

    /**
       * 确定创建头脑风暴
       */
    sureCreateLive () {
      // 验证并提交
      if (this.formBrainstormingVerifyBoolean()) {
        this.isViewSave = true
        // 创建提交对象
        let postData = {
          activityId: this.dataForm.activityId,
          activityTitle: this.dataForm.activityTitle,
          content: this.dataForm.content,
          pkgId: this.$parent.pkgId
        }
        // 调用提交方法
        this.$api.activityLive.save(postData).then(res => {
          if (res.code === 0) {
            // 调用主活动页活动刷新方法
            this.$parent.getListActivity()
            this.$emit('updateInfo')
            // 提示成功信息
            toast(res.msg)
            // 当前表单数据
            this.clearCreateLiveInfo()
          } else {
            toast(res.msg)
          }
          this.isViewSave = false
        })
      }
    }

  }
}

</script>

<style scoped>
  .push-area {
    height: 400px;
    background-image: url('/static/image/banner1.png');
    /* background-size: 100% 1000%; */
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
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
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  .brainstorming-upload{
    display: flex;
    align-items: center;
  }
  .brainstorming-upload-file{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:200px;
    height:40px;
    border: 2px solid #1296db;
    color: #1296db;
    cursor: pointer;
    margin-right:20px;
    padding: 0 25px;
  }
  .brainstorming-upload-file > span{
    font-size: 16px;
  }
  .brainstorming-upload-file .brainstorming-file{
    position: absolute;
    top:0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity:0;
    filter:Alpha(opacity=0);
  }
  .brainstorming-upload .upload-file-hint{
    font-size: 16px;
  }
  .upload-img-box{
    width: 120px;
    height:80px;
  }
  .brainstorming-box .upload-img-box > img{
    width: 120px;
    height:80px;
    margin:8px 0;
  }
</style>
