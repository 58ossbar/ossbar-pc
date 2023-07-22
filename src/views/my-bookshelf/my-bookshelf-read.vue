<!-- 我的书架  书籍详情 显示页面 -->
<template>
  <div>
    <!-- 顶部导航栏 -->
    <header-nav :current-index="6"/>
    <!-- 导航栏 begin  -->
    <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
      <div class="location">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer" @click="toback('/begin-class')">
            管理看板
          </li>
          <li class="localtion-item" style="cursor: pointer" @click="toback('/my-bookshelf/my-bookshelf')">
            我的书架
          </li>
          <li class="localtion-item">
            <span style="color: #959da0">{{ type }}</span>
          </li>
        </ul>
      </div>
      <div class="question-back">
        <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/my-bookshelf/my-bookshelf')"/>
        <span @click="toback('/my-bookshelf/my-bookshelf')">返回</span>
      </div>
    </div>
    <!-- 导航栏end -->
    <div class="teaching-material wind-1240 pkg-page-center-min-height">
      <div v-if="zNodes && zNodes.length > 0" :style="isShowLeftChapter ? '' : 'width:0;'" class="left-teaching-material-catalogue">
        <div id="left-nav" class="serachLibrary catalogue">
          <ztree-library ref="ztreeLibrary" :is-from-bookshelf="true" :z-nodes="zNodes" id-key="id" p-id-key="parentId" name="chapterName" ztree-id="treeDemo" @showLibraryForm="showLibraryForm"/>
        </div>
      </div>
      <!-- 左侧章节收缩begin -->
      <div v-if="zNodes && zNodes.length > 0" class="shrinkage-btn" @click="isShowLeftChapter = !isShowLeftChapter">
        <div>
          {{ isShowLeftChapter ? '隐藏' : '显示' }}
        </div>
      </div>
      <!-- 左侧章节收缩end -->

      <div v-if="zNodes && zNodes.length > 0" :style="isShowLeftChapter ? '' : 'width:100%'" class="right-teaching-material-con">
        <div v-if="pkgResGroupList && pkgResGroupList.length > 0" class="header-nav">
          <!--资源分组 begin-->
          <div class="editor-nav">
            <div
              v-for="(pkgResGroup,index) in pkgResGroupList"
              :key="pkgResGroup.resgroupId"
              :id="pkgResGroup.resgroupId"
              :title="pkgResGroup.resgroupName"
              :class="['editor-nav-item',currentClickIndex===index?'active-editor-nav':'active-editor-no-nav']"
              @click="handleCutGroup(index, pkgResGroup)">
              {{ pkgResGroup.resgroupName }}
            </div>
          </div>
          <!--资源分组 end-->
        </div>
        <div v-if="isShowEditor" class="teaching-package-editor">
          <!--  -->
          <cb-editor
            ref="cbEditor"
            :height="editHeight"
            :is-copy="false"
            :edit-read-only="true"
            :is-edit-chapter="false"
            :tool-str="toolStr"
            :show-image-button="false"
            :show-media-button="false"
            :media-is-preview="'true'"
            :data-form="saveResourceData"
            :is-need-content-navigation="true"
            :teaching-extra-info="teachingExtraInfo"
            class="chapterEditor"
            name="resContent"
            custom-content-navigation-style="top: 153px"
          />

          <!--
          @audioOrVideoEnded="audioOrVideoEnded"
          @chapterReadEnded="chapterReadEnded" -->
        </div>
      </div>

      <div v-if="!zNodes || zNodes.length <= 0" class="notContent-describe">
        <img src="static/image/manage_board/creatkc.png" alt="">
        <div style="padding-left: 20px; color: #6a7275">
          当前暂无教材<span class="dots"/>
        </div>
      </div>

    </div>

    <!-- 图片预览标签 begin -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="viewerImgSrc" alt>
    </div>
    <!-- 图片预览标签 end -->

  </div>

</template>

<script type="text/javascript">

