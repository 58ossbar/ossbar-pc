<!-- 教学包的使用授权页面 -->
<template>
  <div>
    <header-nav :current-index="5"/>
    <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
      <div class="location">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer" @click="toBack()">
            教学包
          </li>
          <li class="localtion-item">
            <span style="color: #959da0">授予使用权</span>
          </li>
        </ul>
      </div>
      <div class="question-back">
        <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toBack()"/>
        <span @click="toBack()">返回</span>
      </div>
    </div>
    <div class="content-subject wind-1240">
      <div class="teacher-info-choose">
        <!-- 教师查询导航开始 -->
        <div class="teacher-search">
          <div class="teacher-search-nav">
            <!-- 教师工作号查询 -->
            <span class="teacher-search-info">手机号码</span>
            <b-form-input v-model="searchInfo.mobile" placeholder="手机号码" style="width: 15%;height: 31px;font-size: 14px;" @keyup.enter="queryTrainee()"/>
            <!-- 教师姓名查询 -->
            <span class="teacher-search-info">教师姓名</span>
            <b-form-input v-model="searchInfo.traineeName" placeholder="姓名" style="width: 15%;height: 31px;font-size: 14px;" @keyup.enter="queryTrainee()"/>
            <!-- 教师性别查询 -->
            <span class="teacher-search-info">授权状态</span>
            <el-select v-model="searchInfo.traineeState" size="small" style="width: 15%;height: 31px;font-size: 14px;" @change="queryTrainee()">
              <el-option
                v-for="item in traineeState"
                :key="item.id"
                :value="item.id"
                :label="item.value"
                :id="item.id"
              />
            </el-select>
            <!-- 查询按钮 -->
            <!-- <el-button type="primary" variant="info" @click="queryTrainee()" style="width: 6%;height: 31px;padding: 6px 5px;margin-left: 20px;font-size: 14px;">
              <i class="fa fa-search" style="font-size: 16px" aria-hidden="true"></i>
              查询
            </el-button> -->
            <el-button type="primary" style="width: 6%;margin-left: 20px;" size="small" icon="el-icon-search" @click="queryTrainee()">搜索</el-button>
          </div>
        </div>
        <!-- 教师查询导航结束 -->
        <!-- 教师信息及操作开始 -->
        <div class="teacher-list">
          <!-- 教师信息显示头部 -->
          <div class="teacher-list-header">
            <!-- 复选框 -->
            <!--<span><input type="checkbox" /></span>-->
            <!-- 头像 -->
            <div>教师头像</div>
            <!-- 名称 -->
            <div>教师名称</div>
            <!-- 院校 -->
            <div>所属院校</div>
            <!-- 职位 -->
            <div>教师职位</div>
            <!-- 账号 -->
            <div>账号</div>
            <!-- 技术大咖 -->
            <div>职业路径</div>
            <!-- 操作 -->
            <div>操作</div>
          </div>
          <!-- 教师信息显示内容 -->
          <div v-for="(item,index) in traineeList" :key="index" class="teacher-list-content">
            <!-- 复选框 -->
            <!--<span><input type="checkbox" /></span>-->
            <!-- 头像 -->
            <div>
              <img :src="item.teacherPic" class="right-teacher-img">
            </div>
            <!-- 名称 -->
            <div :title="item.teacherName">{{ item.teacherName | ellipsis }}</div>
            <!-- 院校 -->
            <div :title="item.orgId">{{ item.orgId | ellipsis }}</div>
            <!-- 职位 -->
            <div :title="item.postName">{{ item.postName | ellipsis }}</div>
            <!-- 账号 -->
            <!-- 账号 -->
            <div :title="item.mobile">{{ item.mobile | ellipsis }}</div>
            <!-- 技术大咖 -->
            <div :title="item.mainSubjects">{{ item.mainSubjects | ellipsis }}</div>
            <!-- 操作 -->
            <div>
              <el-button
                :type="item.isAuthorized ? 'success' : 'primary'"
                class="right-teacher-button"
                size="small"
                @click="doAuthorization(item)"
              >{{ item.isAuthorized ? '已授权' : '授权' }}</el-button>
            </div>
          </div>
        </div>
        <!-- 教师信息及操作开始 -->
        <!-- 分页区域开始 -->
        <div class="pager-content">
          <pager
            v-if="pagerInfo.totalPage"
            ref="pager"
            :page-size-prop="pagerInfo.pageSizeProp"
            :curr-page="pagerInfo.currPage"
            :total-page="pagerInfo.totalPage"
            align="center"
            @changeIndex="changeIndex"
          />
        </div>
        <!-- 分页区域结束 -->
      </div>
    </div>
  </div>
