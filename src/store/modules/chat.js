export default {
  // 存放状态，相对于vue文件中的data对象
  state: {
    messageCDatas: {}, // 消息列表需要的参数
    messageCList: [], // 消息列表数据
    chatDatas: {}, // 聊天组件需要的参数
    chatHistoryList: [] // 聊天界面历史消息列表
  },
  // 对state中的成员加工后传递给外界
  getters: {
    // state是当前VueX对象中的state，getters 当前getters对象，用于将getters下的其他getter拿来用
    // 获取chatDatas， 使用方法this.$store.getters.getChatDatas
    getChatDatas(state, getters) {
      return state.chatDatas
    },
    // 获取messageCDatas
    getMessageCDatas(state, getters) {
      return state.messageCDatas
    },
    // 获取messageCList
    getMessageCList(state, getters) {
      return state.messageCList
    }
  },
  // 操作state数据的方法的集合，比如对该数据的修改、增加、删除等
  mutations: {
    // state是当前VueX对象中的state，params是该方法在被调用时传递参数使用的
    // 修改chatDatas， 使用方法this.$store.commit('setChatDatas',{age:15,sex:'男'})
    setChatDatas(state, params) {
      state.chatDatas = Object.assign({}, params)
    },
    // 修改messageCDatas
    setMessageCDatas(state, params) {
      state.messageCDatas = Object.assign({}, params)
    },
    // 修改messageCList
    setMessageCList(state, params) {
      if (params && params.isLazy) {
        params.forEach((item, index) => {
          state.messageCList.push(item)
        })
      } else {
        state.messageCList = params
      }
    }
  },
  // 异步操作
  actions: {}
}
