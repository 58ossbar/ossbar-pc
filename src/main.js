import Vue from 'vue'
import App from './App'
import router from './router'
// 引入状态管理store
import store from './store'
// 引入全局缓存常量名constant
import constant from '@/utils/constant'
import api from './http/index'
import 'font-awesome/css/font-awesome.css'

import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js'

// eslint-disable-next-line no-unused-vars
import $ from './assets/jquery-vendor'
// 引入第三方插件-ztree
import '../static/creatorblue/ztree/js/jquery.ztree.core.js'
import '../static/creatorblue/ztree/js/jquery.ztree.excheck.min.js'
import '../static/creatorblue/ztree/js/jquery.ztree.exedit.min.js'
import '../static/creatorblue/ztree/js/jquery.ztree.exhide.min.js'
import '../static/creatorblue/ztree/css/awesomeStyle/awesome.css'

import '../static/iconfont/iconfont.css'
import 'bootstrap-select/dist/js/bootstrap-select.js'
import 'bootstrap-select/dist/css/bootstrap-select.css'

/* 图片预览 */
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
/* 视频预览 */
import videoPreview from '@/components/video-priview/index.js'

/* 改变主题色变量 */
/* 改变主题色变量 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
/** 引用图标选择组件 */
import iconPicker from 'e-icon-picker'
import 'e-icon-picker/dist/symbol.js' // 基本彩色图标库
import 'e-icon-picker/dist/index.css' // 基本样式，包含基本图标
Vue.use(iconPicker, { FontAwesome: true, ElementUI: true, eIcon: true, eIconSymbol: false })// 使用e-icon-picker

import '../static/creatorblue/comm.css'
import '@/assets/prism.css'

Vue.use(api)
Vue.use(BootstrapVue)
Vue.use(ElementUI)

// 挂载
Vue.prototype.constant = constant
// 注册为全局组件
Vue.config.productionTip = false
Vue.use(videoPreview)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    title: false, // 显示标题
    navbar: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      rotateLeft: 1
    }
  }
})

var vueApp = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export default {
  vueApp
}
