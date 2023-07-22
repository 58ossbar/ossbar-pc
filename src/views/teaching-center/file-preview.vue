<!-- pdf文件预览页面页面 -->
<template>
  <div>
    <div class="file-preview-wrapper" v-show="!isErr" @scroll="handleScroll">
      <div class="file-preview-top">
        <div>{{fileName}}</div>
        <div>
          <el-input type="number" class="file-preview-input" size="mini" placeholder="请输入内容"  v-model.number="currPageNum" :max="numPages" min="1" @change="inputChange"></el-input> /{{numPages}}
        </div>
        <div title="旋转" class="file-preview-rotate" @click="toRotate"><i class="el-icon-refresh-right"></i></div>
      </div>
      <div class="file-preview-content" :style="{width:fileWidth+'%'}">
        <pdf ref="pdf" :rotate="rotate" class="file-preview-pdf" :id="'file-pdf-'+num" v-for="num in numPages" :key="num" :src="fileSrc" :page="num" @progress="pdfProgress" @loaded="pdfLoaded" @page-loaded="pdfPageLoaded" @error="pdfError"></pdf>
      </div>
      <div class="file-preview-btns">
        <div title="放大" :class="['file-preview-enlarge',fileWidth >= 98?'file-preview-narrow-all':'']" @click="toEnlargeOrNarrow('enlarge')"><i class="el-icon-plus"></i></div>
        <div title="缩小" :class="['file-preview-narrow',fileWidth >= 98?'file-preview-narrow-all':'']" @click="toEnlargeOrNarrow('narrow')"><i class="el-icon-minus"></i></div>
      </div>
    </div>
    <div v-show="isErr" class="loading-err">
      <span class="fa fa-exclamation-circle loading-err-icon"></span>
      <div>{{errLabel}}</div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { loadingModal } from '@/utils/global'
export default {
  name: 'file-preview',
  data () {
    return {
      rotate: 0,
      numPages: null, // pdf 总页数
      isErr: false, // 是否加载错误
      errLabel: '加载失败', // 错误时的文字
      loadingState: '0', // 0未加载，1加载中，2已加载
      currPageNum: 1,
      fileSrc: '',
      fileUrl: '',
      fileName: '',
      fileWidth: 40
    }
  },
  components: {
    pdf
  },
  mounted () {
    this.loadingState = '1'
    this.isErr = false
    this.fileSrc = (window.location.href && window.location.href.split('fileSrc=') && window.location.href.split('fileSrc=')[1] && window.location.href.split('fileSrc=')[1].split('&')[0]) ? (decodeURIComponent(window.location.href.split('fileSrc=')[1].split('&')[0])) : ''
    this.fileName = (window.location.href && window.location.href.split('fileName=') && window.location.href.split('fileName=')[1]) ? (decodeURIComponent(window.location.href.split('fileName=')[1])) : ''
    // this.fileUrl = 'https://officeonline.superlib.com/op/embed.aspx?src=' + this.fileSrc // filePreviewUrl + '?url=' + this.fileSrc
    // if (this.webSockets.socketOpen) {
      this.webSockets.closeWebSocket()
    // }
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    // this.fileUrl = pdf.createLoadingTask(this.fileSrc)
    this.getNumPages()
    // let that = this
    // this.$nextTick(function () {
    //   window.addEventListener('scroll', function (event) {
    //     that.handleScroll(event)
    //   })
    // })
  },
  destroyed () {
    // let that = this
    // window.removeEventListener('scroll', function (event) {
    //   that.handleScroll(event)
    // })
  },
  watch: {
    'loadingState': function (val) {
      if (val && val === '0') {
        loadingModal(false)
      } else if (val && val === '1') {
        loadingModal(true)
      } else if (val && val === '2') {
        loadingModal(false)
      }
    }
  },
  created () {},
  methods: {
    /** 加载失败。发生错误 */
    pdfError: function (event) {
      // console.log('event', event)
      this.loadingState = '2'
      this.isErr = true
      this.errLabel = 'pdf 加载失败' + ((event && event.message) ? ('：' + event.message) : '')
    },
    /** 在加载页时触发 */
    pdfPageLoaded: function (event) {
      // this.loadingState = '1'
      if (event && event > 1) {
        this.loadingState = '2'
      }
      // if (this.numPages && event && event === this.numPages) {
      //   this.loadingState = '2'
      // }
    },
    /** 在加载文档时触发 */
    pdfLoaded: function (event) {
      // console.log('11111111加载', event)
    },
    /** 监听 文件加载进度。范围[0，1] */
    pdfProgress: function (event) {
      // console.log('2222222222加载', event)
      // this.loadingState = '1'
      // if (event && event === 1) {
      //   this.loadingState = '2'
      // }
    },
    /** 旋转 */
    toRotate: function () {
      if (this.rotate === 360) {
        this.rotate = 0
      }
      this.rotate += 90
    },
    /** 监听 页面的滚动事件 */
    handleScroll: function (event) {
      // 获取滚动时的高度
      let scrollTop = event.srcElement.scrollTop // event.srcElement.scrollingElement.scrollTop // window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //
      // 获取 pdf列表
      let list = document.getElementsByClassName('file-preview-pdf')
      for (let i = 0; i < list.length; i++) {
        let offsetTop = list[i].offsetTop
        if (i === 0) {
          if (scrollTop >= 0 && scrollTop < list[i + 1].offsetTop) {
            this.currPageNum = 1
          }
        } else if (i === list.length - 1) {
          if (scrollTop >= offsetTop) {
            this.currPageNum = i + 1
          }
        } else {
          if (scrollTop >= offsetTop && scrollTop < list[i + 1].offsetTop) {
            this.currPageNum = i + 1
          }
        }
      }
    },
    /** 放大或者缩小 */
    toEnlargeOrNarrow: function (type) {
      if (type && type === 'enlarge') { // 放大
        this.fileWidth += 10
        if (this.fileWidth > 120) {
          this.fileWidth = 120
          return false
        }
        return false
      } else if (type && type === 'narrow') { // 缩小
        this.fileWidth -= 10
        if (this.fileWidth < 10) {
          this.fileWidth = 10
          return false
        }
        return false
      }
    },
    /** 监听input的输入事件 */
    inputChange: function (event) {
      let scrollObj = document.getElementById('file-pdf-' + event)
      this.$nextTick(() => {
        let container = document.getElementsByClassName('file-preview-wrapper')[0]
        container.scrollTop = scrollObj.offsetTop
      })
      // document.documentElement.scrollTop = scrollObj.offsetTop
    },
    /** 计算pdf页码总数 */
    getNumPages: function () {
      let loadingTask = pdf.createLoadingTask(this.fileSrc)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        this.loadingState = '2'
        this.isErr = true
        this.errLabel = 'pdf 加载失败' + ((err && err.message) ? ('：' + err.message) : '')
        // console.log('err', err)
      })
    }
  }
}
</script>

