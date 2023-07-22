<!-- 新增头脑风暴活动页面 -->
<template>
    <div class="storm-mind brainstorming-box">
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
            <div style="width: 95%;margin: 20px auto;display: flex;">
                <div style="width: 48%;">
                    <!-- 标题文字 -->
                    <div style="text-align: left">活动主题</div>
                    <!-- 标题输入框 -->
                    <el-input
                    :disabled="presentIsEditStates"
                    v-model="activityBrainstorming.activityTitle"
                    id="brainstormingTitle"
                    type="text"
                    placeholder="请输入头脑风暴活动主题"
                    style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
                    <!-- 错误提示 -->
                    <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingTitleHint"><small >请填写活动主题！</small></div>
                </div>
                <div style="width: 48%;margin-left:4%;">
                    <div style="text-align: left">所属章节</div>
                    <div style="margin-top: 9px">
                    <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="activityBrainstorming.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || isView">
                    </el-cascader>
                    </div>
                </div>

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
                      v-model="activityBrainstorming.content"
                      id="brainstormingContent"
                      rows="5"
                      cols="100"
                      placeholder="请输入头脑风暴活动介绍"
                      style="margin-top: 10px;font-size: 14px;"></el-input>
                    <!-- 主题字数提示 -->
                    <div style="font-size: 14px;text-align: left;">最多3000字</div>
                    <!-- 错误提示 -->
                    <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingContentHint"><small >请填写活动介绍！</small></div>
                </div>
                <!-- 主题结束 -->
                <!-- 题目图片上传开始 -->
                <div style="width: 95%;margin: 20px auto;" v-if="false">
                    <!-- 未添加图片是显示的内容 -->
                    <div class="brainstorming-upload">
                      <div class="brainstorming-upload-file">
                        <img src="static/image/teaching_package/link_1.png" alt="">
                        <span>{{brainstormingUploadPic!==""?'已添加一张图片':'添加一张图片'}}</span>
                        <input
                          :disabled="presentIsEditStates"
                          type="file"
                          id="brainstormingFile"
                          class="brainstorming-file"
                          name="ClassImg"
                          accept="image/gif,image/jpeg,image/jpg,image/png"
                          @change="brainstormingChangeImage($event)">
                      </div>
                      <div class="upload-file-hint">仅支持jpg,png,jpeg,gif,bmp格式的文件</div>
                    </div>
                    <!-- 添加图片后显示的图片 -->
                    <div class="upload-img-box" v-viewer v-show="brainstormingUploadPic">
                      <img :src="brainstormingUploadPic" alt>
                    </div>
                    <!-- 错误提示 -->
                    <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingFileHint"><small >请上传图片！</small></div>
                    <!--&lt;!&ndash; <div style="font-size: 14px;margin-top: 10px;color: #fec446;text-align: left">
                        若你上传文件遇到问题，请确保你使用了
                        <span style="color:#3399ff;">建议浏览器，</span>
                        并将浏览器设置为
                        <span style="color:#3399ff;">极速模式</span>
                    </div> &ndash;&gt;-->
                </div>
                <!-- 题目图片上传结束 -->
                <!-- 温馨提示 -->
                <div style="font-size: 14px;color: #ff5524;text-align: left;width: 95%;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>
                <!-- 操作按钮开始 -->
                <div style="width: 94%;margin: 20px 3%;text-align: center" v-if="!presentIsEditStates">
                    <!-- 确定提交按钮 -->
                    <button
                      v-if="!presentIsEditStates"
                      @click="sureCreateBrainstorming"
                      type="button"
                      :disabled="isViewSave"
                      class="btn btn-outline-primary"
                      style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
                    <!-- 返回取消按钮 -->
                    <button
                      @click="handleCancelCreateBrainstorming"
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
        name: "SaveStormMind",
        components: {
          CbTree
        },
        props: {
            //教学包id
            pkgId:{
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
            // 是否为编辑状态，编辑状态下，原有的题目不允许修改题目类型
            isEdit: {
                type: Boolean,
                required: true,
                default: true
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
                props:{
                    checkStrictly: true,
                    value:'chapterId',
                    label:'chapterName'
                },
                disabledSelectTree: false, // 是否禁选下拉树
                zNodes: [], //章节树形图数据
                setting: {
                    data: {
                        key: {
                            name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
                        },
                    }
                },
                pageTitle: '创建头脑风暴',  //页面名字
                brainstormingUploadPic:'',  //上传头像
                listActivityGroup:[],//活动分组列表
                empiricalValueList:[2,4,6],//经验值列表
                questionTypeList:[],//题目类型列表
                //头脑风暴信息
                activityBrainstorming:{
                    activityId:'',  //活动id
                    resgroupId:'0',   //分组id
                    activityTitle:'',   //活动主题
                    content:'',   //活动内容
                    chapterId:'',   //章节id
                    purpose:'',   //经验值
                    file:'',  //活动图片
                    sortNum:0,  //排序
                    resgroupName:'',  //分组名称
                },
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
              this.activityBrainstorming.chapterId = treeNode.chapterId
            },

            /**
             * 返回到活动主页面
             */
            goToPageActivityList () {
              // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
              this.$parent.changeVotoQuestionnairePage(false);
            },

            /**
             * 头脑风暴表单验证
             * @returns {boolean}
             */
            formBrainstormingVerifyBoolean(){
                //活动主题验证
                if(!this.activityBrainstorming.activityTitle){
                    //出现提示
                    formInVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
                    $("#brainstormingTitle").css('borderColor','#dc3545');
                    return false;
                }
                //清除提示
                $("#brainstormingTitle").removeAttr("style");
                formVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
                //活动内容验证
                if(!this.activityBrainstorming.content){
                    formInVaildStyle('.brainstormingContentHint',"#brainstormingContent");
                    $("#brainstormingContent").css('borderColor','#dc3545');
                    return false;
                }
                $("#brainstormingContent").removeAttr("style");
                formVaildStyle('.brainstormingContentHint',"#brainstormingContent");
                //图片验证
                if(!this.activityBrainstorming.activityTitle){
                    formInVaildStyle('.brainstormingFileHint',"#brainstormingFile");
                    return false;
                }
                formVaildStyle('.brainstormingFileHint',"#brainstormingFile");
                //分组验证
                if(!this.activityBrainstorming.resgroupId){
                    formInVaildStyle('.brainstormingGroupHint',"#brainstormingGroup");
                    return false;
                }
                formVaildStyle('.brainstormingGroupHint',"#brainstormingGroup");
                return true;
            },

            /**
             * 清除头脑风暴表单信息
             */
            clearCreateBrainstormingInfo(){
                this.brainstormingUploadPic='';
                this.activityBrainstorming={
                    activityId:'',
                    resgroupId:'',
                    activityTitle:'',
                    content:'',
                    chapterId:'',
                    purpose:'',
                    file:'',
                };
                //调用返回到活动主页面事件
                this.goToPageActivityList();
            },

            /**
             * 取消创建头脑风暴
             */
            handleCancelCreateBrainstorming(){
                //调用清空返回事件
                this.clearCreateBrainstormingInfo();
            },

            /**
             * 确定创建头脑风暴
             */
            sureCreateBrainstorming(){
                //存入活动当前所属章节
                // if (this.chapterId != null && this.chapterId != '') {
                //     this.activityBrainstorming.chapterId = this.chapterId;
                // }
                //验证并提交
                if(this.formBrainstormingVerifyBoolean()){
                    this.isViewSave = true;
                    //创建提交对象
                    let formData = new FormData();
                    formData.append("activityId",this.activityBrainstorming.activityId);
                    formData.append("resgroupId",this.activityBrainstorming.resgroupId);
                    formData.append("activityTitle",this.activityBrainstorming.activityTitle);
                    formData.append("content",this.activityBrainstorming.content);
                    //formData.append("chapterId",(this.activityBrainstorming.chapterId && this.activityBrainstorming.chapterId.length > 0) ? this.activityBrainstorming.chapterId[this.activityBrainstorming.chapterId.length - 1] : '');
                  formData.append("chapterId",(this.activityBrainstorming.chapterId && this.activityBrainstorming.chapterId.length > 0) ? ('object' === typeof this.activityBrainstorming.chapterId ? this.activityBrainstorming.chapterId[this.activityBrainstorming.chapterId.length - 1] : this.activityBrainstorming.chapterId) : '');
                    formData.append("purpose",this.activityBrainstorming.purpose);
                    formData.append("file",this.activityBrainstorming.file);
                    formData.append("pkgId",this.$parent.pkgId);
                    //调用提交方法
                    this.$api.activityBrainstorming.saveActivityBrainstorming(formData).then(res=>{
                        if(res.code===0){
                            //调用主活动页活动刷新方法
                            this.$parent.getListActivity();
                            this.$emit("updateInfo");
                            //提示成功信息
                            toast(res.msg);
                            //当前表单数据
                            this.clearCreateBrainstormingInfo();
                        }else {
                            toast(res.msg);
                        }
                        this.isViewSave = false;
                    })
                }
            },
            //点击上传图片
            brainstormingChangeImage(e){
                //获取上传文件类型
                let imageType = e.target.files[0].type;
                //判断类型并上传获取图片路径
                if(imageType === "image/png" || imageType === "image/jpeg" || imageType === "image/gif" || imageType === "image/bmp" || imageType === "image/jpg"){
                    this.activityBrainstorming.file = e.target.files[0];
                    let reader = new FileReader();
                    let that = this;
                    reader.readAsDataURL(this.activityBrainstorming.file);
                    reader.onload = function(e){
                        that.brainstormingUploadPic = this.result;
                    }
                }else{
                    toast("图片格式不正确！");
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

            //获取其父级以及其自己的章节id
            getChapterIdList(arr,chapterId){
                arr.forEach((item,index) => {
                    if (item.chapterId === chapterId) {
                        this.activityBrainstorming.chapterId.unshift(item.parentId);
                        this.getChapterIdList(this.zNodes,item.parentId)
                    }
                    if (item.children && item.children.length > 0) {
                        this.getChapterIdList(item.children,chapterId);
                    }
                })
            },
        },

        created () {
            // 活动分组
            //this.getListActivityGroup();
            // 查询活动基本信息
            if (this.activityId) {
                this.$api.activityBrainstorming.viewActivityBrainstormingInfo(this.activityId).then(res=>{
                    if (res.code == 0) {
                        this.activityBrainstorming = res.data;
                        if (this.activityBrainstorming.activityPic){
                          this.brainstormingUploadPic = baseUrl + this.activityBrainstorming.activityPic;
                        }
                    }
                })
            }
            //获取当前课堂或教学包的所有章节
            let params = {
                pkgId: this.pkgId,
                subjectId: this.subjectId
            }
            this.$api.pkgInfo.getBookTreeData(params).then((res) => {
                if (res.code == 0) {
                    //this.zNodes.push(res.data);
                    this.zNodes = res.data.children// 是否选中章节
                    if (this.chapterId) {
                        this.activityBrainstorming.chapterId = [];
                        this.activityBrainstorming.chapterId.push(this.chapterId);
                        this.getChapterIdList(this.zNodes,this.chapterId);
                        this.activityBrainstorming.chapterId.splice(0,1);
                    //this.disabledSelectTree = true
                    } else {
                        this.disabledSelectTree = false
                    }
                }
            });
            // 是否选中章节
            // if (this.chapterId) {
            //     this.activityBrainstorming.chapterId = this.chapterId;
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
  .brainstorming-upload{
    display: flex;
    align-items: center;
  }
  .brainstorming-upload-file{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:200px;
    height:40px;
    border: 2px solid #1296db;
    color: #1296db;
    cursor: pointer;
    margin-right:20px;
    padding: 0 25px;
  }
  .brainstorming-upload-file > span{
    font-size: 16px;
  }
  .brainstorming-upload-file .brainstorming-file{
    position: absolute;
    top:0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity:0;
    filter:Alpha(opacity=0);
  }
  .brainstorming-upload .upload-file-hint{
    font-size: 16px;
  }
  .upload-img-box{
    width: 120px;
    height:80px;
  }
  .brainstorming-box .upload-img-box > img{
    width: 120px;
    height:80px;
    margin:8px 0;
  }
</style>
