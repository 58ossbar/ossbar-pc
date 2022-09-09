<!-- 签到详情查看页面 -->
<template>
  <div class="view-key-sign-in-new">
    <!-- 位置导航模块开始 -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动</a> > <span class="present-localtion-title">签到详情</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"/>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 位置导航模块结束 -->
    <!-- 内容区域显示开始 -->
    <div class="content-area">
      <!-- 左侧状态导航开始 -->
      <div class="left-state-nav">
        <!-- 状态标题 -->
        <div class="state-title">
          <span class="state-title-span">签到状态</span>
        </div>
        <!-- 状态内容 -->
        <div
          v-for="(item,index) in signInState"
          v-if="item.dictValue !== '已签到'"
          :class="['state-content',index === currStateIndex ? 'bg-f5f5f5' : '']"
          :key="index"
          @click="handleSwitchState(item.dictCode,index)">
          <div>{{ item.dictValue }}</div>
          <div>
            <!-- 人数 -->
            <span>{{ item.num }}</span>
            <!-- 箭头图标 -->
            <img src="static/image/teaching_center/right_arrow_1.png" alt >
          </div>
        </div>
      </div>
      <!-- 左侧状态导航结束 -->
      <!-- 右侧成员显示区域开始 -->
      <div class="right-students">
        <!-- 上方操作区域开始 -->
        <div v-if="hasPermission && activityInfo.activityState === '1'" class="students-operation">
          <div style="text-align: left;">
            <el-button v-if="hasPermission && activityInfo.activityState === '1'" :disabled="!hasPermission" type="primary" size="small" @click="checkAllStudent">{{ checkedAllValue }}</el-button>
            <el-dropdown v-if="hasPermission && activityInfo.activityState === '1'" style="margin-left: 20px;" size="small" trigger="click" @command="changeStudentsState">
              <el-button :disabled="!hasPermission" type="primary" size="small">
                修改状态<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in dictList"
                  :command="item.dictCode"
                  :key="index">{{ item.dictValue }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-if="activityInfo.signType === '2'">
            <el-button v-if="hasPermission" :disabled="!hasPermission" type="primary" size="small" @click="lookSignValue">查看手势</el-button>
          </div>
        </div>
        <!-- 上方操作区域结束 -->
        <!-- 状态名称显示开始 -->
        <div class="state-name">
          {{ currStateInfo.dictValue }}（{{ currStateInfo.num }}人）
        </div>
        <!-- 状态名称显示结束 -->
        <!-- 成员显示开始 -->
        <div class="students-info">
          <el-table
            ref="multipleTable"
            :data="signInStudents"
            :show-header="false"
            height="400px"
            tooltip-effect="dark"
            style="width: 100%"
            @row-click="clickRow"
            @selection-change="handleSelectionChange">
            <el-table-column
              v-if="hasPermission && activityInfo.activityState === '1'"
              type="selection"
              width="55"/>
            <el-table-column
              label="头像"
              width="120">
              <template slot-scope="scope">
                <img :src="scope.row.traineePic" alt style="height: 40px;width: 40px;border-radius: 50%;" >
              </template>
            </el-table-column>
            <el-table-column
              prop="traineeName"
              label="姓名"
              width="200"/>
            <el-table-column
              prop="jobNumber"
              label="学号"
              show-overflow-tooltip/>
            <el-table-column
              prop="signTime"
              label="时间"
              show-overflow-tooltip/>
          </el-table>
        </div>
        <!-- 成员显示结束 -->
      </div>
      <!-- 右侧成员显示区域结束 -->
    </div>
    <!-- 内容区域显示结束 -->
    <!-- 手势签到弹窗开始 -->
    <modal-dialog
      id="gestures-sign-in-modal"
      ref="signModal"
      :is-show-footer-btn="false"
      title="手势签到">
      <div slot="main">
        <!-- 手势签到图案设置处 -->
        <div style="text-align: left;padding-left:15px;">顺序：<span v-for="(item,index) in gestureData" :key="index">{{ item }} </span></div>
        <gestures-content ref="canvas" v-model="gestureData" style="margin-right: 30px;"/>
        <div style="height:20px;"/>
      </div>
    </modal-dialog>
    <!-- 手势签到弹窗结束 -->
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import { baseUrl, toast } from '@/utils/global'
import ModalDialog from '@/components/modal-dialog'
import GesturesContent from '@/views/activity/activity-sign-in/gestures-content'
export default {
  name: 'ViewKeySignIn',
  components: {
    'GesturesContent': GesturesContent,
    'modal-dialog': ModalDialog
  },
  props: {
    ctId: {
      type: String,
      required: true
    },
    activityId: {
      type: String,
      required: true
    },
    activityInfo: {
      type: Object,
      required: true
    },
    hasPermission: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      gestureData: [], // 手势值
      isPullDown: true,
      dictList: [], // 学员设置状态
      // 所有签到状态
      signInState: [
        { dictCode: '6', dictValue: '已签到' },
        { dictCode: '7', dictValue: '未签到' }
      ],
      multipleSelection: [], // 所有选中的学员
      currState: '7', // 当前选择的签到状态
      currStateInfo: {}, // 当前选择的签到状态信息
      signInStudents: [], // 当前显示的学生
      currStateIndex: 1, // 当前选中状态下标
      checkedAllValue: '全选', // 全选按钮值

      /* 签到学员显示相关属性 */
      alreadySignInStudents: [], // 已签到学员
      notSignInStudents: [], // 未签到学员
      normalStudents: [], // 正常学员
      lateStudents: [], // 迟到学员
      leaveEarlyStudents: [], // 早退学员
      truancyStudents: [], // 旷课学员
      vacateStudents: [] // 请假学员

    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    // 初始化数据
    this.init()
    if (this.activityInfo.signType === '2') {
      this.gestureData = this.activityInfo.questionNumber.split('')
      this.$refs.canvas.initData(this.gestureData)
    }
  },
  methods: {
    /**
       *  数据初始化
       */
    init() {
      // 获取学员设置状态常量
      this.getDictList()
    },

    /**
       * 查看手势
       */
    lookSignValue() {
      this.$refs.canvas.onReset()
      this.gestureData = this.activityInfo.questionNumber.split('')
      this.$refs.canvas.initData(this.gestureData)
      $('#gestures-sign-in-modal').modal('show')
    },

    /**
       *  复选框值的改变
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.signInStudents.length != 0 && this.multipleSelection.length === this.signInStudents.length) {
        this.checkedAllValue = '取消全选'
      } else {
        this.checkedAllValue = '全选'
      }
    },

    /**
       *
       */
    clickRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    /**
       *  全选操作
       */
    checkAllStudent() {
      if (this.multipleSelection.length === this.signInStudents.length) {
        this.multipleSelection = []
        this.checkedAllValue = '全选'
      } else {
        this.multipleSelection = this.signInStudents
        this.checkedAllValue = '取消全选'
      }
      this.$refs.multipleTable.toggleAllSelection()
    },

    /**
       *  清空数据
       */
    clearInit() {
      this.alreadySignInStudents = [] // 已签到学员
      this.notSignInStudents = [] // 未签到学员
      this.normalStudents = [] // 正常学员
      this.lateStudents = [] // 迟到学员
      this.leaveEarlyStudents = [] // 早退学员
      this.truancyStudents = [] // 旷课学员
      this.vacateStudents = [] // 请假学员
    },

    /**
       *  返回到活动主页面
       */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false)
    },

    /**
       *  返回签到页
       */
    handleshowRembersMain() {
      this.$parent.handleShowClassroomRembersMain()
    },

    /**
       *  返回成员页
       */
    tohandleshowRembersMain() {
      this.$parent.tohandleshowRembersMain()
    },

    /**
       *  查询当前活动所有学生签到状态
       */
    getSignInStudents() {
      const obj = {
        ctId: this.ctId,
        activityId: this.activityId
      }
      this.$api.activitySignIn.queryTraineeList(obj).then(res => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].signStateName === '已签到成员') { // 导入已签到学生
              this.alreadySignInStudents = res.data[i].children
              for (let j = 0; j < this.alreadySignInStudents.length; j++) {
                if (this.alreadySignInStudents[j].traineePic.indexOf('https://') === -1) {
                  this.alreadySignInStudents[j].traineePic = baseUrl + this.alreadySignInStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '未签到成员') { // 导入未签到学生
              this.notSignInStudents = res.data[i].children
              for (let j = 0; j < this.notSignInStudents.length; j++) {
                if (this.notSignInStudents[j].traineePic.indexOf('https://') === -1) {
                  this.notSignInStudents[j].traineePic = baseUrl + this.notSignInStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '正常') { // 导入正常学生
              this.normalStudents = res.data[i].children
              for (let j = 0; j < this.normalStudents.length; j++) {
                if (this.normalStudents[j].traineePic.indexOf('https://') === -1) {
                  this.normalStudents[j].traineePic = baseUrl + this.normalStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '迟到') { // 导入迟到学生
              this.lateStudents = res.data[i].children
              for (let j = 0; j < this.lateStudents.length; j++) {
                if (this.lateStudents[j].traineePic.indexOf('https://') === -1) {
                  this.lateStudents[j].traineePic = baseUrl + this.lateStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '早退') { // 导入早退学生
              this.leaveEarlyStudents = res.data[i].children
              for (let j = 0; j < this.leaveEarlyStudents.length; j++) {
                if (this.leaveEarlyStudents[j].traineePic.indexOf('https://') === -1) {
                  this.leaveEarlyStudents[j].traineePic = baseUrl + this.leaveEarlyStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '旷课') { // 导入旷课学生
              this.truancyStudents = res.data[i].children
              for (let j = 0; j < this.truancyStudents.length; j++) {
                if (this.truancyStudents[j].traineePic.indexOf('https://') === -1) {
                  this.truancyStudents[j].traineePic = baseUrl + this.truancyStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '请假') { // 导入请假学生
              this.vacateStudents = res.data[i].children
              for (let j = 0; j < this.vacateStudents.length; j++) {
                if (this.vacateStudents[j].traineePic.indexOf('https://') === -1) {
                  this.vacateStudents[j].traineePic = baseUrl + this.vacateStudents[j].traineePic
                }
              }
            }
          }
          for (let i = 0; i < this.signInState.length; i++) {
            if (this.signInState[i].dictCode === '1') {
              this.signInState[i].num = this.normalStudents.length
            } else if (this.signInState[i].dictCode === '2') {
              this.signInState[i].num = this.lateStudents.length
            } else if (this.signInState[i].dictCode === '3') {
              this.signInState[i].num = this.leaveEarlyStudents.length
            } else if (this.signInState[i].dictCode === '4') {
              this.signInState[i].num = this.truancyStudents.length
            } else if (this.signInState[i].dictCode === '5') {
              this.signInState[i].num = this.vacateStudents.length
            } else if (this.signInState[i].dictCode === '6') {
              this.signInState[i].num = this.alreadySignInStudents.length
            } else if (this.signInState[i].dictCode === '7') {
              this.signInState[i].num = this.notSignInStudents.length
            }
          }
          // 学生签到信息初始化
          this.changeState()
        }
      })
    },

    /**
       *  获取设置状态
       */
    getDictList() {
      this.$api.activitySignIn.getDictList().then(res => {
        if (res.code === 0) {
          this.signInState = [
            { dictCode: '6', dictValue: '已签到' },
            { dictCode: '7', dictValue: '未签到' }
          ]
          for (let i = 0; i < res.data.length; i++) {
            this.signInState.push(res.data[i])
          }
          this.dictList = res.data
          // 获取所有学员签到信息
          this.getSignInStudents()
        }
      })
    },
    /**
       *  切换签到状态的查看
       */
    handleSwitchState(value, index) {
      this.currState = value
      this.currStateIndex = index
      this.changeState()
      this.getSignInStudents()
    },
    /**
       *  选择状态改变
       */
    changeState() {
      if (this.currState === '6') { // 导入已签到
        this.signInStudents = this.alreadySignInStudents
      } else if (this.currState === '7') { // 导入未签到
        this.signInStudents = this.notSignInStudents
      } else if (this.currState === '1') { // 导入正常学员
        this.signInStudents = this.normalStudents
      } else if (this.currState === '2') { // 导入迟到学员
        this.signInStudents = this.lateStudents
      } else if (this.currState === '3') { // 导入早退成员
        this.signInStudents = this.leaveEarlyStudents
      } else if (this.currState === '4') { // 导入旷课成员
        this.signInStudents = this.truancyStudents
      } else if (this.currState === '5') { // 导入请假成员
        this.signInStudents = this.vacateStudents
      }
      for (let i = 0; i < this.signInState.length; i++) {
        if (this.currState === this.signInState[i].dictCode) {
          this.currStateInfo = this.signInState[i]
        }
      }
      this.multipleSelection = []
    },

    /**
       *  选择学员签到状态改变操作
       */
    changeStudentsState(state) {
      const changeStudents = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        changeStudents.push(this.multipleSelection[i].traineeId)
      }
      const obj = {
        ctId: this.ctId, // 课堂主键
        activityId: this.activityId, // 活动主键
        signState: state, // 签到状态1正常2迟到3早退4旷课5请假
        traineeIds: changeStudents // 被选的学员们
      }
      this.$api.activitySignIn.setTraineeSignState(obj).then(res => {
        if (res.code === 0) {
          toast(res.msg)
          // 清空数据
          this.clearInit()
          // 重新加载
          this.init()
        } else {
          toast(res.msg)
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
  /* 公共样式 */
  .content-area{
    height: 600px;
    display: flex;
  }
  /* 左侧状态导航样式 */
  .left-state-nav{
    width: 30%;
    border-right: 1px solid #eee;
  }
  .state-title{
    height: 60px;
    padding: 15px 20px;
    text-align: left;
    line-height: 60px;
    color: #007bff;
  }
  .state-title-span{
    display: block;
    border-left: 2px solid #007bff;
    height: 100%;
    line-height: 30px;
    padding-left: 10px;
  }
  .state-content{
    display: flex;
    height: 50px;
    justify-content: space-between;
    padding: 10px 20px;
    line-height: 30px;
  }
  .state-content:hover{
    background-color: #f5f5f5;
  }
  /* 右侧成员显示样式 */
  .right-students{
    width: 70%;
  }
  .students-operation{
    height: 60px;
    padding: 10px 30px;
    display: flex;
    justify-content: space-between;
  }
  .state-name{
    text-align: left;
    padding: 10px 30px;
    font-size: 20px;
  }
  .students-info{
    padding: 0 30px;
  }
</style>
