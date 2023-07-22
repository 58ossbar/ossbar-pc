<!-- 一键签到活动页面 -->
<template>
    <div class="key-sign-content">
        <!-- 友情提示开始 -->
        <div class="content-prompt">
          点击【结束签到】按钮即可保存本次签到记录，签到过程中切勿刷新或关闭当前界面
        </div>
        <!-- 友情提示结束 -->
        <!-- 签到人员显示开始 -->
        <div class="content-personnel">
            <!-- 人数 -->
            <div class="content-personnel-number">
                <span>{{alreadySignInStudents.length}}</span>&nbsp;/&nbsp;{{alreadySignInStudents.length+notSignInStudents.length}}
            </div>
            <!-- 头像和名字 -->
            <div class="content-personnel-information">
                <div v-for="(item,index) in notSignInStudents" :key="index">
                    <!-- 头像 -->
                    <img :src="item.traineePic" />
                    <!-- 未签到阴影 -->
                    <div class="image-shadow">
                        等待
                    </div>
                    <!-- 姓名 -->
                    <div class="personnel-name">
                      {{item.traineeName}}
                    </div>
                </div>
                <div v-for="(item,index) in alreadySignInStudents" :key="index">
                    <img :src="item.traineePic" />
                    <div class="image-shadow" v-show="false">
                        等待
                    </div>
                    <div class="personnel-name">
                      {{item.traineeName}}
                    </div>
                </div>
          </div>
        </div>
        <!-- 签到人员显示结束 -->
        <!-- 结束和取消签到按钮开始 -->
        <div class="content-button">
            <button @click="handleCancelSign">取消签到</button>
            <button @click="handleFinishSign">结束签到</button>
        </div>
        <!-- 结束和取消签到按钮开始 -->
    </div>
</template>

<script>
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle,formInVaildStyle} from '@/utils/global'
    export default {
        name: "key-sign-content",
        props: {
            keySingInActivityId: {
              type: String,
              required: true,
            },
            pkgId: {
              type: String,
              required: true,
            },
        },
        data(){
            return{
                ctId: localStorage.getItem("ct_id"),  // 课堂主键
                allSignPersonnel: [], //所有要签到人员
                alreadySignInStudents: [], //已签到人员
                notSignInStudents: [], //没有签到人员
            }
        },
        methods:{
            /**
             *  取消签到事件
             */
            handleCancelSign(){
                //清空数据跳转页面
                this.allSignPersonnel = [];
                this.alreadySignPersonnel = [];
                this.notSignPersonnel = [];

                //创建调用删除历史记录接口的参数对象
                let obj = {activityId:this.keySingInActivityId};

                //创建调用删除活动接口的参数对象
                let formDada=new FormData();
                formDada.append("activityId",this.keySingInActivityId);
                formDada.append("activityType","8");
                formDada.append("pkgId",this.pkgId);

                //调用删除签到历史记录的接口
                this.$api.classroomMember.deleteHistorySigninInfo(obj).then(res => {
                    if(res.code === 0){
                        //调用删除活动的接口
                        this.$api.activity.delActivity(formDada).then(res=>{
                            if(res.code===0){
                                toast('已放弃');
                                //跳转历史签到记录页面
                                this.$parent.showSign();
                            }else{
                              toast(res.msg);
                            }
                        })
                    }else {
                      toast(res.msg);
                    }
                })
            },

            /**
             *   结束签到事件
             *   跳转到签到结算页面
             */
            handleFinishSign(){
                this.$parent.toShowViewKeySignIn();
            },
            /**
             *  获取所有签到学员及其签到信息
             */
            getAllSignInStudents(){
                //创建一个调用获取学员签到情况接口的参数对象
                let obj = {
                  ctId: this.ctId,
                  activityId: this.keySingInActivityId
                };
                //调用获取学员签到情况接口
                this.$api.activitySignIn.queryTraineeList(obj).then(res=>{
                  if (res.code == 0){
                    //将所有学员存入已签到和未签到两个分组中
                    for (let i = 0; i < res.data.length; i++) {
                      if (res.data[i].signStateName === '已签到成员'){ //导入已签到学生
                        //添加已签到学生
                        this.alreadySignInStudents = res.data[i].children;
                        //学员头像图片处理
                        for (let j = 0; j < this.alreadySignInStudents.length; j++) {
                          if (this.alreadySignInStudents[j].traineePic.indexOf("https://") === -1 && this.alreadySignInStudents[j].traineePic.indexOf("http://") === -1){
                            this.alreadySignInStudents[j].traineePic = baseUrl + this.alreadySignInStudents[j].traineePic;
                          }
                        }
                      }else if(res.data[i].signStateName === '未签到成员'){  //导入未签到学生
                        //添加未签到学生
                        this.notSignInStudents = res.data[i].children;
                        //学员头像图片处理
                        for (let j = 0; j < this.notSignInStudents.length; j++) {
                          if (this.notSignInStudents[j].traineePic.indexOf("https://") === -1 && this.notSignInStudents[j].traineePic.indexOf("http://") === -1){
                            this.notSignInStudents[j].traineePic = baseUrl + this.notSignInStudents[j].traineePic;
                          }
                        }
                      }
                    }
                  }
                })
            },
        },
        created(){
          //获取所有签到学员及其签到信息
          this.getAllSignInStudents();
        },
    }
</script>

<style scoped>
  .key-sign-content{
    height: 620px;
    width: 100%;
    text-align: center;
  }
  /* 友情提示内容样式 */
  .content-prompt{
    font-size: 20px;
    font-weight: bold;
    background-color: #FF740E;
    color: #FFFFFF;
    height: 45px;
    line-height: 45px;
  }
  /* 签到人员显示样式 */
  .content-personnel{
    height: 500px;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style:none;
  }
  ::-webkit-scrollbar{
    display: none;
  }
  .content-personnel-number{
    font-size: 35px;
    margin-top: 20px;
  }
  .content-personnel-number span{
    color: #2fc161;
  }
  .content-personnel-information img{
    height: 75px;
    width: 75px;
    border-radius: 50%;
  }
  .image-shadow{
    position: absolute;
    top: 0;
    right: 22px;
    height: 75px;
    width: 75px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.46);
    color: #FFFFFF;
    line-height: 115px;
  }
  .personnel-name{
    font-size: 18px;
    padding-top: 10px;
  }
  .content-personnel-information > div{
    width: 10%;
    float: left;
    position: relative;
  }
  /* 按钮样式 */
  .content-button{
    margin: 20px 0;
  }
  .content-button button{
    background-color: #5E717B;
    padding: 4px 30px;
    color: #FFFFFF;
    border: none;
    border-radius: 30px;
    margin: 0 10px;
    outline: none;
  }
  .content-button button:hover{
    background: #007bff;
    cursor: pointer;
  }
</style>
