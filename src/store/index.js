import Vue from 'vue'
import vuex from 'vuex'

import pkg from './modules/pkg'

// 挂载vuex
Vue.use(vuex)

// 该js文件，引入一个vue实例，和一个vuex实例，将vuex挂载到当前的vue实例，并创建一个store对象，向外暴露store对象：
const store = new vuex.Store({
  modules: {
    pkg: pkg
  }
})

export default store
