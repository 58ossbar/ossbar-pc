<!-- 辅教视频 的显示页面 -->
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
        <el-select v-model="filterInfo.type" size="medium" style="margin-left:20px;" placeholder="请选择视频分类" clearable @change="toGetVideoList">
          <el-option
            v-for="item in videoTypeList"
            :key="item.dictCode"
            :label="item.dictValue"
            :value="item.dictCode"/>
        </el-select>

        <!-- <el-select size="medium" v-model="filterInfo.ctIdList" @change="toGetVideoList" style="margin-left:20px;" placeholder="请选择视频所属课堂" multiple filterable  collapse-tags clearable>
          <el-option
            v-for="item in videoClasslist"
            :key="item.ctId"
            :label="item.classroomName"
            :value="item.ctId">
          </el-option>
        </el-select>-->

        <el-input
          v-model="filterInfo.title"
          size="medium"
          placeholder="请输入视频名称"
          style="width:20%;margin-left:2%;"
          clearable
          @keyup.enter.native="toGetVideoList"/>

        <el-button type="primary" icon="el-icon-search" style="margin-left:2%;" size="medium" @click="toGetVideoList">搜索</el-button>
      </div>

    </div>
    <div class="classroom-all">
      <div class="classroom-area area-border">
        <img title="上传视频" src="../../../static/image/addClassromm.png" class="to-add-classroom" @click="toAddVideo()">
        <div style="color: #959da0">上传视频</div>
      </div>
      <div
        v-for="(item, index) in myVideoList"
        :key="index"
        class="classroom-area classroom-item">
        <div class="teaching-one-room" style="border-radius: 10px 10px 0px 0px;" @click="openVideo(item)">
          <div style="overflow: hidden;position: relative;border-top-right-radius: 10px;">
            <!--<img :src="item.firstCaptureAccessUrl" class="classroom-img">-->
            <video :src="item.name" controls="controls" class="classroom-img"/>
            <div class="classroom-type-title">
              <span>{{ item.type }}</span>
            </div>
          </div>

          <div class="module_info">
            <div style="display: flex; justify-content: space-between">
              <div :title="'视频名称'" class="classroom-name">{{ item.title }}</div>
            </div>
            <div class="classroom-other-info">
              <div class="other-info-item1">
                <div :title="item.userName" class="subject-property-info">{{ item.userName }} 上传</div>
              </div>
              <div v-if="item.isCreator" class="other-info-item2">
                <!-- <div class="classroom-study-num">
                                <i class="fa fa-user-circle icon-study-num" aria-hidden="true"></i><span>{{item.studyNum}}</span>人学习
                            </div> -->
                <el-dropdown style="margin-top: 3px" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="fa fa-list-ul" style="font-size: 20px" @click.stop=""/>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeHandleCommand(1,item)" icon="el-icon-edit">编辑</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(2,item)" icon="el-icon-delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

              </div>
            </div>

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
import { baseUrl, confirm, toast } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import Pager from '@/components/pager'
export default {
  name: 'AuxiliaryTeachingVideoHome',
  components: {
    'header-nav': HeaderNav,
    'pager': Pager
  },
  filters: {
  },
  data() {
    return {
      type: '辅教视频库', // 当前页面名称
      filterInfo: {
        type: '', // 分类
        title: '', // 名称
        ctIdList: [] // 所属课堂
      }, // 搜索条件
      videoTypelist: [], // 视频分类列表
      videoClasslist: [], // 视频 所属课堂列表
      myVideoList: [], // 视频列表
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 7, // 分页大小
        pageSize: 7// 分页大小
      }
    }
  },
  mounted() {
    this.getVideoTypelist()
    this.getVideoClasslist()
    this.getMyVideoList()
  },
  methods: {
    /** 预览视频 */
    openVideo(item) {
      this.$videoPreview(item.url)
    },
    /** 返回 */
    toback: function() {
      this.$router.push('/begin-class')
    },
    /** 查询 */
    toGetVideoList() {
      this.pagerInfo.currPage = 1
      this.getMyVideoList()
    },
    // 获取 视频 分类 列表
    getVideoTypelist() {
      this.videoTypelist = [
        { dictCode: '1', dictValue: '公共' },
        { dictCode: '2', dictValue: '职业素养类' },
        { dictCode: '3', dictValue: '课间类' },
        { dictCode: '4', dictValue: '励志类' },
        { dictCode: '5', dictValue: '演讲类' }
      ]
      this.$api.video.getVideoTypeList({}).then((res) => {
        if (res.code === 0) {
          this.videoTypeList = res.data
          this.videoTypeList.unshift({ dictCode: '', dictValue: '全部' })
        }
      })
    },
    // 获取 视频 所属课堂 列表
    getVideoClasslist() {
      // let obj = {}
      // this.$api.classroom.getDates(obj).then(res => {
      // if (res.code === 0) {
      this.videoClasslist = [
        { ctId: '1', classroomName: 'java就业班1' },
        { ctId: '2', classroomName: 'java就业班2' },
        { ctId: '3', classroomName: 'java就业班3' },
        { ctId: '4', classroomName: 'java就业班4' },
        { ctId: '5', classroomName: 'java就业班5' }
      ] // res.data
      // this.videoClasslist.unshift({ctId: '', classroomName: '所有课堂'})
      // }
      // })
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用课堂查询方法
      this.getMyVideoList()
    },
    /** 返回新的command对象 */
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
        this.editVideo(command.item)
      } else if (command.command === 2) {
        this.deleteVideo(command.item)
      }
    },

    /**
         * 课堂列表
         */
    getMyVideoList: function() {
      let obj = {
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize
      }
      obj = { ...obj, ...this.filterInfo }
      this.$api.video.queryVideoList(obj).then(res => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.totalPage
          const list = res.data.list || [
            { name: '视频1', url: '/uploads/video/2a855dff-149b-41bc-82a3-25bb33452830.mp4', type: '11', ctidList: '课堂1' },
            { name: '视频2', url: '/uploads/video/2a855dff-149b-41bc-82a3-25bb33452830.mp4', type: '11', ctidList: '课堂1' },
            { name: '视频3', url: '/uploads/video/2a855dff-149b-41bc-82a3-25bb33452830.mp4', type: '11', ctidList: '课堂1' }, { name: '视频4', url: '/1.png', type: '11', ctidList: '课堂1' },
            { name: '视频5', url: '/uploads/video/2a855dff-149b-41bc-82a3-25bb33452830.mp4', type: '11', ctidList: '课堂1' }
          ]
          list.forEach(item => {
            item.name = baseUrl + item.name
            item.firstCaptureAccessUrl = baseUrl + item.firstCaptureAccessUrl
            // 图片路径处理
            if (item.url && item.url.indexOf('://') < 0) {
              item.url = baseUrl + item.url
            }
          })
          this.myVideoList = list
        }
      })
    },
    /** 编辑视频 */
    editVideo(item) {
      item.isEdit = 'true'
      localStorage.setItem('videoInfo', JSON.stringify(item))
      this.$router.push({
        path: '/auxiliary-teaching-video/add-auxiliary-teaching-video',
        query: { isEdit: 'true', videoInfo: item }
      })
      /*
      const obj = this.$router.resolve({
        path: `/auxiliary-teaching-video/add-auxiliary-teaching-video/${item.videoId}`
      })
      window.open(obj.href, '_self')
      */
    },

    /**
     * 删除视频
     */
    deleteVideo(item) {
      confirm('确认删除视频 【' + item.title + '】吗', () => {
        const formData = new FormData()
        formData.append('videoId', item.videoId)
        this.$api.video.deleteVideo(formData).then(res => {
          if (res.code === 0) {
            this.getMyVideoList()
          }
          toast(res.msg)
        })
      })
    },

    /**
     * 点击新增视频
     * @returns {boolean}
     */
    toAddVideo: function() {
      // toast('此功能暂未开放')
      // return false

      localStorage.removeItem('videoInfo')
      const isTeacher = localStorage.getItem('isTeacher')
      if (isTeacher !== 'Y') {
        toast('还未开通上传【视频】授权，请联系管理员！')
        return false
      }
      this.$router.push({
        path: '/auxiliary-teaching-video/add-auxiliary-teaching-video'
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
    height: 260px;
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
    height: 75px;
    /*background: #ffffff;*/
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
  .classroom-all .classroom-item .teaching-one-room .classroom-type-title{
    position: absolute;
    display: flex;
    justify-content:center;
    padding: 0 15px;
    box-sizing: border-box;
    top: 1px;
    right: -5px;
    width: auto;
    height: 22px;
    color: #fff;
    font-size: 12px;
  }
  .classroom-type-title span{
    display: inline-block;
    line-height: 22px;
    z-index: 10;
  }
  .classroom-all .classroom-item .teaching-one-room .classroom-type-title::before{
    content: '';
    z-index: 6;
    position: absolute;
    top: -10px;
    right: -4px;
    width: 100%;
    height: 35px;
    line-height: 22px;
    border-radius: 10px;
    background-color: #da0a25;
    transform:skewX(10deg);
    -webkit-transform:skewX(10deg);  /*兼容-webkit-引擎浏览器*/
    -moz-transform:skewX(10deg);/*兼容-moz-引擎浏览器*/
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
    height: 260px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
    height: 185px;
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
    text-align: left;
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
    margin-top: 7px;
    font-size: 12px
  }
  .other-info-item1{
    width: 85%;
    line-height: 30px;
  }
  .other-info-item2{
    width: 15%;
    padding-left: 10px;
    box-sizing: border-box;
    display: flex
  }
  .classroom-study-num{
    width: 70%;
    font-size: 13px;
    line-height: 30px;
  }
  .subject-property-info{
    text-align: left;
    width: 97%;
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
    margin-bottom: 10px;
    /* margin:110px auto 10px; */
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
