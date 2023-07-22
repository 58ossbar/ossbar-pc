<!-- 新增作业/小组任务页面 -->
<template>
  <div class="group-tasks">
    <!-- 路径导航开始 -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{ pageTitle }}</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"/>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 路径导航结束 -->
    <!-- 编辑表单开始 -->
    <form>
      <div style="width: 100%;font-size: 14px;">
        <!-- 标题开始 -->
        <div style="width: 95%;margin: 20px auto">
          <div style="text-align: left">活动主题</div>
          <input
            id="groupTasksTitle"
            :disabled="presentIsEditStates"
            v-model="activityGroupTasks.activityTitle"
            type="text"
            class="form-control"
            placeholder="输入活动主题"
            style="font-size: 14px;height: 36px;margin-top: 10px"> <!-- 错误提示 -->
          <div class="invalid-feedback col-10 textAlignLeft p-0 groupTasksTitleHint"><small >请填写活动主题！</small></div>
        </div>
        <!-- 标题结束 -->
        <!-- 内容开始 -->
        <div style="width: 95%;margin: 20px auto">
          <div style="text-align: left">任务详情：</div>
          <textarea
            id="groupTasksContent"
            :disabled="presentIsEditStates"
            v-model="activityGroupTasks.content"
            rows="5"
            cols="100"
            class="form-control"
            placeholder="在此输入本次作业/小组任务的文字描述"
            style="margin-top: 10px;font-size: 14px"/>
          <div class="invalid-feedback col-10 textAlignLeft p-0 groupTasksContentHint"><small >请填写任务详情！</small></div>
        </div>
        <el-upload
          :disabled="presentIsEditStates"
          :limit="5"
          :on-remove="handleRemove"
          :file-list="completeFileList"
          :http-request="tasksFileUpload"
          style="text-align: left;width: 95%;margin: 20px auto"
          class="upload-demo"
          multiple
          action="">
          <el-button size="small" type="primary">添加附件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传五个附件，且不超过300M</div>
        </el-upload>
        <!-- 文件上传结束 -->

        <div style="width: 95%;margin: 10px auto;display: flex">
          <div style="width: 48%;margin-right: 2%">
            <!--<div style="text-align: left">任务小组划分方式：学生将以小组为单位完成该活动，并按小组提交结果</div>-->
            <div style="text-align: left">任务小组划分方式：划分小组学生以小组为单位完成该活动，否则以个人为单位</div>
            <div>
              <select
                :disabled="presentIsEditStates"
                v-model="activityGroupTasks.divideGroupType"
                class="form-control"
                style="font-size: 14px;height: 36px;margin-top: 10px">
                <option
                  v-for="(item,index) in groupTypeList"
                  :key="index"
                  :value="item.dictCode">{{ item.dictValue }}</option>
              </select>
            </div>
          </div>
          <div style="width: 48%;margin-left: 2%">
            <div style="text-align: left">评分方式：可根据实际教学需求，选择对提交结果的评分方式<span style="color: #158aeb;cursor: pointer;" @click="handleDetailsRules">查看详细规则</span></div>
            <div>
              <select
                :disabled="presentIsEditStates"
                v-model="activityGroupTasks.scoreType"
                class="form-control"
                style="font-size: 14px;height: 36px;margin-top: 10px">
                <option
                  v-for="(item,index) in scoreTypeList"
                  :key="index"
                  :value="item.dictCode">{{ item.dictValue }}</option>
              </select>
            </div>
          </div>
        </div>
        <div style="width: 95%;margin: 20px auto;display: flex;">
          <!--<div style="text-align: left">分组</div>
              <div>
                <select
                  id="brainstormingGroup"
                  v-model="activityGroupTasks.resgroupId"
                  class="form-control"
                  style="font-size: 14px;height: 36px;margin-top: 10px">
                  <option
                    :key="index"
                    :value="group.dictCode"
                    v-for="(group,index) in listActivityGroup"
                  >{{group.dictValue}}</option>
                </select>
              </div>-->
          <!-- 活动分组 begin -->
          <!-- <div style="width: 48%;margin-right: 2%">
                <div style="text-align: left">分组</div>
                <div>
                  <select
                    :disabled="presentIsEditStates"
                    id="brainstormingGroup"
                    v-model="activityGroupTasks.resgroupId"
                    class="form-control"
                    style="font-size: 14px;height: 36px;margin-top: 10px">
                    <option
                      :key="index"
                      :value="group.dictCode"
                      v-for="(group,index) in listActivityGroup"
                    >{{group.dictValue}}</option>
                  </select>
                </div>
              </div> -->
          <!-- 活动分组 end -->
          <!-- 所属章节 begin -->
          <div style="width: 48%;">
            <div style="text-align: left">所属章节</div>
            <div style="margin-top: 9px">
              <cb-tree
                :parent-vue="_self"
                :id="'vo-page-tree'+chapterId"
                :z-nodes="zNodes"
                :default-value="activityGroupTasks.chapterId"
                :disabled="disabledSelectTree || isView"
                type="select"
                id-key="chapterId"
                p-id-key="parentId"
                name="chapterName"
                width="50"
                @onclick="onclick"
              />
              <div class="invalid-feedback col-10 textAlignLeft p-0 empiricalValueHint"><small >请选择章节！</small></div>
            </div>
          </div>
          <!-- 所属章节 end -->
        </div>
        <div style="width: 95%;margin: 20px auto">
          <div class="custom-control custom-checkbox" style="text-align: left">
            <input
              id="TaskCheck1"
              :disabled="presentIsEditStates"
              v-model="activityGroupTasks.isSetLastestSubmissionTime"
              true-value="Y"
              false-value="N"
              type="checkbox"
              class="custom-control-input">
            <label class="custom-control-label" for="TaskCheck1">最晚提交日期</label>
            <!--<span style="color: #afafaf">开启后，系统将记录或禁止超时提交作业，“学生互评和“老师评分，组间互评，组内互评类型的作业会在最晚提交时间自动进入评分中。</span>-->
            <span style="color: #afafaf">开启后，可设置最晚提交时间。</span>
          </div>
        </div>
        <div v-show="activityGroupTasks.isSetLastestSubmissionTime === 'Y'" style="width: 95%;margin: 20px auto;text-align: left;">
          <el-date-picker
            v-model="activityGroupTasks.lastestSubmissionTime"
            :picker-options="pickerOptions0"
            :disabled="presentIsEditStates"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <div class="custom-control custom-checkbox" style="text-align: left; margin: 20px auto;">
            <input
              id="TaskCheck3"
              :disabled="presentIsEditStates"
              v-model="activityGroupTasks.isAllowExceedTime"
              true-value="Y"
              false-value="N"
              type="checkbox"
              class="custom-control-input">
            <label class="custom-control-label" for="TaskCheck3">超时提交作业</label>
            <span style="color: #afafaf">开启后，系统将记录或允许超时提交作业。</span>
          </div>
        </div>
        <!--<div class="custom-control custom-checkbox" style="text-align: left">
                <input
                  type="checkbox" class="custom-control-input" id="TaskCheck2">
                <label class="custom-control-label" for="TaskCheck2">设置参考答案</label>
                <span style="color: #afafaf">学生可在互评中或活动结束后查看参考答案。</span>
              </div>-->
        <div style="width: 95%;margin: 20px auto">
          <div style="text-align: left">参考答案：</div>
          <textarea
            :disabled="presentIsEditStates"
            v-model="activityGroupTasks.referenceAnswer"
            rows="5"
            cols="100"
            class="form-control"
            placeholder="在此输入本次作业/小组任务的文字描述"
            style="margin-top: 10px;font-size: 14px"/>
        </div>
        <el-upload
          :disabled="presentIsEditStates"
          :limit="5"
          :on-remove="handleRemoveReferenceAnswer"
          :file-list="answerFileList"
          :http-request="answerFileUpload"
          style="text-align: left;width: 95%;margin: 20px auto"
          class="upload-demo"
          multiple
          action="">
          <el-button size="small" type="primary">添加参考答案附件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传五个附件，且不超过300M</div>
        </el-upload>
      </div>
      <div v-if="!presentIsEditStates" style="width: 94%;margin: 20px 3%;text-align: center">
        <button
          v-if="!presentIsEditStates"
          type="button"
          class="btn btn-outline-primary"
          style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px"
          @click="saveGroupTasks" >确定</button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          style="font-size: 14px;width: 100px;margin-left: 10px"
          @click="cancelGroupTasks">{{ presentIsEditStates?'返回':'取消' }}</button>
      </div>
    </form>
    <!-- 编辑表单结束 -->
    <!-- 详细规则的模态框开始 -->
    <modal-dialog
      id="details-rules-box"
      :is-show-footer-btn="false"
      title="详细规则"
      @submit="handleSubmit">
      <div slot="main" style="text-align: left;">
        人生若只如初见，何事秋风悲画扇
        <!--如果你熟悉h5，但不熟悉vue和小程序
            看完这篇白话uni-app
            DCloud与vue合作，在vue.js官网提供了免费视频教程，也可以直达教程地址：https://learning.dcloud.io
            不需要专门去学习小程序的语法，uni-app使用的是vue的语法，不是小程序自定义的语法。
            如果你使用过mpvue
            几乎不用学习，uni-app对vue语法的支持是mpvue的超集。这里有篇mpvue转uni-app指南
            如果你熟悉小程序，但不熟悉vue
            参考三方总结https://segmentfault.com/a/1190000015684864
            三方培训机构视频
            如下是三方专业培训机构的视频教程
            《uni-app 商业级应用实战》，出品人：腾讯课堂NEXT学院。亮点：腾讯课堂官方出品；不懂 vue 的工程师也可快速学习；从入门到实战都包括。
            《uni-app 跨平台应用开发教程》，出品人：hcoder 刘海君，课时：共25节。亮点：讲师经验丰富，也是graceui框架作者。
            《uni-app 实战教程 - “悦读”项目实战》，出品人：hcoder 刘海君，点击领取专享优惠劵
            《uni-app实战社区交友类app开发》，出品人：帝莎IT学院。适用人群：具备Html+Css+Javascript基础知识。
            《uni-app仿小米商城实战》，出品人：帝莎IT学院。首页使用nvue开发，目前支持app端和小程序端。
            《uni-app多端调试环境配置》，出品人：帝莎IT学院。
            《uni-app实战仿微信app全栈开发》，出品人：帝莎IT学院。
            《uni-app实战视频点播app小程序》，出品人：帝莎IT学院。
            《0基础学unicloud开发，跨端serverless技术》，出品人：林举
            《uni-app 5小时快速入门》，出品人：meHaoTian
            《uni-app 快速入门 从零开始实现新闻资讯类跨端应用》，出品人：meHaoTian-->
      </div>
    </modal-dialog>
    <!-- 详细规则的模态框结束 -->
  </div>