import tinyMCE from 'tinymce/tinymce'
import $ from 'jquery'
import HeaderNav from '@/components/header-nav-start-class'
import ZtreeLibrary from '@/components/ztree-library'
import CbEditor from '@/components/cb-editor'
import { toast } from '@/utils/global'

export default {
  name: 'MyBookshelfRead',
  components: {
    'header-nav': HeaderNav,
    'ztree-library': ZtreeLibrary,
    'cb-editor': CbEditor
  },
  data() {
    return {
      viewerImgSrc: '', // 图片预览src
      currentClickIndex: 0, // 当前显示的分组内容 0为默认为第一篇
      pkgResGroupList: [],
      type: '',
      editHeight: 500,
      toolStr: 'preview fullscreen previousChapter nextChapter', // 编辑器的tabstr
      clickedNodeType: 'chapter', // 当前点击的节点类型，suject为课程节点，否则为章节节点
      chapterId: '', // 当前选中的章节节点
      zNodes: [],
      isShowEditor: false,
      chapterInfo: {},
      isShowLeftChapter: true, // 是否显示右侧章节
      allChapterId: [], // 所有章节的id
      saveResourceData: {
        resContent: '',
        resId: ''
      },
      teachingExtraInfo: {
        ctId: '',
        pkgId: '',
        subjectId: '',
        chapterId: '',
        resId: ''
      }, // 活教材 要传到 编辑器的 额外的 参数
      resgroupIsRead: false, // 分组是否 查看
      bookshelfReadData: {}, // 上一个页面传过来的参数
      editorToolbarOffsetTop: 0
    }
  },
  created() {
    this.bookshelfReadData = (localStorage.getItem('bookshelfReadData') && localStorage.getItem('bookshelfReadData') !== undefined) ? (JSON.parse(localStorage.getItem('bookshelfReadData'))) : {}
    this.type = (this.bookshelfReadData && this.bookshelfReadData.name) ? (this.bookshelfReadData.name) : '书籍详情'
    this.isShowPage()
  },
  mounted() {
    this.mountedInit()
    window.addEventListener('scroll', this.onScroll)
  },
  updated: function() {
    this.$nextTick(function() {
      $('#defaultId').selectpicker('refresh')
    })
  },
  destroyed: function() {
    $('#defaultId').selectpicker('destroy')
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    // 切换分组标签
    handleCutGroup(index, pkgResGroup) {
      this.resgroupIsRead = false
      this.currentClickIndex = index
      this.resgroupId = this.pkgResGroupList[this.currentClickIndex].resgroupId
      this.teachingExtraInfo.resId = this.pkgResGroupList[this.currentClickIndex].resId
      // 如果为[活动]
      if (pkgResGroup.dictCode === '2') {
        /* // TODO 隐藏富文本、显示活动列表等操作
        this.isShowActivityPage = true;
        this.isShowTinyMce = false;
        let that = this;
        setTimeout(() => {
          if (that.$refs.activity) {
            that.$refs.activity.isShowPage();
          }
        }, 500)*/
      } else {
        this.isShowTinyMce = true
        this.isShowActivityPage = false
        this.viewResInfo(this.pkgResGroupList[this.currentClickIndex].resgroupId)
      }
    },
    // 显示资源内容
    viewResInfo(resgroupId) {
      this.$api.pkgInfo.viewResInfo(resgroupId).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.clearSaveResourceData()
            this.saveResourceData.resContent = res.data.resContent
            this.saveResourceData.resId = res.data.resId
            if (this.saveResourceData.resContent) {
              if (tinyMCE.editors['resContent']) {
                tinyMCE.editors['resContent'].setContent(this.saveResourceData.resContent) // 富文本赋值
              }
            }
          }
        }
      })
    },

    /** 查看课程内容，滑动到最下面时，触发此接口   */
    chapterReadEnded: function() {
      if (this.resgroupIsRead) {
        return false
      }
      this.resgroupIsRead = true
      const params = JSON.parse(JSON.stringify(this.teachingExtraInfo))
      this.$api.classroom.viewChapter(params).then((res) => {})
    },
    /** 音频 和视频 的 自然播放结束 事件  */
    audioOrVideoEnded: function(event) {
      if (!event.attributes || !event.attributes.readid) {
        return false
      }
      const params = JSON.parse(JSON.stringify(this.teachingExtraInfo))
      delete params.resId
      //  let params = {
      //   ctId: (event.attributes.ctid && event.attributes.ctid.value) ? (event.attributes.ctid.value) : '',
      //   pkgId: (event.attributes.pkgid && event.attributes.pkgid.value) ? (event.attributes.pkgid.value) : '',
      //   subjectId: (event.attributes.subjectid && event.attributes.subjectid.value) ? (event.attributes.subjectid.value) : '',
      //   chapterId: (event.attributes.chapterid && event.attributes.chapterid.value) ? (event.attributes.chapterid.value) : '',
      // }
      let url = ''
      if (event.tagName && event.tagName === 'AUDIO') {
        url = 'viewAudio'
        params.audioId = event.attributes.readid.value
      } else if (event.tagName && event.tagName === 'VIDEO') {
        url = 'viewVideo'
        params.videoId = event.attributes.readid.value
      }
      if (!url) {
        return false
      }
      this.$api.classroom[url](params).then((res) => {})
    },
    /** 返回 */
    toback: function(url) {
      this.$router.push(url)
    },
    /** 页面初始数据的方法  */
    isShowPage: function() {
      const params = {
        pkgId: (this.bookshelfReadData && this.bookshelfReadData.pkgId) ? (this.bookshelfReadData.pkgId) : '',
        subjectId: (this.bookshelfReadData && this.bookshelfReadData.subjectId) ? (this.bookshelfReadData.subjectId) : '',
        ctId: (this.bookshelfReadData && this.bookshelfReadData.ctId) ? (this.bookshelfReadData.ctId) : ''
      }
      this.teachingExtraInfo.pkgId = params.pkgId
      this.teachingExtraInfo.subjectId = params.subjectId
      this.teachingExtraInfo.ctId = params.ctId
      this.zNodes = []
      this.$api.pkgInfo.viewBookInfo(params).then((res) => {
        if (res.code === 0) {
          this.zNodes = []
          this.zNodes.push(res.data)
          this.allChapterId = []
          // this.allChapterId.push(res.data.chapterId)
          this.recursiveTree(this.zNodes)
          this.mountedInit()
        } else if (res.msg) {
          toast(res.msg)
        }
      })
    },
    // 递归树
    recursiveTree(value) {
      for (let i = 0; i < value.length; i++) {
        this.allChapterId.push(value[i].chapterId)
        if (value[i].children) {
          this.recursiveTree(value[i].children)
        }
      }
    },
    // 清空
    clearSaveResourceData() {
      this.saveResourceData = {
        resContent: '',
        resId: ''
      }
      if (tinyMCE.editors['resContent']) {
        tinyMCE.editors['resContent'].setContent('') // 富文本赋值
      }
    },
    // 左则树节点点击事件
    showLibraryForm(data) {
      if (data.type === 'subject') { // 课堂节点目前是没有分组的
        this.isShowEditor = false
      } else {
        this.isShowEditor = true
      }

      if (document.querySelector('.left-teaching-material-catalogue') && document.querySelector('.left-teaching-material-catalogue').offsetHeight) {
        this.editHeight = document.querySelector('.left-teaching-material-catalogue').offsetHeight - 35
      }
      // if (document.querySelector('#left-nav') && document.querySelector('#left-nav').offsetHeight) {
      //   this.editHeight = document.querySelector('#left-nav').offsetHeight //  - 35
      // }
      this.viewChapterInfo(data.chapterId)
    },
    /** 点击查看章节、分组、资源 */
    viewChapterInfo(chapterId) {
      this.chapterId = chapterId

      this.teachingExtraInfo.chapterId = chapterId
      // this.teachingExtraInfo.resId = this.pkgResGroupList[this.currentClickIndex].resId;
      this.clearSaveResourceData()
      const params = {
        chapterId: chapterId
      }
      this.$api.pkgInfo.viewBookChapterInfo(params).then((res) => {
        if (res.code === 0) {
          this.pkgResGroupList = res.data.pkgResGroupList
          if (res.data && res.data.chapterContent) {
            this.saveResourceData.resContent = res.data.chapterContent
            if (tinyMCE.editors['resContent']) {
              tinyMCE.editors['resContent'].setContent(this.saveResourceData.resContent) // 富文本赋值
            }
          }
        }
      })
    },
    /** 分组前后切换，编辑器预览的章节切换， true为下一章  false为上一章  操作 */
    chaptersSwitch(value) {
      if (value) {
        for (let i = 0; i < this.allChapterId.length; i++) {
          if (this.allChapterId[i] === this.chapterId && i < this.allChapterId.length - 1) {
            this.$refs.ztreeLibrary.selectNode(this.allChapterId[i + 1])
            return false
          } else if (this.allChapterId[i] === this.chapterId && i === this.allChapterId.length - 1) {
            toast('这是最后一个章节了，不能再往下了')
            return false
          }
        }
      } else {
        for (let i = 0; i < this.allChapterId.length; i++) {
          if (this.allChapterId[i] === this.chapterId && i > 1) {
            this.$refs.ztreeLibrary.selectNode(this.allChapterId[i - 1])
            return false
          } else if (this.allChapterId[i] === this.chapterId && i === 1) {
            toast('这是第一个章节了，不能再往上了')
            return false
          }
        }
      }
    },
    /** 写在 mounted 上的方法 */
    mountedInit: function() {
      var vm = this
      $('#defaultId').selectpicker('val', this.value !== null ? this.value : null)
      $('#defaultId').on('changed.bs.select', function() {
        vm.$emit('input', $('#defaultId').val())
        if (typeof (vm.method) !== 'undefined') {
          vm.method(vm.index, vm.childidx, vm.value)
        }
      })
      $('#defaultId').on('show.bs.select', function() {
        if (typeof (vm.load) !== 'undefined') {
          vm.load(vm.index, vm.childidx)
        }
      })

      // if (document.querySelector('.left-teaching-material-catalogue') && document.querySelector('.left-teaching-material-catalogue').offsetHeight) {
      //   vm.editHeight = document.querySelector('.left-teaching-material-catalogue').offsetHeight - 35
      // }

      // if (document.querySelector('#left-nav') && document.querySelector('#left-nav').offsetHeight) {
      //   vm.editHeight = document.querySelector('#left-nav').offsetHeight //  - 35
      // }
    },
    // 编辑工具栏浮动
    onScroll() {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      // var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      // var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if ($('.mce-top-part').css('position') && $('.mce-top-part').css('position') === 'relative') {
        this.editorToolbarOffsetTop = $('.mce-top-part').offset().top
      }
      if ($('.mce-top-part').offset() && this.editorToolbarOffsetTop <= scrollTop && this.editorToolbarOffsetTop !== 0) {
        $('.mce-top-part').css({ 'position': 'fixed', 'width': '843px', 'top': '50px' })
      } else {
        $('.mce-top-part').css({ 'position': 'relative', 'width': '100%', 'top': '0' })
      }
    }
  }
}
</script>

