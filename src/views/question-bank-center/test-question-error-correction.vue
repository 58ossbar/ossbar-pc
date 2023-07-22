<!-- 题库的 试题 纠错 页面 -->
<template>
    <div class="backgroundColorGrey ">
        <header-nav :currentIndex="2" ></header-nav>
        <!-- 导航栏 begin  -->
        <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
            <div class="location">
                <div class="localtion-title"><b>当前位置:</b></div>
                <ul class="localtion-list">
                    <li class="localtion-item" style="cursor: pointer">
                        评测中心
                    </li>
                    <li class="localtion-item" @click="toback('/question-bank-center/test-question-bank')" style="cursor: pointer">
                        试题库
                    </li>
                    <li class="localtion-item">
                    <span style="color: #959da0">{{type}}</span>
                    </li>
                </ul>
            </div>
            <div class="question-back">
                <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/question-bank-center/test-question-bank')"></i>
                <span @click="toback('/question-bank-center/test-question-bank')">返回</span>
            </div>
        </div>
        <!-- 导航栏end -->
        <div class="test-question-bank-pages creator-test-question fontSize14">
            <!-- 导航栏 begin  -->
            <!-- <div class="test-question-bank-nav">
                <div class="location">
                    <div class="localtion-title"><b>当前位置:</b></div>
                    <ul class="localtion-list">
                        <li class="localtion-item" @click="toback('/begin-class')" style="cursor: pointer">
                            管理看板
                        </li>
                        <li class="localtion-item" @click="toback('/question-bank-center/test-question-bank')" style="cursor: pointer">
                            题库
                        </li>
                        <li class="localtion-item">
                        <span style="color: #959da0">{{type}}</span>
                        </li>
                    </ul>
                </div>
                <div class="question-back">
                    <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/question-bank-center/test-question-bank')"></i>
                    <span @click="toback('/question-bank-center/test-question-bank')">返回</span>
                </div>
            </div> -->
            <!-- 导航栏end -->
            <!-- 内容区域 begin -->
            <div class="test-question-content-wrapper">
                <!-- 左边 选择项 begin -->
                <div class="test-question-left ">
                  <div class="test-question-left-inner">
                    <div class="test-question-label">请在下方输入您的纠错理由</div>
                    <!-- 纠错理由begin -->
                    <div class="addTestQuestionsName" id="addTestQuestionsNameId">
                      <cb-editor name="content" :dataForm="dataForm" height='580' :toolStr="toolStr"></cb-editor>
                      <div class="invalid-feedback col-10 textAlignLeft p-0 questionsNameFeed"><small >纠错理由不能为空！</small></div>
                    </div>
                    <!-- 纠错理由end -->
                    <!-- 提交按钮 begin -->
                    <div class="creator-test-question-btns">
                      <button type="button" class="btn btn-outline-primary" @click="toSave('single')">提交</button>
                      <button type="button" class="btn btn-outline-secondary" @click="toback('/question-bank-center/test-question-bank')">取消</button>
                    </div>
                    <!-- 提交按钮 end -->
                  </div>
                </div>
                <!-- 左边 选择项 end -->
                <!-- 右边 选择项 begin -->
                <div class="test-question-right">
                    <!-- 试卷列表 begin -->
                    <div class="test-question-right-center">
                      <cb-test-question-list :questionListInit="questionList" :questionsTypeListInit="questionsTypeList" :questionsComplexityListInit="questionsComplexityList"></cb-test-question-list>
                    </div>
                    <!-- 试卷列表 end -->
                </div>
                <!-- 右边 选择项 end -->
            </div>
            <!-- 内容区域 end -->
        </div>
        <footer-nav></footer-nav>

        <!-- 图片预览标签 begin -->
        <div class="accessory-viewer" v-viewer style="display: none;">
          <img  :src="viewerImgSrc" alt>
        </div>
        <!-- 图片预览标签 end -->

    </div> 
</template>

