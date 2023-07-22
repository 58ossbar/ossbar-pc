<!-- 新增课堂表现活动页面 -->
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
          <div style="width: 95%;margin: 20px auto">
            <div style="text-align: left">活动主题</div>
            <el-input
              :disabled="presentIsEditStates"
              v-model="performanceData.answerTitle"
              id="answerTitle"
              type="text"
              placeholder="请输入答疑讨论活动主题"
              style="font-size: 14px;height: 36px;margin-top: 10px"></el-input>
            <div class="invalid-feedback col-10 textAlignLeft p-0 answerTitleHint"><small >请填写活动主题！</small></div>
          </div>
          <!-- 标题输入结束 -->
          <!-- 分组和经验值选择下拉框开始 -->
          <div style="width: 95%;margin: 10px auto;display: flex">
            <div style="width: 48%;margin-right: 2%">
              <div style="text-align: left">活动类型</div>
              <div>
                <el-select
                  :disabled="presentIsEditStates"
                  v-model="performanceData.type"
                  style="font-size: 14px;height: 36px;margin-top: 10px;width:100%;">
                  <el-option
                    :key="index"
                    :value="item.code"
                    :label="item.value"
                    v-for="(item,index) in listActivityType"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div style="width: 48%;margin-left: 2%;text-align:left;" v-show="performanceData.type === '1'">
              <div style="text-align: left">抢答人数</div>
              <!-- <div>
                <el-select
                  disabled
                  v-model="performanceData.resgroupId"
                  style="font-size: 14px;height: 36px;margin-top: 10px;width:100%;">
                  <el-option
                    :key="indexItem"
                    :value="group.dictCode"
                    :label="group.dictValue"
                    v-for="(group,indexItem) in listActivityGroup"
                  ></el-option>
                </el-select>
              </div> -->
              <div>
                  <el-input-number style="font-size: 14px;margin-top: 10px;" :disabled="presentIsEditStates" v-model="performanceData.answerNum" step-strictly controls-position="right" :min="1" :max="studentNum" :step="1"></el-input-number> 名
              </div>
            </div>
            <!-- 经验值 begin -->
            <!-- <div style="width: 48%;margin-left: 2%">
              <div style="text-align: left">所属章节</div>
              <div style="margin-top: 9px">
                <cb-tree :parent-vue="this._self"
                         :id="'vo-page-tree'+chapterId"
                         type="select"
                         :z-nodes="zNodes"
                         id-key="chapterId"
                         p-id-key="parentId"
                         name="chapterName"
                         width="50"
                         :defaultValue="activityAnswerDiscuss.chapterId"
                         :disabled="disabledSelectTree || presentIsEditStates"
                         @onclick="onclick"
                ></cb-tree>
                <div class="invalid-feedback col-10 textAlignLeft p-0 empiricalValueHint"><small >请选择章节！</small></div>
              </div>
            </div> -->
            <!-- 经验值 end -->
          </div>
          <!-- 分组和经验值选择下拉框结束 -->

          <!-- 抢答人数设置 -->
          <!-- <div style="width: 95%;margin: 30px auto;text-align: left;">
              <div v-show="performanceData.type === '1'">
                  抢答人数：<el-input-number :disabled="presentIsEditStates" v-model="performanceData.answerNum" size="small" step-strictly controls-position="right" :min="1" :step="1"></el-input-number> 名
              </div>
          </div> -->

          <!-- 表单提交和取消按钮开始 -->
          <div style="width: 94%;margin: 50px 3% 20px 3%;text-align: center;padding-bottom: 20px;" v-if="!presentIsEditStates">
            <button
              v-if="!presentIsEditStates"
              @click="handleSaveActivityPerformance"
              :disabled="isViewSave"
              type="button"
              class="btn btn-outline-primary"
              style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px">确定</button>
            <button
              @click="handleCancelActivityPerformance"
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
    export default {
        name: "save-classroom-performance",
        components: {
        },
        props: {
          pkgId:{
            type:String,
            required: true
          },
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
          subjectId: {
            type: String,
            required: true,
            default: ''
          },
        },
        data () {
          return {
            pageTitle: '创建课堂表现',
            listActivityGroup:[],//活动分组列表
            listActivityType:[
                {code: '1',value:'学员抢答'},
                {code: '2',value:'随机选人'},
                {code: '3',value:'手动选人'},
            ],
            studentNum: 0,
            //答疑讨论
            performanceData:{
              activityId:"",  //活动id
              activityTitle:"", //活动标题
              pkgId:"", //教程id
              resgroupId:"3",
              type: "1",
              answerNum: "1",
              answerTitle: "",
            },
            isViewSave: false,  //是否禁用新增按钮
          }
        },
        methods:{
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
          //确定课堂表现信息
          handleSaveActivityPerformance(){
            /*if (this.chapterId != null && this.chapterId != '') {
              this.activityAnswerDiscuss.chapterId = this.chapterId
            }*/
            if(this.formAnswerDiscussVerifyBoolean()){
                this.isViewSave = true;
                let obj = {
                    activityId: this.activityId,
                    ctId: this.ctId,
                    pkgId: this.pkgId,
                    activityType: "6",
                    answerNum: this.performanceData.answerNum,
                    type: this.performanceData.type,
                    answerTitle: this.performanceData.answerTitle,
                }
                this.$api.activityClassroomPerformance.launchAnswer(obj).then(res => {
                    if (res.code === 0) {
                        this.clearActivityPerformance();
                    }
                    toast(res.msg);
                    this.isViewSave = false;
                })
            }
          },
          //答题讨论表单验证
          formAnswerDiscussVerifyBoolean(){
            if(!this.performanceData.answerTitle){
              formInVaildStyle('.answerTitleHint',"#answerTitle");
              $("#answerTitle").css('borderColor','#dc3545');
              return false;
            }
            $("#answerTitle").removeAttr("style");
            formVaildStyle('.answerTitleHint',"#answerTitle");

            return true;
          },
          //清除答疑/讨论表单信息
          clearActivityPerformance(){
            this.performanceData = {
              activityId:"",  //活动id
              activityTitle:"", //活动标题
              pkgId:"", //教程id
              resgroupId:"0",
              type: "1",
              answerNum: "1",
              answerTitle: "",
            };
            this.goToPageActivityList();
          },
          //取消保存答疑/讨论信息
          handleCancelActivityPerformance(){
            this.clearActivityPerformance();
          },

        },
        created () {
            // 活动分组
            //this.getListActivityGroup();
            // 查询活动基本信息
            if (this.activityId) {
                console.log(this.activityId);
                // this.$api.activityAnswerDiscuss.viewAnswerDiscussInfo(this.activityId).then(res=>{
                //   if (res.code == 0) {
                //     this.activityAnswerDiscuss = res.data;
                //   }
                // })
            }
            //获取当前课堂所有成员
            this.$api.activityClassroomPerformance.selectClassroomTraineeInfo(this.ctId).then(res => {
                if (res.code === 0) {
                    this.studentNum = res.data.length;
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
