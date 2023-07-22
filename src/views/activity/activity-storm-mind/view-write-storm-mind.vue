<!-- 头脑风暴填写页面 -->
<template>
    <div class="view-write-storm-mind">
        <!------------ 导航路径区域开始 ------------->
        <!-- <div class="location bg-fafafa">
            <div style="display: flex;width: 50%">
                <div class="localtion-title">
                    <b>当前位置:</b>
                </div>
                <ul class="localtion-list">
                    <li class="localtion-item" style="cursor: pointer" @click="goToPageActivityList">
                        活动
                    </li>
                    <li class="localtion-item" style="color: #959da0">
                        {{viewActivityInfo.activityTitle}}
                    </li>
                </ul>
            </div>
            <div class="classroom-back">
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <span @click="goToPageActivityList()">返回</span>
            </div>
        </div> -->
        <!-- 位置导航模块开始 -->
        <div class="present-localtion">
          <div>
            当前位置：<a class="cursor" @click="goToPageActivityList">活动</a> > <span class="present-localtion-title">{{viewActivityInfo.activityTitle}}</span>
          </div>
          <div class="classroom-back">
            <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
            <span @click="goToPageActivityList()">返回</span>
          </div>
        </div>
        <!-- 位置导航模块结束 -->
        <!------------ 导航路径区域结束 ------------->
        <!------------ 答题内容区域开始 ------------->
        <div>
            <!-- 问题区域开始 -->
            <div class="topic">
                <!-- 问题内容 -->
                <div class="topic-content">{{viewActivityInfo.content}}</div>
                <!-- 问题图片 -->
                <div  class="topic-img" v-if="viewActivityInfo.activityPic">
                    <viewer>
                        <img :src="viewActivityInfo.activityPic" alt>
                    </viewer>
                </div>
            </div>
            <!-- 问题区域开始结束 -->
            <!-- 填写区域开始 -->
            <div class="fill">
                <!-- 填写内容开始 -->
                <div class="fill-content">
                    <el-input
                      type="textarea"
                      v-model="voteQuestionResult.content"
                      rows="5"
                      cols="100"
                      class="questionName"
                      placeholder="请填写自己的观点或意见"
                      style="margin-top: 10px;font-size: 14px"></el-input>
                </div>
                <!-- 填写内容结束 -->
                <!-- 添加附件开始 -->
                <div class="accessory-box">
                    <!-- 添加附件文字显示及图标 -->
                    <div class="accessory-title">
                        <span>添加附件</span>
                        <img src="static/image/teaching_center/accessory_1.png">
                    </div>
                    <ul class="accessory-list">
                        <li
                          v-if="viewAccessoryList.length>0"
                          v-for="(accessory,accessoryIndex) in viewAccessoryList"
                          :key="accessoryIndex"
                          class="accessory-item accessory-con">
                            <!-- 图片 -->
                            <viewer class="accessory-viewer" v-if="accessory.type === 'image'" >
                                <img  :src="accessory.path" alt>
                            </viewer>
                            <!-- 视频 -->
                            <video
                              @click="openVideo(accessory.path)"
                              v-if="accessory.type === 'video'"
                              :src="accessory.path"></video>
                            <!-- 删除操作 -->
                            <div
                              class="del-accessory"
                              @click="handleDelAccessory(accessoryIndex)">
                              <img src="static/image/teaching_center/del.png" alt="删除附件" title="删除附件">
                            </div>
                        </li>
                        <!-- 附件添加按钮 -->
                        <li class="accessory-item add-accessory-btn">
                            <input
                              @change="handleUploadAccessory($event)"
                              accept="image/*,video/*"
                              type="file"
                              class="upload-accessory">
                            <img src="static/image/teaching_center/add_2.png" alt="添加附件" title="添加附件">
                        </li>
                    </ul>
                </div>
                <!-- 添加附件结束 -->
            </div>
            <!-- 填写区域结束 -->
            <!-- 按钮区域开始 -->
            <div class="bottom-btn-box" style="">
                <!-- 提交按钮 -->
                <button
                  @click="handleSaveTraineeCommitAnswerContent"
                  type="button"
                  class="btn btn-outline-primary" :disabled="saveStart">提交</button>
                <!-- 取消按钮 -->
                <button
                  @click="handleCancelTraineeCommitAnswerContent"
                  type="button"
                  class="btn btn-outline-secondary" >取消</button>
            </div>
            <!-- 按钮区域结束 -->
        </div>
        <!------------ 答题内容区域结束 ------------->
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
      formInVaildStyle
    }from '@/utils/global'
    export default {
        name: "view-write-storm-mind",
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
        },
        data() {
            return{
                saveStart: false, //保存按钮提交禁用
                viewActivityInfo:{activityPic:""},//查看头脑风暴题目
                voteQuestionResult:{},//学员所做的题目
                viewAccessoryList:[], //附件显示列表
            }
        },
        filter: {
            filterPercent(value){
                return value.split('.')[0];
            },
        },
        methods: {
            /**
             * 返回到活动主页面
             */
            goToPageActivityList() {
                // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
                this.$parent.changeVotoQuestionnairePage(false);
            },

            /**
             * 查看作答题目列表
             * @param activityInfo
             */
            getViewActivityInfo(activityInfo){
                let obj={
                    activityId:activityInfo.activityId,
                    activityType:activityInfo.activityType
                };
                //调用查看当前头脑风暴题目接口
                this.$api.activityVoteQuestionnaire.viewActivityInfo(obj).then(res => {
                    if(res.code === 0){
                        //存入当前题目数据
                        this.viewActivityInfo=res.data;
                        //处理图片
                        if (this.viewActivityInfo.activityPic){
                            this.viewActivityInfo.activityPic = baseUrl + this.viewActivityInfo.activityPic;
                        }
                        //学员答题初始化
                        this.voteQuestionResult={
                            ctId: this.ctId,
                            activityId: this.activityInfo.activityId,
                            content:'',
                            fileList:[]
                        };
                    }
                })
            },

            /**
             * 删除附件
             * @param accessoryIndex
             */
            handleDelAccessory(accessoryIndex){
                confirm("确定删除此附件吗?", ()=> {
                    this.voteQuestionResult.fileList.splice(accessoryIndex,1);
                    this.viewAccessoryList.splice(accessoryIndex,1);
                })
            },

            /**
             * 上传附件
             * @param e
             */
            handleUploadAccessory(e){
                this.saveStart = true;
                let file=e.target.files[0];
                if(file){
                    loadingModal(true);
                    let fileType=file.type.split("/")[0];
                    if(fileType == "image" || fileType == "video"){
                        let formData=new FormData();
                        formData.append('file',file);
                        this.$api.activityBrainstorming.uploads(formData).then(res => {
                            if(res.code === 0){
                                loadingModal(false);
                                toast('添加成功');
                                let reader=new FileReader();
                                let that=this;
                                reader.readAsDataURL(file);
                                reader.onload=function(e){
                                  let fileObj={
                                    path:this.result,
                                    type:fileType
                                  }
                                  that.viewAccessoryList.push(fileObj);
                                }
                                this.voteQuestionResult.fileList.push(res.media_id);
                                this.saveStart = false;
                            }else{
                                loadingModal(false);
                                toast('添加失败' + res.msg);
                            }
                        })
                    }else{
                        toast("请上传图片或视频");
                        return;
                    }
                }
            },

            /**
             * 视频显示
             * @param url
             */
            openVideo(url) {
                this.$videoPreview(url)
            },

            /**
             * 提交按钮操作
             */
            handleSaveTraineeCommitAnswerContent(){
                //判断题目是否作答
                if(!this.voteQuestionResult.content){
                    toast('当前题目未完成,请完成后再提交');
                    return;
                }
                this.saveStart = true;
                //处理文件的提交格式
                let mediaIdList = this.voteQuestionResult.fileList.toString();
                mediaIdList = mediaIdList.replace(/\[|]/g, '');
                //创建调用头脑风暴提交接口的参数对象
                let saveInfo={
                    ctId: this.ctId,
                    activityId: this.viewActivityInfo.activityId,
                    content: this.voteQuestionResult.content,
                    media_id: mediaIdList
                };
                //调用头脑风暴的提交接口
                this.$api.activityBrainstorming.saveActivityBrainstormingTraineeAnswerInfo(saveInfo).then(res => {
                    this.saveStart = false;
                    toast(res.msg);
                    //返回到活动页面
                    this.goToPageActivityList();
                })
            },

            /**
             * 取消按钮操作
             */
            handleCancelTraineeCommitAnswerContent(){
                confirm("确定取消提交当前风暴头脑吗?", ()=> {
                    //返回到活动页面
                    this.goToPageActivityList();
                    //清空所答信息
                    this.voteQuestionResult={};
                    this.viewAccessoryList=[];
                })
            },
        },
        created () {
            //查看作答题目
            this.getViewActivityInfo(this.activityInfo);
            let that = this
            window.eventBus.$on('eventBusReceivedMsgData', function (data) {
              let res = data
                if (res.busitypeIndexNew === 23 || res.busitypeIndexNew === 24) { // 活动开始、结束
                  if (res.code === 0) {
                    if (res.data && res.data.msg && res.data.msg.length > 0) {
                        for (let i = 0; i < res.data.msg.length; i++) {
                          if (res.data.msg[i].ctId && that.ctId && that.ctId === res.data.msg[i].ctId) {
                            if (res.busitypeIndexNew === 24 || (res.busitypeIndexNew === 23 && that.activityInfo && that.activityInfo.activityId && res.data.msg[i].activityId && (res.data.msg[i].activityId === that.activityInfo.activityId))) {
                              that.goToPageActivityList()
                            }
                          }
                        }
                    }
                  }
                }
            })
        },
    }
