<!-- 我要学习上方悬浮的头部组件 -->
<template>
  <div class="header-nav">
    <div class="header-nav-fixed">
      <div class="nav-con wind-1240">
        <div class="nav-logo">
          <img src="static/image/indexLog.png">
        </div>
        <div class="nav-menu">
          <router-link
            v-for="(item,index) in routerList"
            :key="index"
            :to="{path:item.path}"
            :class="['menu-item',currentIndex===item.id?'active':'']"
            tag="div">{{ item.pathName }}</router-link>
            <!-- <router-link :to="{path:'/TeachingCenter'}" tag="div" class="menu-item">教学中心</router-link> -->
            <!-- <router-link :to="{path:'/TestingCenter'}" tag="div" class="menu-item">评测中心</router-link>
                  <router-link :to="{path:'/'}" tag="div" class="menu-item">返回首页</router-link> -->
        </div>
        <!--<div class="nav-seach">
                  <input  type="text" v-model="userInputSearch" placeholder="教学包，图书教材">
                  <img v-show="userInputSearch===''?false:true" @click="handleUserInput" class="del-search-input" src="static/image/del_1.png" alt="删除" title="删除">
                  <img  class="search" src="static/image/search_1.png" alt="搜索" title="搜索">
              </div>-->
        <!--已登录-->
        <div v-if="showUserName" style="display: flex; width: 100px; margin-left: 20%">
          <div class="btn-group">
            <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="display: flex;cursor: pointer">
              <img :src="userImg" width="40" height="40" style="border-radius: 50%;margin: 0 30px">
              <div style="height: 40px;line-height: 37px;font-size: 16px;margin-left: -20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color: white">{{ userName }}</div>
            </div>
            <div class="dropdown-menu" style="width: 300px;margin-left: -75px">
              <div class="userInfo">
                <img :src="userImg" width="50" height="50" style="border-radius: 50%;">
                <div style="margin-top: 10px">{{ userName }}</div>
              </div>
              <div class="dropdown-divider"/>
              <div class="userSomething">
                <b-row>
                  <b-col cols="4" style="padding: 5px" class="userSomethingChild" @click="handleLearningClass()">
                    <div><span class="fa fa-address-book"/></div>
                    <div>我学的课</div>
                  </b-col>
                  <!--<b-col cols="4" style="padding: 5px" class="userSomethingChild">
                                    <div><span class="fa fa-bell"></span></div>
                                    <div>消息</div>
                                  </b-col>-->
                  <b-col
                    v-if="isTeacher"
                    cols="4"
                    style="padding: 5px"
                    class="userSomethingChild"
                    @click="handleTeachClass()">
                    <div><span class="fa fa-star"/></div>
                    <div>我教的课</div>
                  </b-col>
                  <!--<b-col cols="4" style="padding: 5px" class="userSomethingChild"  @click="toCustomer()">
                                    <div><span class="fa fa-headphones"></span></div>
                                    <div  >在线客服</div>
                                  </b-col>-->
                  <!-- <b-col cols="4" style="padding: 5px" class="userSomethingChild">
                                      <div><span class="fa fa-cog"></span></div>
                                      <div>设置</div>
                                  </b-col> -->
                  <b-col
                    cols="4"
                    style="padding: 5px"
                    class="userSomethingChild"
                    @click="handleTeachingPackage">
                    <div><span class="fa fa-cog"/></div>
                    <div>{{ isTeacher ? '我的教学包' : '我的书架' }}</div>
                  </b-col>
                  <b-col
                    sm="4"
                    style="padding: 5px"
                    class="userSomethingChild"
                    @click="goToMySchedulePage">
                    <div><span class="fa fa-calendar"/></div>
                    <div>我的课表</div>
                  </b-col>
                  <b-col
                    sm="4"
                    style="padding: 5px"
                    class="userSomethingChild"
                    @click="goToMyScorePage">
                    <div><span class="fa fa-calendar"/></div>
                    <div>{{ isTeacher ? '学生成绩' : '我的成绩' }}</div>
                  </b-col>
                </b-row>
              </div>
              <div class="dropdown-divider"/>
              <div class="outlogin" @click="outlogin">退出</div>
            </div>
          </div>
        </div>
        <!--未登录-->
        <img v-if="!showUserName" src="static/image/indexUser.png" style="width: 25px;height: 25px;margin: 7px 20px 7px 20%" class="responsive-display-none">
        <div style="margin: 5px -10px;height: 32px;line-height: 32px;color: white;cursor: pointer" class="responsive-display-none">
          <span v-if="!showUserName" class="indexLog" @click="tologin('showlogin')">登录</span>
          <span v-if="!showUserName">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span v-if="!showUserName" class="indexLog" @click="tologin('showregister')">注册</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { alert, confirm, delCookies } from '@/utils/global'
