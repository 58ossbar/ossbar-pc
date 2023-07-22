<!-- 教师阅卷测试活动页面 -->
<template>
  <div class="view-write-test-activity">
    <!-- 当前位置导航begin -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="cursor" @click="goToViewAllTest()">作答详情</span> > <span class="present-localtion-title">{{pageTitle}}</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
        <span @click="goToViewAllTest">返回</span>
      </div>
    </div>
    <!-- 当前位置导航end -->

    <!-- 试卷页面begin -->
    <cb-question-papers papersType="0" ref="question" :answer="answer" :compositeQuestions="compositeQuestions" :textInfo="textInfo" :gapFillingQuestions="gapFillingQuestions" :isInTheChapter="isInTheChapter" :shortAnswerQuestions="shortAnswerQuestions" :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions"></cb-question-papers>
    <!-- 试卷页面end -->

    <!-- 右侧题目导航 -->
    <div class="question-nav" @mousedown="moveDetails($event)">
      <!-- 头像昵称显示区域 -->
      <div class="img-name-area">
        <div>
          <img :src="testPersonnelInfo.traineePic"/>
          <span>{{testPersonnelInfo.traineeName}}</span>
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
            <span v-for="(item,index) in judgeQuestions" :class="[item.isCorrect === 'Y' ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'1')">
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
            <span v-for="(item,index) in choiceQuestions" :class="[item.isCorrect === 'Y' ? 'filled-color' : 'not-filled-color']" :key="index" @click="jump(index,'2')">
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
            <span v-for="(item,index) in gapFillingQuestions" :class="[item.isCorrect && item.isCorrect === 'Y' ? 'filled-color' : ((item.isCorrect && item.isCorrect === 'N')?'not-filled-color':'filled-short')]" :key="index" @click="jump(index,'4')">
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
            <span v-for="(item,index) in shortAnswerQuestions" :class="[item.isCorrect && item.isCorrect === 'Y' ? 'filled-color' : ((item.isCorrect && item.isCorrect === 'N')?'not-filled-color':'filled-short')]" :key="index" @click="jump(index,'3')">
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
            <span v-for="(item,index) in compositeQuestions" :class="[item.userScore  === (item.questionsScore * item.questionList.length).toString() === (item.questionsScore * item.questionList.length).toString() ? 'filled-color' : 'filled-short']" :key="index" @click="jump(index,'5')">
              {{index+1}}
            </span>
            <!-- backgroundImage:linear-gradient() backgroundImage:-webkit-linear-gradient() backgroundImage:-moz-linear-gradient() backgroundImage:-o-linear-gradient() -->
            <!-- :class="[item.userScore  === (item.questionsScore * item.questionList.length).toString() === (item.questionsScore * item.questionList.length).toString() ? 'filled-color' : 'filled-short']" -->
            <!-- :style="{backgroundImage: (item.norPercentage < 100)? ('linear-gradient(#67c23a ' + item.rightPercentage +'%, red ' + item.errPercentage +'%, #d8d7d7)'):'#d8d7d7'}" -->
            <!-- <span v-for="(item,index) in compositeQuestions" :key="index" :style="{backgroundImage: item.bgString + ''}" :class="[item.rightPercentage && item.rightPercentage === 100 ? 'filled-color' : ((item.errPercentage && item.errPercentage === 100)?'not-filled-color':'filled-short')]" @click="jump(index,'5')">
              {{index+1}}
            </span> -->
          </div>
        </div>
      </div>

      <!-- 按钮显示区域 -->
      <div class="btn-area">
        <el-button type="primary" style="width: 80%" @click="goToViewAllTest()">退出查看</el-button>
      </div>
      <!-- 分数区域 -->
      <div class="calculate-area">
        <span style="font-size: 20px;">得分：<span :style="(parseFloat(history.paperFinalScore)/parseFloat(textInfo.TotalScore)) >= 0.6 ? 'color:#67c23a' : 'color:red'">{{history.paperFinalScore}}</span></span>
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
import CbCountdown from '@/components/cb-count-down/index';
export default {
  name: 'view-write-info-test-activity',
  components: {
    //题目显示页面组件
    "cb-question-papers": CbQuestionPapers,
    //倒计时页面组件
    "cb-countdown": CbCountdown,
  },
  props: {
    // 教学包主键
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    ctId: {
      type: String,
      required: true,
      default: ''
    },
    isInTheChapter:{
      type: Boolean,
      required: false,
      default: false
    },
    testInfo: {
      type: Object,
      required: true,
    },
    testPersonnelInfo:{
      type: Object,
      required: true,
    },
    //活动信息
    activityInfo : {
      type: Object,
      required: true,
    },
    // 权限标识
    hasPermission: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data() {
    return {
        pageTitle: '学员作答',
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
        history: {},
        dyId: '',
        isShowCountdown: false,
        positionX:0,  //详情水平位置
        positionY:0,  //详情垂直位置
    };
  },
  methods: {
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
     * 返回到活动主页面
     */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false);
    },
    //到活动总览页面
    goToViewAllTest(){
      this.$parent.goToViewAllOverviewTest(true);
    },
    toToSetScrollTop(height){
      this.$parent.toSetScrollTop(height);
    },
    //定位
    jump(index,value){
      if ('1' === value) {    //定位某判断题位置
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
      formData.append("ctId", this.ctId);
      formData.append("dyId", this.testInfo.dyId);
      formData.append("traineeId", this.testInfo.traineeId)
      this.$api.activityTest.examineResult(formData).then(res => {
        if (res.code === 0) {
          this.choiceQuestions = res.data.choseScores;  //存入选择题信息
          this.judgeQuestions = res.data.judgeScores;   //存入判断题信息
          this.shortAnswerQuestions = res.data.shortAnswerList;
          this.gapFillingQuestions = res.data.gapFillingList;
          this.compositeQuestions = res.data.compositeList ? res.data.compositeList : [];
          this.textInfo.paperConfinementTime = parseInt(res.data.paper.paperConfinementTime);   //存入作答时间信息
          this.textInfo.TotalScore = res.data.paper.paperTotalScore;    //总分
          this.textInfo.paperName = res.data.paper.paperName;         //试卷名
          this.textInfo.ctId = this.ctId;
          this.textInfo.pkgId = this.pkgId;
          this.textInfo.hasPermission = this.hasPermission || res.license.hasActivity4ShortAnswerGradingPermission;
          this.textInfo.activityId = this.activityInfo.activityId;
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
              if(this.judgeQuestions[index].optionList[i].isSelected){
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
            if (this.gapFillingQuestions[index].userAnswerList.length <= 0) {
              for (let i = 0; i < this.gapFillingQuestions[index].optionList.length; i++) {
                let obj0 = {content: '',state: 'N',optionId:'',questionsId:''}
                temp.push(obj0);
              }
            }else{
              temp = this.gapFillingQuestions[index].userAnswerList;
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
                if(this.choiceQuestions[index].optionList[i].isSelected){
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
                if(this.choiceQuestions[index].optionList[i].isSelected){
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
            let rightNum = 0
            let errNum = 0
            item.questionList.forEach((item0,index0) => {
              if (item0.isCorrect && item0.isCorrect === 'Y') {
                rightNum++
              } else if (item0.isCorrect && item0.isCorrect === 'N') {
                errNum++
              }
              let obj = {};

              if ("1" === item0.questionsType || "2" === item0.questionsType) {
                if (item0.questionsType === '1') {
                  let replyIds = '';
                  for(let i = 0; i < item0.optionList.length; i++){
                    if(item0.optionList[i].isSelected){
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
                    if(item0.optionList[i].isSelected){
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
                  if(item0.optionList[i].isSelected){
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

            
            // item.rightPercentage = rightNum / (item.questionList.length) * 100
            // item.errPercentage = errNum / (item.questionList.length) * 100
            // item.norPercentage = 100 - item.rightPercentage - item.errPercentage
            // if (rightPercentage === 100) {
            //   item.bgString = '#67c23a'
            // } else if (errPercentage === 100) {
            //   item.bgString = 'red'
            // } else if (norPercentage === 100) {
            //   item.bgString = '#d8d7d7'
            // } else 
            // if (rightPercentage === 0) {
            //   item.bgString = 'linear-gradient(red ' + errPercentage +'%, #d8d7d7'
            // } else if (errPercentage === 0) {
            //   item.bgString = 'linear-gradient(#67c23a ' + rightPercentage +'%, #d8d7d7'
            // } else if (norPercentage === 0) {
            //   item.bgString = 'linear-gradient(#67c23a ' + rightPercentage +'%, red'
            // } else {
            //   item.bgString = 'linear-gradient(#67c23a ' + rightPercentage +'%, red ' + errPercentage +'%, #d8d7d7)'
            // }
            // item.bgString = '#67c23a ' + item.rightPercentage +'%, red ' + item.errPercentage +'%, #d8d7d7'
            // if (item.rightPercentage === 0) {}

            // console.log('111', item.bgString)
          })

        }else{
          toast(res.msg);
        }
        loadingModal(false);
      })
    },


  },
  created() {

  },
  mounted(){
      //获得题目详情
      this.getTopicInfo();
      this.pageTitle = this.activityInfo.activityTitle;

  },
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
    top: 180px;
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
  }
  .not-filled-color{
    background-color: red;
    color: #ffffff;
  }
  .filled-short{
    background-color: #d8d7d7;
    color: #ffffff;
  }
  .filled-color{
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
  /* 所有题目显示高度限制样式 */
  .question-list{
    max-height: 400px;
    overflow-y: scroll;
  }
</style>
