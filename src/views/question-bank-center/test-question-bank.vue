<!-- 题库的 试题库页面 -->
<template>
  <div class="backgroundColorGrey ">
    <header-nav :current-index="2" :is-fixed="pageIsFixed"/>
    <!-- 排序查询区域Start -->
    <div :class="['classroom-all category-nav',pageIsFixed?'classroom-all-fixed':'']">
      <div class="category-nav-left">
        <ul class="nav category-nav-left-ul">
          <li :class="{'active-type':activeTabName === 'first'}" @click="tabClick('first')">试题库</li>
          <li :class="{'active-type':activeTabName === 'second'}" @click="tabClick('second')">试卷库</li>
          <!-- <li :class="{'active-type':activeTabName === 'three'}" @click="tabClick('three')">自测库</li>
          <li :class="{'active-type':activeTabName === 'four'}" @click="tabClick('four')">错题库</li> -->
        </ul>
      </div>
      <div class="category-nav-right">
        <ul class="nav category-nav-left-ul"/>
      </div>
    </div>
    <!-- 排序查询区域End -->
    <div class="test-question-bank-pages fontSize14">

      <div v-if="activeState === 0" class="test-question-content-wrapper">
        <!-- 左侧章节收缩begin -->
        <div class="shrinkage-btn" @click="isShowLeft = !isShowLeft">
          <div>
            {{ isShowLeft ? '隐藏' : '显示' }}
          </div>
        </div>
        <!-- 左侧章节收缩end -->
        <!-- 左边 选择项 begin -->
        <div :style="isShowLeft ? '' : 'width:0;border:none;'" class="test-question-left ">
          <div class="test-question-left-title">
            <div :style="isShowLeft ? '' : 'display:none;'" class="test-question-left-title-item" @click="isShowChapterTap">选择</div>
            <div :style="isShowLeft ? '' : 'display:none;'" class="test-question-left-title-item" @click="isShowChapterTap">
              <span v-if="subjectsList && subjectsList[currSubjectsIndex] && subjectsList[currSubjectsIndex].subjectName && currSubjectsIndex > 0">{{ subjectsList[currSubjectsIndex].subjectName }}</span>
            </div>
          </div>
          <div :style="isShowLeft ? '' : 'padding:0;'" class="test-question-left-list">
            <div v-if="chaptersList && chaptersList.length > 0 && isShowChapter">
              <p>章节：</p>
              <ul class=" technology-field-nav chapters-field-nav">
                <li v-for="(item0, index0) in chaptersList" :class="{'nav-clicked-type':currChaptersIndex === index0}" :key="index0" class="mouse_style" @click="selectChapters(index0)">{{ item0.chapterName }}</li>
              </ul>
            </div>
            <div v-else>
              <p >职业路径：</p>
              <ul class=" technology-field-nav">
                <li v-for="(item0, index0) in technosphereList" :class="{'nav-clicked-type':currTechnospherIndex === index0}" :key="index0" class="mouse_style" @click="selectTechnospher(index0)">{{ item0.majorName }}</li>
              </ul>
              <p >课程体系：</p>
              <ul class=" technology-field-nav">
                <li v-for="(item0, index0) in subjectsList" :class="{'nav-clicked-type':currSubjectsIndex === index0}" :key="index0" class="mouse_style" @click="selectSubjects(index0)">{{ item0.subjectName }}</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 左边 选择项 end -->
        <!-- 右边 选择项 begin -->
        <!-- 试题库 内容区域 begin -->
        <div v-show="activeTabName === 'first'" :class="['test-question-right',requestPages.pageStyle === 'pager'?'test-question-right-noscroll':'']" :style="isShowLeft ? '' : 'width:100%;padding:0;'">
          <!-- 上方 的 筛选 begin -->
          <div class="test-question-right-header">
            <div class="test-question-right-header-top">
              <div class="displayFlex2">
                <div class="test-question-right-header-top-nums">共<span class="baseOrange">{{ questionTotal }}</span>道试题</div>
              </div>
              <div class="displayFlex2">
                <div v-show="hasPermissionQuestion" class="test-question-right-header-top-btn" @click="toAddTestQuestionOrOrganizingPapers(null,'addTestQuestion')">添加试题</div>
                <!-- <div class="test-question-right-header-top-btn2" v-show="hasPermissionQuestion" @click="toAddTestQuestionOrOrganizingPapers(null,'organizingPapers')">教师组卷</div> -->
              </div>
            </div>
            <div class="test-question-right-header-bottom">
              <div class="test-question-right-header-bottom-wrapper">
                <span>题型：</span>
                <span v-for="(item0,index0) in questionsTypeList" :class="{'nav-clicked-type':currQuestionsTypeIndex === index0}" :key="index0" class="mouse_style test-question-right-header-bottom-type" @click="selecQuestionsType(index0)">{{ item0.dictValue }}</span>
              </div>
              <div class="test-question-right-header-bottom-wrapper">
                <!-- 实训 、开源 选择 begin -->
                <!-- <el-radio-group v-model="currQuestionsStyleIndex" size="mini">
                          <el-radio v-for="(item0,index0) in questionsStyleList" :key="index0" :label="index0">{{item0.dictValue}}</el-radio>
                      </el-radio-group> -->
                <!-- 实训 、开源 选择 end -->
                <span>难易程度：</span>
                <el-select v-model="currQuestionsComplexityIndex" size="mini" placeholder="请选择难易程度" class="test-question-right-header-bottom-select" @change="selectChange('questionsComplexity',$event)">
                  <el-option v-for="(item0,index0) in questionsComplexityList" :key="index0" :label="item0.dictValue" :value="index0"/>
                </el-select>
                <span>排序：</span>
                <el-select v-model="currQuestionsSortIndex" size="mini" placeholder="请选择排序" class="test-question-right-header-bottom-select-sort" @change="selectChange('questionsSort',$event)">
                  <el-option v-for="(item0,index0) in questionsSortList" :key="index0" :label="item0.dictValue" :value="index0"/>
                </el-select>
                <!-- @change="getQuestionList(false)" -->
                <el-input v-model="questionsName" class="search-input" placeholder="搜索题目名称" size="mini" suffix-icon="el-icon-search" @keyup.enter.native="getQuestionList(false)"/>
              </div>
            </div>
          </div>
          <!-- 上方 的 筛选 end -->
          <!-- 试卷列表 begin -->
          <div :class="['test-question-right-center',requestPages.pageStyle === 'pager'?'test-question-right-center-noscroll':'']" @scroll="handleScrollByQues">
            <cb-test-question-list :question-list-init="questionList" :questions-type-list-init="questionsTypeList" :questions-complexity-list-init="questionsComplexityList" :has-permission-question="hasPermissionQuestion" pagers-type="0" @testListComponentBack="testListComponentBack"/>
            <!-- 分页 -->
            <div v-if="requestPages.pageStyle === 'pager'">
              <pager v-if="questionList && questionList.length > 0" :page-size-prop="requestPages.pageSizeProp" :curr-page="requestPages.pageNum" :total-page="requestPages.pages" align="center" @changeIndex="changePaperIndex"/>
            </div>
          </div>
          <!-- 试卷列表 end -->
        </div>
        <!-- 试题库 内容区域 end -->
        <!-- 试卷库 内容区域 begin -->
        <div v-show="activeTabName === 'second'" :class="['test-question-right',requestPages.pageStyle === 'pager'?'test-question-right-noscroll':'']" :style="isShowLeft ? '' : 'width:100%;padding:0;'">
          <!-- 上方 的 筛选 begin -->
          <div class="test-question-right-header">
            <div class="test-question-right-header-top">
              <div class="displayFlex2">
                <div class="test-question-right-header-top-nums">共<span class="baseOrange">{{ paperTotal }}</span>份试卷</div>
              </div>
              <div class="displayFlex2">
                <!-- v-show="hasPermissionQuestion" -->
                <div v-if="isTeacher" class="test-question-right-header-top-btn2" @click="toAddTestQuestionOrOrganizingPapers(null,'organizingPapers')">{{ isTeacher?'教师':'学员' }}组卷</div>
              </div>
            </div>
            <div class="test-question-right-header-bottom">
              <div class="test-question-right-header-bottom-wrapper">
                <span>时间：</span>
                <el-select v-model="createDate" size="mini" placeholder="请选择时间" style="margin-right:25px;" class="papers-selects-time" @change="queryTestPapers()">
                  <el-option v-for="item0 in createList" :key="item0.createTime" :label="item0.createTime ? item0.createTime : '全部'" :value="item0.createTime"/>
                </el-select>
                <span>排序：</span>
                <el-select v-model="currTestPapersSortIndex" size="mini" placeholder="请选择排序" class="test-question-right-header-bottom-wrapper-margin test-question-right-header-bottom-select-sort" @change="selectChange('testPapersSort',$event)">
                  <el-option v-for="(item0,index0) in testPapersSortList" :key="index0" :label="item0.dictValue" :value="index0"/>
                </el-select>
              </div>
              <div class="test-question-right-header-bottom-wrapper">
                <!-- @change="queryTestPapers(false)"  -->
                <el-input v-model="paperName" class="search-input search-input-paper" placeholder="搜索试卷名称" size="mini" suffix-icon="el-icon-search" @keyup.enter.native="queryTestPapers(false)"/>
              </div>
            </div>

            <!-- <div class="test-question-right-header-bottom">
                    <div class="test-question-right-header-bottom-wrapper">

                      <el-input class="test-question-right-header-bottom-wrapper-margin search-input" placeholder="搜索试卷名称" size="mini"  @change="queryTestPapers()" @keyup.enter.native="queryTestPapers()" v-model="paperName" suffix-icon="el-icon-search"></el-input>
                    </div>
                </div> -->
          </div>
          <!-- 上方 的 筛选 end -->
          <!-- 试卷列表 begin -->
          <div :class="['test-question-right-center',requestPages.pageStyle === 'pager'?'test-question-right-center-noscroll':'']" @scroll="handleScrollByQues">
            <ul class="quesList">
              <li v-for="(topic,topicaIndex) in testPaperList" :key="topicaIndex" class="list-item mouse_style papers_list_wrapper">
                <!-- width:810px;  -->
                <div class="papers_list_img_wrapper">模拟
                  <!-- <img src="static/image/goose_d1.png"/> -->
                </div>
                <div class="papers_list_name_wrapper">
                  <p class="papers_list_name">{{ topic.paperName }}</p>
                  <div class="papers_list_details">
                    <div>创建时间：{{ topic.createTime }}</div>
                    <div>练习次数：{{ topic.paperPracticeTime }}</div>
                    <div>类型：基本试卷</div>
                  </div>
                </div>
                <div class="papers_list_btn_start" @click="startExamination(topic.paperId)">开始考试</div>
              </li>
            </ul>
            <!-- 分页 -->
            <div v-if="requestPages.pageStyle === 'pager'">
              <pager v-if="testPaperList && testPaperList.length > 0" :page-size-prop="requestPages.pageSizeProp" :curr-page="requestPages.pageNum" :total-page="requestPages.pages" align="center" @changeIndex="changePaperIndex"/>
            </div>
          </div>
          <!-- 试卷列表 end -->
        </div>
        <!-- 试卷库 内容区域 end -->

        <!-- 右边 选择项 end -->
      </div>
      <!-- 内容区域 end -->

      <!-- 试卷考试区域begin -->
      <div v-if="activeTabName === 'second' && activeState === 1">
        <test-question-write :paper-id="paperId"/>
      </div>
      <!-- 试卷考试区域end -->

      <!-- 图片预览标签 -->
      <div v-viewer class="accessory-viewer" style="display: none;">
        <img :src="imgSrc" alt>
      </div>
    </div>

    <el-backtop/>

    <!-- <footer-nav></footer-nav> -->
  </div>
