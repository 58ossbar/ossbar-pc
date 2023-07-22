<!-- 实践考核所有人得分预览页面 -->
<template>
  <div class="view-all-overview-test">
    <!-- 当前位置导航begin -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 当前位置导航end -->

    <!-- 所有附件下载按钮开始 -->
    <div class="attachment-all-btn">
      <el-input size="medium" placeholder="姓名" v-model="search.name" style="width: 20%" @keyup.enter.native="getTraineeAnswerInfo()">
      </el-input>
      <div style="width:5%;"></div>
      <el-input size="medium" placeholder="学号" v-model="search.studentId" style="width: 20%" @keyup.enter.native="getTraineeAnswerInfo()">
      </el-input>
      <div style="width:5%;"></div>
      <el-input size="medium" placeholder="手机" v-model="search.mobile" style="width: 20%" @keyup.enter.native="getTraineeAnswerInfo()">
      </el-input>
      <div style="width:5%;"></div>
      <el-button size="medium" type="primary" icon="el-icon-search" @click="getTraineeAnswerInfo">搜索</el-button>
    </div>
    <!-- 所有附件下载按钮结束 -->
    <!-- 提交人员显示开始 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      height="500"
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
      tooltip-effect="dark"
      style="width: 95%;margin: 30px auto 40px;border: 1px solid #EBEEF5;">
      <el-table-column
        align="center"
        label="头像" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.traineePic" style="width: 40px;height:40px;border-radius: 50%;" />
          <div class="positioning" v-if="scope.row.ranking === 1"><img src="static/image/teaching_center/champion.png" style="width:30px;height:30px;" alt=""></div>
          <div class="positioning" v-if="scope.row.ranking === 2"><img src="static/image/teaching_center/silver.png" style="width:30px;height:30px;" alt=""></div>
          <div class="positioning" v-if="scope.row.ranking === 3"><img src="static/image/teaching_center/bronze.png" style="width:30px;height:30px;" alt=""></div>
          <div class="positioning" v-if="scope.row.ranking === 4"><img src="static/image/teaching_center/four.png" style="width:30px;height:30px;" alt=""></div>
          <div class="positioning" v-if="scope.row.ranking === 5"><img src="static/image/teaching_center/five.png" style="width:30px;height:30px;" alt=""></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="traineeName"
        label="姓名" width="150">
      </el-table-column>
      <el-table-column
        prop="jobNumber"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="mySelfGiveScore"
        width="120"
        label="自评">
      </el-table-column>
      <el-table-column
        prop="myStudentGiveScore"
        width="120"
        label="互评">
      </el-table-column>
      <el-table-column
        prop="myTeacherGiveScore"
        width="120"
        label="师评">
      </el-table-column>
      <el-table-column
        prop="finalScore"
        width="120"
        label="总得分">
      </el-table-column>
      <el-table-column
        label="详情查看" width="200">
        <template slot-scope="scope">
        <el-button
          size="mini" icon="el-icon-info" v-if="hasPermission" @click="toScorePage(scope.row,'getScore')">得分</el-button>
        <el-button
          size="mini" icon="el-icon-info" @click="toScorePage(scope.row,'setScore')">评分</el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- 提交人员显示结束 -->
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
  formInVaildStyle,
} from '@/utils/global'
export default {
  name: 'view-all-assessment',
  props: {
    // 教学包主键
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    ctId: {
      type: String,
      required: true,
      default: ''
    },
    hasPermission: {
      type: Boolean,
      required: true,
      default: false,
    },
    //活动信息
    activityInfo:{
        type:Object,
        required: true
    },
  },
  data() {
    return {
        pageTitle: '成绩总览',
        //统计信息
        tableData: [],
        //查询信息
        search: {
          name: '',
          studentId: '',
          mobile: '',
        },   
    };
  },
  filters: {
  },
  methods: {

    /**
     * 返回到活动主页面
     */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false);
    },
    //查询所有学员评分及得分信息
    getTraineeAnswerInfo(){
      let obj = {
        activityId: this.activityInfo.activityId,
        traineeName: this.search.name,
      }
      this.$api.activityAssessment.viewExamResultInfo(obj).then((res) => {
        if (res.code === 0) {
          this.tableData = [];
          if (res.data.teaoTraineeExamroom.studentList && res.data.teaoTraineeExamroom.studentList.length > 0) {
            let arr = res.data.teaoTraineeExamroom.studentList;
            arr.forEach((item) => {
              if ((item.traineePic.indexOf('http://') === -1) && (item.traineePic.indexOf('https://') === -1)) {
                item.traineePic = baseUrl + item.traineePic;
              }
            });
            this.tableData = arr;
          }
        }else{
          toast(res.msg);
        }
      })
    },
    //得分与评分页面的跳转
    toScorePage(item,value){
      let obj = {
        state: value,
        info: item,
      }
      this.$parent.toAssessmentInfo(obj);
    },
  },
  created() {
    
  },
  mounted() {
    //获取所有学员答题信息
    this.getTraineeAnswerInfo();
  },
};
</script>

<style scoped>
  .el-table .icon-row {
    position: relative;
  }
  .positioning{
    position: absolute;
    left: 24px;
    top: 0;
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
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 当前位置 */
  .present-localtion{
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 查询区域样式 */
  .attachment-all-btn{
    width: 95%;
    margin: 30px auto 10px;
    display: flex;
  }
  .table-wrapper{
    padding-left:  calc(15% + 60px);
  }
  /* ======================  element表格样式修改  ========================== */
  /* 透明化整体 */
  .table-wrapper /deep/  .el-table,
  .el-table__expanded-cell {
    background-color: transparent !important;
  }
  /* //透明化行、单元格,删除表头下横线 */
  .table-wrapper /deep/ tr, .table-wrapper /deep/ th, .table-wrapper /deep/ td {
    /* background: #1439391c !important; */
    /* color:#fff; */
    border-bottom: 0px;
  }
  /* //hover时样式 */
  .table-wrapper /deep/  .el-table tbody tr:hover>td {
    background-color: #ffffff !important
  }
  /* .view-all-overview-test /deep/  .el-table tbody tr:hover>td {
    background-color: #ffffff !important
  } */
  .table-wrapper /deep/  .el-table::before {
    background-color: #ffffff !important
  }
  .view-all-overview-test /deep/  .el-table__expanded-cell{
    padding: 0 !important
  }
  /* // 表格内容(有用) */
  .table-wrapper /deep/ .el-table__row {
    /* background: #1439391c !important; */
    /* color: #46d4ff; */
  }
</style>
