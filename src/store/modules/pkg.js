export default {
  state: {
    // 当前教学包主键id
    pkgId: '',
    // 发布状态
    releaseStatus: '',
    // 教学包对象
    tevglPkgInfo: {}
  },
  getters: {
    // 对应着上面state
    getPkgId(state) {
      console.log(state)
      return state.pkgId
    },
    getReleaseStatus(state) {
      return state.releaseStatus
    }

  },
  mutations: {
    setPkgId(state, pkgId) {
      state.pkgId = pkgId
    },
    setTevglPkgInfo(state, obj) {
      state.tevglPkgInfo = Object.assign({}, obj)
    },
    setReleaseStatus(state, val) {
      state.releaseStatus = val
    }
  }
}
