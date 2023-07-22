import Vue from 'vue'
import App from './App'
import router from './router'
// 引入状态管理store
import store from './store'
// 引入全局缓存常量名constant
import constant from '@/utils/constant'
import api from './http/index'
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'ztree/js/jquery.ztree.core.js'
import 'ztree/js/jquery.ztree.excheck.js'
import 'ztree/js/jquery.ztree.exhide.js'
import 'ztree/js/jquery.ztree.exedit.js'
import 'ztree/css/awesomeStyle/awesome.css'
import '../static/creatorblue/vendor/Blob'
import '../static/creatorblue/vendor/Export2Excel'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '../node_modules/swiper/dist/css/swiper.css'
import '../static/iconfont/iconfont.css'
import 'bootstrap-select/dist/js/bootstrap-select.js'
import 'bootstrap-select/dist/css/bootstrap-select.css'

/* 图片预览 */
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
/* 视频预览 */
import videoPreview from '@/components/video-priview/index.js'

/* 改变主题色变量 */
// $--color-primary: teal
import 'element-ui/lib/theme-chalk/index.css'

import '../static/creatorblue/comm.css'
import '@/assets/prism.css'

/* 引用webSocket */
import { getUserInfo } from '@/utils/global'
import webSockets from '@/utils/webSockets'

// 引用seo配置
import MetaInfo from 'vue-meta-info'

Vue.use(api)
/* 将webSocket 挂载到vue，成为 全局变量 */
Vue.prototype.webSockets = webSockets
const userInfo = getUserInfo()
if (userInfo && userInfo.traineeId && userInfo.token) {
  // if (Vue.prototype.webSockets.socketOpen) {
  // Vue.prototype.webSockets.closeWebSocket()
  // }
  Vue.prototype.webSockets.setInit(this, {
    paramStr: 'id=' + userInfo.traineeId + '&channel=site&token=' + userInfo.token
  })
}
window.eventBus = new Vue() // 注册全局事件对象

// 挂载
Vue.prototype.constant = constant
// 注册为全局组件
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)
Vue.use(videoPreview)
Vue.use(MetaInfo)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    title: false, // 显示标题
    navbar: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      // reset: 1,
      // oneToOne: 1,
      // rotateRight: 1,
      rotateLeft: 1
    }
  }
})

// Viewer.setDefaults({
//     Options: {
//         'inline': true,
//         'button': false,
//         'navbar': true,
//         'title': false,
//         'toolbar': false,
//         'tooltip': true,
//         'movable': true,
//         'zoomable': true,
//         'rotatable': true,
//         'scalable': true,
//         'transition': true,
//         'fullscreen': true,
//         'keyboard': true,
//         'url': 'data-source'
//     }
//   })
/* eslint-disable no-new */

var vueapp = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export default {
  vueapp
}

// 下面这段代码处理此报错，若引起其它问题，删除即可。 vue-router.esm.js?ecb4:2051 Uncaught (in promise) NavigationDuplicated.......
/* import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}*/
