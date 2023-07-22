<!-- 我要合作 -->
<template>
  <div>
    <!-- 顶部大图-->
    <div class="headnav">
      <div class="headnav_nav2">
        <img src="static/image/cooperation/cooperation.jpg" style="width: 100%;">
        <div class="banner-hidden">
          <div class="banner-background-a"/>
          <div class="banner-background-b"/>
        </div>
      </div>
      <div style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;width: 1220px;height: auto;">
        <div style="display: flex;margin: 20px 30px">
          <div style="display: flex;width: 200px">
            <img src="static/image/indexLog.png" style="height: 68px">
          </div>
          <div style="width: 700px;height: 60px;margin-left: 300px;display: flex;">
            <div class="indexNav" @click="goToPage">首页</div>
            <div class="indexNav" @click="handleHearClass">云课堂</div>
            <div class="indexNav" @click="handleTutorial">活教材</div>
            <div class="indexNav" @click="handleBlog">博客</div>
            <div class="indexNav" @click="goToCooperation">合作</div>
            <!--未登录-->
            <img v-if="showLogin" src="static/image/indexUser.png" style="width: 25px;height: 25px;margin: 17px 20px">
            <div style="margin: 5px -10px;height: 50px;line-height: 50px;color: white;cursor: pointer">
              <span v-if="showLogin" class="indexLog" @click="tologin('showlogin')">登录</span>
              <span v-if="showLogin">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span v-if="showLogin" class="indexLog" @click="tologin('showregister')">注册</span>
            </div>
            <!--已登录-->
            <div v-if="showUserName" style="display: flex; width: 100px">
              <div class="btn-group">
                <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="display: flex;cursor: pointer">
                  <img :src="userImg" width="50" height="50" style="border-radius: 50%;margin: 5px 30px">
                  <div style="height: 60px;line-height: 60px;font-size: 16px;margin-left: -20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color: white">{{ userName }}</div>
                </div>
                <div class="dropdown-menu" style="width: 300px;margin-left: -75px">
                  <div class="userInfo">
                    <img :src="userImg" width="50" height="50" style="border-radius: 50%;">
                    <div style="margin-top: 10px;">{{ userName }}</div>
                  </div>
                  <div class="dropdown-divider"/>
                  <div class="userSomething">
                    <b-row>
                      <b-col cols="4" style="padding: 5px" class="userSomethingChild" @click="handleLearningClass">
                        <div><span class="fa fa-address-book"/></div>
                        <div>我学的课</div>
                      </b-col>
                      <b-col
                        v-if="isTeacher"
                        cols="4"
                        style="padding: 5px"
                        class="userSomethingChild"
                        @click="handleTeachClass()">
                        <div><span class="fa fa-star"/></div>
                        <div>我教的课</div>
                      </b-col>
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
          </div>
        </div>
      </div>
    </div>
    <!-- 携手布道师-->
    <!-- 合作优势begin -->
    <div ref="hezthree" class="hezthree">
      <div :class="['intit',showHezthree ? 'animated fadeInUp' : '']">
        <div class="mz">合作优势</div>
        <div class="ms">
          践行互联网+教育，专注软件人才培养和企业内训。 </div>
      </div>

      <ul :class="['ti', showHezthree ? 'animated fadeInUp' : '']" style="display:flex;">
        <li class="fl">
          <div class="tu">
            <img src="static/image/cooperation/zpzc.jpg" alt="模式创新" title="模式创新" >
          </div>
          <div class="tou">
            模式创新 </div>
          <div class="shen">
            依托云技术，采用“平台+”的方<br >
            式，融合容器技术和虚拟化技术开启智慧云课堂 </div>
        </li>
        <li class="fl">
          <div class="tu">
            <img src="static/image/cooperation/jscx.jpg" alt="技术创新" title="技术创新" >
          </div>
          <div class="tou">
            技术创新 </div>
          <div class="shen">
            智能教学互动与大数据应用 </div>
        </li>
        <li class="fl">
          <div class="tu">
            <img src="static/image/cooperation/jxcx.jpg" alt="教学创新" title="教学创新" >
          </div>
          <div class="tou">
            教学创新 </div>
          <div class="shen">
            混合式教学 双师课堂 翻转课堂<br >
            线下真实实训场景 </div>
        </li>
      </ul>
    </div>
    <!-- 合作优势end -->
    <!-- 伙伴计划begin -->
    <div ref="hezfour" class="hezfour">
      <div class="ggwid">
        <div :class="['intit',,showHezfour ? 'animated fadeInUp' : '']">
          <div class="mz">伙伴计划</div>
          <div class="ms">
            基于企业优势与能力属性，选择合适的合作形式，有助于双方优势互补，实现共生 共赢 </div>
        </div>

        <ul :class="['ti', showHezfour ? 'animated fadeInUp' : '']" style="display:flex;">
          <li :class="['fl', currIndex === 0 ? 'active' : '']" @mouseenter="changeCurrIndex(0)">
            <div class="kuang">
              <div class="shang">
                <div class="tu">
                  <img src="static/image/cooperation/gxhz.png" alt="高校合作" title="高校合作" >
                </div>
                <div class="zi">高校合作</div>
              </div>
              <div class="xia">
                <div class="ms">
                  针对IT行业发展与人才需求之间<br >
                  的矛盾，布道师为高校提供完整的人才实训解决方案，参与高校教学改革，与高校共同制定教学计划，联合招生，共同培养。 将企业实践式教学作为高校课程大纲的有益补充，使在校大学生能够较大程度的满足业界职业要求，培育出满足产业需求的实用型、复合型软件人才。 </div>
                <router-link to="/join-us" target="_blank" class="join">加入我们</router-link>
              </div>
            </div>
          </li>
          <li :class="['fl', currIndex === 1 ? 'active' : '']" @mouseenter="changeCurrIndex(1)">
            <div class="kuang">
              <div class="shang">
                <div class="tu">
                  <img src="static/image/cooperation/qyhz.png" alt="企业合作" title="企业合作" >
                </div>
                <div class="zi">企业合作</div>
              </div>
              <div class="xia">
                <div class="ms">
                  推出成本可控的定时、定制、<br >
                  定量的“精准IT人才外包”服务，提出了从人才招聘、定制培养到 人才输送的一揽子IT人力资源整体解决方案，帮助企业招到人、培训好人、用好人，协助企业走出优秀人才短缺的困境。</div>
                <router-link to="/join-us" target="_blank" class="join">加入我们</router-link>
              </div>
            </div>
          </li>
          <li :class="['fl', currIndex === 2 ? 'active' : '']" @mouseenter="changeCurrIndex(2)">
            <div class="kuang">
              <div class="shang">
                <div class="tu">
                  <img src="static/image/cooperation/ptzc.png" alt="平台支撑" title="平台支撑" >
                </div>
                <div class="zi">平台支撑</div>
              </div>
              <div class="xia">
                <div class="ms">
                  自主研发，是以大数据、人工<br >
                  智能、鲲鹏为核心技术，构建的”资源、教学、实训、评价”完整可持续发展的学习生态系统。能够支撑线上教学、线上实训、人才双选，并为新工科建设、工程教育认证、教育数字化转型赋能。</div>
                <router-link to="/join-us" target="_blank" class="join">加入我们</router-link>
              </div>
            </div>
          </li>
          <li :class="['fl', currIndex === 3 ? 'active' : '']" @mouseenter="changeCurrIndex(3)">
            <div class="kuang">
              <div class="shang">
                <div class="tu">
                  <img src="static/image/cooperation/dlhz.png" alt="代理合作" title="代理合作" >
                </div>
                <div class="zi">代理合作</div>
              </div>
              <div class="xia">
                <div class="ms">
                  有一定的客户服务经验，<br >
                  认同创蓝教育品牌服务价值，愿意积极进行创蓝教育相关产品推广的销售型公司、企业服务商等。</div>
                <router-link to="/join-us" target="_blank" class="join">加入我们</router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 伙伴计划end -->
    <!-- 互信携手，共创共赢begin -->
    <div ref="hezfive" class="hezfive">
      <div class="ggwid" style="padding-top:50px;">
        <div :class="['intit',showHezfive ? 'animated fadeInUp' : '']">
          <div class="mz">互信携手，共创共赢</div>
          <div class="ms"/>
        </div>
        <div :class="['ti', showHezfive ? 'animated fadeInUp' : '']" style="display:flex;">
          <div class="dongw">
            <div class="bgtu">
              <img src="static/image/cooperation/hezfourbg.png" alt="合作" title="合作" >
            </div>
          </div>

          <div class="quan quan1">
            <a>
              <div class="tu">
                <img src="static/image/cooperation/zxsq.png" alt="在线申请" title="在线申请" >
              </div>
              <div class="zi">在线申请</div>
            </a>
          </div>
          <div class="quan quan2">
            <a>
              <div class="tu">
                <img src="static/image/cooperation/xxqr.png" alt="信息确认" title="信息确认" >
              </div>
              <div class="zi">信息确认</div>
            </a>
          </div>
          <div class="quan quan3">
            <a>
              <div class="tu">
                <img src="static/image/cooperation/swqt.png" alt="商务洽谈" title="商务洽谈" >
              </div>
              <div class="zi">商务洽谈</div>
            </a>
          </div>
          <div class="quan quan4">
            <a>
              <div class="tu">
                <img src="static/image/cooperation/hzmsqd.png" alt="合作模式确定" title="合作模式确定" >
              </div>
              <div class="zi">合作模式确定</div>
            </a>
          </div>
          <div class="quan quan5">
            <a>
              <div class="tu">
                <img src="static/image/cooperation/swhz.png" alt="商务合作" title="商务合作" >
              </div>
              <div class="zi">商务合作</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 互信携手，共创共赢end -->
    <!-- 合作伙伴begin -->
    <div ref="hezsix" class="indexfive hezsix">
      <div class="ggwid">
        <div :class="['intit',showHezsix ? 'animated fadeInUp' : '']" style="animation-duration: 1.4s !important;">
          <div class="mz">合作伙伴</div>
          <div class="ms">
            产品广泛应用于高校、企业、行业培训机构并取得成功实践 </div>
        </div>

        <ul :class="['ti', showHezsix ? 'animated fadeInUp' : '']" style="animation-duration: 1.4s !important;">
          <li class="fl">
            <img class="img1" src="static/image/cooperation/hnxxzyjsxy.png" alt="湖南信息职业技术学院" title="湖南信息职业技术学院" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/hngyzyjsxy.png" alt="湖南工业职业技术学院" title="湖南工业职业技术学院" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/cslgdx.png" alt="长沙理工大学" title="长沙理工大学" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/xtdx.png" alt="湘潭大学" title="湘潭大学" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/hngydx.jpg" alt="湖南工业大学" title="湖南工业大学" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/hnlgxy.png" alt="湖南理工学院" title="湖南理工学院" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/cz.png" alt="创博龙智" title="创博龙智" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/kc.png" alt="科创信息" title="科创信息" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/ntxx.png" alt="南天信息" title="南天信息" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/tw.png" alt="拓维" title="拓维" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/dr.png" alt="东软" title="东软" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/hc.png" alt="恒成" title="恒成" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/zrgj.png" alt="中软国际" title="中软国际" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/yxkj.png" alt="亿迅科技" title="亿迅科技" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/yx.png" alt="亚信" title="亚信" >
          </li>
          <li class="fl">
            <img class="img1" src="static/image/cooperation/shcfznkj.png" alt="上海丞风智能科技" title="上海丞风智能科技" >
          </li>
        </ul>
      </div>
    </div>
    <!-- 合作伙伴end -->
    <!-- 尾部 -->
    <footer-nav/>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import $ from 'jquery'
