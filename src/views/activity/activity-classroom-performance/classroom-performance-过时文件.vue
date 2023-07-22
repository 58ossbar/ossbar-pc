<!-- 页面 -->
<template>
    <div class="classroom-performance">
      <!-- 路径导航开始 -->
      <div class="present-localtion">
        <div>
          当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="cursor">课堂表现</span> > <span class="present-localtion-title">评分</span>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
          <span @click="goToPageActivityList()">返回</span>
        </div>
      </div>
        <!-- 路径导航结束 -->
        <div style="width: 95%;margin: 20px auto;height: 50px;display: flex;">
          <img src="static/image/Performance0.png">
          <div style="height: 50px;line-height: 50px;font-size: 14px;margin-left: 20px">课堂表现</div>
        </div>
        <div style="width: 100%;margin: 20px auto;height: 1px;background: #e0e0e0"></div>
        <div style="width: 95%;margin: 20px auto">
          <b-row>
            <b-col cols="3">
              <div style="width: 250px;height: 260px;background: #f15968;border-radius: 10px" @click="showInitiateViesAnswerPage()">
                <img src="static/image/Performance2.png" style="margin-top: 15px">
                <div style="color: white;font-size: 18px;margin-top: 20px">抢答</div>
                <div style="color: white;font-size: 14px;margin-top: 10px">紧张刺激给课堂氛围加点料</div>
              </div>
            </b-col>
            <b-col cols="3">
              <div style="width: 250px;height: 260px;background: #ffc148;border-radius: 10px" @click="showPerformanceThree()">
                <img src="static/image/Performance1.png" style="margin-top: 15px">
                <div style="color: white;font-size: 18px;margin-top: 20px">随机选人</div>
                <div style="color: white;font-size: 14px;margin-top: 10px">随机一抽，看看谁是幸运儿</div>
              </div>
            </b-col>
            <b-col cols="3">
              <div style="width: 250px;height: 260px;background: #62baf5;border-radius: 10px" @click="showRaiseHandPage()">
                <img src="static/image/Performance3.png" style="margin-top: 15px">
                <div style="color: white;font-size: 18px;margin-top: 20px">手动选人</div>
                <div style="color: white;font-size: 14px;margin-top: 10px">亲自翻牌子，谁是你的宠儿呢</div>
              </div>
            </b-col>
            <b-col cols="3">
              <div style="width: 250px;height: 260px;background: #b6d037;border-radius: 10px" @click="showTeamEvaluationPage()">
                <img src="static/image/Performance4.png" style="margin-top: 15px">
                <div style="color: white;font-size: 18px;margin-top: 20px">小组评价</div>
                <div style="color: white;font-size: 14px;margin-top: 10px">以小组为单位的评价</div>
              </div>
            </b-col>
          </b-row>
        </div>
    </div>
</template>

<script>
  import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global'
  export default {
    name: "classroom-performance",
    props: {

    },
    data () {
      return {
        pageTitle: '课堂表现',
      }
    },
    methods:{
      /**
       * 跳页面
       */
      goToPageActivityList () {
        this.$parent.changeVotoQuestionnairePage(false);
      },
      //跳选人页面
      showPerformanceThree:function(){
        this.$parent.showCandidates();
      },
      //跳发起抢答页面
      showInitiateViesAnswerPage:function(){
        this.$parent.showInitiateViesAnswer();
      },
      //跳转举手页面
      showRaiseHandPage(){
        this.$parent.showRaiseHand();
      },
      //跳转小组评分页面
      showTeamEvaluationPage(){
        this.$parent.showTeamEvaluation();
      },
    },
    created () {
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
</style>
