<!-- 学生填写测试活动页面 -->
<template>
  <div class="view-write-test-activity">
    <!-- 当前位置导航begin -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> >
        <span class="present-localtion-title">{{ pageTitle }}</span>
      </div>
      <div class="classroom-back">
        <i
          class="fa fa-angle-left classroom-back-icon"
          aria-hidden="true"
          @click="goToPageActivityList()"
        ></i>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 当前位置导航end -->

    <!-- 试卷页面begin -->
    <cb-question-papers
      papersType="1"
      ref="question"
      :isInTheChapter="isInTheChapter"
      :compositeQuestions="compositeQuestions"
      :gapFillingQuestions="gapFillingQuestions"
      :historyAnswers="historyAnswers"
      :textInfo="textInfo"
      :shortAnswerQuestions="shortAnswerQuestions"
      :choiceQuestions="choiceQuestions"
      :judgeQuestions="judgeQuestions"
    ></cb-question-papers>
    <!-- 试卷页面end -->

    <!-- 右侧题目导航 -->
    <div class="question-nav" @mousedown="moveDetails($event)">
      <!-- 头像昵称显示区域 -->
      <div class="img-name-area">
        <img :src="currInfo.imgSrc" />
        <span>{{ currInfo.name }}</span>
      </div>

      <div class="question-list">
        <!-- 判断题显示区域 -->
        <div class="judge-area" v-if="judgeQuestions.length !== 0">
          <div class="judge-title">判断题 ({{ judgeQuestions.length }}题)</div>
          <div class="judge-content">
            <span
              v-for="(item, index) in judgeQuestions"
              :class="[
                answer.judgeAnswer[index].replyIds
                  ? 'filled-color'
                  : 'not-filled-color',
              ]"
              :key="index"
              @click="jump(index, '1')"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>
        <!-- 选择题显示区域 -->
        <div class="judge-area" v-if="choiceQuestions.length !== 0">
          <div class="judge-title">选择题 ({{ choiceQuestions.length }}题)</div>
          <div class="judge-content">
            <span
              v-for="(item, index) in choiceQuestions"
              :class="[
                answer.choiceAnswer[index].replyIds.length > 0
                  ? 'filled-color'
                  : 'not-filled-color',
              ]"
              :key="index"
              @click="jump(index, '2')"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>
        <!-- 填空题显示区域 -->
        <div class="judge-area" v-if="gapFillingQuestions.length !== 0">
          <div class="judge-title">
            填空题 ({{ gapFillingQuestions.length }}题)
          </div>
          <div class="judge-content">
            <!-- answer.gapFillingAnswer[index].gapFillingList[0].content -->
            <span
              v-for="(item, index) in gapFillingQuestions"
              :class="[
                getGapFillingState(
                  answer.gapFillingAnswer[index].gapFillingList
                ) === 'Y'
                  ? 'filled-color'
                  : 'not-filled-color',
              ]"
              :key="index"
              @click="jump(index, '4')"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>
        <!-- 简答题显示区域 -->
        <div class="judge-area" v-if="shortAnswerQuestions.length !== 0">
          <div class="judge-title">
            简答题 ({{ shortAnswerQuestions.length }}题)
          </div>
          <div class="judge-content">
            <span
              v-for="(item, index) in shortAnswerQuestions"
              :class="[
                answer.shortAnswerAnswer[index].content
                  ? 'filled-color'
                  : 'not-filled-color',
              ]"
              :key="index"
              @click="jump(index, '3')"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>
        <!-- 复合题显示区域 -->
        <div class="judge-area" v-if="compositeQuestions.length !== 0">
          <div class="judge-title">
            复合题 ({{ compositeQuestions.length }}题)
          </div>
          <div class="judge-content">
            <span
              v-for="(item, index) in compositeQuestions"
              :class="[
                getCompositeState(answer.compositeAnswer[index].answer) === 'Y'
                  ? 'filled-color'
                  : 'not-filled-color',
              ]"
              :key="index"
              @click="jump(index, '5')"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>
      </div>

      <!-- 按钮显示区域 -->
      <div class="btn-area">
        <el-button type="primary" style="width: 40%" @click="temporarySave('manualOperation')"
          >临时保存</el-button
        >
        <el-button type="danger" style="width: 40%" @click="isSubmitAnswer"
          >提交试卷</el-button
        >
      </div>
      <!-- 计时区域 -->
      <div class="calculate-area" v-if="textInfo.paperConfinementTime !== 0">
        倒计时111：<cb-countdown
          v-if="isShowCountdown"
          :remainTime="endTime"
        ></cb-countdown>
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
} from "@/utils/global";
import CbQuestionPapers from "@/components/cb-question-papers/index";
import CbCountdown from "@/components/cb-count-down/index";
export default {
  name: "view-write-test-activity",
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
      default: "",
    },
    isInTheChapter: {
      type: Boolean,
      required: false,
      default: false,
    },
    ctId: {
      type: String,
      required: true,
      default: "",
    },
    //活动信息
    activityInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pageTitle: "学员作答",
      choiceQuestions: [], //选择题
      judgeQuestions: [], //判断题
      gapFillingQuestions: [], //填空题
      shortAnswerQuestions: [], //问答题
      compositeQuestions: [], //问答题
      //学生作答详情
      answer: {
        choiceAnswer: [],
        judgeAnswer: [],
        gapFillingAnswer: [],
        shortAnswerAnswer: [],
        compositeAnswer: [],
      },
      textInfo: {
        paperConfinementTime: 0, //测试时间
        paperName: "",
        TotalScore: 0,
      },
      dyId: "",
      currInfo: {
        name: "",
        ingSrc: "",
      },
      historyAnswers: [],
      isShowCountdown: false,
      positionX: 0, //详情水平位置
      positionY: 0, //详情垂直位置
      endTime: 0, //距离结束时间
    };
  },
  watch: {
    endTime(newValue, oldValue) {
    },
  },
  methods: {
    /**
     * 复合题是否做答玩判断
     */
    getCompositeState(value) {
      let temp = true;
      value.forEach((item, index) => {
        if (
          (!item.content || item.content === "") &&
          (!item.replyIds || item.replyIds.length <= 0)
        ) {
          if (item.gapFillingList && item.gapFillingList.length > 0) {
            item.gapFillingList.forEach((item0) => {
              if (!item0.content && item0.content === "") {
                temp = false;
              }
            });
          } else {
            temp = false;
          }
        }
      });
      if (temp) {
        return "Y";
      } else {
        return "N";
      }
    },

    /**
     * 填空题是否做答判断
     */
    getGapFillingState(value) {
      let temp = true;
      value.forEach((item) => {
        if (!item.content || item.content === "") {
          temp = false;
        }
      });
      if (temp) {
        return "Y";
      } else {
        return "N";
      }
    },

    /**
     *  详情移动事件
     */
    moveDetails(e) {
      //获取目标元素
      //let odiv = e.target;
      let odiv = document.querySelector(".question-nav");
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      //document.onselectstart = function() { return false; };//解决拖动会选中文字的问题
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;

        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
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
    toToSetScrollTop(height) {
      this.$parent.toSetScrollTop(height);
    },
    //定位
    jump(index, value) {
      if ("1" === value) {
        this.$refs.question.toJudgeQuestion(index);
      } else if ("2" === value) {
        this.$refs.question.toChoiceQuestion(index);
      } else if ("3" === value) {
        this.$refs.question.toShortAnswerQuestion(index);
      } else if ("4" === value) {
        this.$refs.question.toGapFillingQuestion(index);
      } else if ("5" === value) {
        this.$refs.question.toCompositeQuestion(index);
      }
    },
    //获得题目信息
    getTopicInfo() {
      loadingModal(true);
      let formData = new FormData();
      formData.append("paperId", this.activityInfo.activityId);
      formData.append("pkgId", this.pkgId);
      formData.append("ctId", this.ctId);
      this.$api.activityTest.examineList(formData).then((res) => {
        if (res.code === 0) {
          this.judgeQuestions = res.data.judgeList;
          this.choiceQuestions = res.data.choseList;
          this.gapFillingQuestions = res.data.gapFillingList;
          this.shortAnswerQuestions = res.data.shortAnswerList;
          this.compositeQuestions = res.data.compositeList
            ? res.data.compositeList
            : [];
          this.textInfo.paperConfinementTime = parseInt(
            res.data.paper.paperConfinementTime
          );
          this.textInfo.TotalScore = res.data.paper.paperTotalScore;
          this.textInfo.paperName = res.data.paper.paperName;
          this.dyId = res.data.dyId;
          this.isShowCountdown = true;
          this.historyAnswers = res.data.historyAnswers;
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
              replyIds: "",
              content: "",
            };
            this.answer.judgeAnswer.push(obj);
          }

          for (let index = 0; index < this.choiceQuestions.length; index++) {
            let obj = {};
            if (this.choiceQuestions[index].questionsType === "1") {
              obj = {
                optionId: this.choiceQuestions[index].optionId,
                replyIds: "",
                content: "",
              };
            } else {
              obj = {
                optionId: this.choiceQuestions[index].optionId,
                replyIds: [],
                content: "",
              };
            }
            this.answer.choiceAnswer.push(obj);
          }
          for (
            let index = 0;
            index < this.gapFillingQuestions.length;
            index++
          ) {
            let obj = {};
            let replyIds = [];
            for (
              let index0 = 0;
              index0 < this.gapFillingQuestions[index].gapFillingNumber;
              index0++
            ) {
              replyIds.push({ id: "", content: "" });
            }
            obj = {
              optionId: this.gapFillingQuestions[index].questionsId,
              gapFillingList: replyIds,
              questionsScore: this.gapFillingQuestions[index].questionsScore,
              content: "",
            };
            this.answer.gapFillingAnswer.push(obj);
          }
          for (
            let index = 0;
            index < this.shortAnswerQuestions.length;
            index++
          ) {
            let obj = {
              optionId: this.shortAnswerQuestions[index].optionId,
              replyIds: "",
              content: "",
            };
            this.answer.shortAnswerAnswer.push(obj);
          }

          this.compositeQuestions.forEach((item, index) => {
            let arrTemp = [];
            if (!item.children && item.children.length < 1) {
              return;
            }
            item.questionList = item.children;
            item.questionList.forEach((item0, index0) => {
              let obj = {};
              if (item0.questionsType === "1") {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : "123",
                  replyIds: "",
                  content: "",
                };
              }
              if (item0.questionsType === "2") {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : "123",
                  replyIds: [],
                  content: "",
                };
              }
              if (item0.questionsType === "3") {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : "123",
                  replyIds: "",
                  content: "",
                };
              }
              if (item0.questionsType === "4") {
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : "123",
                  replyIds: "",
                  content: "",
                };
              }
              if (item0.questionsType === "5") {
                let replyIds = [];
                if (item0.optionList) {
                  for (
                    let index0 = 0;
                    index0 < item0.optionList.length;
                    index0++
                  ) {
                    replyIds.push({ id: "", content: "" });
                  }
                } else {
                  for (
                    let index0 = 0;
                    index0 < item0.gapFillingNumber;
                    index0++
                  ) {
                    replyIds.push({ id: "", content: "" });
                  }
                }

                obj = {
                  optionId: item0.questionsId ? item0.questionsId : "123",
                  questionsScore: item0.questionsScore,
                  gapFillingList: replyIds,
                  content: "",
                };
              }
              arrTemp.push(obj);
            });
            let tempObj = { answer: arrTemp };
            this.answer.compositeAnswer.push(tempObj);
          });

          let that = this;
          this.timer = setInterval(function () {
            let arrTemp = [];
            for (let index = 0; index < that.judgeQuestions.length; index++) {
              let obj = {
                questionsId: that.judgeQuestions[index].questionsId,
                questionsScore: that.judgeQuestions[index].questionsScore,
                replyId: that.answer.judgeAnswer[index].replyIds,
                questionsNum: that.judgeQuestions[index].questionsNumber,
                content: that.answer.judgeAnswer[index].content
                  ? that.answer.judgeAnswer[index].content
                  : "",
              };
              arrTemp.push(obj);
            }

            for (let index = 0; index < that.choiceQuestions.length; index++) {
              let replyIds = "";
              if (that.choiceQuestions[index].questionsType === "1") {
                replyIds = that.answer.choiceAnswer[index].replyIds;
              } else {
                replyIds = that.answer.choiceAnswer[index].replyIds.join(",");
              }
              let obj = {
                questionsId: that.choiceQuestions[index].questionsId,
                questionsScore: that.choiceQuestions[index].questionsScore,
                replyId: replyIds,
                questionsNum: that.choiceQuestions[index].questionsNumber,
                content: that.answer.choiceAnswer[index].content
                  ? that.answer.choiceAnswer[index].content
                  : "",
              };
              arrTemp.push(obj);
            }

            for (
              let index = 0;
              index < that.gapFillingQuestions.length;
              index++
            ) {
              let obj = {
                questionsId: that.gapFillingQuestions[index].questionsId,
                questionsScore: that.gapFillingQuestions[index].questionsScore,
                gapFillingList:
                  that.answer.gapFillingAnswer[index].gapFillingList,
                questionsNum: that.gapFillingQuestions[index].questionsNumber,
                content: that.answer.gapFillingAnswer[index].content
                  ? that.answer.gapFillingAnswer[index].content
                  : "",
              };
              arrTemp.push(obj);
            }

            for (
              let index = 0;
              index < that.shortAnswerQuestions.length;
              index++
            ) {
              let obj = {
                questionsId: that.shortAnswerQuestions[index].questionsId,
                questionsScore: that.shortAnswerQuestions[index].questionsScore,
                replyId: that.answer.shortAnswerAnswer[index].replyIds,
                questionsNum: that.shortAnswerQuestions[index].questionsNumber,
                content: that.answer.shortAnswerAnswer[index].content
                  ? that.answer.shortAnswerAnswer[index].content
                  : "",
              };
              arrTemp.push(obj);
            }

            that.compositeQuestions.forEach((item, index) => {
              item.questionList.forEach((item0, index0) => {
                let obj = {};

                if (
                  "1" === item0.questionsType ||
                  "2" === item0.questionsType
                ) {
                  let replyIds = "";
                  if (item0.questionsType === "1") {
                    replyIds =
                      that.answer.compositeAnswer[index].answer[index0]
                        .replyIds;
                  } else {
                    replyIds = that.answer.compositeAnswer[index].answer[
                      index0
                    ].replyIds.join(",");
                  }
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    replyId: replyIds,
                    content: that.answer.compositeAnswer[index].answer[index0]
                      .content
                      ? that.answer.compositeAnswer[index].answer[index0]
                          .content
                      : "",
                    questionsNum: item0.questionsNumber,
                  };
                }

                if ("3" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    replyId:
                      that.answer.compositeAnswer[index].answer[index0]
                        .replyIds,
                    questionsNum: item0.questionsNumber,
                    content: that.answer.compositeAnswer[index].answer[index0]
                      .content
                      ? that.answer.compositeAnswer[index].answer[index0]
                          .content
                      : "",
                  };
                }

                if ("5" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    gapFillingList:
                      that.answer.compositeAnswer[index].answer[index0]
                        .gapFillingList,
                    content: that.answer.compositeAnswer[index].answer[index0]
                      .content
                      ? that.answer.compositeAnswer[index].answer[index0]
                          .content
                      : "",
                    questionsNum: item0.questionsNumber,
                  };
                }

                if ("4" === item0.questionsType) {
                  obj = {
                    questionsId: item0.questionsId,
                    questionsScore: item0.questionsScore,
                    replyId:
                      that.answer.compositeAnswer[index].answer[index0]
                        .replyIds,
                    content: that.answer.compositeAnswer[index].answer[index0]
                      .content
                      ? that.answer.compositeAnswer[index].answer[index0]
                          .content
                      : "",
                    questionsNum: item0.questionsNumber,
                  };
                }

                arrTemp.push(obj);
              });
            });

            that.$api.activityTest
              .examinePreCommit(that.dyId, arrTemp)
              .then((res) => {});
          }, 5000);

          if (
            this.textInfo.paperConfinementTime &&
            this.textInfo.paperConfinementTime !== 0
          ) {
            that.$api.activityTest.loadPaperTime(that.dyId).then((data) => {
              if (data.code === 0) {
                that.endTime = parseInt(data.endTime / 1000);
                // 限时的情况下，如果在时间结束前，退出该页面，等到时间结束后，再进来，依旧需要清空定时器，且自动提交该试卷
                console.log('时间已经到了，则需要自动提交试卷')
                if (that.endTime === 0) {
                  if (that.timer2) {
                    clearInterval(that.timer2)
                  }
                  if (that.timer) {
                    clearInterval(that.timer)
                  }
                  // that.$message.warning('本次时间已经结束，自动提交试卷')
                  that.submitAnswer()
                }
              }
            });
            this.timer2 = setInterval(function () {
              that.$api.activityTest.loadPaperTime(that.dyId).then((data) => {
                if (data.code === 0) {
                  that.endTime = parseInt(data.endTime / 1000);
                }
              });
            }, 5000);
          }
        } else {
          toast(res.msg);
        }
        loadingModal(false);
      });
    },

    //临时保存
    temporarySave(str) {
      let that = this;
      let arrTemp = [];
      for (let index = 0; index < that.judgeQuestions.length; index++) {
        let obj = {
          questionsId: that.judgeQuestions[index].questionsId,
          questionsScore: that.judgeQuestions[index].questionsScore,
          replyId: that.answer.judgeAnswer[index].replyIds,
          questionsNum: that.judgeQuestions[index].questionsNumber,
          content: that.answer.judgeAnswer[index].content
            ? that.answer.judgeAnswer[index].content
            : "",
        };
        arrTemp.push(obj);
      }

      for (let index = 0; index < that.choiceQuestions.length; index++) {
        let replyIds = "";
        if (that.choiceQuestions[index].questionsType === "1") {
          replyIds = that.answer.choiceAnswer[index].replyIds;
        } else {
          replyIds = that.answer.choiceAnswer[index].replyIds.join(",");
        }
        let obj = {
          questionsId: that.choiceQuestions[index].questionsId,
          questionsScore: that.choiceQuestions[index].questionsScore,
          replyId: replyIds,
          questionsNum: that.choiceQuestions[index].questionsNumber,
          content: that.answer.choiceAnswer[index].content
            ? that.answer.choiceAnswer[index].content
            : "",
        };
        arrTemp.push(obj);
      }

      for (let index = 0; index < that.gapFillingQuestions.length; index++) {
        let obj = {
          questionsId: that.gapFillingQuestions[index].questionsId,
          questionsScore: that.gapFillingQuestions[index].questionsScore,
          gapFillingList: that.answer.gapFillingAnswer[index].gapFillingList,
          questionsNum: that.gapFillingQuestions[index].questionsNumber,
          content: that.answer.gapFillingAnswer[index].content
            ? that.answer.gapFillingAnswer[index].content
            : "",
        };
        arrTemp.push(obj);
      }

      for (let index = 0; index < that.shortAnswerQuestions.length; index++) {
        let obj = {
          questionsId: that.shortAnswerQuestions[index].questionsId,
          questionsScore: that.shortAnswerQuestions[index].questionsScore,
          replyId: that.answer.shortAnswerAnswer[index].replyIds,
          questionsNum: that.shortAnswerQuestions[index].questionsNumber,
          content: that.answer.shortAnswerAnswer[index].content
            ? that.answer.shortAnswerAnswer[index].content
            : "",
        };
        arrTemp.push(obj);
      }

      that.compositeQuestions.forEach((item, index) => {
        item.questionList.forEach((item0, index0) => {
          let obj = {};

          if ("1" === item0.questionsType || "2" === item0.questionsType) {
            let replyIds = "";
            if (item0.questionsType === "1") {
              replyIds =
                that.answer.compositeAnswer[index].answer[index0].replyIds;
            } else {
              replyIds = that.answer.compositeAnswer[index].answer[
                index0
              ].replyIds.join(",");
            }
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item0.questionsScore,
              replyId: replyIds,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
              questionsNum: item0.questionsNumber,
            };
          }

          if ("3" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item0.questionsScore,
              replyId:
                that.answer.compositeAnswer[index].answer[index0].replyIds,
              questionsNum: item0.questionsNumber,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
            };
          }

          if ("5" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item0.questionsScore,
              gapFillingList:
                that.answer.compositeAnswer[index].answer[index0]
                  .gapFillingList,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
              questionsNum: item0.questionsNumber,
            };
          }

          if ("4" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item0.questionsScore,
              replyId:
                that.answer.compositeAnswer[index].answer[index0].replyIds,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
              questionsNum: item0.questionsNumber,
            };
          }

          arrTemp.push(obj);
        });
      });

      that.$api.activityTest
        .examinePreCommit(that.dyId, arrTemp)
        .then((res) => {
          if (res.code === 0) {
            if (str === 'manualOperation') {
              toast('临时保存成功')
            }
          }
        });
    },

    //获取答案数据
    getAnswer(value) {
      this.answer.choiceAnswer = value.choiceAnswer;
      this.answer.judgeAnswer = value.judgeAnswer;
      this.answer.gapFillingAnswer = value.gapFillingAnswer;
      this.answer.shortAnswerAnswer = value.shortAnswerAnswer;
      this.answer.compositeAnswer = value.compositeAnswer;
    },
    //提交试卷询问
    isSubmitAnswer() {
      let arrTemp = 0;
      //获取选择题未作答个数
      this.answer.choiceAnswer.forEach(function (item, index) {
        if (!item.replyIds || item.replyIds.length <= 0) {
          arrTemp += 1;
        }
      });
      //获取判断题未作答个数
      this.answer.judgeAnswer.forEach(function (item, index) {
        if (!item.replyIds) {
          arrTemp += 1;
        }
      });
      //获取填空题未作答个数
      this.answer.gapFillingAnswer.forEach(function (item, index) {
        if (item.gapFillingList && item.gapFillingList.length >= 0) {
          for (let index = 0; index < item.gapFillingList.length; index++) {
            if (
              !item.gapFillingList[index].content &&
              "" === item.gapFillingList[index].content
            ) {
              arrTemp += 1;
              break;
            }
          }
        }
      });
      //获取简答题未作答个数
      this.answer.shortAnswerAnswer.forEach(function (item, index) {
        if (!item.content) {
          arrTemp += 1;
        }
      });
      //获取复合题未作答个数
      this.answer.compositeAnswer.forEach((item0, index0) => {
        item0.answer.forEach((item, index) => {
          if (
            (!item.content || item.content === "") &&
            (!item.replyIds || item.replyIds.length <= 0)
          ) {
            if (item.gapFillingList && item.gapFillingList.length > 0) {
              item.gapFillingList.forEach((item0) => {
                if (!item0.content && item0.content === "") {
                  arrTemp += 1;
                }
              });
            } else {
              arrTemp += 1;
            }
          }
        });
      });

      if (arrTemp > 0) {
        confirm("还有" + arrTemp + "道题未完成，你确定要提交试卷吗？", () => {
          this.submitAnswer();
        });
      } else {
        confirm("确定要提交试卷吗？", () => {
          this.submitAnswer();
        });
      }
    },
    //提交作答
    submitAnswer() {
      let that = this;
      let arrTemp = [];
      for (let index = 0; index < that.judgeQuestions.length; index++) {
        let obj = {
          questionsId: that.judgeQuestions[index].questionsId,
          questionsScore: that.judgeQuestions[index].questionsScore,
          replyId: that.answer.judgeAnswer[index].replyIds,
          questionsNum: index + 1,
        };
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.choiceQuestions.length; index++) {
        let replyIds = "";
        if (that.choiceQuestions[index].questionsType === "1") {
          replyIds = that.answer.choiceAnswer[index].replyIds;
        } else {
          replyIds = that.answer.choiceAnswer[index].replyIds.join(",");
        }
        let obj = {
          questionsId: that.choiceQuestions[index].questionsId,
          questionsScore: that.choiceQuestions[index].questionsScore,
          replyId: replyIds,
          questionsNum: index + 1,
        };
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.gapFillingQuestions.length; index++) {
        let obj = {
          questionsId: that.gapFillingQuestions[index].questionsId,
          questionsScore: that.gapFillingQuestions[index].questionsScore,
          //replyId: that.answer.gapFillingAnswer[index].gapFillingList,
          gapFillingList: that.answer.gapFillingAnswer[index].gapFillingList,
          content: that.answer.gapFillingAnswer[index].content
            ? that.answer.gapFillingAnswer[index].content
            : "",
          questionsNum: index + 1,
        };
        arrTemp.push(obj);
      }
      for (let index = 0; index < that.shortAnswerQuestions.length; index++) {
        let obj = {
          questionsId: that.shortAnswerQuestions[index].questionsId,
          questionsScore: that.shortAnswerQuestions[index].questionsScore,
          replyId: that.answer.shortAnswerAnswer[index].replyIds,
          content: that.answer.shortAnswerAnswer[index].content
            ? that.answer.shortAnswerAnswer[index].content
            : "",
          questionsNum: index + 1,
        };
        arrTemp.push(obj);
      }

      that.compositeQuestions.forEach((item, index) => {
        item.questionList.forEach((item0, index0) => {
          let obj = {};

          if ("1" === item0.questionsType || "2" === item0.questionsType) {
            let replyIds = "";
            if (item0.questionsType === "1") {
              replyIds =
                that.answer.compositeAnswer[index].answer[index0].replyIds;
            } else {
              replyIds = that.answer.compositeAnswer[index].answer[
                index0
              ].replyIds.join(",");
            }
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item.questionsScore,
              replyId: replyIds,
              questionsNum: index + 1,
            };
          }

          if ("3" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item.questionsScore,
              replyId:
                that.answer.compositeAnswer[index].answer[index0].replyIds,
              questionsNum: index + 1,
            };
          }

          if ("5" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item.questionsScore,
              gapFillingList:
                that.answer.compositeAnswer[index].answer[index0]
                  .gapFillingList,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
              questionsNum: index + 1,
            };
          }

          if ("4" === item0.questionsType) {
            obj = {
              questionsId: item0.questionsId,
              questionsScore: item.questionsScore,
              replyId:
                that.answer.compositeAnswer[index].answer[index0].replyIds,
              content: that.answer.compositeAnswer[index].answer[index0].content
                ? that.answer.compositeAnswer[index].answer[index0].content
                : "",
              questionsNum: index + 1,
            };
          }

          arrTemp.push(obj);
        });
      });

      that.$api.activityTest
        .examineCommit(that.ctId, that.dyId, arrTemp)
        .then((res) => {
          if (res.code === 0) {
          }
          toast(res.msg);
          this.goToPageActivityList();
        });
    },
    //获取当前用户消息
    getCurrUserInfo() {
      this.currInfo.name = localStorage.getItem("username");
      if (!localStorage.getItem("userimg").includes("http")) {
        this.currInfo.imgSrc = baseUrl + localStorage.getItem("userimg");
      } else {
        this.currInfo.imgSrc = localStorage.getItem("userimg");
      }
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function (res) {
      let that = this;
      if (res.busitypeIndexNew === 23 || res.busitypeIndexNew === 24) {
        // 获取消息主界面列表数据
        if (res.code === 0) {
          if (res.data && res.data.msg && res.data.msg.length > 0) {
            for (let i = 0; i < res.data.msg.length; i++) {
              if (
                res.busitypeIndexNew === 23 &&
                res.data.msg[i].ctId &&
                res.data.msg[i].activityId
              ) {
                if (
                  res.data.msg[i].ctId === this.ctId &&
                  res.data.msg[i].activityId === this.activityInfo.activityId
                ) {
                  this.submitAnswer();
                }
                //that.newMsgCount = (res.data.msg[i] && res.data.msg[i].unReadNum) ? (res.data.msg[i].unReadNum) : 0
              } else if (
                res.busitypeIndexNew === 24 &&
                res.data.msg[i].ctId &&
                res.data.msg[i].activityId
              ) {
                if (
                  res.data.msg[i].ctId === this.ctId &&
                  res.data.msg[i].activityId === this.activityInfo.activityId
                ) {
                  this.submitAnswer();
                  that.$router.push({
                    path: "/my/learning-classroom",
                  });
                }
              }
            }
          }
        }
      }
    },
  },
  created() {
    let that = this;
    window.eventBus.$on("eventBusReceivedMsgData", function (data) {
      that.handleMessBackData(data);
    });
  },
  mounted() {
    //获得题目详情
    this.getTopicInfo();
    this.pageTitle = this.activityInfo.activityTitle;
    this.getCurrUserInfo();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  },
};
</script>

