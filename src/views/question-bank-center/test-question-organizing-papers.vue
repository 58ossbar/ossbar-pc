<!-- 题库的 组卷选择 页面 -->
<template>
  <div class="backgroundColorGrey ">
    <header-nav :current-index="2" />

    <!-- 导航栏 begin  -->
    <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
      <div class="location">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer">
            评测中心
          </li>
          <li class="localtion-item" style="cursor: pointer" @click="toback('/question-bank-center/test-question-bank')">
            试卷库
          </li>
          <li class="localtion-item">
            <span style="color: #959da0">{{ type }}</span>
          </li>
        </ul>
      </div>
      <div class="question-back">
        <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/question-bank-center/test-question-bank')"/>
        <span @click="toback('/question-bank-center/test-question-bank')">返回</span>
      </div>
    </div>
    <!-- 导航栏end -->
    <div class="test-question-bank-pages fontSize14">
      <!-- 内容区域 begin -->
      <div class="test-question-content-wrapper">
        <!-- 左边 选择项 begin -->
        <div class="test-question-left ">
          <div class="test-question-left-title justify-content-center">
            选择
          </div>

          <div class="test-question-left-list">
            <p>职业路径：</p>
            <ul class=" technology-field-nav">
              <li v-for="(item0, index0) in technosphereList" :class="{'nav-clicked-type':dataForm.majorId === item0.majorId}" :key="index0" class="mouse_style" @click="selectTechnospher(index0)">{{ item0.majorName }}</li>
            </ul>
            <p>课程体系：</p>
            <ul class=" technology-field-nav">
              <el-tree
                ref="multipleTable"
                :data="subjectsList"
                :props="subjectsTreeProps"
                :load="loadNodeBySubject"
                :check-strictly="true"
                :check-on-click-node="true"
                node-key="keyId"
                lazy
                class="chapters-field-nav-tree"
                show-checkbox
                @check="getSubjectsTreeList"/>
            </ul>
          </div>
        </div>
        <!-- 左边 选择项 end -->
        <!-- 右边 选择项 begin -->
        <div class="test-question-right">
          <div class="test-question-right-inner">
            <div class="test-question-right-top">
              <el-select v-model="organizationMode" size="mini" placeholder="请选择" class="test-question-right-top-select" @change="organizationModeChange">
                <el-option
                  v-for="item in organizationModeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </div>
            <div v-show="organizationMode === '0'" class="test-question-right-tables">
              <el-table ref="mutiple" :data="chapterTableList" border height="100%" row-key="keyId" default-expand-all style="width: 100%" >
                <el-table-column :show-overflow-tooltip="true" label="已选择">
                  <template slot-scope="scope">
                    <i class="el-icon-close cursor del-icon" @click="delTopic(scope.row)"/>
                    <span class="topic-name">{{ scope.row.subjectName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="topicNum" label="题目数" width="70"/>
                <el-table-column v-for="(itemt, indext) in tableColumnList" :label="itemt.dictValue" :key="indext" width="110">
                  <template slot-scope="scope" >
                    <!-- <el-input type="number" v-model="scope.row.totalJudgeInput" placeholder="请输入内容" min="0" :max="scope.row.totalJudge" :oninput="'if(value>' + scope.row.totalJudge + ')value=' + scope.row.totalJudge" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>/ -->
                    <input v-model="scope.row[itemt.formName + 'Input']" :oninput="'if(value>' + scope.row[itemt.formName] + ')value=' + scope.row[itemt.formName]" type="number" class="topicInput" min="0" max="10" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                    {{ scope.row[itemt.formName] }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-show="organizationMode === '1'" class="test-question-right-tables">
              <el-collapse v-if="chapterTableList && chapterTableList.length > 0" v-model="activeNames" class="selecyQuesWrap">
                <el-collapse-item v-for="(itemcp, indexcp) in chapterTableList" :key="itemcp.keyId" :name="itemcp.keyId" :id="itemcp.keyId" :disabled="!itemcp.questionList || itemcp.questionList.length < 1">
                  <template slot="title">
                    <i class="el-icon-close cursor del-icon" @click="delTopic(itemcp)"/>
                    <span class="select-name text-ellipsis">{{ itemcp.subjectName }}</span>
                    <span v-if="!itemcp.questionList || itemcp.questionList.length < 1" class="select-no-name">暂无题目</span>
                  </template>
                  <div class="select-list-wrap">
                    <el-select v-model="itemcp.questionsType" size="mini" placeholder="请选择题型" class="select-list-item" @change="getQuestionList(false, itemcp)">
                      <el-option v-for="(item0,index0) in questionsTypeList" :key="index0" :label="item0.dictValue" :value="item0.dictCode"/>
                    </el-select>
                    <el-select v-model="itemcp.questionsComplexity" size="mini" placeholder="请选择难易程度" class="select-list-item" @change="getQuestionList(false, itemcp)">
                      <el-option v-for="(item0,index0) in questionsComplexityList" :key="index0" :label="item0.dictValue" :value="item0.dictCode"/>
                    </el-select>
                    <el-select v-model="itemcp.sortBy" size="mini" placeholder="请选择排序" class="select-list-item" @change="getQuestionList(false, itemcp)">
                      <el-option v-for="(item0,index0) in questionsSortList" :key="index0" :label="item0.dictValue" :value="index0"/>
                    </el-select>
                    <!-- @change="getQuestionList(false, itemcp)"  -->
                    <el-input v-model="itemcp.questionsName" class="select-list-item" placeholder="搜索题目名称" size="mini" suffix-icon="el-icon-search" @keyup.enter.native="getQuestionList(false, itemcp)" @input="questionInputClick"/>
                  </div>
                  <cb-test-question-list :question-list-init="itemcp.questionList" :questions-type-list-init="questionsTypeList" :questions-complexity-list-init="questionsComplexityList" pagers-type="2" @checkboxChangeBack="checkboxChangeBack($event, indexcp)"/>
                  <pager :page-size-prop="itemcp.pageSizeProp" :curr-page="itemcp.pageNum" :total-page="itemcp.pages" align="center" @changeIndex="(value, size) => changePaperIndex(value, size, itemcp)"/>
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- 提交按钮 begin -->
            <div class="test-question-right-btns" >
              <button type="button" class="btn btn-outline-primary" @click="toPreview">{{ isTeacher?'进入组卷':'开始答题' }}</button>
              <button type="button" class="btn btn-outline-secondary" @click="toback('/question-bank-center/test-question-bank')">取消</button>
            </div>
            <!-- 提交按钮 end -->
          </div>
        </div>
        <!-- 右边 选择项 end -->
      </div>
      <!-- 内容区域 end -->
    </div>
    <!-- <footer-nav></footer-nav> -->
  </div>
</template>
<script>
import { toast, getUserInfo } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import TestQuestionList from '@/components/cb-creator-question/test-question-list'
import Pager from '@/components/pager'
export default {
  name: 'TestQuestionOrganizingPapers',
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'pager': Pager,
    'cb-test-question-list': TestQuestionList
  },
  data() {
    return {
      type: '组卷',
      dataForm: {
        majorId: '',
        subjectId: '',
        chaptersId: ''
      },
      currSubjectsIndex: 0, // 当前选中的 课程 技术 数组 的 下标
      chaptersTreeProps: {
        children: 'children',
        label: 'chapterName'
      },
      subjectsTreeProps: {
        children: 'children',
        label: 'subjectName'
      },
      organizationMode: '0',
      organizationModeList: [
        { label: '随机选题', value: '0' },
        { label: '手动选题', value: '1' }
      ],
      questionsTypeList: [],
      questionsComplexityList: [],
      questionsSortList: [
        { dictCode: '1', dictValue: '最近新增' },
        { dictCode: '2', dictValue: '组卷率高' },
        { dictCode: '3', dictValue: '正确率高' },
        { dictCode: '4', dictValue: '收藏率高' }
      ],
      activeNames: [],
      tableColumnList: [], // 表格的列 数组
      isTeacher: getUserInfo().isTeacher, // 是否是老师
      isShowChapter: false, // 是否显示章节
      technosphereList: [], // 职业路径 分类 数组
      subjectsList: [], // 课程 技术 数组
      chaptersList: [], // 章节 数组
      chapterTableList: [], // 已选章节题目数组
      rightSelectedQuesList: []
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    localStorage.removeItem('organizingPapersDatas')
    localStorage.removeItem('organizingPapersManualDatas')
    if (localStorage.getItem('editQuesSubjectId')) {
      this.dataForm.subjectId = localStorage.getItem('editQuesSubjectId')
    }
    if (localStorage.getItem('editQuesChaptersId')) {
      this.dataForm.chaptersId = localStorage.getItem('editQuesChaptersId')
    }
    this.getQuestionsTypeList()
    this.getQuestionsComplexityList()
    if (localStorage.getItem('editQuesMajorId')) {
      this.dataForm.majorId = localStorage.getItem('editQuesMajorId')
      this.getTechnosphereList(true)
    } else {
      this.getTechnosphereList()
    }
  },
  methods: {
    questionInputClick() {
      this.$forceUpdate()
    },
    checkboxChangeBack(event, index) {
      const obj = this.chapterTableList[index].questionList[event.index]
      this.chapterTableList[index].questionList[event.index].checked = event.checked
      if (event.checked) {
        this.rightSelectedQuesList.push(obj.questionsId)
      } else {
        for (let i = (this.rightSelectedQuesList.length - 1); i >= 0; i--) {
          if (obj.questionsId === this.rightSelectedQuesList[i]) {
            this.rightSelectedQuesList.splice(i, 1)
            break
          }
        }
      }
    },
    // 分页更新数据
    changePaperIndex(value, size, obj) {
      obj.pageNum = value
      obj.pageSize = size
      this.getQuestionList(true, obj)
      document.getElementById(obj.keyId).scrollIntoView()
    },
    organizationModeChange: function() {
      this.$refs.multipleTable.setCheckedKeys([])
      this.chapterTableList = []
      this.rightSelectedQuesList = []
    },
    /** 获取 题型 数组 */
    getQuestionsTypeList: function() {
      this.tableColumnList = []
      this.questionsTypeList = []
      this.$api.questionbank.getQuestionsType().then(res => {
        if (res.code === 0 && res.data && res.data.length > 0) {
          this.questionsTypeList = [ ...res.data ]
          this.questionsTypeList.unshift({ dictCode: '', dictValue: '全部题型' })
          res.data.forEach((item, index) => {
            const dictCode = item.dictCode
            // eslint-disable-next-line eqeqeq
            item.formName = (dictCode == '1') ? ('totalSingleChose') : ((dictCode == '2') ? ('totalMultipleChose') : ((dictCode == '3') ? ('totalJudge') : ((dictCode == '4') ? ('totalShortAnswer') : ((dictCode == '5') ? ('totalGapFilling') : ((dictCode == '6') ? ('totalComposite') : (''))))))
            this.tableColumnList.push(item)
          })
        }
      })
    },
    /** 获取 题目 难易程度 数组 */
    getQuestionsComplexityList: function() {
      this.questionsComplexityList = []
      this.$api.questionbank.getQuestionsComplexity().then(res => {
        this.questionsComplexityList = res.data || []
        this.questionsComplexityList.unshift({ dictCode: '', dictValue: '全部难易程度' })
      })
    },
    /** 显示或者隐藏章节 */
    isShowChapterTap: function() {
      if (this.subjectsList && this.subjectsList[this.currSubjectsIndex] && this.subjectsList[this.currSubjectsIndex].subjectName && this.currSubjectsIndex > 0) {
        this.isShowChapter = !(this.isShowChapter)
      } else {
        this.isShowChapter = false
      }
    },
    /** 去预览页面 */
    toPreview: function() {
      if (this.organizationMode === '1') {
        if (!this.rightSelectedQuesList || (this.rightSelectedQuesList && this.rightSelectedQuesList.length < 1)) {
          toast('请从左侧选择要考察的课程选择题目')
          return false
        }
        localStorage.setItem('organizingPapersManualDatas', JSON.stringify(this.rightSelectedQuesList))
        this.$router.push('/question-bank-center/test-question-organizing-papers-preview')
        return false
      }
      if (!this.chapterTableList || (this.chapterTableList && this.chapterTableList.length < 1)) {
        toast('请从左侧选择要考察的章节')
        return false
      }
      let allNum = 0
      for (let i = 0; i < this.chapterTableList.length; i++) {
        allNum = allNum + parseInt(this.chapterTableList[i].totalGapFillingInput) + parseInt(this.chapterTableList[i].totalJudgeInput) + parseInt(this.chapterTableList[i].totalMultipleChoseInput) + parseInt(this.chapterTableList[i].totalShortAnswerInput) + parseInt(this.chapterTableList[i].totalSingleChoseInput) + parseInt(this.chapterTableList[i].totalCompositeInput)
      }
      if (allNum <= 0) {
        toast('请填写题目数量')
        return false
      }
      const arr = []
      let subjectNum = 0
      let chapterNum = 0
      for (let index = 0; index < this.chapterTableList.length; index++) {
        const obj = {
          // chapterId: this.chapterTableList[index].chapterId,
          singleChoiceNum: this.chapterTableList[index].totalSingleChoseInput,
          multipleChoiceNum: this.chapterTableList[index].totalMultipleChoseInput,
          judgeChoiceNum: this.chapterTableList[index].totalJudgeInput,
          completionNum: this.chapterTableList[index].totalGapFillingInput,
          shortAnswerNum: this.chapterTableList[index].totalShortAnswerInput,
          compoundNum: this.chapterTableList[index].totalCompositeInput,
          type: this.chapterTableList[index].type
        }
        if (obj.type && obj.type === '1') {
          subjectNum++
          obj.subjectId = this.chapterTableList[index].keyId
        } else if (obj.type && obj.type === '2') {
          chapterNum++
          obj.chapterId = this.chapterTableList[index].keyId
        }
        arr.push(obj)
      }
      localStorage.setItem('organizingPapersDatas', JSON.stringify(arr))
      localStorage.setItem('organizingPapersReSelectDatas', JSON.stringify({ subjectNum: subjectNum, chapterNum: chapterNum }))
      if (this.isTeacher) {
        this.$router.push('/question-bank-center/test-question-organizing-papers-preview')
      } else {
        // localStorage.setItem('paperIdByStartExamination', value)
        this.$router.push('/question-bank-center/test-question-write')
      }
    },
    // 删除题目类型选择
    delTopic(obj) {
      let result = true
      if (this.chapterTableList && this.chapterTableList.length > 0) {
        for (let index = (this.chapterTableList.length - 1); index >= 0; index--) {
          if (this.chapterTableList[index].keyId === obj.keyId && obj.type && obj.type === '1') {
            if (this.chapterTableList[index].questionList && this.chapterTableList[index].questionList.length > 0 && this.rightSelectedQuesList && this.rightSelectedQuesList.length > 0) {
              for (let i = 0; i < this.chapterTableList[index].questionList.length; i++) {
                for (let j = (this.rightSelectedQuesList.length - 1); j >= 0; j--) {
                  if (this.chapterTableList[index].questionList[i].questionsId === this.rightSelectedQuesList[j]) {
                    this.rightSelectedQuesList.splice(j, 1)
                    break
                  }
                }
              }
            }
            // 删除当前选中的 课程节点
            this.chapterTableList.splice(index, 1)
            if (this.activeNames.includes(obj.keyId)) {
              this.activeNames.splice((this.activeNames.indexOf(obj.keyId)), 1)
            }
            this.$refs.multipleTable.setChecked(obj.keyId, false, false)
            result = false
            // 取消当前选中的 课程节点 下面的 子章节  的 选中
            const getCheckedNodes = this.$refs.multipleTable.getCheckedNodes()
            if (getCheckedNodes && getCheckedNodes.length > 0) {
              for (let index1 = (getCheckedNodes.length - 1); index1 >= 0; index1--) {
                if (getCheckedNodes[index1].subjectId === obj.subjectId) {
                  this.$refs.multipleTable.setChecked(getCheckedNodes[index1].keyId, false, false)
                }
              }
            }
            break
          }
          if (this.chapterTableList[index].children && this.chapterTableList[index].children.length > 0 && obj.type && obj.type === '2') {
            const children = this.chapterTableList[index].children
            for (let index1 = (children.length - 1); index1 >= 0; index1--) {
              if (children[index1].keyId === obj.keyId) {
                this.chapterTableList[index].children.splice(index1, 1)
                this.$refs.multipleTable.setChecked(obj.keyId, false, false)
                result = false
                break
              }
            }
          }
        }
      }
      return result
    },
    /** 点击课程 技术 树 */
    getSubjectsTreeList: function(tableObj, type, childrenObj) {
      const obj = JSON.parse(JSON.stringify(tableObj))
      const isPush = this.delTopic(obj)
      if (isPush) {
        if (this.organizationMode === '1') {
          obj.pageSize = 10
          obj.pageSizeProp = 10
          obj.questionsType = ''
          obj.questionsComplexity = ''
          obj.sortBy = 1
          obj.questionsName = ''
          obj.questionList = []
          if (obj.type === '2') {
            const indexc = this.findNameByArr(this.subjectsList, obj.subjectId, 'keyId')
            if (indexc > -1) {
              this.$refs.multipleTable.setChecked(obj.subjectId, true, false)
              this.getSubjectsTreeList(this.subjectsList[indexc], 'childrenNoParent', obj)
            }
          } else {
            this.chapterTableList.push(obj)
            this.$forceUpdate()
            this.getQuestionList(false, obj)
          }
          return false
        }
        const params = {
          majorId: (this.dataForm && this.dataForm.majorId) ? (this.dataForm.majorId) : '',
          subjectId: obj.subjectId,
          chapterId: obj.chapterId,
          type: obj.type // 1课程 2 章节
        }
        this.$api.questionbank.teacherGenerateTestPaper(params).then(res => {
          if (res.code === 0) {
            obj.topicNum = res.data.questionsNum.totalSize
            obj.totalSingleChose = res.data.questionsNum.totalSingleChose
            obj.totalMultipleChose = res.data.questionsNum.totalMultipleChose
            obj.totalJudge = res.data.questionsNum.totalJudge
            obj.totalGapFilling = res.data.questionsNum.totalGapFilling
            obj.totalShortAnswer = res.data.questionsNum.totalShortAnswer
            obj.totalComposite = res.data.questionsNum.totalComposite
            obj.totalSingleChoseInput = '0'
            obj.totalMultipleChoseInput = '0'
            obj.totalJudgeInput = '0'
            obj.totalGapFillingInput = '0'
            obj.totalShortAnswerInput = '0'
            obj.totalCompositeInput = '0'
            if (obj.type === '2') {
              const indexs = this.findNameByArr(this.chapterTableList, obj.subjectId, 'keyId')
              if (indexs > -1) {
                this.chapterTableList[indexs].children.push(obj)
              } else {
                const indexc = this.findNameByArr(this.subjectsList, obj.subjectId, 'keyId')
                if (indexc > -1) {
                  this.$refs.multipleTable.setChecked(obj.subjectId, true, false)
                  this.getSubjectsTreeList(this.subjectsList[indexc], 'childrenNoParent', obj)
                }
              }
            } else {
              this.chapterTableList.push(obj)
              if (type && type === 'childrenNoParent' && childrenObj) {
                this.getSubjectsTreeList(childrenObj)
              }
            }
          }
        })
      }
    },
    /** 获取题目数组 */
    getQuestionList: function(isLazy, obj) {
      if (!isLazy) {
        obj.pageNum = 1
        obj.questionList = []
      }
      const params = {
        majorId: this.dataForm.majorId || '',
        subjectId: obj.subjectId,
        chaptersId: '', // obj.chapterId,
        questionsType: obj.questionsType,
        questionsComplexity: obj.questionsComplexity,
        sortBy: obj.sortBy,
        pageNum: obj.pageNum,
        pageSize: obj.pageSize,
        questionsName: obj.questionsName,
        type: obj.type // 1课程 2 章节
      }

      this.$api.questionbank.query(params).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.list && res.data.list.length > 0) {
            res.data.list.forEach(item => {
              item.showAnalysis = false
              item.checked = false
              if (this.rightSelectedQuesList && this.rightSelectedQuesList.length > 0) {
                for (let i = 0; i < this.rightSelectedQuesList.length; i++) {
                  if (item.questionsId === this.rightSelectedQuesList[i]) {
                    item.checked = true
                    break
                  }
                }
              }
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
              item.questionsComplexityName = item.questionsComplexity
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
                  itemc.questionsComplexityName = itemc.questionsComplexity
                })
              }
            })
            obj.questionList = res.data.list
            if (!this.activeNames || this.activeNames.length < 1) {
              this.activeNames.push(obj.keyId)
            }
          }

          if (res.data && res.data.pageNum) {
            obj.pageNum = res.data.pageNum
          }
          if (res.data && res.data.pageSize) {
            obj.pageSize = res.data.pageSize
          }
          if (res.data && res.data.pages) {
            obj.pages = res.data.pages
          }

          const indexs = this.findNameByArr(this.chapterTableList, obj.subjectId, 'keyId')
          if (indexs > -1) {
            this.chapterTableList[indexs] = { ...obj }
            this.$forceUpdate()
          }
        } else {
          if (res.msg) {
            toast(res.msg)
          }
        }
      }).catch((err) => {
        if (err.msg) {
          toast(err.msg)
        }
      })
    },
    /** 课程体系 树 懒加载  */
    loadNodeBySubject: function(node, resolve) {
      const data = {
        subjectId: node.data.subjectId
      }
      if (!data.subjectId) {
        return resolve([])
      }
      this.$api.perseverancePlate.listChapters(data).then(res => {
        if (res.code === 0 && res.data && res.data.length > 0) {
          const chaptersArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < chaptersArr.length; i++) {
            chaptersArr[i].type = '2'
            chaptersArr[i].subjectName = chaptersArr[i].chapterName
            chaptersArr[i].keyId = chaptersArr[i].chapterId
            chaptersArr[i].subjectId = (data.subjectId) ? (data.subjectId) : ''
          }
          return resolve(chaptersArr)
        } else {
          return resolve([])
        }
      }).catch(() => {
        return resolve([])
      })
    },
    /** 获取 章节  数组 */
    getChaptersList: function(isEdit = false) {
      if (!isEdit) {
        this.dataForm.chaptersId = ''
      }
      this.currChaptersIndex = 0
      this.chaptersList = [{ chapterName: '全部', chapterId: (this.dataForm.subjectId) ? (this.dataForm.subjectId) : '', subjectId: (this.dataForm.subjectId) ? (this.dataForm.subjectId) : '', children: [], type: '1' }]
      // 查询出所有技术信息
      const data = {
        subjectId: this.dataForm.subjectId
      }
      if (!data.subjectId) {
        return false
      }
      this.$api.perseverancePlate.listChapters(data).then(res => {
        if (res.data && res.data.length > 0) {
          const chaptersArr = res.data
          // this.chaptersList.push({chapterName: '全部', chapterId: '', children: []})
          // 技术类型中添加全部类型
          for (let i = 0; i < chaptersArr.length; i++) {
            chaptersArr[i].children = []
            chaptersArr[i].type = '2'
            chaptersArr[i].keyId = chaptersArr[i].chapterId
            chaptersArr[i].subjectId = (this.dataForm.subjectId) ? (this.dataForm.subjectId) : ''
            this.chaptersList.push(chaptersArr[i])

            this.subjectsList[this.currSubjectsIndex].children.push(chaptersArr[i])
          }
        }
      })
    },
    /** 获取 课程 技术 数组 */
    getSubjectsList: function(isEdit = false) {
      if (!isEdit) {
        this.currSubjectsIndex = 0
        this.dataForm.subjectId = ''
      }
      // let keyId = (this.dataForm.majorId)?(this.dataForm.majorId):'';
      this.subjectsList = [] // [{ subjectName: '全部', subjectId: keyId,type:'1', subjectLogo: '',keyId: keyId, chapterId: keyId ,children : []}]
      // 查询出所有技术信息
      const data = {
        majorId: this.dataForm.majorId
      }
      this.$api.perseverancePlate.listSubjects(data).then(res => {
        if (res.data && res.data.length > 0) {
          const subjectsArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < subjectsArr.length; i++) {
            subjectsArr[i].keyId = subjectsArr[i].subjectId
            subjectsArr[i].chapterId = subjectsArr[i].subjectId
            subjectsArr[i].type = '1'
            subjectsArr[i].children = []
            this.subjectsList.push(subjectsArr[i])
          }
          if (this.dataForm.subjectId && isEdit) {
            const indexs = this.findNameByArr(this.subjectsList, this.dataForm.subjectId, 'subjectId')
            if (indexs > -1) {
              this.currSubjectsIndex = indexs
            }
          }
        }
        this.getChaptersList(isEdit)
      }).catch(() => {
        this.getChaptersList(isEdit)
      })
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
    /** 点击职业路径 分类 */
    selectTechnospher: function(index) {
      this.dataForm.majorId = this.technosphereList[index].majorId
      this.dataForm.subjectId = ''
      this.currSubjectsIndex = 0
      this.dataForm.chaptersId = ''
      this.chapterTableList = []
      this.getSubjectsList()
    },
    /** 获取 职业路径 分类 数组 */
    getTechnosphereList: function(isEdit = false) {
      if (!isEdit) {
        this.dataForm.majorId = ''
      }
      this.technosphereList = [{ majorName: '全部', majorId: '' }]
      // 查询出所有分类信息
      this.$api.testcenter.getMajor().then(res => {
        if (res.data && res.data.length > 0) {
          const technosphereArr = res.data
          // 分类类型中添加全部类型
          for (let i = 0; i < technosphereArr.length; i++) {
            this.technosphereList.push(technosphereArr[i])
          }
        }
        this.getSubjectsList(isEdit)
      }).catch(() => {
        this.getSubjectsList(isEdit)
      })
    },
    /** 返回 */
    toback: function(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
    .test-question-bank-pages{
      /* height: 900px; */
        /* height: calc(100vh - 100px ); */
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
    }
    .test-question-left{
        width: 25%;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
        border-radius: 5px;
        background-color: #fff;
        border: 1px solid #007bff;
        height: 800px;
        margin-bottom: 20px;
    }
    .test-question-right{
        width: 75%;
        padding: 0 0 0 15px;
        min-height: 400px;
        height: calc(100vh - 160px);
    }
    .test-question-right-inner{
      background-color: #fff;
      width: 100%;
      height: 100%;
      padding: 15px;
      box-sizing: border-box;
      /* box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px; */
      border-radius: 6px;
    }
    /* .test-question-left-title{
        cursor: pointer;
        background-color: #007bff;
        color: #fff;
        width: 100%;
        padding: 10px 0;
        border-radius: 5px 5px 0 0;
    } */
    .test-question-left-list{
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%;
        height: calc(100% - 41px);
        overflow-y: scroll;
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
        background-color:  #007bff ;
        color: #ffffff !important;
        font-weight: bold;
        /* padding: 5px; */
    }
    .chapters-field-nav-tree{
      width: 100%;
      margin-left: -15px;
    }
    .chapters-field-nav li{
        width: 100%;
        text-align: left;
    }
    .chapters-field-nav .nav-clicked-type{
        background-color:  inherit;
        color:  #007bff ;
    }
    .topicInput{
      width: 50%;
      border: 1px solid #ced4da;
      outline: none;
      border-radius: 2px;
    }
    .test-question-right-btns{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 10px;
    }
     .test-question-right-btns .btn{
      font-size: 14px;
      margin-right: 15px;
    }
    .test-question-right-top{
      text-align: right;
      padding-bottom: 10px;
      box-sizing: border-box;
    }
    .test-question-right-top-select{
      width: 100px;
    }
    .test-question-right-tables{
      height: calc(100% - 45px - 40px);
      width: 100%;
    }
    .test-question-left-title{
        cursor: pointer;
        background-color: #007bff;
        color: #fff;
        width: 100%;
        padding: 10px 0;
        border-radius: 5px 5px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .test-question-left-title .test-question-left-title-item{
      width: 50%;
    }
    .selecyQuesWrap{
      width: 100%;
      height: 100%;
      overflow: scroll;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .del-icon{
      cursor: pointer;
      padding-right: 5px;
      margin-left: 5px;
      color: #303133;
      box-sizing: border-box;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .select-name{
      /* color: #303133; */
      text-align: left;
      width: calc(100% - 120px);
    }
    .selecyQuesWrap .el-collapse-item /deep/ .select-no-name{
      color: #303133;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .el-collapse-item__content{
      padding: 10px;
      box-sizing: border-box;
      background-color: #f5f5f5;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .select-list-wrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      box-sizing: border-box;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .select-list-wrap .select-list-item{
      width: 20%;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .select-list-wrap .select-list-item:last-child{
      width: 38%;
    }
    .selecyQuesWrap .el-collapse-item /deep/ .pagination-box{
      padding: 10px 0 8px 0;
    }
</style>