</template>
<script>
import { loadingModal, toast, confirm, getQuestionsComplexityBgColor, getQuestionsTypeBgColor, getUserInfo } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import testQuestionWrite from '@/views/question-bank-center/test-question-write'
import TestQuestionList from '@/components/cb-creator-question/test-question-list'
import Pager from '@/components/pager'

export default {
  name: 'TestQuestionBank',
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'pager': Pager,
    'test-question-write': testQuestionWrite,
    'cb-test-question-list': TestQuestionList
  },
  filters: {
  },
  data() {
    return {
      isShowLeft: true, // 是否显示左侧 职业路径等选择
      pageIsFixed: false, // 页面是否固定fixed
      imgSrc: '',
      type: '理论题库',
      technosphereList: [], // 职业路径 分类 数组
      currTechnospherIndex: 0, // 当前选中的 职业路径 分类 数组 的 下标
      subjectsList: [], // 课程 技术 数组
      currSubjectsIndex: 0, // 当前选中的 课程 技术 数组 的 下标
      chaptersList: [], // 章节 数组
      currChaptersIndex: 0, // 当前选中的 章节 数组 的 下标
      questionsTypeList: [], // 题型 数组
      currQuestionsTypeIndex: 0, // 当前选中的 题型 数组 的 下标
      // questionsStyleList: [], // 题目 类型 数组 ： 实训或者开源
      // currQuestionsStyleIndex: 0, // 当前选中的 题目 类型 数组 ： 实训或者开源  的 下标
      questionsComplexityList: [], // 题目 难易程度 数组
      currQuestionsComplexityIndex: 0, // 当前选中的 题目 难易程度 的 下标
      questionsSortList: [], // 题目 排序 数组
      currQuestionsSortIndex: 0, // 当前选中的 题目 排序 的 下标
      requestPages: {
        pageNum: 1, // 当前页面
        // pages: 1, // 总共几页
        pageSize: 10, // 一页显示几条数据  25   10
        pageSizeProp: 10, // 一页显示几条数据  25   10
        pageStyle: 'pager' // 'scroll' 滚动  'pager' 分页
      }, // 分页数据
      isTeacher: getUserInfo().isTeacher, // 是否是老师
      isLoadingByQues: false, // 试题是否在加载
      questionTotal: 0, // 题目总数
      paperTotal: 0, // 试卷库 试卷总数
      isOnce: true, // 是否是第一次拿到 hasPermissionQuestion
      hasPermissionQuestion: false, // 是否有题库的权限
      questionsName: '', // 搜索框的值
      activeTabName: 'first', // tab选项卡的值
      activeState: 0, // 试卷库状态  0试卷库列表 1考试
      isShowChapter: false, // 是否显示章节
      questionList: [], // 题目集合
      paperName: '', // 试卷名称
      currTestPapersSortIndex: 0, // 当前选中的 试卷 排序 的 下标
      testPapersSortList: [], // 测试试卷 排序 数组
      testPaperList: [], // 试卷集合
      createList: [],
      createDate: '', // 试卷的创建时间
      paperId: '' // 当前作答试卷的试卷id
    }
  },
  computed: {
  },
  watch: {
    // 'currQuestionsTypeIndex': function (value) {
    //   this.getQuestionList(false)
    // },
    // 'currQuestionsStyleIndex': function (value) {
    //   this.getQuestionList(false)
    // },
    // 'currQuestionsComplexityIndex': function (value) {
    //   this.getQuestionList(false)
    // },
    // 'currQuestionsSortIndex': function (value) {
    //   this.getQuestionList(false)
    // },
    'currTestPapersSortIndex': function() {
      this.queryTestPapers()
    },
    'createDate': function() {
      this.queryTestPapers()
    }
  },
  created() {
  },
  mounted() {
    // localStorage.setItem('editQuesQuestionsId', '')
    // // localStorage.setItem('editQuesMajorId', '')
    // // localStorage.setItem('editQuesSubjectId', '')
    // // localStorage.setItem('editQuesChaptersId', '')
    // // localStorage.setItem('editQuesQuestionsType', '')
    // // localStorage.setItem('editQuesQuestionsComplexity', '')
    // this.getTechnosphereList()
    // this.getQuestionsTypeList()
    // this.getQuestionsComplexityList()
    // this.getQuestionsSortList()

    this.activeTabName = 'first'
    if (localStorage.getItem('editQuesQuestionsTab') && localStorage.getItem('editQuesQuestionsTab') !== undefined) {
      this.activeTabName = localStorage.getItem('editQuesQuestionsTab')
      localStorage.removeItem('editQuesQuestionsTab')
    }
    this.tabClick(this.activeTabName, 'root')

    // this.getQuestionsStyleList()
    // this.getQuestionList(false)
  },
  methods: {
    isShowChapterTap: function() {
      if (this.subjectsList && this.subjectsList[this.currSubjectsIndex] && this.subjectsList[this.currSubjectsIndex].subjectName && this.currSubjectsIndex > 0) {
        this.isShowChapter = !(this.isShowChapter)
      } else {
        this.isShowChapter = false
      }
    },
    /** tab 的点击事件 */
    tabClick: function(name, type = '') {
      this.isOnce = true
      // if(name == 'second'){
      //   this.queryTestPapers();
      // }
      this.activeState = 0
      this.activeTabName = name
      if (type && type === 'root') {
        this.getTechnosphereList()
        // if (this.activeTabName && this.activeTabName === 'second') {
        //   this.getQuestionList(false, true)
        // }
      } else {
        this.selectTechnospher(0)
        localStorage.setItem('editQuesMajorId', '')
        localStorage.setItem('editQuesSubjectId', '')
        localStorage.setItem('editQuesChaptersId', '')
        localStorage.setItem('editQuesQuestionsType', '')
        localStorage.setItem('editQuesQuestionsComplexity', '')
        localStorage.setItem('editQuesQuestionsId', '')
        localStorage.setItem('editQuesQuestionsScrollTop', '')
      }
      this.isShowChapter = false
      localStorage.removeItem('paperIdByStartExamination')
      // localStorage.setItem('editQuesQuestionsId', '')
      if (this.activeTabName && this.activeTabName === 'first') {
        this.getQuestionsTypeList()
        this.getQuestionsComplexityList()
        this.getQuestionsSortList()
      } else if (this.activeTabName && this.activeTabName === 'second') {
        this.getTestPaperSortList() // 加载测试排序数组
        this.queryTime()
      }
    },
    // 根据条件查询试卷列表
    queryTestPapers(isLazy = false, isOnce = false) {
      const obj = {}
      if (!isLazy) {
        this.requestPages.pageNum = 1
        this.testPaperList = []
        // if (isOnce) {
        //   this.hasPermissionQuestion = false
        // }
      }
      obj.majorId = (localStorage.getItem('editQuesMajorId')) ? (localStorage.getItem('editQuesMajorId')) : ''
      obj.subjectId = (localStorage.getItem('editQuesSubjectId')) ? (localStorage.getItem('editQuesSubjectId')) : '' // 所属教材
      obj.chaptersId = (localStorage.getItem('editQuesChaptersId') && localStorage.getItem('editQuesChaptersId') !== undefined) ? (localStorage.getItem('editQuesChaptersId')) : '' // 所属章节

      obj.sortField = (this.testPapersSortList && this.testPapersSortList[this.currTestPapersSortIndex] && this.testPapersSortList[this.currTestPapersSortIndex].dictCode) ? (this.testPapersSortList[this.currTestPapersSortIndex].dictCode) : '1' // 排序条件
      obj.pageNum = this.requestPages.pageNum
      obj.pageSize = this.requestPages.pageSize
      obj.paperName = (this.paperName) ? (this.paperName) : '' // 根据试卷名查找试卷信息
      obj.createDate = this.createDate
      this.$api.questionbank.queryTestPapers(obj).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.list && res.data.list.length > 0) {
            res.data.list.forEach(item => {
              if (isLazy && this.requestPages.pageStyle === 'scroll') {
                this.testPaperList.push(item)
              }
            })
            if (!isLazy || (isLazy && this.requestPages.pageStyle === 'pager')) {
              this.testPaperList = res.data.list
            }
          }

          this.paperTotal = (res.data && res.data.total) ? (res.data.total) : 0 // 总题目数量
          if (res.data && res.data.pageNum) {
            this.requestPages.pageNum = res.data.pageNum
          }
          if (res.data && res.data.pageSize) {
            this.requestPages.pageSize = res.data.pageSize
          }
          if (res.data && res.data.pages) {
            this.requestPages.pages = res.data.pages
          }
        } else {
          if (res.msg) {
            toast(res.msg)
          }
        }
        // if (isOnce) {
        //   this.hasPermissionQuestion = res.hasPermissionQuestion
        // }
        // loadingModal(false)
        this.isLoadingByQues = false
      }).catch((err) => {
        if (err.msg) {
          toast(err.msg)
        }
        // loadingModal(false)
        this.isLoadingByQues = false
      })

      // this.$api.questionbank.queryTestPapers(obj).then(res => {
      //     if(res.code === 0){
      //         this.testPaperList = res.data.list;
      //     }
      //     if (res.msg) {
      //         toast(res.msg)
      //     }
      // })
    },
    // 根据试卷的创建时间搜素
    queryTime() {
      const obj = {}
      this.requestPages.pageNum = 1
      this.createList = [{ createTime: '' }]
      obj.createDate = this.createDate
      obj.pageNum = this.requestPages.pageNum
      obj.pageSize = this.requestPages.pageSize
      this.$api.questionbank.queryTime(obj).then(res => {
        // console.log("创建时间为：", this.createList);
        if (res.code === 0) {
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              this.createList.push(item)
            })
          }

          if (res.data && res.data.pageNum) {
            this.requestPages.pageNum = res.data.pageNum
          }
          if (res.data && res.data.pageSize) {
            this.requestPages.pageSize = res.data.pageSize
          }
          if (res.data && res.data.pages) {
            this.requestPages.pages = res.data.pages
          }
        } else {
          if (res.msg) {
            toast(res.msg)
          }
        }
      })
    },
    // 去重
    unique(arr) {
      return Array.from(new Set(arr))
    },
    /** tab 的点击事件 */
    handleActiveTabClick: function(tab, event) {
      this.selectTechnospher(0)
    },
    // 预览v-html里面的图片
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName === 'IMG') {
          this.imgSrc = $event.target.currentSrc
          const viewer = this.$el.querySelector('.accessory-viewer').$viewer
          viewer.show()
        }
      }
    },
    /** 加载下一页 */
    handleScrollByQues: function(event) {
      if (this.requestPages.pageStyle === 'pager') {
        return false
      }
      // 滚动的像素 + 容器的高度>可滚动的总高度-100像素
      if ((event.target.scrollTop + event.target.offsetHeight > event.target.scrollHeight - 100) && (!this.isLoadingByQues)) {
        const pageNum = parseInt(this.requestPages.pageNum) + 1
        if (pageNum <= parseInt(this.requestPages.pages)) {
          this.requestPages.pageNum = pageNum
          this.isLoadingByQues = true
          if (this.activeTabName && this.activeTabName === 'second') {
            this.queryTestPapers(true)
          } else {
            this.getQuestionList(true)
          }
        }
      }
    },
    // 分页更新数据
    changePaperIndex(value, size) {
      this.requestPages.pageNum = value
      this.requestPages.pageSize = size
      this.isLoadingByQues = true
      if (this.activeTabName && this.activeTabName === 'second') {
        this.queryTestPapers(true)
      } else {
        this.getQuestionList(true)
      }
    },
    /** 题目解析的显示隐藏 */
    showAnalysisCon: function(event, index, preIndex) {
      if (preIndex || preIndex === 0) {
        this.questionList[preIndex].children[index].showAnalysis = !(this.questionList[preIndex].children[index].showAnalysis)
      } else {
        this.questionList[index].showAnalysis = !(this.questionList[index].showAnalysis)
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
    /** 删除题目 */
    deleRuestion: function(index) {
      const that = this
      confirm('确定要删除这道题目吗？', function() {
        that.$api.questionbank.deleteQuestion(that.questionList[index].questionsId).then(res => {
          if (res.code === 0) {
            that.getQuestionList(false)
          }
          if (res.msg) {
            toast(res.msg)
          }
        })
      })
    },
    /** 作废题目 */
    forbiddenQuestion: function(index) {
      const that = this
      confirm('确定要作废这道题目吗？', function() {
        const formDate = new FormData()
        formDate.append('questionsId', that.questionList[index].questionsId)
        that.$api.questionbank.forbiddenQuestions(formDate).then(res => {
          if (res.code === 0) {
            that.getQuestionList(false)
          }
          if (res.msg) {
            toast(res.msg)
          }
        })
      })
    },
    /** 纠错题目 */
    errorCorrectionQuestions: function(index) {
      const questionsId = ((index || index === 0) && this.questionList[index] && this.questionList[index].questionsId) ? (this.questionList[index].questionsId) : ''
      const that = this
      if (index || index === 0) {
        this.toOtherPagesInitLocalStorage(index)
        const scrollObj = {
          list: this.$el.querySelector('.test-question-right-center').scrollTop,
          doc: document.documentElement.scrollTop,
          pageNum: this.requestPages.pageNum
        }
        localStorage.setItem('editQuesQuestionsScrollTop', JSON.stringify(scrollObj))
      }
      // that.$api.questionbank.errorCorrectionQuestions(that.questionList[index].questionsId).then(res => {
      //   if (res.code === 0) {
      localStorage.setItem('editQuesQuestionsId', questionsId)
      that.$router.push({
        path: '/question-bank-center/test-question-error-correction',
        query: {
          questionsId: questionsId
        }
      })
      //   }
      //   if (res.msg) {
      //     toast(res.msg)
      //   }
      // }).catch(err => {
      //   if (err && err.msg) {
      //     toast(err.msg)
      //   }
      // })
    },
    /** 获取题目数组 */
    getQuestionList: function(isLazy, type) {
      if (!isLazy) {
        this.requestPages.pageNum = 1
        this.questionList = []
        if (this.isOnce) {
          this.hasPermissionQuestion = false
        }
      }
      const params = {}
      // params.questionsStyle = this.questionsStyleList[this.currQuestionsStyleIndex].dictCode

      params.majorId = (localStorage.getItem('editQuesMajorId')) ? (localStorage.getItem('editQuesMajorId')) : ''
      params.subjectId = (localStorage.getItem('editQuesSubjectId')) ? (localStorage.getItem('editQuesSubjectId')) : '' // 所属教材
      params.chaptersId = (localStorage.getItem('editQuesChaptersId') && localStorage.getItem('editQuesChaptersId') !== undefined) ? (localStorage.getItem('editQuesChaptersId')) : '' // 所属章节
      params.questionsType = (localStorage.getItem('editQuesQuestionsType')) ? (localStorage.getItem('editQuesQuestionsType')) : '' // 题目类型
      params.questionsComplexity = (localStorage.getItem('editQuesQuestionsComplexity')) ? (localStorage.getItem('editQuesQuestionsComplexity')) : '' // 题目难易

      params.sortBy = (this.questionsSortList && this.questionsSortList[this.currQuestionsSortIndex] && this.questionsSortList[this.currQuestionsSortIndex].dictCode) ? (this.questionsSortList[this.currQuestionsSortIndex].dictCode) : '1' // 排序条件
      params.pageNum = this.requestPages.pageNum
      params.pageSize = this.requestPages.pageSize
      params.questionsName = (this.questionsName) ? (this.questionsName) : ''

      // loadingModal(true)
      this.$api.questionbank.query(params).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.list && res.data.list.length > 0) {
            res.data.list.forEach(item => {
              item.showAnalysis = false
              // 正确答案
              if (item.replyIds && item.replyIds.split(',') && item.replyIds.split(',').length > 0 && item.optionList && item.optionList.length > 0) {
                const repList = item.replyIds.split(',')
                const optionList = item.optionList
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
                    const repList = itemc.replyIds.split(',')
                    const optionList = itemc.optionList
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

              if (isLazy && this.requestPages.pageStyle === 'scroll') {
                this.questionList.push(item)
              }
            })
            if (!isLazy || (isLazy && this.requestPages.pageStyle === 'pager')) {
              this.questionList = res.data.list
            }
          }

          this.questionTotal = (res.data && res.data.total) ? (res.data.total) : 0 // 总题目数量
          if (res.data && res.data.pageNum) {
            this.requestPages.pageNum = res.data.pageNum
          }
          if (res.data && res.data.pageSize) {
            this.requestPages.pageSize = res.data.pageSize
          }
          if (res.data && res.data.pages) {
            this.requestPages.pages = res.data.pages
          }
        } else {
          if (res.msg) {
            toast(res.msg)
          }
        }
        if (this.isOnce) {
          this.hasPermissionQuestion = res.hasPermissionQuestion

          this.isOnce = false
        }
        // loadingModal(false)
        this.isLoadingByQues = false

        let editQuesQuestionsId = ''
        if (localStorage.getItem('editQuesQuestionsId') && localStorage.getItem('editQuesQuestionsId') !== undefined) {
          editQuesQuestionsId = localStorage.getItem('editQuesQuestionsId')
        }

        /** 实现修改和纠错时 定位到当前要改变的题目位置 */
        if (editQuesQuestionsId && editQuesQuestionsId !== undefined && localStorage.getItem('editQuesQuestionsScrollTop') && localStorage.getItem('editQuesQuestionsScrollTop') !== undefined) {
          const indexcq = this.findNameByArr(this.questionList, editQuesQuestionsId, 'questionsId')
          const pageNum = +JSON.parse(localStorage.getItem('editQuesQuestionsScrollTop')).pageNum
          // pageNum === params.pageNum || indexcq > -1
          if (indexcq > -1) {
            this.$nextTick(() => {
              // console.log('222')

              if (this.requestPages.pageStyle === 'pager') {
                document.documentElement.scrollTop = this.$el.querySelector('#scrollViewId_' + editQuesQuestionsId).offsetTop - 15 - 12
              } else {
                document.getElementById('scrollViewId_' + editQuesQuestionsId).scrollIntoView()
              }

              this.$forceUpdate()

              // this.$el.querySelector('.scrollViewId_'+ editQuesQuestionsId ).scrollIntoView();

              // this.$el.querySelector('.test-question-right-center').scrollTop = this.$el.querySelector('.scrollViewId_'+ editQuesQuestionsId ).offsetTop;
              setTimeout(function() {
                localStorage.setItem('editQuesQuestionsId', '')
                localStorage.setItem('editQuesQuestionsScrollTop', '')
              }, 1000)
              loadingModal(false)
            })
          } else {
            // if (pageNum > params.pageNum) {
            if (((+(this.requestPages.pageNum)) + 1) <= parseInt(this.requestPages.pages)) {
              // console.log('执行了1111')
              this.requestPages.pageNum = (+(this.requestPages.pageNum)) + 1
              this.getQuestionList(true, 'backScrollToView')
              if (!isLazy) {
                loadingModal(true, '正在加载回到原来的位置中，请稍等……')
              }
            }
            // }
          }
        }
      }).catch((err) => {
        if (err.msg) {
          toast(err.msg)
        }
        // loadingModal(false)
        this.isLoadingByQues = false
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
    /** 缓存 选择的职业路径 和 课堂体系 等等 选择  的 赋值 */
    toOtherPagesInitLocalStorage: function(index) {
      let majorId = (this.technosphereList && this.technosphereList[this.currTechnospherIndex] && this.technosphereList[this.currTechnospherIndex].majorId) ? (this.technosphereList[this.currTechnospherIndex].majorId) : ''
      let subjectId = (this.subjectsList && this.subjectsList[this.currSubjectsIndex] && this.subjectsList[this.currSubjectsIndex].subjectId) ? (this.subjectsList[this.currSubjectsIndex].subjectId) : '' // 所属教材
      let chaptersId = (this.chaptersList && this.chaptersList[this.currChaptersIndex] && this.chaptersList[this.currChaptersIndex].chapterId) ? (this.chaptersList[this.currChaptersIndex].chapterId) : '' // 所属章节
      let questionsType = (this.questionsTypeList && this.questionsTypeList[this.currQuestionsTypeIndex] && this.questionsTypeList[this.currQuestionsTypeIndex].dictCode) ? (this.questionsTypeList[this.currQuestionsTypeIndex].dictCode) : '' // 题目类型
      let questionsComplexity = (this.questionsComplexityList && this.questionsComplexityList[this.currQuestionsComplexityIndex] && this.questionsComplexityList[this.currQuestionsComplexityIndex].dictCode) ? (this.questionsComplexityList[this.currQuestionsComplexityIndex].dictCode) : '' // 题目难易

      if (index || index === 0) {
        majorId = (this.questionList[index] && this.questionList[index].majorId) ? (this.questionList[index].majorId) : ''
        subjectId = (this.questionList[index] && this.questionList[index].subjectId) ? (this.questionList[index].subjectId) : ''
        chaptersId = (this.questionList[index] && this.questionList[index].chaptersId) ? (this.questionList[index].chaptersId) : ''
        questionsType = (this.questionList[index] && this.questionList[index].questionsType) ? (this.questionList[index].questionsType) : ''
        questionsComplexity = ''
        if (this.questionList[index] && this.questionList[index].questionsComplexity) {
          const indexc = this.findNameByArr(this.questionsComplexityList, this.questionList[index].questionsComplexity, 'dictValue')
          if (indexc > -1) {
            questionsComplexity = this.questionsComplexityList[indexc].dictCode
          }
        }
      }

      if (!majorId) {
        subjectId = ''
        chaptersId = ''
      }
      localStorage.setItem('editQuesMajorId', majorId)
      localStorage.setItem('editQuesSubjectId', subjectId)
      localStorage.setItem('editQuesChaptersId', chaptersId)
      localStorage.setItem('editQuesQuestionsType', questionsType)
      localStorage.setItem('editQuesQuestionsComplexity', questionsComplexity)
    },
    /** 试题库列表组件的 返回事件 */
    testListComponentBack: function(event) {
      if (event.comType && event.comType === 'edit') {
        this.toAddTestQuestionOrOrganizingPapers(event.index, event.type)
      } else if (event.comType && event.comType === 'del') {
        this.deleRuestion(event.index)
      } else if (event.comType && event.comType === 'forbidden') {
        this.forbiddenQuestion(event.index)
      } else if (event.comType && event.comType === 'error') {
        this.errorCorrectionQuestions(event.index)
      }
    },
    /** 去添加试题 */
    toAddTestQuestionOrOrganizingPapers: function(index, type) {
      if (type && type === 'addTestQuestion') {
        if (!this.hasPermissionQuestion) {
          toast('暂无权限，请先登录')
          return false
        }
      }

      const questionsId = ((index || index === 0) && this.questionList[index] && this.questionList[index].questionsId) ? (this.questionList[index].questionsId) : ''
      localStorage.setItem('editQuesQuestionsId', questionsId)
      if (index || index === 0) {
        this.toOtherPagesInitLocalStorage(index)
        const scrollObj = {
          list: this.$el.querySelector('.test-question-right-center').scrollTop,
          doc: document.documentElement.scrollTop,
          pageNum: this.requestPages.pageNum
        }
        localStorage.setItem('editQuesQuestionsScrollTop', JSON.stringify(scrollObj))
      }
      let path = '/question-bank-center/creator-test-question'
      if (type && type === 'organizingPapers') {
        path = '/question-bank-center/test-question-organizing-papers'
        localStorage.setItem('editQuesQuestionsTab', 'second')
      }
      this.$router.push({
        path: path,
        query: {
          questionsId: questionsId
        }
      })
    },
    /** 获取 题目 类型 数组 ： 实训或者开源 数组 */
    getQuestionsStyleList: function() {
      this.currQuestionsStyleIndex = 0
      this.questionsStyleList = [
        // {dictCode: 0, dictValue: '实训'},
        // {dictCode: 1, dictValue: '开源'}
      ]
      /** 只有两种状态，没有默认值 */
      this.$api.questionbank.getQuestionsStyle().then(res => {
        if (res.data && res.data.length > 0) {
          const questionsSytleArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < questionsSytleArr.length; i++) {
            this.questionsStyleList.push(questionsSytleArr[i])
          }
        }
      })
    },
    /** 获取 题目 排序 数组 */
    getQuestionsSortList: function() {
      this.currQuestionsSortIndex = 0
      this.questionsSortList = [
        { dictCode: '1', dictValue: '最近新增' },
        { dictCode: '2', dictValue: '组卷率高' },
        { dictCode: '3', dictValue: '正确率高' },
        { dictCode: '4', dictValue: '收藏率高' }
      ]
      // this.getQuestionList(false)
    },
    // 获取试卷排序数组
    getTestPaperSortList: function() {
      this.currTestPapersSortIndex = 0
      this.testPapersSortList = [
        { dictCode: '1', dictValue: '最近新增' },
        { dictCode: '2', dictValue: '练习次数' }
      ]
    },
    /** 切换题目类型 */
    selectChange: function(name, event) {
      if (name && name === 'testPapersSort') {
        this.currTestPapersSortIndex = event
      } else if (name && name === 'questionsComplexity') { // 试题库 --题目难易程度
        this.currQuestionsComplexityIndex = event
        localStorage.setItem('editQuesQuestionsComplexity', this.questionsComplexityList[this.currQuestionsComplexityIndex].dictCode)
        this.getQuestionList(false)
      } else if (name && name === 'questionsSort') { // 试题库 --排序
        this.currQuestionsSortIndex = event
        this.getQuestionList(false)
      }
    },
    selectChangeTime: function(name, event) {
      this.queryTestPapers()
    },
    /** 获取 题目 难易程度 数组 */
    getQuestionsComplexityList: function() {
      this.currQuestionsComplexityIndex = 0
      this.questionsComplexityList = [
        { dictCode: '', dictValue: '全部' }
        // {dictCode: 1, dictValue: '选择题'},
        // {dictCode: 2, dictValue: '简答题'},
        // {dictCode: 3, dictValue: '判断题'}
      ]
      this.$api.questionbank.getQuestionsComplexity().then(res => {
        if (res.data && res.data.length > 0) {
          const questionsComplexityArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < questionsComplexityArr.length; i++) {
            this.questionsComplexityList.push(questionsComplexityArr[i])
          }
          if (localStorage.getItem('editQuesQuestionsComplexity')) {
            const indexc = this.findNameByArr(this.questionsComplexityList, localStorage.getItem('editQuesQuestionsComplexity'), 'dictCode')
            if (indexc > -1) {
              this.currQuestionsComplexityIndex = indexc
            }
          }
        }
      })
      // this.getQuestionList(false)
    },
    /** 点击 题型  */
    selecQuestionsType: function(index) {
      this.currQuestionsTypeIndex = index
      localStorage.setItem('editQuesQuestionsType', this.questionsTypeList[this.currQuestionsTypeIndex].dictCode)
      this.getQuestionList(false)
    },
    /** 获取 题型 数组 */
    getQuestionsTypeList: function() {
      this.currQuestionsTypeIndex = 0
      this.questionsTypeList = [
        { dictCode: '', dictValue: '全部' }
        // {dictCode: 1, dictValue: '选择题'},
        // {dictCode: 2, dictValue: '简答题'},
        // {dictCode: 3, dictValue: '判断题'}
      ]
      this.$api.questionbank.getQuestionsType().then(res => {
        if (res.data && res.data.length > 0) {
          const questionsTypeArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < questionsTypeArr.length; i++) {
            this.questionsTypeList.push(questionsTypeArr[i])
          }
          if (localStorage.getItem('editQuesQuestionsType')) {
            const indexp = this.findNameByArr(this.questionsTypeList, localStorage.getItem('editQuesQuestionsType'), 'dictCode')
            if (indexp > -1) {
              this.currQuestionsTypeIndex = indexp
            }
          }
        }
      })
      // this.getQuestionList(false)
    },
    /** 点击章节  */
    selectChapters: function(index) {
      this.currChaptersIndex = index
      localStorage.setItem('editQuesChaptersId', this.chaptersList[this.currChaptersIndex].chapterId)
      localStorage.setItem('editQuesQuestionsId', '')
      localStorage.setItem('editQuesQuestionsScrollTop', '')
      // this.getQuestionList(false)
      if (this.activeTabName && this.activeTabName === 'second') {
        this.queryTestPapers(false)
      } else {
        this.getQuestionList(false)
      }
    },
    /** 获取 章节  数组 */
    getChaptersList: function(isOnce = false) {
      /* this.chaptersList = [
        {chapterId: '', chapterName: '全部'},
        {chapterId: 1, chapterName: '第一章&nbsp;面向对象思想(1)'},
        {chapterId: 2, chapterName: '第二章&nbsp;面向对象思想(1)'},
        {chapterId: 3, chapterName: '第三章&nbsp;面向对象思想(1)'},
        {chapterId: 4, chapterName: '第四章&nbsp;面向对象思想(1)'}
      ] */
      this.currChaptersIndex = 0
      this.chaptersList = []
      // this.chaptersList = [{chapterName: '全部', chapterId: ''}]
      // 查询出所有技术信息
      const data = {
        subjectId: this.subjectsList[this.currSubjectsIndex].subjectId
      }
      if (!data.subjectId) {
        if (this.activeTabName && this.activeTabName === 'second') {
          this.queryTestPapers(false)
        } else {
          this.getQuestionList(false)
        }
        // this.getQuestionList(false, isOnce)
        return false
      }
      this.$api.perseverancePlate.listChapters(data).then(res => {
        if (res.data && res.data.length > 0) {
          const chaptersArr = res.data
          this.chaptersList.push({ chapterName: '全部', chapterId: '' })
          // 技术类型中添加全部类型
          for (let i = 0; i < chaptersArr.length; i++) {
            this.chaptersList.push(chaptersArr[i])
          }
          if (localStorage.getItem('editQuesChaptersId') && localStorage.getItem('editQuesChaptersId') !== undefined) {
            const indexc = this.findNameByArr(this.chaptersList, localStorage.getItem('editQuesChaptersId'), 'chapterId')
            if (indexc > -1) {
              this.currChaptersIndex = indexc
            }
          }
        }
      })
      if (this.activeTabName && this.activeTabName === 'second') {
        this.queryTestPapers(false, isOnce)
      } else {
        this.getQuestionList(false)
      }
      // this.getQuestionList(false, isOnce)
    },
    /** 点击课程 技术 */
    selectSubjects: function(index) {
      this.currSubjectsIndex = index
      if (this.currSubjectsIndex > 0) {
        this.isShowChapter = true
      }
      localStorage.setItem('editQuesSubjectId', this.subjectsList[this.currSubjectsIndex].subjectId)
      this.currChaptersIndex = 0
      localStorage.setItem('editQuesChaptersId', '')
      localStorage.setItem('editQuesQuestionsId', '')
      localStorage.setItem('editQuesQuestionsScrollTop', '')
      // this.getQuestionList(false)
      this.getChaptersList()
    },
    /** 获取 课程 技术 数组 */
    getSubjectsList: function(isOnce = false) {
    //   this.subjectsList = [
    //     {subjectId: '', subjectName: '全部'},
    //     {subjectId: 1, subjectName: 'java'},
    //     {subjectId: 2, subjectName: 'vue'},
    //     {subjectId: 3, subjectName: 'javascript'},
    //     {subjectId: 4, subjectName: 'springboot'}
    //   ]

      this.currSubjectsIndex = 0
      this.subjectsList = [{ subjectName: '全部', subjectId: '', subjectLogo: '' }]
      // 查询出所有技术信息
      const data = {
        majorId: this.technosphereList[this.currTechnospherIndex].majorId
      }
      this.$api.perseverancePlate.listSubjects(data).then(res => {
        if (res.data && res.data.length > 0) {
          const subjectsArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < subjectsArr.length; i++) {
            this.subjectsList.push(subjectsArr[i])
          }
          if (localStorage.getItem('editQuesSubjectId')) {
            const indexs = this.findNameByArr(this.subjectsList, localStorage.getItem('editQuesSubjectId'), 'subjectId')
            if (indexs > -1) {
              this.currSubjectsIndex = indexs
            }
          }
        }
        this.getChaptersList(isOnce)
      }).catch(() => {
        this.getChaptersList(isOnce)
      })
      // this.getQuestionList(false)

      // this.getChaptersList()
    },
    /** 点击职业路径 分类 */
    selectTechnospher: function(index) {
      this.currTechnospherIndex = index
      localStorage.setItem('editQuesMajorId', this.technosphereList[this.currTechnospherIndex].majorId)
      this.currSubjectsIndex = 0
      localStorage.setItem('editQuesSubjectId', '')
      this.currChaptersIndex = 0
      localStorage.setItem('editQuesChaptersId', '')
      localStorage.setItem('editQuesQuestionsId', '')
      localStorage.setItem('editQuesQuestionsScrollTop', '')
      // this.getQuestionList(false)
      this.getSubjectsList()
    },
    /** 获取 职业路径 分类 数组 */
    getTechnosphereList: function() {
    //   this.technosphereList = [
    //     {majorId: '', majorName: '全部'},
    //     {majorId: 1, majorName: 'java开发'},
    //     {majorId: 2, majorName: '前端开发'},
    //     {majorId: 3, majorName: '前端开发'},
    //     {majorId: 4, majorName: '前端开发'}
    //   ]
      this.currTechnospherIndex = 0
      this.technosphereList = [{ majorName: '全部', majorId: '' }]
      // 查询出所有分类信息
      this.$api.testcenter.getMajor().then(res => {
        if (res.data && res.data.length > 0) {
          const technosphereArr = res.data
          // 分类类型中添加全部类型
          for (let i = 0; i < technosphereArr.length; i++) {
            this.technosphereList.push(technosphereArr[i])
          }
          if (localStorage.getItem('editQuesMajorId')) {
            const indexm = this.findNameByArr(this.technosphereList, localStorage.getItem('editQuesMajorId'), 'majorId')
            if (indexm > -1) {
              this.currTechnospherIndex = indexm
            }
          }
        }
        this.getSubjectsList(true)
      }).catch(() => {
        this.getSubjectsList(true)
      })
      // this.getQuestionList(false)
      // this.getSubjectsList()
    },
    /** 根据 data 对比 arr数组中与name元素 相等  的 下标 */
    findNameByArr: function(arr, data, name) {
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
    /** 返回 */
    toback: function() {
      // localStorage.setItem('editQuesMajorId', '')
      // localStorage.setItem('editQuesSubjectId', '')
      // localStorage.setItem('editQuesChaptersId', '')
      // localStorage.setItem('editQuesQuestionsType', '')
      // localStorage.setItem('editQuesQuestionsComplexity', '')

      localStorage.removeItem('editQuesMajorId')
      localStorage.removeItem('editQuesSubjectId')
      localStorage.removeItem('editQuesChaptersId')
      localStorage.removeItem('editQuesQuestionsType')
      localStorage.removeItem('editQuesQuestionsComplexity')
      localStorage.removeItem('editQuesQuestionsTab')

      this.$router.push('/begin-class')
    },

    // ===================================================== 试卷库相关接口 =================================================================
    /**
     * 开始考试
     */
    startExamination(value) {
      localStorage.setItem('editQuesQuestionsTab', 'second')
      localStorage.setItem('paperIdByStartExamination', value)
      this.$router.push('/question-bank-center/test-question-write')

      // this.paperId = value
      // this.activeState = 1
    },

    /**
     * 考试结束返回试题库
     */
    getToQuestionBank() {
      this.activeState = 0
    }

  }
}
</script>

