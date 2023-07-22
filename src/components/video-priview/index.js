import Vue from 'vue'
import vid from './video-priview'

const videoExtend = Vue.extend(vid)

const video = (url) => {
    const videoInstance = new videoExtend({
        data: {
            urlString: url, // 视频链接地址
            videoFlag: false
        },
        created() {
            if (url) this.videoFlag = true
        },
        methods: {
            close() {
                this.videoFlag = false
            }
        }
    })
    videoInstance.vm = videoInstance.$mount()
    videoInstance.dom = videoInstance.vm.$el
    document.body.appendChild(videoInstance.dom) // 将dom插入body
}
export default {
    install: Vue => {
        Vue.prototype.$videoPreview = video
    }
}