</template>

<script>
// 引入头部导航页面
import HeaderNav from '@/components/header-nav'
// 引入分页组件页面
import Pager from '@/components/pager'
// 引入一些工具
import { baseUrl, toast, confirm } from '@/utils/global'

export default {
  name: 'AuthorizationPackageReleased',
  components: {
    'header-nav': HeaderNav,
    'pager': Pager
  },
  filters: {
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 6) {
        return value.slice(0, 6) + '...'
      }
      return value
    }
  },
  props: {},
  data() {
    return {
      isClassroomDetail: false,
      // 搜索信息
      searchInfo: {
        traineeName: '', // 姓名
        mobile: '', // 手机号
        traineeState: '', // 性别
        jobNumber: '' // 工作号
      },
      traineeId: '', // 选择的学员id
      traineeList: [], // 学员列表
      // 性别下拉选中查询数据
      traineeState: [{ id: '', value: '不限' }, { id: '1', value: '已授权' }, { id: '2', value: '未授权' }],
      isSearch: false,
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 8, // 分页大小
        pageSize: 8 // 分页大小
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取当前页面的教学包id
    /* if (this.$route.params) {
        this.pkgId = this.$route.params.pkgId
        this.subjectId = this.$route.params.subjectId
      }*/
    if (this.$route.params) {
      this.isClassroomDetail = this.$route.params.isClassroomDetail
    }
    // 从缓存拿数据
    this.pkgId = localStorage.getItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB)
    this.subjectId = localStorage.getItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB)

    // 获取可授权教师
    this.listTrainee()
  },
  mounted() {},
  updated() {},
  methods: {
    // 返回
    toBack() {
      this.$router.push({
        path: '/teaching-package-detail',
        name: 'teaching-package-detail'
      })
    },
    /**
       * 授权
       */
    doAuthorization(item) {
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('userId', item.traineeId)
      if (item.isAuthorized) {
        confirm('取消授权给教师吗【' + item.teacherName + '】吗', () => {
          this.$api.pkgInfo.unauthorization(formData).then(res => {
            if (res.code === 0) {
              toast(res.msg)
              this.listTrainee()
            } else {
              toast(res.msg)
            }
          })
        })
        return false
      }
      confirm('确认授权给教师【' + item.teacherName + '】吗', () => {
        this.$api.pkgInfo.authorizationPkg(formData).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.listTrainee()
          } else {
            toast(res.msg)
          }
        })
      })
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用查询课堂方法
      this.listTrainee()
    },
    // 查询操作
    queryTrainee() {
      this.pagerInfo.currPage = 1
      // 调用查询课堂方法
      this.listTrainee()
    },
    // 获取教师
    listTrainee() {
      this.traineeId = ''
      this.selectedTraineeIds = []
      // 创建接口调用所传参数
      const obj = {
        teacherName: this.searchInfo.traineeName,
        type: this.searchInfo.traineeState,
        jobNumber: this.searchInfo.jobNumber,
        mobile: this.searchInfo.mobile,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize,
        pkgId: this.pkgId
      }
      // 调用所有教师获取接口
      this.$api.authorizationPackage.queryTeacherList(obj).then(res => {
        if (res.code === 0) {
          this.traineeList = []
          this.pagerInfo.totalPage = res.data.totalPage
          // 教师头像显示处理
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].teacherPic) {
              const traineePic = res.data.list[i].teacherPic
              if (!(traineePic.indexOf('https') !== -1 || traineePic.indexOf('http') !== -1)) {
                res.data.list[i].teacherPic = baseUrl + traineePic
              }
            }
          }
          // this.optionsTraineeList = res.data;
          this.traineeList = res.data.list
          this.isSearch = true
        }
      })
    }
  }
}
</script>

