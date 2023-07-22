import { toast, tokenKeyName } from '@/utils/global'
import Cookies from 'js-cookie'
import Vue from 'vue'
import Router from 'vue-router'

// 修复 NavigationDuplicated: Avoided redundant navigation to current location: "/". 报错 问题
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  let result = originalPush.call(this, location)
  if (result && result != null && result !== undefined) {
    result = result.catch(err => err)
  }
  return result // originalPush.call(this, location)//.catch(err => err)
}

Vue.use(Router)
var menu = [
  // 首页
  {
    path: '/',
    name: 'index',
    component: (resolve) => require(['@/views/index'], resolve)
  },
  // 我要合作
  {
    path: '/cooperation',
    name: 'cooperation',
    component: (resolve) => require(['@/views/cooperation/index.vue'], resolve)
  },
  // 合作企业（校企合作）
  {
    path: '/partner',
    name: 'partner',
    component: (resolve) => require(['@/views/partner/index.vue'], resolve)
  },
  // 云教程界面
  {
    path: '/tutorial',
    name: 'tutorial',
    component: (resolve) => require(['@/views/management-kanban/cloud-tutorial.vue'], resolve)
  },
  // 博客界面
  {
    path: '/blog',
    name: 'blog',
    component: (resolve) => require(['@/views/blog/index.vue'], resolve)
  },
  // 博客详情界面
  {
    path: '/blog-read/:postId',
    name: 'blog-read',
    component: (resolve) => require(['@/views/blog/blog-read.vue'], resolve)
  },
  // 博客新增界面
  {
    path: '/blog-edit',
    name: 'blog-edit',
    component: (resolve) => require(['@/views/blog/blog-edit.vue'], resolve)
  },
  // 我要合作的填写页
  {
    path: '/join-us',
    name: 'join-us',
    component: (resolve) => require(['@/views/cooperation/join-us.vue'], resolve)
  },
  // 共建活教材页面
  {
    path: '/together-build-subject',
    name: 'together-build-subject',
    component: (resolve) => require(['@/views/my-teaching-package/together-build-subject'], resolve),
    meta: { requireAuth: true }
  },
  // 教学包课堂章节授权页面（未发布状态下）
  {
    path: '/pkg/authorization-package',
    name: 'authorization-package',
    component: (resolve) => require(['@/views/my-teaching-package/authorization-package'], resolve),
    meta: { requireAuth: true }
  },
  // 教学包授权（已发布的状态下）
  {
    path: '/pkg/authorization-package-released',
    name: 'authorization-package-released',
    component: (resolve) => require(['@/views/my-teaching-package/authorization-package-released'], resolve),
    meta: { requireAuth: true }
  },
  // 教学包授权（已发布的状态下）
  {
    path: '/pkg/batch-save-chapter',
    name: 'batch-save-chapter',
    component: (resolve) => require(['@/views/my-teaching-package/batch-save-chapter'], resolve),
    meta: { requireAuth: true }
  },
  // 新增教学包基本信息页面
  {
    path: '/pkg/add-package-info',
    name: 'add-package-info',
    component: (resolve) => require(['@/views/my-teaching-package/add-package-info'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/my-teaching-package',
    name: 'my-teaching-package',
    component: (resolve) => require(['@/views/my-teaching-package/my-teaching-package'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/teaching-package-detail',
    name: 'teaching-package-detail',
    component: (resolve) => require(['@/views/my-teaching-package/teaching-package-detail'], resolve),
    meta: { requireAuth: true }
  },
  // 我的书架
  {
    path: '/my-bookshelf/my-bookshelf',
    name: 'my-bookshelf',
    component: (resolve) => require(['@/views/my-bookshelf/my-bookshelf'], resolve),
    meta: { requireAuth: true }
  },
  // 我的资源
  {
    path: '/my-resources/index',
    name: 'my-resources',
    component: (resolve) => require(['@/views/my-resources/index'], resolve),
    meta: { requireAuth: true }
  },
  // 我的书架详情页
  {
    path: '/my-bookshelf/my-bookshelf-read',
    name: 'my-bookshelf-read',
    component: (resolve) => require(['@/views/my-bookshelf/my-bookshelf-read'], resolve),
    meta: { requireAuth: true }
  },
  // 我的课堂
  {
    path: '/my/classroom',
    name: 'classroom',
    component: (resolve) => require(['@/views/my/classroom'], resolve),
    meta: { requireAuth: true }
  },
  // 我的学习
  {
    path: '/my/learning-classroom',
    name: 'learning-classroom',
    component: (resolve) => require(['@/views/my/learning-classroom'], resolve),
    meta: { requireAuth: true }
  },
  // 开设课堂
  {
    path: '/my/add-classroom',
    name: 'add-classroom',
    component: (resolve) => require(['@/views/my/add-classroom'], resolve),
    meta: { requireAuth: true }
  },
  // 加入课堂
  {
    path: '/my/add-learning-courses',
    name: 'add-learning-courses',
    component: (resolve) => require(['@/views/my/add-learning-courses'], resolve),
    meta: { requireAuth: true }
  },
  // 所有新闻显示页
  {
    path: '/news/view-all-news',
    name: 'view-all-news',
    component: (resolve) => require(['@/views/news/view-all-news'], resolve),
    meta: { requireAuth: true }
  },
  // 消息群发
  {
    path: '/messaging/messaging',
    name: 'messaging',
    component: (resolve) => require(['@/views/messaging/messaging'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/teaching-center/teachingr-detail',
    name: 'teachingr-detail',
    component: (resolve) => require(['@/views/teaching-center/teachingr-detail'], resolve),
    meta: { requireAuth: true }
  },
  // 云盘页面
  {
    path: '/teachingr-detail/cloud-disk',
    name: 'cloud-disk',
    component: (resolve) => require(['@/views/teaching-center/cloud-disk'], resolve),
    meta: { requireAuth: true }
  },
  // 文件预览页面
  {
    path: '/teachingr-detail/file-preview',
    name: 'file-preview',
    component: (resolve) => require(['@/views/teaching-center/file-preview'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/news-read',
    name: 'news-read',
    component: (resolve) => require(['@/views/news/news-read'], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/news-list',
    name: 'news-list',
    component: (resolve) => require(['@/views/news/news-list'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/begin-class',
    name: 'begin-class',
    component: (resolve) => require(['@/views/management-kanban/begin-class'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/hear-class',
    name: 'hear-class',
    component: (resolve) => require(['@/views/management-kanban/hear-class'], resolve)
  },
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/login'], resolve)
  },
  // 题库的 试题库页面
  {
    path: '/question-bank-center/test-question-bank',
    name: 'test-question-bank',
    component: (resolve) => require(['@/views/question-bank-center/test-question-bank'], resolve),
    meta: { requireAuth: true }
  },
  // 题库的 添加试题页面
  {
    path: '/question-bank-center/creator-test-question',
    name: 'creator-test-question',
    component: (resolve) => require(['@/views/question-bank-center/creator-test-question'], resolve),
    meta: { requireAuth: true }
  },
  // 题库的 纠错页面
  {
    path: '/question-bank-center/test-question-error-correction',
    name: 'test-question-error-correction',
    component: (resolve) => require(['@/views/question-bank-center/test-question-error-correction'], resolve),
    meta: { requireAuth: true }
  },
  // 题库的 组卷页面
  {
    path: '/question-bank-center/test-question-organizing-papers',
    name: 'test-question-organizing-papers',
    component: (resolve) => require(['@/views/question-bank-center/test-question-organizing-papers'], resolve),
    meta: { requireAuth: true }
  },
  // 题库的 老师组卷 的预览页面
  {
    path: '/question-bank-center/test-question-organizing-papers-preview',
    name: 'test-question-organizing-papers-preview',
    component: (resolve) => require(['@/views/question-bank-center/test-question-organizing-papers-preview'], resolve),
    meta: { requireAuth: true }
  },
  // 题库的 试卷 的 开始考试的答题界面以及查看答案界面
  {
    path: '/question-bank-center/test-question-write',
    name: 'test-question-write',
    component: (resolve) => require(['@/views/question-bank-center/test-question-write'], resolve),
    meta: { requireAuth: true }
  },
  // 辅教视频的 显示页面
  {
    path: '/auxiliary-teaching-video/auxiliary-teaching-video-home',
    name: 'auxiliary-teaching-video-home',
    component: (resolve) => require(['@/views/auxiliary-teaching-video/auxiliary-teaching-video-home'], resolve),
    meta: { requireAuth: true }
  },
  // 辅教视频的 保存页面
  {
    // path: '/auxiliary-teaching-video/add-auxiliary-teaching-video/:videoId',
    path: '/auxiliary-teaching-video/add-auxiliary-teaching-video',
    name: 'add-auxiliary-teaching-video',
    component: (resolve) => require(['@/views/auxiliary-teaching-video/add-auxiliary-teaching-video'], resolve),
    meta: { requireAuth: true }
  },
  // 轻直播页面
  {
    path: '/activity-live/:id',
    name: 'view-activity',
    component: (resolve) => require(['@/views/activity/activity-live/view-live'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/my-schedule',
    name: 'MySchedule',
    component: (resolve) => require(['@/views/my-schedule/index'], resolve),
    meta: { requireAuth: true }
  },
  {
    path: '/student-score',
    name: 'StudentScore',
    component: (resolve) => require(['@/views/student-score/index'], resolve),
    meta: { requireAuth: true }
  }
]
const router = new Router({
  routes: menu
})

router.beforeEach((to, from, next) => {
  if ((from.path === '/teaching-center/teachingr-detail' || from.path === '/teaching-package-detail') && to.path === '/teachingr-detail/file-preview') {
    return false
  }
  if ((from.path === '/blog') && (to.path).indexOf('/blog-read') > -1) {
    return false
  }
  if ((from.path === '/cooperation') && to.path === '/join-us') {
    return false
  }
  if ((from.path === '/blog') && to.path === '/my-resources/index') {
    return false
  }
  if ((from.path === '/begin-class') && to.path === '/my-resources/index') {
    return false
  }
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  // const username = localStorage.getItem('username')
  const token = Cookies.get(tokenKeyName)
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token) { // 通过vuex state获取当前的token是否存在
      localStorage.setItem('path', to.path)
      next()
    } else {
      toast('登录状态已过期，请重新登录')
      localStorage.setItem('toLoginUrl', to.fullPath)
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    localStorage.setItem('path', to.path)
    next()
  }
})

export default router
