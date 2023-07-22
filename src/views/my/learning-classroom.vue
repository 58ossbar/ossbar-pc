<!-- 我的课堂的显示页面 -->
<template>
  <div class="backgroundColorGrey" >
    <header-nav :current-index="isTeacher ? 6 : 8" />
    <div class="my-teaching-nav wind-1240">
      <div class="display-flex">
        <div class="location">
          <div class="localtion-title"><b>当前位置:</b></div>
          <ul class="localtion-list">
            <li class="localtion-item" style="cursor: pointer" @click="toback()">
              管理看板
            </li>
            <li v-if="!isTeacher" class="localtion-item">
              <span style="color: #959da0">我的课堂</span>
            </li>
            <li v-if="isTeacher" class="localtion-item">
              <span >学习中心</span>
            </li>
            <li v-if="isTeacher" class="localtion-item">
              <span style="color: #959da0">{{ type }}</span>
            </li>
          </ul>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <div class="my-teaching-search">
        <el-select v-model="classroomState" size="medium" style="margin-left:20px;" placeholder="请选择教学包状态" @change="toGetClassList">
          <el-option
            v-for="item in releaseStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="year" size="medium" style="margin-left:20px;" placeholder="请选择课堂年份" @change="toGetClassList">
          <el-option
            v-for="item in yearList"
            :key="item.joinYears"
            :label="item.joinYears ? item.joinYears : '所有年份'"
            :value="item.joinYears"/>
        </el-select>
        <el-input
          v-model="teacherName"
          placeholder="请输入老师名称"
          size="medium"
          style="width:20%;margin-left:2%;"
          clearable
          @keyup.enter.native="toGetClassList"/>
        <el-input
          v-model="subjectName"
          placeholder="请输入课堂名称"
          size="medium"
          style="width:20%;margin-left:2%;"
          clearable
          @keyup.enter.native="toGetClassList"/>
        <el-button type="primary" icon="el-icon-search" style="margin-left:2%;" size="medium" @click="toGetClassList">搜索</el-button>
      </div>
    </div>
    <div class="classroom-all">

      <div class="classroom-area area-border">
        <img title="加入课堂" src="../../../static/image/addClassromm.png" class="to-add-classroom" @click="toAddLearningCourses()">
        <div style="color: #959da0">加入课堂</div>
      </div>
      <div
        v-for="(item, index) in myClassList"
        :key="index"
        class="classroom-area classroom-item">
        <div class="teaching-one" style="border-radius: 10px 10px 0px 0px; overflow: hidden;" @click="toClassroomDetails(item)">
          <div style="overflow: hidden;position: relative;border-top-right-radius: 10px;">
            <img :src="item.pic" class="classroom-img">
            <div v-show="(item.classroomTraineeState === 'N')" class="classroom-student-state">
              <span>{{ item.classroomTraineeStateName }}</span>
            </div>
            <div :class="['classroom-state',item.classroomStateBg]">
              <!-- <img v-if="item.classroomState==='2'" src="static/image/teaching_package/state.gif" alt="">
                      <span>{{item.classroomStateName}}</span> -->
            </div>

            <div class="classroom-state-title">
              <!-- <div style="margin-right:2px;" v-if="item.classroomState==='2'">
                          <img src="static/image/teaching_package/state.gif" alt="">
                        </div> -->
              <span>{{ item.classroomStateName }}</span>
            </div>
          </div>
          <!-- <div class="classroom-area-number">
                    <div class="classroom-area-nums">
                        <span>活动（<span>{{item.pkgActCount}}</span>）</span>
                    </div>
                    <div class="classroom-area-nums">
                        <span>资源（<span>{{item.pkgResCount}}</span>）</span>
                    </div>
                </div> -->
          <!-- <div :class="['classroom-state',item.classroomStateBg]">
                    <img v-if="item.classroomState==='2'" src="static/image/teaching_package/state.gif" alt="">
                    <span>{{item.classroomStateName}}</span>
                </div> -->
          <div class="module_info">
            <div style="display: flex; justify-content: space-between">
              <div :title="item.name" class="classroom-name" style="text-align: left">{{ item.name }}</div>
              <!-- <div class="class-name" :title="item.className" style="font-size: 12px;text-align: right">{{item.className}}</div> -->
              <div class="class-name" style="font-size: 12px;text-align: right">{{ item.subjectProperty }}</div>
            </div>
            <div class="teacher-info-area">
              <div class="teacher-info">
                <div>
                  <img :src="item.teacherPic" class="teacher-pic">
                </div>
                <div class="right-teaching-info-detail">
                  <span>授课</span><br>
                  <span :title="item.teacherName" class="text-ellipsis name">{{ item.teacherName }}</span>
                </div>
              </div>
              <div class="teacher-info">
                <div>
                  <img :src="item.traineePic" class="teacher-pic">
                </div>
                <div class="right-teaching-info-detail">
                  <span>教辅</span><br>
                  <span :title="item.traineeName" class="text-ellipsis name">{{ item.traineeName }}</span>
                </div>
              </div>
            </div>
            <div class="classroom-other-info">
              <div class="other-info-item0">
                <div :title="item.className" class="subject-property-info">{{ item.className }}</div>
              </div>
              <div class="other-info-item2">
                <div class="classroom-study-num">
                  <i class="fa fa-user-circle icon-study-num" aria-hidden="true"/><span>{{ item.studyNum }}</span>人学习
                </div>
                <el-dropdown v-if="item.classroomState !== '3'" style="margin-top: 3px" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="fa fa-list-ul" style="font-size: 20px" @click.stop=""/>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeHandleCommand(6, item)" icon="el-icon-position">{{ item.isTop ? '取消置顶' : '置顶' }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div
                  v-if="false"
                  class="pull-down-btn"
                  style=""
                  @click.stop="showClassroomMember($event,index)">
                  <i class="fa fa-list-ul" style="font-size: 20px"/>
                  <ul
                    id="classroomMember"
                    :class="['changeTeach','classroomMember'+index,isClassroomPullDown?'changeTeach-bottom':'changeTeach-top']">
                    <li @click.stop="exitClassroom">退出</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- <div class="module_hidden">
                        <div class="classroom-intro">{{item.intro || '暂无简介'}}</div>
                        <div style="color: #fe9e41;font-size: 13px;width: 100%;padding: 5px 20px;text-align: left;display: flex">
                            <div style="width: 50%;overflow: hidden;height: 15px">为胜多负少</div>
                            <div style="width: 50%;overflow: hidden;height: 15px">废物Joe附件为我违反为为</div>
                        </div>
                    </div> -->
          </div>
          <!--<div class="classroom-student-state" v-show="(item.classroomTraineeState === 'N')">
                  <span>{{item.classroomTraineeStateName}}</span>
                </div>-->
        </div>
      </div>
      <div class="clear-both"/>
      <div >
        <pager
          v-if="pagerInfo.totalPage"
          :page-size-prop="pagerInfo.pageSizeProp"
          :curr-page="pagerInfo.currPage"
          :total-page="pagerInfo.totalPage"
          align="center"
          @changeIndex="changeIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { baseUrl, confirm, toast } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import Pager from '@/components/pager'