<style scoped>
/* 返回 */
.classroom-back {
  text-align: right;
  font-size: 14px;
  cursor: pointer;
  color: #158aeb;
  margin-right: 20px;
}
.classroom-back-icon {
  font-size: 14px;
  margin-right: 5px;
}
/* 手势动作 */
.cursor {
  cursor: pointer;
}
/* 当前位置 */
.present-localtion {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: left;
  padding-left: 15px;
  display: flex;
  justify-content: space-between;
}
.present-localtion-title {
  color: #959da0;
}
/* 右侧题目导航样式 */
.question-nav {
  position: fixed;
  top: 180px;
  right: 0;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  z-index: 777;
  width: 300px;
  -webkit-touch-callout: none; /*!*系统默认菜单被禁用*!*/
  -webkit-user-select: none; /*!*webkit浏览器*!*/
  -khtml-user-select: none; /*!*早期浏览器*!*/
  -moz-user-select: none; /*!*火狐*!*/
  -ms-user-select: none; /*!*IE10*!*/
  user-select: none;
}
.img-name-area {
  background-color: #007bff;
  padding: 10px 20px;
  width: 100%;
  text-align: left;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.img-name-area img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.img-name-area span {
  margin-left: 10px;
  color: #ffffff;
}
.judge-area {
  text-align: left;
  background-color: #ffffff;
  padding-top: 15px;
}
.judge-title {
  margin: 0 20px 10px 20px;
  border-left: 2px solid #333;
  padding: 2px 10px;
}
.judge-content {
  display: flex;
  flex-wrap: wrap;
}
.judge-content {
  padding: 0 20px;
}
.judge-content span {
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
.judge-content span:hover {
  background-color: #ff740e;
  color: #ffffff;
  border: none;
}
.not-filled-color {
  background-color: #f2f2f2;
  border: 1px solid #b8acac;
}
.filled-color {
  background-color: #409eff;
  color: #ffffff;
  border: 1px solid #ffffff;
}
.btn-area {
  background-color: #ffffff;
  padding: 20px 0;
}
.calculate-area {
  background-color: #ffffff;
  padding-bottom: 20px;
}
/* 所有题目显示高度限制样式 */
.question-list {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
