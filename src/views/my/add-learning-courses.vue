<!-- 输入邀请码加入课堂页面 -->
<template>
  <div class="join-classroom-box backgroundColorGrey">
    <header-nav :current-index="6" />
    <div class="join-classroom">
      <!-- 头部标题开始 -->
      <div style="display: flex">
        <div style="width: 100%;text-align: left;margin: 20px" >加入课堂</div>
        <div style="width: 100%;text-align: right;font-size: 14px;margin: 20px;cursor: pointer;color: #158aeb" >
          <i class="fa fa-angle-left" aria-hidden="true" style="font-size: 14px;margin-right: 5px" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <!-- 头部标题结束 -->
      <!-- 分割线 -->
      <div style="width: 1200px;height: 1px;background: #e0e0e0"/>
      <!-- 内容开始 -->
      <div style="width: 1200px">
        <!-- 邀请码区域 -->
        <div class="join-classroom-code">
          <div class="code-title">课堂邀请码</div>
          <div class="code-input">
            <input
              id="code"
              type="text"
              class="form-control invite-code"
              placeholder="请输入课堂邀请码"
              maxlength="100"
              @input="descInput">
          </div>
        </div>
        <!-- 滑块区域 -->
        <div class="join-classroom-slider">
          <div class="slider-title">滑动验证</div>
          <drag-verify
            ref="Verify"
            :width="width"
            :height="height"
            :text="text"
            :success-text="successText"
            :background="background"
            :progress-bar-bg="progressBarBg"
            :completed-bg="completedBg"
            :handler-bg="handlerBg"
            :handler-icon="handlerIcon"
            :text-size="textSize"
            :success-icon="successIcon"
            :circle="circle"
            style="margin-left: 15px;"
            @passcallback="backClick"/>
        </div>
        <!-- 课堂显示区域 -->
        <div
          v-for="(item, index) in ClassList"
          :key="index"
          class="join-classroom-class">
          <div class="classroom-area classroom-item">
            <div class="teaching-one">
              <img :src="item.pic" class="classroom-pic">
              <div class="module_info">
                <div class="classroom-name">{{ item.name }}</div>
                <div class="teacher-info-area">
                  <div class="teacher-info">
                    <div>
                      <img :src="item.teacherPic" class="teacher-pic">
                    </div>
                    <div class="right-teaching-info-detail">
                      <span>授课</span><br>
                      <span class="text-ellipsis name">{{ item.teacherName }}</span>
                    </div>
                  </div>
                  <div class="teacher-info">
                    <div>
                      <img :src="item.traineePic" class="teacher-pic">
                    </div>
                    <div class="right-teaching-info-detail">
                      <span>教辅</span><br>
                      <span class="text-ellipsis name">{{ item.traineeName }}</span>
                    </div>
                  </div>
                </div>
                <div class="classroom-other-info">
                  <div class="other-info-item1">{{ item.orgIdTeacher }}</div>
                  <div class="other-info-item2">
                    <div class="classroom-study-num">
                      <i class="fa fa-user-circle icon-study-num" aria-hidden="true"/><span>{{ item.studyNum }}</span>人学习
                    </div>
                    <div class="subject-property-info">{{ item.subjectProperty }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="class-button">
              <b-button type="button" variant="primary" style="width: 360px; height: 40px" @click="joinClassroom(item.ctId, item)">加入课堂</b-button>
            </div>
          </div>
        </div>
        <!-- 错误查询提示信息区域 -->
        <div v-if="ClassList.length <= 0" style="height: 300px">
          <div v-show="showGroup" class="no-class">
            邀请码有误，查无此课堂！
          </div>
        </div>
      </div>
      <!-- 内容结束 -->
    </div>
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import { baseUrl, toast, alert } from '@/utils/global'
import HeaderNav from '@/components/header-nav'
import dragVerify from 'vue-drag-verify'
export default {
  name: 'AddLearningCourses',
  components: {
    'header-nav': HeaderNav,
    'drag-verify': dragVerify
  },
  data() {
    return {
      // 滑块的属性
      handlerIcon: 'fa fa-angle-double-right',
      successIcon: 'fa fa-check',
      background: '#cccccc',
      progressBarBg: '#4b0',
      completedBg: '#66cc66',
      handlerBg: '#fff',
      text: '请按住滑块，拖动到最右侧',
      successText: '验证成功',
      width: 360,
      height: 38,
      textSize: '14px',
      circle: false,
      ClassList: [], // 课堂列表
      showGroup: false // 提示的显示和隐藏
    }
  },
  watch: {

  },
  methods: {
    // 初始化
    initData() {

    },
    descInput() {
      this.circle = false
    },
    // 返回事件
    toback: function() {
      this.$router.push('/my/learning-classroom')
    },
    // 滑块 验证 重置方法
    dragVerifyReset() {
      if (this.$refs.Verify != undefined) {
        this.$refs.Verify.isPassing = false

        //  const oriData = this.$options.data();
        // for (const key in oriData) {
        //   if (oriData.hasOwnProperty(key)) {
        //     this.$set(this, key, oriData[key]);
        //   }
        // }
        var handler = this.$refs.Verify.$refs.handler
        var message = this.$refs.Verify.$refs.message
        var progressBar = this.$refs.Verify.$refs.progressBar

        handler.style.left = '0'
        progressBar.style.width = '0'

        handler.classList.remove('dv_handler_ok_bg')
        handler.children[0].className = this.handlerIcon
        progressBar.style.background = this.progressBarBg
        message.style.color = '#444'

        // message.style["-webkit-text-fill-color"] = "transparent";
        // message.style.animation = "slidetounlock 3s infinite";

        // this.$refs.Verify.reset();
      }
    },
    // 滑块验证成功
    backClick() {
      const inviteCode = $('.invite-code').val()
      if (inviteCode) {
        const obj = { 'invitationCode': inviteCode }
        this.getClassroom(obj)
      } else {
        alert('请输入邀请码')
        setTimeout(() => {
          this.dragVerifyReset()
        }, 800)
      }
    },
    // 根据邀请码获得对应的课堂信息
    getClassroom(data) {
      this.$api.addLearningCourses.serachClassroom(data).then(res => {
        if (res.data) {
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
          })
          this.ClassList = res.data.list
          if (this.ClassList.length <= 0) {
            this.showGroup = true
            setTimeout(() => {
              this.dragVerifyReset()
            }, 800)
          }
        }
      })
    },
    // 加入课堂操作
    joinClassroom(ctId, item) {
      const obj = { 'ctId': ctId }
      this.joinTheClassroom(obj, item)
    },
    // 加入课堂事件
    joinTheClassroom(data, item) {
      this.$api.addLearningCourses.joinTheClassroom(data).then(res => {
        if (res.code === 0) {
          if (res.data.code && res.data.code === 520) {
            if (res.data.msg) {
              toast(res.data.msg, () => {
                this.$router.push('/my/learning-classroom')
              })
            }
          } else {
            if (res.msg) {
              toast(res.msg, () => {
                localStorage.setItem('classname', item.name) // 课堂名称
                localStorage.setItem('class_id', res.data.classId) // 班级主键
                localStorage.setItem('subjectId', res.data.subjectId) // 教材主键
                localStorage.setItem('ct_id', res.data.ctId) // 课堂主键
                localStorage.setItem('pkgId', res.data.pkgId) // 教学包主键
                localStorage.setItem('isShowActivityState', true)

                this.$router.push({
                  path: '/teaching-center/teachingr-detail'
                })
              })
            } else {
              localStorage.setItem('classname', item.name) // 课堂名称
              localStorage.setItem('class_id', res.data.classId) // 班级主键
              localStorage.setItem('subjectId', res.data.subjectId) // 教材主键
              localStorage.setItem('ct_id', res.data.ctId) // 课堂主键
              localStorage.setItem('pkgId', res.data.pkgId) // 教学包主键
              localStorage.setItem('isShowActivityState', true)

              this.$router.push({
                path: '/teaching-center/teachingr-detail'
              })
            }
          }
        } else {
          toast(res.msg)
        }
      })
    }
  }
}

