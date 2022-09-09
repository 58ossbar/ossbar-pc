<!-- 签到活动主页面 -->
<template>
  <div class="class-sign-in">
    <div class="location bg-fafafa">
      <div style="display: flex;width: 50%">
        <div class="localtion-title">
          <b>当前位置:</b>
        </div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer" @click="handleshowRembersMain()">
            活动
          </li>
          <li class="localtion-item">
            <span
              :class="handleSignInType?'item-span-color':'item-span-cursor'"
              @click="!handleSignInType && goToPageSignInType()">签到</span>
          </li>
          <li v-show="isShowStartSingIn" class="localtion-item">
            <span class="item-span-color">开始签到</span>
          </li>
          <li v-show="isShowStatistics" class="localtion-item">
            <span class="item-span-color">查看签到统计</span>
          </li>
        </ul>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="backPage()"/>
        <span @click="backPage()">返回</span>
      </div>
    </div>
    <div class="class-signin-con">
      <div class="head-title">
        <span class="square"/>
        <span class="title">签到</span>
      </div>
      <div v-if="handleSignInType" class="sign-in-box">
        <div class="sign-in-con">
          <div class="left-start-sign-in ">
            <div class="title-con">
              <h2>学生何时签到，何地签到一目了然</h2>
              <div class="start-btn" @click="handleStartSignIn">开始签到</div>
            </div>
            <img src="static/image/teaching_center/class_sign_in.png" alt="" >
          </div>
          <div class="right-statistics">
            <div class="title-con">
              <h2>整体统计，成员详情一应俱全</h2>
              <div class="start-btn" @click="handleExamineStatistics">查看签到统计</div>
            </div>
            <img src="static/image/teaching_center/class_statistics.png" alt="" >
          </div>
        </div>
        <div class="min-title">
          历史签到记录
        </div>
        <ul v-if="historySignInRecord.length>0" class="history-signin-list" >
          <li
            v-for="(record,index) in historySignInRecord"
            :key="index"
            class="history-item"
            @click="handleShowSignInDetails(record,false)">
            <div class="sign-in-type">
              {{ record.date }},{{ record.dayOfWeek }} {{ record.activityTitle }}
            </div>
            <div class="sign-in-time">{{ record.time }}</div>
            <div class="sign-in-number">{{ record.currentNum }}人/{{ record.totalNum }}人</div>
            <div class="operation">
              <img src="static/image/teaching_center/edit.png" alt="编辑" title="编辑" @click.stop="handleShowSignInDetails(record,true)">
              <img src="static/image/teaching_center/del.png" alt="删除" title="删除" @click.stop="delHistorySign(record.activityId)">
            </div>
          </li>
        </ul>
        <div v-if="historySignInRecord.length<=0" class="no-data-hint">
          <p>暂无数据</p>
        </div>
        <div>
          <pager
            v-if="historySignInPagerInfo.totalPage"
            :page-size-prop="historySignInPagerInfo.pageSizeProp"
            :curr-page="historySignInPagerInfo.currPage"
            :total-page="historySignInPagerInfo.totalPage"
            align="center"
            @changeIndex="changeHistorySignInIndex"
          />
        </div>
      </div>
      <!-- 历史签到信息查看模态框开始 -->
      <modal-dialog
        id="sign-in-details-dialog"
        :title="'历史签到信息（'+historySignInTime+'）'"
        :is-show-footer-btn="false"
        @cancel="cancelSignInModal">
        <div slot="main">
          <!-- 签到状态选择 -->
          <div style="width: 100%; background-color: #e2ebee;height: 50px; padding: 7px 10px; display: flex">
            <label v-show="isHistoryEdit" class="information-students-label">
              <input
                v-model="checked"
                type="checkbox"
                class=""
                @click="checkAll">
              <span>全选</span>
            </label>
            <select
              v-model="signInState"
              class="form-control information-title-select"
              style="font-size: 14px;height: 36px;width: 30%;padding: 2px 5px;"
              @change="changeSignInState()">
              <option
                v-for="(item,indexItem) in signInStateInfo"
                :key="indexItem"
                :value="item.state"
              >{{ item.name }}</option>
            </select>
            <div
              v-show="isHistoryEdit"
              class="activity-data-item"
              @click.stop="showChangeTeach($event,'1')">
              <span style="color: #007bff;">设置</span>
              <ul id="changeTeach1" :class="['changeTeach','changeTeach1',isPullDown?'changeTeach-bottom':'changeTeach-top']" style="left: 80%; top: 55px;" >
                <li v-for="(item,index) in dictList" :key="index" @click.stop="changeStudentsState(item.dictCode)">{{ item.dictValue }}</li>
              </ul>
            </div>
          </div>
          <!-- 显示选择签到状态的学生 -->
          <div class="sign-in-students">
            <div v-for="(item,index) in signInStudents" :key="index" class="student" style="display: flex" @click="changeCheckboxState(item.traineeId)">
              <div v-show="isHistoryEdit" class="students-checkbox">
                <input
                  :value="item.traineeId"
                  v-model="selectedStudents"
                  type="checkbox">
              </div>
              <!-- 头像 -->
              <div class="student-portrait">
                <img :src="item.traineePic" style="width: 40px;height: 40px" >
              </div>
              <!-- 姓名 -->
              <div class="student-name">
                {{ item.traineeName }}
              </div>
              <!-- 学号 -->
              <div class="student-number">
                {{ item.mobile }}
              </div>
            </div>
            <div v-if="signInStudents.length <= 0" style="text-align: center; padding: 60px 0">
              <img src="static/image/manage_board/nodate.svg" alt="提示">
              <p>暂无成员</p>
            </div>
          </div>
        </div>
      </modal-dialog>
      <!-- 历史签到信息查看模态框结束 -->
      <!-- 查看签到统计start -->
      <div v-if="isShowStatistics" class="class-sign-in-statistics">
        <div class="attendance-rate-cartogram-box">
          <div class="left-statistics">
            <broken-line
              id="statistics"
              :data-info="brokenLineInfo"
              width="100%"
              height="100%"/>
          </div>
          <div class="right-statistics-detail">
            <div class="checking-in-num">
              <img src="static/image/teaching_center/attendance_1.png" alt="编辑" title="编辑">
              <div class="right-detail">
                <h3>
                  <p>考勤次数</p>
                  <p>{{ otherInfo.totalNum }}</p>
                </h3>
              </div>
            </div>
            <div class="average-attendance">
              <div class="ring-ling-box">
                <ring-ling
                  id="activity-detail"
                  :radius="['58%', '65%']"
                  :data="[{value:100, name:'未参与活动率'},{value:10, name:'参与活动率'}]"
                  height="120"
                  width="120"
                  color="#5bd3bf"
                  name="平均出勤率"
                  rate="100%"/>
              </div>
              <div class="right-detail">
                <h3>
                  <p>平均出勤率</p>
                  <p>{{ otherInfo.averageAttendance }}</p>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div class="min-title">
          成员详情
        </div>
        <div class="classroom-member-detail-table">
          <table class="comm-table">
            <tr class="t-head">
              <th>姓名</th>
              <th>学号</th>
              <th>正常</th>
              <th>迟到</th>
              <th>早退</th>
              <th>旷课</th>
              <th>请假</th>
              <th>出勤率</th>
            </tr>
            <tr
              v-for="(memberDetail,index) in memberDetailList"
              :key="index"
              class="t-body">
              <td>
                <img :src="memberDetail.traineePic" alt="">
                <span>{{ memberDetail.traineeName }}</span>
              </td>
              <td>{{ memberDetail.jobNumber }}</td>
              <td>{{ memberDetail.normalNum }}</td>
              <td>{{ memberDetail.lateNum }}</td>
              <td>{{ memberDetail.leaveEarlyNum }}</td>
              <td>{{ memberDetail.truantNum }}</td>
              <td>{{ memberDetail.leaveNum }}</td>
              <td>{{ memberDetail.attendanceRate }}</td>
            </tr>
          </table>
          <div v-if="memberDetailList.length<=0" class="no-data-hint">
            <img src="static/image/manage_board/nodate.svg" alt="">
            <p>暂无数据</p>
          </div>
          <div >
            <pager
              v-if="memberDetailListPagerInfo.totalPage"
              :page-size-prop="memberDetailListPagerInfo.pageSizeProp"
              :curr-page="memberDetailListPagerInfo.currPage"
              :total-page="memberDetailListPagerInfo.totalPage"
              align="center"
              @changeIndex="changeMemberDetailListIndex"
            />
          </div>
        </div>
      </div>
      <!-- 查看签到统计end -->
      <!-- 签到类型start -->
      <div v-if="isShowStartSingIn" class="class-sign-in-type">
        <ul class="sign-in-type-list">
          <li class="type-item" @click="handleShowAnySingInModal">
            <div class="sing-in-img">
              <img src="static/image/teaching_center/sign_in_1.png" alt="">
            </div>
            <div class="sign-in-type-introduce any-sign-in">
              <p class="type-title">普通签到</p>
              <p>设置签到时长自动结束，更省心</p>
            </div>
          </li>
          <li class="type-item click-sign-in" @click="handleShowKeySingInModal">
            <div class="sing-in-img">
              <img src="static/image/teaching_center/sign_in_2.png" alt="">
            </div>
            <div class="sign-in-type-introduce">
              <p class="type-title">手工签到</p>
              <p>一键点击即可签到，更快捷</p>
            </div>
          </li>
          <li class="type-item gesture-sign-in" @click="handleShowGesturesSingInModal">
            <div class="sing-in-img">
              <img src="static/image/teaching_center/sign_in_3.png" alt="">
            </div>
            <div class="sign-in-type-introduce">
              <p class="type-title">手势签到</p>
              <p>输入正确的手势即可签到，更有趣</p>
            </div>
          </li>
        </ul>
        <!-- 普通签到弹窗start -->
        <modal-dialog
          id="any-sign-in-modal"
          :is-show-footer-btn="false"
          title="签到时长限制"
          @cancel="cancelAddAnySign"
        >
          <div slot="main" class="duration-astrict-main">
            <div class="time-title">设置签到时长，<span class="limit-time"><span v-show="gesture.hours != '00'">{{ gesture.hours }}小时</span>{{ gesture.minutes }}分钟</span>后自动结束签到</div>
            <div class="set-time-group">
              <div class="btn-group">
                <button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="timeHours">{{ gesture.hours }}</span> <span class="caret"/>
                </button>
                <ul class="dropdown-menu">
                  <li v-for="(item,index) in gestureTimeNumber" :key="index" @click="handleAddGestureHours(item)">{{ item }}</li>
                </ul>
              </div>
              <div class="time-text">时</div>
              <div class="btn-group">
                <button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="timeMinutes">{{ gesture.minutes }}</span> <span class="caret"/>
                </button>
                <ul class="dropdown-menu">
                  <li v-for="(item,index) in gestureTimeNumber" :key="index" @click="handleAddGestureMinutes(item)">{{ item }}</li>
                </ul>
              </div>
              <div class="time-text">分</div>
            </div>
            <div class="immediately-start" @click="submitOrdinarySignIn">立即开始</div>
          </div>
        </modal-dialog>
        <!-- 普通签到弹窗end -->
        <!-- 手势签到弹窗开始 -->
        <modal-dialog
          id="gestures-sign-in-modal"
          :is-show-footer-btn="false"
          title="手势签到设置"
          @cancel="ResetGestures">
          <div slot="main">
            <!-- 手势签到提示 -->
            <div>
              按住鼠标左键滑动创建手势签到
            </div>
            <div>
              学生输入正确手势完成签到。
            </div>
            <!-- 手势签到图案设置处 -->
            <gestures-content ref="myCanvas" v-model="gestureData" style="margin-right: 30px"/>
            <!-- 手势确认按钮 -->
            <div class="gestures-btn">
              <!-- <button @click="SubmitGesturesContent">立即开始</button>
              <button @click="ResetGestures">重置</button> -->
              <b-button
                :disabled="isViewSave"
                variant="outline-primary"
                size="sm"
                @click="SubmitGesturesContent">立即开始</b-button>
              <b-button
                variant="outline-secondary"
                size="sm"
                @click="ResetGestures">重置</b-button>
            </div>
          </div>
        </modal-dialog>
        <!-- 手势签到弹窗结束 -->
      </div>
      <!-- 签到类型end-->
    </div>
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import Pager from '@/components/pager'
import BrokenLine from '@/components/broken-line'
import RingLing from '@/components/ring-ling'
import ModalDialog from '@/components/modal-dialog'
import GesturesContent from './gestures-content'
import { baseUrl, confirm, toast } from '@/utils/global'
export default {
  name: 'ViewSignInMainPage',
  components: {
    'pager': Pager,
    'ring-ling': RingLing,
    'BrokenLine': BrokenLine,
    'modal-dialog': ModalDialog,
    'GesturesContent': GesturesContent
  },
  props: {
    // 当前教学包主键
    pkgId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      brokenLineInfo: {}, // 签到统计在折现图数据
      otherInfo: {
        totalNum: 0,
        averageAttendance: 0
      },
      // {
      //   title: '出勤统计图（%）',
      //   xAxisArr: ['04-01', '04-02', '04-03', '04-01', '04-02', '04-03', '04-01', '04-02', '04-03', '04-01', '04-02', '04-03', '04-02', '04-03'],
      //   seriesArr: [
      //     {name: '出勤率', type: 'line', stack: '总量', data: [100, 20, 30, 100, 20, 30, 100, 20, 30, 100, 20, 30, 100, 20]}
      //   ]
      // },
      isViewSave: false, // 是否禁用签到活动的新增
      ctId: localStorage.getItem('ct_id'), // 课堂主键
      handleSignInType: true, // 总页面显示
      isShowStatistics: false, // 签到统计页面显示
      isShowStartSingIn: false, // 签到类型选中页面显示

      /* 总页面的一些属性 */
      historySignInRecord: [], // 历史签到记录
      // 历史签到信息显示分页
      historySignInPagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSize: 5, // 分页大小
        pageSizeProp: 5// 分页大小

      },
      activityId: '', // 历史签到选中 编辑/查看 时当前签到活动id
      isHistoryEdit: false, // 是否是编辑
      historySignInTime: '', // 当前历史签到信息的时间
      selectedStudents: [], // 当前选中的学生
      checked: false, // 是否全选
      signInState: '1', // 选择查看签到信息的状态
      signInStateInfo: [], // 所有签到状态
      dictList: [], // 学生签到可设置状态
      isPullDown: false, // 设置下拉框是否显示状态
      signInStudents: [], // 所显示签到的学生
      normalStudents: [], // 正常学员
      lateStudents: [], // 迟到学员
      leaveEarlyStudents: [], // 早退学员
      truancyStudents: [], // 旷课学员
      vacateStudents: [], // 请假学员
      alreadySignInStudents: [], // 已签到学员
      notSignInStudents: [], // 未签到学员

      /* 签到统计一些属性 */
      memberDetailList: [], // 成员详情列表
      // 签到统计成员显示分页
      memberDetailListPagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSize: 5, // 分页大小
        pageSizeProp: 5// 分页大小
      },

      /* 签到类型选中的一些属性 */
      gestureTimeNumber: [], // 随时签到的时间选择数组
      // 选中的时与分
      gesture: {
        hours: '00',
        minutes: '00'
      },
      gestureData: [] // 手势签到排序

    }
  },
  watch: {
    // 监听左侧学员变化判断是否全选
    selectedStudents() {
      if (this.selectedStudents.length === this.signInStudents.length && this.signInStudents.length > 0) {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  },
  created() {
    // 查询历史签到记录
    this.getHistorySignInRecord()
    // //查询签到统计成员详情
    // this.getMemberDetailList();
  },
  methods: {
    /**
             *  返回活动页面
             */
    handleshowRembersMain() {
      this.handleSignInType = true
      this.isShowStartSingIn = false
      this.isShowStatistics = false
      this.$parent.changeVotoQuestionnairePage(false)
    },

    /**
             *   返回签到主页面
             */
    goToPageSignInType() {
      this.handleSignInType = true
      this.isShowStartSingIn = false
      this.isShowStatistics = false
    },

    /**
             *  返回事件
             */
    backPage() {
      if (this.handleSignInType) {
        this.handleshowRembersMain()
      } else {
        this.goToPageSignInType()
      }
    },

    /**
             *  显示签到主页面
             */
    handleSignInMainPage() {
      this.handleSignInType = true
      this.isShowStartSingIn = false
      this.isShowStatistics = false
      this.getHistorySignInRecord()
    },

    /**
             *  显示开始签到页面
             */
    handleStartSignIn() {
      this.handleSignInType = false
      this.isShowStartSingIn = true
      this.isShowStatistics = false
    },

    /**
             *  显示签到统计页面
             */
    handleExamineStatistics() {
      this.handleSignInType = false
      this.isShowStartSingIn = false
      this.isShowStatistics = true
      // 查询签到统计成员详情
      this.getMemberDetailList()
      this.getAttendanceStatisticsChart()
    },

    getAttendanceStatisticsChart() {
      // 清空历史签到记录
      this.brokenLineInfo = {}
      // 创建调用历史签到查询接口的参数对象
      const obj = {
        ctId: this.ctId
      }
      // 调用历史签到查询接口
      this.$api.activitySignIn.viewAttendanceStatisticsChart(obj).then(res => {
        if (res.code === 0) {
          this.brokenLineInfo = (res.data && res.data.brokenLineInfo) ? (res.data.brokenLineInfo) : {}
          this.otherInfo = res.data.otherInfo
        }
      })
    },

    /**
             *  历史签到记录更新分页数据
             */
    changeHistorySignInIndex(value, size) {
      this.historySignInPagerInfo.currPage = value
      this.historySignInPagerInfo.pageSize = size
      this.getHistorySignInRecord()
    },

    /**
             *  获取历史签到记录
             */
    getHistorySignInRecord() {
      // 清空历史签到记录
      this.historySignInRecord = []
      // 创建调用历史签到查询接口的参数对象
      const obj = {
        ctId: this.ctId,
        pageNum: this.historySignInPagerInfo.currPage,
        pageSize: this.historySignInPagerInfo.pageSize
      }
      // 调用历史签到查询接口
      this.$api.classroomMember.historySignInRecord(obj).then(res => {
        if (res.code === 0) {
          // 存入总页数
          this.historySignInPagerInfo.totalPage = res.data.totalPage
          // 存入历史签到信息
          if (res.data.totalCount > 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              this.historySignInRecord.push(res.data.list[i])
            }
          }
        }
      })
    },

    /**
             *  查看/编辑 历史签到信息事件
             */
    handleShowSignInDetails(record, isHistoryEdit) {
      // 存入判断是否是编辑
      this.isHistoryEdit = isHistoryEdit
      // 打开历史签到信息详情模态框
      $('#sign-in-details-dialog').modal('show')
      // 存入当前点击的历史签到的时间、活动id
      this.historySignInTime = record.createTime
      this.activityId = record.activityId
      // 调用当前历史签到信息获取方法
      this.getHistorySignInfo()
    },

    /**
             *  获取历史签到信息
             */
    getHistorySignInfo() {
      // 获取所有的签到状态
      this.$api.activitySignIn.getDictList().then(res => {
        if (res.code === 0) {
          this.signInStateInfo = []
          this.dictList = res.data
          for (let i = 0; i < res.data.length; i++) {
            const obj = {
              state: res.data[i].dictCode,
              name: res.data[i].dictValue
            }
            this.signInStateInfo.push(obj)
          }
          this.signInStateInfo.push({ state: '6', name: '已签到' }, { state: '7', name: '未签到' })
        }
      })
      // 获取所有学员的签到信息
      const obj = {
        ctId: this.ctId,
        activityId: this.activityId
      }
      this.$api.activitySignIn.queryTraineeList(obj).then(res => {
        if (res.code === 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].signStateName === '已签到成员') { // 导入已签到学生
              this.alreadySignInStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.alreadySignInStudents.length; j++) {
                if (this.alreadySignInStudents[j].traineePic.indexOf('https://') === -1) {
                  this.alreadySignInStudents[j].traineePic = baseUrl + this.alreadySignInStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '未签到成员') { // 导入未签到学生
              this.notSignInStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.notSignInStudents.length; j++) {
                if (this.notSignInStudents[j].traineePic.indexOf('https://') === -1) {
                  this.notSignInStudents[j].traineePic = baseUrl + this.notSignInStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '正常') { // 导入正常学生
              this.normalStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.normalStudents.length; j++) {
                if (this.normalStudents[j].traineePic.indexOf('https://') === -1) {
                  this.normalStudents[j].traineePic = baseUrl + this.normalStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '迟到') { // 导入迟到学生
              this.lateStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.lateStudents.length; j++) {
                if (this.lateStudents[j].traineePic.indexOf('https://') === -1) {
                  this.lateStudents[j].traineePic = baseUrl + this.lateStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '早退') { // 导入早退学生
              this.leaveEarlyStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.leaveEarlyStudents.length; j++) {
                if (this.leaveEarlyStudents[j].traineePic.indexOf('https://') === -1) {
                  this.leaveEarlyStudents[j].traineePic = baseUrl + this.leaveEarlyStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '旷课') { // 导入旷课学生
              this.truancyStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.truancyStudents.length; j++) {
                if (this.truancyStudents[j].traineePic.indexOf('https://') === -1) {
                  this.truancyStudents[j].traineePic = baseUrl + this.truancyStudents[j].traineePic
                }
              }
            } else if (res.data[i].signStateName === '请假') { // 导入请假学生
              this.vacateStudents = res.data[i].children
              // 学生头像图片处理
              for (let j = 0; j < this.vacateStudents.length; j++) {
                if (this.vacateStudents[j].traineePic.indexOf('https://') === -1) {
                  this.vacateStudents[j].traineePic = baseUrl + this.vacateStudents[j].traineePic
                }
              }
            }
          }
          // 调用当前签到状态改变学生信息改变的方法
          this.changeSignInState()
        }
      })
    },

    /**
             *  全选按钮单击事件
             */
    checkAll() {
      if (this.checked) { // 取消全选
        this.selectedStudents = []
      } else { // 全选
        this.signInStudents.forEach((item) => {
          if (this.selectedStudents.indexOf(item.traineeId) === -1) {
            this.selectedStudents.push(item.traineeId)
          }
        })
      }
    },

    /**
             *  学生信息单击时复选框的选中与取消
             */
    changeCheckboxState(traineeId) {
      if (this.selectedStudents.indexOf(traineeId) === -1) {
        this.selectedStudents.push(traineeId)
      } else {
        for (let i = 0; i < this.selectedStudents.length; i++) {
          if (this.selectedStudents[i] === traineeId) {
            this.selectedStudents.splice(i, 1)
          }
        }
      }
    },

    /**
             * 下拉菜单适应屏幕高度决定向上/向下显示
             */
    showChangeTeach: function(e, value) {
      const documentHeight = document.documentElement.clientHeight // 获取页面的高度
      const moreActionIconTop = e.target.getBoundingClientRect().y // 获取你点击时候的高度
      const dropdownHeight = $('#changeTeach' + value).outerHeight()
      if ((documentHeight - moreActionIconTop) < (dropdownHeight + 20)) {
        this.isPullDown = false
      } else {
        this.isPullDown = true
      }
      if ($('.changeTeach' + value).css('display') === 'block') {
        $('.changeTeach' + value).css('display', 'none')
      } else {
        $('.changeTeach').css('display', 'none')
        $('.changeTeach' + value).css('display', 'block')
      }
    },

    /**
             *  查看的签到信息状态改变
             */
    changeSignInState() {
      this.selectedStudents = []
      if (this.signInState === '1') { // 导入正常学员
        this.signInStudents = this.normalStudents
      } else if (this.signInState === '2') { // 导入迟到学员
        this.signInStudents = this.lateStudents
      } else if (this.signInState === '3') { // 导入早退成员
        this.signInStudents = this.leaveEarlyStudents
      } else if (this.signInState === '4') { // 导入旷课成员
        this.signInStudents = this.truancyStudents
      } else if (this.signInState === '5') { // 导入请假成员
        this.signInStudents = this.vacateStudents
      } else if (this.signInState === '6') { // 导入已签到成员
        this.signInStudents = this.alreadySignInStudents
      } else if (this.signInState === '7') { // 导入未签到成员
        this.signInStudents = this.notSignInStudents
      }
    },

    /**
             *  选择学员签到状态改变操作
             */
    changeStudentsState(state) {
      const obj = {
        ctId: this.ctId, // 课堂主键
        activityId: this.activityId, // 活动主键
        signState: state, // 签到状态1正常2迟到3早退4旷课5请假
        traineeIds: this.selectedStudents // 被选的学员们
      }
      this.$api.activitySignIn.setTraineeSignState(obj).then(res => {
        if (res.code === 0) {
          toast(res.msg)
          // 清空数据
          this.cancelSignInModal()
          // 重新加载
          this.getHistorySignInfo()
        } else {
          toast(res.msg)
        }
      })
    },

    /**
             *  清空当前签到信息
             */
    cancelSignInModal() {
      // 清空数据
      this.signInStateInfo = []
      this.alreadySignInStudents = [] // 已签到学员
      this.notSignInStudents = [] // 未签到学员
      this.normalStudents = [] // 正常学员
      this.lateStudents = [] // 迟到学员
      this.leaveEarlyStudents = [] // 早退学员
      this.truancyStudents = [] // 旷课学员
      this.vacateStudents = [] // 请假学员
    },

    /**
             *  删除历史签到记录
             *  @param activityId
             */
    delHistorySign(activityId) {
      const that = this
      const obj = { activityId: activityId }
      confirm('你确定要删除这条历史签到记录吗？', function() {
        that.$api.classroomMember.deleteHistorySigninInfo(obj).then(res => {
          if (res.code === 0) {
            toast('删除成功')
            // 刷新历史签到记录
            that.getHistorySignInRecord()
          } else {
            toast(res.msg)
          }
        })
      })
    },

    /**
             *  签到统计成员列表更新分页数据
             *  @param value
             */
    changeMemberDetailListIndex(value, size) {
      // 存入当前页
      this.memberDetailListPagerInfo.currPage = value
      this.memberDetailListPagerInfo.pageSize = size

      this.getMemberDetailList()
    },

    /**
             *  签到统计成员详情列表查询
             */
    getMemberDetailList() {
      this.memberDetailList = []
      const obj = {
        ctId: this.ctId,
        pageNum: this.memberDetailListPagerInfo.currPage,
        pageSize: this.memberDetailListPagerInfo.pageSize
      }
      this.$api.classroomMember.queryTraineeSigninDetail(obj).then(res => {
        if (res.code === 0) {
          this.memberDetailListPagerInfo.totalPage = res.data.totalPage
          if (res.data.totalCount > 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              const traineePic = res.data.list[i].traineePic
              if (traineePic.indexOf('http') === -1) {
                res.data.list[i].traineePic = baseUrl + traineePic
              }
              this.memberDetailList.push(res.data.list[i])
            }
          }
        }
      })
    },

    /**
             *  点击显示/关闭普通签到弹窗
             */
    handleShowAnySingInModal() {
      this.generateTimeArray()
      $('#any-sign-in-modal').modal('show')
    },
    handleShutOrdinarySingInModal() {
      $('#any-sign-in-modal').modal('hide')
      this.handleSignInMainPage()
    },

    /**
             *  时间选择数组生成
             */
    generateTimeArray() {
      for (let i = 0; i < 60; i++) {
        let temp = ''
        if (i < 10) {
          temp = '0' + i
        } else {
          temp = i.toString()
        }
        this.gestureTimeNumber.push(temp)
      }
    },

    /**
             *  取消普通签到
             */
    cancelAddAnySign() {
      this.gesture.hours = '00'
      this.gesture.minutes = '00'
      this.gestureTimeNumber = []
    },

    /**
             *  普通签到选择小时与分组
             */
    handleAddGestureHours(value) {
      this.gesture.hours = value
    },
    handleAddGestureMinutes(value) {
      this.gesture.minutes = value
    },

    /**
             *  提交普通签到
             */
    submitOrdinarySignIn() {
      const hours = parseInt(this.gesture.hours)
      const minutes = parseInt(this.gesture.minutes)
      const limitTime = hours * 60 + minutes
      if (limitTime !== 0) {
        const obj = {
          signType: 1,
          pkgId: this.pkgId,
          limitTime: limitTime
        }
        this.$api.teachingCenter.saveSigninInfo(obj).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.handleShutOrdinarySingInModal()
            this.cancelAddAnySign()
          } else {
            toast(res.msg)
          }
        })
      } else {
        toast('时间太短')
      }
    },

    /**
             *  点击显示手工签到页面
             */
    handleShowKeySingInModal() {
      const obj = {
        signType: 3,
        pkgId: this.pkgId
      }
      this.$api.teachingCenter.saveSigninInfo(obj).then(res => {
        if (res.code === 0) {
          this.$emit('child-event', res.data)
          this.getKeySignInModal()
        } else {
          toast(res.msg)
        }
      })
    },

    /**
             *  手工签到页面跳转
             */
    getKeySignInModal() {
      this.$parent.toShowKeySignContent()
    },

    /**
             *  点击显示/关闭手势签到弹窗
             */
    handleShowGesturesSingInModal() {
      $('#gestures-sign-in-modal').modal('show')
    },
    handleShutGesturesSingInModal() {
      $('#gestures-sign-in-modal').modal('hide')
      this.handleSignInMainPage()
    },

    /**
             *  重置手势签到
             *  @constructor
             */
    ResetGestures() {
      this.gestureData = []
      this.$refs.myCanvas.onReset()
    },

    /**
             * 提交手势签到
             * @constructor
             */
    SubmitGesturesContent() {
      let gesturesNumber = this.gestureData.toString()
      gesturesNumber = gesturesNumber.replace(/,/g, '')
      if (gesturesNumber.length <= 2) {
        toast('至少要连接3个及以上的点')
      } else {
        this.isViewSave = true
        const obj = {
          signType: 2,
          pkgId: this.pkgId,
          number: gesturesNumber
        }
        this.$api.teachingCenter.saveSigninInfo(obj).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.gestureData = []
            this.handleShutGesturesSingInModal()
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
  .item-span-color{
    color: #959da0;
  }
  .item-span-cursor{
    cursor: pointer;
  }
  .class-sign-in{
    width:100%;
    background-color:#fafafa;
    text-align: left;
  }
  .class-sign-in .location{
    display: flex;
    align-items: center;
    width: 100%;
    height:60px;
    line-height:60px;
    padding-left:20px;
  }
  .class-sign-in .location .localtion-list{
    display: flex;
    align-items: center;
  }
  .class-sign-in .location .localtion-list .localtion-item+ .localtion-item::before{
    content: '>';
  }
  .class-signin-con{
    padding:0px 20px;
    background-color:#fff;
  }
  .class-signin-con .head-title{
    width:100%;
    height:80px;
    line-height:80px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  .class-signin-con .head-title > span{
    display: inline-block;
    /* vertical-align: middle; */
  }
  .class-signin-con .head-title .square{
    width: 10px;
    height:10px;
    background-color:#1fbbdb;
    margin-right:10px;
  }
  .class-signin-con .head-title .title{
    font-size: 18px;
  }
  .class-signin-con .sign-in-con{
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding:20px 0px;
  }
  .class-signin-con .sign-in-con > div{
    display: flex;
    width:48%;
    height:210px;
    border-radius: 4px;
    padding:25px;
  }
  .class-signin-con .sign-in-con .left-start-sign-in{
    background-color: #ef963f;
  }
  .class-signin-con .sign-in-con .right-statistics{
    background-color: #7ea6f4;
  }
  .class-signin-con .sign-in-con .title-con h2{
    color:#fff;
    font-size:20px;
    font-weight:400;
    margin-top:10px;
  }
  .class-signin-con .sign-in-con .title-con .start-btn{
    width:180px;
    height:45px;
    line-height:50px;
    text-align: center;
    border-radius: 3px;
    font-size: 18px;
    color:#fff;
    border: 1px solid #fff;
    margin-top: 60px;
    cursor: pointer;
  }
  .min-title{
    width:100%;
    height: 60px;
    line-height:60px;
    color:#333;
    font-size: 18px;
  }
  .history-signin-list{
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  .history-signin-list .history-item{
    display: flex;
    padding:15px;
    border-top: 1px solid #eee;
  }
  .history-signin-list .history-item:hover{
    background-color: #F5F5F5;
  }
  .history-signin-list .history-item .sign-in-type{
    flex: 3;
  }
  .history-signin-list .history-item .sign-in-number{
    flex: 3;
  }
  .history-signin-list .history-item .sign-in-time{
    flex: 3;
  }
  .history-signin-list .history-item .operation >img{
    margin-left:10px;
    cursor: pointer;
  }
  .class-sign-in-type{
    width: 100%;
    height:410px;
    padding:10px 25px;
    background-color: #eff3f3;
    text-align: center;

  }
  .class-sign-in-type .sign-in-type-list{
    display: flex;
    justify-content: space-around;
    width: 100%;
    height:100%;
  }
  .class-sign-in-type .sign-in-type-list .type-item{
    width:28%;
    height:100%;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
  }
  .class-sign-in-type .sign-in-type-list .type-item .sing-in-img{
    background-color: #4ba5eb;
    padding:45px 0px;
  }
  .class-sign-in-type .sign-in-type-list .type-item .sing-in-img > img{
    width:140px;
    height:150px;
  }
  .class-sign-in-type .sign-in-type-list  .click-sign-in .sing-in-img{
    background-color: #ef7f65;
  }
  .class-sign-in-type .sign-in-type-list  .gesture-sign-in .sing-in-img{
    background-color: #a27ed9;
  }
  .class-sign-in-type .sign-in-type-list .type-item .sing-in-img{
    width:100%;
  }
  .class-sign-in-type .sign-in-type-list .type-item .sign-in-type-introduce{
    margin-top:35px;
  }
  .sign-in-type-list .type-item .sign-in-type-introduce .type-title{
    font-size: 18px;
  }
  .sign-in-type-list .type-item .sign-in-type-introduce > p{
    padding:5px 0;
  }
  /* 查看签到统计 */
  .attendance-rate-cartogram-box{
    display: flex;
    width: 100%;
    border: 1px solid #999;
    padding:20px;
  }
  .attendance-rate-cartogram-box .left-statistics{
    width: 70%;
  }
  .attendance-rate-cartogram-box .right-statistics-detail{
    width: 30%;
    border-left: 1px solid #ddd;
  }

  .attendance-rate-cartogram-box .right-statistics-detail > div{
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 120px;
    margin:20px 0;
  }
  .attendance-rate-cartogram-box .right-statistics-detail .right-detail h3{
    font-size: 22px;
    font-weight: 400;
    text-align: center;
  }
  .attendance-rate-cartogram-box .right-statistics-detail .right-detail h3 > p{
    padding: 12px 0;
  }
  .classroom-member-detail-table{
    width: 100%;
  }
  .comm-table{
    width: 100%;
  }
  .comm-table tr{
    width: 100%;
  }
  .comm-table tr td,th{
    padding:0 10px;
  }
  .comm-table .t-head{
    height: 60px;
    line-height: 60px;
    background-color: #eff3f3;
  }
  .comm-table .t-body{
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #e1e1e1;
  }
  .comm-table .t-body > td > img{
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  /* 随时签到样式 */
  .btn-group > button{
    background-color: #FFFFFF;
    padding: 5px 0;
    width: 80px;
  }
  .dropdown-menu{
    min-width: 80px;
    max-height: 137px;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style:none;
  }
  ::-webkit-scrollbar{
    display: none;
  }
  .dropdown-menu li{
    text-align: center;
  }
  .dropdown-menu li:hover{
    background-color: #a0a8ab;
  }
  /* 模态框的样式 */
  .duration-astrict-main .time-title{
    padding:40px 0;
  }
  .duration-astrict-main .limit-time{
    color: #06bdde;
  }
  .duration-astrict-main .set-time-group{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:20px 0;
  }
  .duration-astrict-main .set-time-group .btn-group{
    border: 1px solid #e8e8e8;
  }
  .duration-astrict-main .set-time-group .time-text{
    color:#9f9f9f;
    padding:0 5px;
  }
  .duration-astrict-main{
    text-align: center;
    font-size: 20px;
  }
  .duration-astrict-main .immediately-start{
    display: inline-block;
    width:130px;
    height:40px;
    font-size: 18px;
    line-height:40px;
    background-color:#00bbdd;
    text-align: center;
    border-radius: 25px;
    color:#fff;
    font-weight: 600;
    margin: 30px 0;
    cursor: pointer;
  }
  /* 手势签到按钮样式 */
  .gestures-btn{
      margin:20px 0;
      text-align: center;
  }
  .gestures-btn button{
      width: 100px;
      margin-right:10px;
  }
  /* 返回 */
  .classroom-back{
    width: 50%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
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
  /* 历史签到学习模态框样式 */
  .sign-in-students{
    height: 300px;
    overflow-y: scroll;
  }
  .student{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eaeaea;
  }
  .student:hover{
    background-color: #F5F5F5;
  }
  .student-portrait{
    width: 20%;
    margin-left: 10px;
  }
  .student-name{
    width: 30%;
  }
  /* 历史签到复选框样式 */
  .information-students-label{
    width: 15%;
    margin: 0;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
  .students-checkbox{
    width: 10%;
    text-align: left;
    padding-left: 10px;
  }
  /* 下拉样式 */
  .activity-data-item{
    margin-left: 43%;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
</style>
