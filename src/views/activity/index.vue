<template>
  <!-- 活动列表页面 -->
  <div class="activity-library pck-min-height">
    <!--活动首页 begin -->
    <div v-if="isShowPageActivityMain">
      <!-- 活动菜单 begin -->
      <div v-if="(hasPermission || hasAddActPermission) && (isClassroomDetail ? true : releaseStatus == 'N') && !isClassroomFinished" class="activity-header-nav">
        <i class="fa fa-bar-chart-o" aria-hidden="true" style="color: #158aeb" @click="showVote(true)">
          <span class="icon-name">投票问卷</span>
        </i>
        <i v-if="isClassroomDetail && !chapterId" class="fa fa-bullseye" aria-hidden="true" style="color: #ebdb11;" @click="showPerformance(true)">
          <span class="icon-name">课堂表现</span>
        </i>
        <i v-if="isClassroomDetail && !chapterId" class="fa fa-calendar-check-o" aria-hidden="true" style="color: #24baeb;" @click="showSign(true)">
          <span class="icon-name">签到</span>
        </i>
      </div>
      <!-- 活动菜单 end -->
      <div v-if="hasPermission" class="activity-nav-line"/>
      <!-- 活动状态 begin -->
      <div v-if="isClassroomDetail" class="activity-state-dict">
        <div style="display: flex;align-items:center;padding-left:20px;padding-top:11px;">
          <el-radio v-for="(dict, index) in activityStateList" :key="index" v-model="params.activityState" :label="dict.dictCode" @change="handleActivityState(dict.dictCode)">{{ dict.dictValue }}</el-radio>
        </div>
        <el-select v-model="params.activityType" size="medium" clearable placeholder="根据活动类型搜索" @change="getListActivity">
          <el-option
            v-for="dict in activityTypeList"
            :key="dict.dictId"
            :label="dict.dictValue"
            :value="dict.dictCode"
          />
        </el-select>
        <el-input
          v-model="params.activityTitle"
          placeholder="根据活动名称搜索"
          style="width:30%"
          size="medium"
          suffix-icon="el-icon-search"
          @change="handleSearchActivity"
          @keyup.enter.native="handleSearchActivity"/>
      </div>
      <!-- 活动状态 end -->
      <!-- 活动列表区域 begin -->
      <div
        v-for="(activity, index) in listActivity"
        v-show="listActivity.length > 0"
        :id="'activity'+index"
        :key="index"
        class="activity-list">
        <!-- item begin -->
        <div class="card activity-list-item">
          <!-- 分组 begin -->
          <button
            :data-target="chapterId?'#resources1'+index:'#resources2'+index"
            :aria-controls="chapterId?'resources1'+index:'resources2'+index"
            class="card-header btn"
            style="text-align: left"
            data-toggle="collapse"
            aria-expanded="true"
          >
            <div style="display: flex">
              <div>{{ activity.resgroupName }}</div>
            </div>
          </button>
          <!-- 分组 end -->
          <!-- 子项 beign -->
          <div
            :class="['collapse', currentActivityItem===index?'show':'show']"
            :id="chapterId?'resources1'+index:'resources2'+index">
            <!-- begin -->
            <div class="activity-children-con">
              <div
                v-for="(childrenItem,childrenIndex) in activity.children"
                :class="(childrenIndex+1) == activity.children.length ? 'activity-children-item teachzhiliao no-line' : 'activity-children-item teachzhiliao'"
                :key="childrenIndex"
                @click="clickActivityInfo(childrenItem)">
                <!-- 活动基本信息 begin -->
                <img :src="childrenItem.activityPic" :onerror="logo" style="width: 80px;height: 70px;margin: 25px" >
                <div style="margin-top: 25px;" class="children-con">
                  <!-- 活动标题、状态 begin -->
                  <div class="activity-title-con">
                    <span :class="['state',childrenItem.stateStyle]">{{ childrenItem.activityState | filterActivityState }}</span>
                    <span class="activity-title">【{{ childrenItem.activityTypeName }}】{{ childrenItem.activityTitle }}</span>
                  </div>
                  <!-- 活动标题、状态 end -->
                  <!-- 其他数据 begin -->
                  <div v-if="childrenItem.activityType !== '8'" class="activity-detail-list">
                    <span v-if="childrenItem.activityType !== '6' && childrenItem.activityType !== '7'" class="question-num">共&nbsp;{{ childrenItem.questionNumber ? childrenItem.questionNumber : 0 }}&nbsp;道题目</span>
                    <span v-if="childrenItem.activityType === '6'" class="empirical-num">{{ childrenItem.type === '1' ? '学员抢答' : (childrenItem.type === '2' ? '随机选人' : '手动选人') }}</span>
                    <span v-if="(hasPermission && childrenItem.activityType === '4') || childrenItem.activityType !== '4'" class="answer-num">共&nbsp;{{ childrenItem.answerNumber }}&nbsp;人作答</span>
                    <span v-if="!hasPermission && childrenItem.activityType === '4'" class="answer-num">{{ childrenItem.hasBeenDoenTimes === 0 ? '未完成' : (childrenItem.hasBeenDoenTimes > childrenItem.redoNum ? '已完成' : ('已重做' + (parseInt(childrenItem.hasBeenDoenTimes) - 1) + '/' + childrenItem.redoNum)) }}</span>
                    <span v-if="childrenItem.activityBeginTime" class="activity-time">{{ childrenItem.activityBeginTime }}</span>
                    <span class="empirical-num">{{ childrenItem.empiricalValue }}&nbsp;经验</span>
                    <span v-if="childrenItem.chapterName && !chapterId" :title="childrenItem.chapterName" class="chapter-name">{{ childrenItem.chapterName }}</span>
                  </div>
                  <div v-if="childrenItem.activityType === '8'" class="activity-detail-list">
                    <span class="question-num">共&nbsp;{{ childrenItem.totalTraineeNum }}&nbsp;人参与</span>
                    <span class="answer-num">已签到&nbsp;{{ childrenItem.answerNumber }}&nbsp;人</span>
                    <span v-if="childrenItem.activityBeginTime" class="activity-time">{{ childrenItem.activityBeginTime }}</span>
                    <span class="empirical-num">未签到&nbsp;{{ childrenItem.unSignNum }}&nbsp;人</span>
                  </div>
                  <!-- 其他数据 end -->
                </div>
                <!-- 活动基本信息 end -->
                <!-- 一些操作按钮 begin -->
                <div class="activity-data">
                  <div v-if="isClassroomDetail" class="activity-data-item">
                    <div
                      v-if="(hasPermission || childrenItem.hasEndActPermission) && childrenItem.activityState=='1'"
                      class="btn"
                      @click.stop="endActivityInfo(childrenItem)">
                      <img src="static/image/teaching_center/activity_end.png">
                      <span>结束活动</span>
                    </div>
                    <div
                      v-if="(hasPermission || childrenItem.hasStartActPermission) && (childrenItem.activityState=='0')"
                      class="btn"
                      @click.stop="startActivityInfo(childrenItem)">
                      <img src="static/image/teaching_center/activity_start.png">
                      <span>开始活动</span>
                    </div>
                  </div>
                  <!-- 下拉菜单按钮 begin -->
                  <el-dropdown v-if="(hasPermission || childrenItem.hasEditActPermission || childrenItem.hasDeleteActPermission) && (((childrenItem.hasPermission||childrenItem.isRoomCreator || childrenItem.hasEditActPermission) && childrenItem.activityType !== '8') || ((childrenItem.activityType !== '8' && childrenItem.activityType !== '4') || ((childrenItem.hasPermission && childrenItem.activityType !== '8') || childrenItem.hasBeenDone)) || ((childrenItem.hasPermission || childrenItem.hasDeleteActPermission))) && ((childrenItem.activityType !== '6' && childrenItem.activityType !== '8') || childrenItem.activityState !== '1')" class="activity-data-item" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <i class="fa fa-list-ul" @click.stop=""/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="childrenItem.activityType !== '6' && (childrenItem.hasPermission || childrenItem.hasEditActPermission) && childrenItem.activityState === '0' && childrenItem.activityType !== '8'" :command="beforeHandleCommand(1,childrenItem)" icon="el-icon-edit">编辑</el-dropdown-item>
                      <el-dropdown-item v-if="childrenItem.activityType !== '6' && ((childrenItem.activityType !== '8' && childrenItem.activityType !== '4') || (((childrenItem.hasPermission||childrenItem.isRoomCreator) && childrenItem.activityType !== '8') || childrenItem.hasBeenDone))" :command="beforeHandleCommand(2,childrenItem)" icon="el-icon-question">信息</el-dropdown-item>
                      <el-dropdown-item v-if="(childrenItem.hasPermission || childrenItem.hasDeleteActPermission) && childrenItem.activityState !== '1'" :command="beforeHandleCommand(3,childrenItem)" icon="el-icon-delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- 下拉菜单按钮 begin -->
                </div>
                <!-- 一些操作按钮 end -->
              </div>
            </div>
            <!-- end -->

          </div>
          <!-- 子项 beign -->
        </div>
        <!-- item end -->

      </div>
      <!-- 活动列表区域 end -->
      <!-- 无活动时的提示 begin -->
      <div v-if="listActivity.length == 0" class="no-activity-hint">
        <img src="static/image/manage_board/creatkc.png" alt="">
        <p>暂无活动</p>
      </div>
      <!-- 无活动时的提示 end -->
    </div>
    <!--活动首页 end -->

    <!-- 活动开始时间选择弹出框begin -->
    <modal-dialog
      id="date-picker-modal"
      title="活动结束时间设置"
      @cancel="handleCancel"
      @submit="handleSubmit">
      <div slot="main" style="text-align: left;padding: 10px 10px 20px 10px;">
        <div>
          <span style="display: inline-block;width:25%;">活动结束时间</span>
          <el-date-picker
            v-model="activityEndTime"
            :picker-options="option"
            style="width:70%"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期时间"
            @change="handle"/>
        </div>

        <div style="font-size: 14px;color: #ff5524;margin-top:10px;color:#FF740e">不设置则需手动结束活动</div>
      </div>
    </modal-dialog>
    <!-- 活动开始时间选择弹出框end -->

    <!-- ================================================== 【模块】投票/问卷 begin ================================================== -->
    <!-- 新增修改查看页面共用 -->
    <save-vote-questionnaire-new
      v-if="isShowPageActivityVote"
      :has-permission="hasPermission"
      :has-add-act-permission="hasAddActPermission"
      :pkg-id="pkgId"
      :subject-id="subjectId"
      :activity-id="activityId"
      :chapter-id="chapterId"
      :is-edit="isEditVotoQuestionnaire"
      :is-view="isViewVotoQuestionnaire"
      @changeVotoQuestionnairePage="changeVotoQuestionnairePage"
    />
    <!-- 查看学员提交的问卷（总览页面） -->
    <view-vote-trainee-answer
      v-if="isShowPageVoteTraineeAnswer"
      :activity-info="activityInfo"
      :ct-id="ctId"
    />
    <!-- 学员填写问卷 -->
    <view-vote-question-list
      v-if="isShowPageVoteQuestionList"
      :activity-info="activityInfo"
      :ct-id="ctId"
    />
    <!-- ================================================== 【模块】投票/问卷 end ================================================== -->

    <!-- ================================================== 【模块】课堂表现 begin ================================================== -->
    <save-classroom-performance
      v-if="isShowClassroomPerformance"
      :pkg-id="pkgId"
      :ct-id="ctId"
      :subject-id="subjectId"
      :present-is-edit-states="presentIsEditStates"
      :activity-id="activityId"
    />
    <!-- 选人 -->
    <candidates
      v-if="isShowCandidates"
      :ct-id="ctId"
      :activity-info="activityInfo"
    />

    <!-- 等待抢答 -->
    <waiting-vies-answer
      v-if="isShowWaitingViesAnswer"
      :ct-id="ctId"
      :has-permission="hasPermission"
      :activity-info="activityInfo"
    />

    <raise-hand-page
      v-if="isShowRaiseHand"
      :ct-id="ctId"
      :activity-info="activityInfo"
    />

    <team-evaluation
      v-if="isShowTeamEvaluation"
    />
    <!-- ================================================== 【模块】课堂表现 end ================================================== -->

    <!-- ================================================== 【模块】从签到活动 begin ================================================== -->
    <!-- 签到活动的主页面 -->
    <view-sign-in-main-page
      v-if="isShowSignInMain"
      :pkg-id="pkgId"
      @child-event="acquireKeySingInActivityId"
    />
    <!-- 签到详情页面 -->
    <view-key-sign-in
      v-if="isShowViewKeySignIn"
      :ct-id="ctId"
      :activity-id="keySingInActivityId"
      :activity-info="activityInfo"
      :has-permission="hasPermission"
    />
    <!-- 手工签到页面 -->
    <key-sign-content
      v-if="isShowKeySignContent"
      :key-sing-in-activity-id="keySingInActivityId"
      :pkg-id="pkgId"
    />
    <!-- 手势签到弹窗开始 -->
    <modal-dialog
      id="gestures-sign-in-modal"
      :is-show-footer-btn="false"
      title="手势签到"
      @cancel="ResetGestures">
      <div slot="main">
        <!-- 手势签到提示 -->
        <div>
          按住鼠标左键滑动输入手势签到
        </div>
        <div>
          请输入正确手势完成签到。
        </div>
        <!-- 手势签到图案设置处 -->
        <gestures-content ref="myCanvas" v-model="gestureData" style="margin-right: 30px"/>
        <!-- 手势确认按钮 -->
        <div class="gestures-btn" style="padding-bottom:10px;">
          <el-button type="primary" size="medium" style="margin-right:20px" @click="SubmitGesturesContent">确定签到</el-button>
          <el-button type="info" size="medium" style="margin-left:20px" @click="ResetGestures">重置</el-button>
        </div>
      </div>
    </modal-dialog>
    <!-- 手势签到弹窗结束 -->
    <!-- 课堂表现评分信息弹窗开始 -->
    <modal-dialog
      id="classroom-perfoemance-modal"
      :is-show-footer-btn="false"
      title="评分信息">
      <div slot="main" style="padding:0 10px 20px;">
        <el-table
          :data="performanceInfo"
          :header-cell-style="{background:'#F3F4F7',color:'#555'}"
          height="285px"
          style="width: 100%">
          <el-table-column
            prop="traineeName"
            label="姓名"
            width="140"/>
          <el-table-column
            prop="jobNumber"
            label="学号"
            width="200"/>
          <el-table-column
            prop="empiricalValue"
            label="分值"/>
        </el-table>
      </div>
    </modal-dialog>
    <!-- 课堂表现评分信息弹窗结束 -->
    <!-- ================================================== 【模块】从签到活动 end ================================================== -->

  </div>