<style scoped>
  .teaching-material{
    display: flex;
    /* width: 100%; */
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    position: relative;
    background-color: #fff;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1);
    margin: 20px auto;
  }
  /* 左边列表start */
  .left-teaching-material-catalogue{
      width: 29%;
      height: 100%;
      padding: 0 5px;
      transition: width 1s;
  }
  .left-teaching-material-catalogue .catalogue{
      width: 100%;
      /* min-height: calc(100vh - 110px - 289px - 30px); */
        /* min-height: calc(100vh - 50px - 110px - 30px); */
      height: calc(100vh - 90px);
      min-height: 550px;
      overflow-x: hidden;
      overflow-y: auto;
  }
  .left-teaching-material-catalogue .catalogue /deep/ .ztree {
     height: calc(100vh - 90px - 70px);
  }
  /* 左边列表end */
    /* 右边内容start */
    .right-teaching-material-con{
        width: 71%;
        /* height:100%; */
        height: calc(100vh - 90px);
        min-height: 550px;
        /*background-color: #e4e4e4;*/
        /*padding-left: 6px;*/
        margin-left: 6px;
        margin-right: 6px;
        transition: width 1s;
    }
  .right-teaching-material-con .header-nav{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height:39px;
    background-color: #f5f5f5;
    color: #666;
    font-size: 14px;
    /*border-bottom: 1px solid #dee2e6;*/
  }
  .right-teaching-material-con .header-nav .editor-nav{
    display: flex;
    align-items: center;
    height:100%;
    z-index: inherit;
    position: relative;
  }
  .header-nav .editor-nav .editor-nav-item{
    padding: 0 5px;
    width: 100px;
    height:100%;
    line-height: 36px;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    margin-bottom: -1px;
  }
  .header-nav .editor-nav .editor-nav-item:hover{
    color: #FF740E;
  }
  .header-nav .editor-nav .editor-nav-item:hover{
    color: #FF740E;
  }
  .header-nav .editor-nav .active-editor-nav{
    background-color: #ffffff;
    color: #0079fe;
    border-top: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
  }
  .right-teaching-material-con .header-nav .add-edit-nav-btn{
    cursor: pointer;
    display: flex;
    align-items:center;
    flex-shrink: 0;
  }
  .right-teaching-material-con .header-nav .add-edit-nav-btn > img{
    width: 32px;
    height:32px;
  }
  .right-teaching-material-con .header-nav .add-edit-nav-btn > div{
    font-size: 25px;
    width: 32px;
    height:32px;
    line-height: 32px;
    border-radius: 50%;
  }
  .right-teaching-material-con .header-nav .add-edit-nav-btn > div:hover{
    background-color: #dadada;
  }
  .right-teaching-material-con .header-nav .add-edit-nav-btn{
    margin: 0 8px;
  }
  .right-teaching-material-con .header-nav .save-btn{
    position: absolute;
    bottom:-82px;
    z-index: 888;
    right: 10px;
  }
  .right-teaching-material-con .header-nav .save-btn .save-icon{
    margin-right: 5px;
  }
  /* 左侧章节收缩按钮样式 */
    .shrinkage-btn{
      position: absolute;
      top: 50%;
      left: -20px;
      margin-top: -100px;
      height:100px;
      padding: 12px 0;
      line-height: 37px;
      color: #fff;
      width:20px;
      background-color: #c4c6c9f6;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      cursor: pointer;
    }
    .shrinkage-btn:hover{
      background-color: #0079fe;
    }
    .teaching-package-editor{
        width: 100%;
        height: 100%;
        /* height: 610px; */
        /* background-color: #fff; */
        /* padding-top:8px; */
    }
    .notContent-describe{
      font-family: 楷体;
      font-size: 20px;
      margin: 100px auto;
    }

    /* 返回 */
    .test-question-bank-nav{
        /* width: 100%; */
        display: flex;
    }
    .test-question-bank-nav2{
        display: flex;

        margin: 20px auto;
        background-color: #fff;
        -webkit-box-shadow: 2px 2px 2px #e0e0e0;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 6px;
    }
    .question-back{
        width: 100%;
        text-align: right;
        font-size: 14px;
        margin: 20px;
        cursor: pointer;
        color: #158aeb;
    }
    .question-back-icon{
        font-size: 14px;
        margin-right: 5px
    }
</style>
