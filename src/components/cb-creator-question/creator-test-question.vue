<!-- 题库的 添加试题页面 主页面 组件 以及 测试活动 的 手动添加题目 的主组件 -->
<template>
  <div class="backgroundColorGrey ">
    <div class="test-question-bank-pages creator-test-question fontSize14">
      <!-- 内容区域 begin -->
      <div class="test-question-content-wrapper">
        <!-- 左边 选择项 begin  -->
        <div :class="['test-question-left',pagesType && pagesType === '0'?'':'test-question-left-activity']">
          <div :class="[pagesType && pagesType === '0'?'test-question-left-inner-questions':'test-question-left-inner']" >

            <cb-add-test-question-tree
              ref="addQuestions"
              :is-show-major-and-subjects="pagesType && pagesType === '0'"
              :questions-type-list-init="questionsTypeList"
              :questions-type-children-list-init="questionsTypeChildrenList"
              :technosphere-list-init="technosphereList"
              :questions-complexity-list-init="questionsComplexityList"
              :allow-change-chapter="allowChangeChapter"
              :allow-change-major="allowChangeMajor"
              :allow-change-subject="allowChangeSubject"
              :data-form-init="dataForm"
              :pages-type="pagesType"
              questions-name="questionsName"
              @resultChange="resultChange"/>

            <!-- 提交按钮 begin -->
            <div v-if="pagesType && pagesType === '0'" class="creator-test-question-btns" >
              <button v-show="!pagesIsEdit" type="button" class="btn btn-outline-primary" @click="toSaveByTestQuestions('continue')">保存并继续添加</button>
              <button type="button" class="btn btn-outline-primary" @click="toSaveByTestQuestions('single')">保存</button>
              <button type="button" class="btn btn-outline-secondary" @click="toback('/question-bank-center/test-question-bank')">取消</button>
            </div>
            <!-- 提交按钮 end -->
          </div>
        </div>
        <!-- 左边 选择项 end -->
        <!-- 右边 选择项 begin -->
        <div v-if="pagesType && pagesType === '0'" class="test-question-right">
          <!-- 试题列表 begin -->
          <div class="test-question-right-center">
            <cb-test-question-list
              :question-list-init="dataFormNewList"
              :questions-type-list-init="questionsTypeList"
              :questions-complexity-list-init="questionsComplexityList"/>
          </div>
          <!-- 试题列表 end -->
        </div>
        <!-- 右边 选择项 end -->
      </div>
      <!-- 内容区域 end -->
    </div>
  </div>