<style scoped>
.file-preview-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: rgb(82, 86, 89);
  overflow-x: scroll;
  overflow-y: scroll;
}
.file-preview-top{
  background-color: rgb(32, 32, 32);
  width: 100%;
  height: 50px;
  position: fixed;
  top: 0;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  /* justify-content: center; */
  z-index: 55;
  font-size: 13px;
}
.file-preview-content{
  width: 40%;
  padding-top: 60px;
  height: 100%;
  margin: 0 auto;
  background-color: rgb(82, 86, 89);
  /* overflow: scroll; */
}
.file-preview-pdf{
  /* width: 100%;
  height: 100%; */
  margin-bottom: 10px;
}
.file-preview-input{
  width: 100px;
  background-color: #000;
}
.file-preview-btns{
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 55;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: flex-end;
}
.file-preview-rotate,
.file-preview-enlarge,
.file-preview-narrow{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.file-preview-rotate{
  color: #fff;
}
.file-preview-rotate:hover{
  background-color:rgb(87, 85, 85);
}
.file-preview-enlarge,
.file-preview-narrow{
  color: #000;
  background-color: #fff;
}
.file-preview-enlarge:hover,
.file-preview-narrow:hover{
  background-color: #f5f5f5;
}
.file-preview-narrow-all{
  background-color: #e6e4e4;
}
.file-preview-narrow-all:hover{
  background-color:gainsboro;
}
.file-preview-narrow{
  margin-top: 10px;
}
.loading-err{
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.loading-err-icon{
  color: red;
  font-size: 40px;
  margin-bottom: 10px;
}

/* 修改滚动条样式  background-color: rgba(125, 125, 125, 0.7);  */
::-webkit-scrollbar-thumb:vertical{
  background-color: #dfdede !important;
}
::-webkit-scrollbar-thumb:horizontal {
  background-color: #dfdede !important;
}
</style>
