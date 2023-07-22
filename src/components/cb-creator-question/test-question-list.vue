<!-- 试题列表的显示组件 页面 -->
<template>
  <!-- <div class="quesListComponentWrapper"> -->
  <ul :class="['quesList',isChildren?'quesCompoundList':'']">
    <li v-for="(topic,topicaIndex) in questionList" :class="['list-item mouse_style ']" :id="'scrollViewId_'+topic.questionsId" :key="topicaIndex" @click="quesClick(topic, topicaIndex)">
      <!-- <div class="quest-menu-box" v-if="!isChildren && (pagersType && pagersType === '0')">
              <i class="icon iconfont icon-jiantouarrowhead7" style="color:#ccc"></i>
              <ul class="ques-menu">
                  <li v-show="hasPermissionQuestion" @click="toClickListBtns(topicaIndex,'addTestQuestion','edit')">修改</li>
                  <li v-show="hasPermissionQuestion" @click="toClickListBtns(topicaIndex,'','del')">删除</li>
                  <li v-show="hasPermissionQuestion" @click="toClickListBtns(topicaIndex,'','forbidden')">作废</li>
                  <li @click="toClickListBtns(topicaIndex,'','error')">纠错</li>
              </ul>
          </div> -->

      <el-dropdown v-if="!isChildren && (pagersType && pagersType === '0')" class="list-item-dropdown" @command="handleCommand($event,topicaIndex)">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-up el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown" class="list-item-dropdown-menu">
          <el-dropdown-item v-show="hasPermissionQuestion" command="edit">修改</el-dropdown-item>
          <el-dropdown-item v-show="hasPermissionQuestion" command="del">删除</el-dropdown-item>
          <el-dropdown-item v-show="hasPermissionQuestion" command="forbidden">作废</el-dropdown-item>
          <el-dropdown-item command="error">纠错</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="quesDiffculty-box">
        <!-- topic.quesComBackColor -->
        <div :class="['quesDiffculty',topic.quesComBackColor]"><span>{{ topic.questionsComplexityName }}</span></div>
      </div>
      <div :class="['serialNum ', 'scrollViewId_'+topic.questionsId]">
        <span class="num" style="font-size: 16px;font-weight: bold;">{{ topicaIndex+1 }}.</span>
        <span :class="['type',topic.quesTypeBackColor]">{{ topic.questionsTypeName }}</span>
      </div>
      <!-- width:810px;  -->
      <div class="question" style="margin-top:5px;" @click="handleHtml($event)">
        <p style="margin: 0 0 10px;word-wrap:break-word;" v-html="topic.questionsName"/>
      </div>
      <div v-if="topic.optionList && topic.optionList.length > 0 && topic.questionsType && topic.questionsType !== '5' && topic.questionsType !== '4' && topic.questionsType !== '6'" class="options" >
        <p v-for="option in topic.optionList" :key="option.optionId" class="displayFlex2" @click="handleHtml($event)">
          <b style="margin-right:5px;">{{ option.code }}.</b>
          <span style="word-wrap:break-word;" v-html="option.content"/>
        </p>
        <div style="clear:both;"/>
      </div>
      <!-- el-fade-in  rightAnswer -->
      <transition name=" rightAnswer">
        <div v-if="topic.showAnalysis && topic.questionsType && topic.questionsType !== '6'" class="answer">
          <div class="answerCon">
            <div :class="['baseOrange',(topic.questionsType && topic.questionsType !== '5')?'displayFlex2':'']" style="isplay: block;margin-bottom: 10px;">
              <span v-if="topic.questionsType && topic.questionsType !== '4'" class="color-2ed5ac">正确答案：</span>
              <div v-if="topic.optionList && topic.optionList.length > 0 && topic.questionsType && topic.questionsType !== '5' && topic.questionsType !== '4'" class="displayFlex2 answerConCompletion">
                <div v-for="(item1, index1) in topic.optionList" :key="index1" class="displayFlex2">
                  <span v-if="item1.isRight " >{{ topic.questionsType !== '3' ? item1.code : ('A' === item1.code ? '对' : '错') }}</span>
                </div>
              </div>
              <div v-if="topic.optionList && topic.optionList.length > 0 && topic.questionsType && topic.questionsType === '5'" class="answerConCompletion">
                <div v-for="(item1, index1) in topic.optionList" :key="index1" class="">
                  <span v-if="item1.content " class="color-2ed5ac">填空{{ index1+1 }}：</span>
                  <span v-if="item1.content ">{{ item1.content }}</span>
                </div>
              </div>
            </div>
            <p style="color: #FF3E96;margin-bottom: 10px;">题目解析：</p>
            <div class="analysis" style="word-wrap:break-word;" @click="handleHtml($event)">
              <p v-if="topic.questionsParse" v-html="topic.questionsParse"/>
              <div v-else>暂无题目解析</div>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="topic.questionsType && topic.questionsType === '6' && topic.children && topic.children.length > 0 ">
        <test-question-list :question-list-init="topic.children" :has-permission-question="hasPermissionQuestion" :is-children="true"/>
      </div>

      <div class="bottomTab">
        <div v-if="!isChildren && (pagersType && pagersType === '2')" class="bottomTabCheck">
          <input v-model="topic.checked" type="checkbox"><span :class="['bottomTabCheckLabel',topic.checked ? 'bottomTabCheckedLabel':'' ]">是否选择</span>
          <!-- <el-checkbox v-model="topic.checked" @change="checkboxChange($event, topicaIndex)">是否选择</el-checkbox> -->
        </div>

        <div v-if="!isChildren && (pagersType && pagersType === '0')">组卷次数：<span class="baseOrange">{{ topic.questionsConstructingNum }}</span></div>
        <div v-if="!isChildren && (pagersType && pagersType === '0')">正确率：<span class="baseOrange">{{ topic.questionsAccuracy }}%</span></div>
        <div v-if="!isChildren && (pagersType && pagersType === '0')" @click="toClickListBtns(topicaIndex,'','collect')">
          <a :id="topic.questionsId+'_collect'" :class="[topic.isCollected?'baseOrange':'']" href="javascript:void(0)">
            <i class="collection iconfont icon-aixin" />收藏
          </a>
        </div>
        <div v-if="isChildren || (topic.questionsType && topic.questionsType !== '6')" style="text-align:right;">
          <a href="javascript:void(0)" @click.stop="showAnalysisCon(topicaIndex)" >
            <i class="analysis iconfont icon-chakan" style="font-size:20px;left:-25px;"/>查看解析
          </a>
        </div>
      </div>

    </li>

    <!-- 图片预览标签 -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="imgSrc" alt>
    </div>

  </ul>
  <!-- </div> -->
