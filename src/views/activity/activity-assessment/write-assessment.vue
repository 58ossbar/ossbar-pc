<!-- 实践考核个人填写页面 和 成绩详情预览页面 -->
<template>
    <div class="storm-mind assessment-box">
        <!-- 当前位置路径导航开始 -->
        <div class="present-localtion">
            <!-- 当前位置显示开始 -->
            <div>
                当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a><span class="cursor" v-if="activityInfo.activityState === '2'" @click="goToViewAllAssessmentPage"> > 成绩总览</span> > <span class="present-localtion-title">{{activityInfo.activityTitle}}</span>
            </div>
            <!-- 当前位置显示结束 -->
            <!-- 返回显示开始 -->
            <div class="classroom-back">
                <!-- 返回图标 -->
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <!-- 返回文字 -->
                <span @click="goToPageActivityList()">返回</span>
            </div>
            <!-- 返回显示结束 -->
        </div>
        <!-- 当前位置路径导航结束 -->

        <!-- 大标题 -->
        <div class="assessment-title">{{activityInfo.activityTitle}}</div>

        <!-- 基本信息展示begin -->
        <div class="assessment-info">
            <div><span v-if="className">班级：</span>{{className}}</div>
            <div v-if="activityInfo.activityBeginTime"><span>时间：</span>{{activityInfo.activityBeginTime}}</div>
        </div>
        <!-- 基本信息展示end -->

        <!-- 考核打分begin -->
        <div style="margin: 0 0 30px;padding: 0 15px;">
            <el-table
                :data="tableData"
                class="score-table"
                style="width: 100%">
                <template v-for="(item, index) of tableHeaderData">
                    <recursive-table v-if="item.children" :key="index" :col="item" :isView="isView"></recursive-table>
                    <el-table-column
                        v-else
                        :fixed="index === 0 || index === 1  ? 'left' : 'right'"
                        :key="index"
                        :label="item.regular_name"
                        :prop="item.prop"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop === 'totalScore'">{{scope.row[item.prop] = geta(scope.row)}}</span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <!-- 考核打分end -->

        <!-- 临时保存与提交按钮begin -->
        <div style="margin: 0 0 50px;text-align:right;padding-right:50px;" v-if="!isView">
            <el-button size="small" @click="temporaryStorageAssessment()">临时保存</el-button>
            <el-button size="small" @click="handleAssessment()">提交</el-button>
        </div>
        <!-- 临时保存与提交按钮end -->

    </div>
</template>

