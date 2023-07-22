<!-- 首页头部组件 -->
<template >
  <div>
    <!-- 顶部导航栏 -->
    <div class="top-father" >
      <div class="top">
        <b-row>
          <b-col cols="6">
            <div class="marquee">
              <div>
                <i class="fa fa-volume-up" aria-hidden="true" style="font-size: 14px;color: #797979" @click="toNewslist"/>
              </div>
              <div class="marquee_box">
                <ul :class="{marquee_top:animate}" class="marquee_list" >
                  <li v-for="(item, index) in marqueeList" :key="index" class="marquee_Newsread" style="text-align: left;margin-left: -15px">
                    <div style="overflow: hidden;width: 100%;font-size: 12px;color:#797979;" @click="toNewsread(item.newsid)">{{ item.newTitle }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="top-right">
              <span v-if="showLogin" class="bluehover" @click="tologin('showlogin')">我要登录</span>
              <span v-if="showLogin">|</span>
              <span v-if="showLogin" class="bluehover" @click="tologin('showregister')">我要注册</span>
              <span v-if="showLogin">|</span>
              <span class="bluehover" >网站帮助</span>
              <span>|</span>
              <span class="bluehover" @click="toDownLoad()">下载中心</span>
              <span >|</span>
              <span class="bluehover" @click="toCustomer()">在线客服</span>
              <span>|</span>
              <span class="bluehover phoneEwm"><i class="fa fa-mobile" aria-hidden="true" style="margin-right: 10px;font-size: 16px;"/>手机版</span>
              <div class="ewmTop">
                <img src="../../static/image/ewm.png" alt="" width="120" height="120" style="padding: 5px">
                <div>布道师二维码</div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="fixedTextFather">
      <div class="fixedText header">
        <b-row>
          <b-col cols="2">
            <img src="../../static/image/logoSmall.png" alt="" style="margin-top: -10px;width: 100%;height: 60px;margin-left: -30px">
          </b-col>
          <b-col cols="5" >
            <ul class="nav" style="list-style-type: none;">
              <li v-for="(item,index) in menuList" :key="index" >
                <a :class="item.list?'dropdown-toggle':'' || item.url===insUrl?'navClick':''" :data-toggle="item.list?'dropdown':''" :href="item.url">{{ item.name }}</a>
                <ul v-if="item.list" class="dropdown-menu" >
                  <li v-for="(itemChild,index) in item.list" :key="index"><a :href="itemChild.url">{{ itemChild.name }}</a></li>
                </ul>
              </li>
            </ul>
          </b-col>
          <b-col cols="3" >
            <div class="inputText">
              <input type="text" class="form-control" name="search" value="" placeholder="Search" autocomplete="on">
            </div>
          </b-col>
          <b-col v-if="showUserName" cols="2" style="display: flex;">
            <div class="btn-group">
              <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="display: flex;cursor: pointer">
                <img :src="userImg" width="50" height="50" style="border-radius: 50%;margin-top:-5px;">
                <div style="height: 36px;line-height: 36px;font-size: 18px;margin-left: 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ userName }}</div>
              </div>
              <div class="dropdown-menu" style="width: 300px;margin-left: -75px">
                <div class="userInfo">
                  <img :src="userImg" width="50" height="50" style="border-radius: 50%;">
                  <div style="margin-top: 10px">{{ userName }}</div>
                </div>
                <div class="dropdown-divider"/>
                <div class="userSomething">
                  <b-row>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild">
                      <div><span class="fa fa-address-book"/></div>
                      <div>学习</div>
                    </b-col>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild">
                      <div><span class="fa fa-bell"/></div>
                      <div>消息</div>
                    </b-col>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild" @click="toClassroom()">
                      <div><span class="fa fa-star"/></div>
                      <div>我的课堂</div>
                    </b-col>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild" @click="toCustomer()">
                      <div><span class="fa fa-headphones"/></div>
                      <div >在线客服</div>
                    </b-col>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild">
                      <div><span class="fa fa-cog"/></div>
                      <div>设置</div>
                    </b-col>
                    <b-col cols="4" style="padding: 5px" class="userSomethingChild" @click="toBooks">
                      <div><span class="fa fa-cog"/></div>
                      <div>我的书架</div>
                    </b-col>
                  </b-row>
                </div>
                <div class="dropdown-divider"/>
                <div class="outlogin" @click="outlogin">退出</div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>

  </div>
</template>

<script>
import { tokenKeyName } from '@/utils/global'
import $ from 'jquery'
import { baseUrl, alert, confirm, delCookies } from '@/utils/global'
import Cookies from 'js-cookie'
$(window).scroll(function() {
  if (document.documentElement.scrollTop >= 30) {
    $('.fixedTextFather').addClass('headerFix')
  }
  if (document.documentElement.scrollTop < 30) {
    $('.fixedTextFather').removeClass('headerFix')
  }
})
export default {
  name: 'HeaderNav',
  data() {
    return {
      msg: '',
      animate: false,
      marqueeList: [],
      showLogin: true,
      showUserName: false,
      userName: '',
      userImg: '',
      teacherList: [],
      startList: [],
      menuList: [],
      newsList: [],
      subjectList: [],
      tevglPkgInfoList: [],
      partnerList: [],
      major: [],
      insUrl: 'http://localhost:8888/#/'
    }
  },
  created() {
    this.showHeaderData()
    setInterval(this.showMarquee, 2000)
  },
  methods: {
    // 下载中心
    toDownLoad: function() {
      this.$router.push('/download')
    },
    // 在线客服
    toCustomer: function() {
      this.$router.push('/Customer')
    },
    // 我的课堂
    toClassroom: function() {
      this.$router.push('/my/classroom')
    },
    toAdd: function() {
      this.$router.push('/addLibrary')
    },
    toBooks: function() {
      this.$router.push('/books')
    },
    // 文字轮播
    showMarquee: function() {
      this.animate = true
      setTimeout(() => {
        this.marqueeList.push(this.marqueeList[ 0 ])
        this.marqueeList.shift()
        this.animate = false
      }, 500)
    },
    // 新闻单个的详细页
    toNewsread: function(box) {
      localStorage.setItem('newsid', box)
      this.$router.push('/news-read')
      this.$router.go(0)
    },
    // 新闻的集合页面
    toNewslist: function() {
      this.$router.push('/news-list')
    },
    // 跳转登录页
    tologin: function(box) {
      localStorage.setItem('showLoginVue', box)// 保存用户到本地会话
      localStorage.setItem('toLoginUrl', window.location.href)
      this.$router.push('/login')
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
    // 页面加载后的数据初始化
    showHeaderData: function() {
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
      this.$api.main.getMenu().then((res) => {
        for (let i = 0; i < res.data.menuList.length; i++) {
          var obj = {}
          if (window.location.href === res.data.menuList[i].url) {
            this.insUrl = res.data.menuList[i].url
          }
          obj.name = res.data.menuList[i].name
          obj.url = res.data.menuList[i].url
          obj.list = res.data.menuList[i].list
          if (obj.list) {
            for (let j = 0; j < obj.list.length; j++) {
              if (window.location.href === obj.list[j].url) {
                this.insUrl = res.data.menuList[i].url
              }
              obj.list.name = obj.list[j].name
              obj.list.url = obj.list[j].url
            }
          }
          this.menuList.push(obj)
        }
      })
      // 最新资讯
      this.$api.main.getNews().then((res) => {
        this.marqueeList = []
        for (let i = 0; i < res.data.list.length; i++) {
          var obj = {}
          obj.newTitle = res.data.list[i].newTitle
          obj.deployUrl = res.data.list[i].deployUrl
          obj.newsid = res.data.list[i].newsid
          this.marqueeList.push(obj)
        }
      })
    }
  }
}
</script>

<style>
  .top-father{
    background:#eff3f5;
    position: relative;

  }
  .top{
    width:1200px;
    margin: auto;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }
  .top-left{
    float: left;
  }
  .top-right{
    float: right;
    cursor: pointer;
  }
  .bluehover:hover{
    color: #158aeb;
  }
  .top-left span,.top-right span{
    margin-left: 5px;
  }
  .fixedTextFather{
    width: 100%;
    background:  #ffffff;
    box-shadow: 1px 1px 1px #e0e0e0;
  }
  .header{
    width: 1200px;
    margin:auto;
    height: 70px;
    padding: 16px;
    font-size: 14px;
  }
  .headerFix{
    width: 100%;
    height: 70px;
    font-size: 14px;
    position: fixed;
    top: 0;
    left: 0;
    background:  #ffffff;
    z-index: 99;
  }
  .nav{
    list-style-type: none;
    font-size: 16px;
    line-height: 36px;
  }
  .nav li{
    margin-left: 25px;
    cursor: pointer;
  }
  .inputText{
    width:100%;
  }
  .img-log{
    transition: all 1s;
  }
  .img-log:hover{
    transform: scale(1.5,1.5);cursor: pointer;
    position: relative;
    z-index: 10;
  }

  .userInfo{
    padding: 5px;
    text-align: center;
  }
  .userSomething{
    text-align: center;
    cursor: pointer;
    font-size: 16px;
  }
  .userSomethingChild span{
    font-size: 20px;
    margin: 5px;
  }
  .outlogin{
    text-align: center;
    cursor: pointer;
    padding: 5px;
    font-size: 16px;
  }
  .outlogin:hover,.userSomethingChild:hover{
    color: #3399ff;
  }
  .navClick{
    color:#158aeb;
  }

  .marquee {
    width: 100%;
    cursor: pointer;
    align-items: center;
    color: #3A3A3A;
    display: flex;
    box-sizing: border-box;
  }
  .marquee_title {
    padding: 0 20px;
    height: 30px;
    font-size: 14px;
    border-right: 1px solid #d8d8d8;
    align-items: center;
  }
  .marquee_box {
    display: block;
    position: relative;
    width: 70%;
    height: 30px;
    overflow: hidden;
  }
  .marquee_list {
    display: block;
    position: absolute;
    margin-left: -20px;
    top: 0;
    left: 0;
    text-align: left;
  }
  .marquee_Newsread:hover{
    color: #158aeb;
  }
  .marquee_top {
    transition: all 0.5s;
    margin-top: -30px
  }
  .marquee_list li {
    height: 30px;
    list-style: none;
    line-height: 30px;
    font-size: 14px;
  }
  .marquee_list li span {
    padding: 0 2px;
  }

  .ewmTop{
    position: absolute;
    top: 30px;
    right: 0px;
    z-index: 2;
    background: white;
    color: #838383;
    display:none
  }
  .phoneEwm:hover+.ewmTop{
    display:block;
  }
</style>