</template>
<script>
import { toast, getQuestionsComplexityBgColor, getQuestionsTypeBgColor } from '@/utils/global'
import $ from '@/assets/jquery-vendor'
export default {
  name: 'TestQuestionList',
  components: {
  },
  props: {
    pagersType: { // 引用该组件的页面的类型，'0'为评测中心的列表页
      type: String,
      default: '1'
    },
    hasPermissionQuestion: { // 是否有新增题目、修改题目等的权限
      type: Boolean,
      default: false
    },
    isChildren: { // 是否有子级
      type: Boolean,
      default: false
    },
    questionsComplexityListInit: { // 题目难易程度 数组
      type: Array,
      default: () => []
    },
    questionsTypeListInit: { // 题目类型数组
      type: Array,
      default: () => []
    },
    questionListInit: { // 传人的题目列表数组
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgSrc: '', // 图片预览的src
      questionsTypeList: [], // 题型 数组
      questionsComplexityList: [], // 题目 难易程度 数组
      questionList: [] // 题目集合
    }
  },
  computed: {
    allPropsChange: function() { // 监听多个数据
      const { questionListInit, pagersType, questionsTypeListInit, questionsComplexityListInit } = this
      return {
        questionListInit,
        pagersType,
        questionsTypeListInit,
        questionsComplexityListInit
      }
    }
  },
  watch: {
    'allPropsChange': { // 监听多个数据
      handler: function(val) {
        this.questionsTypeList = (val && val.questionsTypeListInit && val.questionsTypeListInit.length > 0) ? (val.questionsTypeListInit) : []

        this.questionsComplexityList = (val && val.questionsComplexityListInit && val.questionsComplexityListInit.length > 0) ? (val.questionsComplexityListInit) : []

        this.questionList = (val && val.questionListInit && val.questionListInit.length > 0) ? (JSON.parse(JSON.stringify(val.questionListInit))) : []
        this.$forceUpdate()
        if (this.questionList && this.questionList.length > 0) {
          this.questionList.forEach((item, index) => {
            if (!item.hasOwnProperty('showAnalysis')) {
              if (val.pagersType && val.pagersType === '0') {
                item.showAnalysis = false
              } else {
                item.showAnalysis = true
              }
            }
            item.quesComBackColor = getQuestionsComplexityBgColor(item.questionsComplexity)
            item.quesTypeBackColor = getQuestionsTypeBgColor(item.questionsType)
            // if (item.children && item.children.length > 0) {
            //   item.children.forEach((itemc, indexc) => {
            //     itemc.showAnalysis = false
            //     itemc.quesComBackColor = getQuestionsComplexityBgColor(itemc.questionsComplexity)
            //     itemc.quesTypeBackColor = getQuestionsTypeBgColor(itemc.questionsType)
            //   })
            // }
          })
        }
        if (this.questionList && this.questionList.length > 0 && this.questionsTypeList && this.questionsTypeList.length > 0 && this.questionsComplexityList && this.questionsComplexityList.length > 0) {
          this.questionList.forEach((item, index) => {
            item.questionsTypeName = this.findDictName(this.questionsTypeList, item.questionsType)
            item.questionsComplexityName = this.findDictName(this.questionsComplexityList, item.questionsComplexity)
          })
        }
        this.$forceUpdate()
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {},
  destroyed() {
  },
  methods: {
    quesClick: function(obj, index) {
      if (!this.isChildren && (this.pagersType && this.pagersType === '2')) {
        obj.checked = !obj.checked
        // this.questionList[index].checked = !this.questionList[index].checked
        this.$emit('checkboxChangeBack', { checked: obj.checked, index: index })
      }
    },
    checkboxChange: function(event, index) {
      this.$emit('checkboxChangeBack', { checked: event, index: index })
    },
    handleCommand: function(command, index) {
      // console.log('command', command)
      if (command && command === 'collect') {
        this.collectQuestions(index)
        // this.questionList[index].isCollected = !(this.questionList[index].isCollected)
        this.$forceUpdate()
      } else {
        let type = ''
        if (command && command === 'edit') {
          type = 'addTestQuestion'
        }
        this.$emit('testListComponentBack', { index: index, type: type, comType: command })
      }
    },
    /** 将参数 传递到 父组件 */
    toClickListBtns: function(index, type, comType) {
      if (comType && comType === 'collect') {
        this.collectQuestions(index)
        // this.questionList[index].isCollected = !(this.questionList[index].isCollected)
        this.$forceUpdate()
      } else {
        this.$emit('testListComponentBack', { index: index, type: type, comType: comType })
      }
    },
    /** 收藏或取消收藏题目 */
    collectQuestions: function(index) {
      const data = {
        questionsId: this.questionList[index].questionsId,
        state: 'Y'
      }
      if (this.questionList[index].isCollected) {
        data.state = 'N'
      }
      // this.questionList[index].isCollected = !(this.questionList[index].isCollected)
      this.$api.questionbank.collectQuestions(data).then((res) => {
        if (res.code === 0) {
          if (data.state === 'Y') {
            this.questionList[index].isCollected = true
          } else {
            this.questionList[index].isCollected = false
          }
          this.$forceUpdate()
          // this.questionList[index].isCollected = !(this.questionList[index].isCollected)
        }
        if (res.msg) {
          toast(res.msg)
        }
      }).catch((err) => {
        if (err.msg) {
          toast(err.msg)
        }
      })
    },
    /** 根据 dictCode 循环 arr 找到 dictCode 中与arr[i]name 相等 的元素 的  backName */
    findDictName: function(arr = [], dictCode = null, name = 'dictCode', backName = 'dictValue') {
      if (arr && arr.length > 0 && dictCode) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][name] === dictCode) {
            return arr[i][backName]
          }
        }
      }
      return dictCode
    },
    // 预览v-html里面的图片
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName === 'IMG') {
          this.imgSrc = $event.target.currentSrc
          // console.log(this.$el.querySelector('.accessory-viewer'))
          const viewer = this.$el.querySelector('.accessory-viewer').$viewer
          viewer.show()
        }
      }
    },
    /** 题目解析的显示隐藏 */
    showAnalysisCon: function(index) {
      this.questionList[index].showAnalysis = !(this.questionList[index].showAnalysis)
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.question{
  white-space: normal ;
  word-wrap: break-word ;
  word-break: break-all ;
}
.quesListComponentWrapper{
  width: 100%;
  height: 100%;
  background-color: yellow;
}
.list-item-dropdown{
  position: absolute;
  top: 20px;
  right:15px;
  width:50px;
  /* height:50px; */
  text-align: center;
  z-index: 555;
}
.list-item-dropdown /deep/ .el-dropdown-link i{
  font-size: 15px;
}
.list-item-dropdown /deep/ .el-dropdown-link:hover > i{
  transform: rotate(180deg);
}
.list-item-dropdown-menu /deep/ .el-dropdown-menu__item{
  padding: 0 35px;
}
.quesList > .list-item{
        position: relative;
        list-style:none;
        background-color: #FFF;
        padding: 15px 15px 0 15px;
        margin-bottom: 12px;
        text-align: left;
    }
    .quesList > .list-item:hover{
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
    .quesCompoundList{
      padding-bottom: 10px;
    }
    .quesCompoundList > .list-item{
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .answerCon .answerConCompletion{
      padding-left: 10px;
      box-sizing: border-box;
      word-break: break-all;
    }
    .color-2ed5ac{
      color: #2ed5ac;
    }

    /* 动画效果 */
    .rightAnswer-leave,
    .rightAnswer-enter-to {  height: auto; min-height: 83px; opacity: 1; }
    .rightAnswer-leave-to,
    .rightAnswer-enter { height: 0; opacity: 0;  }
    .rightAnswer-leave-active { transition: all 0.2s; }
    .rightAnswer-enter-active { transition: all 1s; }

    .bottomTabCheck{
      display: flex;
      align-items: center;
    }
    .bottomTabCheckLabel{
      padding-left: 5px;
      box-sizing: border-box;
    }
    .bottomTabCheckedLabel{
      color: #409EFF;
    }
</style>