<script>
    //导入一些显示工具
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global';
    import RecursiveTable from '@/components/recursive-table';
    export default {
        name: "write-assessment",
        components: {
            'recursive-table': RecursiveTable,
        },
        props: {
            //教学包id
            pkgId:{
                type:String,
                required: true
            },
            //课堂id
            ctId:{
                type:String,
                required: true
            },
            //活动信息
            activityInfo:{
                type:Object,
                required: false
            },
            //查看评分信息的学生数据以及状态
            pageState:{
                type:Object,
                required: false
            },
        },
        data () {
            return {
                className: '',  //班级名称
                tableData:[],   //评分学生数据
                intTemp: 0,
                isView: false,  //是否禁止填写
                //表头数据
                tableHeaderData:[
                    {
                        regular_name:'序号',
                        prop: 'sort_num',
                    },
                    {
                        regular_name: 'getScore' === this.pageState.state ? '评分人' : '考核人',
                        prop: 'trainee_name',
                    },
                    {
                        regular_name:'考核指标'
                    },
                    {
                        regular_name:'总分',
                        prop: 'totalScore',
                    },
                ]
            }
        },
        methods:{

            /**
             * 返回到活动主页面
             */
            goToPageActivityList () {
                // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
                this.$parent.changeVotoQuestionnairePage(false);
            },

            /**
             * 返回到评分总览页面
             */
            goToViewAllAssessmentPage(){
                this.$parent.toViewAllAssessment();
            },

            /**
             * 自动计算得分总和
             */
            geta(value){
                let sum = 0;
                for (let i in value) {
                    if (i.length === 32) {
                        if (value[i] === '-' || value[i] === 'e') {
                            value[i] = 0;
                        }
                        if (value[i]) {
                            value[i] = parseInt(value[i]);
                            sum += parseInt(value[i]);
                        }
                    }
                }
                if (!sum) {
                    sum = 0;
                }
                return sum;
            },

            //递归考核规则   填入学员考核分数的键
            getStudentProp(value,student){
                value.forEach((item,index) => {
                    if(!item.children){
                        student['regularId'+this.intTemp] = item.regular_id;
                        this.intTemp += 1;
                    }else{
                        this.getStudentProp(item.children,student);
                    }
                });
            },

            //获取考核规则分数填写页面的基本信息
            getAssessmentInfo(){
                let formData = new FormData();
                formData.append("ctId",this.ctId);
                formData.append("activityId",this.activityInfo.activityId);
                this.$api.activityAssessment.getAssessmentInfo(formData).then(res => {
                    if (res.code === 0) {
                        this.isView = (res.data.mymember.state === 'Y') ? true : false;
                        //this.tableData = res.data.memberList;
                        let arr = res.data.memberList;
                        this.tableHeaderData[2].children = res.data.regularList;
                        this.className = res.data.classNames;
                        for (let i = 0; i < arr.length; i++) {
                            this.intTemp = 0;
                            this.getStudentProp(res.data.regularList,arr[i],this.intTemp);
                        }
                        if (res.data.examdatas && res.data.examdatas.length > 0) {
                            arr.forEach((student) => {
                              console.log(student)
                                res.data.examdatas.forEach((item) => {
                                    if (item.traineeId === student.trainee_id) {
                                        student[item.regularId] = item.regularSjnum;
                                    }
                                })
                            })
                        }
                        this.tableData = arr;
                    }else{
                        toast(res.msg);
                    }
                })
            },

            //临时保存实践考核
            temporaryStorageAssessment(){
                let formData = new FormData();
                formData.append("ctId",this.ctId);
                formData.append("activityId",this.activityInfo.activityId);
                this.tableData.forEach((item) => {
                    for (let itemObj in item) {
                        if (itemObj.indexOf("regularId") > -1) {
                            formData.append("traineeIds",item.trainee_id);
                            formData.append("regularIds",item[itemObj]);
                            formData.append("regularSjnums",item[item[itemObj]] ? item[item[itemObj]] : 0);
                        }
                    }
                });
                this.$api.activityAssessment.precommit(formData).then((res) => {
                    toast(res.msg);
                })
            },

            //提交实践考核
            handleAssessment(){
                let that = this;
                confirm("只可提交一次，是否确定提交评分",() => {
                    let formData = new FormData();
                    formData.append("ctId",that.ctId);
                    formData.append("activityId",that.activityInfo.activityId);
                    that.tableData.forEach((item) => {
                        for (let itemObj in item) {
                            if (itemObj.indexOf("regularId") > -1) {
                                formData.append("traineeIds",item.trainee_id);
                                formData.append("regularIds",item[itemObj]);
                                formData.append("regularSjnums",item[item[itemObj]] ? item[item[itemObj]] : 0);
                            }
                        }
                    });
                    that.$api.activityAssessment.commit(formData).then((res) => {
                        if (res.code === 0) {
                            that.goToPageActivityList();
                        }
                        toast(res.msg);
                    })
                })
            },

            //  type===1 获取学员实践考核的评价别人的信息      type===2 获取学员实践考核的具体得分信息
            getStudentSetScoreInfo(){
                let obj = {
                    activityId: this.activityInfo.activityId,
                    traineeId: this.pageState.info.traineeId,
                    type: this.pageState.state === 'getScore' ? '2' : '1',
                }
                console.log(obj)
                this.$api.activityAssessment.viewExamDetailInfo(obj).then((res) => {
                    if (res.code === 0) {
                        let arr = res.data.memberList;
                        this.tableHeaderData[2].children = res.data.regularList;
                        for (let i = 0; i < arr.length; i++) {
                            this.intTemp = 0;
                            this.getStudentProp(res.data.regularList,arr[i],this.intTemp);
                        }
                        if (res.data.examdatas && res.data.examdatas.length > 0) {
                            arr.forEach((student) => {
                                res.data.examdatas.forEach((item) => {
                                    if ('1' === obj.type) {
                                      if (item.traineeId === student.trainee_id) {
                                        student[item.regularId] = item.regularSjnum;
                                      }
                                    }
                                    if ('2' === obj.type) {
                                      if (item.createUserId === student.trainee_id) {
                                        student[item.regularId] = item.regularSjnum;
                                      }
                                    }

                                })
                            })
                        }
                        this.tableData = arr;
                    }else{
                        toast(res.msg);
                    }
                })
            },
        },

        created () {

        },

        mounted(){
            if (this.activityInfo.activityState === '2') {  //查看分数信息
                this.isView = true;
                this.getStudentSetScoreInfo();
            }else{          //填写分数信息
                this.getAssessmentInfo();
            }
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
  /* 大标题样式 */
  .assessment-title{
      font-size: 25px;
      font-weight: bold;
  }
  /* 基本信息展示样式 */
  .assessment-info{
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    margin: 30px 0 10px;
  }
  .assessment-info span{
      font-weight: bold;
  }
</style>
