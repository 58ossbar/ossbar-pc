<!-- 管理面板上方悬浮的头部组件 -->
<template>
  <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse':''" class="header-nav">
    <div class="header-nav-fixed">
      <div class="nav-con wind-1240">
        <div class="nav-logo">
          <img :alt="ifTeacher ? '教学平台' : '实训平台'" src="static/image/platfromLog.png">
          <span class="logo-text color-fff">{{ ifTeacher ? '教学平台' : '实训平台' }}</span>
        </div>
        <div class="nav-menu">
          <!-- :to="(item.id !== 2 && item.id != 7) ? {path:item.path} : '#'" -->
          <router-link
            v-for="(item,index) in routerList"
            :key="index"
            :to="{path:item.path}"
            :class="['menu-item',currentIndex===item.id?'active':'']"
            tag="div"
            @click.native="clickHeadNav(item)">
            {{ item.pathName }}
            <i v-if="item.children && item.children.length > 0" class="el-icon-caret-bottom menu-item-icon-bottom"/>
            <i v-if="item.children && item.children.length > 0" class="el-icon-caret-top menu-item-icon-top"/>
            <div v-if="item.children && item.children.length > 0" :class="['menu-item-children']">
              <router-link v-for="(itemc, indexc) in item.children" :key="indexc" :to="(item.id != 7) ? {path:itemc.path} : '#'" :class="['menu-item-children-item',currentChildrenIndex===itemc.id?'activeChildren':'']" tag="div" @click.native="clickHeadNav(itemc)">{{ itemc.pathName }}</router-link>
              <!-- <div v-for="(itemc, indexc) in item.children" class="menu-item-children-item" :key="indexc">{{itemc.pathName}}</div> -->
            </div>
          </router-link>
        </div>
        <div class="right-nav">
          <div v-if="showLogin" class="right-nav-item" @click="toLogin">
            <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="height: 30px;display: flex;align-items: center;">
              <i class="fa fa-sign-in" style="font-size: 20px;" aria-hidden="true"/>
            </div>
            <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="line-height: 30px;height: 30px;padding-left: 3px;">登录</div>
          </div>

          <div v-if="!showLogin" class="right-nav-item" @click="outlogin">
            <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="height: 30px;display: flex;align-items: center;">
              <i class="fa fa-sign-out" style="font-size: 20px;" aria-hidden="true"/>
            </div>
            <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="line-height: 30px;height: 30px;padding-left: 3px;">退出登录</div>
          </div>

          <!-- <el-divider direction="vertical" style="margin-top:100px;"/>
          <div class="right-nav-item" @click="outlogin">退出登录</div> -->
        </div>
      </div>
    </div>
    <!-- <div class="header-nav-tab-collapse-wrap">
            <i class="icon iconfont icon-jiantouarrowhead7"></i>隐藏
        </div> -->
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { alert, confirm, delCookies, tokenKeyName } from '@/utils/global'
import { handleImagePath } from '@/utils/util'
export default {
  name: 'HeaderNav',
  components: {

  },
  props: {
    isHideNavOnScroll: {
      type: Boolean,
      default: false
    },
    currentIndex: {
      type: Number,
      default: 1
    },
    currentChildrenIndex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      showLogin: true,
      userInputSearch: '',
      isScroll: false,
      ifTeacher: true,
      routerList: [
        {
          id: 1,
          path: '/',
          pathName: '管理看板'
        },
        {
          id: 4,
          path: '/my/classroom',
          pathName: '教学中心'
        },
        {
          id: 6,
          path: '#',
          pathName: '学习中心',
          children: [
            {
              id: 61,
              path: '/my/learning-classroom',
              pathName: '我学的课'
            },
            {
              id: 62,
              path: '/my-bookshelf/my-bookshelf',
              pathName: '我的书架'
            }
          ]
        },
        {
          id: 5,
          path: '/my-teaching-package',
          pathName: '教学包'
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.ifTeacher = false

    const token = Cookies.get(tokenKeyName)
    if (token) {
      this.$api.login.getUser().then((res) => {
        // 处理头像
        res.data.traineeHead = handleImagePath(res.data.traineeHead)
        // 保存至缓存中
        localStorage.setItem('username', res.data.nickName)
        localStorage.setItem('userimg', res.data.traineeHead)
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        localStorage.setItem('ifTeacher', res.data.ifTeacher ? 'Y' : 'N')
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userName = userInfo.nickName
        this.ifTeacher = userInfo.ifTeacher
        this.userImg = localStorage.getItem('userimg')
        this.showLogin = false
        this.showUserName = true
        if (!this.ifTeacher) {
          this.routerList = [
            {
              id: 1,
              path: '/',
              pathName: '管理看板'
            },
            {
              id: 8,
              path: '/my/learning-classroom',
              pathName: '我的课堂'
            },
            {
              id: 6,
              path: '/my-bookshelf/my-bookshelf',
              pathName: '我的书架'
            }
          ]
        }
      })
    } else {
      this.showLogin = true
    }
  },
  methods: {
    toLogin() {
      localStorage.setItem('toLoginUrl', window.location.href)
      this.$router.push('/login')
    },
    clickHeadNav(item) {
      if (this.showLogin) {
        this.toLogin()
        return false
      }
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
          } else {
            alert(res.code)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
    .header-nav{
        width:100%;
        height:50px;
        /* display: block; */
        transition: 0.4s;
        /* transition: height 0.4s; */
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
        /*justify-content:space-around;*/
        align-content: center;
        height: 100%;
        padding-top: 5px;
        /*padding:0 10px;
        padding-top:6px;*/
    }
    .nav-logo{
      margin-left: 5%;
    }
    .nav-con .nav-logo img{
        width:40px;
        height:40px;
        vertical-align: middle;
        border-radius: 6px;
    }
    .nav-con .nav-logo .logo-text{
        display: inline-block;
        font-weight: 600;
        font-size: 16px;
        margin-left:10px;
    }
    .nav-con .nav-menu{
        display: flex;
        /* justify-content:space-between; */
        align-content: center;
        margin-left: 7%;
        width:600px;
        height:100%;
        line-height:38px;
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

        position: relative;
        /* padding: 0 20px; */
        box-sizing: border-box;
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
        margin-left: 15%;
        display: flex;
        align-items:center;
        height: 38px;
    }
    .nav-con .right-nav .right-nav-item:hover{
        color: #fd7512;
    }
    .right-nav-item{
        display: flex;
    }
    .nav-con .right-nav > div{
        cursor: pointer;
        color: #fff;
    }

    .nav-con .menu-item .menu-item-children{
        background-color: #000;
        position: absolute;
        z-index: 888;
        /* padding: 10px 20px; */
        box-sizing: border-box;
        top: 40px;
        width: 145px;
        font-size: 14px;
        left: -20px;
        line-height: 20px;
        padding: 5px 0px;
        text-align: left;
        border-radius: 0 0 5px 5px;
        display: none;
    }
    .nav-con .menu-item .menu-item-children .menu-item-children-item{
        padding: 3px 20px;
        box-sizing: border-box;
    }
    .nav-con .menu-item:hover .menu-item-children{
        color: #fff;
        display: block;
    }
    .nav-con .menu-item .menu-item-children .menu-item-children-item:hover,
    .nav-con .menu-item .menu-item-children .menu-item-children-item.activeChildren{
        color: #fd7512;
        background-color: #fff;
    }
    .menu-item-icon-top,
    .nav-con .menu-item:hover .menu-item-icon-bottom{
        display: none;
    }
    .menu-item-icon-bottom,
    .nav-con .menu-item:hover .menu-item-icon-top{
        display: inline-block;
    }
    .header-nav-tab-collapse-wrap{
        position: fixed;
        /* top: 100%; */
        top: 47px;
        left: calc(((100vw - 1200px) / 2 + 1200px + 5px));
        /* right: calc(((100vw - 1200px) / 2) / 2); */
        background-color: #000;
        color: #fff;
        padding: 3px 8px;
        font-size: 13px;
        border-radius: 0 0 5px 5px;
    }
    .header-nav-tab-collapse-wrap .iconfont{
        color: #fff;
        font-size: 14px;
        margin-right: 3px;
    }
    .header-nav-collapse{
        /* display: none; */
        height: 0 !important;
    }
    .header-nav-collapse .header-nav-fixed{
        padding-bottom: 0;
    }
    .header-nav-collapse-height{
        /* display: none; */
        height: 0 !important;
    }
    .header-nav-collapse .nav-con{
        display: none;
    }
    /* .header-nav-collapse .nav-con,
    .header-nav-collapse .nav-con .nav-logo img,
    .header-nav-collapse .nav-con .nav-menu,
    .header-nav-collapse .nav-con .nav-seach,
    .header-nav-collapse .nav-con .nav-seach .del-search-input,
    .header-nav-collapse .nav-con .right-nav{
        height: 0;
    } */
</style>