</script>

<style scoped>
    .join-classroom-box .join-classroom{
        width: 1200px;
        height: 100%;
        margin:20px auto;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 10px;
        background: white;
    }
    .join-classroom-slider, .join-classroom-code{
      display: flex;
      justify-content: center;
    }
    .code-title, .slider-title{
      line-height: 38px;
      width: 10%;
      text-align: right;
    }
    /*课堂邀请码区域*/
    .join-classroom-code{
      padding-top: 30px;
    }
    .code-title{
      font-weight: bold;
    }
    .code-input{
      width: 30%;
      margin-left: 15px;
    }
    .code-input input{
      text-align: center;
      font-size: 14px;
      height: 38px;
    }
    /*滑块区域*/
    .join-classroom-slider{
      padding-top: 20px;
    }
    drag-verify {

    }
    /*----------------------------  课堂显示区域开始 --------------------------------*/
    .join-classroom-class{
      display: flex;
      justify-content: center;
    }
    /* 学习人数、必修 */
    .classroom-other-info{
      display: flex;
      margin-top: 18px;
      font-size: 12px
    }
    .other-info-item1{
      width: 50%;
    }
    .other-info-item2{
      width: 50%;
      display: flex
    }
    .classroom-study-num{
      width: 70%;
      overflow: hidden;
      font-size: 13px
    }
    .subject-property-info{
      width: 30%;
      float: right;
      margin-right: 10px;
      overflow: hidden
    }
    /* 课堂封面 */
    .classroom-pic{
      width: 100%;
      height: 155px;
    }
    /* 课堂名称 */
    .classroom-name{
      font-size: 14px;
      overflow: hidden;
      padding: 7px 0;
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
      width: 50%;
      display: flex;
      margin: 0 4px;
    }
    .teacher-info .right-teaching-info-detail > span{
      display: inline-block;
    }
    .teacher-info .right-teaching-info-detail > .name{
      width: 80px;
    }
    /* 头像 */
    .teacher-pic{
      width: 50px;
      height: 50px;
      border-radius: 25px
    }
    .classroom-area {
      width: 30%;
      padding: 5px 0px;
      margin: 20px 0 0 130px;
    }
    .classroom-all .classroom-item .teaching-one:hover{
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
      transform: translateY(-8px);
      transition: .2s;
      /* box-shadow: 0 2px 8px #cac6c6; */
    }
    .classroom-all .classroom-item .teaching-one {
      position: absolute;
      top: 5px;
      right: 10px;
      width: 70px;
      height: 22px;
      line-height: 22px;
      color: #fff;
      font-size: 12px;
      border-radius: 15px;
    }
    .classroom-all .classroom-item .teaching-one  .classroom-state-start{
      background-color: #3e69ed;
    }
    .classroom-all .classroom-item .teaching-one  .classroom-state-end{
      background-color: #7f7f7f;
    }
    .classroom-all .classroom-item .teaching-one  .classroom-state-nostart{
      background-color: #da0a25;
    }
    .classroom-all .classroom-item .teaching-one  .classroom-state > img{
      vertical-align: middle;
    }
    .teaching-one{
      width: 100%;
      margin-bottom:10px;
      cursor: pointer;
      height: 300px;
      position: relative;
      overflow: hidden;
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
    .module_info:hover {
      display: inherit;
    }
    /*加入课堂按钮样式*/
    .class-button{
      margin: 0 0 30px 0;
    }
    /*没有课堂提升样式*/
    .no-class{
      height: 50px;
      color: red;
      line-height: 50px;
      margin-top: 40px;
    }
    /*----------------------------  课堂显示区域结束 --------------------------------*/
</style>
