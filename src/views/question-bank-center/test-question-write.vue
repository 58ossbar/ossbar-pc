<!-- 试卷库填写与查看成绩页面 -->
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
                    试卷库
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
    <div class="view-write-test-activity wind-1240" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
      <div v-if="isWirte">
        <!-- 试卷页面begin -->
        <cb-question-papers papersType="1" ref="question" :isInTheTest="true" :answer="answer" :compositeQuestions="compositeQuestions" :gapFillingQuestions="gapFillingQuestions" :historyAnswers="historyAnswers" :textInfo="textInfo" :shortAnswerQuestions="shortAnswerQuestions" :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions"></cb-question-papers>
        <!-- 试卷页面end -->

        <!-- 右侧题目导航 -->
        <div class="question-nav" @mousedown="moveDetails($event)">
          <!-- 头像昵称显示区域 -->
          <div class="img-name-area">
            <div>
              <img :src="currInfo.imgSrc"/>
              <span>{{currInfo.name}}</span>
            </div>
            <div style="line-height: 40px;color:#fff;font-size:12px;">（可拖拽）</div>
          </div>
          <div class="question-list">
            <!-- 判断题显示区域 -->
            <div class="judge-area" v-if="judgeQuestions.length !== 0">
              <div class="judge-title">
                判断题 ({{judgeQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in judgeQuestions" :class="[answer.judgeAnswer[index].replyIds ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'1')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 选择题显示区域 -->
            <div class="judge-area" v-if="choiceQuestions.length !== 0">
              <div class="judge-title">
                选择题 ({{choiceQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in choiceQuestions" :class="[answer.choiceAnswer[index].replyIds.length > 0 ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'2')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 填空题显示区域 -->
            <div class="judge-area" v-if="gapFillingQuestions.length !== 0">
              <div class="judge-title">
                填空题 ({{gapFillingQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in gapFillingQuestions" :class="[answer.gapFillingAnswer[index].gapFillingList[0].content ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'4')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 简答题显示区域 -->
            <div class="judge-area" v-if="shortAnswerQuestions.length !== 0">
              <div class="judge-title">
                简答题 ({{shortAnswerQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in shortAnswerQuestions" :class="[answer.shortAnswerAnswer[index].content ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'3')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 复合题显示区域 -->
            <div class="judge-area" v-if="compositeQuestions.length !== 0">
              <div class="judge-title">
                复合题 ({{compositeQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in compositeQuestions" :class="[ getCompositeState(answer.compositeAnswer[index].answer) === 'Y' ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'5')">
                  {{index+1}}
                </span>
              </div>
            </div>
          </div>
          <!-- 按钮显示区域 -->
          <div class="btn-area">
            <el-button type="primary" style="width: 80%" @click="isSubmitAnswer">提交试卷</el-button>
          </div>
          <!-- 计时区域 -->
          <div class="calculate-area" v-if="textInfo.paperConfinementTime !== 0">
            倒计时：<cb-countdown v-if="isShowCountdown" :remainTime="endTime"></cb-countdown>
          </div>
        </div>
      </div>
      

      <div v-if="isView">
        <!-- 试卷页面begin -->
        <cb-question-papers papersType="0" ref="question" :isInTheTest="true" :answer="answer" :compositeQuestions="compositeQuestions" :textInfo="textInfo" :gapFillingQuestions="gapFillingQuestions" :shortAnswerQuestions="shortAnswerQuestions" :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions"></cb-question-papers>
        <!-- 试卷页面end -->
      
        <!-- 右侧题目导航 -->
        <div class="question-nav" @mousedown="moveDetails($event)">
          <!-- 头像昵称显示区域 -->
          <div class="img-name-area">
            <div>
              <img :src="currInfo.imgSrc"/>
              <span>{{currInfo.name}}</span>
            </div>
            <div style="line-height: 40px;color:#fff;font-size:12px;">（可拖拽）</div>
          </div>
          <div class="question-list">
            <!-- 判断题显示区域 -->
            <div class="judge-area" v-if="judgeQuestions.length !== 0">
              <div class="judge-title">
                判断题 ({{judgeQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in judgeQuestions" :class="[item.isCorrect === 'Y' ? 'filled-color1' : 'not-filled-color1']" :key="index" @click="jump(index,'1')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 选择题显示区域 -->
            <div class="judge-area" v-if="choiceQuestions.length !== 0">
              <div class="judge-title">
                选择题 ({{choiceQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in choiceQuestions" :class="[item.isCorrect === 'Y' ? 'filled-color1' : 'not-filled-color1']" :key="index" @click="jump(index,'2')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 填空题显示区域 -->
            <div class="judge-area" v-if="gapFillingQuestions.length !== 0">
              <div class="judge-title">
                填空题 ({{gapFillingQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in gapFillingQuestions" :class="[item.isCorrect === 'Y' ? 'filled-color1' : 'filled-short1']" :key="index" @click="jump(index,'4')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 简答题显示区域 -->
            <div class="judge-area" v-if="shortAnswerQuestions.length !== 0">
              <div class="judge-title">
                简答题 ({{shortAnswerQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in shortAnswerQuestions" :class="[item.userScore  !== '0' ? 'filled-color' : 'filled-short']" :key="index" @click="jump(index,'3')">
                  {{index+1}}
                </span>
              </div>
            </div>
            <!-- 复合题显示区域 -->
            <div class="judge-area" v-if="compositeQuestions.length !== 0">
              <div class="judge-title">
                复合题 ({{compositeQuestions.length}}题)
              </div>
              <div class="judge-content">
                <span v-for="(item,index) in compositeQuestions" :class="[item.userScore  === (item.questionsScore * item.questionList.length).toString() ? 'filled-color' : 'filled-short']" :key="index" @click="jump(index,'5')">
                  {{index+1}}
                </span>
              </div>
            </div>
          </div>
          <!-- 按钮显示区域 -->
          <div class="btn-area">
            <el-button type="primary" style="width: 80%" @click="toback('/question-bank-center/test-question-bank')">返回试题库</el-button>
          </div>
          <!-- 分数区域 -->
          <div class="calculate-area">
            <span style="font-size: 20px;">得分：<span :style="(parseFloat(history.paperFinalScore)/parseFloat(textInfo.TotalScore)) >= 0.6 ? 'color:#67c23a' : 'color:red'">{{history.paperFinalScore}}</span></span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {
  baseUrl,
  toast,
  alert,
  confirm,
  loadingModal,
  formVaildStyle,
  formInVaildStyle,
} from '@/utils/global';
import CbQuestionPapers from '@/components/cb-question-papers/index';
import HeaderNav from '@/components/header-nav-start-class'
import CbCountdown from '@/components/cb-count-down/index';
export default {
  name: 'test-question-write',
  components: {
    'header-nav': HeaderNav,
    // 题目显示页面组件
    "cb-question-papers": CbQuestionPapers,
    // 倒计时页面组件
    "cb-countdown": CbCountdown,
  },
  props: {
    // 题目信息
    // paperId:{
    //   type: String,
    //   required: true,
    //   default: ""
    // }
  },
  data() {
    return {
      type: '试卷详情',
      paperId: '', // 试卷id
        isWirte: true,
        isView: false,
        choiceQuestions: [],      //选择题
        judgeQuestions: [],      //判断题
        gapFillingQuestions: [],   //填空题
        shortAnswerQuestions: [],   //问答题
        compositeQuestions: [],   //复合题
        //学生作答详情
        answer: {
          choiceAnswer: [],
          judgeAnswer: [],
          gapFillingAnswer: [],
          shortAnswerAnswer: [],
          compositeAnswer: [],
        },
        textInfo:{
          paperConfinementTime: 0,    //测试时间
          paperName: '',
          TotalScore: 0,
        },
        dyId: '',
        currInfo:{
          name: '',
          ingSrc: ''
        },
        historyAnswers: [],
        isShowCountdown: false,
        positionX:0,  //详情水平位置
        positionY:0,  //详情垂直位置
        endTime: 0,//距离结束时间
    };
  },
  watch: {
    endTime(newValue, oldValue){
      
    }
  },
  methods: {
    /** 返回 */
    toback: function (url) {
      this.$router.push(url)
    },
    /**
     * 复合题是否做答玩判断
     */
    getCompositeState(value){
      let temp = true;
      value.forEach((item,index) => {
        if ((!item.content || item.content === '') && (!item.replyIds || item.replyIds.length <= 0)) {
          if (item.gapFillingList && item.gapFillingList.length > 0) {
            item.gapFillingList.forEach((item0) => {
              if (!item0.content && item0.content === '') {
                temp = false;
              }
            })
          }else{
            temp = false;
          }
        }
      })
      if (temp) {
        return 'Y';
      }else{
        return 'N';
      }
    },

    /**
     * 填空题是否做答判断
     */
    getGapFillingState(value){
      let temp = true;
      value.forEach((item) => {
        if (!item.content && item.content === '') {
          temp = false;
        }
      })
      if (temp) {
        return 'Y';
      }else{
        return 'N';
      }
    },
    /**
     *  详情移动事件
     */
    moveDetails(e){
        //获取目标元素
        //let odiv = e.target;
        let odiv = document.querySelector(".question-nav");
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        //document.onselectstart = function() { return false; };//解决拖动会选中文字的问题
        document.onmousemove = (e)=>{       //鼠标按下并移动的事件
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;

            //绑定元素位置到positionX和positionY上面
            this.positionX = top;
            this.positionY = left;

            //移动当前元素
            odiv.style.left = left + 'px';
            odiv.style.top = top + 'px';
        };
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    },
    /**
     * 返回试题库
     */
    goToViewAllTest(){
      this.$parent.getToQuestionBank();
    },
    //定位
    jump(index,value){
      if ('1' === value) {
        this.$refs.question.toJudgeQuestion(index);
      }else if ('2' === value) {
        this.$refs.question.toChoiceQuestion(index);
      }else if ('3' === value) {
        this.$refs.question.toShortAnswerQuestion(index);
      }else if ('4' === value) {
        this.$refs.question.toGapFillingQuestion(index);
      }else if ('5' === value) {
        this.$refs.question.toCompositeQuestion(index);
      }
      
    },
    //获得题目信息
    getTopicInfo(){
      loadingModal(true);
      let formData = new FormData();
      formData.append('paperId', this.paperId);
      this.$api.questionbank.startTheExam(formData).then(res => {
        if (res.code === 0) {
          this.judgeQuestions = res.data.judgeList;
          this.choiceQuestions = res.data.choseList;
          this.gapFillingQuestions = res.data.gapFillingList;
          this.shortAnswerQuestions = res.data.shortAnswerList;
          this.compositeQuestions = res.data.compoundList ? res.data.compoundList : [];
          this.textInfo.paperConfinementTime = parseInt(res.data.paper.paperConfinementTime);
          this.textInfo.TotalScore = res.data.paper.paperTotalScore;
          this.textInfo.paperName = res.data.paper.paperName;
          this.type = (res.data && res.data.paper && res.data.paper.paperName) ? (res.data.paper.paperName) : '试卷详情'
          this.dyId = res.data.dyId;
          this.isShowCountdown = true;
          this.historyAnswers = res.data.paperScores;
          //存入测试的选择题喝判断题
          // for (let index = 0; index < res.data.questionList.length; index++) {
          //   if (res.data.questionList[index].questionsType === '1') {
          //     this.choiceQuestions.push(res.data.questionList[index]);
          //   }else if (res.data.questionList[index].questionsType === '2') {
          //     this.judgeQuestions.push(res.data.questionList[index]);
          //   }
          // }
          //生成学员答题详情
          this.answer.judgeAnswer = [];
          this.answer.choiceAnswer = [];
          this.answer.gapFillingAnswer = [];
          this.answer.shortAnswerAnswer = [];
          this.answer.compositeAnswer = [];
          for (let index = 0; index < this.judgeQuestions.length; index++) {
            let obj = {
              optionId: this.judgeQuestions[index].optionId,
              replyIds: '',
              content: ''
            }
            this.answer.judgeAnswer.push(obj);
          }

          for (let index = 0; index < this.choiceQuestions.length; index++) {
            let obj = {}
            if (this.choiceQuestions[index].questionsType === '1') {
              obj = {
                optionId: this.choiceQuestions[index].optionId,
                replyIds: '',
                content: ''
              }
            }else{
              obj = {
                optionId: this.choiceQuestions[index].optionId,
                replyIds: [],
                content: ''
              }
            }
            this.answer.choiceAnswer.push(obj);
          }
          for (let index = 0; index < this.gapFillingQuestions.length; index++) {
            let obj = {};
            let replyIds = [];
            for (let index0 = 0; index0 < this.gapFillingQuestions[index].gapFillingNumber; index0++) {
              replyIds.push({id:"",content:''});
            }
            obj = {
              optionId: this.gapFillingQuestions[index].questionsId,
              gapFillingList: replyIds,
              questionsScore: this.gapFillingQuestions[index].questionsScore,
              content:''
            }
            this.answer.gapFillingAnswer.push(obj);
          }
          for (let index = 0; index < this.shortAnswerQuestions.length; index++) {
            let obj = {
              optionId: this.shortAnswerQuestions[index].optionId,
              replyIds: '',
              content: ''
            }
            this.answer.shortAnswerAnswer.push(obj);
          } 
          this.compositeQuestions.forEach((item, index) => {
            let arrTemp = [];
            if (!item.children && item.children.length < 1) {
              return;
            }
            item.questionList = item.children;
            item.questionList.forEach((item0,index0) => {
              let obj = {};
              if (item0.questionsType === '1') {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  replyIds: '',
                  content: ''
                }
              }
              if (item0.questionsType === '2') {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  replyIds: [],
                  content: ''
                }
              }
              if (item0.questionsType === '3') {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  replyIds: '',
                  content: ''
                }
              }
              if (item0.questionsType === '4') {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  replyIds: '',
                  content:''
                }
              }
              if (item0.questionsType === '5') {
                let replyIds = [];
                if (item0.optionList && item0.optionList.length > 0) {
                  for (let index0 = 0; index0 < item0.optionList.length; index0++) {
                    replyIds.push({id:'',content:''});
                  }
                }else{
                  for (let index0 = 0; index0 < item0.gapfillingNum; index0++) {
                    replyIds.push({id:'',content:''});
                  }
                }
                
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  questionsScore: item0.questionsScore,
                  gapFillingList: replyIds,
                  content:''
                }
              }
              arrTemp.push(obj);
            })
            let tempObj = {answer: arrTemp};
            this.answer.compositeAnswer.push(tempObj);
          })
          let that = this;
          this.timer = setInterval(function(){

            let arrTemp = [];
            for (let index = 0; index < that.judgeQuestions.length; index++) {
              let obj = {
                questionsId: that.judgeQuestions[index].questionsId,
                questionsScore: that.judgeQuestions[index].questionsScore,
                replyId: that.answer.judgeAnswer[index].replyIds,
                questionsNum: that.judgeQuestions[index].questionsNumber,
                content: that.answer.judgeAnswer[index].content ? that.answer.judgeAnswer[index].content : '',
              }
              arrTemp.push(obj);
            }

            for (let index = 0; index < that.choiceQuestions.length; index++) {
              let replyIds = "";
              if (that.choiceQuestions[index].questionsType === '1') {
                replyIds = that.answer.choiceAnswer[index].replyIds;
              }else{
                replyIds = that.answer.choiceAnswer[index].replyIds.join(",");
              }
              let obj = {
                questionsId: that.choiceQuestions[index].questionsId,
                questionsScore: that.choiceQuestions[index].questionsScore,
                replyId: replyIds,
                questionsNum: that.choiceQuestions[index].questionsNumber,
                content: that.answer.choiceAnswer[index].content ? that.answer.choiceAnswer[index].content : '',
              }
              arrTemp.push(obj);
            }

            for (let index = 0; index < that.gapFillingQuestions.length; index++) {
              let obj = {
                questionsId: that.gapFillingQuestions[index].questionsId,
                questionsScore: that.gapFillingQuestions[index].questionsScore,
                gapFillingList: that.answer.gapFillingAnswer[index].gapFillingList,
                questionsNum: that.gapFillingQuestions[index].questionsNumber,
                content: that.answer.gapFillingAnswer[index].content ? that.answer.gapFillingAnswer[index].content : '',
              }
              arrTemp.push(obj);
            }

            for (let index = 0; index < that.shortAnswerQuestions.length; index++) {
              let obj = {
                questionsId: that.shortAnswerQuestions[index].questionsId,
                questionsScore: that.shortAnswerQuestions[index].questionsScore,
                replyId: that.answer.shortAnswerAnswer[index].replyIds,
                questionsNum: that.shortAnswerQuestions[index].questionsNumber,
                content: that.answer.shortAnswerAnswer[index].content ? that.answer.shortAnswerAnswer[index].content : '',
              }
              arrTemp.push(obj);
            }

            that.compositeQuestions.forEach((item,index) => {
              item.questionList.forEach((item0,index0) => {
                let obj = {};

                if ("1" === item0.questionsType || "2" === item0.questionsType) {
                  let replyIds = "";
                  if (item0.questionsType  === '1') {
                    replyIds = that.answer.compositeAnswer[index].answer[index0].replyIds;
                  }else{
                    replyIds = that.answer.compositeAnswer[index].answer[index0].replyIds.join(",");
                  }
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore:  item0.questionsScore,
                    replyId: replyIds,
                    content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                    questionsNum: item0.questionsNumber,
                  }
                }

                if ("3" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    replyId: that.answer.compositeAnswer[index].answer[index0].replyIds,
                    questionsNum: item0.questionsNumber,
                    content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                  }
                }

                if ("5" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    gapFillingList: that.answer.compositeAnswer[index].answer[index0].gapFillingList,
                    content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                    questionsNum: item0.questionsNumber,
                  }
                }

                if ("4" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    replyId: that.answer.compositeAnswer[index].answer[index0].replyIds,
                    content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                    questionsNum: item0.questionsNumber,
                  }
                }

                arrTemp.push(obj);
              })
            })
            that.$api.questionbank.paperCommit(that.dyId,arrTemp).then(res => {});
          }, 5000);

          if(this.textInfo.paperConfinementTime && this.textInfo.paperConfinementTime !== 0){
            that.$api.questionbank.loadPaperTime(that.dyId).then(data => {
              if (data.code === 0) {
                that.endTime = parseInt(data.paperEndTime/1000);
              }
            });
            this.timer2 = setInterval(function(){
              that.$api.questionbank.loadPaperTime(that.dyId).then(data => {
                if (data.code === 0) {
                  that.endTime =  parseInt(data.paperEndTime/1000);
                }
              });
            }, 5000);
          }
        }else{
          toast(res.msg);
        }
        loadingModal(false);
      })
    },

    //获取答案数据
    getAnswer(value){
      this.answer.choiceAnswer = value.choiceAnswer;
      this.answer.judgeAnswer = value.judgeAnswer;
      this.answer.gapFillingAnswer = value.gapFillingAnswer;
      this.answer.shortAnswerAnswer = value.shortAnswerAnswer;
    },
    //提交试卷询问
    isSubmitAnswer(){
      let arrTemp = 0;
      this.answer.choiceAnswer.forEach(function(item,index){
        if (!item.replyIds || item.replyIds.length <= 0) {
          arrTemp += 1;
        }
      })
      this.answer.judgeAnswer.forEach(function(item,index){
        if (!item.replyIds) {
          arrTemp += 1;
        }
      })
      this.answer.gapFillingAnswer.forEach(function(item,index){
        if (!item.gapFillingList || item.gapFillingList.length <= 0) {
          for (let index = 0; index < item.gapFillingList.length; index++) {
            if (!item.gapFillingList[index].content && '' === item.gapFillingList[index].content) {
              arrTemp += 1;
              break;
            }
          }
        }
      })
      this.answer.shortAnswerAnswer.forEach(function(item,index){
        if (!item.content) {
          arrTemp += 1;
        }
      })
      if (arrTemp > 0) {
        confirm('还有'+ arrTemp +'道题未完成，你确定要提交试卷吗？', ()=>{
          this.submitAnswer();
        });
      }else{
        confirm('确定要提交试卷吗？', ()=>{
          this.submitAnswer();
        });
      }
      
    },
    //提交作答
    submitAnswer(){
      loadingModal(true);
      let that = this;
      let arrTemp = [];
      for (let index = 0; index < that.judgeQuestions.length; index++) {
        let obj = {
          questionsId: that.judgeQuestions[index].questionsId,
          questionsScore: that.judgeQuestions[index].questionsScore,
          replyId: that.answer.judgeAnswer[index].replyIds,
          questionsNum: index + 1,
        }
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.choiceQuestions.length; index++) {
        let replyIds = "";
        if (that.choiceQuestions[index].questionsType === '1') {
          replyIds = that.answer.choiceAnswer[index].replyIds;
        }else{
          replyIds = that.answer.choiceAnswer[index].replyIds.join(",");
        }
        let obj = {
          questionsId: that.choiceQuestions[index].questionsId,
          questionsScore:  that.choiceQuestions[index].questionsScore,
          replyId: replyIds,
          questionsNum: index + 1,
        }
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.gapFillingQuestions.length; index++) {
        let obj = {
          questionsId: that.gapFillingQuestions[index].questionsId,
          questionsScore: that.gapFillingQuestions[index].questionsScore,
          //replyId: that.answer.gapFillingAnswer[index].gapFillingList,
          gapFillingList: that.answer.gapFillingAnswer[index].gapFillingList,
          content: that.answer.gapFillingAnswer[index].content ? that.answer.gapFillingAnswer[index].content : '',
          questionsNum: index + 1,
        }
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.shortAnswerQuestions.length; index++) {
        let obj = {
          questionsId: that.shortAnswerQuestions[index].questionsId,
          questionsScore: that.shortAnswerQuestions[index].questionsScore,
          replyId: that.answer.shortAnswerAnswer[index].replyIds,
          content: that.answer.shortAnswerAnswer[index].content ? that.answer.shortAnswerAnswer[index].content : '',
          questionsNum: index + 1,
        }
        arrTemp.push(obj);
      }

      that.compositeQuestions.forEach((item,index) => {
          item.questionList.forEach((item0,index0) => {
            let obj = {};

            if ("1" === item0.questionsType || "2" === item0.questionsType) {
              let replyIds = "";
              if (item0.questionsType  === '1') {
                replyIds = that.answer.compositeAnswer[index].answer[index0].replyIds;
              }else{
                replyIds = that.answer.compositeAnswer[index].answer[index0].replyIds.join(",");
              }
              obj = {
                questionsId: item0.questionsId,
                questionsScore:  item.questionsScore,
                replyId: replyIds,
                questionsNum: index + 1,
              }
            }

            if ("3" === item0.questionsType) {
              obj = {
                questionsId: item0.questionsId,
                questionsScore: item.questionsScore,
                replyId: that.answer.compositeAnswer[index].answer[index0].replyIds,
                questionsNum: index + 1,
              }
            }

            if ("5" === item0.questionsType) {
              obj = {
                questionsId: item0.questionsId,
                questionsScore: item.questionsScore,
                gapFillingList: that.answer.compositeAnswer[index].answer[index0].gapFillingList,
                content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                questionsNum: index + 1,
              }
            }

            if ("4" === item0.questionsType) {
              obj = {
                questionsId: item0.questionsId,
                questionsScore: item.questionsScore,
                replyId: that.answer.compositeAnswer[index].answer[index0].replyIds,
                content: that.answer.compositeAnswer[index].answer[index0].content ? that.answer.compositeAnswer[index].answer[index0].content : '',
                questionsNum: index + 1,
              }
            }

            arrTemp.push(obj);
          })
      })
      this.isWirte = false;
      that.$api.questionbank.saveReplyInformation(that.dyId,arrTemp).then(res => {
        if(res.code === 0){

          if (!res.data.paper) {
            this.toback('/question-bank-center/test-question-bank');
            loadingModal(false);
            toast('作答已提交');
          }

          this.choiceQuestions = res.data.choseScores;  //存入选择题信息
          this.judgeQuestions = res.data.judgeScores;   //存入判断题信息
          this.shortAnswerQuestions = res.data.shortAnswerList;
          this.gapFillingQuestions = res.data.gapFillingList;
          this.compositeQuestions = res.data.compoundList ? res.data.compoundList : [];
          this.textInfo.paperConfinementTime = parseInt(res.data.paper.paperConfinementTime);   //存入作答时间信息
          this.textInfo.TotalScore = res.data.paper.paperTotalScore;    //总分
          this.textInfo.paperName = res.data.paper.paperName;         //试卷名
          this.textInfo.hasPermission = false;
          this.history = res.data.history;        //试卷基本信息
          //存入当前学员对选择题、判断题的作答信息
          this.answer.judgeAnswer = [];
          this.answer.choiceAnswer = [];
          this.answer.gapFillingAnswer = [];
          this.answer.shortAnswerAnswer = [];
          this.answer.compositeAnswer = [];

          for (let index = 0; index < this.judgeQuestions.length; index++) {
            let replyIds = '';
            
            for(let i = 0; i < this.judgeQuestions[index].optionList.length; i++){
              if(this.judgeQuestions[index].optionList[i].isUserSelected){
                replyIds = this.judgeQuestions[index].optionList[i].optionId;
              }
            }
            let obj = {
              optionId: this.judgeQuestions[index].questionsId,
              replyIds: replyIds ? replyIds : '',
            }
            this.answer.judgeAnswer.push(obj);
          }

          for (let index = 0; index < this.gapFillingQuestions.length; index++) {
            let temp = [];
            if (this.gapFillingQuestions[index].userSelectedAnswer.length <= 0) {
              for (let i = 0; i < this.gapFillingQuestions[index].optionList.length; i++) {
                let obj0 = {content: '',state: 'N',optionId:'',questionsId:''}
                temp.push(obj0);
              }
            }else{
              temp = this.gapFillingQuestions[index].userSelectedAnswer;
            }
            let obj = {
              optionId: this.gapFillingQuestions[index].questionsId,
              gapFillingList: temp,
              content: ''
            }
            this.answer.gapFillingAnswer.push(obj);
          } 

          for (let index = 0; index < this.shortAnswerQuestions.length; index++) {
            let obj = {
              optionId: this.shortAnswerQuestions[index].questionsId,
              replyIds: '',
              content: this.shortAnswerQuestions[index].content ? this.shortAnswerQuestions[index].content : ''
            }
            this.answer.shortAnswerAnswer.push(obj);
          } 

          for (let index = 0; index < this.choiceQuestions.length; index++) {
            let obj = {}
            if (this.choiceQuestions[index].questionsType === '1') {
              let replyIds = '';
              for(let i = 0; i < this.choiceQuestions[index].optionList.length; i++){
                if(this.choiceQuestions[index].optionList[i].isUserSelected){
                  replyIds = this.choiceQuestions[index].optionList[i].optionId;
                }
              }
              obj = {
                optionId: this.choiceQuestions[index].questionsId,
                replyIds: replyIds
              }
            }else{
              let replyIds = [];
              for(let i = 0; i < this.choiceQuestions[index].optionList.length; i++){
                if(this.choiceQuestions[index].optionList[i].isUserSelected){
                  replyIds.push(this.choiceQuestions[index].optionList[i].optionId);
                }
              }
              obj = {
                optionId: this.choiceQuestions[index].questionsId,
                replyIds: replyIds
              }
            }
            this.answer.choiceAnswer.push(obj);
          }

          this.compositeQuestions.forEach((item,index) => {
            let arrTemp = [];
            item.questionList.forEach((item0,index0) => {
              let obj = {};

              if ("1" === item0.questionsType || "2" === item0.questionsType) {
                if (item0.questionsType === '1') {
                  let replyIds = '';
                  for(let i = 0; i < item0.optionList.length; i++){
                    if(item0.optionList[i].isUserSelected){
                      replyIds = item0.optionList[i].optionId;
                    }
                  }
                  obj = {
                    optionId: item0.questionsId,
                    replyIds: replyIds
                  }
                }else{
                  let replyIds = [];
                  for(let i = 0; i < item0.optionList.length; i++){
                    if(item0.optionList[i].isUserSelected){
                      replyIds.push(item0.optionList[i].optionId);
                    }
                  }
                  obj = {
                    optionId: item0.questionsId,
                    replyIds: replyIds
                  }
                }
              }

              if ("3" === item0.questionsType) {
                let replyIds = '';
                
                for(let i = 0; i < item0.optionList.length; i++){
                  if(item0.optionList[i].isUserSelected){
                    replyIds = item0.optionList[i].optionId;
                  }
                }
                obj = {
                  optionId: item0.questionsId,
                  replyIds: replyIds ? replyIds : '',
                }
              }

              if ("4" === item0.questionsType) {
                obj = {
                  optionId: item0.questionsId,
                  replyIds: '',
                  content: item0.content ? item0.content : ''
                }
              }

              if ("5" === item0.questionsType) {
                let temp = [];
                if (item0.userAnswerList.length <= 0) {
                  for (let i = 0; i < item0.optionList.length; i++) {
                    let obj0 = {content: '',state: 'N',optionId:'',questionsId:''}
                    temp.push(obj0);
                  }
                }else{
                  temp = item0.userAnswerList;
                }
                obj = {
                  optionId: item0.questionsId,
                  gapFillingList: temp,
                  content: ''
                }
              }
              arrTemp.push(obj);
            })
            let tempObj = {answer: arrTemp};
            this.answer.compositeAnswer.push(tempObj);
          })
          console.log(this.answer)
          this.isView = true;
          clearInterval(this.timer);
          if (this.timer2) {
            clearInterval(this.timer2);
          }
        }else{
          this.toback('/question-bank-center/test-question-bank');
          loadingModal(false);
        }
        toast(res.msg);
        loadingModal(false);
      });
      // that.$api.activityTest.examineCommit(that.ctId,that.dyId,arrTemp).then(res => {
      //   if(res.code === 0){
          
      //   }
      //   toast(res.msg);
      // });
    },
    //获取当前用户消息
    getCurrUserInfo(){
      this.currInfo.name= localStorage.getItem('username');
      if (!localStorage.getItem('userimg').includes("http")) {
        this.currInfo.imgSrc = baseUrl + localStorage.getItem('userimg');
      }else{
        this.currInfo.imgSrc = localStorage.getItem('userimg');
      }
    },
  },
  created() {

  },
  mounted(){
    this.paperId = localStorage.getItem('paperIdByStartExamination')
    
      //获得题目详情
      this.getTopicInfo();
      this.getCurrUserInfo();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  }
};
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
  /* 右侧题目导航样式 */
  .question-nav{
    position: fixed;
    top: 141px;
    right: 0;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
    z-index: 777;
    width: 300px;
    -webkit-touch-callout:none;  /*!*系统默认菜单被禁用*!*/
    -webkit-user-select:none; /*!*webkit浏览器*!*/
    -khtml-user-select:none; /*!*早期浏览器*!*/
    -moz-user-select:none;/*!*火狐*!*/
    -ms-user-select:none; /*!*IE10*!*/
    user-select:none;
  }
  .img-name-area{
    background-color: #007bff;
    padding: 10px 20px;
    width: 100%;
    text-align: left;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    justify-content: space-between;
  }
  .img-name-area img{
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
  .img-name-area span{
    margin-left: 10px;
    color: #ffffff;
  }
  .judge-area{
    text-align: left;
    background-color: #ffffff;
    padding-top: 15px;
  }
  .judge-title{
    margin: 0 20px 10px 20px;
    border-left: 2px solid #333;
    padding: 2px 10px;
  }
  .judge-content{
    display: flex;
    flex-wrap:wrap;
  }
  .judge-content{
    padding: 0 20px;
  }
  .judge-content span{
    cursor: pointer;
    font-size: 13px;
    margin-right: 10px;
    margin-top: 10px;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    width: 25px;
    border-radius: 5px;
    text-align: center;
  }
  .judge-content span:hover{
    background-color: #ff740e;
    color: #ffffff;
    border: none;
  }
  .not-filled-color{
    background-color: #f2f2f2;
    border: 1px solid #b8acac;
  }
  .filled-color{
    background-color: #409eff;
    color: #ffffff;
    border: 1px solid #ffffff;
  }
  .not-filled-color1{
    background-color: red;
    color: #ffffff;
  }
  .filled-short{
    background-color: #d8d7d7;
    color: #ffffff;
  }
  .filled-short1{
    background-color: #d8d7d7;
    color: #ffffff;
  }
  .filled-color1{
    background-color: #67c23a;
    color: #ffffff;
  }
  .btn-area{
    background-color: #ffffff;
    padding: 20px 0;
  }
  .calculate-area{
    background-color: #ffffff;
    padding-bottom: 20px;
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
    /* 所有题目显示高度限制样式 */
    .question-list{
      max-height: 400px;
      overflow-y: scroll;
    }
</style>
