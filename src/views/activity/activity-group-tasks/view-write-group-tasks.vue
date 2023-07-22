<!-- 学员填写作业/小组任务页面 -->
<template>
  <div class="view-write-group-tasks">
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
    <!-- 题目内容区域开始 -->
    <div class="tasks-title">
      <!-- 内容 -->
      <div class="tasks-title-content">
        {{ content }}
      </div>
      <!-- 附件下载 -->
      <div class="tasks-title-file">
        <el-button type="text" style="outline: none;">下载附件</el-button>
        <span style="color: #e0e0e0; font-size: 12px">附件大小(406kb)</span>
      </div>
    </div>
    <!-- 题目内容区域结束 -->
    <!-- 作答区域开始 -->
    <div class="answer-area">
      <!-- 作答 -->
      <div class="answer-area-content">
        <el-input
          v-model="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          type="textarea"
          placeholder="请输入内容"
          maxlength="500"
          show-word-limit/>
      </div >
      <!-- 附件上传 -->
      <div class="answer-area-file">
        <el-upload
          :limit="5"
          :on-remove="handleRemove"
          :file-list="fileList"
          class="upload-demo"
          multiple
          action="https://jsonplaceholder.typicode.com/posts/">
          <el-button size="small" type="primary">添加附件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传五个附件，且不超过300M</div>
        </el-upload>
      </div>
    </div>
    <!-- 作答区域结束 -->
    <!-- 按钮区域开始 -->
    <div style="width: 94%;margin: 40px 3%;text-align: center">
      <button type="button" class="btn btn-outline-primary" style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="commitTask">确定</button>
      <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 10px">取消</button>
    </div>
    <!-- 按钮区域结束 -->
  </div>
</template>

<script>
import { toast, confirm } from '@/utils/global'
export default {
  name: 'ViewWriteGroupTasks',
  props: {
    // 当前活动信息
    activityInfo: {
      type: Object,
      required: true
    },
    // 课堂id
    ctId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pageTitle: '',
      content: '',
      fileList: [],
      textarea: ''
    }
  },
  created() {
    this.pageTitle = this.activityInfo.activityTitle
    if (this.activityInfo.activityId) {
      const o = {
        ctId: this.ctId,
        activityId: this.activityInfo.activityId
      }
      this.$api.activityGroupTasks.viewTraineeAnswerContent(o).then(res => {
        if (res.code === 0) {
          this.content = res.data.activityInfo.content
          this.fileList = res.data.activityInfo.fileList
          this.textarea = res.data.answerContent
          this.answerFileList = res.data.answerFileList
        }
      })
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
             *  删除附件时
             */
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 提交内容
    commitTask() {
      confirm('确定要提交吗?', () => {
        const o = {
          ctId: this.ctId,
          activityId: this.activityInfo.activityId,
          content: this.textarea
        }
        this.$api.activityGroupTasks.commitTask(o).then(res => {
          console.log(res)
          toast(res.msg)
        })
      })
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
  .cursor{
    cursor: pointer;
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
  /* 题目内容样式 */
  .tasks-title{
    width: 95%;
    margin: 30px auto 10px;
    text-align: left;
  }
  .tasks-title-content{
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    line-height: 30px;
    word-break:break-all;
    text-indent:2em;
  }
  .tasks-title-file{
    margin-top: 20px;
  }
  /* 作答区域样式 */
  .answer-area{
    width: 95%;
    margin: 30px auto 10px;
    text-align: left;
  }
  .answer-area-file{
    margin-top: 30px;
  }
</style>