</template>

<script>
import ModalDialog from '@/components/modal-dialog'
import CbTree from '@/components/cb-tree/index'
import { baseUrl, toast, formVaildStyle, formInVaildStyle } from '@/utils/global'
export default {
  name: 'SaveGroupTasks',
  components: {
    CbTree,
    'modal-dialog': ModalDialog
  },
  props: {
    // 教学包主键
    pkgId: {
      type: String,
      required: true
    },
    // 是否处于查看状态
    presentIsEditStates: {
      type: Boolean,
      required: true
    },
    // 所属章节
    chapterId: {
      type: String,
      required: true,
      default: ''
    },
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
    },
    // 是否为编辑状态，编辑状态下，原有的题目不允许修改题目类型
    isEdit: {
      type: Boolean,
      required: true,
      default: true
    },
    // 活动主键，修改、查看、时必传
    activityId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      disabledSelectTree: false, // 是否禁选下拉树
      zNodes: [], // 所有章节数据
      setting: {
        data: {
          key: {
            name: 'chapterName' // zTree 节点数据保存节点名称的属性名称。
          }
        }
      },
      pageTitle: '创建作业/小组任务',
      listActivityGroup: [], // 活动分组列表
      // 限制时间选择
      pickerOptions0: {
        disabledDate(time) {
          // 当天以及当天后的时间可以选择
          return parseInt(time.getTime()) + 86400000 < Date.now()
        }
      },
      fileList: [], // 添加的附件
      completeFileList: [], // 已经上传完的附件
      answerFileList: [], // 已经上传完的答案附件
      mediaIdList: [], // 添加的附件的id集合
      answerMediaIdList: [], // 添加的答案附件的id集合
      groupTypeList: [], // 小组划分方式
      scoreTypeList: [], // 评分方式、作业分值及评分点
      // 提交数据
      activityGroupTasks: {
        pkgId: '',
        activityId: '',
        chapterId: '',
        resgroupId: '0',
        activityTitle: '', // 活动标题
        content: '', // 任务详情
        divideGroupType: '1', // 任务小组划分方式：1/2/3/4
        scoreType: '1', // 评分方式、作业分值及评分点：1/2/3/4
        isSetLastestSubmissionTime: 'N', // 是否设置最晚提交时间
        lastestSubmissionTime: '', // 最晚提交时间
        isAllowExceedTime: 'N', // 是否设置超时提交
        referenceAnswer: '', // 参考答案
        purpose: '' // 用途
      }
    }
  },
  created() {
    // 活动分组
    // this.getListActivityGroup();
    // 获取任务小组划分方式
    this.getDivideGroupType()
    // 获取评分方式、作业分值及评分点
    this.getScoreType()
    // 查询活动基本信息
    if (this.activityId) {
      const formData = new FormData()
      formData.append('activityId', this.activityId)
      this.$api.activityGroupTasks.tasksView(formData).then(res => {
        if (res.code === 0) {
          this.activityGroupTasks = res.data
          this.mediaIdList = []
          this.completeFileList = []
          res.fileList.forEach(element => {
            const fileObj = {
              name: element.originalFilename,
              url: baseUrl + element.fileAccessUrl
            }
            this.completeFileList.push(fileObj)
            this.mediaIdList.push(element.fileId)
          })
          res.answerList.forEach(element => {
            const fileObj = {
              name: element.originalFilename,
              url: baseUrl + element.fileAccessUrl
            }
            this.answerFileList.push(fileObj)
            this.answerMediaIdList.push(element.fileId)
          })
        }
      })
    }
    // 获取课程所有章节
    const params = {
      pkgId: this.pkgId,
      subjectId: this.subjectId
    }
    this.$api.pkgInfo.getBookTreeData(params).then((res) => {
      if (res.code === 0) {
        // this.zNodes.push(res.data);
        this.zNodes = res.data.children
      }
    })
    // 是否选中章节
    // this.disabledSelectTree = !!this.chapterId;
    if (this.chapterId) {
      this.activityGroupTasks.chapterId = this.chapterId
    } else {
      this.disabledSelectTree = false
    }
  },
  methods: {
    /**
       * 跳页面
       */
    goToPageActivityList() {
      this.$parent.changeVotoQuestionnairePage(false)
    },
    /**
       *  存入选中的章节
       */
    onclick(treeNode, nodes, isMultiple) {
      this.activityGroupTasks.chapterId = treeNode.chapterId
    },
    /**
       *  获取活动分组
       */
    getListActivityGroup() {
      this.$api.activity.listActivityGroup({ pkgId: this.pkgId }).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.length > 0) {
            this.listActivityGroup = res.data
          }
        }
      })
    },
    /**
       *  删除附件时
       */
    handleRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.uid === this.fileList[i].uid) {
          this.fileList[i].cancelFun('cancel')
          this.fileList.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < this.completeFileList.length; i++) {
        if (file.uid === this.completeFileList[i].uid) {
          this.completeFileList.splice(i, 1)
          this.mediaIdList.splice(i, 1)
          i--
        }
      }
    },
    /**
       *  删除参考答案附件时
       */
    handleRemoveReferenceAnswer(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.uid === this.fileList[i].uid) {
          this.fileList[i].cancelFun('cancel')
          this.fileList.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < this.answerFileList.length; i++) {
        if (file.uid === this.answerFileList[i].uid) {
          this.answerFileList.splice(i, 1)
          this.answerMediaIdList.splice(i, 1)
        }
      }
    },
    /**
       *  确定新增活动
       */
    saveGroupTasks() {
      if (!this.formGroupTasksVerifyBoolean()) {
        return false
      }

      const obj = this.activityGroupTasks
      obj.pkgId = this.pkgId
      obj.media_id = this.mediaIdList.toString()
      obj.anMedia_id = this.answerMediaIdList.toString()

      this.$api.activityGroupTasks.saveTaskInfo(obj).then(res => {
        if (res.code === 0) {
          // 跳转页面
          this.goToPageActivityList()
          // 清空数据
          this.clearvoteGroupTasksInfo()
        }
        toast(res.msg)
      })
    },
    /**
       *  取消新增活动
       */
    cancelGroupTasks() {
      // 跳转页面
      this.goToPageActivityList()
      // 清空数据
      this.clearvoteGroupTasksInfo()
    },
    /**
       * 获取任务小组划分方式
       */
    getDivideGroupType() {
      this.$api.activityGroupTasks.getDivideGroupType().then(res => {
        if (res.code === 0) {
          this.groupTypeList = res.data
        } else {
          toast(res.msg)
        }
      })
    },
    /**
       * 获取评分方式、作业分值及评分点
       */
    getScoreType() {
      this.$api.activityGroupTasks.getScoreType().then(res => {
        if (res.code === 0) {
          this.scoreTypeList = res.data
        } else {
          toast(res.msg)
        }
      })
    },
    /**
       * 作业/小组任务表单验证
       * @returns {boolean}
       */
    formGroupTasksVerifyBoolean() {
      // 活动主题验证
      if (!this.activityGroupTasks.activityTitle) {
        // 出现提示
        formInVaildStyle('.groupTasksTitleHint', '#groupTasksTitle')
        $('#groupTasksTitle').focus()
        return false
      }
      // 清除提示
      formVaildStyle('.groupTasksTitleHint', '#groupTasksTitle')
      // 活动内容验证
      if (!this.activityGroupTasks.content) {
        formInVaildStyle('.groupTasksContentHint', '#groupTasksContent')
        $('#groupTasksContent').focus()
        return false
      }
      formVaildStyle('.groupTasksContentHint', '#groupTasksContent')
      return true
    },
    /**
       *  清空数据
       */
    clearvoteGroupTasksInfo() {
      this.activityGroupTasks = {
        pkgId: '',
        activityId: '',
        chapterId: '',
        resgroupId: '0',
        activityTitle: '', // 活动标题
        content: '', // 任务详情
        divideGroupType: '1', // 任务小组划分方式：1/2/3/4
        scoreType: '1', // 评分方式、作业分值及评分点：1/2/3/4
        isSetLastestSubmissionTime: 'N', // 是否设置最晚提交时间
        lastestSubmissionTime: '', // 最晚提交时间
        isAllowExceedTime: 'N', // 是否设置超时提交
        referenceAnswer: '', // 参考答案
        purpose: '' // 用途
      }
    },
    /**
       * 附件上传
       */
    tasksFileUpload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('fromType', '1')
      const that = this
      this.$api.activityGroupTasks.tasksUpload(formData, (progress) => {
        if (progress) { // 显示文件进度条
          params.onProgress({ percent: progress })
        }
      }, (cancel) => { // 取消文件上传
        // 取消文件上传事件  存入当前文件中
        params.file.cancelFun = cancel
        that.fileList.push(params.file)
      }).then(res => {
        if (res.code === 0) {
          this.completeFileList.push(params.file)
          this.mediaIdList.push(res.media_id)
          params.onSuccess()
          // 移出上传成功的文件
          for (let i = 0; i < that.fileList.length; i++) {
            if (that.fileList[i].uid === params.file.uid) {
              that.fileList.splice(i, 1)
              i--
            }
          }
        }
      })
    },
    /**
       * 答案附件上传
       */
    answerFileUpload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('fromType', '2')
      const that = this
      this.$api.activityGroupTasks.tasksUpload(formData, (progress) => {
        if (progress) { // 显示文件进度条
          params.onProgress({ percent: progress })
        }
      }, (cancel) => { // 取消文件上传
        // 取消文件上传事件  存入当前文件中
        params.file.cancelFun = cancel
        that.fileList.push(params.file)
      }).then(res => {
        if (res.code === 0) {
          this.answerMediaIdList.push(res.media_id)
          this.answerFileList.push(params.file)
          params.onSuccess()
          // 移出上传成功的文件
          for (let i = 0; i < that.fileList.length; i++) {
            if (that.fileList[i].uid === params.file.uid) {
              that.fileList.splice(i, 1)
              i--
            }
          }
        }
      })
    },
    /**
       * 打开详情模态框
       */
    handleDetailsRules() {
      $('#details-rules-box').modal('show')
    },
    /**
       * 确认关闭详情模态框
       */
    handleSubmit() {
      $('#details-rules-box').modal('hide')
    }
  }
}
</script>

<style scoped>
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
</style>