</template>

<script>
// 引入的一些工具
import $ from '@/assets/jquery-vendor'
import {
  getActivitySvg,
  toast,
  confirm
}
  from '@/utils/global'
// 引用模态页面
import ModalDialog from '@/components/modal-dialog'
// 引入投票/问卷的新增修改页面
import SaveVotoQuestionnaireNew from '@/views/activity/activity-vote-questionnaire/save-vote-questionnaire-new'
// 引入投票/问卷的（总览页面）
import ViewVoteTraineeAnswer from '@/views/activity/activity-vote-questionnaire/view-trainee-answer'

// 引入新增课堂表现页面
import saveClassroomPerformance from '@/views/activity/activity-classroom-performance/save-classroom-performance'
// 引入选人页面
import Candidates from '@/views/activity/activity-candidates/candidates'
// 引入发起抢答页面
import WaitingViesAnswer from '@/views/activity/activity-classroom-performance/waiting-vies-answer'
// 引入举手页面
import RaiseHandPage from '@/views/activity/activity-classroom-performance/raise-hand-page'
// 引入发起抢答页面
import TeamEvaluation from '@/views/activity/activity-classroom-performance/team-evaluation'
import ViewVoteQuestionList from './activity-vote-questionnaire/view-vote-question-list'

// 引入签到活动的主页面
import ViewSignInMainPage from '@/views/activity/activity-sign-in/view-sign-in-main-page'
// 引入签到活动详情页面
import ViewKeySignIn from '@/views/activity/activity-sign-in/view-key-sign-in'
// 引入签到活动的手工签到页面
import KeySignContent from '@/views/activity/activity-sign-in/key-sign-content'
import GesturesContent from '@/views/activity/activity-sign-in/gestures-content'
import store from '@/store'
// import RaiseHandPage from './ActivityClassroomPerformance/raiseHandPage.vue'
export default {
  name: 'Activity',
  components: {
    ViewVoteQuestionList,
    'modal-dialog': ModalDialog,
    // 备注：注册组件，这里自定义了为save-vote-questionnaire-new，那么在dom中，同样使用这个名称即可
    'save-vote-questionnaire-new': SaveVotoQuestionnaireNew,
    'view-vote-trainee-answer': ViewVoteTraineeAnswer,
    'save-classroom-performance': saveClassroomPerformance,
    'candidates': Candidates,
    'waiting-vies-answer': WaitingViesAnswer,
    'raise-hand-page': RaiseHandPage,
    'team-evaluation': TeamEvaluation,
    'view-key-sign-in': ViewKeySignIn,
    'view-sign-in-main-page': ViewSignInMainPage,
    'key-sign-content': KeySignContent,
    'GesturesContent': GesturesContent
  },
  filters: {
    filterActivityState(value) {
      if (value === '0') {
        return '未开始'
      } else if (value === '1') {
        return '进行中'
      } else {
        return '已结束'
      }
    }
  },
  props: {
    // 权限标识
    hasPermission: {
      type: Boolean,
      required: true,
      default: true
    },
    isClassroomFinished: {
      type: Boolean,
      default: false
    },
    // 当前教学包主键
    pkgId: {
      type: String,
      default: '',
      required: true
    },
    // 章节id
    subjectId: {
      type: String,
      default: '',
      required: true
    },

    isInTheChapter: {
      type: Boolean,
      required: false,
      default: false
    },
    // 章节id
    chapterId: {
      type: String,
      default: '',
      required: false
    },
    // 是否为课堂详情页
    isClassroomDetail: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      activityTypeList: [
        { dictId: 'act1', dictCode: '1', dictValue: '投票问卷' },
        { dictId: 'act6', dictCode: '6', dictValue: '课堂表现' },
        { dictId: 'act8', dictCode: '8', dictValue: '签到' }
      ],
      sdk: null,
      // 当前活动对象
      activityItem: {},
      hasAddActPermission: false, // 助教是否用创建活动权限
      gestureData: [], // 手势签到输入的值
      // 教学包的发布状态
      releaseStatus: '',
      // 课堂主键
      ctId: localStorage.getItem('ct_id'),
      // 当前点击的活动对象
      activityInfo: {},
      // 活动主键
      activityId: '',
      // 是否显示主列表页面
      isShowPageActivityMain: true,
      // 如果图片不显示则显示默认图片
      logo: 'this.src="' + 'static/image/bdsLogo.png' + '"',
      // 活动结束时间
      activityEndTime: '',
      option: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      // 是否打开活动结束时间选择模态框
      dialogVisible: false,
      // 当前点击开始的活动
      currActivity: {},

      // 【投票/问卷的一些状态值】
      isShowPageActivityVote: false, // 是否显示新增投票/问卷页面
      isEditVotoQuestionnaire: false, // 是否处于修改状态
      isViewVotoQuestionnaire: false, // 是否处于查看状态
      isShowPageVoteTraineeAnswer: false, // 是否显示投票问卷总览页面
      isShowPageVoteQuestionList: false, // 是否显示学员投票问卷答题页面

      // 【课堂表现的一些属性值】
      isShowClassroomPerformance: false, // 是否显示新增课堂表现页面
      isShowCandidates: false, // 是否显示选人页面
      isShowInitiateViesAnswer: false, // 是否显示发起抢答页面
      waitingInfo: {}, // 发起抢答的信息
      isShowWaitingViesAnswer: false, // 是否显示等待抢答页面
      isShowRaiseHand: false, // 是否显示举手页面
      isShowSelectGroup: false, // 是否显示选择小组页面
      isShowTeamEvaluation: false, // 是否显示小组评价页面
      performanceInfo: [], // 成员评分信息

      // 【签到活动的一些属性】
      isShowSignInMain: false, // 是否签到主页面
      isShowViewKeySignIn: false, // 是否显示手势签到页面
      isShowKeySignContent: false, // 是否显示手工签到页面
      keySingInActivityId: '', // 创建的手工签到的活动id

      // 查询条件
      params: {
        pkgId: '',
        activityTitle: '',
        activityState: ''
      },
      // 默认活动图片
      defalutActivityPic: 'static/image/teaching_package/default_activity.png',
      // 不同活动状态下的样式
      stateStyle: ['state-not-start', 'state-start', 'state-finish'],
      // 活动状态
      activityStateList: [],
      // 活动列表
      // activityList: [],
      listActivity: [],
      // 活动分组列表
      listActivityGroup: [],

      currentActivityItem: 0,
      isPullDown: true,
      isShowActivityState: true, // 是否显示活动状态
      presentIsEditStates: false, // 是否处于查看状态
      questionTypeState: false // 题型是否可更改

    }
  },

  computed: {

  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.mountedInit()
    this.releaseStatus = store.state.pkg.releaseStatus
  },
  methods: {
    startPlay(item) {
      const obj = this.$router.resolve({
        path: `/activity-live/${item.activityId}`
      })
      window.open(obj.href, '_blank')
    },
    /** 页面初始数据的方法  */
    isShowPage: function() {
      this.params.activityState = ''
      this.changeVotoQuestionnairePage(false)
      setTimeout(() => {
        this.releaseStatus = store.state.pkg.releaseStatus
      }, 500)

      this.mountedInit()
    },
    /** 写在 mounted 上的方法 */
    mountedInit: function() {
      localStorage.setItem('activityInfoByClassRomm', JSON.stringify({}))
    },

    // 设置滚动条高度
    toSetScrollTop(height) {
      this.$parent.setScrollTop(height)
    },

    // 结束时间选择少于当前时间时设为当前时间
    handle: function() {
      var startAt = new Date(this.activityEndTime) * 1000 / 1000
      if (startAt < Date.now()) {
        this.activityEndTime = new Date()
      }
    },

    /**
     * 改变页面状态
     */
    changeVotoQuestionnairePage(val) {
      if (val === false) {
        this.isShowPageActivityMain = true // 显示主界面
        this.isShowPageActivityVote = false // 不显示新增投票
        this.isShowPageVoteTraineeAnswer = false // 不显示查看投票
        this.isShowPageVoteQuestionList = false // 不显示学员投票

        this.isShowClassroomPerformance = false // 不显示课堂表现
        this.isShowCandidates = false // 不显示选人
        this.isShowInitiateViesAnswer = false // 不显示发起抢答页面
        this.isShowWaitingViesAnswer = false // 不显示等待抢答页面
        this.isShowRaiseHand = false // 不显示举手页面

        this.isShowSignInMain = false // 不显示签到主页面
        this.isShowViewKeySignIn = false // 不显示手势签到页面
        this.isShowKeySignContent = false // 不显示手工签到页面
        this.presentIsEditStates = false
        // 当前活动内容
        this.activityInfo = {}
        // 当前活动主键
        this.activityId = ''
        this.getListActivity()
        // 获取活动状态值
        this.getListActivityState()
        localStorage.setItem('activityInfoByClassRomm', JSON.stringify({}))
      }
    },

    /**
     * 投票问卷
     */
    showVote(isEdit) {
      this.isShowPageActivityMain = false
      this.isShowPageActivityVote = true
      if (isEdit) {
        this.isEditVotoQuestionnaire = true
        this.isViewVotoQuestionnaire = false
      }
    },

    /**
     * 课堂表现
     */
    showPerformance(isEdit) {
      this.isShowPageActivityMain = false
      this.isShowClassroomPerformance = true
    },

    /**
    *  选人
    */
    showCandidates() {
      this.isShowPageActivityMain = false
      this.isShowCandidates = true
    },

    /**
     *  发起选人
     */
    showInitiateViesAnswer() {
      this.isShowClassroomPerformance = false
      this.isShowInitiateViesAnswer = true
    },

    /**
     * 跳转评分得分页面
     */
    toAssessmentInfo(value) {
      this.pageState = value
      this.isShowViewAllAssessment = false
      this.isShowWriteAssessment = true
    },

    /**
     * 评分信息查看页面跳转评分总览页面
     */
    toViewAllAssessment() {
      this.isShowViewAllAssessment = true
      this.isShowWriteAssessment = false
    },

    /**
     *  等待选人
     */
    showWaitingViesAnswer() {
      this.isShowPageActivityMain = false
      this.isShowWaitingViesAnswer = true
    },

    /**
     *  举手页面
     */
    showRaiseHand() {
      this.isShowPageActivityMain = false
      this.isShowRaiseHand = true
    },

    /**
     *  小组评分页面
     */
    showTeamEvaluation() {
      this.isShowTeamEvaluation = true
      this.isShowClassroomPerformance = false
    },

    /**
     *  签到
     */
    showSign() {
      this.isShowKeySignContent = false
      this.isShowPageActivityMain = false
      this.isShowSignInMain = true
    },

    /**
     *  跳转到投票结果页
     */
    toShowPageVoteTraineeAnswer() {
      this.isShowPageVoteQuestionList = false
      this.isShowPageVoteTraineeAnswer = true
    },

    /**
     *  签到类型选中页面跳转到手工签到页面
     */
    toShowKeySignContent() {
      this.isShowSignInMain = false
      this.isShowKeySignContent = true
    },

    /**
     *  手工签到页面跳详情页
     */
    toShowViewKeySignIn() {
      this.isShowKeySignContent = false
      this.isShowViewKeySignIn = true
    },

    /**
     *  获得手工签到创建的活动的id
     */
    acquireKeySingInActivityId(data) {
      this.keySingInActivityId = data
    },

    /**
     * 点击活动
     */
    clickActivityInfo(item) {
      this.activityItem = item
      this.presentIsEditStates = false
      this.activityInfo = item
      localStorage.setItem('activityInfoByClassRomm', JSON.stringify(this.activityInfo))
      const activityType = item.activityType
      if (activityType === '1') { // 点击是投票问卷的活动
        if (this.hasPermission || item.hasBeenDone) {
          if (item.isRoomCreator || item.hasBeenDone || item.isCreator) { // 打开投票问卷回答的详情页
            // this.isShowPageVoteQuestionList = true;
            this.isShowPageVoteTraineeAnswer = true
            this.isShowPageActivityMain = false
          } else { // 打开投票问卷的填写页面
            this.isShowPageVoteQuestionList = true
            this.isShowPageActivityMain = false
          }
        } else { // 打开投票问卷的填写页面
          this.isShowPageVoteQuestionList = true
          this.isShowPageActivityMain = false
        }
      } else if (activityType === '6') { // 点击课堂表现的活动
        if (item.activityState === '2') {
          this.getClassroomPerformaneInfo()
          return false
        }
        // 随机选人
        if (item.type === '2') {
          if ((this.hasPermission || item.hasBeenDone) && item.isCreator) {
            this.showCandidates()
          }
        }
        // 手动选人
        if (item.type === '3') {
          if ((this.hasPermission || item.hasBeenDone) && item.isCreator) {
            this.showRaiseHand()
          }
        }
        // 学员抢答
        if (!item.type || item.type === '1') {
          if ((this.hasPermission || item.hasBeenDone) && item.isCreator) {
            this.showWaitingViesAnswer()
          } else {
            this.traineeAnswer()
          }
        }
      } else if (activityType === '8') { // 点击是签到活动
        if (!this.activityInfo.isSigned && (!this.activityInfo.hasPermission) && this.activityInfo.activityState !== '2' && this.activityInfo.signType === '2') {
          this.currActivity = item

          $('#gestures-sign-in-modal').modal('show')
        } else {
          this.keySingInActivityId = this.activityInfo.activityId
          this.isShowViewKeySignIn = true
          this.isShowPageActivityMain = false
        }
      }
    },
    /**
     * 显示当前课堂表现评分信息
     */
    getClassroomPerformaneInfo() {
      const obj = {
        ctId: this.ctId,
        activityId: this.activityInfo.activityId
      }
      this.$api.activityClassroomPerformance.answerSummaryResults(obj).then(res => {
        if (res.code === 0) {
          this.performanceInfo = []
          this.performanceInfo = res.data
          $('#classroom-perfoemance-modal').modal('show')
        } else {
          toast(res.msg)
        }
      })
    },

    /**
     * 学员抢答操作
     */
    traineeAnswer() {
      // let obj = {
      //   ctId: this.ctId,
      //   activityId: this.activityInfo.activityId,
      // }
      const obj = new FormData()
      obj.append('ctId', this.ctId)
      obj.append('activityId', this.activityInfo.activityId)
      this.$api.activityClassroomPerformance.traineeAnswer(obj).then(res => {
        if (res.code === 0) {
          this.showWaitingViesAnswer()
        }
      })
    },

    /**
     *  结束活动
     */
    endActivityInfo(activityItem) {
      const formDada = new FormData()
      formDada.append('ctId', this.ctId)
      formDada.append('activityId', activityItem.activityId)
      formDada.append('activityType', activityItem.activityType)
      confirm('您确定要结束此活动吗?', () => {
        this.$api.activity.endActivity(formDada).then(res => {
          if (res.code === 0) {
            this.params.activityState = '2'
            this.getListActivity()
          }
          toast(res.msg)
        })
      })
    },

    /**
     * 开始活动
     */
    startActivityInfo(activityItem) {
      if (activityItem.activityState === '2') {
        toast('活动已结束，不能重新开始')
        return
      }
      this.currActivity = activityItem
      const formDada = new FormData()
      formDada.append('ctId', this.ctId)
      formDada.append('activityId', activityItem.activityId)
      formDada.append('activityType', activityItem.activityType)
      formDada.append('pkgId', activityItem.pkgId)
      if (activityItem.activityType === '1' || activityItem.activityType === '2' || activityItem.activityType === '4') {
        $('#date-picker-modal').modal('show')
      } else {
        confirm('您确定要开始此活动吗?', () => {
          this.$api.activity.startActivity(formDada).then(res => {
            if (res.code === 0) {
              this.params.activityState = '1'
              this.getListActivity()
            }
            toast(res.msg)
          })
        })
      }
    },

    // 关闭时间选择模态框
    handleCancel() {
      $('#date-picker-modal').modal('hide')
      this.activityEndTime = ''
    },

    // 确定时间选择模态框
    handleSubmit() {
      const formDada = new FormData()
      formDada.append('ctId', this.ctId)
      formDada.append('activityId', this.currActivity.activityId)
      formDada.append('activityType', this.currActivity.activityType)
      formDada.append('pkgId', this.currActivity.pkgId)
      formDada.append('activityEndTime', this.activityEndTime ? this.dateFormat(this.activityEndTime) : '')
      $('#date-picker-modal').modal('hide')
      this.$api.activity.startActivity(formDada).then(res => {
        if (res.code === 0) {
          this.params.activityState = '1'
          this.getListActivity()
        }
        toast(res.msg)
      })
    },

    // 时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
        * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },

    /**
     * 删除活动
     */
    delActivityInfo(activityItem) {
      const formDada = new FormData()
      formDada.append('activityId', activityItem.activityId)
      formDada.append('activityType', activityItem.activityType)
      formDada.append('pkgId', activityItem.pkgId)
      confirm('您确定将此活动删除吗?', () => {
        this.$api.activity.delActivity(formDada).then(res => {
          if (res.code === 0) {
            this.getListActivity()
          }
          toast(res.msg)
        })
      })
    },

    /**
     * 返回新的command对象
     */
    beforeHandleCommand(command, value) {
      const obj = {
        command: command,
        item: value
      }
      return obj
    },

    /**
     * 下拉菜单列表的事件触发
     */
    handleCommand(command) {
      if (command.command === 1) {
        this.editActivityInfo(command.item.activityType, command.item.activityId)
      } else if (command.command === 2) {
        this.viewActivityInfo(command.item)
      } else if (command.command === 3) {
        this.delActivityInfo(command.item)
      }
    },

    /**
     * 编辑活动
     */
    editActivityInfo(activityType, activityId) {
      // 赋值
      this.activityId = activityId
      this.presentIsEditStates = false
      // 不同活动时
      switch (activityType) {
        case '1' :
          this.showVote(true)
          break
        case '6':
          this.showPerformance(true)
          break
      }
    },

    /**
     * 查看活动
     */
    viewActivityInfo(activityInfo) {
      this.activityId = activityInfo.activityId
      const activityType = activityInfo.activityType
      this.presentIsEditStates = true
      if (activityType === '1') {
        this.isEditVotoQuestionnaire = false
        this.isViewVotoQuestionnaire = true // 查看投票问卷基本信息
        this.showVote()
      } else if (activityType === '6') {
        this.showPerformance()
      }
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
     * 提交签到
     */
    SubmitGesturesContent() {
      let gesturesNumber = this.gestureData.toString()
      gesturesNumber = gesturesNumber.replace(/,/g, '')
      const obj = {
        signType: this.currActivity.signType,
        ctId: this.ctId,
        activityId: this.currActivity.activityId,
        number: gesturesNumber
      }
      this.$api.activity.signIno(obj).then(res => {
        if (res.code === 0) {

          $('#gestures-sign-in-modal').modal('hide')
          this.keySingInActivityId = this.activityInfo.activityId
          this.isShowViewKeySignIn = true
          this.isShowPageActivityMain = false
          toast(res.msg)
        } else {
          toast(res.msg)
        }
        this.ResetGestures()
      })
    },

    /**
     * 根据名称搜索活动
     */
    handleSearchActivity() {
      this.getListActivity()
    },

    /**
     * 查询活动列表
     */
    getListActivity() {
      // this.listActivity = [];
      const ps = {
        pkgId: this.pkgId,
        chapterId: this.chapterId,
        activityTitle: this.params.activityTitle.replace(/\s+/g, ''),
        activityState: this.params.activityState,
        activityType: this.params.activityType
      }
      if (this.isClassroomDetail) {
        ps.ctId = this.ctId
      }
      this.$api.activity.listActivity(ps).then(res => {
        if (res.code === 0) {
          this.hasAddActPermission = res.hasAddActPermission | false
          // this.$emit("getActivityNum", this.activityNum);
          res.data.forEach(item => {
            item.children.forEach(obj => {
              obj.activityPic = getActivitySvg(obj.activityType, null)
              // 活动不同状态处理样式
              obj.stateStyle = this.stateStyle[Number(obj.activityState)]
            })
          })
          this.listActivity = res.data
          const activityNumElement = document.querySelector('#activityNum')
          if (activityNumElement && !this.chapterId) {
            if (res.activityNum) {
              activityNumElement.innerText = res.activityNum
            } else {
              activityNumElement.innerText = '0'
            }
          }
        }
      })
    },

    /**
     * 获取活动状态字典
     */
    getListActivityState() {
      const ps = {
        pkgId: this.pkgId,
        ctId: this.ctId
      }
      this.$api.activity.listActivityState(ps).then(res => {
        if (res.code === 0) {
          this.activityStateList = res.data
        }
      })
    },

    /**
     * 根据活动状态查询活动列表
     */
    handleActivityState() {
      this.getListActivity()
    }
  },
  update() {

  }
}
</script>