</script>

<style scoped>
  .view-write-storm-mind{
    width: 100%;
    text-align: left;
  }
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
    padding-left: 15px;display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 头脑风暴内容样式 */
  .topic{
    width: 90%;
    margin: 20px 0 0 5%;
    padding: 10px 10px;
    background-color: #f5f5f5;
  }
  .topic-content{
    text-indent: 2em;
    width: 100%;
    word-break:break-all;
  }
  .topic-img{
    padding: 10px 0 10px 32px;
  }
  .topic-img img{
    width: 400px;
    height: 200px;
    cursor: pointer;
  }
  /* 答题填写处样式 */
  .fill-content{
    width: 90%;
    margin-left: 5%;
  }
  /*添加附件的样式*/
  .accessory-box{
    padding:10px 5%;
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
  .accessory-box .accessory-list .add-accessory-btn{
    text-align: center;
    line-height: 80px;
  }
  .accessory-box .accessory-list .accessory-item{
    position: relative;
  }
  .accessory-box .accessory-list .accessory-con  .accessory-viewer{
    width: 100%;
    height:100%;
  }
  .accessory-box .accessory-list .accessory-con  img{
    width: 100%;
    height: 100%;
  }
  .accessory-box .accessory-list .accessory-con > video{
    width: 100%;
    height: 100%;
  }
  .accessory-box .accessory-list .add-accessory-btn > img{
    width: 35px;
    height: 35px;
  }
  .accessory-box .accessory-list .add-accessory-btn .upload-accessory{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    filter:Alpha(opacity=50);
    cursor: pointer;
  }
  .accessory-box .accessory-list .accessory-con:hover .del-accessory{
    display: block;
  }
  .accessory-box .accessory-list .accessory-con .del-accessory{
    display: none;
    position: absolute;
    top:0px;
    right: 0px;
  }
  /* 按钮区域 */
  .bottom-btn-box{
    display: flex;
    justify-content: center;
    width: 80%;
    margin: 30px auto;
  }
  .bottom-btn-box > button {
    width: 100px;
    margin-left: 20px;
    font-size: 14px;
  }
</style>