</template>
<script>
// 录入题目时  如果是新增 不用传 任何值，
// 如果是编辑，传的值的格式  参考 评测中心的试题库列表修改时  this.viewQuestion() 方法返回的数据格式
import { toast, confirm, loadingModal, findKeyFromObject, objectIsNotNull } from '@/utils/global'
import $ from '@/assets/jquery-vendor'
import AddTestQuestionTree from '@/components/cb-creator-question/add-test-question-tree'
import TestQuestionList from '@/components/cb-creator-question/test-question-list'
export default {
  name: 'CreatorTestQuestion',
  components: {
    'cb-add-test-question-tree': AddTestQuestionTree,
    'cb-test-question-list': TestQuestionList
  },
  props: {
    isEdit: { // 创建测试活动 的新增页 是新增还是修改
      type: Boolean,
      default: false
    },
    pagesType: { // 页面的类型 '0'是题库的新增试题页，'1'是 创建测试活动 的新增页
      type: String,
      default: '0'
    },
    isCompoundQuestion: { // 是否是 复合题
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: '添加试题',
      currQuestionsComplexityName: '', // 当前选中的 题目 难易程度 的 名称
      quesComBackColor: '', // 题目 难易程度 显示的颜色
      currQuestionsTypeName: 0, // 当前选中的 题型 数组 的 名称
      quesTypeBackColor: '', // 题型  显示的颜色

      technosphereList: [], // 职业路径 职业路径 数组
      questionsTypeList: [], // 题型 数组
      questionsTypeChildrenList: [], // 题型 数组。没有复合题
      questionsComplexityList: [], // 题目 难易程度 数组
      dataForm: {}, // 表单数据项
      dataFormNewList: [], // 表单数据项
      questionsId: '', // 试题id，如果有则为编辑
      showAnalysis: true, // 题目解析的显示隐藏

      allowChangeChapter: false, // 题目编辑的时候 时候允许编辑章节
      allowChangeMajor: false, // 题目编辑的时候 时候允许编辑课程体系
      allowChangeSubject: false, // 题目编辑的时候 时候允许编辑课程

      pagesIsEdit: false, // 是否是编辑状态
      oldQuestionsType: '', // 上一个选择的题目类型
      editValue: false
    }
  },
  computed: {
  },
  watch: {
    'isEdit': function(val) {
      if (this.pagesType && this.pagesType === '1') {
        if (val) {
          this.pagesIsEdit = true
        } else {
          this.pagesIsEdit = false
          // this.initDataForm('root')
        }
      }
    }
  },
  created() {
  },
  mounted() {
    if (this.pagesType && this.pagesType === '0') {
      this.questionsId = localStorage.getItem('editQuesQuestionsId') // (this.$route && this.$route.query && this.$route.query.questionsId) ? (this.$route.query.questionsId) : ''
      if (this.questionsId) {
        this.pagesIsEdit = true
      } else {
        this.pagesIsEdit = false
      }
    } else {
      this.questionsId = ''
    }
    if (!this.pagesIsEdit && localStorage.getItem('editQuesSubjectId')) {
      this.dataForm.subjectId = localStorage.getItem('editQuesSubjectId')
    }
    if (!this.pagesIsEdit && localStorage.getItem('editQuesChaptersId')) {
      this.dataForm.chaptersId = localStorage.getItem('editQuesChaptersId')
    }
    if (!this.pagesIsEdit && localStorage.getItem('editQuesMajorId')) {
      this.dataForm.majorId = localStorage.getItem('editQuesMajorId')
    }
    this.getTechnosphereList()

    if (!this.pagesIsEdit && localStorage.getItem('editQuesQuestionsType')) {
      this.dataForm.questionsType = localStorage.getItem('editQuesQuestionsType')
    }
    this.getQuestionsTypeList()
    if (!this.pagesIsEdit && localStorage.getItem('editQuesQuestionsComplexity')) {
      this.dataForm.questionsComplexity = localStorage.getItem('editQuesQuestionsComplexity')
    }
    this.getQuestionsComplexityList()
    if (this.questionsId && this.pagesType && this.pagesType === '0') {
      this.type = '编辑试题'
      // this.$nextTick(() => {
      this.viewQuestion()
      // })
    } else {
      this.type = '添加试题'
    }
  },
  beforeDestroy() {},
  destroyed() {
  },
  methods: {
    /** result change 事件 */
    resultChange: function(event) {
      // console.log('event--resultChange11：', event)
      this.dataFormNewList = []
      const obji = JSON.parse(JSON.stringify(event.dataForm))
      const obj = { ...this.handleDataFormNewList(obji) }
      obj.children = []
      // eslint-disable-next-line array-bracket-spacing
      obj.children = [ ...obji.compoundQuestionsList ]
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((itemc, indexc) => {
          itemc = JSON.parse(JSON.stringify(this.handleDataFormNewList(itemc)))
        })
      }
      this.dataFormNewList.push(obj)

      this.dataForm.questionsName = event.dataForm.questionsName
    },
    /** 处理  this.dataFormNewList */
    handleDataFormNewList: function(obj) {
      if (obj && obj.questionsType && (obj.questionsType === '1' || obj.questionsType === '2')) {
        obj.optionList = JSON.parse(JSON.stringify(obj.choiceOptionList))
      }
      if (obj && obj.questionsType && (obj.questionsType === '5')) {
        obj.optionList = JSON.parse(JSON.stringify(obj.completionRightList))
      }
      if (obj && obj.replyIds && obj.optionList && obj.optionList.length > 0 && obj.questionsType !== '2') {
        obj.optionList.forEach((item, index) => {
          item.isRight = false
          if (item.optionIdCustom && obj.replyIds === item.optionIdCustom) {
            item.isRight = true
          }
        })
      }
      if (findKeyFromObject(obj, 'questionsNameCompound').keyArr && findKeyFromObject(obj, 'questionsNameCompound').keyArr[0]) {
        obj.questionsName = obj[findKeyFromObject(obj, 'questionsNameCompound').keyArr[0]]
      }
      if (findKeyFromObject(obj, 'questionsParseCompound').keyArr && findKeyFromObject(obj, 'questionsParseCompound').keyArr[0]) {
        obj.questionsParse = obj[findKeyFromObject(obj, 'questionsParseCompound').keyArr[0]]
      }
      return obj
    },
    /** 获取题目数组 */
    viewQuestion: function() {
      const that = this
      that.$api.questionbank.viewQuestion(that.questionsId).then(res => {
        if (res.code === 0) {
          if (res.data) {
            that.dataForm = that.viewQuestionComm(res.data)
          }
          that.allowChangeChapter = (res.licence && res.licence.allowChangeChapter)
          that.allowChangeMajor = (res.licence && res.licence.allowChangeMajor)
          that.allowChangeSubject = (res.licence && res.licence.allowChangeSubject)
        }
      })
    },
    /** 根据 编辑时的数据处理  dataForm */
    viewQuestionComm: function(data, type) {
      const objvq = { ...this.viewQuestionCommSingle(data) }
      if (data && data.children && data.children.length > 0) { // 渲染复合题题目
        objvq.compoundQuestionsList = []
        data.children.forEach((comItem, comIndex) => {
          comItem.currIndex = comIndex + 1
          const obj = JSON.parse(JSON.stringify(this.viewQuestionCommSingle(comItem)))
          obj['questionsNameCompound_1_' + obj.currIndex] = comItem.questionsName
          obj['questionsParseCompound_1_' + obj.currIndex] = comItem.questionsParse
          objvq.compoundQuestionsList.push(JSON.parse(JSON.stringify(obj)))
        })
      }
      return objvq
    },
    /** 单个题目 处理数据 */
    viewQuestionCommSingle: function(oldObj) {
      const obj = {
        hasEditPermission: oldObj.hasEditPermission, // 已经添加到题目的题目 是否可以编辑
        questionsId: (oldObj && oldObj.questionsId) ? (oldObj.questionsId) : '',
        majorId: (oldObj && oldObj.majorId) ? (oldObj.majorId) : '',
        subjectId: (oldObj && oldObj.subjectId) ? (oldObj.subjectId) : '',
        chaptersId: (oldObj && oldObj.chaptersId) ? (oldObj.chaptersId) : '',
        questionsName: (oldObj && oldObj.questionsName) ? (oldObj.questionsName) : '',
        questionsParse: (oldObj && oldObj.questionsParse) ? (oldObj.questionsParse) : '',
        questionsComplexity: (oldObj && oldObj.questionsComplexity) ? (oldObj.questionsComplexity) : '', // 难易程度 1简答2普通3困难
        questionsType: (oldObj && oldObj.questionsType) ? (oldObj.questionsType) : '', // 题目类型  1单选择 2 多选 3判断 4问答
        replyIds: (oldObj && oldObj.replyIds) ? (oldObj.replyIds) : '', // 题目正确答案，多个用逗号隔开
        choiceOptionList: [], // 选择题题目数组
        optionList: [], // 判断题题目数组
        completionRightList: [], // 填空正确答案 数组
        completionRightListIndex: 0, // 填空题的 点击 添加 填空符 的总数 包括已经删除了的
        compoundQuestionsList: [], // 复合题题目 数组
        compoundQuestionsListIndex: 0, // 复合题题目 数组当前的下标
        currIndex: (oldObj && oldObj.currIndex) ? (oldObj.currIndex) : 1, // 复合题题目数组的数量，包括删除了的
        isEdit: (this.pagesType && this.pagesType === '0') ? true : ((oldObj && oldObj.isEdit) ? (oldObj.isEdit) : false) // 是否是编辑状态
      }
      obj.questionsTypeName = this.findDictName(this.questionsTypeList, obj.questionsType)
      obj.questionsComplexityName = this.findDictName(this.questionsComplexityList, obj.questionsComplexity)
      // 正确答案
      if (oldObj && oldObj.optionList && oldObj.optionList.length > 0) {
        // that.answerItemList = data.optionList
        const optionList = oldObj.optionList
        // 渲染 填空题 回答
        if (oldObj.questionsType && oldObj.questionsType === '5') {
          obj.completionRightList = JSON.parse(JSON.stringify(optionList))
          obj.completionRightListIndex = obj.completionRightList.length
          // 对 修改时的数据 渲染 idCustom标识
          const inputAllList = oldObj.questionsName.split('cd-test-completion-')
          const inputList = []
          if (inputAllList && inputAllList.length > 0) {
            for (let i = 0; i < inputAllList.length; i++) {
              const id = parseInt(inputAllList[i].split('"')[0])
              if (id && id !== 'NaN' && id !== undefined) {
                inputList.push(id)
              }
            }
          }
          inputList.forEach((item, index) => {
            obj.completionRightList[index].idCustom = item
            if (item > obj.completionRightListIndex) {
              obj.completionRightListIndex = parseInt(item)
            }
          })
          obj.completionRightList.forEach((item, index) => {
            // item.idCustom = index + 1
            item.optionIdCustom = item.optionId
          })
        }
        for (let a = 0; a < optionList.length; a++) {
          optionList[a].optionIdCustom = optionList[a].optionId
          if (oldObj.replyIds && oldObj.replyIds.split(',') && oldObj.replyIds.split(',').length > 0) {
            const repList = oldObj.replyIds.split(',')
            optionList[a].isRight = false
            for (let i = 0; i < repList.length; i++) {
              if (repList[i] && optionList[a].optionId && repList[i] === optionList[a].optionId) {
                optionList[a].isRight = true
                break
              }
            }
          }
        }
        const name = (obj.questionsType && obj.questionsType === '3') ? 'optionList' : 'choiceOptionList'
        obj[name] = optionList
      }
      return obj
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
    /** 编辑题目 */
    questionDataInit(obj) {
      // this.pagesIsEdit = true
      this.dataForm = this.viewQuestionComm(obj)
      // this.dataForm = obj
      // this.editValue = true
      // this.answerItemList = obj.optionList
      // for (let index = 0; index < this.answerItemList.length; index++) {
      //   this.dataFormOptionObj['option' + index] = this.answerItemList[index].content
      // }
    },
    /** 测试活动手动添加题目 时 --新增的时候调用 */
    questionDataAddInit: function() {
      this.getQuestionsTypeList()
      this.getQuestionsComplexityList()
    },
    /** 保存 */
    toSave: function(type) {
      if (!this.$refs['addQuestions'].formVerifyBoolean()) {
        return false
      }
      return this.getSaveResultData(this.dataFormNewList[0], this.dataFormNewList[0].hasEditPermission)

      // const that = this
      // const result = JSON.parse(JSON.stringify(that.handleSaveDatas(that.dataFormNewList[0])))
      // if (result.questionsType && result.questionsType === '6') {
      //   result.questionList = []
      //   if (that.dataFormNewList[0].children && that.dataFormNewList[0].children.length > 0) {
      //     that.dataFormNewList[0].children.forEach((itemc, indexc) => {
      //       result.questionList.push(JSON.parse(JSON.stringify(that.handleSaveDatas(itemc))))
      //     })
      //   }
      //   result.children = result.questionList
      // }

      // if (result.questionsType === '1') {
      //   result.questionsTypeName = '单选题'
      // }
      // if (result.questionsType === '2') {
      //   result.questionsTypeName = '多选题'
      // }
      // if (result.questionsType === '3') {
      //   result.questionsTypeName = '判断题'
      // }
      // if (result.questionsType === '4') {
      //   result.questionsTypeName = '简答题'
      // }
      // if (result.questionsType === '5') {
      //   result.questionsTypeName = '填空题'
      // }
      // if (result.questionsType === '6') {
      //   result.questionsTypeName = '复合题'
      //   result.questionList.forEach((obj, index) => {
      //     if (obj.questionsType === '1') {
      //       obj.questionsTypeName = '单选题'
      //     }
      //     if (obj.questionsType === '2') {
      //       obj.questionsTypeName = '多选题'
      //     }
      //     if (obj.questionsType === '3') {
      //       obj.questionsTypeName = '判断题'
      //     }
      //     if (obj.questionsType === '4') {
      //       obj.questionsTypeName = '简答题'
      //     }
      //     if (obj.questionsType === '5') {
      //       obj.questionsTypeName = '填空题'
      //     }
      //   })
      // }
      // return result
    },
    toSaveByGetBackData: function(data) {
      const objvq = { ...this.viewQuestionCommSingle(data) }
      if (objvq.questionsType && objvq.questionsType === '3') { //
      } else {
        objvq.optionList = objvq.choiceOptionList
      }
      if (data && data.children && data.children.length > 0) { // 渲染复合题题目
        objvq.compoundQuestionsList = []
        data.children.forEach((comItem, comIndex) => {
          comItem.currIndex = comIndex + 1
          const obj = JSON.parse(JSON.stringify(this.viewQuestionCommSingle(comItem)))
          obj['questionsNameCompound_1_' + obj.currIndex] = comItem.questionsName
          obj['questionsParseCompound_1_' + obj.currIndex] = comItem.questionsParse
          if (obj.questionsType && obj.questionsType === '3') { //
          } else {
            obj.optionList = obj.choiceOptionList
          }
          objvq.compoundQuestionsList.push(JSON.parse(JSON.stringify(obj)))
        })
        objvq.children = []
        // eslint-disable-next-line array-bracket-spacing
        objvq.children = [ ...objvq.compoundQuestionsList ]
        if (objvq.children && objvq.children.length > 0) {
          objvq.children.forEach((itemc, indexc) => {
            itemc = JSON.parse(JSON.stringify(this.handleDataFormNewList(itemc)))
          })
        }
      }
      return this.getSaveResultData(objvq, false)
    },
    /** 对要保存的数据进行处理 */
    handleSaveDatas: function(oldObj) {
      const obj = {
        hasEditPermission: oldObj.hasEditPermission, // 已经添加到题目的题目 是否可以编辑
        questionsId: (oldObj && oldObj.questionsId) ? (oldObj.questionsId) : '',
        majorId: (oldObj && oldObj.majorId) ? (oldObj.majorId) : '',
        subjectId: (oldObj && oldObj.subjectId) ? (oldObj.subjectId) : '',
        chaptersId: (oldObj && oldObj.chaptersId) ? (oldObj.chaptersId) : '',
        questionsName: (oldObj && oldObj.questionsName) ? (oldObj.questionsName) : '',
        questionsParse: (oldObj && oldObj.questionsParse) ? (oldObj.questionsParse) : '',
        questionsComplexity: (oldObj && oldObj.questionsComplexity) ? (oldObj.questionsComplexity) : '', // 难易程度 1简答2普通3困难
        questionsType: (oldObj && oldObj.questionsType) ? (oldObj.questionsType) : '', // 题目类型  1单选择 2 多选 3判断 4问答
        replyIds: (oldObj && oldObj.replyIds) ? (oldObj.replyIds) : '', // 题目正确答案，多个用逗号隔开
        optionList: [] // 判断题题目数组
      }
      if (obj && obj.questionsType) {
        obj.questionsTypeName = this.findDictName(this.questionsTypeList, obj.questionsType)
      }
      if (oldObj && oldObj.optionList && oldObj.optionList.length > 0 && obj.questionsType !== '4' && obj.questionsType !== '6') {
        oldObj.optionList.forEach((item, index) => {
          const objc = {
            questionsId: item.questionsId,
            optionId: item.optionId,
            content: item.content
          }
          if (obj.questionsType && obj.questionsType !== '5') {
            objc.code = item.code
            objc.optionId = item.optionId || item.code
            // eslint-disable-next-line no-unneeded-ternary
            objc.isModelAnswer = (item.isRight) ? true : false
            objc.isRight = (item.isRight) ? 'YES' : 'NO'
          }
          if (obj.questionsType && obj.questionsType === '2') {
            if (item.isRight) {
              obj.replyIds += ((item.optionId || item.code) + ',')
            }
          }
          obj.optionList.push(objc)
        })
      }
      return obj
    },
    getSaveResultData: function(data, isDelOptionList) {
      const that = this
      const result = JSON.parse(JSON.stringify(that.handleSaveDatas(data)))
      if (isDelOptionList) {
        result.json = ''
        if (result.questionsType && result.questionsType !== '6' && result.questionsType !== '4') {
          result.json = JSON.stringify(result.optionList)
        }
        delete result.optionList
      }
      if (result.questionsType && result.questionsType === '6') {
        result.questionList = []
        if (data.children && data.children.length > 0) {
          data.children.forEach((itemc, indexc) => {
            result.questionList.push(JSON.parse(JSON.stringify(that.handleSaveDatas(itemc))))
          })
        }
      }
      return result
    },
    /** 保存 */
    toSaveByTestQuestions: function(type) {
      // 已有题目，判断是否填写完整
      if (!this.$refs['addQuestions'].formVerifyBoolean()) {
        return false
      }
      const that = this
      confirm('确定提交吗？', function() {
        const result = that.getSaveResultData(that.dataFormNewList[0], true)
        // const result = JSON.parse(JSON.stringify(that.handleSaveDatas(that.dataFormNewList[0])))
        // result.json = ''
        // if (result.questionsType && result.questionsType !== '6' && result.questionsType !== '4') {
        //   result.json = JSON.stringify(result.optionList)
        // }
        // delete result.optionList
        // if (result.questionsType && result.questionsType === '6') {
        //   result.questionList = []
        //   if (that.dataFormNewList[0].children && that.dataFormNewList[0].children.length > 0) {
        //     that.dataFormNewList[0].children.forEach((itemc, indexc) => {
        //       result.questionList.push(JSON.parse(JSON.stringify(that.handleSaveDatas(itemc))))
        //     })
        //   }
        // }

        let urlName = 'saveQuestion'
        if (result.questionsType && result.questionsType === '6') {
          urlName = 'saveCompositeQuestionInfo'
        }
        loadingModal(true)
        that.$api.questionbank[urlName](result).then((res) => {
          loadingModal(false)
          if (res.code === 0) {
            toast('保存成功')
            localStorage.setItem('editQuesMajorId', result.majorId)
            localStorage.setItem('editQuesSubjectId', result.subjectId)
            localStorage.setItem('editQuesChaptersId', ((result.chapterId) ? (result.chapterId) : ''))
            localStorage.setItem('editQuesQuestionsType', result.questionsType)
            localStorage.setItem('editQuesQuestionsComplexity', result.questionsComplexity)
            if (type && type === 'continue') {
              that.dataForm = {
                majorId: result.majorId,
                subjectId: result.subjectId,
                chapterId: ((result.chapterId) ? (result.chapterId) : ''),
                questionsType: result.questionsType,
                questionsComplexity: result.questionsComplexity
              }
            } else if (type && type === 'single') {
              setTimeout(function() {
                that.toback('/question-bank-center/test-question-bank')
              }, 2000)
            }
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
    /** 题目解析的显示隐藏 */
    showAnalysisCon: function() {
      if (this.showAnalysis) {
        this.showAnalysis = false
      } else {
        this.showAnalysis = true
      }
    },
    /** 获取 题目 难易程度 数组 */
    getQuestionsComplexityList: function() {
      this.questionsComplexityList = []
      this.$api.questionbank.getQuestionsComplexity().then(res => {
        if (res.data && res.data.length > 0) {
          this.questionsComplexityList = res.data
        }
      })
    },
    /** 获取 题型 数组 */
    getQuestionsTypeList: function() {
      this.questionsTypeList = []
      this.questionsTypeChildrenList = []
      this.$api.questionbank.getQuestionsType().then(res => {
        if (res.data && res.data.length > 0) {
          this.questionsTypeList = res.data
          if (res.data && res.data.length > 0) {
            this.questionsTypeChildrenList = (res.data).filter(item => item.dictCode !== '6')
          }
        }
      })
    },
    /** 获取 职业路径 分类 数组 */
    getTechnosphereList: function() {
      this.technosphereList = []
      // 查询出所有分类信息
      this.$api.testcenter.getMajor().then(res => {
        if (res.data && res.data.length > 0) {
          this.technosphereList = res.data
        }
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
        /* height: calc(100vh - 50px - 100px ); */
        /* height: calc(100vh - 50px ); */
        box-sizing: border-box;
        width: 100%;
        margin: 0 auto;
        /* overflow-y: scroll; */
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
      /* border: 1px solid #0033cc; */
    }
    .test-question-left-activity{
      width: 100%;
    }
    .test-question-left-inner{
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
      width: 100%;
    }
    .test-question-left-inner-questions{
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
    .quesListCompound{
      padding-bottom: 5px;
    }
</style>
