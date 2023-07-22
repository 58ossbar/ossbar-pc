<!-- 题库的 录题组件 页面 ，包括职业路径、课程、题目类型等 的选择-->
<template>
  <div class="widthAll add-test-question-tree">
    <!-- 下拉选择项 begin -->
    <div class="test-question-selects">
      <el-select v-show="isShowMajorAndSubjects" v-model="dataForm.majorId" :disabled="dataForm.isEdit && !allowChangeMajor" size="mini" placeholder="请选择职业路径" class="select-major" @visible-change="selectVisibleChange('major',$event)" @change="selectChange('majorId',$event)">
        <el-option v-for="(itemm,indexm) in technosphereListInit" :key="indexm" :label="itemm.majorName" :value="itemm.majorId"/>
      </el-select>
      <el-select v-show="isShowMajorAndSubjects" v-model="dataForm.subjectId" :disabled="dataForm.isEdit && !allowChangeSubject" filterable size="mini" placeholder="请选择课程体系" class="select-subject" @visible-change="selectVisibleChange('subject',$event)" @change="selectChange('subjectId',$event)">
        <el-option v-for="(items,indexs) in subjectsList" :key="indexs" :label="items.subjectName" :value="items.subjectId"/>
      </el-select>
      <el-select v-show="isShowMajorAndSubjects" v-model="dataForm.chaptersId" :disabled="dataForm.isEdit && !allowChangeChapter" size="mini" placeholder="请选择章节" class="select-chapter" @visible-change="selectVisibleChange('chapter',$event)" @change="selectChange('chaptersId',$event)">
        <el-option v-for="(itemc,indexc) in chaptersList" :key="indexc" :label="itemc.chapterName" :value="itemc.chapterId"/>
      </el-select>
      <el-select v-model="dataForm.questionsType" :disabled="dataForm.isEdit" size="mini" placeholder="请选择题型" class="select-type" @visible-change="selectVisibleChange('type',$event)" @change="selectChange('questionsType',$event)">
        <el-option v-for="(itemt,indext) in questionsTypeListInit" :key="indext" :label="itemt.dictValue" :value="itemt.dictCode"/>
      </el-select>
      <el-select v-model="dataForm.questionsComplexity" size="mini" placeholder="请选择难易程度" class="select-complexity" @visible-change="selectVisibleChange('complexity',$event)" @change="selectChange('questionsComplexity',$event)">
        <el-option v-for="(itemp,indexp) in questionsComplexityListInit" :key="indexp" :label="itemp.dictValue" :value="itemp.dictCode"/>
      </el-select>
    </div>
    <div class="selects-feed-wrapper">
      <div v-if="isShowMajorAndSubjects" class="invalid-feedback textAlignLeft p-0 selectsFeeds majorSelectsFeed"><small>请选择职业路径！</small></div>
      <div v-if="isShowMajorAndSubjects" class="invalid-feedback textAlignLeft p-0 selectsFeeds subjectSelectsFeed"><small>请选择课程体系！</small></div>
      <div v-if="isShowMajorAndSubjects" class="invalid-feedback textAlignLeft p-0 selectsFeeds chapterSelectsFeed"><small>请选择章节！</small></div>
      <div class="invalid-feedback textAlignLeft p-0 selectsFeeds typeSelectsFeed"><small>请选择题目类型！</small></div>
      <div class="invalid-feedback textAlignLeft p-0 selectsFeeds complexitySelectsFeed"><small>请选择题目难易程度！</small></div>
    </div>
    <!-- 下拉选择项  end -->
    <!-- 题目名称begin -->
    <div id="addTestQuestionsNameId" :class="['addTestQuestionsName', questionsName+'Wrapper']">
      <div class="tm-label tm-label-questions-name">
        <span>题目名称</span><span style="color:red;"> (必填)</span>
        <div v-show="dataForm.questionsType === '5'">
          <span class="tm-label-tx" >题目名称中还未插入填空符</span>
        </div>
        <div v-show="dataForm.questionsType == '5'" class="testQuesCompletionAddBtn" @click="toAddQuesCompletion">
          <span class="el-icon-plus"/><span>添加填空符</span>
        </div>
      </div>
      <cb-editor :name="questionsName" :data-form="dataForm" :tool-str="toolStr" :is-edit-chapter="true" height="100" @editorback="editorBack" @editorfocusback="editorFocusBack" @editorblurback="editorBlurBack"/>
      <div class="selects-feed-wrapper">
        <div :class="['invalid-feedback col-10 textAlignLeft p-0 questionsNameFeed', questionsName+'WrapperFeed']"><small >题目名称不能为空！</small></div>
      </div>
    </div>
    <!-- 题目名称end -->
    <div v-if="dataForm.questionsType !== '6'">
      <!--  选择选项begin -->
      <div v-show="dataForm.questionsType == '1' || dataForm.questionsType == '2'">
        <div class="tm-label">
          <span> {{ dataForm.questionsType == '1'?'单选':'多选' }}选项</span>
          <span class="el-icon-plus tm-label-icons-plus" title="添加选项" @click="toAddOrDelOptions('add')"/>
          <span class="el-icon-minus tm-label-icons-minus" title="删除选项" @click="toAddOrDelOptions('del')"/>
          <span class="tm-label-tx">{{ dataForm.questionsType == '1'?'请设置一个正确答案':'至少设置两个正确答案' }}</span>
          <span class="tm_label_answers">当前正确答案有</span>
          <div v-if="dataForm && dataForm.choiceOptionList && dataForm.choiceOptionList.length > 0" class="displayFlex2">
            <div v-for="(item0, index0) in dataForm.choiceOptionList" :key="index0" class="displayFlex2">
              <span v-if="dataForm.replyIds === item0.optionIdCustom && dataForm.questionsType == '1'" >{{ item0.code }}</span>
              <span v-if="item0.isRight && dataForm.questionsType == '2'" >{{ item0.code }}</span>
            </div>
          </div>
        </div>
        <div v-if="dataForm && dataForm.choiceOptionList && dataForm.choiceOptionList.length > 0">
          <div v-for="(item0, index0) in dataForm.choiceOptionList" :key="index0" class="test-question-option-wrapper">
            <div :class="['test-question-option-inner addTestOptionList','addTestOptionList'+index0]">
              <el-radio v-if="dataForm.questionsType == '1'" v-model="dataForm.replyIds" :label="item0.optionIdCustom" class="test-question-option-checkbox" @change="checkBoxChange">{{ item0.code }}</el-radio>
              <el-checkbox v-if="dataForm.questionsType == '2'" v-model="item0.isRight" class="test-question-option-checkbox" @change="checkBoxChange">{{ item0.code }}</el-checkbox>
              <cb-editor :name="choiceOptionName+index0" :data-form="dataForm.choiceOptionListContentObj" :tool-str="toolStr" :is-edit-chapter="true" class="test-question-option-editor" height="60" @editorback="editorBack" @editorfocusback="editorFocusBack" @editorblurback="editorBlurBack"/>
            </div>
            <div class="selects-feed-wrapper single_choice_feed widthAll">
              <div :class="['invalid-feedback col-10 textAlignLeft p-0 optionListFeed','optionListFeed'+index0]" ><small >选项{{ item0.code }}内容不能为空！</small></div>
            </div>
          </div>
        </div>
      </div>
      <!--  选择选项end -->
      <!-- 判断题 选择选项 begin -->
      <div v-show="dataForm.questionsType == '3'">
        <div class="tm-label">判断选项</div>
        <div class="addQuestionReplyIds">
          <!-- <el-radio-group  v-model="dataForm.replyIds"> -->
          <el-radio v-for="(item0, index0) in dataForm.optionList" v-model="dataForm.replyIds" :key="index0" :label="item0.optionIdCustom" @change="checkBoxChange">{{ item0.content }}</el-radio>
          <!-- </el-radio-group> -->
        </div>
        <div class="selects-feed-wrapper">
          <div class="invalid-feedback col-10 textAlignLeft p-0 questionReplyIdsFeed"><small >请设置正确答案！</small></div>
        </div>
      </div>
      <!-- 判断题 选择选项 end -->
      <!-- 填空题 选项begin -->
      <div v-show="dataForm.questionsType == '5' && dataForm.completionRightList && dataForm.completionRightList.length > 0">
        <div class="tm-label">
          <span> 填空正确答案</span><span style="color:red;"> (必填)</span>
        </div>
        <div v-if="dataForm.completionRightList && dataForm.completionRightList.length > 0">
          <div v-for="(item0, index0) in dataForm.completionRightList" :key="index0" class="test-question-option-wrapper">
            <div :class="['test-question-option-inner addTestOptionListCompletion','addTestOptionListCompletion'+index0]">
              <div class="test-question-option-completion-label">填空{{ index0+1 }}</div>
              <el-input :rows="3" v-model="item0.content" class="test-question-option-editor" type="textarea" placeholder="请输入内容" clearable @blur="inputBlurOrFocus('completionRight',index0,$event,'blur')" @focus="inputBlurOrFocus('completionRight',index0,$event,'focus')" @input="inputBlurOrFocus('completionRight',index0,$event,'input')"/>
            </div>
            <div class="selects-feed-wrapper">
              <div :class="['invalid-feedback col-10 textAlignLeft p-0 optionListFeed','optionListFeedCompletion'+index0]" ><small >填空{{ index0+1 }} 的内容不能为空！</small></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 填空题  选项end -->
      <!-- 题目解析begin -->
      <div :class="['addTestQuestionsParse', questionsParseName +'Wrapper' ]">
        <div class="tm-label"><span>题目解析</span><!-- <span style="color:red;"> (必填)</span> --></div>
        <cb-editor :name="questionsParseName" :data-form="dataForm" :tool-str="toolStr" :is-edit-chapter="true" height="100" @editorback="editorBack" @editorfocusback="editorFocusBack" @editorblurback="editorBlurBack"/>
        <div class="selects-feed-wrapper">
          <div :class="['invalid-feedback col-10 textAlignLeft p-0 questionsParseFeed',questionsParseName+'WrapperFeed']"><small >题目解析不能为空！</small></div>
        </div>
      </div>
      <!-- 题目解析end -->
    </div>
    <!-- 复合题 begin -->
    <div v-if="dataForm.questionsType === '6'">
      <div class="tm-label">
        <span> 复合题题目</span>
        <span class="el-icon-plus tm-label-icons-plus" title="添加题目" @click="toAddCompoundQuestions"/>
        <!-- <span class="el-icon-minus tm-label-icons-minus" @click="toAddOrDelOptions('del')"></span> -->
        <!-- <span class="tm-label-tx-compound">至少添加一个题目</span> -->
      </div>
      <!-- 复合题题目序号 自定义tab 列表 begin -->
      <div class="custom-tabs-header-nav">
        <!-- <div class="editor-arrow"><i class="el-icon-arrow-left"></i></div> -->
        <!-- <div class="editor-nav" v-if="pagesType && pagesType === '0'">
            <div v-for="(compoundItem, compoundIndex) in dataForm.compoundQuestionsList" :key="compoundIndex" :class="[dataForm.compoundQuestionsListIndex === compoundIndex?'active-editor-nav-wrapper':'']">
              <div
              v-if="dataForm.compoundQuestionsListIndex < 5 && compoundIndex < 9 || dataForm.compoundQuestionsListIndex >= 5 && dataForm.compoundQuestionsListIndex <= dataForm.compoundQuestionsList.length - 5 && compoundIndex < (dataForm.compoundQuestionsListIndex + 5) && compoundIndex > (dataForm.compoundQuestionsListIndex - 5) || dataForm.compoundQuestionsListIndex > dataForm.compoundQuestionsList.length - 5 && compoundIndex > dataForm.compoundQuestionsList.length - 10"
                :title="'第' + (compoundIndex + 1) + '题'" :class="['editor-nav-item',dataForm.compoundQuestionsListIndex === compoundIndex?'active-editor-nav':'active-editor-no-nav']" @click="toClickCompoundQuestions(compoundIndex)">
                <span>第{{compoundIndex + 1}}题</span>
                <div v-if="dataForm.compoundQuestionsListIndex === compoundIndex" @click.stop="toDelCompoundQuestions(compoundIndex)" class="del-edit-nav-btn">×</div>
              </div>
            </div>
          </div> -->
        <!-- v-if="pagesType && pagesType === '1'" -->
        <div class="editor-nav editor-nav-test-activity" >
          <div v-for="(compoundItem, compoundIndex) in dataForm.compoundQuestionsList" :key="compoundIndex" :class="[dataForm.compoundQuestionsListIndex === compoundIndex?'active-editor-nav-wrapper':'']">
            <div
              v-if="dataForm.compoundQuestionsListIndex < editorNavHalfWidth && compoundIndex < editorNavWidth || dataForm.compoundQuestionsListIndex >= editorNavHalfWidth && dataForm.compoundQuestionsListIndex <= dataForm.compoundQuestionsList.length - editorNavHalfWidth && compoundIndex < (dataForm.compoundQuestionsListIndex + editorNavHalfWidth) && compoundIndex > (dataForm.compoundQuestionsListIndex - editorNavHalfWidth) || dataForm.compoundQuestionsListIndex > dataForm.compoundQuestionsList.length - editorNavHalfWidth && compoundIndex > dataForm.compoundQuestionsList.length - (editorNavWidth + 1)"
              :title="'第' + (compoundIndex + 1) + '题'"
              :class="['editor-nav-item',dataForm.compoundQuestionsListIndex === compoundIndex?'active-editor-nav':'active-editor-no-nav']"
              @click="toClickCompoundQuestions(compoundIndex)">
              <span>第{{ compoundIndex + 1 }}题</span>
              <div v-if="dataForm.compoundQuestionsListIndex === compoundIndex" class="del-edit-nav-btn" @click.stop="toDelCompoundQuestions(compoundIndex)">×</div>
            </div>
          </div>
        </div>
        <div class="editor-nav-bottom-line"/>
        <!-- <div class="editor-arrow" ><i class="el-icon-arrow-right"></i></div> -->
      </div>
      <!-- 复合题题目序号 自定义tab 列表end -->
      <!-- 复合题题目 列表 begin -->
      <div v-for="(compoundItem, compoundIndex) in dataForm.compoundQuestionsList" :key="compoundIndex">
        <div v-if="dataForm.compoundQuestionsListIndex === compoundIndex" class="compound-list-wwrapper">
          <add-test-question-tree
            :questions-id="questionsId"
            :choice-option-name="'optionCompound_'+ complexityIndex+'_' +compoundItem.currIndex +'_'"
            :questions-name="'questionsNameCompound_'+ complexityIndex+'_' +compoundItem.currIndex"
            :ref="'addQuestions_'+ complexityIndex+'_' +compoundItem.currIndex"
            :questions-parse-name="'questionsParseCompound_'+ complexityIndex+'_' +compoundItem.currIndex"
            :complexity-index="complexityIndex+1"
            :data-form-init="compoundItem"
            :technosphere-list-init="technosphereListInit"
            :questions-complexity-list-init="questionsComplexityListInit"
            :questions-type-list-init="questionsTypeChildrenListInit"
            :pages-type="pagesType"
            @resultChange="resultChldrenChange"/>
        </div>
      </div>
      <!-- 复合题题目 列表 end -->
    </div>
    <!-- 复合题end -->

    <!-- 图片预览标签 begin -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="viewerImgSrc" alt>
    </div>
    <!-- 图片预览标签 end -->

  </div>
