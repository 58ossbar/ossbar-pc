/*
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as main from './modules/main'
import * as library from './modules/library'
import * as teach from './modules/teach'
import * as career from './modules/career'
import * as news from './modules/news'
import * as cooperate from './modules/cooperate'
import * as story from './modules/story'
import * as teacher from './modules/teacher'
import * as addclassroom from './modules/my/add-classroom'
import * as addLearningCourses from './modules/my/add-learning-courses'
import * as classroom from './modules/my/classroom' // 我的课堂
import * as dict from './modules/dict'
import * as resource from './modules/resource'
import * as resourcecenter from './modules/resource-center'
import * as questionbank from './modules/question-bank'
import * as testcenter from './modules/test-center'
import * as classtrainee from './modules/class-trainee'
import * as group from './modules/group'
import * as examinationpaper from './modules/examination-paper'
import * as managementPanel from './modules/three-feet-platform/management-panel' // 管理看板
import * as teachingCenter from './modules/three-feet-platform/teaching-center' // 教学中心
import * as cloudDisk from './modules/three-feet-platform/cloud-disk' // 云盘
import * as pkgInfo from './modules/three-feet-platform/pkg-info' // 教学包相关js
import * as activity from './modules/activity/activity' // 活动
import * as activityBrainstorming from './modules/activity/activity-brain-storming' // 头脑风暴
import * as activityVoteQuestionnaire from './modules/activity/activity-vote-questionnaire' // 投票/问卷
import * as activityTest from './modules/activity/activity-test' // 头脑风暴
import * as activityAnswerDiscuss from './modules/activity/activity-answer-discuss' // 答疑讨论
import * as activitySignIn from './modules/activity/activity-sign-in' // 签到活动
import * as activityGroupTasks from './modules/activity/activity-group-tasks' // 作业/小组任务
import * as activityAssessment from './modules/activity/activity-assessment' // 作业/小组任务
import * as activityClassroomPerformance from './modules/activity/activity-classroom-performance' // 课堂表现
import * as activityLive from './modules/activity/activity-live' // 课堂表现
import * as authorizationPackage from './modules/three-feet-platform/authorization-package' // 教学包课堂章节授权相关
import * as classroomMember from './modules/my/classroom-member'
import * as perseverancePlate from './modules/perseverance-plate' // 我要听课
import * as chat from './modules/three-feet-platform/chat' // 聊天
import * as blog from './modules/blog/blog' // 博客
import * as resources from './modules/resources/resources' // 我的资源
// 辅教视频库
import * as video from './modules/video'
// 我的课表
import * as mySchedule from './modules/my-schedule'
// 学生成绩
import * as traineeScore from './modules/trainee-score'
// 合作伙伴
import * as partner from './modules/partner'
// 章节
import * as chapter from './modules/chapter'

// 默认全部导出
export default {
  login,
  main,
  library,
  teach,
  career,
  news,
  cooperate,
  story,
  teacher,
  addclassroom,
  addLearningCourses,
  classroom,
  dict,
  resource,
  resourcecenter,
  questionbank,
  testcenter,
  classtrainee,
  group,
  examinationpaper,
  managementPanel,
  teachingCenter,
  cloudDisk,
  pkgInfo,
  activity,
  activityBrainstorming,
  activityVoteQuestionnaire,
  activityTest,
  activityAnswerDiscuss,
  activitySignIn,
  activityAssessment,
  activityClassroomPerformance,
  activityGroupTasks,
  authorizationPackage,
  classroomMember,
  perseverancePlate,
  chat,
  blog,
  resources,
  video,
  activityLive,
  mySchedule,
  traineeScore,
  partner,
  chapter
}
