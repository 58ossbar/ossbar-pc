<template>
    <div class="view-storm-mind">
        <!-- 当前位置导航区域开始 -->
        <div class="location bg-fafafa">
            <!-- 当前位置显示开始 -->
            <div style="display: flex;width: 50%">
                <!-- 当前位置文字 -->
                <div class="localtion-title">
                    <b>当前位置:</b>
                </div>
                <!-- 当前位置内容开始 -->
                <ul class="localtion-list">
                    <!-- 活动主页面 -->
                    <li class="localtion-item" style="cursor: pointer" @click="goToPageActivityList">
                        活动
                    </li>
                    <!-- 当前页面名称 -->
                    <li class="localtion-item">
                        <span style="color: #959da0">{{viewActivityInfo.activityTitle}}</span>
                    </li>
                </ul>
                <!-- 当前位置内容结束 -->
            </div>
            <!-- 当前位置显示结束 -->
            <!-- 返回操作显示开始 -->
            <div class="classroom-back">
                <!-- 返回图标 -->
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <!-- 文字 -->
                <span @click="goToPageActivityList()">返回</span>
            </div>
            <!-- 返回操作显示结束 -->
        </div>
        <!-- 当前位置导航区域结束 -->
        <!-- 内容区域开始 -->
        <div class="storm-mind-details">
            <!-- 详情标题开始 -->
            <div class="details-title">
                <!-- 题目主题 -->
                <div class="details-title-content">
                    {{viewActivityInfo.activityTitle}}
                </div>
                <!-- 题目内容是否显示操纵 -->
                <div class="show-content" @click="switchDetailsShown">
                    <span style="color: #185aeb">题目详情</span>
                </div>
            </div>
            <!-- 详情标题结束 -->
            <!-- 详情内容悬浮框 -->
            <transition name="el-zoom-in-center">
                <div class="details-content" v-show="isShowTitleDetails" @mousedown="moveDetails($event)">
                    <!-- 详情内容文字 -->
                    <div class="details-content-text">
                        {{viewActivityInfo.content}}
                    </div>
                    <!-- 详情内容图片 -->
                    <div class="details-content-picture" v-show="viewActivityInfo.activityPic" v-viewer>
                        <img class="question-img" :src="viewActivityInfo.activityPic" alt>
                    </div>
                </div>
            </transition>
            <!-- 所有作答的学员展示 -->
            <div class="details-students-show">
                <div
                  class="students-answer"
                  v-for="(item,index) in viewTraineeAnswerListData"
                  @click="toAnswerDetails(item.ctId,item.anId,item.activityId,item.traineeName)"
                  :key="index">
                    <div class="click-jump">
                      <!-- 学员名字 -->
                      <div class="students-name">
                          {{item.traineeName}}
                      </div>
                      <!-- 展示图片 -->
                      <div
                        class="students-picture">
                          <img :src="item.url">
                      </div>
                      <!-- 提交日期 -->
                      <div class="submission-date">
                          <span>{{item.createTime}}</span>
                      </div>
                    </div>
                    <!-- 点赞图片 -->
                    <div
                      :class="['like-picture','iconfont','icon-aixin',item.isLike?'like-picture-y':'like-picture-n']"
                      @click.stop="clickLike(item.isLike,index)">
                    </div>
                </div>
            </div>
            <!-- 如果没有学员作答 -->
            <div style="height: 400px; text-align: center; padding-top: 60px" v-if="viewTraineeAnswerListData.length <= 0">
            <img src="static\image\manage_board\creatkc.png">
          </div>
      </div>
        <!-- 内容区域结束 -->
    </div>
</template>