import Cookies from 'js-cookie'
import { tokenKeyName } from '../utils/global'
export default {
  name: 'HeaderNavStudy',
  components: {
  },
  props: {
    currentIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      userInputSearch: '',
      isScroll: false,
      isTeacher: false,
      routerList: [
        {
          id: 1,
          path: '/',
          pathName: '首页'
        },
        {
          id: 2,
          path: '/hear-class',
          pathName: '云课堂'
        },
        {
          id: 3,
          path: '/tutorial',
          pathName: '活教材'
        },
        {
          id: 4,
          path: '/blog',
          pathName: '博客'
        },
        {
          id: 5,
          path: '/cooperation',
          pathName: '合作'
        }
      ],
      showLogin: true,
      showUserName: false,
      userName: '',
      userImg: ''
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.getCookie()
  },
  methods: {
    // 跳转登录页
    tologin: function(box) {
      localStorage.setItem('showLoginVue', box)// 保存用户到本地会话
      localStorage.setItem('toLoginUrl', window.location.href)
      this.$router.push('/login')
    },
    handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 50) {
        this.isScroll = true
      }
      if (scrollTop === 0) {
        this.isScroll = false
      }
    },
    // 清空用户输入
    handleUserInput: function() {
      this.userInputSearch = ''
    },
    // 退出登录
    outlogin: function() {
      const that = this
      confirm('您确定要退出吗', function() {
        that.$api.login.outLogin().then((res) => {
          if (res.code === 0) {
            delCookies()
            that.$router.push('/')
            that.showLogin = true
            that.showUserName = false
          } else {
            alert(res.code)
          }
        })
      })
    },
    // 我的课堂
    handleTeachClass() {
      this.$router.push({
        path: `/my/classroom`
      })
    },
    // 我的课表
    goToMySchedulePage() {
      this.$router.push('/my-schedule')
    },
    // 我的成绩 or 学生成绩
    goToMyScorePage() {
      this.$router.push('/student-score')
    },
    handleLearningClass() {
      this.$router.push({
        path: `/my/learning-classroom`
      })
    },
    toAdd: function() {
      this.$router.push('/addLibrary')
    },
    handleTeachingPackage() {
      if (this.isTeacher) {
        this.$router.push('/my-teaching-package')
      } else {
        this.$router.push('/my-bookshelf/my-bookshelf')
      }
    },
    // 拿到Cookie
    getCookie: function() {
      const token = Cookies.get(tokenKeyName)
      if (token) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userName = userInfo.nickName
        this.isTeacher = userInfo.isTeacher
        this.userImg = localStorage.getItem('userimg')
        this.showLogin = false
        this.showUserName = true
      } else {
        // 因为cookie不存在，所以不做任何处理
        localStorage.setItem('showLoginVue', 'showlogin')
        this.showLogin = true
      }
    }
  }
}
</script>

<style scoped>
    .header-nav{
        width:100%;
        height:48px;
        /* background-color:#000; */
        /* overflow: hidden; */
    }
    .header-nav-static{
        position: static;
        top: 0;
        left: 0;
    }
    .header-nav-fixed{
        width: 100%;
        background-color: #000;
        position: fixed;
        padding-bottom: 3px;
        top: 0;
        left: 0;
        z-index: 999;
    }
    .header-nav .nav-con{
        display: flex;
        align-content: center;
        height: 100%;
        padding-top: 5px;
        /*padding:0 10px;
        padding-top:6px;*/
    }
    .nav-logo{
      margin-left: 50px;
    }
    .nav-con .nav-logo img{
        height:40px;
        vertical-align: middle;
        border-radius: 6px;
    }
    .nav-con .nav-logo .logo-text{
        display: inline-block;
        font-weight: 600;
        margin-left:10px;
    }
    .nav-con .nav-menu{
        display: flex;
        /* justify-content:space-between; */
        align-content: center;
        width:550px;
        height:100%;
        line-height:38px;
        margin-left: 100px;
    }
    .nav-con .menu-item{
       /*  margin: 5px 20px;
        height: 50px;
        line-height: 50px; */
        text-align: center;
        font-size: 16px;
        color: white;
        cursor: pointer;
        margin: 0 auto;
    }
    .nav-con .active{
        color: #FF740E;
        border-bottom:2px #FF740E solid;
    }
    /*.nav-con .router-link-exact-active{
        color: #fd7512;
        border-bottom:2px #fd7512 solid;
    }*/
    .nav-con .menu-item:hover{
        color: #FF740E;
        border-bottom:2px #FF740E solid;
    }
    .nav-con .nav-seach{
        position: relative;
        width:250px;
        height:38px;
        padding:8px 10px;
        border-radius: 20px;
        background-color: #fff;
        text-align: left;
    }
    .nav-con .nav-seach >input{
        border: 0;
        outline: 0;
        text-indent: 2em;
        width:70%;
        line-height: normal;
    }
    .nav-con .nav-seach .search{
        position: absolute;
        right: 15px;
        top:8px;
        cursor: pointer;
    }
    .nav-con .nav-seach .del-search-input{
        position: absolute;
        right: 50px;
        top:11px;
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .nav-con .right-nav{
        display: flex;
        align-items: center;
    }
    .nav-con .right-nav .right-nav-item:hover{
        color: #fd7512;
    }
    .nav-con .right-nav > span{
        display: inline-block;
        padding: 0 5px;
        cursor: pointer;
        color: #fff;
    }
    .userInfo{
      padding: 5px;
      text-align: center;
    }
    .userSomething{
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      padding:0px 10px;
    }
    .outlogin {
      text-align: center;
      cursor: pointer;
      padding: 5px;
      font-size: 16px;
    }
</style>
