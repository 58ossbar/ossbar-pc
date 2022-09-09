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
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/login'], resolve)
  }
]
const router = new Router({
  routes: menu
})

router.beforeEach((to, from, next) => {
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
