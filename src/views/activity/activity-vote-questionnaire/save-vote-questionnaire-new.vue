<!-- 新增投票问卷页面 -->
<template>
    <div class="vote-questionnaire">
        <!-- 当前位置路径显示开始 -->
        <div class="present-localtion">
            <!-- 位置显示 -->
            <div>
              当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
            </div>
            <!-- 返回操作 -->
            <div class="classroom-back">
                <!-- 返回图标 -->
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <!-- 返回文字 -->
                <span @click="goToPageActivityList()">返回</span>
            </div>
        </div>
        <!-- 当前位置路径显示结束 -->
        <!-- 投票问卷表单开始 -->
        <form>
            <div class="form-top">
                <!-- <div class="add-msg"><b>{{pageTitle}}</b></div> -->
                <!-- 测试代码，当前题目: {{currentQuestionItem}} 查看状态{{isView}} -->
                <!-- 题目 begin -->
                <div class="add-question-con">
                  <!-- 题目选项 end -->


                  <!-- 活动基本信息 begin -->
                  <div style="margin: 20px 0 10px;display: flex;">
                    <!-- 活动标题 begin -->
                    <div style="width: 48%;">
                      <div style="text-align: left">标题</div>
                      <el-input
                        :disabled="isView"
                        v-model="voteQuestionnaireInfo.activityTitle"
                        id="activityTitle"
                        type="text"
                        placeholder="请输入投票问卷标题"
                        style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
                      <div class="invalid-feedback col-10 textAlignLeft p-0 questionnaireTitleHint"><small >请填写标题！</small></div>
                    </div>
                    <!-- 活动标题 end -->
                    <!-- 所属章节 begin -->
                    <div style="width: 48%;margin-left:4%;">
                      <div style="text-align: left">所属章节</div>
                      <div style="margin-top: 9px">
                        <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="voteQuestionnaireInfo.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || isView">
                        </el-cascader>
                        <div class="invalid-feedback col-10 textAlignLeft p-0 empiricalValueHint"><small >请选择章节！</small></div>
                      </div>
                    </div>
                    <!-- 所属章节 end -->
                  </div>
                  <!-- 活动基本信息 end -->
                  <!-- 投票后立即显示结果 begin -->
                  <div style="margin: 20px 0;">
                    <div class="custom-control custom-checkbox" style="text-align: left">
                      <input
                        :disabled="isView"
                        v-model="voteQuestionnaireInfo.isShow"
                        true-value="Y"
                        false-value="N"
                        type="checkbox"
                        class="custom-control-input"
                        id="VoteCheck1">
                      <label class="custom-control-label" for="VoteCheck1">投票后立即显示结果</label>
                    </div>
                    <div style="font-size: 14px;color: #8c8c8c;text-align: left;margin: 10px 0;">投票后立即显示结果选项，学生将在提交投票结果后查看到投票/问卷的总体结果，学生只能投一次票，且提交后不能更改</div>
                  </div>
                  <!-- 投票后立即显示结果 end -->
                  <div style="font-size: 14px;color: #ff5524;text-align: left;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>
                    <!-- 题目序号 begin -->
                    <div class="question-list">
                        <!-- 题目大于一个题时  所有题目序号显示 -->
                        <div
                          :class="['question-number','question-number'+index,index===currentQuestionItem?'active-question-number':'']"
                          @click="handleCutQuestion(index)"
                          v-for="(question,index) in questionList"
                          :key="index"
                          v-if="currentQuestionItem < 7 && index < 13 || currentQuestionItem >= 7 && currentQuestionItem <= questionList.length - 7 && index < (currentQuestionItem + 7) && index > (currentQuestionItem - 7) || currentQuestionItem > questionList.length - 7 && index > questionList.length - 14"
                        >
                          <span>第{{index+1}}题</span>
                          <i
                            class="fa fa-times"
                            style="height: 16px;"
                            aria-hidden="true"
                            @click.stop="handleDelQuestion(index+1)"
                            v-if="(questionList.length > 1) && (currentQuestionItem === index) && hasPermission && !isView"></i>
                        </div>
                        <!-- 题目等于一个题时  题目序号显示 -->
                        <div class="question-number active-question-number" v-if="questionList.length<=0">
                          <span>第1题</span>
                        </div>
                        <!-- 添加题目按钮显示 -->
                        <div v-if="(hasPermission || hasAddActPermission) && !isView"
                          @click="handleAddQuestion"
                          class="add-question-btn">
                          <img src="static/image/teaching_package/add_2.png" alt="">
                      </div>
                    </div>
                    <!-- <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
                      <el-tab-pane
                        :key="index"
                        v-for="(item, index) in questionList"
                        :label="index"
                        :name="index"
                      >
                      </el-tab-pane>
                    </el-tabs> -->
                    <!-- 题目序号 end -->
                    <div class="edit-question-con">
                        <!-- 题目名称 begin -->
                        <div class="question-stem">
                            <div style="text-align: left">题干<span style="color:red;">*</span></div>
                            <el-input type="textarea" class="questionName" id="questionName" rows="5" cols="100"
                              :disabled="isView"
                              v-model="questionList[currentQuestionItem].questionName"
                              placeholder="请输入题干，最多500字"></el-input>
                            <div class="invalid-feedback col-10 textAlignLeft p-0 questionsNameHint"><small >请选择填写题干！</small></div>
                        </div>
                        <!-- 题目名称 end -->
                        <!-- 题目类型 begin -->
                        <div class="question-type">
                            <div class="custom-control custom-radio custom-control-inline"
                              style="margin-left: 20px;"
                              v-for="(dict,index) in questionTypeList"
                              :key="index"
                            >
                                <input class="custom-control-input cursor"
                                  :id="'VoteRadioInline'+index"
                                  name="customRadioInline1" type="radio"
                                  :disabled="(isView)"
                                  v-model="questionList[currentQuestionItem].questionType"
                                  :value="dict.dictCode"
                                  @click="switchTopicType(questionList[currentQuestionItem].questionType)"
                                >
                                <label class="custom-control-label cursor" :for="'VoteRadioInline'+index">{{dict.dictValue}}</label>
                            </div>
                        </div>
                        <!-- 题目类型 end -->
                        <!-- 题目选项 选择题 beign -->
                        <div class="question-option-list" v-show="questionList[currentQuestionItem].questionType!=='3'">
                            <div
                            class="question-option-box"
                            :key="index"
                            v-for="(answerItem,index) in answerItemListCom">
                              <div  class="question-option" >
                                  <b>{{answerItem.optionCode}}:</b>
                                  <div class="input-group">
                                      <el-input
                                        :disabled="isView"
                                        :id="'optionName'+index"
                                        v-model="answerItem.optionName"
                                        type="text"
                                        class="optionName" ></el-input>
                                      <!--<b-button
                                        v-if="!isView"
                                        style="min-width:130px;"
                                        @click="handleSetRightAnswer(answerItem,index)"
                                        :variant="answerItem.isRight==='N'?'outline-primary':'primary'">{{answerItem.isRight | filterAnswerSetText}}</b-button>-->
                                  </div>
                                  <el-checkbox v-model="answerItem.canFill" true-label="Y" false-label="N" :disabled="isView">选中可填写</el-checkbox>
                                  <el-button v-if="!isView" type="danger" icon="el-icon-delete" size="mini" circle @click="deleAnswerOption(index)"></el-button>
                                  <!-- <img


                                    class="del-option"
                                    title="删除选项"
                                    src="static/image/teaching_package/delete_2.png"
                                    alt="删除选项"> -->
                              </div>
                              <div :class="['invalid-feedback','col-10','option-hint','p-0','questionsoptionHint'+index]"><small >问题选项不能为空！</small></div>
                          </div>
                        </div>
                        <div class="add-question-option-btn"
                          v-if="hasPermission && (!isView || isEdit) && questionList[currentQuestionItem].questionType!=='3'"
                          @click="handleAddAnswerOption"
                        >+  添加选项
                        </div>
                        <!-- 题目选项 end -->
                        <!-- 活动标题 begin -->
                        <!--<div style="width: 95%;margin: 20px auto">
                          <div style="text-align: left">标题</div>
                          <input
                              :disabled="isView"
                              v-model="voteQuestionnaireInfo.activityTitle"
                              id="activityTitle"
                              type="text"
                              class="form-control"
                              placeholder="请输入投票问卷标题"
                              style="font-size: 14px;height: 36px;margin-top: 10px">
                          <div class="invalid-feedback col-10 textAlignLeft p-0 questionnaireTitleHint"><small >请填写标题！</small></div>
                        </div>
                        &lt;!&ndash; 活动标题 end &ndash;&gt;
                        &lt;!&ndash; 活动基本信息 begin &ndash;&gt;
                        <div style="width: 95%;margin: 10px auto;display: flex">
                          &lt;!&ndash; 活动分组 begin &ndash;&gt;
                          <div style="width: 48%;margin-right: 2%">
                            <div style="text-align: left">分组</div>
                            <div>
                              <select
                                :disabled="isView"
                                v-model="voteQuestionnaireInfo.resgroupId"
                                id="questionnaireGroup"
                                class="form-control"
                                style="font-size: 14px;height: 36px;margin-top: 10px">
                                <option
                                  :key="indexItem"
                                  :value="group.dictCode"
                                  v-for="(group,indexItem) in listActivityGroup"
                                  >{{group.dictValue}}</option>
                              </select>
                              <div class="invalid-feedback col-10 textAlignLeft p-0 questionnaireGroupHint"><small >请选择分组！</small></div>
                            </div>
                          </div>
                          &lt;!&ndash; 活动分组 end &ndash;&gt;
                          &lt;!&ndash; 经验值 begin &ndash;&gt;
                          <div style="width: 48%;margin-left: 2%">
                            <div style="text-align: left">所属章节</div>
                            <div style="margin-top: 9px">
                              <cb-tree :parent-vue="this._self"
                                       id="vo-page-tree"
                                       type="select"
                                       :z-nodes="zNodes"
                                       id-key="chapterId"
                                       p-id-key="parentId"
                                       name="chapterName"
                                       width="50"
                                       :defaultValue="chapterId !== '' ? chapterId : (voteQuestionnaireInfo.chapterId)"
                                       :disabled="disabledSelectTree || isView"
                                       @onclick="onclick"
                              ></cb-tree>
                              <div class="invalid-feedback col-10 textAlignLeft p-0 empiricalValueHint"><small >请选择章节！</small></div>
                            </div>
                          </div>
                          &lt;!&ndash; 经验值 end &ndash;&gt;
                        </div>
                        &lt;!&ndash; 活动基本信息 end &ndash;&gt;
                        &lt;!&ndash; 投票后立即显示结果 begin &ndash;&gt;
                        <div style="width: 95%;margin: 20px auto">
                          <div class="custom-control custom-checkbox" style="text-align: left">
                            <input
                              :disabled="isView"
                              v-model="voteQuestionnaireInfo.isShow"
                              true-value="Y"
                              false-value="N"
                              type="checkbox"
                              class="custom-control-input"
                              id="VoteCheck1">
                            <label class="custom-control-label" for="VoteCheck1">投票后立即显示结果</label>
                          </div>
                          <div style="font-size: 14px;color: #8c8c8c;text-align: left;width: 95%;margin: 10px auto">投票后立即显示结果选项，学生将在提交投票结果后查看到投票/问卷的总体结果，学生只能投一次票，且提交后不能更改</div>
                        </div>
                        &lt;!&ndash; 投票后立即显示结果 end &ndash;&gt;
                        <div style="font-size: 14px;color: #ff5524;text-align: left;width: 95%;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>-->
                    </div>
                  <!-- 保存区域 begin -->
                  <div style="width: 94%;margin: 40px 3%;text-align: center" v-if="!isView">
                    <button
                      :disabled="(isView || isViewSave)" v-if="!isView"
                      @click="saveVoteQuestionnaireInfo"
                      type="button"
                      class="btn btn-outline-primary"
                      style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
                    <button
                      @click="handelvoteQuestionnaireInfo"
                      type="button"
                      class="btn btn-outline-secondary"
                      style="font-size: 14px;width: 100px;margin-left: 10px">{{isView ? '返回' : '取消'}}</button>
                  </div>
                  <!-- 保存区域 end -->
                </div>
                <!-- 题目 end -->
            </div>
        </form>
        <!-- 投票问卷表单结束 -->
    </div>
