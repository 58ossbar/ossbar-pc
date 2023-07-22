<!-- 题库的 教师 组卷预览 页面 -->
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
        <div class="test-question-bank-pages fontSize14">
            <!-- 内容区域 begin -->
            <!-- 左边 选择项 begin -->
            <div class="test-question-left ">
              <cb-question-papers papersType="2" :isOrganizingPreviewPaper="true" :isShowAddBtns="false" :isEdit="true" ref="question" :gapFillingQuestions="completionQuestions" :shortAnswerQuestions="shortAnswerQuestions" :compositeQuestions="compoundQuestions"  :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions" :textInfo="dataForm"></cb-question-papers>
            </div>
            <!-- 左边 选择项 end -->
            <!-- 右边 选择项 begin -->
            <div class="question-nav">
              <!-- 头像昵称显示区域 -->
              <div class="img-name-area">
                <span>总分：{{dataForm.TotalScore}}分</span>
              </div>
              <!-- 判断题显示区域 -->
              <div class="judge-area" v-if="judgeQuestions.length !== 0">
                <div class="judge-title">
                  <span>判断题</span>({{judgeQuestions.length}}题 / {{judgeAllScore}} 分）
                </div>
                <div class="judge-content">
                  <div>每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange"  v-model="dataForm.judgeScore"  :min="1" label="" controls-position="right" size="mini" ></el-input-number>
                  <div>分</div>
                </div>
              </div>
              <!-- 单选题显示区域 -->
              <div class="judge-area" v-if="singleChoiceQuestions.length !== 0">
                <div class="judge-title">
                  <span>单选题</span> ({{singleChoiceQuestions.length}}题 / {{singleChoiceAllScore}} 分）
                </div>
                <div class="judge-content">
                  <div>每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.singleChoiceScore"  :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
              </div>
              <!-- 多选题显示区域 -->
              <div class="judge-area" v-if="multipleChoiceQuestions.length !== 0">
                <div class="judge-title">
                  <span>多选题</span> ({{multipleChoiceQuestions.length}}题 / {{multipleChoiceAllScore}} 分）
                </div>
                <div class="judge-content">
                  <div>每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.multipleChoiceScore"  :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
              </div>
              <!-- 选择题显示区域 -->
              <!-- <div class="judge-area" v-if="choiceQuestions.length !== 0">
                <div class="judge-title">
                  <span>选择题</span>{{choiceQuestions.length}}题 / {{choiceAllScore}} 分）
                </div>
                <div class="judge-content fixedmb">
                  <div>单选每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.singleChoiceScore"  :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
                <div class="judge-content">
                  <div>多选每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.multipleChoiceScore" :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
              </div> -->
              <!-- 填空题显示区域 -->
              <div class="judge-area" v-if="completionQuestions.length !== 0">
                <div class="judge-title">
                  <span>填空题</span> ({{completionQuestions.length}}题 / {{completionAllScore}} 分）
                </div>
                <div class="judge-content fixedmb">
                  <div>每空</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.completionScore" :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
                <div class="judge-content gap-filling-score-standard">
                  <div>得分规则</div>
                  <el-radio v-model="dataForm.gapFillingScoreStandard" label="1">每空得分</el-radio>
                  <el-radio v-model="dataForm.gapFillingScoreStandard" label="2">全对得分</el-radio>
                </div>
              </div>
              <!-- 简答题显示区域 -->
              <div class="judge-area" v-if="shortAnswerQuestions.length !== 0">
                <div class="judge-title">
                  <span>简答题</span> ({{shortAnswerQuestions.length}}题 / {{shortAnswerAllScore}} 分）
                </div>
                <div class="judge-content">
                  <div>每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.shortAnswerScore"  :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
              </div>
              <!-- 复合题显示区域 -->
              <div class="judge-area" v-if="compoundQuestions.length !== 0">
                <div class="judge-title">
                  <span>复合题</span> ({{compoundQuestions.length}}题 / {{compoundNum}}小题 / {{compoundAllScore}} 分）
                </div>
                <div class="judge-content">
                  <div>每小题</div>
                  <el-input-number class="score-input-num" @change="inputNumberChange" v-model="dataForm.compoundScore"  :min="1" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分</div>
                </div>
              </div>
              <!-- 智能选项 区域 -->
              <div class="judge-area">
                <div class="judge-title">
                  <span>智能选项</span>
                </div>
                <div class="judge-content">
                  <button type="button" class="btn btn-success btn-sm" @click="getQuestionsList">随机题目</button>
                </div>
              </div>
              <!-- 试卷信息 区域 -->
              <div class="judge-area">
                <div class="judge-title">
                  <span>基本信息</span>
                </div>
                <div class="judge-content fixedmb">
                  <span>试卷名称</span><span class="color-d81e06 judge-content-paper-name-budge">*&nbsp;&nbsp;</span>
                  <el-input placeholder="请输入试卷名称" class="score-input" size="mini" id="paperName" v-model="dataForm.paperName" clearable></el-input>
                </div>
                <div class="invalid-feedback col-10 textAlignLeft p-0 paperNameHint"><small >请输入试卷名称！</small></div>
                <div class="judge-content">
                  <span class="judge-content-paper-name-budge">答题时间</span>
                  <el-input-number class="score-input-num" v-model="dataForm.paperConfinementTime" @change="inputNumberChange" :min="0" label="" controls-position="right" size="mini"></el-input-number>
                  <div>分钟</div>
                </div>
                 <div class="invalid-feedback col-10 textAlignLeft p-0 paperConfinementTimeHint"><small >答题时长为0则不限制时长</small></div>
              </div>
              <!-- 按钮显示区域 -->
              <div class="btn-area">
                <el-button type="primary" style="width: 80%" @click="generateTestPaper">保存试卷</el-button>
              </div>
            </div>
            <!-- 右边 选择项 end -->
            <!-- 内容区域 end -->
        </div>
        <!-- <footer-nav></footer-nav> -->
    </div>
</template>
<script>
import { loadingModal, toast, confirm, formVaildStyle, formInVaildStyle} from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import CbQuestionPapers from '@/components/cb-question-papers/index'
export default {
  name: 'test-question-organizing-papers-preview',
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'cb-question-papers': CbQuestionPapers
  },
  data () {
    return {
      
      type: '组卷',
      dataForm: {
        judgeScore: '1',
        singleChoiceScore: '1',
        multipleChoiceScore: '1',
        shortAnswerScore: '1',
        compoundScore: '1',
        completionScore: '1',
        paperName: '',
        paperConfinementTime: '',
        TotalScore: 0,
        gapFillingScoreStandard: '1'
      }, // 表单数据项
      judgeAllScore: 0,
      choiceAllScore: 0,
      singleChoiceAllScore: 0,
      multipleChoiceAllScore: 0,
      shortAnswerAllScore: 0,
      completionAllScore: 0,
      compoundAllScore: 0,
      choiceQuestions: [], // 选择题
      judgeQuestions: [], // 判断题
      singleChoiceQuestions: [], // 单选题
      multipleChoiceQuestions: [], // 多选题
      completionQuestions: [], // 填空题
      shortAnswerQuestions: [], // 问答题
      compoundQuestions: [], // 复合题
      compoundNum: 0, //复合题小题数
    }
  },
  filters: {

  },
  watch: {
    compoundQuestions(){
      this.compoundNum = 0;
      this.compoundQuestions.forEach(item => {
        this.compoundNum += item.children.length;
      })
    },
    'allPropsChange': { // 监听多个数据
      handler: function (val) {
        // console.log('1111val', val)
        // 获取 单选 和多选题 的数组
        this.singleChoiceQuestions = [];
        this.multipleChoiceQuestions = [];
        if (val.choiceQuestions && val.choiceQuestions.length > 0) {
          val.choiceQuestions.forEach((item, index) => {
            if (item.questionsType && item.questionsType === '1') {
              this.singleChoiceQuestions.push(item);
            } else if (item.questionsType && item.questionsType === '2') {
                this.multipleChoiceQuestions.push(item);
            }
          })
        }
        // if (!val.compoundQuestions || val.compoundQuestions.length < 1) {
        //   this.dataForm.compoundScore = '0';
        // }
        // if (!val.judgeQuestions || val.judgeQuestions.length < 1) {
        //   this.dataForm.judgeScore = '0';
        // }
        // if (!this.singleChoiceQuestions || this.singleChoiceQuestions.length < 1) {
        //   this.dataForm.singleChoiceScore = '0';
        // }
        // if (!this.multipleChoiceQuestions || this.multipleChoiceQuestions.length < 1) {
        //   this.dataForm.multipleChoiceScore = '0';
        // }
        // if (!val.shortAnswerQuestions || val.shortAnswerQuestions.length < 1) {
        //   this.dataForm.shortAnswerScore = '0';
        // }
        // if (!val.completionQuestions || val.completionQuestions.length < 1) {
        //   this.dataForm.completionScore = '0';
        // }
        this.inputNumberChange();

      },
      immediate: true
    }
  },
  computed: {
    allPropsChange: function () { // 监听多个数据
      const {choiceQuestions, judgeQuestions, completionQuestions, shortAnswerQuestions, compoundQuestions} = this
      return {
        choiceQuestions,
        judgeQuestions,
        completionQuestions,
        shortAnswerQuestions,
        compoundQuestions
      }
    }
  },
  created () {
  },
  beforeDestroy () {
    localStorage.removeItem('organizingPapersDatas');
    localStorage.removeItem('organizingPapersManualDatas');
    localStorage.removeItem('organizingPapersReSelectDatas');
  },
  mounted () {
    this.getQuestionsList()
    this.$nextTick(() => {
      // document.getElementsByClassName('')
      this.$el.querySelector('.test-question-left').style.height = this.$el.querySelector('.question-nav').style.height
    })
  },
  methods: {
    /** 保存试卷 */
    generateTestPaper: function () {
      if(!this.dataForm.paperName || this.dataForm.paperName === ''){
        $("#paperName").focus();
        $(".paperNameHint").html("请输入试卷名称!");
        formInVaildStyle('.paperNameHint',"#paperName");
        $("#paperName").css('borderColor','#dc3545');
        return false;
      } else {
        if (this.dataForm.paperName.length > 100) {
          $(".paperNameHint").html("试卷名称不能超过100个字符!");
          $("#paperName").focus();
          $("#paperName").css('borderColor','#dc3545');
          formInVaildStyle('.paperNameHint',"#paperName");
          return false;
        }
      }
      $("#paperName").removeAttr("style");
      formVaildStyle('.paperNameHint',"#paperName");

      // if (!this.dataForm.paperName) {
      //   return false;
      // }
      let that = this;
      confirm('确定提交吗？', function () {
        let result = JSON.parse(JSON.stringify(that.dataForm));

        if (!that.compoundQuestions || that.compoundQuestions.length < 1) {
          result.compoundScore = '0';
        }
        if (!that.judgeQuestions || that.judgeQuestions.length < 1) {
          result.judgeScore = '0';
        }
        if (!that.singleChoiceQuestions || that.singleChoiceQuestions.length < 1) {
          result.singleChoiceScore = '0';
        }
        if (!that.multipleChoiceQuestions || that.multipleChoiceQuestions.length < 1) {
          result.multipleChoiceScore = '0';
        }
        if (!that.shortAnswerQuestions || that.shortAnswerQuestions.length < 1) {
          result.shortAnswerScore = '0';
        }
        if (!that.completionQuestions || that.completionQuestions.length < 1) {
          result.completionScore = '0';
        }

        
        result.judgeScore = result.judgeScore.toString(); // 判断
        result.singleChoiceScore = result.singleChoiceScore.toString(); // 单选
        result.multipleChoiceScore = result.multipleChoiceScore.toString(); // 多选
        result.shortAnswerScore = result.shortAnswerScore.toString(); // 简答
        result.compoundScore = result.compoundScore.toString(); // 复合
        result.completionScore = result.completionScore.toString(); // 填空

        result.gapFilling = result.completionScore; // 填空
        result.compositeScore = result.compoundScore; // 复合
        delete result.completionScore;
        delete result.compoundScore;

        result.answerTime = result.paperConfinementTime;
        result.questionsList = [];
        that.choiceQuestions.forEach((item, index) => {
          //result.questionsList.push({questionsId: item.questionsId, questionsType: item.questionsType})
          result.questionsList.push(item)
        });
        that.judgeQuestions.forEach((item, index) => {
          //result.questionsList.push({questionsId: item.questionsId, questionsType: item.questionsType})
          result.questionsList.push(item)
        });
        that.completionQuestions.forEach((item, index) => {
          //result.questionsList.push({questionsId: item.questionsId, questionsType: item.questionsType})
          result.questionsList.push(item)
        });
        that.shortAnswerQuestions.forEach((item, index) => {
          //result.questionsList.push({questionsId: item.questionsId, questionsType: item.questionsType})
          result.questionsList.push(item)
        });
        that.compoundQuestions.forEach((item, index) => {
          //result.questionsList.push({questionsId: item.questionsId, questionsType: item.questionsType})
          result.questionsList.push(item)
        });
        loadingModal(true)
        that.$api.questionbank.generateTestPaper(result).then((res) => {
          loadingModal(false)
          if (res.code === 0) {
            toast('保存成功')
            setTimeout(function () {
              that.toback('/question-bank-center/test-question-bank')
            }, 2000)
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
    /** 计算 每个题型的总分 和 所有题目的总分 */
    inputNumberChange: function  (currentValue, oldValue) {
      if (!this.dataForm.judgeScore || this.dataForm.judgeScore === undefined) {
        this.dataForm.judgeScore = '1';
      }
      if (!this.dataForm.completionScore || this.dataForm.completionScore === undefined) {
        this.dataForm.completionScore = '1';
      }
      if (!this.dataForm.shortAnswerScore || this.dataForm.shortAnswerScore === undefined) {
        this.dataForm.shortAnswerScore = '1';
      }
      if (!this.dataForm.singleChoiceScore || this.dataForm.singleChoiceScore === undefined) {
        this.dataForm.singleChoiceScore = '1';
      }
      if (!this.dataForm.multipleChoiceScore || this.dataForm.multipleChoiceScore === undefined) {
        this.dataForm.multipleChoiceScore = '1';
      }
      if (!this.dataForm.compoundScore || this.dataForm.compoundScore === undefined) {
        this.dataForm.compoundScore = '1';
      }
       if (!this.dataForm.paperConfinementTime || this.dataForm.paperConfinementTime === undefined) {
        this.dataForm.paperConfinementTime = '0';
      }
      // console.log('currentValue', currentValue)
      this.choiceAllScore = this.getSingleAllScore('choice');
      this.judgeAllScore = this.getSingleAllScore('judge');
      this.completionAllScore = this.getSingleAllScore('completion');
      this.shortAnswerAllScore = this.getSingleAllScore('shortAnswer');
      this.singleChoiceAllScore = this.getSingleAllScore('singleChoice');
      this.multipleChoiceAllScore = this.getSingleAllScore('multipleChoice');
      this.compoundAllScore = this.getSingleAllScore('compound');
      // 计算总分
      this.dataForm.TotalScore = 0;
      this.dataForm.TotalScore = this.judgeAllScore + this.choiceAllScore + this.shortAnswerAllScore + this.completionAllScore + this.compoundAllScore;
    },
    /** 获取单个题目的总分 */
    getSingleAllScore: function (arrName) {
      let result = 0;
      if (arrName === 'choice') {
        // this[arrName + 'AllScore'] = 0
        if (this[arrName + 'Questions'] && this[arrName + 'Questions'].length > 0) {
          let singleChoiceNum = 0
          let multipleChoiceUnm = 0
          this[arrName + 'Questions'].forEach((item, index) => {
            if (item.questionsType && item.questionsType === '1') {
              singleChoiceNum++
            } else if (item.questionsType && item.questionsType === '2') {
              multipleChoiceUnm++
            }
          })
          result = parseInt(this.dataForm.singleChoiceScore) * singleChoiceNum + parseInt(this.dataForm.multipleChoiceScore) * multipleChoiceUnm;
          // return result;
        }
      } else {
        // this[arrName + 'AllScore'] = 0
        if (this[arrName + 'Questions'] && this[arrName + 'Questions'].length > 0 && this.dataForm[arrName + 'Score'] && parseInt(this.dataForm[arrName + 'Score']) > 0) {
          if (arrName === 'compound') {
            result = parseInt(this.dataForm[arrName + 'Score']) * this.compoundNum;
          }else{
            result = parseInt(this.dataForm[arrName + 'Score']) * (this[arrName + 'Questions'].length)
          }
          // return result;
        }
      }
      return  result;
    },
    // 处理正确答案 公共方法
    handleReplyId: function(arr) {
      if (arr && arr.length > 0) {
        arr.forEach(item => {
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
        })
      }
      return arr
    },
    /** 获取题目数组 */
    getQuestionsList: function () {
      let arr = (localStorage.getItem('organizingPapersDatas') && localStorage.getItem('organizingPapersDatas') !== undefined) ? (JSON.parse(localStorage.getItem('organizingPapersDatas'))) : [];

      const arrt = (localStorage.getItem('organizingPapersManualDatas') && localStorage.getItem('organizingPapersManualDatas') !== undefined) ? (JSON.parse(localStorage.getItem('organizingPapersManualDatas'))) : []
      let urlName = 'generateTestPaperQuestionsRandom'
      if (arrt && arrt.length > 0) {
        urlName = 'generateTestPaperQuestionsManual'
        arr = [ ...arrt ]
      }

      this.$api.questionbank[urlName](arr).then(res => {
        if (res.code === 0) {
          if (res && res.questionsMap) {
            this.choiceQuestions = this.handleReplyId(res.questionsMap.choiceQuestions || []);
            this.judgeQuestions = this.handleReplyId(res.questionsMap.judgeQuestions || []);
            this.completionQuestions = this.handleReplyId(res.questionsMap.completionQuestions || []);
            this.shortAnswerQuestions = this.handleReplyId(res.questionsMap.shortAnswerQuestions || []);
            this.compoundQuestions = this.handleReplyId(res.questionsMap.compoundQuestions || []);
          } else {
            this.choiceQuestions = this.handleReplyId(res.data.choiceQuestions || []);
            this.judgeQuestions = this.handleReplyId(res.data.judgeQuestions || []);
            this.completionQuestions = this.handleReplyId(res.data.completionQuestions || []);
            this.shortAnswerQuestions = this.handleReplyId(res.data.shortAnswerQuestions || []);
            this.compoundQuestions = this.handleReplyId(res.data.compoundQuestions || []);
          }

          this.singleChoiceQuestions = [];
          this.multipleChoiceQuestions = [];
          // 获取 单选 和多选题 的数组
          if (this.choiceQuestions && this.choiceQuestions.length > 0) {
            this.choiceQuestions.forEach((item, index) => {
              if (item.questionsType && item.questionsType === '1') {
                this.singleChoiceQuestions.push(item);
              } else if (item.questionsType && item.questionsType === '2') {
                 this.multipleChoiceQuestions.push(item);
              }
            })
          }
          if (this.compoundQuestions && this.compoundQuestions.length > 0) {
            this.compoundQuestions.forEach((item, index) => {
              item.questionList = [];
              if (item.children && item.children.length > 0) {
                item.children = this.handleReplyId(item.children || [])
                item.questionList = JSON.parse(JSON.stringify(item.children));
              }
            });
            // this.dataForm.compoundScore = '1';
          }
          this.dataForm.gapFillingScoreStandard = '1';
          this.$forceUpdate();
          // if (this.judgeQuestions && this.judgeQuestions.length > 0) {
          //   this.dataForm.judgeScore = '1';
          // }
          // if (this.singleChoiceQuestions && this.singleChoiceQuestions.length > 0) {
          //   this.dataForm.singleChoiceScore = '1';
          // }
          // if (this.multipleChoiceQuestions && this.multipleChoiceQuestions.length > 0) {
          //   this.dataForm.multipleChoiceScore = '1';
          // }
          // if (this.shortAnswerQuestions && this.shortAnswerQuestions.length > 0) {
          //   this.dataForm.shortAnswerScore = '1';
          // }
          // if (this.completionQuestions && this.completionQuestions.length > 0) {
          //   this.dataForm.completionScore = '1';
          // }
          this.inputNumberChange();
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
        /* height: calc(100vh - 50px - 100px - 100px ); */
        /* height: 100%; */
        box-sizing: border-box;
        width: 1200px;
        margin: 0 auto;
        /* overflow-y: scroll; */
        display: flex;
        justify-content: space-between;
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
      height: calc(100% - 60px);
    }
    .test-question-left,
    .question-nav{
        height: 100%;
        box-sizing: border-box;
    }
    .test-question-left{
        width: 75%;
        height: 710px;
        overflow: scroll;
        /* box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px; */
        /* border-radius: 5px; */
        background-color: #fff;
        padding: 10px;
    }
    .question-nav{
      width: 28%;
      padding: 0 0 0 15px;
    }
    .img-name-area{
      background-color: #007bff;
      padding: 15px 20px;
      width: 100%;
      text-align: left;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
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
    .judge-title span:first-child{
      padding-right: 10px;
      box-sizing: border-box;
    }
    .judge-content{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 20px;
    }
    .judge-content div:first-child{
      padding-right: 15px;
    }
    .judge-content .score-input-num{
      width: 50%;
      margin-right: 10px;
    }
    .judge-content .score-input{
      width: 67%;
    }
    .btn-area{
      background-color: #ffffff;
      padding: 20px 0;
    }
    .fixedmb{
      margin-bottom: 10px;
    }
    .judge-content.gap-filling-score-standard .el-radio{
      margin-right: 5px;
      margin-bottom: 0;
    }
    .paperNameHint{
      margin-top: -10px !important;
      padding-left: 90px !important;
      box-sizing: border-box;
    }
    .judge-content-paper-name-budge:first-child{
      padding-right: 15px;
      display: inline-block;
      box-sizing: border-box;
    }
    .paperConfinementTimeHint{
      margin-top: -10px !important;
      padding-left: 90px !important;
      box-sizing: border-box;
      display: inline-block;
    }
</style>
