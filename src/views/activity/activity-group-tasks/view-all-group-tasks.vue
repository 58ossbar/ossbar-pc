<!-- 查看所有学员提交的作业/小组任务页面 -->
<template>
  <div class="view-all-group-tasks">
    <!-- 路径导航开始 -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{ pageTitle }}</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"/>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 路径导航结束 -->
    <!-- 所有附件下载按钮开始 -->
    <div class="attachment-all-btn">
      <el-input v-model="searchText" placeholder="请输入搜索内容" style="width: 30%">
        <el-button slot="append" icon="el-icon-search"/>
      </el-input>
      <el-button size="small" type="primary">附件下载</el-button>
    </div>
    <!-- 所有附件下载按钮结束 -->
    <!-- 提交人员显示开始 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
      border
      height="500"
      tooltip-effect="dark"
      style="width: 95%;margin: 30px auto 40px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        label="日期"
        width="200">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="150"/>
      <el-table-column
        prop="address"
        label="学号"
        width="200"/>
      <el-table-column
        label="附件"
        width="100">
        <template slot-scope="scope">无</template>
      </el-table-column>
      <el-table-column
        label="简答"
        show-overflow-tooltip>
        <template slot-scope="scope">连接手机，开启USB调试，进入hello-uniapp项目，点击工具栏的运行 -> 真机运行 -> 选择运行的设备，即可在该设备里面体验uni-app。</template>
      </el-table-column>
    </el-table>
    <!-- 提交人员显示结束 -->
  </div>
</template>

<script>
export default {
  name: 'ViewAllGroupTasks',
  data() {
    return {
      pageTitle: '显示所有提交页面',
      searchText: '',
      tableData: [{
        date: '2016-05-03',
        name: '梅花桩',
        address: '1767476666'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '1767476666'
      }, {
        date: '2016-05-04',
        name: '洲街道',
        address: '1767476666'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '1767476666'
      }, {
        date: '2016-05-08',
        name: '于谦',
        address: '1767476666'
      }, {
        date: '2016-05-06',
        name: '六九点',
        address: '1767476666'
      }, {
        date: '2016-05-07',
        name: '知识城',
        address: '1767476666'
      }],
      multipleSelection: []
    }
  },
  methods: {
    /**
             * 跳页面
             */
    goToPageActivityList() {
      this.$parent.changeVotoQuestionnairePage(false)
    },

    /**
             *  存入选中的学员
             * @param val
             */
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
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
  .cursor{
    cursor: pointer;
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
  /* 附件下载按钮区域样式 */
  .attachment-all-btn{
    width: 95%;
    margin: 30px auto 10px;
    display: flex;
    justify-content: space-between;
  }
</style>
