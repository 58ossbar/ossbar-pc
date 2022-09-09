/*
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as library from './modules/library'
import * as addclassroom from './modules/my/add-classroom'
import * as addLearningCourses from './modules/my/add-learning-courses'
import * as classroom from './modules/my/classroom' // 我的课堂
import * as dict from './modules/dict'
import * as resource from './modules/resource'
import * as testcenter from './modules/test-center'
import * as classtrainee from './modules/class-trainee'
import * as group from './modules/group'
import * as managementPanel from './modules/three-feet-platform/management-panel' // 管理看板
import * as teachingCenter from './modules/three-feet-platform/teaching-center' // 教学中心
import * as cloudDisk from './modules/three-feet-platform/cloud-disk' // 云盘
import * as pkgInfo from './modules/three-feet-platform/pkg-info' // 教学包相关js
import * as activity from './modules/activity/activity' // 活动
import * as activityVoteQuestionnaire from './modules/activity/activity-vote-questionnaire' // 投票/问卷
import * as activitySignIn from './modules/activity/activity-sign-in' // 签到活动
import * as activityClassroomPerformance from './modules/activity/activity-classroom-performance' // 课堂表现
import * as authorizationPackage from './modules/three-feet-platform/authorization-package' // 教学包课堂章节授权相关
import * as classroomMember from './modules/my/classroom-member'
import * as perseverancePlate from './modules/perseverance-plate' // 我要听课
// 章节
import * as chapter from './modules/chapter'

// 默认全部导出
export default {
  login,
  library,
  addclassroom,
  addLearningCourses,
  classroom,
  dict,
  resource,
  testcenter,
  classtrainee,
  group,
  managementPanel,
  teachingCenter,
  cloudDisk,
  pkgInfo,
  activity,
  activityVoteQuestionnaire,
  activitySignIn,
  activityClassroomPerformance,
  authorizationPackage,
  classroomMember,
  perseverancePlate,
  chapter
}