<script>
import {formVaildStyle, formInVaildStyle, toast, confirm, loadingModal, getQuestionsTypeBgColor, getQuestionsComplexityBgColor} from '@/utils/global'
import $ from '@/assets/jquery-vendor'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import CbEditor from '@/components/cb-editor'
import TestQuestionList from '@/components/cb-creator-question/test-question-list'
export default {
  name: 'test-question-error-correction',
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'cb-editor': CbEditor,
    'cb-test-question-list': TestQuestionList
  },
  data () {
    return {
      viewerImgSrc:'',//图片预览src
      type: '试题纠错',
      questionList: [], // 当前要纠错的题目的数据
      questionsTypeList: [], // 题型 数组
      questionsComplexityList: [], // 题目 难易程度 数组
      dataForm: {
        content: ''
      }, // 表单数据项
      toolStr: 'removeformat image preview fullscreen', // 编辑器的tabstr
      questionsId: '', // 试题id，如果有则为编辑
      showAnalysis: true // 题目解析的显示隐藏
    }
  },
  watch: {},
  computed: {
  },
  created () {
  },
  mounted () {
    this.questionsId = localStorage.getItem('editQuesQuestionsId') // (this.$route && this.$route.query && this.$route.query.questionsId) ? (this.$route.query.questionsId) : ''
    this.getQuestionsTypeList()
    this.getQuestionsComplexityList()
    this.viewQuestion()
    let that = this
    this.$nextTick(() => {
      tinyMCE.editors['content'].on('blur', () => {
        if (that.dataForm.content) {
          $('.questionsNameFeed').css('display', 'none')
        } else {
          formInVaildStyle('.questionsNameFeed', '.addTestQuestionsName')
        }
      })
      tinyMCE.editors['content'].on('focus', () => {
        $('.addTestQuestionsName').removeClass('cb-form-valid')// 清除合法状态
        $('.addTestQuestionsName').removeClass('cb-form-invalid')// 添加非法状态
        $('.questionsNameFeed').css('display', 'none')
      })
    })
  },
  methods: {
    // 预览v-html里面的图片
    editorPreViewImg (viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      let viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    /** 根据 dictCode 循环 arr 找到 dictCode 中与arr[i]name 相等 的元素 的  backName */
    findDictName: function (arr = [], dictCode = null, name = 'dictCode', backName = 'dictValue') {
      if (arr && arr.length > 0 && dictCode) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][name] === dictCode) {
            return arr[i][backName]
          }
        }
      }
      return dictCode
    },
    /** 获取题目数组 */
    viewQuestion: function () {
      let that = this
      that.$api.questionbank.viewQuestion(that.questionsId).then(res => {
        if (res.code === 0) {
          that.questionList = []
          that.questionList.push(res.data)
          that.questionList.forEach(item => {
            item.showAnalysis = false
            // 正确答案
            if (item.replyIds && item.replyIds.split(',') && item.replyIds.split(',').length > 0 && item.optionList && item.optionList.length > 0) {
              let repList = item.replyIds.split(',')
              let optionList = item.optionList
              for (let a = 0; a < optionList.length; a++) {
                optionList[a].isRight = false
                for (let i = 0; i < repList.length; i++) {
                  if (repList[i] && optionList[a].optionId && repList[i] === optionList[a].optionId) {
                    optionList[a].isRight = true
                    break
                  }
                }
              }
            }
            item.questionsTypeName = this.findDictName(this.questionsTypeList, item.questionsType)
            item.questionsComplexityName = this.findDictName(this.questionsComplexityList, item.questionsComplexity)
            item.quesComBackColor = getQuestionsComplexityBgColor(item.questionsComplexity)
            item.quesTypeBackColor = getQuestionsTypeBgColor(item.questionsType)
            if (item.children && item.children.length > 0) {
              item.children.forEach((itemc, indexc) => {
                itemc.showAnalysis = false
                // 正确答案
                if (itemc.replyIds && itemc.replyIds.split(',') && itemc.replyIds.split(',').length > 0 && itemc.optionList && itemc.optionList.length > 0) {
                  let repList = itemc.replyIds.split(',')
                  let optionList = itemc.optionList
                  for (let a = 0; a < optionList.length; a++) {
                    optionList[a].isRight = false
                    for (let i = 0; i < repList.length; i++) {
                      if (repList[i] && optionList[a].optionId && repList[i] === optionList[a].optionId) {
                        optionList[a].isRight = true
                        break
                      }
                    }
                  }
                }
                itemc.quesComBackColor = getQuestionsComplexityBgColor(itemc.questionsComplexity)
                itemc.quesTypeBackColor = getQuestionsTypeBgColor(itemc.questionsType)
                itemc.questionsTypeName = this.findDictName(this.questionsTypeList, itemc.questionsType)
                itemc.questionsComplexityName = this.findDictName(this.questionsComplexityList, itemc.questionsComplexity)
              })
            }
          })
        }
      })
    },
    /** 保存 */
    toSave: function (type) {
      // 验证 题目名称
      if (!this.dataForm.content) {
        formInVaildStyle('.questionsNameFeed', '.addTestQuestionsName')
        this.$nextTick(() => {
          let container = this.$el.querySelector('.test-question-left')
          container.scrollTop = this.$el.querySelector('.test-question-label').offsetTop
        })
        return false
      }
      formVaildStyle('.questionsNameFeed', '.addTestQuestionsName')
      let that = this
      confirm('确定提交吗？', function () {
        let formDate = new FormData()
        formDate.append('questionsId', that.questionsId)
        formDate.append('content', that.dataForm.content)
        // let data = {
        //   questionsId: that.questionsId,
        //   content: that.dataForm.content
        // }
        loadingModal(true)
        that.$api.questionbank.confirmErrorCorrection(formDate).then((res) => {
          loadingModal(false)
          if (res.code === 0) {
            toast('提交成功')
            that.toback('/question-bank-center/test-question-bank')
          } else {
            if (res.msg) {
              toast(res.msg)
            }
          }
        }).catch((err) => {
          loadingModal(false)
          if (err.msg) {
            toast(err.msg)
          }
        })
      })
    },
    /** 根据 data 对比 arr数组中与name元素 相等  的 下标 */
    findNameByArr: function (arr, data, name) {
      let result = -1
      if (data && arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][name] && arr[i][name] === data) {
            result = i
            break
          }
        }
      }
      return result
    },
    /** 题目解析的显示隐藏 */
    showAnalysisCon: function () {
      if (this.showAnalysis) {
        this.showAnalysis = false
      } else {
        this.showAnalysis = true
      }
    },
    /** 获取 题目 难易程度 数组 */
    getQuestionsComplexityList: function () {
      this.questionsComplexityList = []
      this.$api.questionbank.getQuestionsComplexity().then(res => {
        if (res.data && res.data.length > 0) {
          this.questionsComplexityList = res.data
        }
      })
    },
    /** 获取 题型 数组 */
    getQuestionsTypeList: function () {
      this.questionsTypeList = []
      this.$api.questionbank.getQuestionsType().then(res => {
        if (res.data && res.data.length > 0) {
          this.questionsTypeList = res.data
        }
      })
    },
    /** 返回 */
    toback: function (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
    .test-question-bank-pages{
        /* height: calc(100vh - 50px - 100px ); */
        box-sizing: border-box;
        width: 1200px;
        margin: 0 auto;
        /* overflow-y: scroll; */
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
    .location,
    .question-back{
      height: 50px;
      line-height: 50px;
    }
    .question-back{
        width: 100%;
        text-align: right;
        font-size: 14px;
        /* margin: 20px; */
        padding-right: 20px;
        cursor: pointer;
        color: #158aeb;
        box-sizing: border-box;
    }
    .question-back-icon{
        font-size: 14px;
        margin-right: 5px
    }
    .test-question-content-wrapper{
        display: flex;
        justify-content: space-between;
        /* height: calc(100% - 60px); */
    }
    .test-question-left,
    .test-question-right{
        height: 100%;
        box-sizing: border-box;
        /* overflow-y: scroll; */
    }
    .test-question-left{
      width: 70%;
      text-align: left;
      /* position: relative; */
      /* border: 1px solid #007bff; */
    }
    .test-question-left-inner{
      border-radius: 5px;
      background-color: #fff;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
      padding: 15px;
      box-sizing: border-box;
      width: 100%;
    }
    .test-question-right{
        width: 30%;
        padding: 0 0 0 15px;
        /* background-color: red; */
    }
    .quesList > .list-item{
        position: relative;
        list-style:none;
        background-color: #FFF;
        padding: 15px 15px 0 15px;
        margin-bottom: 12px;
        text-align: left;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
    }
    .list-item .queHint{
        color: #666A75;
        font-size: 20px;
        text-align: center;
    }
    .list-item .queHint span{
        margin-top: 30px;
    }
    .list-item .quesDiffculty-box{
        position: absolute;
        top:0;
        right:0;
        width: 80px;
        height: 44px;
        overflow: hidden;
    }
    .list-item .quesDiffculty{
        position: absolute;
        top: 0;
        right:-20px;
        width: 80px;
        height: 18px;
        /* background-color: #2ed5ac; */
        text-align: center;
        line-height:18px;
        padding-left: 15px;
        color: #FFFFFF;
        transform: rotate(45deg);

    }
    .list-item .type{
        display: inline-block;
        /* width: 50px; */
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        border-radius: 10px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        /* background-color: #9B30FF; */
    }
    .list-item .options{
        margin-top:30px;
        /* display: flex;
        justify-content: space-between; */
    }
    .list-item .options >p{
        width: 50%;
        line-height: 1.5;
        overflow: hidden;
        padding-right: 15px;
        padding-bottom: 10px;
        margin-left: 0;
        float: left;
        transition: all .5s;
        word-break: break-all;
    }
    .test-question-label{
      color: red;
      margin-bottom: 5px;
    }
    .creator-test-question-btns{
      display: flex;
      align-content: center;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .creator-test-question-btns .btn{
      font-size: 14px;
      margin-right: 15px;
      /* width: 100px; */
    }
    .creator-test-question-btns .btn:last-child{
      margin-right: 0px;
    }
</style>