<style scoped>

  .content-subject {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .select-info{
    width: 400px;
    box-shadow: 0 0 2px #cac6c6;
    background-color: #FFFFFF;
    padding: 20px;
  }

  .bottom-save{
    margin-left: 5%;
    margin-top: 50px;
    width: 200px;
    clear: both;
  }
  .bottom-save button{
    width: 100%;
    margin-bottom: 50px;
  }
  /* 左边教师查看选中样式 */
  .teacher-info-choose{
    width: 100%;
    box-shadow: 0 0 2px #cac6c6;
    background-color: #FFFFFF;
    padding: 20px 0;
  }
  .teacher-search{
    height: 50px;
    border-bottom: 2px solid #cac6c6;
  }
  .teacher-search-nav{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    line-height: 31px;
  }
  .teacher-search-info{
    margin: 0 20px;
  }
  input::-webkit-input-placeholder{
    font-size:14px;
  }
  .teacher-list{
    padding: 20px 10px;
    font-size: 14px;
    /* height: 450px; */
    height: 480px;
    overflow-y: auto;
  }
  .teacher-list-header{
    display: flex;
    height: 40px;
    border-bottom: 1px solid #F0F3F8;
  }
  .teacher-list-content{
    display: flex;
    height: 50px;
    border-bottom: 1px solid #F0F3F8;
    line-height: 50px;
  }
  .teacher-list-content:hover{
    background-color: #f5f5f5;
  }
  .teacher-list-content > div{
    width: 14%;
    text-align: center;
  }
  .teacher-list-content > span{
    width: 4%;
    text-align: center;
  }
  .teacher-list-header > div{
    width: 14%;
    text-align: center;
  }
  .teacher-list-header > span{
    width: 4%;
    text-align: center;
  }
  .right-teacher-img{
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  .right-teacher-button{
    margin-top: 13px;
    height: 24px;
    width: 60px;
    padding: 4px 10px;
  }
  .authorization-info{
    text-align: left;
  }
  /* 复选框样式 */
  input[type="checkbox"]:hover{
    cursor: pointer;
  }
  input[type="checkbox"]{
    width:16px;
    height:16px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 18px;
    position: relative;
    margin-top: -3px;
  }
  input[type="checkbox"]::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
  }
  input[type="checkbox"]:checked::before{
    content: "\2713";
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    border: 1px solid #000000;
    color:#000000;
    font-size: 15px;
    font-weight: bold;
  }
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }
  ::-webkit-scrollbar-track-piece {
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 3px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  /* 返回 */
  .classroom-back{
    width: 50%;
    text-align: right;
    font-size: 14px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  .location1{
    display: flex;
    align-items: center;
    width: 800px;
    height:40px;
    line-height:40px;
    margin: 0 auto;
    /* background-color: #fafafa; */
  }
  .location1 .localtion-title{
    margin-right: 8px;
  }
  .location1 .localtion-list{
    display: flex;
    align-items: center;
  }
  .location1 .localtion-list .localtion-item+ .localtion-item::before{
    content: '>';
    padding: 0 5px;
  }
  .test-question-bank-nav{
        /* width: 100%; */
        display: flex;
  }
  .test-question-bank-nav2{
      display: flex;

      margin: 20px auto;
      background-color: #fff;
      -webkit-box-shadow: 2px 2px 2px #e0e0e0;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
  }
  .question-back{
      width: 100%;
      text-align: right;
      font-size: 14px;
      margin: 20px;
      cursor: pointer;
      color: #158aeb;
  }
  .question-back-icon{
      font-size: 14px;
      margin-right: 5px
  }
</style>