<style scoped>

.changeTeach-bottom{
  top: 33px;
}
.changeTeach-top{
  top: -132px;
}
.userInfo {
  height: 100px;
}
/*.no-activity-hint > img{
    width: 360px;
  height: 280px;
}*/
.no-activity-hint > p{
color: #959595;
padding:20px 0;
}
.activity-data{
  display: flex;
  /* width: 200px; */
  height: 30px;
  line-height: 30px;
  position: absolute;
  bottom:20px;
  right: 20px;
  /* z-index: 10; */
}
.activity-data .activity-data-item{
  height: 30px;
  line-height: 32px;
  font-size: 14px;
  cursor: pointer;
}
.activity-data .activity-data-item .btn{
  display: flex;
  align-items: center;
  font-size: 14px;

}
.activity-data .activity-data-item .btn img{
  margin-right: 6px;
}
.teachzhiliao {
  position: relative;
  display: flex;
  width: 100%;
  height: 120px;
  border-bottom: 1px #cfcfcf solid;
  /* margin: 10px 5px; */
  cursor: pointer;
}

/* 导航菜单 */
.activity-header-nav{
  width: 99%;
  /* margin: 0px auto; */
  line-height: 40px;
  text-align: left;
  /* padding-left: 10px; */
}
.activity-header-nav i{
  cursor: pointer;
  margin-left: 20px;
}
.activity-header-nav i:hover span{
  color: #ff740e;
}
.icon-name{
  font-size: 14px;
  margin-left: 10px;
  color: black
}
/* 线条 */
.activity-nav-line{
  height: 1px;
  background: #e0e0e0;
}
/* 搜索区域 */
.activity-search-box{
  position: relative;
  width: 97%;
  margin: 12px auto;
}
.activity-search-box > input {
  font-size: 14px;
  height: 36px;
  margin-top: 10px;
}
.activity-search-box > i{
  position: absolute;
  top: 7px;
  right: 20px;
  font-size: 20px;
  cursor: pointer;
}
/* 活动状态区域 */
.activity-state-dict{
  width: 98%;
  /* margin: 20px auto; */
  margin: 10px 0;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}
