<!-- 新增答疑讨论页面 -->
<template>
    <div class="answer-discuss">
      <!-- 位置导航模块开始 -->
      <div class="present-localtion">
        <div>
          当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
          <span @click="goToPageActivityList()">返回</span>
        </div>
      </div>
      <!-- 位置导航模块结束 -->
      <!-- 编辑提交表单开始 -->
      <form>
        <div style="width: 100%;font-size: 14px;">
          <!-- 标题输入开始 -->
          <div style="width: 95%;margin: 20px auto;display: flex;">

            <div style="width: 48%;">
              <div style="text-align: left">活动主题</div>
              <el-input
                :disabled="presentIsEditStates"
                v-model="activityAnswerDiscuss.activityTitle"
                id="discussTitle"
                type="text"
                placeholder="请输入活动主题"
                style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
              <div class="invalid-feedback col-10 textAlignLeft p-0 discussTitleHint"><small >请填写活动主题！</small></div>
            </div>

            <!-- 所属章节 begin -->
            <div style="width: 48%;margin-left:4%">
              <div style="text-align: left">所属章节</div>
              <div style="margin-top: 9px">
                <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="activityAnswerDiscuss.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || presentIsEditStates">
                </el-cascader>
              </div>
            </div>
            <!-- 所属章节 end -->
          </div>
          <!-- 标题输入结束 -->


          <!-- 主题输入开始 -->
          <div style="width: 95%;margin: 20px auto">
            <div style="text-align: left">活动介绍</div>
            <el-input
              type="textarea"
              :disabled="presentIsEditStates"
              v-model="activityAnswerDiscuss.content"
              rows="5"
              id="discussContent"
              cols="100"
              placeholder="请输入答疑讨论活动介绍"
              style="margin-top: 10px;font-size: 14px"></el-input>
            <div style="font-size: 14px;text-align: left">用于描述讨论主题，最多可输入500字</div>
            <div class="invalid-feedback col-10 textAlignLeft p-0 discussContentHint"><small >请填写活动主题！</small></div>
          </div>
          <!-- 主题输入结束 -->
          <!-- 操作是否允许选择开始 -->
          <div style="width: 98%;margin: 10px auto;">
            <div style="display: flex">
              <div class="custom-control custom-checkbox" style="margin-left: 20px">
                <input
                  :disabled="presentIsEditStates"
                  v-model="activityAnswerDiscuss.isAllowPic"
                  true-value="N"
                  false-value="Y"
                  type="checkbox"
                  class="custom-control-input"
                  id="DiscussCheck1">
                <label class="custom-control-label" for="DiscussCheck1">禁止发送图片信息</label>
              </div>
              <div class="custom-control custom-checkbox" style="margin-left: 20px">
                <input
                  :disabled="presentIsEditStates"
                  v-model="activityAnswerDiscuss.isAllowVoice"
                  true-value="N"
                  false-value="Y"
                  type="checkbox"
                  class="custom-control-input"
                  id="DiscussCheck2">
                <label class="custom-control-label" for="DiscussCheck2">禁止发送语音信息（发送语音信息仅支持移动设备）</label>
              </div>
            </div>
          </div>
          <!-- 操作是否允许选择结束 -->
          <!-- 表单提交和取消按钮开始 -->
          <div style="width: 94%;margin: 20px 3%;text-align: center;padding-bottom: 20px;" v-if="!presentIsEditStates">
            <button
              v-if="!presentIsEditStates"
              @click="handleSaveActivityAnswerDiscuss"
              type="button"
              :disabled="isViewSave"
              class="btn btn-outline-primary"
              style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
            <button
              @click="handleCancelActivityAnswerDiscuss"
              type="button"
              class="btn btn-outline-secondary"
              style="font-size: 14px;width: 100px;margin-left: 10px">{{presentIsEditStates?'返回':'取消'}}</button>
          </div>
          <!-- 表单提交和取消按钮结束 -->
        </div>
      </form>
      <!-- 编辑提交表单结束 -->
    </div>
</template>