<style scoped>
    .test-question-bank-pages{
      /* height: 800px; */
        /* height: calc(100vh - 50px - 100px - 100px); */
        box-sizing: border-box;
        width: 1200px;
        margin: 0 auto;
        padding-bottom: 20px;
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
    .test-question-tabs-wrapper{
      /* height: calc(100% - 100px); */
      /* height: 100%; */
      width: 100%;
      margin-top: -10px;
    }
    .test-question-tabs-wrapper .test-question-tabs-item{
      width: 100%;
      /* height: 100%; */
    }
    .test-question-content-wrapper{
        display: flex;
        justify-content: space-between;
        position: relative;
        /* height: 100%; */
        /* height: calc(100% - 60px); */
    }
    .test-question-left,
    .test-question-right{
        /* height: 100%; */
        box-sizing: border-box;
        height: calc(100vh - 80px + 105px);
        transition: all 1s;
    }
    .test-question-right-noscroll{
      height: fit-content;
      /* min-height: calc(100vh - 80px + 105px); */
    }
    .test-question-left{
        width: 25%;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
        border-radius: 5px;
        background-color: #fff;
        border: 1px solid #007bff;
        /* height: auto !important; */
    }
    .test-question-right{
        width: 75%;
        padding: 0 0 0 15px;
        /* height: auto; */
        /* height: 800px; */
    }
    .test-question-left-title{
        cursor: pointer;
        background-color: #007bff;
        color: #fff;
        width: 100%;
        /* width: 300px; */
        transition: all 1s;
        padding: 10px 0;
        border-radius: 5px 5px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }
    .test-question-left-title .test-question-left-title-item{
      width: 50%;
       transition: all 1s;
    }
    .test-question-left-list{
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%;
        /* width: 300px; */
        transition: all 1s;
        height: calc(100% - 40px);
        overflow-y: scroll;
        /* height: auto; */

        position: relative;
        overflow-x: hidden;
    }
    .test-question-left-list p{
        text-align: left;
        width: 100%;
        margin:10px 0 10px 0;
        font-weight: 700;
    }
    .technology-field-nav{
        display: flex;
        flex-wrap: wrap;
    }
    .technology-field-nav li{
       padding: 4px 7px;
    }
    /* .technology-field-nav li+li{
        margin-left: 2px;
    } */
    .technology-field-nav li:hover{
      color: #FF740E;
    }
    .nav-clicked-type{
        border-radius: 4px;
        background-color:  #007bff;
        color: #ffffff !important;
        font-weight: bold;
        /* padding: 5px; */
    }
    .chapters-field-nav li{
        width: 100%;
        text-align: left;
    }
    .chapters-field-nav .nav-clicked-type{
        background-color:  inherit;
        color:  #007bff !important;
    }
    .test-question-right-header{
        width: 100%;
        background-color: #fff;
        margin-bottom: 15px;
        padding: 0 15px;
        box-sizing: border-box;
        /* box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px; */
        border-radius: 6px;
    }
    .test-question-right-center{
        height: calc(100% - 90px - 15px);
        /* height: 800px; */
        width: 100%;
        overflow-y: scroll;
        padding-right: 4px;
        box-sizing: border-box;
    }
    .test-question-right-center-noscroll{
        height: fit-content;
        overflow-y: auto;
        /* min-height: calc(100vh - 80px - 90px - 15px); */
    }
    .quesList{
      min-height: calc(100vh - 80px - 90px - 15px - 146px);
    }
    .test-question-right-header-top{
        display: flex;
        align-content: center;
        justify-content: space-between;
        line-height: 50px;
        height: 50px;
        /* padding: 0 15px; */
    }
    .search-input{
      width: 130px;
      margin-left: 5px;
    }
    .search-input-paper{
      width: 500px;
    }
    .test-question-right-header-top-nums span{
        font-size: 16px;
        font-weight: bolder;
        margin: 0 5px;
    }
    .test-question-right-header-top-btn,
    .test-question-right-header-top-btn2,
    .papers_list_btn_start{
        color: #fff;
        cursor: pointer;
        padding: 0 12px;
        display: inline-block;
        line-height: 25px;
        border-radius: 4px;
        height: 25px;
        margin-top: 12.5px;
    }
    .test-question-right-header-top-btn{
      background-color: #fd7512;
       /* border-radius: 4px 0 0 4px; */
    }
    .test-question-right-header-top-btn2{
      background-color: #007bff;
      margin-left: 10px;
    }
    .test-question-right-header-top-btn:hover{
        background-color: #fd7512;
        opacity: 0.5;
    }
    .test-question-right-header-top-btn2:hover{
        background-color: #007bff;
        opacity: 0.5;
    }
    .test-question-right-header-bottom{
        display: flex;
        align-content: center;
        justify-content: space-between;
        /* padding: 0 15px 10px; */
        padding: 0 0px 10px;
        height: 40px;
        /* line-height: 40px; */
    }
    .test-question-right-header-bottom-wrapper{
        display: flex;
        align-items: center;
    }
    .test-question-right-header-bottom-wrapper-margin{
      margin-right: 25px;
    }
    .test-question-right-header-bottom-wrapper .el-radio{
        margin-right: 10px;
    }
    .test-question-right-header-bottom-wrapper label{
        margin-bottom: 0;
    }
    .test-question-right-header-bottom-type{
        padding: 4px 6px;
    }
    .test-question-right-header-bottom-select{
        width: 80px;
        margin-right: 5px;
    }
    .test-question-right-header-bottom-select-sort{
        width: 100px;
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

    .my-teaching-nav{
      /* min-height: 50px !important; */
      margin: 20px auto;
      background-color: #fff;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
      padding-bottom: 20px;
    }
    /* 返回 */
  .classroom-back{
    width: 100%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }

  /* ============试卷库  样式  begin ================== */
  .papers_list_wrapper{
    display: flex;
    align-items: center;
    padding: 15px 10px !important;
  }
  .papers_list_img_wrapper{
    /* width: 50px;
    height: 60px;
    margin-right: 10px; */

    position: relative;
    width: 50px;
    height: 60px;
    padding: 35px 0 15px 15px;
    float: left;
    margin-right: 15px;
    background: linear-gradient(to top, rgba(204, 204, 204, .5) 1%, rgba(204, 204, 204, .1), #ffffff);
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px #cccccc;
    font-size: .857em;
    background-size: cover;
    white-space: nowrap;
    font-weight: 700;
    color: rgba(0, 155, 255, 1);

  }
  .papers_list_img_wrapper::before{
    content: '';
    display: block;
    width: 15px;
    height: 15px;
    background: linear-gradient(-130deg, #ffffff 10px, rgba(0, 155, 255, .7) 0);
    position: absolute;
    top: 0;
    right: 0;
  }
  .papers_list_img_wrapper::after{
    content: '—';
    color: #cccccc;
    font-weight: 700;
    font-size: 1.142em;
    display: block;
    width: 20px;
    height: 2px;
    background: #cccccc;
    position: absolute;
    top: 15px;
    left: 5px;
    border-radius: 20px;
  }
  .papers_list_img_wrapper img{
    width: 100%;
    height: 100%;
  }
  .papers_list_wrapper .papers_list_name_wrapper{
    width: 75%;
  }
  .papers_list_wrapper .papers_list_details{
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
  }
  .papers_list_wrapper .papers_list_details div{
    padding-right: 30px;
    box-sizing: border-box;
  }
  .papers_list_wrapper .papers_list_name{
    font-size: 1.285em;
    padding-bottom: 5px;
    box-sizing: border-box;
  }
  .papers_list_btn_start{
    background-color: #007bff;
    margin-left: 10px;
    height: auto;
    padding: 4px 10px;
  }
  .papers_list_btn_start:hover{
    background-color: #007bff;
    opacity: 0.5;
  }
  .papers-selects-time{
    width: 100px;
    margin-right: 5px;
  }
   /* ============试卷库  样式  end ================== */

   .classroom-all{
      width: 1200px;
      margin:20px auto;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
      background: white
    }
    /* --------------查询区域开始------------- */
    .technology-nav-top, .technology-nav-bottom{
      display: flex;
      justify-content: left;
    }
    .technology-nav-top{
      margin: 0 20px;
      border-bottom: 1px solid #D3D3D3;
    }
    .technology-nav-bottom{
      margin: 0 20px;
    }
    .technology-type{
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 13px;
    }
    .technology-field-nav, .technology-label-nav{
      width: 95%;
      padding: 10px 10px;
      box-sizing:border-box;
    }
    .technology-field-nav li:hover,
    .test-question-right-header-bottom-type:hover{
      color: #FF740E;
    }
    .technology-label-nav li:hover{
      color: #FF740E;
    }
    .technology-nav li, .category-nav li{
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border-radius: 5px;
      /* font-size: 13px; */
      margin-left: 25px;
      cursor: pointer;
    }
    .active-type{
      background-color: #007bff;
      color: #ffffff !important;
      font-weight: bold;
    }
    .category-nav{
      display: flex;
      justify-content: space-between;
      padding: 10px 10px 10px 0;
    }
    .category-nav-left select{
      padding: 2px 20px;
      height: 25px;
      line-height: 25px;
      font-size: 13px;
      margin-left: 18px;
      margin-top: 2px;
    }
    .category-nav-left{
      display: flex;
      justify-content: left;
    }
    .category-nav-left-ul li:hover{
      color: #FF740E;
    }
    .category-nav-right span{
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      padding-right: 10px;
      font-size: 20px;
    }
    .active-button{
      color: #007bff;
    }
    /* --------------查询区域结束------------- */

    .classroom-all-fixed{
      position: fixed;
      left: 17%;
      top: 50px;
    }
    .quesCompoundList{
      padding-bottom: 10px;
    }
    .quesCompoundList > .list-item{
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    /* 左侧章节收缩按钮样式 */
    .shrinkage-btn{
      position: absolute;
      top: 50vh;
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
      background-color: #007bff;
    }
</style>