</template>
<script>
import { getQuestionsComplexityBgColor, getQuestionsTypeBgColor, formVaildStyle, formInVaildStyle, toast, findKeyFromObject, lTrim } from '@/utils/global'
import $ from '@/assets/jquery-vendor'
import CbEditor from '@/components/cb-editor'
export default {
  name: 'AddTestQuestionTree',
  components: {
    'cb-editor': CbEditor
  },
  props: {
    pagesType: { // 页面的类型 '0'是题库的新增试题页，'1'是 创建测试活动 的新增页
      type: String,
      default: '0'
    },
    questionsId: { // 当前表单项 的 questionsId
      type: String,
      default: ''
    },
    choiceOptionName: { // 选择选项内容 的名称
      type: String,
      default: 'option'
    },
    questionsParseName: { // 题目解析 的名称
      type: String,
      default: 'questionsParse'
    },
    questionsName: { // 题干 的名称
      type: String,
      default: 'questionsName'
    },
    isShowMajorAndSubjects: { // 是否显示 职业路径、课程体系、章节
      type: Boolean,
      default: false
    },
    allowChangeChapter: { // 题目编辑的时候 时候允许编辑章节
      type: Boolean,
      default: false
    },
    allowChangeMajor: { // 题目编辑的时候 时候允许编辑课程体系
      type: Boolean,
      default: false
    },
    allowChangeSubject: { // 题目编辑的时候 时候允许编辑课程
      type: Boolean,
      default: false
    },
    complexityIndex: { // 当前复合题的层次
      type: Number,
      default: 1
    },
    dataFormInit: { // //题目数组，一个
      type: Object,
      default: () => {}
    },
    technosphereListInit: { // 职业路径 数组
      type: Array,
      default: () => []
    },
    questionsComplexityListInit: { // 题目难易程度 数组
      type: Array,
      default: () => []
    },
    questionsTypeListInit: { // 题目类型数组
      type: Array,
      default: () => []
    },
    questionsTypeChildrenListInit: { // 题目类型数组。没有复合题
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      viewerImgSrc: '', // 图片预览src
      toolStr: 'removeformat image media codesample preview fullscreen', // 编辑器的tabstr
      dataForm: {}, // 表单数据项
      subjectsList: [], // 课程 课程体系 数组
      chaptersList: [], // 章节 数组
      editorNavWidth: 0, // .editor-nav的宽度
      editorNavHalfWidth: 0 // .editor-nav的宽度
    }
  },
  computed: {
    allPropsChange: function() { // 监听多个数据
      const { questionsTypeListInit, questionsComplexityListInit, dataFormInit, isShowMajorAndSubjects } = this
      return {
        questionsTypeListInit,
        questionsComplexityListInit,
        dataFormInit,
        isShowMajorAndSubjects
      }
    }
  },
  watch: {
    // 'dataForm.questionsType': function(newVal, oldVal) {
    //   if (newVal && newVal === '6') {
    //     this.getEditorNavWidth()
    //   }
    // },
    'allPropsChange': { // 监听多个数据
      handler: function(val) {
        if (this.questionsTypeListInit && this.questionsTypeListInit.length > 0 && this.questionsComplexityListInit && this.questionsComplexityListInit.length > 0) {
          this.dataForm = { ...this.initDataForm(val.dataFormInit, 'root') }
          if (this.dataForm && (this.dataForm.majorId || this.dataForm.subjectId) && val.isShowMajorAndSubjects) {
            this.getSubjectsList()
          }
          this.$forceUpdate()
          this.$emit('resultChange', { dataForm: this.dataForm })
        }
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
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    /** result change 事件 */
    resultChldrenChange: function(event) {
      // console.log('event--resultChldrenChange', event)
      // console.log('complexityIndex', this.complexityIndex)
      this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsListIndex] = { ...event.dataForm }

      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 给题目名称 添加 填空符 */
    toAddQuesCompletion: function() {
      $('.tm-label-tx').css('display', 'none')
      this.dataForm.completionRightListIndex = this.dataForm.completionRightListIndex + 1
      const str = '<input disabled="disabled" value="______" class="cd-test-completion-' + this.dataForm.completionRightListIndex + '" style="color: #3198ed;border: none;width: 40px;text-align: center;display: inline-block;font-size: 12px;padding: 0 5px;background-color: inherit;" />'
      // 在光标的位置 插入 填空符
      tinyMCE.editors[this.questionsName].execCommand('mceInsertContent', false, str)
    },
    /** 切换题目类型 */
    selectChange: function(name, event) {
      if (name === 'majorId' && event) { // 切换职业路径
        this.getSubjectsList(true)
      } else if (name === 'subjectId' && event) { // 切换课程
        this.getChaptersList(true)
        this.selectVisibleChange('chapter', true)
      } else if (name === 'chaptersId' && event) { // 切换章节
        this.selectVisibleChange('chapter', true)
      } else if (name === 'questionsType' && event) { // 切换题目类型
        this.dataForm.questionsTypeName = this.findDictName(this.questionsTypeListInit, event)
        this.dataForm.quesTypeBackColor = getQuestionsTypeBgColor(event)
        this.dataForm.replyIds = ''
        if (this.dataForm.choiceOptionList && this.dataForm.choiceOptionList.length > 0) {
          this.dataForm.choiceOptionList.forEach((item, index) => {
            item.isRight = false
          })
        }
        if (this.dataForm.optionList && this.dataForm.optionList.length > 0) {
          this.dataForm.optionList.forEach((item, index) => {
            item.isRight = false
          })
        }
        // 新增的时候如果是填空题切换到其他类型的题目，则清除 题目名称的值
        if (event !== '5' && !this.dataForm.isEdit && this.dataForm[this.questionsName] && this.dataForm[this.questionsName].indexOf('cd-test-completion-') > -1) {
          this.dataForm[this.questionsName] = ''
        }
        this.dataForm.completionRightList = []
        this.dataForm.completionRightListIndex = 0
        if (tinyMCE.editors[this.questionsName]) {
          tinyMCE.editors[this.questionsName].setContent(this.dataForm[this.questionsName])
        }
        // 清空验证
        this.clearAllFormValid()
        if (event === '6' && (!this.dataForm.compoundQuestionsList || (this.dataForm.compoundQuestionsList && this.dataForm.compoundQuestionsList.length < 1))) {
          this.dataForm.compoundQuestionsList = []
          this.dataForm.compoundQuestionsListIndex = 0
          const obj = this.initDataForm({ questionsType: '' }, 'compoundQuestionsList')
          this.dataForm.compoundQuestionsList.push({ ...obj })
        }
        if (event === '6') {
          this.getEditorNavWidth()
        }
      } else if (name === 'questionsComplexity' && event) { // 切换题目难易程度
        this.dataForm.questionsComplexityName = this.findDictName(this.questionsComplexityListInit, event)
        this.dataForm.quesComBackColor = getQuestionsComplexityBgColor(event)
      }
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    getEditorNavWidth: function() {
      const that = this
      const setIntervalByEdit = setInterval(function() {
        if ($('.custom-tabs-header-nav').width() && $('.custom-tabs-header-nav').width() !== undefined) {
          clearInterval(setIntervalByEdit)
          that.editorNavWidth = parseInt(parseInt($('.custom-tabs-header-nav').width()) / 90)
          that.editorNavHalfWidth = parseInt(that.editorNavWidth / 2) + 1
          // console.log("$('.editor-nav').height()111", $('.custom-tabs-header-nav').width())
          $('.custom-tabs-header-nav .editor-nav').width(that.editorNavWidth * 90)
          // console.log('this.editorNavWidth', that.editorNavWidth)
          // console.log('this.editorNavHalfWidth', that.editorNavHalfWidth)
        }
      }, 1000)

      // if ($('.editor-nav').width() && $('.editor-nav').width() !== undefined) {
      //   this.editorNavWidth = parseInt(parseInt($('.editor-nav').width()) / 90)
      //   this.editorNavHalfWidth = parseInt(this.editorNavWidth / 2) + 1
      // }
      // console.log("$('.editor-nav').height()111", $('.editor-nav').width())
      // console.log('this.editorNavWidth', this.editorNavWidth)
      // console.log('this.editorNavHalfWidth', this.editorNavHalfWidth)
    },
    /** 编辑器 获取焦点 */
    editorFocusBack: function(event) {
      // if (event && event.name && (event.name === 'questionsName' || event.name === 'questionsParse')) {
      if (event && event.name && (event.name === this.questionsName)) {
        // let nameDx = event.name.slice(0, 1).toUpperCase() + event.name.slice(1)
        $('.' + event.name + 'Wrapper').removeClass('cb-form-valid')// 清除合法状态
        $('.' + event.name + 'Wrapper').removeClass('cb-form-invalid')// 添加非法状态

        $('.' + event.name + 'WrapperFeed').css('display', 'none')
      } else if (event && event.name && event.name.indexOf(this.choiceOptionName) > -1) {
        const index = parseInt(event.name.split(this.choiceOptionName)[1])
        $('.addTestOptionList' + index).removeClass('cb-form-valid')// 清除合法状态
        $('.addTestOptionList' + index).removeClass('cb-form-invalid')// 添加非法状态
        $('.optionListFeed' + index).css('display', 'none')
      }
    },
    /** 编辑器 失去焦点 */
    editorBlurBack: function(event) {
      // if (event && event.name && (event.name === 'questionsName' || event.name === 'questionsParse')) {
      if (event && event.name && (event.name === this.questionsName)) {
      // let nameDx = event.name.slice(0, 1).toUpperCase() + event.name.slice(1)

      // console.log(  typeof(this.dataForm[event.name] )  )

      // .replaceAll('<p>', '').replaceAll('&nbsp;', '').replaceAll('</p>', '')
      // .split('<p>').join('').split('&nbsp;').join('').split('</p>').join('')

        if (this.dataForm[event.name] && lTrim(this.dataForm[event.name].split('<p>').join('').split('&nbsp;').join('').split('</p>').join(''))) {
          $('.' + event.name + 'WrapperFeed').css('display', 'none')
        } else {
          formInVaildStyle('.' + event.name + 'WrapperFeed', '.' + event.name + 'Wrapper')
        }
        this.$forceUpdate()
      } else if (event && event.name && event.name.indexOf(this.choiceOptionName) > -1) {
        const index = parseInt(event.name.split(this.choiceOptionName)[1])
        // .replaceAll('<p>', '').replaceAll('&nbsp;', '').replaceAll('</p>', '')
        if (this.dataForm.choiceOptionListContentObj[event.name] && lTrim(this.dataForm.choiceOptionListContentObj[event.name].split('<p>').join('').split('&nbsp;').join('').split('</p>').join(''))) {
          $('.optionListFeed' + index).css('display', 'none')
        } else {
          formInVaildStyle('.optionListFeed' + index, '.addTestOptionList' + index)
        }
      }
    },
    /** 编辑器实时返回数据 */
    editorBack: function(event) {
      if (event && event.data) {
        event.data = lTrim(event.data)
      }
      if (event && event.name && (event.name === this.questionsName || event.name === this.questionsParseName)) {
        this.dataForm[event.name] = event.data
        this.$forceUpdate()
        if (event.name === this.questionsName && event.data && this.dataForm.questionsType && this.dataForm.questionsType === '5') {
          const completionRightListOld = JSON.parse(JSON.stringify(this.dataForm.completionRightList))
          this.dataForm.completionRightList = []
          const inputAllList = event.data.split('cd-test-completion-')
          if (inputAllList && inputAllList.length > 0) {
            for (let i = 0; i < inputAllList.length; i++) {
              const id = parseInt(inputAllList[i].split('"')[0])
              if (id && id !== 'NaN' && id !== undefined) {
                this.dataForm.completionRightList.push({ code: '', content: '', optionId: '', questionsId: '', isRight: true, idCustom: id, optionIdCustom: '' })
              }
            }
          }
          if (completionRightListOld && completionRightListOld.length > 0 && this.dataForm.completionRightList && this.dataForm.completionRightList.length > 0) {
            for (let i = 0; i < this.dataForm.completionRightList.length; i++) {
              for (let i2 = 0; i2 < completionRightListOld.length; i2++) {
                if (this.dataForm.completionRightList[i].idCustom === completionRightListOld[i2].idCustom) {
                  this.dataForm.completionRightList[i].content = completionRightListOld[i2].content
                  this.dataForm.completionRightList[i].optionId = completionRightListOld[i2].optionId
                  this.dataForm.completionRightList[i].optionIdCustom = completionRightListOld[i2].optionIdCustom
                  this.dataForm.completionRightList[i].questionsId = completionRightListOld[i2].questionsId
                  // this.dataForm.completionRightList[i] = JSON.parse(JSON.stringify(completionRightListOld[i2]))
                }
              }
            }
          }
        }
      } else if (event && event.name && event.name.indexOf(this.choiceOptionName) > -1) {
        const index = parseInt(event.name.split(this.choiceOptionName)[1])
        this.dataForm.choiceOptionListContentObj[event.name] = event.data
        this.dataForm.choiceOptionList[index].content = event.data
      }
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 新增 删除选项 */
    toAddOrDelOptions: function(type) {
      if (type && type === 'add') { // 新增选项
        if (this.dataForm && this.dataForm.choiceOptionList && this.dataForm.choiceOptionList.length >= 6) {
          toast('暂不得超过6个选项')
          return false
        }
        this.dataForm.choiceOptionList.push({ optionId: '', optionIdCustom: String.fromCharCode((65 + this.dataForm.choiceOptionList.length)), code: String.fromCharCode((65 + this.dataForm.choiceOptionList.length)), content: '', questionsId: '', isRight: false })

        const lastIndex = this.dataForm.choiceOptionList.length
        this.dataForm.choiceOptionListContentObj[this.choiceOptionName + lastIndex] = ''
        if (tinyMCE.editors[this.choiceOptionName + lastIndex]) {
          tinyMCE.editors[this.choiceOptionName + lastIndex].setContent(this.dataForm.choiceOptionListContentObj[this.choiceOptionName + lastIndex])
        }
      } else if (type && type === 'del') { // 删除选项
        if (this.dataForm && this.dataForm.choiceOptionList && this.dataForm.choiceOptionList.length <= 3) {
          toast('至少需要3个选项')
          return false
        }
        const lastIndex = this.dataForm.choiceOptionList.length - 1
        if (this.dataForm.replyIds && this.dataForm.replyIds === this.dataForm.choiceOptionList[lastIndex].optionIdCustom) {
          this.dataForm.replyIds = ''
        }
        this.dataForm.choiceOptionList.pop() // 删除最后一个选项
        this.dataForm.choiceOptionListContentObj[this.choiceOptionName + lastIndex] = ''
        if (tinyMCE.editors[this.choiceOptionName + lastIndex]) {
          tinyMCE.editors[this.choiceOptionName + lastIndex].setContent(this.dataForm.choiceOptionListContentObj[this.choiceOptionName + lastIndex])
        }
        delete this.dataForm.choiceOptionListContentObj[this.choiceOptionName + lastIndex]
      }
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** CheckBox 点击事件 */
    checkBoxChange: function() {
      formVaildStyle(null, '.test-question-option-checkbox')
      $('.test-question-option-checkbox').removeClass('cb-form-valid')// 清除合法状态
      $('.test-question-option-checkbox').removeClass('cb-form-invalid')// 添加非法状态
      $('.tm-label-tx').css('display', 'none')
      $('.questionReplyIdsFeed').css('display', 'none')
      $('.addQuestionReplyIds').removeClass('cb-form-invalid')// 添加非法状态
      $('.addQuestionReplyIds').removeClass('cb-form-valid')// 添加非法状态
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 获取或者失去 焦点  */
    inputBlurOrFocus: function(name, index, event, type) {
      if (name && name === 'completionRight') {
        if (type && type === 'focus') {
          $('.tm-label-tx').css('display', 'none')
          formVaildStyle('.optionListFeedCompletion' + index, '.addTestOptionListCompletion' + index)
        } else {
          if (!this.dataForm.completionRightList[index].content) {
            formInVaildStyle('.optionListFeedCompletion' + index, '.addTestOptionListCompletion' + index)
          } else {
            formVaildStyle('.optionListFeedCompletion' + index, '.addTestOptionListCompletion' + index)
          }
        }
      }
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 复合题  添加题目 */
    toAddCompoundQuestions: function() {
      // 已有题目，判断是否填写完整
      if (this.dataForm.compoundQuestionsList && this.dataForm.compoundQuestionsList.length > 0) {
        const str = 'addQuestions_' + this.complexityIndex + '_' + this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsListIndex].currIndex
        if (this.$refs[str] && this.$refs[str][0] && !this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsListIndex].isEdit) {
          if (!this.$refs[str][0].formVerifyBoolean()) {
            return false
          }
        }
      }

      let currIndex = 1
      if (this.dataForm.compoundQuestionsList && this.dataForm.compoundQuestionsList.length > 0) {
        currIndex = this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsList.length - 1].currIndex + 1
      }
      const obj = this.initDataForm({ questionsType: '', currIndex: currIndex }, 'compoundQuestionsList')
      this.dataForm.compoundQuestionsList.push({ ...obj })
      this.$forceUpdate()
      this.dataForm.compoundQuestionsListIndex = (this.dataForm.compoundQuestionsList.length - 1)
      if (tinyMCE.editors[this.questionsName]) {
        tinyMCE.editors[this.questionsName].setContent(this.dataForm[this.questionsName])
      }
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 复合题 删除 题目 */
    toDelCompoundQuestions: function(targetName) {
      // let allNum = this.dataForm.compoundQuestionsList.length - 1
      // let currTmIndex = parseInt(this.dataForm.compoundQuestionsListIndex)
      // 删除当前题目
      const arrInt = parseInt(targetName)
      this.dataForm.compoundQuestionsList.splice(arrInt, 1)
      this.$forceUpdate()

      // 如果是第一题并且只有一个题目则重置题目
      if (!this.dataForm.compoundQuestionsList || (this.dataForm.compoundQuestionsList && this.dataForm.compoundQuestionsList.length < 1)) {
        const obj = this.initDataForm({ questionsType: '', currIndex: 1 }, 'compoundQuestionsList')
        this.dataForm.compoundQuestionsList.push({ ...obj })
      }

      this.dataForm.compoundQuestionsListIndex = this.dataForm.compoundQuestionsList.length - 1
      // 如果是最后一题，则当前题目序号-1
      // if ((currTmIndex === allNum) && (currTmIndex !== 0)) {
      //   this.dataForm.compoundQuestionsListIndex = currTmIndex - 1 + ''
      // } else {
      //   this.dataForm.compoundQuestionsListIndex = JSON.parse(JSON.stringify(currTmIndex + ''))
      // }
      this.$forceUpdate()
      // console.log('this.dataForm.compoundQuestionsListIndex', this.dataForm.compoundQuestionsListIndex)
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** tab 被选中时触发 */
    toClickCompoundQuestions: function(activeName) {
      // 已有题目，判断是否填写完整
      const str = 'addQuestions_' + this.complexityIndex + '_' + this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsListIndex].currIndex
      if (this.$refs[str] && this.$refs[str][0] && !this.dataForm.compoundQuestionsList[this.dataForm.compoundQuestionsListIndex].isEdit) {
        if (!this.$refs[str][0].formVerifyBoolean()) {
          return false
        }
      }
      this.dataForm.compoundQuestionsListIndex = activeName
      this.$emit('resultChange', { dataForm: this.dataForm })
    },
    /** 表单验证 */
    formVerifyBoolean: function() {
      $('[class^=SelectsFeed]').css('display', 'none')
      if (this.isShowMajorAndSubjects) {
        // 验证 题目职业路径--职业路径
        if (!this.dataForm.majorId) {
          this.selectVisibleChange('major', false)
          // $('.majorSelectsFeed').css('marginLeft', '0px')
          return false
        }
        this.selectVisibleChange('major', true)
        // 验证 题目课程体系--课程
        if (!this.dataForm.subjectId) {
          this.selectVisibleChange('subject', false)
          // $('.subjectSelectsFeed').css('marginLeft', '165px')
          return false
        }
        this.selectVisibleChange('subject', true)
        // 验证 题目章节
        // if (!this.dataForm.chaptersId) {
        //   this.selectVisibleChange('chapter', false)
        //   // $('.chapterSelectsFeed').css('marginLeft', '330px')
        //   return false
        // }
        this.selectVisibleChange('chapter', true)
      }
      // 验证 题目类型--选择、判断、简答
      if (!this.dataForm.questionsType) {
        this.selectVisibleChange('type', false)
        // $('.typeSelectsFeed').css('marginLeft', '525px')
        return false
      }
      this.selectVisibleChange('type', true)
      // 验证 题目难易程度
      if (!this.dataForm.questionsComplexity) {
        this.selectVisibleChange('complexity', false)
        // $('.complexitySelectsFeed').css('marginLeft', '640px')
        return false
      }
      this.selectVisibleChange('complexity', false)
      // 验证 题目名称
      // .replaceAll('<p>', '').replaceAll('&nbsp;', '').replaceAll('</p>', '')
      // .split('<p>').join('').split('&nbsp;').join('').split('</p>').join('')

      if (!this.dataForm[this.questionsName] || !lTrim(this.dataForm[this.questionsName].split('<p>').join('').split('&nbsp;').join('').split('</p>').join(''))) {
        formInVaildStyle('.' + this.questionsName + 'WrapperFeed', '.' + this.questionsName + 'Wrapper')
        // document.getElementById('addTestQuestionsNameId').scrollIntoView()
        this.$nextTick(() => {
          // let container = this.$el.querySelector('.test-question-left')
          // container.scrollTop = this.$el.querySelector('.majorSelectsFeed').offsetTop
          document.documentElement.scrollTop = this.$el.querySelector('.typeSelectsFeed').offsetTop
        })
        return false
      }
      formVaildStyle('.' + this.questionsName + 'WrapperFeed', '.' + this.questionsName + 'Wrapper')
      // 验证 选择题的选项
      if (this.dataForm.questionsType && (this.dataForm.questionsType === '1' || this.dataForm.questionsType === '2')) {
        let rightNum = 0
        if (this.dataForm.choiceOptionList && this.dataForm.choiceOptionList.length > 0) {
          const optionList = this.dataForm.choiceOptionList
          for (let i = 0; i < optionList.length; i++) {
            if (optionList[i].isRight) {
              rightNum++
            }
            // .replaceAll('<p>', '').replaceAll('&nbsp;', '').replaceAll('</p>', '')
            // .split('<p>').join('').split('&nbsp;').join('').split('</p>').join('')

            if (!optionList[i].content || !lTrim(optionList[i].content.split('<p>').join('').split('&nbsp;').join('').split('</p>').join(''))) {
              formInVaildStyle('.optionListFeed' + i, '.addTestOptionList' + i)
              if (i === 0) {
                this.$nextTick(() => {
                  document.documentElement.scrollTop = this.$el.querySelector('.' + this.questionsName + 'WrapperFeed').offsetTop
                })
              }
              return false
            }
            formVaildStyle('.optionListFeed' + i, '.addTestOptionList' + i)
          }
        }
        if ((this.dataForm.questionsType === '2' && rightNum < 2) || (this.dataForm.questionsType === '1' && !this.dataForm.replyIds)) {
          formInVaildStyle(null, '.test-question-option-checkbox')
          $('.tm-label-tx').css('display', 'block')
          // formInVaildStyle(null, '.tm-label-tx')
          this.$nextTick(() => {
            // let container = this.$el.querySelector('.test-question-left')
            // container.scrollTop = this.$el.querySelector('.questionsParseFeed').offsetTop
            document.documentElement.scrollTop = this.$el.querySelector('.' + this.questionsName + 'WrapperFeed').offsetTop
          })
          return false
        }
        formVaildStyle(null, '.test-question-option-checkbox')
        $('.tm-label-tx').css('display', 'none')
        // formVaildStyle(null, '.tm-label-tx')
        // $('.tm-label-tx').removeClass('cb-form-valid')// 清除合法状态
        // $('.tm-label-tx').removeClass('cb-form-invalid')// 添加非法状态
      } else if (this.dataForm.questionsType && this.dataForm.questionsType === '3') { // 验证 判断题的选项
        if (!this.dataForm.replyIds) {
          formInVaildStyle('.questionReplyIdsFeed', '.addQuestionReplyIds')
          return false
        }
        formVaildStyle('.questionReplyIdsFeed', '.addQuestionReplyIds')
      } else if (this.dataForm.questionsType && this.dataForm.questionsType === '5') {
        if (this.dataForm.completionRightList && this.dataForm.completionRightList.length > 0) {
          $('.tm-label-tx').css('display', 'none')
          formVaildStyle(null, '.' + this.questionsName + 'Wrapper')
          const completionRightList = this.dataForm.completionRightList
          for (let i = 0; i < completionRightList.length; i++) {
            // .replaceAll('<p>', '').replaceAll('&nbsp;', '').replaceAll('</p>', '')
            // .split('<p>').join('').split('&nbsp;').join('').split('</p>').join('')
            if (!completionRightList[i].content || !lTrim(completionRightList[i].content.split('<p>').join('').split('&nbsp;').join('').split('</p>').join(''))) {
              formInVaildStyle('.optionListFeedCompletion' + i, '.addTestOptionListCompletion' + i)
              if (i === 0) {
                this.$nextTick(() => {
                  document.documentElement.scrollTop = this.$el.querySelector('.' + this.questionsName + 'WrapperFeed').offsetTop
                })
              }
              return false
            }
            formVaildStyle('.optionListFeedCompletion' + i, '.addTestOptionListCompletion' + i)
          }
        } else {
          $('.tm-label-tx').css('display', 'block')
          formInVaildStyle(null, '.' + this.questionsName + 'Wrapper')
          this.$nextTick(() => {
            document.documentElement.scrollTop = this.$el.querySelector('.typeSelectsFeed').offsetTop
          })
          return false
        }
      } else if (this.dataForm.questionsType && this.dataForm.questionsType === '6') {
        const compoundQuestionsList = this.dataForm.compoundQuestionsList
        if (compoundQuestionsList && compoundQuestionsList.length > 0) {
          for (let i = 0; i < compoundQuestionsList.length; i++) {
            // 已有题目，判断是否填写完整
            const str = 'addQuestions_' + this.complexityIndex + '_' + compoundQuestionsList[i].currIndex
            if (this.$refs[str] && this.$refs[str][0]) {
              if (!this.$refs[str][0].formVerifyBoolean()) {
                return false
              }
            }
          }
        }
      }
      // 验证 题目解析
      // if (!this.dataForm.questionsParse) {
      //   formInVaildStyle('.questionsParseFeed', '.addTestQuestionsParse')
      //   this.$nextTick(() => {
      //     // let container = this.$el.querySelector('.test-question-left')
      //     // container.scrollTop = this.$el.querySelector('.questionsNameFeed').offsetTop
      //     document.documentElement.scrollTop = this.$el.querySelector('.questionsNameFeed').offsetTop
      //   })
      //   return false
      // }
      // formVaildStyle('.questionsParseFeed', '.addTestQuestionsParse')
      return true
    },
    /** 添加初始化题目 */
    initDataForm: function(oldObj = {}, type = '') {
      this.clearAllFormValid()
      const obj = {
        hasEditPermission: oldObj.hasEditPermission, // 已经添加到题目的题目 是否可以编辑
        questionsId: (oldObj && oldObj.questionsId) ? (oldObj.questionsId) : '',
        majorId: (oldObj && oldObj.majorId) ? (oldObj.majorId) : '',
        subjectId: (oldObj && oldObj.subjectId) ? (oldObj.subjectId) : '',
        chaptersId: (oldObj && oldObj.chaptersId) ? (oldObj.chaptersId) : '',
        questionsComplexity: (oldObj && oldObj.questionsComplexity) ? (oldObj.questionsComplexity) : ((this.questionsComplexityListInit && this.questionsComplexityListInit[0] && this.questionsComplexityListInit[0].dictCode) ? (this.questionsComplexityListInit[0].dictCode) : ''), // 难易程度 1简答2普通3困难
        questionsType: (oldObj && oldObj.questionsType) ? (oldObj.questionsType) : ((this.questionsTypeListInit && this.questionsTypeListInit[0] && this.questionsTypeListInit[0].dictCode) ? (this.questionsTypeListInit[0].dictCode) : ''), // 题目类型  1单选择 2 多选 3判断 4问答
        replyIds: (oldObj && oldObj.replyIds) ? (oldObj.replyIds) : '', // 题目正确答案，多个用逗号隔开
        choiceOptionList: (oldObj && oldObj.choiceOptionList && oldObj.choiceOptionList.length > 0) ? (oldObj.choiceOptionList) : [], // 选择题题目数组
        optionList: (oldObj && oldObj.optionList && oldObj.optionList.length > 0) ? (oldObj.optionList) : [], // 判断题题目数组
        completionRightList: (oldObj && oldObj.completionRightList && oldObj.completionRightList.length > 0) ? (oldObj.completionRightList) : [], // 填空正确答案 数组
        completionRightListIndex: (oldObj && oldObj.completionRightListIndex) ? (oldObj.completionRightListIndex) : 0, // 填空题的 点击 添加 填空符 的总数 包括已经删除了的
        compoundQuestionsList: (oldObj && oldObj.compoundQuestionsList && oldObj.compoundQuestionsList.length > 0) ? (oldObj.compoundQuestionsList) : [], // 复合题题目 数组
        currIndex: (oldObj && oldObj.currIndex) ? (oldObj.currIndex) : 1, // 复合题题目数组的数量，包括删除了的
        compoundQuestionsListIndex: (oldObj && oldObj.compoundQuestionsListIndex) ? (oldObj.compoundQuestionsListIndex) : 0, // 复合题题目 数组当前的下标
        isEdit: (oldObj && oldObj.isEdit) ? (oldObj.isEdit) : false // 是否是编辑状态
      }
      obj.questionsTypeName = this.findDictName(this.questionsTypeListInit, obj.questionsType)
      obj.questionsComplexityName = this.findDictName(this.questionsComplexityListInit, obj.questionsComplexity)
      // 题目名称
      obj[this.questionsName] = (oldObj && oldObj[this.questionsName]) ? (oldObj[this.questionsName]) : '' // 题目名称

      if (obj.questionsType && obj.questionsType !== '5' && !obj.isEdit && obj[this.questionsName] && obj[this.questionsName].indexOf('cd-test-completion-') > -1) { // 新增的时候如果是填空题切换到其他类型的题目，则清除 题目名称的值
        obj[this.questionsName] = ''
        // console.log('44444444444obj[this.questionsName].', obj[this.questionsName])
      }
      if (tinyMCE.editors[this.questionsName]) {
        tinyMCE.editors[this.questionsName].setContent(obj[this.questionsName])
      }

      // 题目解析
      obj[this.questionsParseName] = (oldObj && oldObj[this.questionsParseName]) ? (oldObj[this.questionsParseName]) : '' // 题目解析

      if (tinyMCE.editors[this.questionsParseName]) {
        tinyMCE.editors[this.questionsParseName].setContent(obj[this.questionsParseName])
      }

      // 如果选项选项为 空 则 赋值
      if ((!obj.choiceOptionList || (obj.choiceOptionList && obj.choiceOptionList.length < 1))) {
        obj.choiceOptionList = []
        for (let a = 0; a < 4; a++) { // content选项内容;  code 项编码  String.fromCharCode((65 + a)) 65+0相当与A字母
          obj.choiceOptionList.push({ optionId: '', optionIdCustom: String.fromCharCode((65 + a)), code: String.fromCharCode((65 + a)), content: '', questionsId: '', isRight: false })
        }
      }

      // 根据 choiceOptionList 为 choiceOptionListContentObj 赋值
      obj.choiceOptionListContentObj = {} // 选择题题目数组 的 选项输入框的值的对象
      obj.choiceOptionList.forEach((item, index) => {
        obj.choiceOptionListContentObj[this.choiceOptionName + index] = item.content
        if (tinyMCE.editors[this.choiceOptionName + index]) {
          tinyMCE.editors[this.choiceOptionName + index].setContent(item.content)
        }
      })

      // 如果判断选项为 空 则 赋值
      if ((!obj.optionList || (obj.optionList && obj.optionList.length < 1))) {
        obj.optionList = [
          { code: 'A', content: '✓', optionId: '', questionsId: '', isRight: false, optionIdCustom: 'A' },
          { code: 'B', content: '×', optionId: '', questionsId: '', isRight: false, optionIdCustom: 'B' }
        ]
      }

      if (obj.questionsType === '6' && type && type === 'root') {
        this.getEditorNavWidth()
        if (obj.compoundQuestionsList && obj.compoundQuestionsList.length > 0) {
          obj.compoundQuestionsList.forEach(ele => {
            ele = { ...this.initDataForm(ele, 'compoundQuestionsList') }
          })
        } else {
          obj.compoundQuestionsList = []
          obj.compoundQuestionsListIndex = 0
          const objc = this.initDataForm({ questionsType: '' }, 'compoundQuestionsList')
          obj.compoundQuestionsList.push({ ...objc })
        }
      }
      // console.log('5555bj[this.questionsName].', obj)

      return obj
    },
    /** 下拉框出现 或者 隐藏时触发 */
    selectVisibleChange: function(name, event) {
      if (event) { // 下拉框出现时触发
        formVaildStyle('.' + name + 'SelectsFeed', '.select-' + name)
      } else { // 下拉框隐藏时触发
        let named = ''
        if (name === 'major') {
          named = 'majorId'
        } else if (name === 'subject') {
          named = 'subjectId'
        } else if (name === 'chapter') {
          named = 'chaptersId'
        } else if (name === 'type') {
          named = 'questionsType'
        } else if (name === 'complexity') {
          named = 'questionsComplexity'
        }
        if (name !== 'chapter') {
          if (!this.dataForm[named]) {
            formInVaildStyle('.' + name + 'SelectsFeed', '.select-' + name, true)
            this.$nextTick(() => { // 跳到未填写的位置
              document.documentElement.scrollTop = 0
            })
          } else {
            // $('.selects-feed-wrapper').css('height', '0px')
            formVaildStyle('.' + name + 'SelectsFeed', '.select-' + name)
          }
        }
      }
    },
    /** 获取 课程 技术 数组 */
    getSubjectsList: function(isChange = false) {
      if (isChange) {
        this.dataForm.subjectId = ''
      }
      this.subjectsList = []
      // 查询出所有技术信息
      const data = {
        majorId: this.dataForm.majorId
      }
      this.$api.perseverancePlate.listSubjects(data).then(res => {
        if (res.data && res.data.length > 0) {
          this.subjectsList = res.data
        }
      })

      this.getChaptersList(isChange)
    },
    /** 获取 章节  数组 */
    getChaptersList: function(isChange) {
      if (isChange) {
        this.dataForm.chaptersId = ''
      }
      this.chaptersList = []
      // 查询出所有技术信息
      const data = {
        subjectId: this.dataForm.subjectId
      }
      this.$api.perseverancePlate.listChapters(data).then(res => {
        if (res.data && res.data.length > 0) {
          this.chaptersList = res.data
          if (isChange) {
            this.dataForm.chaptersId = this.chaptersList[0].dictCode
          }
        }
      })
    },
    /** 清空所有验证 */
    clearAllFormValid: function() {
      $('.cb-form-valid').removeClass('cb-form-valid') // 清除合法状态
      $('.cb-form-invalid').removeClass('cb-form-invalid') // 清除非法状态
      $('.invalid-feedback').css('display', 'none')
      $('.optionListFeed').css('display', 'none')
      $('.optionListFeedMultiple').css('display', 'none')
      $('.tm-label-tx').css('display', 'none')
      $('.questionReplyIdsFeed').css('display', 'none')
      $('.questionsNameFeed').css('display', 'none')
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
      return ''
    }

  }
}
</script>

<style scoped>
    .select-major{
      width: 150px;
      margin-right: 10px;
    }
    .select-subject{
      width: 150px;
      margin-right: 10px;
    }
    .select-chapter{
      width: 180px;
      margin-right: 10px;
    }
    .select-type{
      width: 120px;
      margin-right: 10px;
    }
    .select-complexity{
      width: 80px;
    }
    .tm-label{
      /* padding: 10px 0; */
      padding-top: 0px;
      padding-bottom: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
    }
    .tm-label > span{
      margin-right: 10px;
      /* display: inline-block; */
    }
    .tm-label-icons-plus,
    .tm-label-icons-minus{
      border: 1px solid #000;
      font-size: 12px;
      padding: 4px;
      cursor: pointer;
    }
    .tm-label-icons-plus{
      margin-left: 20px;
      margin-right: 15px !important;
    }
    .tm-label-tx{
      color: red;
      margin-left: 30px;
      margin-right: 30px !important;
      padding: 0px 5px;
      display: none;
      box-sizing: border-box;
    }
    .tm_label_answers{
      margin-left: 30px;
    }
    .tm-label div{
      color: red;
      display: inline-block;
    }
    .test-question-option-wrapper{
      /* display: flex;
      align-content: center;
      align-items: stretch; */
      /* margin-bottom: 10px; */
    }
    .test-question-option-wrapper .selects-feed-wrapper .optionListFeed{
      margin-left: 95px;
      height: 100%;
      /* background-color: gold; */
    }
    .test-question-option-inner{
      display: flex;
      align-content: center;
      align-items: stretch;
      /* margin-bottom: 10px; */
    }
    .test-question-option-checkbox,
    .test-question-option-completion-label{
      background-color: #eee;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 0;
      width: 95px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .test-question-option-checkbox{
      line-height: 95px;
    }
    .test-question-option-editor{
      width: 100%;
    }
    .addQuestionReplyIds{
      width: 100%;
      /* background-color: red; */
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
    }
    .addQuestionReplyIds label{
      margin-bottom: 0;
    }
    .test-question-option-checkbox.cb-form-invalid,
    .tm-label-tx.cb-form-invalid,
    .addQuestionReplyIds.cb-form-invalid{
      border: 1px solid #dc3545;
    }
    .test-question-option-checkbox.cb-form-valid,
    .tm-label-tx.cb-form-valid,
    .addQuestionReplyIds.cb-form-valid{
      border: 1px solid  #28a745;
    }
    .selects-feed-wrapper{
      position: relative;
       height: 18px;
      box-sizing: border-box;
      /* height: 20px; */
      /* display: flex; */
      /* align-items: center; */
    }
    .selects-feed-wrapper .invalid-feedback{
      margin-top: 0;
    }
    .selectsFeeds{
      /* display: inline-block !important; */
      position: absolute;
      left: 0;
      height: 20px;
    }
    .majorSelectsFeed{
      width: 150px;
      margin-right: 10px;
      left: 0px;
    }
    .subjectSelectsFeed{
      width: 150px;
      margin-right: 10px;
      left: 165px;
    }
    .chapterSelectsFeed{
      width: 180px;
      margin-right: 10px;
      left: 330px;
    }
    .typeSelectsFeed{
      width: 100px;
      margin-right: 10px;
       left: 525px;
    }
    .complexitySelectsFeed{
      width: 150px;
      margin-right: 10px;
      left: 660px;
    }
    .testQuesCompletionAddBtn{
        background-color: #3198ed;
        color: #fff !important;
        cursor: pointer;
        border-radius: 4px;
        padding: 4px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        bottom: 5px;
    }
    .testQuesCompletionAddBtn > span:first-child{
      padding-right: 4px;
      box-sizing: border-box;
    }
    .testQuesCompletionAddBtn:hover{
        background-color: #3198ed;
        opacity: 0.8;
    }
    .compound-list-wwrapper{
      padding: 5px;
      /* border: 1px solid #E4E7ED;
      border-top: none; */
    }

    /* =============  自定义 tab页 样式 begin  ================= */
    .custom-tabs-header-nav{
       position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height:39px;
        background-color: #f5f5f5;
        color: #666;
        font-size: 14px;
        /* border-bottom: 1px solid #dee2e6; */
        /* overflow-x: scroll; */
        margin-bottom: 10px;
    }
    .custom-tabs-header-nav .editor-nav-bottom-line{
      background-color: #dee2e6;
      width: 100%;
      height: 1px;
      position: absolute;
      bottom: 1px;
    }
    .custom-tabs-header-nav .editor-arrow{
      background-color: #f5f5f5;
      height: 100%;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .custom-tabs-header-nav .editor-nav{
      /* width: calc(100% - 40px); */
      width: 100%;
      display: flex;
      align-items: center;
      height:100%;
      z-index: inherit;
      position: relative;
      overflow: hidden;
      /* padding-left: 5px; */
      box-sizing: border-box;
    }
    /* .editor-nav-test-activity{
      padding-left: 10px;
    } */
    .custom-tabs-header-nav .editor-nav > div{
      width: 90px;
    }
    .custom-tabs-header-nav  .editor-nav .editor-nav-item-wrapper{
      width: 90px;
      height:100%;
      line-height: 36px;
      cursor: pointer;
      user-select: none;
      overflow: hidden;
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      margin-bottom: -2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .custom-tabs-header-nav  .editor-nav .editor-nav-item{
        width: 90px;
        height:100%;

        line-height: 36px;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        margin-bottom: -1px;

        display: flex;
        align-items: center;
        justify-content: center;
        /* border-top: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6; */
        /* border-bottom: 1px solid #dee2e6; */
    }
    /* .custom-tabs-header-nav  .editor-nav .editor-nav-item:first-child{
      border-left: 1px solid #dee2e6;
    }
    .custom-tabs-header-nav  .editor-nav .editor-nav-item:last-child{
      border-right: 1px solid #dee2e6;
    } */
    .custom-tabs-header-nav .editor-nav .editor-nav-item:hover{
        color: #FF740E;
    }
    .custom-tabs-header-nav .editor-nav .active-editor-nav-wrapper{
      z-index: 5;
    }
    .custom-tabs-header-nav .editor-nav .active-editor-nav{
        background-color: #ffffff;
        color: #0079fe !important;
        border-top: 1px solid #dee2e6;
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;
        border-bottom: none;
    }
     .custom-tabs-header-nav .del-edit-nav-btn{
        cursor: pointer;
        display: flex;
        align-items:center;
        justify-content: center;
        font-size: 18px;
        width: 28px;
        height: 28px;
        /* line-height: 32px; */
        border-radius: 50%;
        margin-left: 5px;
    }
    .custom-tabs-header-nav .del-edit-nav-btn:hover{
        background-color: #dadada;
    }
    /* =============  自定义 tab页 样式 end  ================= */

    /* 设置编辑器的最小高度 */
    .add-test-question-tree /deep/ .tox{
      min-height: 150px !important;
    }
</style>