export default {
  name: 'LearningClassroom',
  components: {
    'header-nav': HeaderNav,
    'pager': Pager
  },
  filters: {

  },
  data() {
    return {
      isTeacher: false,
      myClassList: [], // 课堂列表
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 7, // 分页大小
        pageSize: 7// 分页大小
      },
      type: '我学的课',
      isClassroomPullDown: false,
      classroomState: '',
      teacherName: '',
      year: '',
      subjectName: '',
      yearList: [],
      releaseStatusList: [
        { value: '', label: '所有状态' },
        { value: '1', label: '未开始' },
        { value: '2', label: '进行中' },
        { value: '3', label: '已结束' }
      ]
    }
  },
  created() {
    const that = this
    window.eventBus.$on('eventBusReceivedMsgData', function(data) {
      that.handleMessBackData(data)
    })
  },
  mounted() {
    localStorage.setItem('isShowActMsgModal', 'false')
    if (localStorage.getItem('isFromMsgCommModal') && localStorage.getItem('isFromMsgCommModal') === 'true') {
      this.$router.push({
        path: '/teaching-center/teachingr-detail'
      })
      localStorage.setItem('isShowActMsgModal', 'true')
      localStorage.setItem('isFromMsgCommModal', 'false')
    }
    // 判断当前人的身份
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.isTeacher = userInfo.isTeacher
    this.getDates()
    this.getClassList()
  },
  methods: {
    beforeHandleCommand(command, value) {
      const obj = {
        command: command,
        item: value
      }
      return obj
    },
    handleCommand(command) {
      if (command.command === 6) {
        this.setTop(command.item)
      }
    },

    setTop(item) {
      const formData = new FormData()
      formData.append('ctId', item.ctId)
      formData.append('value', item.isTop ? 'N' : 'Y')
      this.$api.classroom.setTop(formData).then(res => {
        if (res.code === 0) {
          toast(res.msg)
          this.getClassList()
        }
      })
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function(res) {
      const that = this
      if (res.busitypeIndexNew === 16 || res.busitypeIndexNew === 17 || res.busitypeIndexNew === 18 || res.busitypeIndexNew === 19 || res.busitypeIndexNew === 24) { // 当申请加入某个课堂时  这个消息表示课堂创建者“通过”或者“不通过”了我的申请
        if (res.code === 0) {
          that.getClassList()
        }
      }
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      this.getClassList()
    },

    /**
         * 返回
         */
    toback: function() {
      this.$router.push('/begin-class')
    },

    // 显示/关闭课堂成员操作
    showClassroomMember: function(e, index) {
      const documentHeight = document.documentElement.clientHeight // 获取页面的高度
      const moreActionIconTop = e.target.getBoundingClientRect().y// 获取你点击时候的高度
      const dropdownHeight = $('#classroomMember').outerHeight()
      if ((documentHeight - moreActionIconTop) < (dropdownHeight + 30)) {
        this.isClassroomPullDown = false
      } else {
        this.isClassroomPullDown = true
      }
      for (let i = 0; i < this.myClassList.length; i++) {
        if (i !== index) {
          $('.classroomMember' + i).css('display', 'none')
        }
      }
      if ($('.classroomMember' + index).css('display') === 'block') {
        $('.classroomMember' + index).css('display', 'none')
      } else {
        $('.classroomMember').css('display', 'none')
        $('.classroomMember' + index).css('display', 'block')
      }
    },

    // 退出课堂操作
    exitClassroom() {
      confirm('您确定要退出当前课堂吗', () => {
        toast('人家还没实现此功能嘛 இ௰இ')
        /* let obj = {};
                this.$api.classroom.xxxxx(obj).then(res => {
                    if (res.code === 0){
                        let obj={
                            pageNum:this.pagerInfo.currPage,
                            pageSize:this.pagerInfo.pageSize,
                            type:"1"
                        }
                        this.getClassList(obj);
                    }
                    toast(res.msg);
                })*/
      })
    },

    // 获取所有课堂创建年份
    getDates() {
      const obj = {
        type: '1'
      }
      this.$api.classroom.getDates(obj).then(res => {
        if (res.code === 0) {
          this.yearList = res.data
          this.yearList.unshift({ joinYears: '' })
        }
      })
    },

    /**
         * 查询
         */
    toGetClassList() {
      this.pagerInfo.currPage = 1
      this.getClassList()
    },

    /**
         * 课堂列表
         */
    getClassList: function() {
      const obj = {
        classroomName: this.subjectName,
        year: this.year,
        teacherName: this.teacherName,
        classroomState: this.classroomState,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize,
        type: '1'
      }
      this.$api.classroom.listMyClassroom(obj).then(res => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.totalPage
          res.data.list.forEach(item => {
            // 图片路径处理
            item.pic = baseUrl + item.pic
            if (!(item.teacherPic.indexOf('https') !== -1 || item.teacherPic.indexOf('http') !== -1)) {
              item.teacherPic = baseUrl + item.teacherPic
            }
            if (!(item.traineePic.indexOf('https') !== -1 || item.traineePic.indexOf('http') !== -1)) {
              const traineePic = item.traineePic
              if (traineePic) {
                item.traineePic = baseUrl + traineePic
              }
            }
            if (item.classroomState === '2') {
              item.classroomStateBg = 'classroom-state-start'
            } else if (item.classroomState === '1') {
              item.classroomStateBg = 'classroom-state-nostart'
            } else {
              item.classroomStateBg = 'classroom-state-end'
            }
          })

          this.myClassList = res.data.list
        }
      })
    },

    /**
         * 进入课堂详情
         */
    toClassroomDetails: function(item) {
      // 我学的课中，如果此课需要审核，且未通过时
      if (item.isCheck === 'Y' && !item.isPass) {
        toast('此课堂老师还未通过你的申请，请耐心等待片刻')
        return false
      }
      // 如果课堂状态为3已结束，且accessState为N时，表示不再允许学生进入课堂！
      if (item.classroomState === '3' && item.accessState === 'N') {
        toast('课堂已结束，请与管理员联系！')
        return false
      }
      localStorage.setItem('classname', item.name) // 课堂名称
      localStorage.setItem('class_id', item.classId) // 班级主键
      localStorage.setItem('subjectId', item.subjectId) // 教材主键
      localStorage.setItem('ct_id', item.ctId) // 课堂主键
      localStorage.setItem('pkgId', item.pkgId) // 教学包主键
      localStorage.setItem('isShowActivityState', true)

      this.$router.push({
        path: '/teaching-center/teachingr-detail'
      })
    },

    /**
         * 点击跳转搜索学习课堂
         */
    toAddLearningCourses: function() {
      this.$router.push('/my/add-learning-courses')
    }
  }
}
</script>

