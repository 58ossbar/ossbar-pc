<!-- 我教的课的显示页面 -->
<template>
  <div class="backgroundColorGrey" >
    <header-nav :current-index="4" />
    <div class="my-teaching-nav wind-1240">
      <div class="display-flex">
        <div class="location">
          <div class="localtion-title"><b>当前位置:</b></div>
          <ul class="localtion-list">
            <li class="localtion-item" style="cursor: pointer" @click="toback()">
              管理看板
            </li>
            <li class="localtion-item">
              <span>教学中心</span>
            </li>
            <li class="localtion-item">
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
        <el-select v-model="classroomState" size="medium" style="margin-left:20px;" placeholder="请选择课堂状态" @change="toGetClassList">
          <el-option
            v-for="item in releaseStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="year" size="medium" style="margin-left:20px;" placeholder="请选择课堂年份" @change="toGetClassList">
          <el-option
            v-for="item in yearList"
            :key="item.createYears"
            :label="item.createYears ? item.createYears : '所有年份'"
            :value="item.createYears"/>
        </el-select>
        <el-input
          v-model="classroomName"
          size="medium"
          placeholder="请输入课堂名称"
          style="width:20%;margin-left:2%;"
          clearable
          @keyup.enter.native="toGetClassList"/>
        <!--<el-input
          size="medium"
          placeholder="请输入课程名称"
          v-model="subjectName"
          @keyup.enter.native="toGetClassList"
          style="width:20%;margin-left:2%;"
          clearable>
        </el-input>-->
        <!-- <el-input
          placeholder="请输入年份"
          v-model="year"
          @keyup.enter.native="getClassList"
          style="width:20%;margin-left:2%;"
          clearable>
        </el-input> -->
        <el-button type="primary" icon="el-icon-search" style="margin-left:2%;" size="medium" @click="toGetClassList">搜索</el-button>
      </div>

    </div>
    <div class="classroom-all">
      <!-- <div class="display-flex">
            <div class="location">
                <div class="localtion-title"><b>当前位置:</b></div>
                <ul class="localtion-list">
                    <li class="localtion-item" @click="toback()" style="cursor: pointer">
                        管理看板
                    </li>
                    <li class="localtion-item">
                       <span style="color: #959da0">{{type}}</span>
                    </li>
                </ul>
            </div>
            <div class="classroom-back">
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"></i>
                <span @click="toback()">返回</span>
            </div>
        </div> -->
      <div class="classroom-area area-border">
        <img title="新建课堂" src="../../../static/image/addClassromm.png" class="to-add-classroom" @click="toaddclassroom()">
        <div style="color: #959da0">新建课堂</div>
      </div>
      <div
        v-for="(item, index) in myClassList"
        :key="index"
        class="classroom-area classroom-item">
        <div class="teaching-one-room" style="border-radius: 10px 10px 0px 0px;" @click="toClassroomDetails(item)">
          <div style="overflow: hidden;position: relative;border-top-right-radius: 10px;">
            <img :src="item.pic" class="classroom-img">
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
            <div v-if="item.ifLiveLesson === 'Y'" class="classroom-live-title classroom-live">
              <span>直播课</span>
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

          <div class="module_info">
            <div style="display: flex; justify-content: space-between">
              <div :title="item.name" class="classroom-name" style="text-align: left">{{ item.name }}</div>
              <div class="class-name" style="font-size: 12px;text-align: right">{{ item.subjectProperty }}</div>
            </div>
            <div class="teacher-info-area">
              <div class="teacher-info">
                <img :src="item.teacherPic" class="teacher-pic">
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
              <div class="other-info-item1">
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
                    <el-dropdown-item v-if="item.classroomState === '1'" :command="beforeHandleCommand(1,item)" icon="el-icon-video-play">开始</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(2,item)" icon="el-icon-edit">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="item.classroomState === '2'" :command="beforeHandleCommand(3,item)" icon="el-icon-video-pause">结束</el-dropdown-item>
                    <el-dropdown-item v-if="item.classroomState === '1'" :command="beforeHandleCommand(4,item)" icon="el-icon-delete">删除</el-dropdown-item>
                    <el-dropdown-item v-if="item.ifLiveLesson === 'Y'" :command="beforeHandleCommand(5,item)" icon="el-icon-delete">进入直播</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(6, item)" icon="el-icon-position">{{ item.isTop ? '取消置顶' : '置顶' }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <div
                              v-if="item.classroomState !== '3'"
                              class="pull-down-btn"
                              style="margin-top: 3px"
                              @click.stop="showClassroomMember($event,index)">
                              <i class="fa fa-list-ul" style="font-size: 20px"></i>
                              <ul
                                id="classroomMember"
                                :class="['changeTeach','classroomMember'+index,isClassroomPullDown?'changeTeach-bottom':'changeTeach-top']">
                                <li @click.stop="startClassroom(item)" v-if="item.classroomState === '1'">开始</li>
                                <li @click.stop="editClassroom(item)">编辑</li>
                                <li @click.stop="endClassroom(item)" v-if="item.classroomState === '2'">结束</li>
                                <li @click.stop="deleteClassroom(item)" v-if="item.classroomState === '1'">删除</li>
                              </ul>
                            </div> -->
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
  name: 'Classroom',
  components: {
    'header-nav': HeaderNav,
    'pager': Pager
  },
  filters: {

  },
  data() {
    return {
      myClassList: [], // 课堂列表
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 7, // 分页大小
        pageSize: 7// 分页大小
      },
      type: '我教的课',
      isClassroomPullDown: true, // 是否显示课堂操作
      classroomState: '',
      teacherName: '',
      year: '',
      subjectName: '',
      classroomName: '',
      yearList: [],
      releaseStatusList: [
        { value: '', label: '所有状态' },
        { value: '1', label: '未开始' },
        { value: '2', label: '进行中' },
        { value: '3', label: '已结束' }
      ]
    }
  },
  mounted() {
    this.getDates()
    this.getClassList()
  },
  methods: {
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用课堂查询方法
      this.getClassList()
    },

    /**
         * 返回
         */
    toback: function() {
      this.$router.push('/begin-class')
    },

    /**
         * 返回新的command对象
         */
    beforeHandleCommand(command, value) {
      const obj = {
        command: command,
        item: value
      }
      return obj
    },

    /**
         * 下拉菜单列表的事件触发
         */
    handleCommand(command) {
      if (command.command === 1) {
        this.startClassroom(command.item)
      } else if (command.command === 2) {
        this.editClassroom(command.item)
      } else if (command.command === 3) {
        this.endClassroom(command.item)
      } else if (command.command === 4) {
        this.deleteClassroom(command.item)
      } else if (command.command === 5) {
        console.log(command.item.linkUrl)
        window.open(command.item.linkUrl, '_blank')
      } else if (command.command === 6) {
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
        name: this.subjectName,
        classroomName: this.classroomName,
        year: this.year,
        teacherName: this.teacherName,
        classroomState: this.classroomState,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize,
        type: '2'
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
            // 课堂状态背景颜色显示处理
            if (item.classroomState === '2') { // 进行中
              item.classroomStateBg = 'classroom-state-start'
            } else if (item.classroomState === '1') { // 未开始
              item.classroomStateBg = 'classroom-state-nostart'
            } else { // 已结束
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
      // 如果课堂状态为3已结束，且accessState为N时，表示不再允许进入课堂！
      if (item.classroomState === '3' && item.accessState === 'N') {
        toast('账户已停用，请与系统管理员联系！')
        return false
      }
      localStorage.setItem('classname', item.name) // 课堂名称
      localStorage.setItem('class_id', item.classId) // 班级主键
      localStorage.setItem('subjectId', item.subjectId) // 教材主键
      localStorage.setItem('ct_id', item.ctId) // 课堂主键
      localStorage.setItem('pkgId', item.pkgId) // 教学包主键
      localStorage.setItem('isShowActivityState', true)
      this.$store.commit('setReleaseStatus', item.releaseStatus)
      this.$router.push({
        path: '/teaching-center/teachingr-detail'
      })
    },

    // 获取所有课堂创建年份
    getDates() {
      const obj = {
        type: '2'
      }
      this.$api.classroom.getDates(obj).then(res => {
        if (res.code === 0) {
          this.yearList = res.data
          this.yearList.unshift({ createYears: '' })
        }
      })
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

    /**
         *  开始课堂
         */
    startClassroom(item) {
      confirm('确认开始课堂 【' + item.name + '】吗', () => {
        // 调用开始课堂接口
        this.$api.classroom.startClassroom(item.ctId).then(res => {
          if (res.code === 0) {
            // 刷新所有显示课堂信息
            this.getClassList()
          }
          toast(res.msg)
        })
      })
    },

    /**
         *  编辑课堂
         */
    editClassroom(item) {
      this.$router.push({
        path: '/my/add-classroom',
        query: { isEdit: 'true', classroom: item }
      })
    },

    /**
         *  结束课堂
         */
    endClassroom(item) {
      confirm('确认结束课堂 【' + item.name + '】吗', () => {
        // 调用结束课堂接口
        this.$api.classroom.endClassroom(item.ctId).then(res => {
          if (res.code === 0) {
            // 刷新所有显示课堂信息
            this.getClassList()
          }
          toast(res.msg)
        })
      })
    },

    /**
         *  删除课堂
         */
    deleteClassroom(item) {
      confirm('确认删除课堂 【' + item.name + '】吗', () => {
        // 调用删除课堂接口
        this.$api.classroom.deleteClassroom(item.ctId).then(res => {
          if (res.code === 0) {
            // 刷新所有显示课堂信息
            this.getClassList()
          }
          toast(res.msg)
        })
      })
    },

    /**
         * 点击开设课堂
         */
    toaddclassroom: function() {
      const isTeacher = localStorage.getItem('isTeacher')
      if (isTeacher !== 'Y') {
        toast('还未开通新建【课堂】授权，请联系管理员！')
        return false
      }
      // this.$router.push("/my/add-classroom");
      this.$router.push({
        path: '/my/add-classroom'
        /* query: {isEdit: 'false'},*/
      })
    }
  }
}
</script>

<style scoped>
html,body{
    height: 100%;
}
  .teaching-one-room{
    width: 100%;
    margin-bottom:10px;
    cursor: pointer;
    height: 300px;
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
  /*.changeTeach-top{
    top: 20px;
  }*/
  .classroom-student-state{
    position: absolute;
    top: 14px;
    left:-65px;
    width: 184px;
    height:30px;
    line-height:30px;
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
  .classroom-all .classroom-item .teaching-one-room:hover{
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
      transition: .2s;
      z-index: 501;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-state{
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
  .classroom-all .classroom-item .teaching-one-room  .classroom-state-title{
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
  .classroom-all .classroom-item .teaching-one-room  .classroom-live-title{
    position: absolute;
    display: flex;
    justify-content:center;
    top: 1px;
    left: -5px;
    width: 80px;
    height: 22px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
  }
  .classroom-live-title span{
    display: inline-block;
    line-height: 22px;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-live{
    background-color: #da0a25;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-state-start{
      background-color: #da0a25;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-state-end{
      background-color: #7f7f7f;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-state-nostart{
       background-color: #3e69ed;
  }
  .classroom-all .classroom-item .teaching-one-room  .classroom-state > img{
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
    color: #158aeb;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 课堂封面 */
  .classroom-img{
    width: 100%;
    height: 155px;
    border-radius: 10px 10px 0 0;
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
    background-color:#3e69ed;
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
    padding-left: 4px;
    text-align: left;
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
  .other-info-item1{
    width: 50%;
    line-height: 30px;
  }
  .other-info-item2{
    width: 50%;
    display: flex
  }
  .classroom-study-num{
    width: 70%;
    font-size: 13px;
    line-height: 30px;
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