.activity-state-list{
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}
.activity-state-list > label {
  cursor: pointer;
}

/* 活动列表 */
.activity-list .activity-list-item{
  margin-top:10px;
  text-align: left;
  margin-left: 18px;
  width: 97%;
  margin-bottom: 40px;
}
.activity-children-item .children-con .activity-title-con{
  margin-bottom: 15px;
  font-size: 16px;
}
.activity-children-item .children-con .activity-title-con > span{
  display: inline-block;
}
.activity-children-item .children-con .activity-title-con .state{
  padding: 0px 10px;
  text-align: center;
  /* color: #0cbedf;
  border: 1px solid #0cbedf; */
  border-radius: 5px;
  margin-right: 10px;
}
.activity-children-item .children-con .activity-title-con .state-not-start{
  color: #e33e33;
  border: 1px solid #e33e33;
}
.activity-children-item .children-con .activity-title-con .state-start{
  color: #0cbedf;
  border: 1px solid #0cbedf;
}
.activity-children-item .children-con .activity-title-con .state-finish{
  color: #dcd7d7;
  border: 1px solid #dcd7d7;
}
.activity-children-item .children-con .activity-detail-list{
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 20px;
  color: #8e8e8e;
  font-size: 15px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-children-item .children-con .activity-detail-list > span + span::before{
  content: '|';
  display: inline-block;
  padding:0px 8px;
}
/* 取消下边框 */
.no-line{
  border: none;
}
.chapter-name{
  display: inline-block;
  width: 450px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
