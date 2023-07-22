<!-- 新增实践考核页面 -->
<template>
    <div class="storm-mind assessment-box">
        <!-- 当前位置路径导航开始 -->
        <div class="present-localtion">
            <!-- 当前位置显示开始 -->
            <div>
                当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
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
        <!-- 提交表单开始 -->
        <form>
            <!-- 标题开始 -->
            <div style="width: 95%;margin: 20px auto">
                <!-- 标题文字 -->
                <div style="text-align: left">活动主题</div>
                <!-- 标题输入框 -->
                <el-input
                  :disabled="presentIsEditStates"
                  v-model="activityAssessment.activityTitle"
                  id="assessmentTitle"
                  type="text"
                  placeholder="请输入考核活动主题"
                  style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
                <!-- 错误提示 -->
                <div class="invalid-feedback col-10 textAlignLeft p-0 assessmentTitleHint"><small >请填写活动主题！</small></div>
            </div>
            <!-- 标题结束 -->
            <!-- 主题、基本信息的填写和操作按钮开始 -->
            <div style="width: 100%;font-size: 14px;padding-bottom: 5px;">
                <!-- 主题开始 -->
                <div style="width: 95%;margin: 20px auto">
                    <!-- 主题文字 -->
                    <div style="text-align: left">活动介绍</div>
                    <!-- 主题文本输入域 -->
                    <el-input
                      type="textarea"
                      :disabled="presentIsEditStates"
                      v-model="activityAssessment.content"
                      id="assessmentContent"
                      rows="5"
                      cols="100"
                      placeholder="请输入考核活动介绍"
                      style="margin-top: 10px;font-size: 14px;"></el-input>
                    <!-- 主题字数提示 -->
                    <div style="font-size: 14px;text-align: left;">最多3000字</div>
                    <!-- 错误提示 -->
                    <div class="invalid-feedback col-10 textAlignLeft p-0 assessmentContentHint"><small >请填写活动介绍！</small></div>
                </div>
                <!-- 主题结束 -->
                <!-- 考核教师和考核学员的选择开始 -->
                <div style="width: 95%;margin: 10px auto;display: flex">
                    <!-- 考核教师选择开始 -->
                    <div style="width: 48%;margin-right: 2%">
                        <div style="text-align: left">考核教师</div>
                        <div style="margin-top: 9px">
                            <el-select
                                v-model="activityAssessment.teacherIds"
                                multiple
                                :disabled="presentIsEditStates"
                                style="width: 100%"
                                id="teacherIds"
                                filterable
                                default-first-option
                                placeholder="选中教师">
                                <el-option
                                v-for="(item,index) in teacherList"
                                :key="index"
                                :label="item.teacherName"
                                :value="item.teacherId">
                                </el-option>
                            </el-select>
                            <div class="invalid-feedback col-10 textAlignLeft p-0 assessmentTeachersHint"><small >请选择考核教师</small></div>
                        </div>
                    </div>
                    <!-- 考核教师选择结束 -->
                    <!-- 考核学员选择开始 -->
                    <div style="width: 48%;margin-left: 2%;">
                        <div style="text-align: left">考核学员</div>
                        <div style="margin-top: 9px">
                            <el-select
                                v-model="activityAssessment.traineeIds"
                                :popper-append-to-body="false"
                                style="width: 100%;text-align: left;"
                                id="assessmentStudents"
                                :disabled="presentIsEditStates"
                                multiple
                                @change="changeSelect"
                                filterable
                                default-first-option
                                placeholder="选中学员">
                                <el-checkbox v-model="checkedAll" @change="clickCheckedAll">全选</el-checkbox>
                                <el-option
                                v-for="(item,index) in studentList"
                                :key="index"
                                :label="item.traineeName"
                                :value="item.traineeId">
                                </el-option>
                            </el-select>
                            <div class="invalid-feedback col-10 textAlignLeft p-0 assessmentInspectionPeopletHint"><small >请选择考核学员</small></div>
                        </div>
                    </div>
                    <!-- 考核学员选择结束 -->
                </div>
                <!-- 考核教师和考核学员的选择开始 -->
                <!-- 操作按钮开始 -->
                <div style="width: 94%;margin: 20px 3%;text-align: center" v-if="!presentIsEditStates">
                    <!-- 确定提交按钮 -->
                    <button
                      v-if="!presentIsEditStates"
                      @click="sureCreateAssessment"
                      type="button"
                      :disabled="isViewSave"
                      class="btn btn-outline-primary"
                      style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
                    <!-- 返回取消按钮 -->
                    <button
                      @click="handleCancelCreateAssessment"
                      type="button"
                      class="btn btn-outline-secondary"
                      style="font-size: 14px;width: 100px;margin-left: 10px">{{presentIsEditStates?'返回':'取消'}}</button>
                </div>
                <!-- 操作按钮结束 -->
            </div>
            <!-- 主题、基本信息的填写和操作按钮结束 -->
        </form>
        <!-- 提交表单结束 -->
    </div>
