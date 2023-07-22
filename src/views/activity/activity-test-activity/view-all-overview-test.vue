<!-- 所有学员测试活动成绩预览页面 -->
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
      :row-class-name="tableRowClassName"
      @row-click="toogleExpand"
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
      tooltip-effect="dark"
      style="width: 95%;margin: 30px auto 40px;border: 1px solid #EBEEF5;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="table-wrapper" v-if="props.row.historyPaperList.length > 0">
            <el-table
              :data="props.row.historyPaperList">
              <el-table-column
                prop="paperFinalScore"
                label="分数">
              </el-table-column>
              <el-table-column
                prop="paperAccuracy"
                label="正确率">
              </el-table-column>
              <el-table-column
                prop="paperBeginTime"
                label="开始时间">
              </el-table-column>
              <el-table-column
                prop="paperEndTime"
                label="结束时间">
              </el-table-column>
              <el-table-column
                label="操作"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button size="mini" @click="toViewWriteInfoTestActivity(scope.row,props.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="头像">
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
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="jobNumber"
        label="学号">
      </el-table-column>
       <!-- <el-table-column
        prop="state"
        label="状态"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.start === 'N' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.start === 'N' ? '未作答' : '已作答'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="maxScore"
        label="最高分">
      </el-table-column>
      <el-table-column
        label="作答次数">
        <template slot-scope="scope">{{scope.row.historyPaperList ? scope.row.historyPaperList.length : '0'}}</template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click.stop="redoTestPaper(scope.row)" v-if="hasPermission">重做</el-button>
          <span v-if="!hasPermission">无</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="score"
        label="分数"
        sortable>
      </el-table-column>
      <el-table-column
        label="作答时间"
        show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.date}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini">查看</el-button>
        </template>
      </el-table-column> -->
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
  name: 'view-all-overview-test',
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
    activityInfo : {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
        pageTitle: '作答详情',
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
    
    toogleExpand(row) {
      let $table = this.$refs.multipleTable;
      this.tableData.map((item) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },

    /**
     * 返回到活动主页面
     */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false);
    },
    //查询所有学员答题信息
    getTraineeAnswerInfo(){
      let formData = new FormData();
      formData.append('ctId', this.ctId);
      formData.append('activityId', this.activityInfo.activityId);
      formData.append('pkgId', this.pkgId);
      formData.append('traineeName', this.search.name);
      formData.append('jobNumber', this.search.studentId);
      formData.append('mobile', this.search.mobile);
      this.$api.activityTest.queryTraineeAnswerInfo(formData).then(res => {
        if (res.code === 0) {
          for (let index = 0; index < res.data.length; index++) {
            let traineePic = res.data[index].traineePic;
            if (!(traineePic.indexOf('https') != -1 || traineePic.indexOf('http') != -1)) {
              res.data[index].traineePic = baseUrl + traineePic;
            }
          }
         this.tableData = res.data; 
        }else{
          toast(res.msg);
        }
      })
    },
    //跳转到学员答题详情页
    toViewWriteInfoTestActivity(data,testInfo){
      this.$parent.toShowViewWriteInfoTestActivity(data,testInfo);
    },
    //学员重做
    redoTestPaper(value){
      let that = this;
      confirm("重做将会清空学员的作答信息，你确定要继续操作吗？",()=>{
        // let formData = new FormData();
        // formData.append("ctId",this.ctId);
        // formData.append("activityId",this.activityInfo.activityId);
        // formData.append("traineeId",value.traineeId);
        let traineeIds = [];
        traineeIds.push(value.traineeId);
        let formData = {
          ctId: this.ctId,
          activityId: this.activityInfo.activityId,
          traineeIds: traineeIds,
        }
        that.$api.activityTest.resetTestPaper(formData).then(res => {
          if (res.code === 0) {
            this.getTraineeAnswerInfo();
          }else{
            toast(res.msg);
          }
        })
      })
    },
    //前五名添加排名图标
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'icon-row';
      } else if (rowIndex === 1) {
        return 'icon-row';
      }else if (rowIndex === 2) {
        return 'icon-row';
      }else if (rowIndex === 3) {
        return 'icon-row';
      }else if (rowIndex === 4) {
        return 'icon-row';
      }
      return '';
    },
  },
  created () {
    let that = this
    window.eventBus.$on('eventBusReceivedMsgData', function (data) {
      let res = data
        if (res.busitypeIndexNew === 27) { // 活动开始、结束
          if (res.code === 0) {
            if (res.data && res.data.msg && res.data.msg.length > 0) {
                for (let i = 0; i < res.data.msg.length; i++) {
                  if (res.data.msg[i].ctId && that.ctId && that.ctId === res.data.msg[i].ctId && res.data.msg[i].activityId && that.activityInfo && that.activityInfo.activityId && that.activityInfo.activityId === res.data.msg[i].activityId) {
                    that.getTraineeAnswerInfo()
                  }
                }
            }
          }
        }
    })
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
    left: -8px;
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
