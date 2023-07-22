<!-- 手动选人页面 -->
<template>
    <div class="raise-hand-page">
        <!-- 路径导航开始 -->
        <div class="present-localtion">
            <div>
                当前位置：<a class="cursor" @click="goToPageActivityList()">活动列表</a> > <span class="present-localtion-title">{{activityInfo.activityTitle}}(手动选人)</span>
            </div>
            <div class="classroom-back">
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <span @click="goToPageActivityList()">返回</span>
            </div>
        </div>
        <!-- 路径导航结束 -->
        <!-- 签到人员显示开始 -->
        <div class="content-personnel">
            <!-- 人数 -->
            <div class="content-personnel-number">
                <span>已选取{{currStudent.length}}位同学</span>（点击头像选择/取消）
            </div>
            <!-- 头像和名字 -->
            <div class="content-personnel-information">
                <div v-for="(item,index) in studentData" :key="index">
                    <img :src="item.traineePic" @click="addStudent(item)" class="cursor"/>
                    <div class="image-shadow cursor" v-show="item.isSelect" @click="addStudent(item)">
                        已选中
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
            <el-button type="primary" @click="handleSave">评分</el-button>
        </div>
        <!-- 结束和取消签到按钮开始 -->
        <!-- 评分模态框开始 -->
        <modal-dialog
            title="学员评分"
            id="score-modal"
            @cancel="handleCancel"
            @submit="handleSubmit">
            <div slot="main" style="text-align: left;padding: 10px 10px 20px 10px;max-height:300px;overflow-y: scroll;">
                <div class="student-score" v-for="(item, index) in currStudent" :key="index">
                    <div style="display:flex;">
                        <div class="student-name">
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
        name: "raise-hand-page",
        components:{
            'modal-dialog': ModalDialog,
        },
        props:{
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
                currStudent:[],//当前抽取的学生
                studentData:[], //学生数据
            }
        },
        methods:{
            /**
             * 跳页面
             */
            goToPageActivityList () {
                this.$parent.changeVotoQuestionnairePage(false);
            },
            //限制数字输入
            inputText(index){
                this.currStudent[index].score = this.currStudent[index].score.replace(/\D/g, '');
                if (this.currStudent[index].score > 11) {
                    this.currStudent[index].score = 10;
                }
            },
            //添加/取消  选择人员
            addStudent(value){
                let temp = true;
                for (let index = 0; index < this.currStudent.length; index++) {
                    if (this.currStudent[index].traineeId === value.traineeId) {
                        this.currStudent.splice(index,1);
                        temp = false;
                    }
                }
                if (temp) {
                    this.currStudent.push(value);
                }
                for (let index = 0; index < this.studentData.length; index++) {
                    if (this.studentData[index].traineeId === value.traineeId) {
                        if (temp) {
                            this.studentData[index].isSelect = true;
                        }else{
                            this.studentData[index].isSelect = false;
                        }
                    }
                }
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
                            this.goToPageActivityList();
                        }
                    })
                }
            },
            //确定选择
            handleSave(){
                if (this.currStudent.length <= 0) {
                    toast("请选择作答学员");
                    return false;
                }
                $("#score-modal").modal('show');
            },
        },
        mounted(){
            //获取当前课堂所有成员
            this.$api.activityClassroomPerformance.selectClassroomTraineeInfo(this.ctId).then(res => {
                if (res.code === 0) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].traineePic.indexOf('http://') === -1 && res.data[i].traineePic.indexOf('https://') === -1) {
                            res.data[i].traineePic = baseUrl + res.data[i].traineePic;
                        }
                        res.data[i].score = "";
                    }
                    this.studentData = res.data;
                }else{
                    toast(res.msg);
                }
            })
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
    /* 签到人员显示样式 */
    .content-personnel{
        
    }
    ::-webkit-scrollbar{
        display: none;
    }
    .content-personnel-number{
        margin-top: 20px;
    }
    .content-personnel-number span{
        font-size: 35px;
        color: #2fc161;
    }
    .content-personnel-information{
        margin-top: 50px;
        min-height: 300px;
        max-height: 600px;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style:none;
        display: flex;
        justify-content: center;
        flex-wrap:wrap;

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
        position: relative;
    }
    .content-button{
        margin-bottom: 20px;
    }
    /* 评分模态框样式 */
    .student-score{
        margin-bottom: 20px;
        display: inline-block;
        width:47%;
        margin-right: 10px;
    }
    .student-name{
        width: 50%;
        margin-right: 10px;
        line-height: 36px;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
