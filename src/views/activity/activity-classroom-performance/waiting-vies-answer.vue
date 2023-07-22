<!-- 学员抢答页面 -->
<template>
    <div class="waiting-vies-answer">
        <!-- 路径导航开始 -->
        <div class="present-localtion">
            <div>
            当前位置：<a class="cursor" @click="goToPage()">活动列表</a> > <span class="present-localtion-title">{{activityInfo.activityTitle}}(学员抢答)</span>
            </div>
            <div class="classroom-back">
            <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
            <span @click="goToPage()">返回</span>
            </div>
        </div>
        <!-- 标题开始 -->
        <div class="activity-title">
            <span>抢答进行中</span>
        </div>
        <!-- 标题结束 -->
        <!-- 抢答人显示开始 -->
        <div class="activity-participants">
            <div v-for="(item,index) in studentData" :key="index">
                <img :src="item.traineePic" alt style="width:100px;height:100px;border-radius:50%;border:1px solid #959da0;">
                <div class="student-name">
                    {{item.traineeName}}
                </div>
            </div>
        </div>
        <!-- 抢答人显示结束 -->
        <!-- 按钮区域开始 -->
        <div class="activity-btn" v-if="hasPermission">
            <el-button type="primary" @click="handleSave">开始评分</el-button>
            <el-button type="info" @click="goToPage">取消</el-button>
        </div>
        <!-- 按钮区域结束 -->
        <!-- 评分模态框开始 -->
        <modal-dialog
            title="学员评分"
            id="score-modal"
            @cancel="handleCancel"
            @submit="handleSubmit">
            <div slot="main" style="text-align: left;padding: 10px 10px 20px 10px;max-height:300px;overflow-y: scroll;">
                <div class="student-score" v-for="(item, index) in currStudent" :key="index">
                    <div style="display:flex;">
                        <div class="student-name-modal">
                            {{item.traineeName}}
                        </div>
                        <el-input
                            size="medium"
                            @input="inputText(index)"
                            :id="'trainee-score' + index"
                            @keyup.enter.native="handleSubmit"
                            v-model="item.score">
                        </el-input>
                    </div>
                </div>
            </div>
        </modal-dialog>
        <!-- 评分模态框结束 -->
    </div>
</template>

