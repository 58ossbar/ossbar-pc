<!-- 随机选人页面 -->
<template>
  <div class="candidates">
    <!-- 路径导航开始 -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList()">活动列表</a> > <span class="present-localtion-title">{{ activityInfo.activityTitle }}(随机选人)</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"/>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <div style="width: 95%;margin: 20px auto;padding-top:40px;">
      <div style="width: 185px;height: 260px;border: 1px silver solid;border-radius: 10px;margin: auto">
        <img :src="currStudent.traineePic" style="width: 140px;height: 180px;margin:20px auto">
        <div style="width: 140px;margin:-5px auto;font-size: 14px;text-align: left;">
          {{ currStudent.traineeNickName }}
        </div>
      </div>
    </div>
    <!-- 开始选人按钮 -->
    <div class="candidates-btn">
      <!-- <el-button type="primary" v-if="isShowStartBtn" @click="startCandidates">开始</el-button> -->
      <el-button v-if="!isShowStartBtn" :disabled="'1' !== activityInfo.activityState" type="danger" size="medium" @click="endCandidates">结束</el-button>
      <!-- v-if="isShowStartBtn && '1' === this.activityInfo.activityState" -->
      <el-button v-if="isShowStartBtn" :disabled="'1' !== activityInfo.activityState" type="primary" size="medium" @click="startCandidates">{{ isOnce?'开始':'重选' }}</el-button>

      <el-input v-if="isShowStartBtn && '1' === activityInfo.activityState" v-model="randomTime" placeholder="输入随机时间" style="width:200px;margin:0 20px;" size="medium">
        <template slot="prepend">随机时间</template>
        <template slot="append">s</template>
      </el-input>

      <el-button v-if="isShowStartBtn && !isOnce" :disabled="'1' !== activityInfo.activityState" type="primary" size="medium" @click="handleSave">评分</el-button>
    </div>

    <!-- 所有成员显示begin -->
    <div class="all-student">
      <div v-for="(item,index) in studentDataCopy" :key="index" class="student-single">
        <div class="single-img">
          <img :src="item.traineePic" alt="">
        </div>
        <div class="single-name">
          {{ item.traineeName }}
        </div>
        <div v-if="item.traineeId === currStudent.traineeId" class="student-shadow"/>
      </div>
    </div>
    <!-- 所有成员显示end -->

    <!-- 评分模态框开始 -->
    <modal-dialog
      id="score-modal"
      title="学员评分"
      @cancel="handleCancel"
      @submit="handleSubmit">
      <div slot="main" style="text-align: left;padding: 10px 10px 20px 10px;">
        <div class="student-score">
          <div class="student-name">
            {{ currStudent.traineeName }}
          </div>
          <el-input
            id="trainee-score"
            v-model="currStudent.score"
            size="medium"
            @input="inputText()"
            @keyup.enter.native="handleSubmit"/>
        </div>
      </div>
    </modal-dialog>
    <!-- 评分模态框结束 -->
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import { baseUrl, toast } from '@/utils/global'
import ModalDialog from '@/components/modal-dialog'
export default {
  name: 'Candidates',
  components: {
    'modal-dialog': ModalDialog
  },
  props: {
    ctId: {
      type: String,
      required: true
    },
    activityInfo: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      // 当前抽取的学生
      currStudent: { traineePic: 'static/image/knowledge_a2.png', traineeName: '选人' },
      studentData: [], // 学生数据
      studentDataCopy: [],
      isShowStartBtn: true, // 是否显示开始按钮
      size: 1,
      isOnce: true, // 是否是第一次 进入
      randomTime: 2, // 随机选择时间，单位s秒
      intervalId: null,
      timeoutId: null,
      boyIdiomList: ['气宇不凡', '风度翩翩', '温文尔雅', '器宇轩昂', '文质彬彬', '仪表堂堂', '形貌昳丽', '温文尔雅', '身付异秉', '平易近人', '德艺双馨', '博学多才', '才华横溢', '学富五车', '沉着冷静', '才思敏捷'],
      girlIdiomList: ['皓齿蛾眉', '姱容修态', '煦色韶光', '温柔可人', '小家碧玉', '兰质蕙心', '天生丽质', '平易近人', '德艺双馨', '博学多才', '才华横溢', '学富五车', '沉着冷静', '才思敏捷'],
      neutralIdiomList: ['平易近人', '德艺双馨', '博学多才', '才华横溢', '学富五车', '沉着冷静', '才思敏捷']
    }
  },
  created() {
  },
  mounted() {
    this.isOnce = true
    // 获取当前课堂所有成员
    this.$api.activityClassroomPerformance.selectClassroomTraineeInfo(this.ctId).then(res => {
      if (res.code === 0) {
        let tempIndex0 = 0
        let tempIndex1 = 0
        let tempIndex2 = 0
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].traineePic.indexOf('http://') === -1 && res.data[i].traineePic.indexOf('https://') === -1) {
            res.data[i].traineePic = baseUrl + res.data[i].traineePic
          }
          res.data[i].score = ''
          if (res.data[i].traineeSex === '1') {
            if (tempIndex0 >= this.boyIdiomList.length) {
              tempIndex0 = 0
            }
            res.data[i].traineeNickName = this.boyIdiomList[tempIndex0] + '的' + res.data[i].traineeName + '同学'
            tempIndex0++
          } else if (res.data[i].traineeSex === '2') {
            if (tempIndex1 >= this.girlIdiomList.length) {
              tempIndex1 = 0
            }
            res.data[i].traineeNickName = this.girlIdiomList[tempIndex1] + '的' + res.data[i].traineeName + '同学'
            tempIndex1++
          } else {
            if (tempIndex2 >= this.neutralIdiomList.length) {
              tempIndex2 = 0
            }
            res.data[i].traineeNickName = this.neutralIdiomList[tempIndex2] + '的' + res.data[i].traineeName + '同学'
            tempIndex2++
          }
        }
        this.studentData = res.data
        this.studentDataCopy = JSON.parse(JSON.stringify(res.data))
      } else {
        toast(res.msg)
      }
    })
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.timeoutId) {
      clearInterval(this.timeoutId)
      this.timeoutId = null
    }
  },
  methods: {
    /**
       * 跳页面
       */
    goToPageActivityList() {
      this.$parent.changeVotoQuestionnairePage(false)
    },
    // 限制数字输入
    inputText() {
      this.currStudent.score = this.currStudent.score.replace(/\D/g, '')
      if (this.currStudent.score > 11) {
        this.currStudent.score = 10
      }
    },
    // 开始抽人
    startCandidates() {
      this.isOnce = false
      this.isShowStartBtn = false
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      this.intervalId = setInterval(() => {
        this.currStudent = this.studentData.sort(() => 0.5 - Math.random()).slice(0, this.size)[0]
      }, 1)

      if (this.randomTime && parseInt(this.randomTime) > 0) {
        if (this.timeoutId) {
          clearInterval(this.timeoutId)
        }
        this.timeoutId = setTimeout(() => {
          this.endCandidates()
        }, (parseInt(this.randomTime) * 1000))
      }
    },
    // 结束抽人
    endCandidates() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (this.timeoutId) {
        clearInterval(this.timeoutId)
        this.timeoutId = null
      }
      this.isShowStartBtn = true
    },
    // 取消评分
    handleCancel() {
      $('#score-modal').modal('hide')
    },
    // 提交验证
    submitValidation() {
      if (!this.currStudent.score || this.currStudent.score === '') {
        $('#trainee-score').css('borderColor', '#dc3545')
        $('#trainee-score').focus()
        return false
      }
      $('#trainee-score').removeAttr('style')
      return true
    },
    // 提交评分
    handleSubmit() {
      if (this.submitValidation()) {
        const arrTemp = []
        arrTemp.push({ traineeId: this.currStudent.traineeId, score: this.currStudent.score })
        const obj = {
          ctId: this.ctId,
          activityId: this.activityInfo.activityId,
          traineeScore: arrTemp
        }
        this.$api.activityClassroomPerformance.selectPeopleToAnswer(obj).then(res => {
          toast(res.msg)
          if (res.code === 0) {
            $('#score-modal').modal('hide')
            this.goToPageActivityList()
          }
        })
      }
    },
    // 确定选择
    handleSave() {
      if (this.currStudent.length <= 0) {
        toast('请选择作答学员')
        return false
      }
      $('#score-modal').modal('show')
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
    .candidates-btn{
      margin-bottom: 20px;
    }
    /* 评分模态框样式 */
    .student-score{
        display: flex;
    }
    .student-name{
        width: 20%;
        margin-right: 20px;
        line-height: 36px;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /* 所有成员显示样式 */
    .all-student{
      padding: 0 20px;
      display: flex;
      flex-wrap:wrap;
    }
    .student-single{
      position: relative;
      width: 11%;
      margin: 20px 0.75%;
      padding: 10px 10px 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .single-img img{
      width: 100%;
      height: 140px;
    }
    .single-name{
      margin-top: 10px;
    }
    .student-shadow{
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.281);
    }
</style>
