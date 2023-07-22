<!-- 总览个人头脑风暴页面 -->
<template>
    <div class="view-storm-mind">
        <!-- 当前位置路径显示开始 -->
        <div class="location bg-fafafa">
            <!-- 当前位置开始 -->
            <div style="display: flex;width: 50%">
                <!-- 当前位置文字 -->
                <div class="localtion-title">
                    <b>当前位置:</b>
                </div>
                <!-- 当前位置路径文字开始 -->
                <ul class="localtion-list">
                    <!-- 主活动 -->
                    <li class="localtion-item" style="cursor: pointer" @click="goToPageActivityList">
                        活动
                    </li>
                    <!-- 头脑风暴总页面 -->
                    <li class="localtion-item">
                        <span
                          :class="activityInfo.isCreator?'item-span-cursor':'item-span-color'"
                          @click="activityInfo.isCreator && geToAllStormMind()">{{viewTraineeAnswer.activityTitle}}</span>
                    </li>
                    <!-- 当前页面名称 -->
                    <li class="localtion-item" v-show="activityInfo.isCreator">
                        <span class="item-span-color">{{studentInformation.studentName}}</span>
                    </li>
                </ul>
                <!-- 当前位置路径文字结束 -->
            </div>
            <!-- 当前位置结束 -->
            <!-- 返回操作开始 -->
            <div class="classroom-back">
                <!-- 返回图标 -->
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="backPage()"></i>
                <!-- 返回文字 -->
                <span @click="backPage()">返回</span>
            </div>
            <!-- 返回操作结束 -->
        </div>
        <!-- 当前位置导航显示结束 -->
        <!---------------------------作答详情的内容区域开始  ------------------------------>
        <div class="answer-details">
            <!-- 风暴头脑题目开始 -->
            <div class="storm-mind-content">
                <div class="all-title">题目：</div>
                <div class="content-details">
                    <!-- 题目的文字 -->
                    <div class="content-text">
                        {{viewTraineeAnswer.activityContent}}
                    </div>
                    <!-- 题目的图片 -->
                    <div class="content-picture" v-if="viewActivityInfo.activityPic" v-viewer>
                        <img class="question-img" :src="viewActivityInfo.activityPic" alt>
                        <div class="question-prompt">(点击图片可查看大图)</div>
                    </div>
                </div>
            </div>
            <!-- 风暴头脑题目结束 -->
            <!-- 作答内容开始 -->
            <div class="answer-content">
                <!-- 文字 -->
                <div class="all-title">简答：</div>
                <!-- 内容 -->
                <div class="answer-content-text">
                    {{viewTraineeAnswer.content}}
                </div>
            </div>
            <!-- 作答内容结束 -->
            <!-- 作答上传的附件开始 -->
            <div class="answer-attachment accessory-box accessory-detail" v-if="viewTraineeAnswer.fileList.length > 0">
                <!-- 附件文字 -->
                <div class="accessory-title all-title">
                  附件：
                </div>
                <!-- 附件内容 -->
                <ul class="accessory-list">
                    <li
                      class="accessory-item"
                      :key="fileIndex"
                      v-for="(file,fileIndex) in viewTraineeAnswer.fileList">
                        <!-- 图片 -->
                        <viewer class="accessory-viewer" >
                            <img :src="file.url"  alt>
                        </viewer>
                      <!--<video
                        class="accessory-video"
                        v-if="file.suffix==='video'"
                        @click="openVideo(file.url)"
                        :src="file.url">
                      </video>-->
                    </li>
                </ul>
            </div>
            <!-- 作答上传的附件结束 -->
        </div>
        <!---------------------------作答详情的内容区域结束  ------------------------------>
    </div>
</template>