<script>
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle} from '@/utils/global'
    import CbTree from '@/components/cb-tree/index'
    export default {
        name: "save-answer-discuss",
        components: {
          CbTree
        },
        props: {
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
          // 所属章节
          chapterId: {
            type: String,
            required: true,
            default: '',
          },
          subjectId: {
            type: String,
            required: true,
            default: ''
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
            zNodes: [],
            setting: {
              data: {
                key: {
                  name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
                },
              }
            },
            pageTitle: '创建答疑讨论',
            listActivityGroup:[],//活动分组列表
            empiricalValueList:[2,4,6],//经验值列表
            //答疑讨论
            activityAnswerDiscuss:{
              activityId:"",  //活动id
              activityTitle:"", //活动标题
              pkgId:"", //教程id
              resgroupId:"0",
              purpose:"2",
              chapterId:'',
              content:"",
              isShow:"N",
              isAllowPic:"Y",
              isAllowVoice:"Y",
              isAllowVideo:"Y"
            },
            isViewSave: false,  //是否禁用新增按钮
          }
        },
        methods:{
          onclick (treeNode, nodes, isMultiple) {
            this.activityAnswerDiscuss.chapterId = treeNode.chapterId
          },
          /**
           * 跳页面
           */
          goToPageActivityList () {
            // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
            this.$parent.changeVotoQuestionnairePage(false);
          },
          //获取活动分组
          getListActivityGroup(){
            this.$api.activity.listActivityGroup({pkgId:this.pkgId}).then(res=>{
              if(res.code===0){
                if(res.data&&res.data.length>0){
                  this.listActivityGroup=res.data;
                }
              }
            })
          },
          //确定保存答疑/讨论信息
          handleSaveActivityAnswerDiscuss(){
            /*if (this.chapterId != null && this.chapterId != '') {
              this.activityAnswerDiscuss.chapterId = this.chapterId
            }*/
            if(this.formAnswerDiscussVerifyBoolean()){
              this.isViewSave = true;
              if (this.activityAnswerDiscuss.chapterId && this.activityAnswerDiscuss.chapterId.length > 0) {
                if ('object' === typeof this.activityAnswerDiscuss.chapterId) {
                  this.activityAnswerDiscuss.chapterId = this.activityAnswerDiscuss.chapterId[this.activityAnswerDiscuss.chapterId.length - 1];
                }
              }else{
                this.activityAnswerDiscuss.chapterId = "";
              }
              this.activityAnswerDiscuss.pkgId=this.pkgId;
              this.$api.activityAnswerDiscuss.saveActivityAnswerDiscuss(this.activityAnswerDiscuss).then(res=>{
                if(res.code===0){
                  this.$parent.getListActivity();
                  this.$emit("updateInfo")
                  toast(res.msg);
                  this.clearActivityAnswerDiscussInfo();
                }else {
                  toast(res.msg);
                }
                this.isViewSave = false;
              })
            }
          },
          //答题讨论表单验证
          formAnswerDiscussVerifyBoolean(){
            if(!this.activityAnswerDiscuss.activityTitle){
              formInVaildStyle('.discussTitleHint',"#discussTitle");
              $("#discussTitle").css('borderColor','#dc3545');
              return false;
            }
            $("#discussTitle").removeAttr("style");
            formVaildStyle('.discussTitleHint',"#discussTitle");
            if(!this.activityAnswerDiscuss.content){
                formInVaildStyle('.discussContentHint',"#discussContent");
                $("#discussContent").css('borderColor','#dc3545');
                return false;
            }
            $("#discussContent").removeAttr("style");
            formVaildStyle('.discussContentHint',"#discussContent");
            if(!this.activityAnswerDiscuss.resgroupId){
              formInVaildStyle('.discussGroupHint',"#discussGroup");
              $("#discussGroup").css('borderColor','#dc3545');
              return false;
            }
            $("#discussGroup").removeAttr("style");
            formVaildStyle('.discussGroupHint',"#discussGroup");
            return true;
          },
          //清除答疑/讨论表单信息
          clearActivityAnswerDiscussInfo(){
            this.activityAnswerDiscuss={
              activityId:"",
              activityTitle:"",
              pkgId:"",
              resgroupId:"",
              purpose:"2",
              content:"",
              isShow:"N",
              isAllowPic:"N",
              isAllowVoice:"N",
              isAllowVideo:"N"
            };
            this.goToPageActivityList();
          },
          //取消保存答疑/讨论信息
          handleCancelActivityAnswerDiscuss(){
            this.clearActivityAnswerDiscussInfo();
          },
          //获取其父级以及其自己的章节id
          getChapterIdList(arr,chapterId){
              arr.forEach((item,index) => {
                  if (item.chapterId === chapterId) {
                      this.activityAnswerDiscuss.chapterId.unshift(item.parentId);
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
            this.$api.activityAnswerDiscuss.viewAnswerDiscussInfo(this.activityId).then(res=>{
              if (res.code == 0) {
                this.activityAnswerDiscuss = res.data;
              }
            })
          }
          let params = {
            pkgId: this.pkgId,
            subjectId: this.subjectId
          }
          this.$api.pkgInfo.getBookTreeData(params).then((res) => {
            if (res.code == 0) {
              //this.zNodes.push(res.data);
              this.zNodes = res.data.children;
              if (this.chapterId) {
                  this.activityAnswerDiscuss.chapterId = [];
                  this.activityAnswerDiscuss.chapterId.push(this.chapterId);
                  this.getChapterIdList(this.zNodes,this.chapterId);
                  this.activityAnswerDiscuss.chapterId.splice(0,1);
              //this.disabledSelectTree = true
              } else {
                  this.disabledSelectTree = false
              }
            }
          });
          // 是否选中章节
          // if (this.chapterId) {
          //   this.activityAnswerDiscuss.chapterId = this.chapterId;
          //   //this.disabledSelectTree = true
          // } else {
          //   this.disabledSelectTree = false
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
</style>