<style scoped>
html,body{
    height: 100%;
}
  .teaching-one{
    width: 100%;
    margin-bottom:10px;
    cursor: pointer;
    height: 300px;
    position: relative;
    transition: all .3s ease;
    transition-property: all;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;
    box-shadow: 0 0 4px #cac6c6;
    border-radius: 2px;
  }
  .module_info{
    width: 100%;
    height: 138px;
    background: #ffffff;
    position: relative;
    z-index: 2;
  }
  .module_info:hover .module_hidden {
    display: inherit;
  }
  .module_hidden{
    width: 100%;
    height: 138px;
    background: rgba(0, 0, 0, .5);
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
  }

  /* ------------------------------课堂列表相关begin------------------------------ */
  #classroomMember  > li {
    height: 30px;
    line-height: 30px;
  }
  .changeTeach-bottom{
    top: 30px;
    left: -17px;
  }
  .classroom-student-state{
    position: absolute;
    top: 10px;
    left:-70px;
    width: 184px;
    height:22px;
    line-height:22px;
    font-size: 14px;
    text-align: center;
    transform: rotate(-45deg);
    background-color: #da0a25;
    color: #fff;
  }
  .classroom-all{
    width: 1200px;
    min-height: 550px;
    margin:20px auto;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    background: white
  }
  .display-flex{
    display:flex;
  }
  .classroom-area {
    width: 23%;
    padding: 5px 0px;
    float: left;
    /* margin-left: 20px; */
    margin: 5px 11px;
  }
  .classroom-all .classroom-item .teaching-one:hover{
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
        transition: .2s;
        /* box-shadow: 0 2px 8px #cac6c6; */
  }
  .classroom-all .classroom-item .teaching-one  .classroom-state{
      position: absolute;
      top: -10px;
      right: -10px;
      width: 80px;
      height: 35px;
      line-height: 22px;
      border-radius: 10px;
      transform:skewX(10deg);
      -webkit-transform:skewX(10deg);  /*兼容-webkit-引擎浏览器*/
      -moz-transform:skewX(10deg);/*兼容-moz-引擎浏览器*/
  }
  .classroom-state-title{
      position: absolute;
      display: flex;
      justify-content:center;
      top: 1px;
      right: -5px;
      width: 80px;
      height: 22px;
      color: #fff;
      font-size: 12px;
  }
  .classroom-state-title span{
    display: inline-block;
    line-height: 22px;
  }
  .classroom-all .classroom-item .teaching-one  .classroom-state-start{
      background-color: #da0a25;
  }
  .classroom-all .classroom-item .teaching-one  .classroom-state-end{
      background-color: #7f7f7f;
  }
  .classroom-all .classroom-item .teaching-one  .classroom-state-nostart{
       background-color: #3e69ed;
  }
  .classroom-all .classroom-item .teaching-one  .classroom-state > img{
      vertical-align: middle;
  }
  .area-border{
    border: 1px #a9a9a9 dashed;
    margin-top: 10px;
    height: 300px;
  }
  .classroom-tagname{
    width: 100%;
    text-align: left;
    font-size: 14px;
    margin: 20px
  }
  /* 返回 */
  .classroom-back{
    width: 100%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 课堂封面 */
  .classroom-img{
    width: 100%;
    height: 155px;
    overflow: hidden;
    border-radius: 10px 10px 0px 0px;
  }
  /* 课堂名称 */
  .classroom-name{
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 7px 0px 7px 15px;
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .class-name{
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 7px 15px 7px 0;
    height: 30px;
    line-height: 30px;
    width: 50px;
  }
  .class-name{
    font-size: 16px;
    overflow: hidden;
    padding: 7px 15px 7px 0;
    height: 30px;
    line-height: 30px;
    width: 50%;
  }
  /* 活动数、资源数 */
  .classroom-area-number {
    position: absolute;
    top: 125px;
    right: 0px;
    z-index: 10;
    margin-right: 5px;
    display: flex
  }
  .classroom-area-nums{
    padding: 2px 4px;
    font-size: 12px;
    margin-right: 5px;
    color: white;
    background-color: #3e69ed;
  }
  .icon-study-num{
    margin-right: 10px
  }
  /* 教师、助教 */
  .teacher-info-area{
    display: flex;
    font-size: 12px;
    overflow: hidden;
    padding-top: 10px;
    width: 90%;
    margin: auto;
  }
  .teacher-info{
    display: flex;
  }
  .teacher-info .right-teaching-info-detail{
    padding-top: 8px;
    text-align: left;
    padding-left: 4px;
  }
  .teacher-info .right-teaching-info-detail > span{
      display: inline-block;
  }
  .teacher-info .right-teaching-info-detail > .name{
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 头像 */
  .teacher-pic{
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 1px solid #959da0;
  }
  /* 学习人数、必修 */
  .classroom-other-info{
    display: flex;
    margin-top: 18px;
    font-size: 12px
  }
  .other-info-item0{
    width: 50%;
    line-height: 30px;
  }
  .other-info-item2{
    width: 50%;
    line-height: 30px;
    display: flex
  }
  .classroom-study-num{
    width: 70%;
    overflow: hidden;
    font-size: 13px
  }
  .subject-property-info{
    float: left;
    margin-left: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 简介 */
  .classroom-intro{
    color: white;
    font-size: 13px;
    width: 100%;
    height: 80px;
    padding: 10px 20px;
    text-align: left;
    overflow: hidden
  }
  /* 新增课堂 */
  .to-add-classroom{
    cursor: pointer;
    margin:110px auto 10px;
  }

  .clear-both{
    clear: both
  }
  .no-classroom-hint > p{
      color: #959595;
      padding:20px 0;
  }
  /* ------------------------------课堂列表相关end------------------------------ */

  .my-teaching-nav{
    min-height: 50px !important;
    margin: 20px auto;
    background-color: #fff;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    padding-bottom: 20px;
  }
  .my-teaching-search{
    display: flex;
  }
</style>