</template>

<script>
    //导入一些显示工具
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global'
    //导入章节显示树形图
    import CbTree from '@/components/cb-tree/index'
    export default {
        name: "save-assessment",
        components: {
          CbTree
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
            //是否处于查看状态
            presentIsEditStates:{
                type:Boolean,
                required: true
            },
            // 活动主键，修改、查看、时必传
            activityId: {
                type: String,
                required: true,
                default: ''
            },
            // 所属章节
            chapterId: {
                type: String,
                required: true,
                default: '',
            },
            //课程id
            subjectId: {
                type: String,
                required: true,
                default: ''
            },
            // 是否为查看状态，所有按钮禁用，也不允许输入任何文本
            isView: {
                type: Boolean,
                required: true,
                default: false
            },
        },
        data () {
            return {
                disabledSelectTree: false, // 是否禁选下拉树
                zNodes: [], //章节树形图数据
                setting: {
                    data: {
                        key: {
                            name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
                        },
                    }
                },
                pageTitle: '创建实践考核',  //页面名字
                listActivityGroup:[],//活动分组列表
                questionTypeList:[],//题目类型列表
                //考核信息
                activityAssessment:{
                    activityId:'',  //活动id
                    activityTitle:'',   //活动主题
                    erId: '',
                    content:'',   //活动内容
                    traineeIds:[],    //考核的学员
                    teacherIds: [],     //考核的教师
                },
                studentList: [],    //当前课堂所有学员
                teacherList: [],    //当前课堂所有教师
                checkedAll: false,  //是否全选考核成员
                isViewSave: false,  //是否禁用新增按钮
            }
        },
        methods:{
            /**
             * 存入当前选择的章节id
             * @param treeNode
             * @param nodes
             * @param isMultiple
             */
            onclick (treeNode, nodes, isMultiple) {
              this.activityAssessment.chapterId = treeNode.chapterId
            },

            /**
             * 返回到活动主页面
             */
            goToPageActivityList () {
              // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
              this.$parent.changeVotoQuestionnairePage(false);
            },

            /**
             * 考核表单验证
             * @returns {boolean}
             */
            formAssessmentVerifyBoolean(){
                //活动主题验证
                if(!this.activityAssessment.activityTitle){
                    //出现提示
                    formInVaildStyle('.assessmentTitleHint',"#assessmentTitle");
                    $("#assessmentTitle").css('borderColor','#dc3545');
                    return false;
                }
                //清除提示
                $("#assessmentTitle").removeAttr("style");
                formVaildStyle('.assessmentTitleHint',"#assessmentTitle");
                //活动内容验证
                if(!this.activityAssessment.content){
                    formInVaildStyle('.assessmentContentHint',"#assessmentContent");
                    $("#assessmentContent").css('borderColor','#dc3545');
                    return false;
                }
                $("#assessmentContent").removeAttr("style");
                formVaildStyle('.assessmentContentHint',"#assessmentContent");
                //图片验证
                if(!this.activityAssessment.activityTitle){
                    formInVaildStyle('.assessmentFileHint',"#assessmentFile");
                    return false;
                }
                formVaildStyle('.assessmentFileHint',"#assessmentFile");
                //教师验证
                // if(!this.activityAssessment.teacherIds.length > 0){
                //     formInVaildStyle('.assessmentTeachersHint',"#teacherIds");
                //     $("#teacherIds").css('borderColor','#dc3545');
                //     return false;
                // }
                // $("#teacherIds").removeAttr("style");
                //formVaildStyle('.assessmentTeachersHint',"#teacherIds");
                //学员验证
                if(!this.activityAssessment.traineeIds.length > 0){
                    formInVaildStyle('.assessmentInspectionPeopletHint',"#assessmentStudents");
                    $("#assessmentStudents").css('borderColor','#dc3545');
                    return false;
                }
                $("#assessmentStudents").removeAttr("style");
                formVaildStyle('.assessmentInspectionPeopletHint',"#assessmentStudents");

                return true;
            },

            /**
             * 取消创建考核
             */
            handleCancelCreateAssessment(){
                this.goToPageActivityList();
            },

            /**
             * 确定创建考核
             */
            sureCreateAssessment(){
                
                //验证并提交
                if(this.formAssessmentVerifyBoolean()){
                    this.isViewSave = true;
                    //创建提交对象
                    let obj = {
                        activityId: this.activityAssessment.activityId,
                        activityTitle: this.activityAssessment.activityTitle,
                        content: this.activityAssessment.content,
                        ctId: this.ctId,
                        erId: this.activityAssessment.activityId,
                        pkgId: this.pkgId,
                        traineeIds: this.activityAssessment.traineeIds,
                        teacherIds: this.activityAssessment.teacherIds,
                    }
                    //调用提交方法
                    this.$api.activityAssessment.saveActivityExamroomInfo(obj).then(res=>{
                        if(res.code===0){
                            //调用主活动页活动刷新方法
                            this.$parent.getListActivity();
                            this.$emit("updateInfo");
                            //回活动主页面
                            this.goToPageActivityList();
                        }
                        toast(res.msg);
                        this.isViewSave = false;
                    })
                }
            },

            /**
             * 获取活动分组
             */
            getListActivityGroup(){
                this.$api.activity.listActivityGroup({pkgId:this.pkgId}).then(res=>{
                    if(res.code===0){
                        if(res.data&&res.data.length>0){
                            this.listActivityGroup=res.data;
                        }
                    }
                })
            },

            /**
             *  收件人选择改变事件
             */
            changeSelect (val) {
                this.checkedAll = val.length === this.studentList.length
            },

            /**
             *  收件人全选单击事件
             */
            clickCheckedAll () {
                this.activityAssessment.traineeIds = []
                if (this.checkedAll) {
                    this.studentList.map((item) => {
                    this.activityAssessment.traineeIds.push(item.traineeId)
                    })
                } else {
                    this.activityAssessment.traineeIds = []
                }
            },

            /**
             * 获取所有学员
             */
            getTraineeList(){
                let formData = new FormData();
                formData.append("ctId", this.ctId);
                this.$api.activityAssessment.queryTraineeList(formData).then(res => {
                    if (res.code === 0) {
                        this.studentList = res.data;
                    }
                })
            },

            /**
             * 获取所有教师
             */
            getTeacherList(){
                this.$api.activityAssessment.queryTeacherList().then(res => {
                    if (res.code === 0) {
                        this.teacherList = res.data;
                    }
                })
            },

            /**
             * 获取活动基本信息
             */
            getActivityInfo(){
                this.$api.activityAssessment.viewExamroomInfo(this.activityId).then(res => {
                    if (res.code === 0) {
                        this.activityAssessment = res.data;
                        this.getTraineeList();
                        this.getTeacherList();
                    }else{
                        toast(res.msg);
                    }
                })
            }
        },

        created () {
            // 活动分组
            //this.getListActivityGroup();
            // 查询活动基本信息
            if (this.activityId) {
                this.getActivityInfo();
            }else{
                //获取所有学员和教师
                this.getTraineeList();
                this.getTeacherList();
            }
            //获取当前课堂或教学包的所有章节
            // let params = {
            //     pkgId: this.pkgId,
            //     subjectId: this.subjectId
            // }
            // this.$api.pkgInfo.getBookTreeData(params).then((res) => {
            //     if (res.code == 0) {
            //         //this.zNodes.push(res.data);
            //         this.zNodes = res.data.children
            //     }
            // });
            // // 是否选中章节
            // if (this.chapterId) {
            //     this.activityAssessment.chapterId = this.chapterId;
            //     // this.disabledSelectTree = true
            // } else {
            //     this.disabledSelectTree = false
            // }
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
  .el-checkbox{
    text-align: right;
    width: 100%;
    padding-right: 10px;
  }
</style>