<script>
  import {baseUrl, toast, alert, confirm, loadingModal, formVaildStyle, formInVaildStyle}from '@/utils/global'
  export default {
      name: "view-all-storm-mind",
      props: {
          //当前活动详情
          activityInfo : {
              type: Object,
              required: true,
          },
          //课堂id
          ctId: {
              type: String,
              required: true,
          },
      },
      data(){
          return{
              viewTraineeAnswerListData:[], //所有学员针对头脑风暴的作答内容
              viewActivityInfo: {}, //活动详情
              isShowTitleDetails: false,  //是否显示题目详情
              studentInformation: {}, //选择查看的学员的查询信息
              positionX:0,  //详情水平位置
              positionY:0,  //详情垂直位置
          }
      },
      methods: {
          /**
           *  详情移动事件
           */
          moveDetails(e){
              //获取目标元素
              //let odiv = e.target;
              let odiv = document.querySelector(".details-content")
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
           *  返回到活动主页面
           */
          goToPageActivityList () {
              // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
              this.$parent.changeVotoQuestionnairePage(false);
          },

          /**
           *  查看学员针对头脑风暴的作答内容
           */
          getViewTraineeAnswerListData(activityId){
              //创建查询接口调用参数对象
              let obj={
                  ctId:this.ctId,
                  activityId:activityId
              }
              //调用学员作答内容查询接口
              this.$api.activityBrainstorming.viewTraineeAnswerListData(obj).then(res=>{
                  if(res.code===0){
                      //存入查询信息
                      this.viewTraineeAnswerListData = res.data.list;
                      //处理图片
                      if (this.viewTraineeAnswerListData.length > 0){
                          for (let i = 0; i < this.viewTraineeAnswerListData.length; i++) {
                              if (this.viewTraineeAnswerListData[i].url.indexOf("https://") === -1 && this.viewTraineeAnswerListData[i].url.indexOf("http://") === -1){
                                  this.viewTraineeAnswerListData[i].url = baseUrl + this.viewTraineeAnswerListData[i].url;
                              }
                          }
                      }
                  }
              })
          },

          /**
           *  获得当前活动详情
           */
          getActivityDetails(){
              //创建调用查看活动详情接口参数对象
              let obj1={
                  activityId:this.activityInfo.activityId,
                  activityType:this.activityInfo.activityType
              };
              //调用活动详情查看接口
              this.$api.activityVoteQuestionnaire.viewActivityInfo(obj1).then(res => {
                  if(res.code === 0){
                      //存入当前活动详情数据
                      this.viewActivityInfo=res.data;
                      //处理图片
                      if (this.viewActivityInfo.activityPic){
                          this.viewActivityInfo.activityPic = baseUrl + this.viewActivityInfo.activityPic;
                      }
                  }
              })
          },

          /**
           *  题目详情的显示切换
           */
          switchDetailsShown(){
              if(this.isShowTitleDetails){
                  this.isShowTitleDetails = false;
              }else{
                  this.isShowTitleDetails = true;
              }
          },

          /**
           * 跳转到当前学员答题的详情页面
           */
          toAnswerDetails(ctId,anId,activityId,studentName){
              this.studentInformation = {
                  ctId: ctId,
                  anId: anId,
                  activityId: activityId,
                  studentName:studentName,
              }
              this.$parent.showIndividualAnswerDetails(this.studentInformation);
          },

          /**
           *  点赞和取消
           */
          clickLike(isLike,index){
              //存入当前是否点赞的值
              let value = '';
              if(isLike){
                  value = 'N';
              }else {
                  value = 'Y';
              }
              //创建调用点赞、取消接口的参数对象
              let obj = {
                  anId: this.viewTraineeAnswerListData[index].anId,
                  value: value,
              }
              //调用当点赞、取消接口
              this.$api.activityBrainstorming.brainstorming(obj).then(res=>{
                  if (res.code == 0){
                      //改变当前学员作答点赞状态
                      this.viewTraineeAnswerListData[index].isLike = !isLike;
                  }
                  //弹出操作提示
                  toast(res.msg);
              })
          },
      },
      created () {
          //查看学员针对投票/问卷的作答内容
          this.getViewTraineeAnswerListData(this.activityInfo.activityId);
          //获得活动详情
          this.getActivityDetails();
      },
  }
</script>

<style scoped>
  /* 返回 */
  .classroom-back{
    width: 50%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 内容区域 */
  .storm-mind-details{
    text-align: left;
  }
  /* 详情标题区域样式 */
  .details-title{
    height: 50px;
    line-height: 50px;
    padding: 10px 0 0 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dddddd;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);
  }
  .details-title-content{
    padding-left: 10px;
  }
  .show-content{
    cursor: pointer;
    color: #6a7275;
    padding-right: 10px;
  }
  .show-content:hover{
    color: #ffc82c;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
    transform: translateY(-10px);
    opacity: 0;
  }

  /* 详情内容区域样式 */
  .details-content{
    padding: 0 10px 15px;
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
    position: fixed;
    width: 400px;
    cursor: pointer;
    right: 170px;
    z-index: 667;
    -webkit-touch-callout:none;  /*!*系统默认菜单被禁用*!*/
    -webkit-user-select:none; /*!*webkit浏览器*!*/
    -khtml-user-select:none; /*!*早期浏览器*!*/
    -moz-user-select:none;/*!*火狐*!*/
    -ms-user-select:none; /*!*IE10*!*/
    user-select:none;
  }
  .details-content-text{
    text-indent: 2em;
    padding: 5px 0;
    word-break:break-all;
  }
  .details-content-picture{
    margin-left: 2em;
    width: 150px;
    height: 150px;
    overflow: hidden;
  }
  .question-img{
    width: 200px;
  }
  /* 学生作答显示区域 */
  .details-students-show{
    width: 98%;
    margin-left: 1%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

  }
  .students-name{
    padding-left: 5%;
  }
  .students-picture img{
    width: 90%;
    height: 130px;
  }
  .students-picture{
    text-align: center;
  }
  .details-students-show .students-answer:hover{
    transform: translateY(-8px);
    transition: .2s;
  }
  .students-answer{
    width: 18%;
    margin: 20px 1%;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
    cursor: pointer;
  }
  .submission-date{
    width: 90%;
    margin-left: 5%;
    border-bottom: 1px solid #dddddd;
    color: #6a7275;
    font-size: 12px;
    height: 20px;
  }
  .like-picture img{
    width: 10%;
  }
  .click-jump{

  }
  .like-picture{
    margin-right: 5%;
    font-size: 22px;
    cursor: pointer;
    width: 22px;
    float: right;
  }
  .like-picture-n:hover{
    opacity: 0.8;
  }
  .like-picture-y{
    color: #ff4c4a;
  }
  .like-picture-n{
    color: #6a7275;
  }
</style>