import { baseUrl, alert, confirm, delCookies } from '@/utils/global'
import BroadsideNav from '@/components/broadside-nav'
import FooterNav from '@/components/footer-nav'
import { tokenKeyName } from '../../utils/global'
export default {
  name: 'Hello',
  components: {
    'footer-nav': FooterNav,
    'broadside-nav': BroadsideNav
  },
  data() {
    return {
      isTeacher: false,
      showLogin: true,
      showUserName: false,
      userName: '',
      avdList: [],
      userImg: '',
      teacherList: [],
      startList: [],
      menuList: [],
      subjectList: [],
      tevglTchClassroomList: [],
      partnerList: [],
      tevglBookMajorList: [],
      showHezthree: true,
      showHezfour: false,
      showHezfive: false,
      showHezsix: false,
      currIndex: 0 // 当前悬浮的伙伴计划
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  created() {
    this.showIndexData()
    this.showHeaderData()
    const token = Cookies.get(tokenKeyName)
    if (token) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.webSockets.setInit(this, {
        paramStr: 'id=' + userInfo.traineeId + '&channel=site&token=' + token
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 我的课表
    goToMySchedulePage() {
      this.$router.push('/my-schedule')
    },
    // 我的成绩 or 学生成绩
    goToMyScorePage() {
      this.$router.push('/student-score')
    },
    // 鼠标移入改变 伙伴计划  样式
    changeCurrIndex(value) {
      this.currIndex = value
    },
    // 点击跳转到我要合作页面
    goToCooperation() {
      this.$router.push('/cooperation')
    },
    // 到主页面
    goToPage() {
      this.$router.push('/')
    },
    // 点击我要开课
    handleBeginClass: function() {
      if (this.showLogin) {
        this.tologin('showlogin')
        return
      }
      if (this.showUserName) {
        this.$router.push('/begin-class')
        return
      }
    },
    // 点击博客
    handleBlog() {
      this.$router.push('/blog')
    },
    // 跳转到云教程
    handleTutorial: function() {
      this.$router.push('/tutorial')
    },
    // 点击我要学习
    handleHearClass: function() {
      this.$router.push('/hear-class')
    },
    // 校企合作更多
    toCooperate: function() {
      this.$router.push('/cooperate')
    },
    // 页面加载后初始化数据
    showIndexData: function() {
      this.$api.main.showmain().then((res) => {
        if (res.code === 0) {
          // 校企合作
          if (res.data.partnerList) {
            res.data.partnerList.forEach(item => {
              item.companyLogo = baseUrl + item.companyLogo
            })
            this.partnerList = res.data.partnerList
          }
        }
      })
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
      if (localStorage.getItem('username') != '' && localStorage.getItem('username') != null) {
        this.userName = localStorage.getItem('username')
        if (localStorage.getItem('userimg').startsWith('http')) {
          this.userImg = localStorage.getItem('userimg')
        } else {
          this.userImg = baseUrl + localStorage.getItem('userimg')
        }
        this.showLogin = false
        this.showUserName = true
      } else {
        this.showLogin = true
        this.showUserName = false
      }
    },
    handleLearningClass() {
      this.$router.push({
        path: `/my/learning-classroom`
      })
    },
    // 我的课堂
    handleTeachClass() {
      this.$router.push({
        path: `/my/classroom`
      })
    },
    handleTeachingPackage() {
      if (this.isTeacher) {
        this.$router.push('/my-teaching-package')
      } else {
        this.$router.push('/my-bookshelf/my-bookshelf')
      }
    },
    handleScroll() { // 实现当滚动到指定位置，触发动画
      var mxwid = $('.hezfive .ti').width()
      $('.hezfive .ti .bgtu').width(mxwid)
      // let scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 获取窗口滚动条高度
      // this.gdjz('earth', 'earth animated bounceInDown', 50)
      const dom1 = this.$refs.hezthree.getBoundingClientRect().top
      const dom2 = this.$refs.hezfour.getBoundingClientRect().top
      const dom3 = this.$refs.hezfive.getBoundingClientRect().top
      const dom4 = this.$refs.hezsix.getBoundingClientRect().top
      // let a1 = eval(d1 + 20);
      // let a2 = eval(d2 + 20);
      // let b = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //  获取窗口滚动条高度
      const c = document.documentElement.clientHeight || document.body.clientHeight // 获取浏览器可视区的高度

      if (dom1 < c) {
        this.showHezthree = true
      }

      if (dom2 < c) {
        this.showHezfour = true
      }

      if (dom4 < c) {
        this.showHezsix = true
      }

      if (dom3 < c) {
        this.showHezfive = true
        $('.hezfive .dongw').animate({
          width: mxwid
        },
        2000,
        function() {
          $('.hezfive .ti').addClass('chux')
        }
        )
      }
    }
  }
}
</script>

<style scoped>
  @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
    0%{
      transform: scale(1);  /*开始为原始大小*/
    }
    50%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
  @keyframes wave1 {
    from {left: -236px;}
    to {left: -1233px;}
  }
  @keyframes wave2 {
    from {left: -0px;}
    to {left: -1009px;}
  }
  .banner-hidden{
    margin:auto;
    border: 1px red solid;
  }
  .banner-hidden .banner-background-a {
    height: 85px;
    background:
      url('../../../static/image/background_wall-a.png')
      repeat-x;
    position: absolute;
    bottom: 0;
    width: 400%;
    left: -236px;
    z-index: 2;
    animation: wave1 25s linear .4s infinite normal;
    -moz-animation: wave1 25s linear .4s infinite normal;
    -webkit-animation: wave1 25s linear .4s infinite normal;
    -o-animation: wave1 25s linear .4s infinite normal;
  }
  .banner-hidden .banner-background-b {
    height: 100px;
    background:
      url('../../../static/image/background_wall-b.png')
      repeat-x;
    position: absolute;
    bottom: 0;
    width: 400%;
    left: 0;
    z-index: 1;
    animation: wave2 60s linear .4s infinite normal;
    -moz-animation: wave2 60s linear .4s infinite normal;
    -webkit-animation: wave2 60s linear .4s infinite normal;
    -o-animation: wave2 60s linear .4s infinite normal
  }
  .headnav_nav2{
    width: 100%;
    max-height: 768px;
    overflow: hidden;
    position: relative;
  }
  /* .headnav_nav2 img{
    cursor: pointer;
    animation: scaleDraw 10s ease-in-out infinite;
  } */
  .headnav{
    position: relative;
    width: 100%;
    margin: 0px auto;
  }
  .indexNav{
    margin: 5px 20px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: white;
    cursor: pointer;
  }
  .indexNav:hover{
    color: #FF740E;
    border-bottom:2px #FF740E solid;
  }
  .indexLog:hover{
    color: #FF740E;
  }
  .nav li{
    margin-left: 25px;
    cursor: pointer;
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
    color: #0033CD;
  }
  .teaching-title-box{
      /* height: 70px; */
      margin-top:250px;
      margin-left:30px;
      margin-bottom: 20px;
      text-align: left;
      color: white;
  }
  .teaching-title-box > span{
      display: inline-block;
  }
  .teaching-title-box .teaching-title{
       font-size: 36px;
       font-weight: bold;
       vertical-align: middle;
  }
  .teaching-title-box .versions-type{
      width: 60px;
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      border-radius: 5px;
      text-align: center;
      margin-left: 15px;
      vertical-align: middle;
      background-color: #FF740E;
  }
  /* 我要合作主样式 */
.mz{
  font-size: 24px;
}
.ms{
  margin-top: 20px;
  font-size: 16px;
}
.intit, .ti{
  animation-duration: 2s !important;
}
.heztwo{
	width: 100%;
}
.heztwo .intit{
	padding-top: 0;
}
.hezthree{
	width: 100%;background-color: #f4f4f5;
	/*margin-top: 75px;*/
}
.hezthree .intit{
	padding-top: 50px;
}
.hezthree .ti{
	width: 1216px;padding: 46px 0 75px;margin: 0 auto;
}
.hezthree .ti li{
	width: 27.69%;margin: 0 2.77%;text-align: center;
}
.hezthree .ti li .tu{
	width: 100%;overflow: hidden;
}
.hezthree .ti li .tu img{
	width: 100%;transition: all 400ms;
}
.hezthree .ti li:hover .tu img{
	transform: scale(1.05);
}
.hezthree .ti li .tou{
	width: 100%;line-height: 46px;font-size: 18px;color: #333;margin-top: 20px;
}
.hezthree .ti li .shen{
	width: 88%;line-height: 19px;font-size: 14px;color: #666;margin: 0 6%;
}
.hezfour{
	width: 100%;
}
.hezfour .ti{
	width: 1216px;padding: 46px 0 75px;margin: 0 auto;
}
.hezfour .ti li{
	width: 25%;text-align: center;transition: all 200ms;height: 453px;padding-top: 30px;box-sizing: border-box;
}
.hezfour .ti li.active{
	padding-top: 0;
}
.hezfour .ti li .kuang{
	width: 100%;box-shadow: 0 0 20px #ecececd7;overflow: hidden;
}
.hezfour .ti li .shang{
	width: 100%;background-color: #394860;color: #fff;padding: 12px 0;transition: all 200ms;position: relative;overflow: hidden;
}
.hezfour .ti li.active .shang{
	background-color: #3ad3ff;
}
.hezfour .ti li .shang .tu{
	width: 100%;
}
.hezfour .ti li .shang .tu img{
	width: 87px;
}
.hezfour .ti li .shang .zi{
	width: 100%;line-height: 40px;font-size: 16px;color: #fff;
}
.hezfour .ti li .xia{
	width: 100%;transition: all 200ms;padding-top: 0;
}
.hezfour .ti li.active .xia{
	padding-top: 30px;
}
.hezfour .ti li .xia .ms{
	width: 87.6%;margin: 40px auto 16px;line-height: 24px;font-size: 14px;color: #333;height: 200px;overflow: hidden;
}
.hezfour .ti li .xia .join{
	width: 130px;height: 28px;line-height: 28px;border: 1px solid #3cd4ff;border-radius: 15px;text-align: center;color: #666;
	font-size: 14px;margin: 0 auto 50px;transition: all 200ms;display: block;
}
.hezfour .ti li.active .xia .join{
	background-color: #3ad3ff;color: #fff;
}
.hezfive{
	width: 100%;background-color: #f4f4f5;
}
.hezfive .ti{
  width: 1216px;margin: 0 auto;
	padding: 40px 0 130px;position: relative;text-align: center;z-index: 2;
}
.hezfive .ti .dongw{
	width: 0;overflow: hidden;
}
.hezfive .ti .bgtu{
	width: 100%;
}
.hezfive .ti .bgtu img{
	width: 100%;
}
.hezfive .ti .quan{
	width: 100px;position: absolute;margin-left: -50px;margin-top: -50px;opacity: 0;filter: alpha(opacity=0);
    transition: all 1600ms;
}
.hezfive .ti.chux .quan{
	opacity: 1;filter: alpha(opacity=100);
}
.hezfive .ti .quan .tu{
	width: 100%;transition: all 600ms;max-width: 80px;margin: 0 auto;
}
.hezfive .ti .quan:hover .tu{
	margin-top: -20px;
}
.hezfive .ti .quan .tu img{
	width: 100%;
}
.hezfive .ti .quan .zi{
	font-size: 14px;color: #333;line-height: 36px;font-weight: bold;
}
.hezfive .ti .quan.quan1{
	left: 19%;top: 34%;transition-delay: 0s;
}
.hezfive .ti .quan.quan2{
	left: 35%;top: 49%;transition-delay: .3s;
}
.hezfive .ti .quan.quan3{
	left: 51%;top: 52%;transition-delay: .6s;
}
.hezfive .ti .quan.quan4{
	left: 67%;top: 23%;transition-delay: .9s;
}
.hezfive .ti .quan.quan5{
	left: 85%;top: 41%;transition-delay: 1.2s;
}
.hezsix .ti{
  width: 1216px;
  padding: 46px 0 75px;
  border-bottom: none;padding-bottom: 110px;
  display:flex;
  margin: 0 auto;
  flex-wrap:wrap;
  align-content:flex-start;
}
.hezsix .ti li{
  width: 20%;
  margin: 10px 0;
  text-align: center;
}

.hezsix .ti li img{
  height: 80px;
  width: 90%;
  border: 2px solid rgb(206, 206, 206);
}

.yanc2s{
	animation-duration:1.4s !important;
}
</style>
