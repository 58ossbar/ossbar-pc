<!-- 投票问卷的填写页面 -->
<template>
  <div class="vote-question-list-box">
    <!-- 当前位置路径显示开始 -->
    <div class="present-localtion">
      <!-- 位置显示 -->
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动</a> > <span class="present-localtion-title">{{ viewActivityInfo.activityTitle }}</span>
      </div>
      <!-- 返回操作 -->
      <div class="classroom-back">
        <!-- 返回图标 -->
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"/>
        <!-- 返回文字 -->
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 当前位置路径显示结束 -->
    <ul class="activity-question-list vote-question-list">
      <li
        v-for="(question,questionIndex) in viewActivityInfo.questionList"
        :key="questionIndex"
        class="vote-question-item question-item">
        <div class="topic">
          <span class="question-num">{{ questionIndex+1 }}.</span>
          <span class="question-type">{{ question.questionType | filterQuestionType }}</span>
          <span class="question-con">{{ question.questionName }}</span>
        </div>
        <div v-if="question.questionType === '1'" class="choice-question-box">
          <ul class="question-option-list choice-question-list">
            <li
              v-for="(questionOption,optionIndex) in question.children"
              :key="optionIndex"
              class="option-item">
              <div class="custom-control custom-radio option-con">
                <input
                  :value="questionOption.optionId"
                  v-model="voteQuestionResult[questionIndex].optionIds"
                  :id="questionOption.optionId+optionIndex"
                  :name="questionOption.questionId"
                  type="radio"
                  class="custom-control-input">
                <label
                  :for="questionOption.optionId+optionIndex"
                  class="custom-control-label">
                  <span class="option">{{ questionOption.optionCode }}.</span>
                  <span>{{ questionOption.optionName }}</span>
                </label>
                <el-input v-if="voteQuestionResult[questionIndex].optionIds === questionOption.optionId && questionOption.canFill === 'Y'" v-model="voteQuestionResult[questionIndex].fillList[optionIndex].content" maxlength="40" show-word-limit placeholder="请输入内容" style="width:30%;margin-left:10px;" size="small"/>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="question.questionType === '2'" class="choice-question-box">
          <ul class="question-option-list choice-question-list">
            <li
              v-for="(questionOption,optionIndex) in question.children"
              :key="optionIndex"
              class="option-item">
              <div class="custom-control custom-checkbox option-con">
                <input
                  :value="questionOption.optionId"
                  v-model="voteQuestionResult[questionIndex].optionIds"
                  :id="questionOption.optionId"
                  type="checkbox"
                  class="custom-control-input">
                <label
                  :for="questionOption.optionId"
                  class="custom-control-label">
                  <span class="option">{{ questionOption.optionCode }}.</span>
                  <span>{{ questionOption.optionName }}</span>
                </label>
                <el-input v-if="voteQuestionResult[questionIndex].optionIds.indexOf(questionOption.optionId) >= 0 && questionOption.canFill === 'Y'" v-model="voteQuestionResult[questionIndex].fillList[optionIndex].content" maxlength="40" show-word-limit placeholder="请输入内容" style="width:30%;margin-left:10px;" size="small"/>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="question.questionType == '3'" class="short-answer-question-box">
          <el-input
            v-model="voteQuestionResult[questionIndex].content"
            type="textarea"
            rows="5"
            cols="100"
            class="questionName"
            placeholder="请填写自己的观点或意见"
            style="margin-top: 10px;font-size: 14px"/>
          <div class="accessory-box">
            <div class="accessory-title">
              <span>添加附件</span>
              <img src="static/image/teaching_center/accessory_1.png">
            </div>
            <ul class="accessory-list">
              <li
                v-for="(accessory,accessoryIndex) in viewAccessoryList[questionIndex].fileList"
                v-if="viewAccessoryList[questionIndex].fileList.length>0"
                :key="accessoryIndex"
                class="accessory-item accessory-con">
                <viewer v-if="accessory.type === 'image'" class="accessory-viewer" >
                  <img :src="accessory.path" alt>
                </viewer>
                <video
                  v-if="accessory.type === 'video'"
                  :src="accessory.path"
                  @click="openVideo(accessory.path)"/>
                <div
                  class="del-accessory"
                  @click="handleDelAccessory(questionIndex,accessoryIndex)">
                  <img src="static/image/teaching_center/del.png" alt="删除附件" title="删除附件">
                </div>
              </li>
              <li class="accessory-item add-accessory-btn">
                <input
                  accept="image/*,video/*"
                  type="file"
                  class="upload-accessory"
                  @change="handleUploadAccessory($event,questionIndex)">
                <img src="static/image/teaching_center/add_2.png" alt="添加附件" title="添加附件">
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <div class="bottom-btn-box" style="">
      <button
        :disabled="saveStart"
        type="button"
        class="btn btn-outline-primary"
        @click="handleSaveTraineeCommitAnswerContent">提交</button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="handleCancelTraineeCommitAnswerContent" >取消</button>
    </div>
  </div>