</template>

<script>
// 引入的一些工具
import {
  baseUrl,
  toast,
  alert,
  confirm,
  loadingModal,
  formVaildStyle,
  formInVaildStyle
  }
from '@/utils/global'
import CbTree from '@/components/cb-tree/index'
export default {
  name: 'save-vote-questionnaire-new',
  components: {
    CbTree

  },
  props: {
    // 权限标识
    hasPermission: {
      type: Boolean,
      required: true,
      default: true
    },
    // 权限标识
    hasAddActPermission: {
      type: Boolean,
      required: false,
      default: false
    },
    // 教学包主键
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    subjectId: {
      type: String,
      required: true,
      default: ''
    },
    // 活动主键，修改、查看、时必传
    activityId: {
      type: String,
      required: true,
      default: ''
    },
    // 是否为编辑状态，编辑状态下，原有的题目不允许修改题目类型
    isEdit: {
      type: Boolean,
      required: true,
      default: true
    },
    // 是否为查看状态，所有按钮禁用，也不允许输入任何文本
    isView: {
      type: Boolean,
      required: true,
      default: false
    },
    // 所属章节
    chapterId: {
      type: String,
      required: true,
      default: '',
    },
  },

  filters: {
    filterAnswerSetText(value){
      return value === 'N' ? '设为正确答案' : '正确答案'
    },
  },
  data () {
    return {
      props:{
        checkStrictly: true,
        value:'chapterId',
        label:'chapterName'
      },
      disabledSelectTree: false, // 是否禁选下拉树
      zNodes: [],   //所有章节数据
      setting: {
        data: {
          key: {
            name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
          },
        }
      },
      pageTitle: '创建投票问卷',
      presentIsEditStates: false,
      //所有创建的题目数据
      questionList: [
        {
          questionId: '',
          questionName: '',
          questionType: '1',
          presentIsEditStates: false, // 此题是否处于编辑状态
          children: [
            {optionId: '', optionCode: 'A', optionName:'',  isRight: 'N',canFill: 'N'},
            {optionId: '', optionCode: 'B', optionName:'', isRight: 'Y',canFill: 'N'},
            {optionId: '', optionCode: 'C', optionName:'', isRight: 'N',canFill: 'N'},
            {optionId: '', optionCode: 'D', optionName:'', isRight: 'N',canFill: 'N'}
          ]
        }
      ],
      //当前选中的问题
      questionObj:{
        questionId:'',
        questionName:'',
        questionType:'1',
        //答案选项
        children:[
          {optionId:'', optionCode:'', optionName:'', isRight:'Y',canFill: 'N'},
          {optionId:'', optionCode:'', optionName:'', isRight:'N',canFill: 'N'},
          {optionId:'', optionCode:'', optionName:'', isRight:'N',canFill: 'N'},
          {optionId:'', optionCode:'', optionName:'', isRight:'N',canFill: 'N'}
        ]
      },
      questionState:false,//问题状态 false表示处于编辑状态 true表示切换题目状态
      currentQuestionItem: 0, // 当前选中题目
      questionTypeList: [], // 题目类型
      empiricalValueList:[2, 4, 6, 8, 10], // 供选择的经验值
      listActivityGroup: [], // 活动分组
      voteQuestionnaireInfo:{//投票问卷信息
        activityId: "",
        pkgId: "",
        chapterId: [],
        activityTitle: "",
        resgroupId: '0',
        empiricalValue: '2',
        isShow: "N",
        json:[] // 题目
      },
      isViewSave: false,
    }
  },
  methods: {

    /**
     *  存入选中的章节
     */
     onclick (treeNode, nodes, isMultiple) {
      this.voteQuestionnaireInfo.chapterId = treeNode.chapterId
    },

    /**
     * 跳页面
     */
    goToPageActivityList () {
      //清空当前页面数据
      this.clearvoteQuestionnaireInfo();
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$emit("changeVotoQuestionnairePage", false)
    },

    /**
     * 切换题目
     */
    handleCutQuestion (index) {
      //当前题目编写完才能切换
      if(this.currentQuestionVerifyBoolean()){
        this.currentQuestionItem = index;
        this.questionState=true;
      }else {
        if(index != this.currentQuestionItem){
          toast("请填写完当前题再切换");
        }
      }
    },

    /**
     * 添加题目
     */
    handleAddQuestion () {
      // 当前题目是否创建完成
      if (this.currentQuestionVerifyBoolean()){
        //清空当前题目数据
        this.clearQuestionForm();
        // 添加题目
        this.createQuestionInfo();
        //当前题目位置定位到新题目
        this.currentQuestionItem = this.questionList.length - 1;
      } else {
        toast('当前题目未完成，请完成当前题目，方可创建添加题目！');
      }
    },

    /**
     * 删除题目
     */
    handleDelQuestion (index) {
      let that = this;
      confirm("是否删除第"+ index +"题",function () {
        that.questionList.splice(that.currentQuestionItem,1);
        if(that.currentQuestionItem !== 0){
          that.currentQuestionItem--;
        }
      });
    },

    /**
     * 验证当前题目是否填写完成
     */
    currentQuestionVerifyBoolean () {
      //验证题目题干
      if(!this.questionList[this.currentQuestionItem].questionName){
        $(".questionsNameHint").html("请选择填写题干！");
        formInVaildStyle('.questionsNameHint',"#questionName");
        $("#questionName").css('borderColor','#dc3545');
        return false;
      } else{

      }
      $("#questionName").removeAttr("style");
      //如果不是简答题、还需验证选项是否全部填写
      if(this.questionList[this.currentQuestionItem].questionType != '3') {
        formVaildStyle('.questionsNameHint', "#questionName");
        for (let i = 0; i < this.questionList[this.currentQuestionItem].children.length > 0; i++) {
          if (!this.questionList[this.currentQuestionItem].children[i].optionName) {
            formInVaildStyle('.questionsoptionHint' + i, "#optionName" + i);
            $("#optionName" + i).css('borderColor','#dc3545');
            return false;
          }
          formVaildStyle('.questionsoptionHint' + i, "#optionName" + i);
          $("#optionName" + i).removeAttr("style");
        }
      }
      return true;
    },


    /**
     * 添加选项
     */
    handleAddAnswerOption () {
      let obj = { optionId:'', optionCode:'', optionName:'', isRight:'N',canFill: 'N' }
      this.questionList[this.currentQuestionItem].children.push(obj)
    },

    /**
     * 删除选项
     */
    deleAnswerOption (index) {
      //删除选项时判断选择题选项不能少于三个
      if (this.questionList[this.currentQuestionItem].questionType !== 3) {
        if (this.questionList[this.currentQuestionItem].children.length<=3) {
          let hintString = (this.questionList[this.currentQuestionItem].questionType==='1'?'当前为单选题，选项不能少于3个':'当前为多选题，选项不能少于3个');
          toast(hintString);
          return;
        }
      }
      //截取选项
      this.questionList[this.currentQuestionItem].children.splice(index,1);
      this.presentCorrectAnswer=this.questionList[this.currentQuestionItem].children.filter(item=>item.isRight==='Y');
      if (this.presentCorrectAnswer >= 0){
        this.questionList[this.currentQuestionItem].children[0].isRight = "Y";
      }
    },

    /**
     * 设置正确答案
     */
    handleSetRightAnswer(answerItem,currentIndex){
      //单选
      if (this.questionList[this.currentQuestionItem].questionType==='1') {
        this.presentCorrectAnswer=this.questionList[this.currentQuestionItem].children.filter(item=>item.isRight==='Y')
        if (this.presentCorrectAnswer.length<=0) {
          this.choiceAnswer(answerItem)
        } else {
          this.multipleChoice(currentIndex)
          this.choiceAnswer(answerItem)
        }
      } else{
        this.choiceAnswer(answerItem)
      }
    },

    /**
     * 选择答案
     */
    choiceAnswer(answerItem){
      this.presentCorrectAnswer=this.questionList[this.currentQuestionItem].children.filter(item=>item.isRight==='Y');
      if(answerItem.isRight === 'N'){
          answerItem.isRight='Y';
      }else if(this.presentCorrectAnswer.length > 1){
          answerItem.isRight='N';
      }
    },

    /**
     * 保留一个正确答案
     */
    multipleChoice(currentIndex){
      this.questionList[this.currentQuestionItem].children.map((item,index)=>{
          if(index!==currentIndex){
              item.isRight='N';
          }
      })
    },


    /**
     * 取消创建投票问卷
     */
    handelvoteQuestionnaireInfo(){
      //不同状态调用不同方法
      if (this.isView){ //当前时查看状态
        this.goToPageActivityList();
      }else if (this.isEdit) {  //当前是编辑状态
        this.goToPageActivityList();
      }else { //当前是新增状态
        this.clearvoteQuestionnaireInfo();
      }
    },

    /**
     * 确定创建投票问卷
     */
    saveVoteQuestionnaireInfo(){
      /*if (this.chapterId != null && this.chapterId != '') {
        this.voteQuestionnaireInfo.chapterId = this.chapterId
      }*/
      if(this.currentQuestionVerifyBoolean() && this.formQuestionVerifyBoolean()){
        for (let i = 0; i < this.questionList.length; i++){
          if(this.questionList[i].questionType === '3'){
            this.questionList[i].children=[];
          }
        }
        // 此处有坑，新增时，this.voteQuestionnaireInfo.chapterId 会是数组
        // 修改时，this.voteQuestionnaireInfo.chapterId 是字符串
        if (this.voteQuestionnaireInfo.chapterId && this.voteQuestionnaireInfo.chapterId.length > 0) {
          if ('object' === typeof this.voteQuestionnaireInfo.chapterId) {
            this.voteQuestionnaireInfo.chapterId = this.voteQuestionnaireInfo.chapterId[this.voteQuestionnaireInfo.chapterId.length - 1];
          }
        }else{
          this.voteQuestionnaireInfo.chapterId = "";
        }
        this.voteQuestionnaireInfo.pkgId= this.pkgId;
        this.voteQuestionnaireInfo.json = JSON.stringify(this.questionList);
        this.isViewSave = true;
        this.$api.activityVoteQuestionnaire.saveVoteQuestionnaireInfo(this.voteQuestionnaireInfo).then(res=>{
          if(res.code===0){
              this.goToPageActivityList() // 跳页面
              this.clearvoteQuestionnaireInfo();
              toast(res.msg);
              this.isViewSave = false;
          }else{
            this.isViewSave = false;
          }
        })
      }
    },

    /**
     * 投票问卷表单验证
     */
    formQuestionVerifyBoolean(){
      if(!this.voteQuestionnaireInfo.activityTitle){
        formInVaildStyle('.questionnaireTitleHint',"#activityTitle");
        $("#activityTitle").css('borderColor','#dc3545');
        return false;
      }
      $("#activityTitle").removeAttr("style");
      formVaildStyle('.questionnaireTitleHint',"#activityTitle");
      if(!this.voteQuestionnaireInfo.resgroupId){
        formInVaildStyle('.questionnaireGroupHint',"#questionnaireGroup");
        return false;
      }
      formVaildStyle('.questionnaireGroupHint',"#questionnaireGroup");
      if(!this.voteQuestionnaireInfo.empiricalValue){
        formInVaildStyle('.empiricalValueHint',"#empiricalValue");
        return false;
      }
      formVaildStyle('.empiricalValueHint',"#empiricalValue");
      return true;
    },

    /**
     * 清空题目的验证
     */
    clearQuestionForm(){
      $('.optionName').removeClass('cb-form-valid')
      $('.optionName').removeClass('cb-form-invalid')
      $('.questionName').removeClass('cb-form-valid')
      $('.questionName').removeClass('cb-form-invalid')
    },

    /**
     * 清空投票问卷表单信息
     */
    clearvoteQuestionnaireInfo(){
      this.currentQuestionItem = 0
      this.questionList = [
        {
          questionId: '',
          questionName: '',
          questionType: '1',
          presentIsEditStates: false, // 此题是否处于编辑状态
          children: [
            {optionId: '', optionCode: 'A', optionName:'',  isRight: 'N', canFill: 'N'},
            {optionId: '', optionCode: 'B', optionName:'', isRight: 'Y', canFill: 'N'},
            {optionId: '', optionCode: 'C', optionName:'', isRight: 'N', canFill: 'N'},
            {optionId: '', optionCode: 'D', optionName:'', isRight: 'N', canFill: 'N'}
          ]
        }
      ],
      this.voteQuestionnaireInfo={//投票问卷信息
          activityId:"",
          pkgId:"",
          activityTitle:"",
          resgroupId:"",
          empiricalValue:"",
          isShow:"N",
          json:[]//题目
      };
      //this.clearQuestionObj()
      this.clearAllform()
    },
    //清空题目选项
    clearQuestionOption(){
      this.questionObj.children=[
        {optionId:'', optionCode:'', optionName:'', isRight:'Y', canFill: 'N'},
        {optionId:'', optionCode:'', optionName:'', isRight:'N', canFill: 'N'},
        {optionId:'', optionCode:'', optionName:'', isRight:'N', canFill: 'N'},
        {optionId:'', optionCode:'', optionName:'', isRight:'N', canFill: 'N'}
      ];
    },
    clearAllform(){
        $('.cb-form-valid').removeClass('cb-form-valid')
        $('.cb-form-invalid').removeClass('cb-form-invalid')
    },

    /**
     * 添加一个空题目
     */
    createQuestionInfo () {
      let questionInfo = {
        questionId: '',
        questionName: '',
        questionType: '1',
        presentIsEditStates: false, // 此题是否允许修改
        children: [
          {optionId: '', optionCode: 'A', optionName:'',  isRight: 'Y', canFill: 'N'},
          {optionId: '', optionCode: 'B', optionName:'', isRight: 'N', canFill: 'N'},
          {optionId: '', optionCode: 'C', optionName:'', isRight: 'N', canFill: 'N'},
          {optionId: '', optionCode: 'D', optionName:'', isRight: 'N', canFill: 'N'}
        ]
      }
      this.questionList.push(questionInfo)
    },



    /**
     * 获取题目类型
     */
    listQuestionType () {
      this.$api.activityVoteQuestionnaire.listQuestionType().then(res=>{
        if (res.code===0) {
          if (res.data && res.data.length) {
            this.questionTypeList = res.data
          }
        }
      })
    },

    /**
     * 活动分组
     */
    getListActivityGroup(){
      this.$api.activity.listActivityGroup({pkgId:this.pkgId}).then(res=>{
        if(res.code===0){
          if(res.data && res.data.length>0){
            this.listActivityGroup = res.data
          }
        }
      })
    },
    //题目类型的切换
    switchTopicType(newValue){
      if(newValue==='1'){

      }
      if(newValue==='2'){
        this.presentCorrectAnswer=this.questionList[this.currentQuestionItem].children.filter(item=>item.isRight==='Y');
        if(this.presentCorrectAnswer.length>1){
          //返回第一个正确答案的位置
          let rightAnswerIndex=this.questionList[this.currentQuestionItem].children.findIndex(item=>item.isRight==='Y');
          if(rightAnswerIndex!==-1){
            //保留一个正确答案
            this.multipleChoice(rightAnswerIndex);
          }
        }
      }
    },

    //获取其父级以及其自己的章节id
    getChapterIdList(arr,chapterId){
      arr.forEach((item,index) => {
        if (item.chapterId === chapterId) {
          this.voteQuestionnaireInfo.chapterId.unshift(item.parentId);
          this.getChapterIdList(this.zNodes,item.parentId)
        }
        if (item.children && item.children.length > 0) {
          this.getChapterIdList(item.children,chapterId);
        }
      })
    }

  },

  computed: {
    answerItemListCom(){
      return (this.questionList[this.currentQuestionItem].children.map((item,index)=>{
        item.optionCode = String.fromCharCode(65+index)
        return item
      }))
    }
  },

  watch: {
    "currentQuestionItem": function (newVlaue) {
      if (this.questionState) {
        this.questionObj = this.questionList[newVlaue];
      }
    },
    "questionObj": {
      handler: function (newValue) {
        this.questionList[this.currentQuestionItem] = newValue;
      },
      deep: true
    },
  },

  created () {
    // 题目类型
    this.listQuestionType()
    // 活动分组
   //this.getListActivityGroup()
    // 查询活动基本信息
    if (this.activityId) {
      this.$api.activityVoteQuestionnaire.viewVoteQuestionnaireInfo(this.activityId).then(res=>{
        if (res.code == 0) {
          this.voteQuestionnaireInfo = Object.assign({}, res.data)
          res.data.questionList.forEach(question => {
            // 设置题目类型不能修改
            question.disableQuestionType = true
            if (question.questionType === '3') {
              question.children = [{optionId: '', optionCode: 'A', optionName:'',  isRight: 'N',canFill: 'N'},
                                  {optionId: '', optionCode: 'B', optionName:'', isRight: 'Y',canFill: 'N'},
                                  {optionId: '', optionCode: 'C', optionName:'', isRight: 'N',canFill: 'N'},
                                  {optionId: '', optionCode: 'D', optionName:'', isRight: 'N',canFill: 'N'}]
            }
          })
          this.questionList = res.data.questionList;
        }
      })
    }
    let params = {
      pkgId: this.pkgId,
      subjectId: this.subjectId
    }
    this.$api.pkgInfo.getBookTreeData(params).then((res) => {
      if (res.code == 0) {
        //this.zNodes.push(res.data);
        this.zNodes = res.data.children
        // 是否选中章节
        if (this.chapterId) {
          this.voteQuestionnaireInfo.chapterId = [];
          this.voteQuestionnaireInfo.chapterId.push(this.chapterId);
          this.getChapterIdList(this.zNodes,this.chapterId);
          this.voteQuestionnaireInfo.chapterId.splice(0,1);
          //this.disabledSelectTree = true
        } else {
          this.disabledSelectTree = false
        }
      }
    });

  },
  updated() {
      if(this.isView){
          let temp = this.questionList.length - 1;
          $(".question-number"+temp).css("border-right","1px #bbbbbb solid");
          if(temp != 0){
              $(".question-number0").css("border-right","none");
          }
      }
  }
}
</script>

