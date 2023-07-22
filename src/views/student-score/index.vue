<template>
  <div class="backgroundColorGrey">
    <!--菜单栏 begin -->
    <header-nav2/>
    <!--菜单栏 end -->
    <div class="my-teaching-nav wind-1240">
      <div class="display-flex">
        <div class="location">
          <div class="localtion-title"><b>当前位置:</b></div>
          <ul class="localtion-list">
            <li class="localtion-item" style="cursor: pointer" @click="toback()">
              管理看板
            </li>
            <li class="localtion-item">
              <span> {{ isTeacher ? '学生成绩' : '我的成绩' }}</span>
            </li>
          </ul>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <div v-if="!isTeacher" class="my-teaching-search">
        <div class="student-info">
          <div>
            <span class="label-item">学生姓名：{{ studentInfo.traineeName }} </span>
            <span class="label-item">职业路径：{{ studentInfo.majorNames }}</span>
            <span class="label-item">所属班级：{{ studentInfo.classNames }}</span>
            <span class="label-item">手机号码：{{ studentInfo.mobile }}</span>
          </div>
        </div>
      </div>
      <div v-if="isTeacher" class="my-teaching-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium">
          <el-form-item label="职业路径">
            <el-select v-model="filters.majorId" placeholder="请选择" clearable @clear="findPage" @change="findPage">
              <el-option
                v-for="major in majorList"
                :key="major.majorId"
                :label="major.majorName"
                :value="major.majorId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-select v-model="filters.subjectId" placeholder="请选择" filterable clearable @clear="findPage" @change="findPage">
              <el-option
                v-for="major in subjectList"
                :key="major.subjectId"
                :label="major.subjectName"
                :value="major.subjectId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称">
            <el-select v-model="filters.classId" placeholder="请选择" clearable @clear="findPage" @change="findPage">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="考试类型">
            <el-select v-model="filters.type" clearable @clear="findPage" @change="findPage">
              <el-option label="测试活动" value="4"/>
              <el-option label="实践考核" value="9"/>
            </el-select>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input v-model="filters.traineeName"/>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="filters.mobile"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="findPage">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cb-content">
      <div class="table-css">
        <el-table
          :data="tableData"
          border
          height="500"
          style="width: 100%;">
          <el-table-column prop="index" label="序号" width="60">
            <template slot-scope="scope">{{ (scope.$index + 1) + ((pageNum - 1) * pageSize) }}</template>
          </el-table-column>
          <el-table-column v-if="isTeacher" prop="traineeName" label="学生姓名" width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click="clickTraineeName(scope.row)">{{ scope.row.traineeName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="subjectName" label="课程名称" width="180"/>
          <el-table-column prop="examTime" label="考试时间" width="180"/>
          <el-table-column prop="typeName" label="考试类型" width="180"/>
          <el-table-column prop="teacherName" label="授课老师"/>
          <el-table-column prop="finalScore" label="最终成绩"/>
        </el-table>
      </div>
      <div >
        <pager
          v-if="totalPage"
          :class="'custom-css'"
          :curr-page="pageNum"
          :page-size-prop="pageSizeProp"
          :total-page="totalPage"
          align="center"
          @changeIndex="changePage"
        />
      </div>
    </div>

  </div>
</template>

<script>
import headernav2 from '@/components/header-nav-start-class'
import Pager from '@/components/pager'
export default {
  name: 'StudentScore',
  components: {
    'header-nav2': headernav2,
    'pager': Pager
  },
  data() {
    return {
      studentInfo: {},
      formInline: {},
      classList: [],
      majorList: [],
      subjectList: [],
      isTeacher: false,
      filters: {
        majorId: '',
        subjectId: '',
        type: '',
        traineeName: '',
        classId: '',
        mobile: ''
      },
      // 表格数据
      tableData: [],
      // 当前页
      pageNum: 1,
      // 每页显示数
      pageSizeProp: 40,
      // 每页显示数
      pageSize: 40,
      // 总页数
      totalPage: 0
    }
  },
  computed: {

  },
  watch: {
    'filters.majorId': {
      handler(val, oldValue) {
        this.getSubjectList()
        this.getClassList()
      }
    }
  },
  created() {
    const isTeacherValue = localStorage.getItem('isTeacher')
    this.isTeacher = !!(((isTeacherValue && isTeacherValue === 'Y')))
  },
  mounted() {
    this.findTraineeScoreList()
    if (this.isTeacher) {
      this.getMajorList()
      this.getSubjectList()
      this.getClassList()
    } else {
      this.findStudentInfo()
    }
  },
  methods: {
    clickTraineeName(row) {
      this.filters.traineeName = row.traineeName
      this.findPage()
    },
    findPage() {
      this.pageNum = 1
      this.findTraineeScoreList()
    },
    findTraineeScoreList() {
      this.filters.pageNum = this.pageNum
      this.filters.pageSize = this.pageSize
      this.$api.traineeScore.findTraineeScoreList(this.filters).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.list
          this.totalPage = res.data.totalPage
        }
      })
    },
    // 分页更新数据
    changePage(value, size) {
      this.pageNum = value
      this.pageSize = size
      this.findTraineeScoreList()
    },
    toback() {
      this.$router.push('/begin-class')
    },
    getMajorList() {
      this.$api.addclassroom.getMajorList().then(res => {
        if (res.code === 0) {
          this.majorList = res.data
        }
      })
    },
    getSubjectList() {
      const params = {
        majorId: this.filters.majorId
      }
      this.$api.addclassroom.listSelectSubject(params).then(res => {
        if (res.code === 0) {
          this.subjectList = res.data
        }
      })
    },
    getClassList() {
      this.$api.traineeScore.getClassList({ majorId: this.filters.majorId }).then(res => {
        if (res.code === 0) {
          this.classList = res.data
        }
      })
    },
    findStudentInfo() {
      this.$api.traineeScore.findStudentInfo().then(res => {
        if (res.code === 0) {
          this.studentInfo = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
  /* ************************************************** 导航栏样式 begin ************************************************** */
  /* 返回 */
  .test-question-bank-nav{
    /* width: 100%; */
    display: flex;
  }

  .cb-content{
    width: 1200px;
    margin:20px auto;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    background: white;
    min-height: 620px;
  }

  .my-teaching-nav{
    min-height: 50px !important;
    margin: 20px auto;
    background-color: #fff;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    /*padding-bottom: 20px;*/
  }
  .my-teaching-search{
    display: flex;
  }
  .display-flex{
    display:flex;
  }
  /* 返回 */
  .classroom-back{
    width: 100%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  .table-css{
    margin: 20px;
    min-height: 520px;
  }
  .demo-form-inline{
    width: 100%;
    text-align: left;
    padding-left: 20px;
  }
  .custom-css{
    padding: 0 !important;
  }
  .student-info{
    width: 100%;
    padding-bottom: 10px;
    text-align: center;
    margin-left: 20px;
  }
  .label-item{
    padding: 0 30px;
  }
</style>