</template>

<script>
import { toast, confirm, loadingModal } from '@/utils/global'
export default {
  name: 'ViewVoteQuestionList',
  filters: {
    filterAnswerSetText(value) {
      return value === 'N' ? '设为正确答案' : '正确答案'
    },
    filterActivityState(value) {
      if (value === '0') {
        return '未开始'
      } else if (value === '1') {
        return '进行中'
      } else {
        return '已结束'
      }
    },
    filterPercent(value) {
      return value.split('.')[0]
    },
    filterQuestionType(value) {
      if (value === '3') {
        return '简答题'
      } else if (value === '2') {
        return '多选题'
      } else {
        return '单选题'
      }
    }
  },
  props: {
    activityInfo: {
      type: Object,
      required: true
    },
    ctId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      saveStart: false, // 提交按钮限制状态
      viewActivityInfo: {}, // 查看投票/问卷题目
      voteQuestionResult: [], // 学员所做的题目
      viewAccessoryList: [] // 附件显示列表
    }
  },
  created() {
    // 查看学员针对投票/问卷的作答内容
    this.getViewActivityInfo(this.activityInfo)
  },
  methods: {
    // 返回到活动主页面
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false)
    },
    // 查看作答题目列表
    getViewActivityInfo(activityInfo) {
      this.voteQuestionResult = []
      const obj = {
        activityId: activityInfo.activityId,
        activityType: activityInfo.activityType
      }
      this.$api.activityVoteQuestionnaire.viewActivityInfo(obj).then(res => {
        if (res.code === 0) {
          this.viewActivityInfo = res.data
          for (let i = 0; i < this.viewActivityInfo.questionList.length; i++) {
            const obj = {
              questionId: this.viewActivityInfo.questionList[i].questionId,
              questionType: this.viewActivityInfo.questionList[i].questionType,
              optionIds: '',
              content: '',
              fileList: [],
              media_id: '',
              fillList: []
            }
            if (this.viewActivityInfo.questionList[i].children && this.viewActivityInfo.questionList[i].children.length > 0) {
              this.viewActivityInfo.questionList[i].children.forEach(temp => {
                obj.fillList.push({
                  optionId: temp.optionId,
                  content: ''
                })
              })
            }
            if (obj.questionType === '2') {
              obj.optionIds = []
            }
            this.voteQuestionResult.push(obj)
            const file = { fileList: [] }
            this.viewAccessoryList.push(file)
          }
        }
      })
    },
    // 学员提交投票问卷
    handleSaveTraineeCommitAnswerContent() {
      const voteQuestionResultTemp = JSON.parse(JSON.stringify(this.voteQuestionResult))
      for (let i = 0; i < voteQuestionResultTemp.length; i++) {
        let mediaIdList = voteQuestionResultTemp[i].fileList.toString()
        mediaIdList = mediaIdList.replace(/\[|]/g, '')
        voteQuestionResultTemp[i].media_id = mediaIdList
      }
      const saveInfo = {
        ctId: this.ctId,
        activityId: this.viewActivityInfo.activityId
      }
      for (let i = 0; i < voteQuestionResultTemp.length; i++) {
        if (voteQuestionResultTemp[i].questionType === '2') {
          if (voteQuestionResultTemp[i].optionIds.length > 0) {
            voteQuestionResultTemp[i].optionIds = voteQuestionResultTemp[i].optionIds.join(',')
          } else {
            voteQuestionResultTemp[i].optionIds = ''
          }
        }
        if (voteQuestionResultTemp[i].questionType === '1' || voteQuestionResultTemp[i].questionType === '2') {
          if (!voteQuestionResultTemp[i].optionIds) {
            toast('当前题目未完成,请完成后再提交')
            return
          }
        }
        if (voteQuestionResultTemp[i].questionType === '3') {
          if (!voteQuestionResultTemp[i].content) {
            toast('当前题目未完成,请完成后再提交')
            return
          }
        }
      }
      this.saveStart = true
      saveInfo.json = JSON.stringify(voteQuestionResultTemp)
      this.$api.activityVoteQuestionnaire.saveTraineeCommitAnswerContent(saveInfo).then(res => {
        if (res.code === 0) {
          if (this.viewActivityInfo.isShow === 'Y') {
            // 跳转到投票结果页
            this.$parent.toShowPageVoteTraineeAnswer()
          } else {
            this.goToPageActivityList()
          }
        } else {
          this.saveStart = false
          this.goToPageActivityList()
        }
        toast(res.msg)
      })
    },
    // 取消提交投票问卷
    handleCancelTraineeCommitAnswerContent() {
      confirm('确定取消提交当前投票问卷吗?', () => {
        this.goToPageActivityList()
        this.voteQuestionResult = []
        this.viewAccessoryList.fileList = []
      })
    },
    // 删除附件
    handleDelAccessory(questionIndex, accessoryIndex) {
      confirm('确定删除此附件吗?', () => {
        this.voteQuestionResult[questionIndex].fileList.splice(accessoryIndex, 1)
        this.viewAccessoryList[questionIndex].fileList.splice(accessoryIndex, 1)
      })
    },
    // 上传附件
    handleUploadAccessory(e, questionIndex) {
      this.saveStart = true
      const file = e.target.files[0]
      if (file) {
        loadingModal(true)
        const fileType = file.type.split('/')[0]
        if (fileType == 'image' || fileType == 'video') {
          const formData = new FormData()
          formData.append('file', file)
          this.$api.activityVoteQuestionnaire.uploads(formData).then(res => {
            if (res.code === 0) {
              loadingModal(false)
              toast('添加成功')
              const reader = new FileReader()
              const that = this
              reader.readAsDataURL(file)
              reader.onload = function(e) {
                const fileObj = {
                  path: this.result,
                  type: fileType
                }
                that.viewAccessoryList[questionIndex].fileList.push(fileObj)
              }
              this.voteQuestionResult[questionIndex].fileList.push(res.media_id)
              this.saveStart = false
            } else {
              loadingModal(false)
              toast('添加失败' + res.msg)
            }
          })
        } else {
          toast('请上传图片或视频')
          return
        }
      }
    },
    openVideo(url) {
      this.$videoPreview(url)
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
  /* 查看学员针对投票/问卷的作答内容start */
  .accessory-box{
    padding:10px 0px;
  }
  .accessory-box .accessory-title{
    color: #333;
    margin:10px 0px;
  }
  .accessory-box .accessory-list{
    display: flex;
    flex-wrap:wrap;
    width:100%;
  }
  .accessory-box .accessory-list .accessory-item{
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    cursor: pointer;
  }
  .accessory-box .accessory-list .accessory-item{
    margin: 0 12px 10px 0;
  }
  .accessory-box .accessory-list .add-accessory-btn{
    text-align: center;
    line-height: 80px;
  }
  .accessory-box .accessory-list .accessory-item{
    position: relative;
  }
  .accessory-box .accessory-list .accessory-con  .accessory-viewer{
    width: 100%;
    height:100%;
  }
  .accessory-box .accessory-list .accessory-con  img{
    width: 100%;
    height: 100%;
  }
  .accessory-box .accessory-list .accessory-con > video{
    width: 100%;
    height: 100%;
  }
  .accessory-box .accessory-list .add-accessory-btn > img{
    width: 35px;
    height: 35px;
  }
  .accessory-box .accessory-list .add-accessory-btn .upload-accessory{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    filter:Alpha(opacity=50);
    cursor: pointer;
  }
  .accessory-box .accessory-list .accessory-con:hover .del-accessory{
    display: block;
  }
  .accessory-box .accessory-list .accessory-con .del-accessory{
    display: none;
    position: absolute;
    top:0px;
    right: 0px;
  }
  .view-trainee-answer{
    width: 100%;
    text-align: left;
  }
  .activity-question-list{
    width: 85%;
    margin: 0 auto;
    padding: 10px 0;
    /* border: 1px solid #ccc; */
  }
  .activity-question-list .answer-detail-item{
    border-bottom: 1px dashed #d9d9d9;
    background-color: #fff;
    padding: 18px 0 5px;
    /* font-size: 14px; */
  }
  .activity-question-list .question-item .topic{
    display: inline-block;
  }
  .activity-question-list .question-item .topic .question-num{
    width: 38px;
    font-size: 22px;
    line-height: 26px;
    color: #333;
    margin-right: 10px;
  }
  .activity-question-list .question-item .topic .question-type{
    border-radius: 2px;
    padding: 2px 4px;
    margin-right: 5px;
    font-size: 14px;
    background: #ffe2d9;
    border: 1px solid #ffb399;
  }
  .question-answer-detail-list .answer-detail-item .answer-option{
    padding:5px 30px;
  }
  .question-answer-detail-list .answer-detail-item .answer-option .option-con{
    padding:10px 0;
  }
  .question-answer-detail-list .answer-detail-item .answer-option .option-con > .option{
    display: inline-block;
    width: 20px;
    font-weight: bold;
    line-height: 24px;
  }
  .question-answer-detail-list .answer-detail-item .answer-option .bottom-select-answer-detail{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .question-answer-detail-list .answer-detail-item .answer-option .bottom-select-answer-detail .progress{
    width: 70%;
    height:0.8rem;
  }
  .question-answer-detail-list .answer-detail-item .short-answer-question-box .unfold-btn-con{
    display: flex;
    align-items: center;
    color: #8b8c97;
    font-size: 15px;
    padding: 13px 5px;
  }
  .answer-detail-item .short-answer-question-box .unfold-btn-con .unfold-btn{
    margin-left: 15px;
    cursor: pointer;
  }
  .answer-detail-item .short-answer-question-box .unfold-btn-con .unfold-btn >span{
    display: inline-block;
    vertical-align: middle;
  }
  .answer-detail-item .short-answer-question-box .unfold-btn-con .unfold-btn > img{
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  .short-answer-question-box .trainee-answer-list{
    padding:0 40px;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item{
    padding:10px 0;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item + .trainee-answer-item{
    border-top: 1px solid #fafafa;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .trainee-answer-info{
    display: flex;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .trainee-answer-info > img{
    display: block;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .trainee-answer-info > img{
    display: block;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .short-answer-question-box .trainee-answer-item .trainee-answer-info .right-trainee-answer .colon{
    color: #555666;
    font-weight: bold;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .accessory-detail{
    display: flex;
    align-items: center;
    padding-left: 40px;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .accessory-detail .accessory-title{
    color: #5f6471;
    font-size: 14px;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .accessory-detail .accessory-list{
    width: 80%;
    margin-left: 10px;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .accessory-detail .accessory-list .accessory-item{
    width: 50px;
    height: 50px;
  }
  .trainee-answer-list .trainee-answer-item .accessory-detail .accessory-list .accessory-item > img,
  .trainee-answer-list .trainee-answer-item .accessory-detail .accessory-list .accessory-item > video{
    width: 100%;
    height: 100%;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .trainee-answer-time{
    width: 100%;
    height:35px;
    line-height: 35px;
    padding-left:40px;
    color: #5f6471;
    font-size: 14px;
  }
  /* 查看学员针对投票/问卷的作答内容end*/

  /* 投票/问卷题目列表start*/
  .vote-question-list-box{
    width: 100%;
    text-align: left;
  }
  .vote-question-list-box .vote-question-list .vote-question-item{
    padding:15px 0;
    border-bottom: 1px dashed #d9d9d9;
  }
  .vote-question-list-box .choice-question-list{
    padding: 0 20px;
  }
  .vote-question-list-box .option-item{
    padding:10px 0;
    cursor: pointer;
  }
  .vote-question-list-box .option-item:hover{
    background-color: #fafafa;
  }
  .vote-question-list-box .option-con  .option{
    display: inline-block;
    width: 20px;
    font-weight: bold;
    line-height: 24px;
  }
  .vote-question-list-box .option-con .custom-control-label{
    width: 100%;
    padding-left: 10px;
    cursor: pointer;
  }
  .bottom-btn-box{
    display: flex;
    justify-content: center;
    width: 80%;
    margin: 30px auto;
  }
  .bottom-btn-box > button {
    width: 100px;
    margin-left: 20px;
    font-size: 14px;
  }
  /* 投票/问卷题目列表end*/
</style>