<style scoped>
/* 返回 */
.classroom-back{
  text-align: right;
  font-size: 14px;
  cursor: pointer;
  color: #158aeb;
  margin-right: 20px;
}
.classroom-back-icon{
  font-size: 14px;
  margin-right: 5px
}
/* 手势动作 */
.cursor{
  cursor: pointer;
}
/* 当前位置 */
.present-localtion{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: left;
  padding-left: 15px;
  display: flex;
  justify-content: space-between;
}
.present-localtion-title{
  color: #959da0;
}

.form-top{
  width: 100%;
  font-size: 14px;
}

/* 添加问卷 */
.add-msg{
  width: 95%;
  /* margin: 0px auto; */
  text-align: left;
  padding-left: 15px;
}

/* 题目列表 */
.add-question-con{
  width: 95%;
  margin: 20px auto;
}
.add-question-con .question-list{
  display: flex;
  height: 40px;
  width: 100%;
}
.questionName{
  margin-top: 10px;
  font-size: 14px
}
/* 题目序号 */
.add-question-con .question-list .question-number{
  width: 80px;
  height: 40px;
  border: 1px #bbbbbb solid;
  border-bottom: none;
  border-right: none;
  font-size: 14px;
  line-height: 40px;
  background-color: #fff;
  display: flex;
}
/* 当前题目序号 */
.add-question-con .question-list .active-question-number{
  margin-top:1px;
}