<script>
    import { toast,baseUrl } from '@/utils/global';
    import ModalDialog from '@/components/modal-dialog';
    export default {
        name: "waiting-vies-answer",
        components:{
            'modal-dialog': ModalDialog,
        },
        props:{
            // 权限标识
            hasPermission: {
                type: Boolean,
                required: true,
                default: false
            },
            ctId:{
                type:String,
                required: true
            },
            activityInfo: {
                type: Object,
                default: ()=>{},
                required: true
            },
        },
        data(){
            return{
                studentData:[], //所有抢答信息显示
                currStudent:[], //所有抢答学员
            }
        },
        methods: {
            /**
             * 跳页面（课堂表现页面）
             */
            goToPage () {
              this.$parent.changeVotoQuestionnairePage(false);
            },
            //限制数字输入
            inputText(index){
                this.currStudent[index].score = this.currStudent[index].score.replace(/\D/g, '');
                if (this.currStudent[index].score > 11) {
                    this.currStudent[index].score = 10;
                }
            },
            //获取已抢答的学员
            getAnswerActivityTraineeInfo(){
                let obj = {
                    ctId: this.ctId,
                    activityId: this.activityInfo.activityId,
                }
                this.$api.activityClassroomPerformance.answerActivityTraineeInfo(obj).then(res => {
                    if (res.code == 0) {
                        this.studentData = [];
                        this.currStudent = [];
                        for (let i = 0; i < this.activityInfo.answerNumber; i++) {
                            if (res.data.length > i) {
                                if (res.data[i].traineePic.indexOf('http://') === -1 && res.data[i].traineePic.indexOf('https://') === -1) {
                                    res.data[i].traineePic = baseUrl + res.data[i].traineePic;
                                }
                                res.data[i].score = "";
                                this.studentData.push(res.data[i]);
                                this.currStudent.push(res.data[i]);
                            }else{
                                let obj = {traineeName:"某某",traineePic:"/static/image/u905.png"};
                                this.studentData.push(obj);
                            }
                        }
                        if (!this.activityInfo.answerNumber) {
                            for (let i = 0; i < res.data.length; i++) {
                                if (res.data[i].traineePic.indexOf('http://') === -1 && res.data[i].traineePic.indexOf('https://') === -1) {
                                    res.data[i].traineePic = baseUrl + res.data[i].traineePic;
                                }
                                res.data[i].score = "";
                                this.studentData.push(res.data[i]);
                                this.currStudent.push(res.data[i]);
                            }
                        }
                    }else{
                        toast(res.msg);
                    }
                })
            },
            //取消评分
            handleCancel(){
                $("#score-modal").modal('hide');
            },
            //提交验证
            submitValidation(){
                for (let i = 0; i < this.currStudent.length; i++) {
                    if (!this.currStudent[i].score || this.currStudent[i].score === '') {
                        $("#trainee-score" + i).css('borderColor','#dc3545');
                        $("#trainee-score" + i).focus();
                        return false;
                    }
                    $("#trainee-score" + i).removeAttr("style");
                }
                return true;
            },
            //确定选择
            handleSave(){
                if (this.currStudent.length <= 0) {
                    toast("未有学员抢答");
                    return false;
                }
                $("#score-modal").modal('show');
            },
            //提交评分
            handleSubmit(){
                if (this.submitValidation()) {
                    let arrTemp = [];
                    for (let i = 0; i < this.currStudent.length; i++) {
                        arrTemp.push({traineeId: this.currStudent[i].traineeId,score:this.currStudent[i].score});
                    }
                    let obj = {
                        ctId: this.ctId,
                        activityId: this.activityInfo.activityId,
                        traineeScore: arrTemp,
                    }
                    this.$api.activityClassroomPerformance.selectPeopleToAnswer(obj).then(res => {
                        toast(res.msg);
                        if (res.code === 0) {
                            $("#score-modal").modal('hide');
                            this.goToPage();
                        }
                    })
                }
            },
        },
        created () {
            let that = this
            window.eventBus.$on('eventBusReceivedMsgData', function (data) {
                let res = data
                // console.log(data);
                if (res.busitypeIndexNew === 26) { // 学员抢答
                    if (res.code === 0) {
                        if (res.data && res.data.msg && res.data.msg.length > 0) {
                            for (let i = 0; i< res.data.msg.length; i++) {
                                if (res.data.msg[i].ctId && that.ctId && that.ctId === res.data.msg[i].ctId && res.data.msg[i].activityId && that.activityInfo.activityId === res.data.msg[i].activityId) {
                                    that.getAnswerActivityTraineeInfo();
                                }
                            }
                        }
                    }
                }
            })
        },
        mounted(){
            this.getAnswerActivityTraineeInfo();
        },
    }
</script>

<style scoped>
    .waiting-vies-answer{
        text-align: center;
    }
    .activity-title{
        margin-top: 40px;
        font-size: 20px;
    }
    .activity-participants{
        margin-top: 40px;
        min-height: 280px;
        display: flex;
        justify-content:center;
        flex-wrap:wrap;
        align-content:flex-start;
    }
    .activity-participants img{
        width: 100px;
        margin: 0 20px;
    }
    .student-name{
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .activity-btn{
        margin: 30px 0 40px ;
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
    /* 评分模态框样式 */
    .student-score{
        margin-bottom: 20px;
        display: inline-block;
        width:47%;
        margin-right: 10px;
    }
    .student-name-modal{
        width: 50%;
        margin-right: 10px;
        line-height: 36px;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