<script>
    import {baseUrl, toast, alert, confirm, loadingModal, formVaildStyle, formInVaildStyle}from '@/utils/global'
    export default {
        name: "view-personal-overview-storm-mind",
        props: {
            //当前活动信息
            activityInfo : {
                type: Object,
                required: true,
            },
            //课堂id
            ctId: {
                type: String,
                required: true,
            },
            //学生信息
            studentInformation : {
                type: Object,
                required: true,
            },
        },
        data(){
            return{
                //查看个人针对头脑风暴的作答内容
                viewTraineeAnswer:{
                    activityTitle: "",
                    fileList: [],
                },
                //活动对象
                viewActivityInfo:{},
            }
        },
        methods: {
            /**
             * 返回到活动主页面
             */
            goToPageActivityList () {
              // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
              this.$parent.changeVotoQuestionnairePage(false);
            },

            /**
             *  返回风暴头脑总览页面
             */
            geToAllStormMind(){
                this.$parent.toShowPageAllOverviewStormMind();
            },

            /**
             *  返回
             */
            backPage(){
                //是否是创建者
                if(this.activityInfo.isCreator){
                    //回头脑风暴总页面
                    this.geToAllStormMind();
                }else {
                    //回活动主页面
                    this.goToPageActivityList();
                }
            },

            /**
             * 查看学员针对头脑风暴的作答内容
             * @param activityId  活动id
             */
            getViewTraineeAnswerListData(activityId){
                //获得个人答题内容对象
                let obj = {};
                if(this.studentInformation.anId != ''){
                    obj = this.studentInformation
                }else {
                    obj = {
                        ctId:this.ctId,
                        activityId:activityId
                    }
                }
                //调用查看个人风暴头脑答题详情接口
                this.$api.activityBrainstorming.viewTraineeAnswerInfo(obj).then(res=>{
                    if(res.code===0){
                        //存入个人答题详情数据
                        this.viewTraineeAnswer = res.data;
                        //处理视频和图片
                        if (this.viewTraineeAnswer.fileList.length > 0){
                            for (let i = 0; i < this.viewTraineeAnswer.fileList.length; i++){
                                this.viewTraineeAnswer.fileList[i].url = baseUrl + this.viewTraineeAnswer.fileList[i].url;
                            }
                        }
                    }
                })
                //获得题目对象
                let obj1={
                    activityId:this.activityInfo.activityId,
                    activityType:this.activityInfo.activityType
                };
                //调用当前风暴头脑题目信息接口
                this.$api.activityVoteQuestionnaire.viewActivityInfo(obj1).then(res => {
                    if(res.code === 0){
                        //存入题目详情数据
                        this.viewActivityInfo=res.data;
                        //处理图片
                        if (this.viewActivityInfo.activityPic){
                            this.viewActivityInfo.activityPic = baseUrl + this.viewActivityInfo.activityPic;
                        }
                    }
                })
            },

            /**
             * 视频预览
             * @param url
             */
            openVideo(url) {
              this.$videoPreview(url)
            },
        },
        created () {
            //查看学员针对投票/问卷的作答内容
            this.getViewTraineeAnswerListData(this.activityInfo.activityId);
        },
    }
</script>

<style scoped>
  .all-title{
    height: 30px;
    line-height: 30px;
  }
  .item-span-color{
    color: #959da0;
  }
  .item-span-cursor{
    cursor: pointer;
  }
  /* 返回 */
  .classroom-back{
    width: 50%;
    text-align: right;
    font-size: 14px;
    padding-right: 20px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 查看学员自己风暴头脑的作答内容start */
  .answer-details{
    text-align: left;
    padding-left: 30px;
    padding-bottom: 40px;
  }
  .answer-details > div{
    padding: 20px 0 0 0;
  }
  /* 标题样式 */
  .storm-mind-title{
    font-weight: bold;
    font-size: 20px;
  }
  /* 题目内容和图片样式 */
  .question-img{
    width: 120px;
    height: 70px;
  }
  .question-prompt{
    font-size: 13px;
    color: #6a7275;
    line-height: 124px;
    height: 70px;
  }
  .content-text{
    text-indent:2em;
    word-break:break-all;
  }
  .content-picture{
    padding: 10px 0;
    margin-left: 2em;
    display: flex;
  }
  .storm-mind-content{
    width: 90%;
    margin-left: 5%;
  }
  .content-details{
    padding: 10px;
    border: 1px solid #bcbcbc;
    border-radius: 10px;
  }
  /* 作答内容样式 */
  .answer-content-text{
    text-indent:2em;
    border: 1px solid #bcbcbc;
    border-radius: 10px;
    padding: 10px;
    word-break:break-all;
  }
  .answer-content{
    width: 90%;
    margin-left: 5%;
  }
  /* 附件样式 */
  .accessory-box{
    padding:10px 0px;
  }
  .accessory-box .accessory-title{
    color: #333;
    margin:10px 0px;
  }
  .accessory-box .accessory-list{
    display: flex;
    flex-wrap:wrap;
    width:100%;
  }
  .accessory-box .accessory-list .accessory-item{
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    cursor: pointer;
  }
  .accessory-box .accessory-list .accessory-item{
    margin: 0 12px 10px 0;
  }
  .accessory-box .accessory-list .accessory-item{
    position: relative;
  }
  .accessory-detail{
    width: 90%;
    margin-left: 5%;
  }
  .accessory-detail .accessory-list{
    width: 100%;
    padding: 10px 0 10px 4%;
    border: 1px solid #bcbcbc;
    border-radius: 10px;
  }
  .accessory-detail .accessory-list .accessory-item{
    width: 50px;
    height: 50px;
    margin-top: 8px;
  }
  .accessory-detail .accessory-list .accessory-item img{
    width: 50px;
    height: 50px;
  }
  .accessory-detail .accessory-list .accessory-item video{
    width: 100%;
    height: 100%;
  }
  /* 查看学员针对投票/问卷的作答内容end*/
</style>