.add-question-con .question-list .question-number > span{
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.add-question-con .question-list .add-question-btn{
  width: 40px;
  height: 40px;
  line-height: 40px;
  background: #3198ed;
  text-align: center;
  cursor: pointer;
}
.add-question-con .edit-question-con{
  border: 1px #bbbbbb solid;
  padding-bottom: 20px;
}
.add-question-con .edit-question-con .question-stem{
  width: 95%;
  margin: 20px auto;
}
.add-question-con .edit-question-con .question-type{
  display: flex;
  width: 95%;
  /* margin: 10px auto; */
  padding-left: 8px;
}
.add-question-con .edit-question-con .question-option-list{
  width: 95%;
  margin: 20px auto;
  text-align: left;
}
.add-question-con .edit-question-con .question-option-list .question-option-box{
  margin-bottom: 13px;
}
.add-question-con .edit-question-con .question-option-list .option-hint{
  margin-left: 34px;
  text-align: left
}
.add-question-con .edit-question-con .question-option-list .question-option{
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.add-question-con .edit-question-con .question-option-list /deep/ .el-checkbox{
  margin: 0 20px 0 10px;
}
.question-option-list .question-option .input-group{
  width: 95%;
  margin: 0 20px;
}
.question-option-list .question-option .del-option{
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.edit-question-con .add-question-option-btn{
  width: 30%;
  margin: 15px 0px;
  margin-left: 30px;
  text-align: left;
  color: #4acacb;
  cursor: pointer;
}


/* 重写 */
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  /* background-color: rgba(0, 0, 0, 0.03); */
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

</style>
