<!-- 修改查看测试活动信息页面 -->
<template>
    <div class="test-activity">

      <!-- 当前位置导航begin -->
      <div class="present-localtion">
        <div>
          当前位置：<a class="cursor" @click="goToPageActivityList(true)">活动列表</a> > <span @click="goToPageActivityList(false)" :class="[isShow ? 'present-localtion-title' : 'cursor']">{{pageTitle}}</span> <span v-if="!isShow"> > </span> <span class="present-localtion-title" v-show="!isShow">题目信息预览</span>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
          <span @click="goToPageActivityList(isShow)">返回</span>
        </div>
      </div>
      <!-- 当前位置导航end -->

        <!-- 试卷预览begin -->
        <div v-if="!isShow">
          <!-- 试卷预览 -->
          <cb-question-papers papersType="2" ref="question" :subjectId="subjectId" :compositeQuestions="compositeQuestions" :gapFillingQuestions="gapFillingQuestions" :topicTypeData="topicTypeData" :isEdit="!isView" :isShowOperation="isView" :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions" :shortAnswerQuestions="shortAnswerQuestions"></cb-question-papers>
        </div>
        <!-- 试卷预览end -->
      
        <!-- 活动信息编辑begin -->
        <div v-if="isShow">
          
          <!-- 标题填写和题目预览编辑按钮begin -->
          <div style="width: 95%;margin: 20px auto">
            <div style="display: flex;justify-content: space-between;">
              <span>标题</span>
              <!-- 预览编辑按钮 -->
              <el-button type="primary" size="small" @click="isShow = false">{{isView ? '题目信息预览' : '题目信息编辑'}}</el-button>
            </div>
            <!-- 标题输入框 -->
            <el-input type="text" id="brainstormingTitle" :disabled="isView" v-model="testActivity.activityTitle" placeholder="请输入测试标题" style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
            <!-- 错误提示 -->
            <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingTitleHint"><small >请填写活动标题！</small></div>
          </div>
          <!-- 标题填写和题目预览编辑按钮end -->

          <!-- 活动分组填写和章节选择begin -->
          <div style="width: 95%;margin: 10px auto;display: flex">
            <!-- 所属章节 begin -->
            <div style="width: 48%;">
              <div style="text-align: left">所属章节</div>
              <div style="margin-top: 9px">
                <!-- 章节下拉选择树 -->
                <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="testActivity.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || isView">
                </el-cascader>
              </div>
            </div>
            <!-- 所属章节 end -->
          </div>
          <!-- 活动分组填写和章节选择end -->
          
          <!-- 分值填写begin -->
          <!-- <div style="width: 95%;margin: 20px auto;display: flex; "> -->
            <!-- 判断题分值填写 -->
            <!-- <div style="width: 48%;margin-right: 2%; text-align: left">
              <div>判断题（共 {{testActivity.judgeNum}} 题/ {{testActivity.judgeNum * testActivity.judgeScore}} 分）</div>
              <div style="margin-top: 9px">
                每小题
                <input type="number" v-model="testActivity.judgeScore" :disabled="isView || testActivity.judgeNum===0"  class="topicInput" @input="checkNumber(testActivity.judgeScore)">
                分
                </div>
            </div> -->
            <!-- 选择题分值填写 -->
            <!-- <div style="width: 48%;margin-left: 2%; text-align: left">
              <div>选择题（共 {{testActivity.choiceNum}} 题/ {{testActivity.choiceNum  * testActivity.chooseScore}} 分）</div>
              <div style="margin-top: 9px">
                每小题
                <input type="number" v-model="testActivity.chooseScore" :disabled="isView || testActivity.choiceNum===0" class="topicInput" @input="choosecheckNumber(testActivity.chooseScore)">
                分
                </div>
            </div> -->
          <!-- </div> -->
          <div style="width: 95%;margin: 20px auto;display: flex;font-size: 14px;">
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.singleChoseNum > 0">
              <div>单选题(共 {{testActivity.singleChoseNum}} 题/ {{testActivity.singleChoseNum  * testActivity.singleChoiceScore}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" 
                  v-model="testActivity.singleChoiceScore" 
                  maxlength="2" 
                  :disabled="isView || testActivity.singleChoseNum <= 0" 
                  class="topicInput"  
                  onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.multipleChoseNum > 0">
              <div>多选题(共 {{testActivity.multipleChoseNum}} 题/ {{testActivity.multipleChoseNum * (10 * testActivity.multipleChoiceScore)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.multipleChoiceScore" maxlength="2" :disabled="isView || testActivity.multipleChoseNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.judgeNum > 0">
              <div>判断题(共 {{testActivity.judgeNum}} 题/ {{testActivity.judgeNum * (testActivity.judgeScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.judgeScore" maxlength="2" :disabled="isView || testActivity.judgeNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 27%;margin-right: 1%; text-align: left" v-if="testActivity.gapFillingNum > 0">
              <div>填空题(共 {{testActivity.gapFillingNum}} 题/ {{testActivity.gapFillingEmptyNum}} 空/ {{testActivity.gapFillingEmptyNum  * (testActivity.gapFillingScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每空
                <input type="number" v-model="testActivity.gapFillingScore" maxlength="2" :disabled="isView || testActivity.gapFillingNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.shortAnswerNum > 0">
              <div>问答题(共 {{testActivity.shortAnswerNum}} 题/ {{testActivity.shortAnswerNum  * (testActivity.shortAnswerScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.shortAnswerScore" maxlength="2" :disabled="isView || testActivity.shortAnswerNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 29%; text-align: left" v-if="testActivity.compositeNum > 0">
              <div>复合题(共 {{testActivity.compositeNum}} 题/ {{testActivity.compositeMinNum}} 小题/ {{testActivity.compositeMinNum  * (testActivity.compositeScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每小题
                <input type="number" v-model="testActivity.compositeScore" maxlength="2" :disabled="testActivity.compositeNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
          </div>
          <div style="width: 95%;margin: 20px auto">
            <div class="custom-control custom-checkbox" style="text-align: left">
              <input type="checkbox" class="custom-control-input" false-value="1" true-value="2" v-model="testActivity.gapFillingScoreStandard" id="TestCheck2" :disabled="isView || testActivity.gapFillingNum <= 0">
              <label class="custom-control-label" for="TestCheck2">填空题全部答对得分</label>
            </div>
          </div>
          <!-- 分值填写end -->

          <!-- 限定时间选择begin -->
          <div style="width: 95%;margin: 20px auto;display: flex; ">
            <div style="text-align: left;width: 10%;line-height: 38px;">限定时间</div>
            <div style="width: 40%">
              <!--<div class="progress-bar" role="progressbar" aria-valuenow="60"
                    aria-valuemin="0" aria-valuemax="100" style="width: 40%;">
              </div>-->
              <el-slider
                v-model="testActivity.timeRuns"
                :step="30"
                :max="120"
                :disabled="isView"
                :show-tooltip="false"
                :marks="marks"
                show-stops>
              </el-slider>
            </div>
            <div style="line-height: 38px;margin-left: 20px;">
              {{testActivity.timeRuns === 0 ? '不限时' : testActivity.timeRuns+'分钟'}}
            </div>
          </div>
          <!-- 限定时间选择end -->

          <!-- 操作次数选择begin -->
          <div style="width: 95%;margin: 20px auto;display: flex">
            <div style="text-align: left;width: 10%;line-height: 38px;">重做次数</div>
            <div style="width: 40%">
              <!--<div class="progress-bar" role="progressbar" aria-valuenow="60"
                    aria-valuemin="0" aria-valuemax="100" style="width: 70%;">
              </div>-->
              <el-slider
                v-model="testActivity.redoNum"
                :step="1"
                :max="10"
                :disabled="isView"
                :show-tooltip="false"
                :marks="marks2"
                show-stops>
              </el-slider>
            </div>
            <div style="line-height: 38px;margin-left: 20px;">
              {{testActivity.redoNum === 0 ? '不允许重做' : (testActivity.redoNum +'次')}}
            </div>
          </div>
          <!-- 操作次数选择end -->

          <!-- 查看答案时机单选begin -->
          <div style="width: 95%;margin: 40px auto 20px;display: flex">
            <div style="text-align: left;">查看答案的时机</div>
            <div class="custom-control custom-radio custom-control-inline" style="margin-left: 20px">
              <input type="radio" id="TestRadioInline1" name="customRadioInline1" :disabled="isView" value="1" v-model="testActivity.lookAnswerTime" class="custom-control-input">
              <label class="custom-control-label" for="TestRadioInline1">测试活动结束后查看答案</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="TestRadioInline2" :disabled="isView" name="customRadioInline1" value="2" v-model="testActivity.lookAnswerTime" class="custom-control-input">
              <label class="custom-control-label" for="TestRadioInline2">交卷之后查看答案</label>
            </div>
          </div>
          <!-- 查看答案时机单选end -->

          <!-- 题目乱序begin -->
          <div style="width: 95%;margin: 20px auto">
            <div class="custom-control custom-checkbox" style="text-align: left">
              <input type="checkbox" :disabled="isView" class="custom-control-input" false-value="N" true-value="Y" v-model="testActivity.isOutOrder" id="TestCheck1">
              <label class="custom-control-label" for="TestCheck1">题目乱序</label>
            </div>
          </div>
          <!-- 题目乱序begin -->
          
          <div style="font-size: 14px;color: #ff5524;text-align: left;width: 95%;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>
        </div>
        <!-- 活动信息编辑end -->

        <!-- 确定取消操作按钮begin -->
        <div style="width: 94%;margin: 20px 3%;text-align: center" v-if="!isView && isShow">
          <button type="button" class="btn btn-outline-primary"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" :disabled="isViewSave" @click="savaTestActivity">确定</button>
          <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 10px" @click="goToPageActivityList(true)">取消</button>
        </div>
        <!-- 确定取消操作按钮end -->
    </div>
</template>

<script>
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global';
    import CbTree from '@/components/cb-tree/index';
    import CbQuestionPapers from '@/components/cb-question-papers/index';
    export default {
        name: "view-info-test-activity",
        components: {
          CbTree,
          "cb-question-papers": CbQuestionPapers,
        },
        props: {
          // 教学包主键
          pkgId: {
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
          // 课堂id
          ctId: {
            type: String,
            required: true,
            default: ''
          },
          subjectId: {
            type: String,
            required: true,
            default: ''
          },
          // 所属章节
          chapterId: {
            type: String,
            required: true,
            default: '',
          },
          //是否是查看
          isView: {
            type: Boolean,
            required: true,
            default: true,
          },
        },
        data () {
          return {
            props:{
                checkStrictly: true,
                value:'chapterId',
                label:'chapterName'
            },
            isShow: true,   //是否显示详情填写页   false显示题目编辑页
            pageTitle: '测试活动详情',    //活动主题
            zNodes: [],   //所有章节数据
            setting: {
              data: {
                key: {
                  name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
                },
              }
            },
            topicTypeData: [],    //题目选择的章节 数据
            //测试活动对象
            testActivity: {
              activityId: "",     //活动id
              pkgId: "",          //教学包id
              chapterId: '',      //所属章节id
              activityTitle: "",  //活动标题
              resgroupId: '0',     //所属分组
              timeRuns: 0,    //限定时间
              redoNum: 0,      //重做次数
              lookAnswerTime: '1',    //查看答案时机
              isOutOrder: 'N',      //题目是否乱序
              singleChoiceScore: 1,      //单选题分值
              multipleChoiceScore: 1,     //多选题分值
              judgeScore: 1,      //判断题分值
              gapFillingScore: 1, //填空题分值
              shortAnswerScore: 1,     //问答题分值
              compositeScore: 1,     //复合题分值
              singleChoseNum: 0,    //多选题数量
              multipleChoseNum: 0,  //多选题数量
              judgeNum: 0,  //判断题数量
              gapFillingNum: 0,   //填空题数量
              shortAnswerNum: 0,    //问答题数量
              compositeNum: 0,  //复合题数量
              gapFillingEmptyNum: 0,  //填空题总空数
              compositeMinNum: 0,
              gapFillingScoreStandard: "1",
            },
            //限定时间标记
            marks:{
              0: '不限时',
              30: '30',
              60: '60',
              90: '90',
              120: '120'
            },
            //操作次数标记
            marks2:{
              0: '不允许重做',
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5',
              6: '6',
              7: '7',
              8: '8',
              9: '9',
              10: '10',
            },
            listActivityGroup:[],//活动分组列表
            empiricalValueList:[2,4,6],//经验值列表
            disabledSelectTree: false,  //是否选中章节
            choiceQuestions: [],  //选择题数据
            judgeQuestions: [], //判断题数据
            gapFillingQuestions: [],  //填空题
            shortAnswerQuestions: [], //问答题数据 
            compositeQuestions: [], //复合题数据
            questionsIds: [], //所有题目
            isViewSave: false,  //是否禁用提交按钮
          }
        },
        methods:{
          /**
           *  存入选中的章节
           */
          onclick (treeNode, nodes, isMultiple) {
            this.testActivity.chapterId = treeNode.chapterId
          },
          //判断题和选择题分数的填写验证
          //输入框验证
          choosecheckNumber(value) {
            if(value.length == 1) {
              value= value.replace(/[^1-9]/g, '');
            } else {
              value= value.replace(/\D/g, '');
            }
          },
          /**
           * 跳页面
           */
          goToPageActivityList (value) {    //value存在跳活动主页面，不存在跳详情填写页
            if (!value) {
              this.isShow = true;
              this.getOptionInfo();
            }else{
              this.$parent.changeVotoQuestionnairePage(false);
            }
          },
          //获取活动分组
          getListActivityGroup(){
            //调用分组查询接口
            this.$api.activity.listActivityGroup({pkgId:this.pkgId}).then(res=>{
              if(res.code===0){
                if(res.data&&res.data.length>0){
                  this.listActivityGroup=res.data;
                }
              }
            })
          },
          //获取测试活动信息
          getTestInfo(){
            let formData = new FormData();
            formData.append('pkgId', this.pkgId);
            formData.append('activityId',this.activityId);
            //调用活动消息查询接口
            this.$api.activityTest.queryTestPaper(formData).then(res => {
              if (res.code === 0) {
                this.testActivity.activityTitle = res.data.paperInfo.paperName;    //标题
                this.testActivity.paperTotalScore = res.data.paperInfo.paperTotalScore; //总分
                this.testActivity.timeRuns = parseInt(res.data.paperInfo.paperConfinementTime); //限定时间
                this.testActivity.chapterId = res.data.paperInfo.chapterId;   //章节id
                this.testActivity.resgroupId = res.data.paperInfo.resgroupId;   //分组id
                this.testActivity.isOutOrder = res.data.paperInfo.paperIsRandom;    //是否乱序
                this.testActivity.redoNum = parseInt(res.data.paperInfo.redoNum);   //重做次数
                this.testActivity.lookAnswerTime = res.data.paperInfo.viewResultTime;   //查看答题时机

                //清空选择题、判断题、所有题目id  的数据
                this.choiceQuestions = [];
                this.judgeQuestions = [];
                this.gapFillingQuestions = [];
                this.shortAnswerQuestions = [];
                this.compositeQuestions = [];
                this.questionsIds = [];

                //存入选择题、判断题数量
                this.testActivity.singleChoseNum = 0;
                this.testActivity.multipleChoseNum = 0;
                this.testActivity.judgeNum = 0;
                this.testActivity.gapFillingNum = 0;
                this.testActivity.gapFillingEmptyNum = 0;
                this.testActivity.compositeMinNum = 0;
                this.testActivity.shortAnswerNum = 0;
                this.testActivity.compositeNum = 0;

                //存入选择题、判断题、所有题目id  的信息
                for (let index = 0; index < res.data.questionList.length; index++) {
                  if (res.data.questionList[index].questionsType === '1') {
                    this.choiceQuestions.push(res.data.questionList[index]);
                    this.testActivity.singleChoseNum++;
                  }
                  if (res.data.questionList[index].questionsType === '2') {
                    this.choiceQuestions.push(res.data.questionList[index]);
                    this.testActivity.multipleChoseNum++;
                  }
                  if (res.data.questionList[index].questionsType === '3') {
                    this.judgeQuestions.push(res.data.questionList[index]);
                    this.testActivity.judgeNum++;
                  }
                  if (res.data.questionList[index].questionsType === '4') {
                    this.shortAnswerQuestions.push(res.data.questionList[index]);
                    this.testActivity.shortAnswerNum++;
                  }
                  if(res.data.questionList[index].questionsType === '5'){
                    this.gapFillingQuestions.push(res.data.questionList[index]);
                    this.testActivity.gapFillingEmptyNum += res.data.questionList[index].optionList.length;
                    this.testActivity.gapFillingNum++;
                  }
                  if(res.data.questionList[index].questionsType === '6'){
                    res.data.questionList[index].questionList = res.data.questionList[index].children;
                    let temp = res.data.questionList[index];
                    temp.questionList.forEach(item => {
                      if (item.questionsType != '4' && item.questionsType != '5') {
                        for (let index0 = 0; index0 < item.optionList.length; index0++) {
                          if (( item.optionList[index0].optionId && item.replyIds.indexOf(item.optionList[index0].optionId) !== -1)) {
                            item.optionList[index0].isRight = 'YES';
                            item.optionList[index0].isModelAnswer = true;
                          }else{
                            item.optionList[index0].isRight = 'NO';
                            item.optionList[index0].isModelAnswer = false;
                          }
                        }
                      }
                    });
                    this.testActivity.compositeMinNum += res.data.questionList[index].questionList.length;
                    this.compositeQuestions.push(temp);
                    this.testActivity.compositeNum++;
                  }
                  this.questionsIds.push(res.data.questionList[index]);
                }



                //存入判断题、选择题的分数
                this.testActivity.singleChoiceScore = res.data.paperInfo.singleChoiceScore;
                this.testActivity.multipleChoiceScore = res.data.paperInfo.multipleChoiceScore;
                this.testActivity.judgeScore = res.data.paperInfo.judgeScore;
                this.testActivity.gapFillingScore = res.data.paperInfo.gapFilling;
                this.testActivity.shortAnswerScore = res.data.paperInfo.shortAnswerScore;
                this.testActivity.compositeScore = res.data.paperInfo.compositeScore;
                this.testActivity.gapFillingScoreStandard = res.data.paperInfo.gapFillingScoreStandard;
              }else{
                toast(res.msg);
              }
              
            })
          },

          //到信息填写页面
          getOptionInfo(){
            //获取题目显示组件的  所有题目id、选择题数量、判断题数量  的信息
            this.questionsIds = this.$refs.question.getAllTopicId();
            //this.testActivity.choiceNum = this.$refs.question.getChoiceQuestionsLength();
            //this.testActivity.judgeNum = this.$refs.question.getJudgeQuestionsLength();
            //存入选择题、判断题数量
            this.testActivity.singleChoseNum = 0;
            this.testActivity.multipleChoseNum = 0;
            this.testActivity.judgeNum = 0;
            this.testActivity.gapFillingNum = 0;
            this.testActivity.gapFillingEmptyNum = 0;
            this.testActivity.shortAnswerNum = 0;
            this.testActivity.compositeNum = 0;
            
            let questionList = this.questionsIds;
            //存入选择题、判断题、所有题目id  的信息
            for (let index = 0; index < questionList.length; index++) {
              if (questionList[index].questionsType === '1') {
                this.testActivity.singleChoseNum++;
              }
              if (questionList[index].questionsType === '2') {
                this.testActivity.multipleChoseNum++;
              }
              if (questionList[index].questionsType === '3') {
                this.testActivity.judgeNum++;
              }
              if (questionList[index].questionsType === '4') {
                this.testActivity.shortAnswerNum++;
              }
              if('5' === questionList[index].questionsType){
                this.testActivity.gapFillingEmptyNum += questionList[index].optionList.length;
                this.testActivity.gapFillingNum += 1;
              }
              if (questionList[index].questionsType === '6') {
                this.testActivity.compositeNum++;
              }
            }
          },

          //提交题目验证
          formBrainstormingVerifyBoolean(){
            //活动主题验证
            if(!this.testActivity.activityTitle){
                //出现提示
                formInVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
                $("#brainstormingTitle").focus();
                return false;
            }
            //清除提示
            formVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
            return true;
          },

          //提交测试活动
          savaTestActivity(){
            //提交验证
            if (!this.formBrainstormingVerifyBoolean()) {
              return false;
            }
            if (this.questionsIds.length <= 0) {
              toast("请至少添加一个题目")
              return false;
            }
            this.isViewSave = true;
            let arrTemp = JSON.parse(JSON.stringify(this.questionsIds));
            if (!arrTemp[arrTemp.length - 1].questionsName || arrTemp[arrTemp.length - 1].questionsName === '') {
              arrTemp.splice(arrTemp.length - 1,1);
            }
            for (let index = 0; index < arrTemp.length; index++) {

              if (arrTemp[index].questionsType != '4' && arrTemp[index].questionsType != '5'  && arrTemp[index].questionsType != '6') {
                for (let index0 = 0; index0 < arrTemp[index].optionList.length; index0++) {
                  if ((arrTemp[index].replyIds.indexOf(arrTemp[index].optionList[index0].optionId) != -1)) {
                    arrTemp[index].optionList[index0].isRight = 'YES';
                  }else{
                    arrTemp[index].optionList[index0].isRight = 'NO';
                  }
                }
              }

              if (arrTemp[index].questionsType === '6') {
                if (arrTemp[index].questionList) {
                  arrTemp[index].questionList.forEach(item => {
                    if (item.questionsType != '4' && item.questionsType != '5') {
                      for (let index0 = 0; index0 < item.optionList.length; index0++) {
                        if ((item.replyIds.indexOf(item.optionList[index0].optionId) != -1)) {
                          item.optionList[index0].isRight = 'YES';
                        }else{
                          item.optionList[index0].isRight = 'NO';
                        }
                      }
                    }
                  });
                }
              }

            }
            //this.getOptionInfo();
            //转换  所有题目id、选择题总分、判断题总分、重做次数  的提交格式
            //let questions = this.questionsIds.join(",");
            let singleChoseScore = this.testActivity.singleChoseNum * (parseInt(this.testActivity.singleChoiceScore));
            let multipleChoseTotalScore = this.testActivity.multipleChoseNum * (parseInt(this.testActivity.multipleChoiceScore));
            let judgeTotalScore = this.testActivity.judgeNum * (parseInt(this.testActivity.judgeScore));
            let gapFillingTotalScore = this.testActivity.gapFillingEmptyNum * (parseInt(this.testActivity.gapFillingScore));
            let shortAnswerTotalScore = this.testActivity.shortAnswerNum * (parseInt(this.testActivity.shortAnswerScore));
            let compositeTotalScore = this.testActivity.compositeNum * (parseInt(this.testActivity.compositeScore));
            let redoNum = parseInt(this.testActivity.redoNum);
            //提交对象
            let obj = {
              paperId: this.activityId,
              pkgId: this.pkgId,
              chapterId: (typeof this.testActivity.chapterId === 'object' && this.testActivity.chapterId.length > 0) ? this.testActivity.chapterId[this.testActivity.chapterId.length - 1] : (typeof this.testActivity.chapterId === 'string' ? this.testActivity.chapterId : ''),
              questionsData: arrTemp,
              totalScore: (singleChoseScore + multipleChoseTotalScore + judgeTotalScore + gapFillingTotalScore + shortAnswerTotalScore + compositeTotalScore).toString(),
              totalSingleChose: parseInt(this.testActivity.singleChoseNum).toString(),
              totalMultipleChose: parseInt(this.testActivity.multipleChoseNum).toString(),
              totalJudge: parseInt(this.testActivity.judgeNum).toString(),
              totalGapFilling: parseInt(this.testActivity.gapFillingNum).toString(),
              totalShortAnswer: parseInt(this.testActivity.shortAnswerNum).toString(),
              totalComposite: parseInt(this.testActivity.compositeNum).toString(),
              singleChoiceScore: this.testActivity.singleChoiceScore.toString(),
              multipleChoiceScore: this.testActivity.multipleChoiceScore.toString(),
              judgeScore: this.testActivity.judgeScore.toString(),
              gapFilling: this.testActivity.gapFillingScore.toString(),
              shortAnswerScore: this.testActivity.shortAnswerScore.toString(),
              compositeScore: this.testActivity.compositeScore.toString(),
              paperName: this.testActivity.activityTitle,
              answerTime: this.testActivity.timeRuns.toString(),
              paperIsRandom: this.testActivity.isOutOrder,
              redoNum: redoNum.toString(),
              viewResultTime: this.testActivity.lookAnswerTime,
              resgroupId: this.testActivity.resgroupId,
              gapFillingScoreStandard: this.testActivity.gapFillingScoreStandard,
            };
            //调用活动提交接口
            this.$api.activityTest.updateTestPaperInfo(obj).then(res => {
              if (res.code === 0) {
                //回活动主页面
                this.goToPageActivityList(true);
              }
              toast(res.msg);
              this.isViewSave = false;
            })
          },
          //获取选择章节数据
          getTopicTypeData(){
            let formDada=new FormData();
            formDada.append("pkgId",this.pkgId);
            this.$api.activityTest.queryTopChapter(formDada).then(res => {
              if (res.code === 0) {
                this.topicTypeData = res.data;
              }else{
                toast(res.msg);
              }
            })
          },

        },
        created () {
          // 活动分组
          //this.getListActivityGroup();
          //获取章节目录
          let params = {
            pkgId: this.pkgId,
            subjectId: this.subjectId
          }
          this.$api.pkgInfo.getBookTreeData(params).then((res) => {
            if (res.code == 0) {
              //this.zNodes.push(res.data);
              this.zNodes = res.data.children
            }
          });
          // 是否选中章节
          if (this.chapterId) {
            this.testActivity.chapterId = this.chapterId;
            //this.disabledSelectTree = true
          } else {
            this.disabledSelectTree = false
          }
          //获取基本信息
          this.getTestInfo();
          //获取题目添加时 所需 选择的章节数据
          this.getTopicTypeData();
        },
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
  /* 当前位置 */
  .present-localtion{
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 去除数字输入框上下箭头 */
  .topicInput{
    width: 30%;
    border: 1px solid #ced4da;
    outline: none;
    border-radius: 2px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  }

  input[ type= "number" ] {
  -moz-appearance: textfield;
  }
</style>
