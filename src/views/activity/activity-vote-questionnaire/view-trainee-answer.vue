<!-- 投票问卷结果查看页面 -->
<template>
  <div class="view-trainee-answer">
    <!-- 当前位置路径显示开始 -->
    <div class="present-localtion">
      <!-- 位置显示 -->
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动</a> > <span class="present-localtion-title">{{ viewTraineeAnswerListData.activityTitle }}（结果统计）</span>
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
    <ul class="question-answer-detail-list activity-question-list">
      <li
        v-for="(question,questionIndex) in viewTraineeAnswerListData.questionList"
        :key="questionIndex"
        class="answer-detail-item question-item" >
        <div class="topic">
          <span class="question-num">{{ questionIndex+1 }}.</span>
          <span class="question-type">{{ question.questionTypeName }}题</span>
          <span class="question-con">{{ question.questionName }}</span>
        </div>
        <div
          v-if="question.questionType !== '3'"
          class="choice-question-box">
          <div
            v-for="(choiceOption,choiceOptionIndex) in question.children"
            :key="choiceOptionIndex"
            class="answer-option">
            <div class="option-con">
              <span class="option">{{ choiceOption.optionCode }}.</span>
              <span>{{ choiceOption.optionName }}</span>
            </div>
            <div class="bottom-select-answer-detail">
              <div class="progress">
                <div
                  :aria-valuenow="choiceOption.percent | filterPercent"
                  :style="'width:'+choiceOption.percent+';'"
                  class="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100">
                  {{ choiceOption.percent }}
                </div>
              </div>
              <div class="select-answer-peoplenum">
                <el-button v-if="choiceOption.answerInfos && choiceOption.answerInfos.length" :icon="choiceOption.isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" circle size="mini" style="margin-right:20px;" @click="choiceOption.isShow = !choiceOption.isShow"/>
                <span>选择人数：</span>
                <span>{{ choiceOption.traineeAnswerNum }}人</span>
              </div>
            </div>
            <el-collapse-transition>
              <div v-if="choiceOption.answerInfos && choiceOption.isShow" class="answer-fill">
                <div v-for="(item,index) in choiceOption.answerInfos" :key="index" class="answer-fill-info">
                  <el-avatar :size="30" :src="item.traineePic"/>
                  <span style="margin-left:15px;">{{ item.traineeName }} {{ item.traineeSex }} {{ item.mobile }} </span>
                  <div>{{ item.answerInfo }}</div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <div
          v-if="question.questionType === '3'"
          class="short-answer-question-box">
          <div class="unfold-btn-con">
            <div>{{ question.traineeAnswerList.length }}人回答</div>
            <div
              :href="'#unfold-btn'+questionIndex"
              :aria-controls="'unfold-btn'+questionIndex"
              role="button"
              data-toggle="collapse"
              aria-expanded="false"
              class="unfold-btn">
              <span>查看</span>
              <img src="static/image/teaching_center/unfold_1.png">
            </div>
          </div>
          <div
            v-if="question.traineeAnswerList.length>0"
            :id="'unfold-btn'+questionIndex"
            :class="['trainee-answer-list','collapse',questionIndex===0?'show':'']">
            <div
              v-for="(traineeAnswer,traineeAnswerIndex) in question.traineeAnswerList"
              :key="traineeAnswerIndex"
              class="trainee-answer-item">
              <div class="trainee-answer-info">
                <img :src="traineeAnswer.traineePic">
                <div class="right-trainee-answer">
                  <span>{{ traineeAnswer.traineeName + ' ' + traineeAnswer.traineeSex + ' ' + traineeAnswer.mobile }}</span>
                  <span class="colon">：</span>
                  <span style="word-break:break-all;">{{ traineeAnswer.content }}</span>
                </div>
              </div>
              <div
                v-if="traineeAnswer.fileList.length>0"
                class="accessory-box accessory-detail">
                <div class="accessory-title">
                  附件:
                </div>
                <ul class="accessory-list">
                  <li
                    v-for="(file,fileIndex) in traineeAnswer.fileList"
                    :key="fileIndex"
                    class="accessory-item">
                    <viewer v-if="file.type==='image'" class="accessory-viewer" >
                      <img :src="file.url" style="width: 40px;height: 40px" alt>
                    </viewer>
                    <!-- <img
                          v-if="file.type==='image'"
                          :src="file.url"
                          alt="附件"
                          title="附件"> -->
                    <video
                      v-if="file.type==='video'"
                      :src="file.url"
                      @click="openVideo(file.url)"/>
                  </li>
                </ul>
              </div>
              <div class="trainee-answer-time">
                {{ traineeAnswer.createTime }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  baseUrl
} from '@/utils/global'
export default {
  name: 'ViewTraineeAnswer',
  filters: {
    filterAnswerSetText(value) {
      return value === 'N' ? '设为正确答案' : '正确答案'
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
      // 查看学员针对投票/问卷的作答内容
      viewTraineeAnswerListData: {
        activityTitle: '',
        submitTheNumber: 0, // 提交人数
        questionList: [] // 题目列表
      }
    }
  },
  created() {
    // 查看学员针对投票/问卷的作答内容
    this.getViewTraineeAnswerListData(this.activityInfo.activityId)
  },
  methods: {
    // 返回到活动主页面
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false)
    },
    // 视频预览
    openVideo(url) {
      this.$videoPreview(url)
    },
    // 查看学员针对投票/问卷的作答内容
    getViewTraineeAnswerListData(activityId) {
      const obj = {
        ctId: this.ctId,
        activityId: activityId
      }
      this.$api.activityVoteQuestionnaire.viewTraineeAnswerListData(obj).then(res => {
        if (res.code === 0) {
          this.viewTraineeAnswerListData.activityTitle = res.activityInfo.activityTitle
          this.viewTraineeAnswerListData.submitTheNumber = res.activityInfo.submitTheNumber
          if (res.data.list && res.data.list.length > 0) {
            const questionList = res.data.list
            for (let i = 0; i < questionList.length; i++) {
              if (questionList[i].questionType == '3' && questionList[i].traineeAnswerList && questionList[i].traineeAnswerList.length > 0) {
                const traineeAnswerList = questionList[i].traineeAnswerList
                for (let j = 0; j < traineeAnswerList.length; j++) {
                  if (traineeAnswerList[j].traineePic.indexOf('http') === -1) {
                    traineeAnswerList[j].traineePic = baseUrl + traineeAnswerList[j].traineePic
                  }
                  if (traineeAnswerList[j].fileList.length > 0) {
                    const fileList = traineeAnswerList[j].fileList
                    for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
                      fileList[fileIndex].url = baseUrl + fileList[fileIndex].url
                    }
                  }
                }
              } else {
                if (questionList[i].children) {
                  questionList[i].children.map(item => {
                    if (item.answerInfos) {
                      item.isShow = false
                      item.answerInfos.forEach(value => {
                        if (!value.traineePic.includes('http://') && !value.traineePic.includes('https://')) { value.traineePic = baseUrl + value.traineePic }
                      })
                    }
                    return item
                  })
                }
              }
            }
            this.viewTraineeAnswerListData.questionList = res.data.list
          }
        }
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
    height: 100%;
  }
  .accessory-box .accessory-list{
    display: flex;
    flex-wrap:wrap;
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
  .right-trainee-answer{
    line-height: 30px;
  }
  .short-answer-question-box .trainee-answer-list .trainee-answer-item .accessory-detail{
    display: flex;
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
  .answer-fill-info{
    height: 50px;
    display: flex;
    align-items: center;
  }
  .answer-fill{
    max-height: 300px;
    overflow-y: scroll;
  }
  /* 查看学员针对投票/问卷的作答内容end*/
</style>
