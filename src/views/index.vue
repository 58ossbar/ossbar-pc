<!-- 首页 -->
<template>
  <div>
    <!-- 顶部大图-->
    <div class="headnav">
      <div class="headnav_nav">
        <img src="static/image/indexImg.jpg" style="width: 100%;">
        <div class="banner-hidden">
          <div class="banner-background-a"/>
          <div class="banner-background-b"/>
        </div>
      </div>
      <div style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;max-width: 1220px;height: auto;">
        <div class="nav-area">
          <div>
            <img src="static/image/indexLog.png" class="indexLogo">
          </div>
          <div class="navList">
            <div class="indexNav" @click="goToPage">首页</div>
            <div class="indexNav" @click="handleHearClass">云课堂</div>
            <div class="indexNav" @click="handleTutorial">活教材</div>
            <div class="indexNav" @click="handleBlog">博客</div>
            <div class="indexNav" @click="goToCooperation">合作</div>
            <div class="indexNav" @click="goToOssbar">开源吧</div>
            <!-- 收缩导航栏 -->
            <div class="shrink-nav">
              <div class="nav-icon" @click="isShowNav = !isShowNav"><i class="el-icon-s-operation"/></div>
              <el-collapse-transition>
                <div v-if="isShowNav" class="contraction-nav-list">
                  <div style="color:#0033CD;" @click="goToPage"><span>首页</span><i class="el-icon-arrow-right"/></div>
                  <div @click="handleHearClass"><span>云课堂</span><i class="el-icon-arrow-right"/></div>
                  <div @click="handleTutorial"><span>活教材</span><i class="el-icon-arrow-right"/></div>
                  <div @click="handleBlog"><span>博客</span><i class="el-icon-arrow-right"/></div>
                  <div @click="goToCooperation"><span>合作</span><i class="el-icon-arrow-right"/></div>
                  <div v-if="showLogin" @click="tologin('showlogin')"><span>登录注册</span><i class="el-icon-arrow-right"/></div>
                  <div v-if="!showLogin" @click="handleLearningClass"><span>我学的课</span><i class="el-icon-arrow-right"/></div>
                  <div v-if="!showLogin && isTeacher" @click="handleTeachClass"><span>我教的课</span><i class="el-icon-arrow-right"/></div>
                  <div v-if="!showLogin" @click="handleTeachingPackage"><span>{{ isTeacher ? '我的教学包' : '我的书架' }}</span><i class="el-icon-arrow-right"/></div>
                  <div v-if="!showLogin" @click="outlogin"><span>退出登录</span><i class="el-icon-arrow-right"/></div>
                </div>
              </el-collapse-transition>
            </div>
            <!--未登录-->
            <img v-if="showLogin" src="static/image/indexUser.png" style="width: 25px;height: 25px;margin: 17px 20px" class="responsive-display-none">
            <div style="margin: 5px -10px;height: 50px;line-height: 50px;color: white;cursor: pointer" class="responsive-display-none">
              <span v-if="showLogin" class="indexLog" @click="tologin('showlogin')">登录</span>
              <span v-if="showLogin">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span v-if="showLogin" class="indexLog" @click="tologin('showregister')">注册</span>
            </div>
            <!--已登录-->
            <div v-if="!showLogin" class="responsive-display-none">
              <div class="btn-group">
                <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="display: flex;cursor: pointer">
                  <img :src="userImg" width="50" height="50" style="border-radius: 50%;margin: 5px 30px">
                  <div style="height: 60px;line-height: 60px;font-size: 16px;margin-left: -20px;overflow:hidden;text-overflow:ellipsis; max-width: 130px;white-space:nowrap;color: white">{{ userName }}</div>
                </div>
                <div class="dropdown-menu" style="width: 300px;margin-left: -75px">
                  <div class="userInfo">
                    <img :src="userImg" width="50" height="50" style="border-radius: 50%;">
                    <div style="margin-top: 10px;">{{ userName }}</div>
                  </div>
                  <div class="dropdown-divider"/>
                  <div class="userSomething">
                    <b-row>
                      <b-col sm="4" style="padding: 5px" class="userSomethingChild" @click="handleLearningClass">
                        <div><span class="fa fa-address-book"/></div>
                        <div>我学的课</div>
                      </b-col>
                      <!--<b-col sm="4" style="padding: 5px" class="userSomethingChild">
                        <div><span class="fa fa-bell"></span></div>
                        <div>消息</div>
                      </b-col>-->
                      <b-col
                        v-if="isTeacher"
                        sm="4"
                        style="padding: 5px"
                        class="userSomethingChild"
                        @click="handleTeachClass()">
                        <div><span class="fa fa-star"/></div>
                        <div>我教的课</div>
                      </b-col>
                      <!--<b-col sm="4" style="padding: 5px" class="userSomethingChild"  @click="toCustomer()">
                        <div><span class="fa fa-headphones"></span></div>
                        <div  >在线客服</div>
                      </b-col>-->
                      <!-- <b-col sm="4" style="padding: 5px" class="userSomethingChild">
                        <div><span class="fa fa-cog"></span></div>
                        <div>设置</div>
                      </b-col> -->
                      <b-col
                        sm="4"
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
        <div class="teaching-title-box responsive-display-none">
          <span class="teaching-title">教学实训云</span>
          <!--<span class="versions-type">高校版</span>-->
        </div>
        <div style="line-height: 35px;margin-top:2px;margin-left:80px;text-align: left;font-size: 18px;font-weight: normal;color: white" class="responsive-display-none">依托云技术，采用“平台+”的方式，融合容器技术和虚拟化技术，构建多维度、<br>个性化、智能化的数字化教育资源体系，促进教育机构、企业”资源、教学、实训、评价”  <br>完整可持续发展的学习生态系统。</div>
        <div :class="['responsive-display-none',showLogin ? 'kaike1' : 'kaike']" @click="handleBeginClass"><img :src="(isTeacher || showLogin) ? 'static/image/teacher.png' : 'static/image/student.png'">{{ (isTeacher || showLogin) ? '我要开课' : '&nbsp;我要学习' }}</div>
        <div v-if="showLogin" class="listenClass responsive-display-none" @click="handleBeginClass"><img src="static/image/student.png">&nbsp;我要学习</div>
      </div>
    </div>
    <div class="display-block2">
      <div class="teaching-title-box">
        <span>教学实训云</span>
        <!--<span class="versions-type">高校版</span>-->
      </div>
      <div class="teaching-title-info">依托云技术，采用“平台+”的方式，融合容器技术和虚拟化技术，构建多维度、个性化、智能化的数字化教育资源体系，促进教育机构、企业”资源、教学、实训、评价” 完整可持续发展的学习生态系统。</div>
      <div class="teaching-btn">
        <div :class="[showLogin ? 'kaike1' : 'kaike']" style="margin-right:20px" @click="handleBeginClass"><img :src="(isTeacher || showLogin) ? 'static/image/teacher.png' : 'static/image/student.png'">{{ (isTeacher || showLogin) ? '我要开课' : '&nbsp;我要学习' }}</div>
        <div v-if="showLogin" class="listenClass" style="margin-left:20px" @click="handleBeginClass"><img src="static/image/student.png">&nbsp;我要学习</div>
      </div>
    </div>
    <!-- 携手布道师-->
    <div class="goose">
      <div class="module">携手布道师&nbsp;&nbsp;&nbsp;&nbsp;培养新工科应用型人才</div>
      <div class="module_nameEn">高效教学，轻松实训&nbsp;&nbsp;让每个人都有出彩机会。&nbsp;&nbsp;</div>
      <b-row style="width: 100%;margin:20px auto;">
        <b-col sm="3">
          <div class="goose_content">
            <img src="static/image/goose_a.png" style="width: 128px;height: 128px">
            <div class="introduce_title">智慧教学</div>
            <div class="introduce">海量资源，轻松备课；智慧平台设计教学；移动端互动激活课堂；过程多维评价。</div>
          </div>
        </b-col>
        <b-col sm="3">
          <div class="goose_content">
            <img src="static/image/goose_b.png" style="width: 128px;height: 128px">
            <div class="introduce_title">智慧实训</div>
            <div class="introduce">随时随地在线学习；课堂互动；在线笔记；在线提问；在线作业；在线项目实训。</div>
          </div>
        </b-col>
        <b-col sm="3">
          <div class="goose_content">
            <img src="static/image/goose_c.png" style="width: 128px;height: 128px">
            <div class="introduce_title">智慧管理</div>
            <div class="introduce">智能课表设计；智能学籍归档；教学质量管控；学习过程监督；教学质量分析。</div>
          </div>
        </b-col>
        <b-col sm="3">
          <div class="goose_content">
            <img src="static/image/goose_d.png" style="width: 128px;height: 128px">
            <div class="introduce_title">智慧评价</div>
            <div class="introduce">智能题库，智能组卷，智能评分；在线考试；职业能力模型设计，学习过程量化。</div>
          </div>
        </b-col>
      </b-row>
    </div>
    <!-- 教育机构-->
    <div class="education">
      <div class="module_name">教育机构&nbsp;·&nbsp;互联网解决方案</div>
      <b-row ref="education" class="education-content">
        <transition name="educationImg">
          <b-col v-show="showEducation" sm="8" class="education-img">
            <img src="static/image/education_a.png">
          </b-col>
        </transition>
        <transition name="education">
          <b-col v-show="showEducation" sm="4" class="education-right">
            <div class="education-right-content">
              <div class="edu">
                <div class="edu_org">云端资源</div>
                <div class="edu_org_title">教材库、教案库、题库、项目库，多库联动，云端资源更丰富</div>
              </div>
              <div class="edu">
                <div class="edu_org">高校教务管理</div>
                <div class="edu_org_title">排课、学员管理，教学监督，教学治理，快速效率</div>
              </div>
              <div class="edu">
                <div class="edu_org">线上线下课堂</div>
                <div class="edu_org_title">直播录播在线教学、线上1V1、1VN灵活授课</div>
              </div>
              <div class="edu">
                <div class="edu_org">灵活课堂互动</div>
                <div class="edu_org_title">学、练、测、考结合，学员学习效果有保障</div>
              </div>
            </div>
          </b-col>
        </transition>
      </b-row>
    </div>
    <!-- 知识付费-->
    <div class="knowledge">
      <div class="module_name">企业内训&nbsp;·&nbsp;互联网解决方案</div>
      <b-row ref="knowledge" class="knowledge-content">
        <transition name="knowledge">
          <b-col v-show="showKnowledge" sm="4" class="knowledge-right">
            <div class="knowledge-right-content">
              <div class="edu">
                <div class="edu_org">多种内容形式</div>
                <div class="edu_org_title">图文、音视频、直播、录播，满足各类课程需求</div>
              </div>
              <div class="edu">
                <div class="edu_org">课堂互动多样化</div>
                <div class="edu_org_title"> 投票问卷、头脑风暴、答疑讨论、小组任务、抢答紧张刺激，给课堂氛围加点料</div>
              </div>
              <div class="edu">
                <div class="edu_org">高效社群功能</div>
                <div class="edu_org_title">分享图文视频，记录企业内训美好瞬间；小游戏互动，让学习娱乐两不误</div>
              </div>
              <div class="edu">
                <div class="edu_org">精准数据分析</div>
                <div class="edu_org_title">随时掌控教学实训数据，多维分析内训结果，颁发培训合格证书</div>
              </div>
            </div>
          </b-col>
        </transition>
        <transition name="knowledgeImg">
          <b-col v-show="showKnowledge" sm="8" class="knowledge-img">
            <img src="static/image/knowledge_a.png">
          </b-col>
        </transition>
      </b-row>
    </div>
    <!-- 校企合作 -->
    <div class="enterprise">
      <div class="module_name">我们的客户</div>
      <div class="module_nameEn">我们为每位客户提供最有效的量化解决方案</div>
      <div class="module_showList" @click="toCooperate()">查看全部<i class="fa fa-chevron-right" aria-hidden="true" style="margin-left: 5px"/></div>
      <b-row style="width: 100%;margin:20px auto;">
        <b-col v-for="(item,index) in partnerList" :key="index" sm="2" cols="4" style="margin:10px 0;">
          <a :href="item.companyWebsite" :title="item.companyName" target="_blank"><img :src="item.companyLogo" alt="" class="partner-img"> </a>
        </b-col>
      </b-row>
    </div>
    <!-- 尾部 -->
    <footer-nav/>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { baseUrl, alert, confirm, delCookies, tokenKeyName } from '@/utils/global'
import { handleImagePath } from '@/utils/util'
import BroadsideNav from '../components/broadside-nav'
import FooterNav from '../components/footer-nav'
export default {
  name: 'Hello',
  components: {
    'footer-nav': FooterNav,
    'broadside-nav': BroadsideNav
  },
  metaInfo: {
    title: '布道师', // set a title
    meta: [{ // set meta
      name: 'keywords',
      content: '布道师，软件实训，企业内训，教学实训，智慧教学，智慧实训，智慧管理，智慧评价，budaos,budaos.com，布道师高校版，布道师高校版小程序'
    }, { // set meta
      name: 'description',
      content: '依托云技术，采用“平台+”的方式，融合容器技术和虚拟化技术，构建多维度、个性化、智能化的数字化教育资源体系，促进教育机构、企业”资源、教学、实训、评价”完整可持续发展的学习生态系统。'
    }]
  },
  data() {
    return {
      isShowNav: false,
      showLogin: true,
      showUserName: false,
      isTeacher: false,
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
      showEducation: false,
      showKnowledge: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  created() {
    this.showHeaderData()
    this.showIndexData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 渲染头像和昵称
    showHeaderData: function() {
      const token = Cookies.get(tokenKeyName)
      if (token) {
        this.$api.login.getUser().then((res) => {
          // 处理头像
          res.data.traineeHead = handleImagePath(res.data.traineeHead)
          // 保存至缓存中
          localStorage.setItem('username', res.data.nickName)
          localStorage.setItem('userimg', res.data.traineeHead)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          localStorage.setItem('isTeacher', res.data.isTeacher ? 'Y' : 'N')
          const userInfo = JSON.parse(localStorage.getItem('userInfo'))
          this.userName = userInfo.nickName
          this.isTeacher = userInfo.isTeacher
          this.userImg = localStorage.getItem('userimg')
          this.showLogin = false
          this.showUserName = true
          this.webSockets.setInit(this, {
            paramStr: 'id=' + userInfo.traineeId + '&channel=site&token=' + token
          })
        })
      } else {
        localStorage.setItem('showLoginVue', 'showlogin')
        this.showLogin = true
      }
    },
    goToPage() {
      // window.location.reload()
    },
    // 点击跳转到我要合作页面
    goToCooperation() {
      this.$router.push('/cooperation')
    },
    goToOssbar() {
      window.open('http://www.ossbar.com')
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
    handleTutorial: function() {
      this.$router.push('/tutorial')
    },
    // 点击博客
    handleBlog() {
      this.$router.push('/blog')
    },
    // 点击我要学习
    handleHearClass: function() {
      this.$router.push('/hear-class')
    },
    // 校企合作更多
    toCooperate: function() {
      this.$router.push('/partner')
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
            that.isShowNav = false
          } else {
            alert(res.code)
          }
        })
      })
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
    // 我的课表
    goToMySchedulePage() {
      this.$router.push('/my-schedule')
    },
    // 我的成绩 or 学生成绩
    goToMyScorePage() {
      this.$router.push('/student-score')
    },
    handleScroll() { // 实现当滚动到指定位置，触发动画
      // let scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 获取窗口滚动条高度
      // this.gdjz('earth', 'earth animated bounceInDown', 50)
      const dom1 = this.$refs.education.getBoundingClientRect().top
      const dom2 = this.$refs.knowledge.getBoundingClientRect().top
      // let a1 = eval(d1 + 20);
      // let a2 = eval(d2 + 20);
      // let b = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //  获取窗口滚动条高度
      const c = document.documentElement.clientHeight || document.body.clientHeight // 获取浏览器可视区的高度
      if (dom1 < c) {
        this.showEducation = true
      }
      if (dom2 < c) {
        this.showKnowledge = true
      }
      if (dom1 > c + 20) {
        this.showEducation = false
      }
      if (dom2 > c + 20) {
        this.showKnowledge = false
      }
    }
  }
}
</script>

<style>
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
  .introduce_title{
    font-weight: bold;
    font-size: 16px;
    margin-top: 5px
  }
  .introduce{
    width: 80%;
    margin:5px auto;
    font-size: 14px
  }
  .edu{
    width: 95%;
    margin-bottom: 40px
  }
  .edu_org{
    margin:5px auto;
    font-size: 18px;
    font-weight: bold;
    text-align: left
  }
  .edu_org_title{
    margin:5px auto;
    font-size: 16px;
    text-align: left
  }
  .banner-hidden .banner-background-a {
    height: 85px;
    background:
      url('../../static/image/background_wall-a.png')
      repeat-x;
    position: absolute;
    bottom: 0;
    width: 400%;
    left: -236px;
    animation: wave1 25s linear .4s infinite normal;
    -moz-animation: wave1 25s linear .4s infinite normal;
    -webkit-animation: wave1 25s linear .4s infinite normal;
    -o-animation: wave1 25s linear .4s infinite normal;
  }
  .banner-hidden .banner-background-b {
    height: 100px;
    background:
      url('../../static/image/background_wall-b.png')
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
  .headnav_nav{
    width: 100%;
    max-height: 768px;
    overflow: hidden;
    position: relative;
  }
  .headnav_nav img{
    cursor: pointer;
    animation: scaleDraw 10s ease-in-out infinite;
  }
  .headnav{
    position: relative;
    width: 100%;
    margin: 0px auto;
  }
  .listenClass{
    width: 236px;
    height: 70px;
    margin-left: 400px;
    margin-top: -70px;
    border-radius: 10px;
    background: #0033CD;
    cursor: pointer;
    color: white;
    text-align: center;
    line-height: 70px;
    font-size: 30px;
  }
  .listenClass:hover{
    background: #FF740E;
  }
  .kaike1{
    width: 236px;
    height: 70px;
    margin-left: 80px;
    margin-top: 50px;
    border-radius: 10px;
    background: #0033CD;
    cursor: pointer;
    color: white;
    text-align: center;
    line-height: 70px;
    font-size: 30px;
  }
  .kaike1:hover{
    background: #FF740E;
  }
  .kaike{
    width: 236px;
    height: 70px;
    margin-left: 310px;
    margin-top: 50px;
    border-radius: 10px;
    background: #0033CD;
    cursor: pointer;
    color: white;
    text-align: center;
    line-height: 70px;
    font-size: 30px;
  }
  .kaike:hover{
    background: #FF740E;
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
  .goose{
    max-width: 1220px;
    margin: 5px auto;
    position: relative;
  }
  .goose_content{
    width: 95%;
    padding: 20px;
    background: white;
    margin:10px auto;
    box-shadow: 2px 2px 7px #c3c3c3;
  }
  .education{
    max-width: 1220px;
    margin: 5px auto;
    position: relative;
    overflow: hidden;
  }
  .knowledge{
    max-width: 1220px;
    margin: 5px auto;
    position: relative;
    overflow: hidden;
  }

  .enterprise {
    max-width: 1220px;
    margin: 5px auto;
    position: relative;
  }

  .enterprise img{
    cursor: pointer;
  }
  .module{
    font-size: 24px;
    margin-top: 10px;
    font-weight: 500;
    text-align: center;
  }
  .module_name{
    font-size: 24px;
    margin-top: 100px;
    font-weight: 500;
    text-align: center;
  }
  .module_nameEn{
    margin-top: 10px;
    font-size: 16px;
    text-align: center;
  }
  .module_showList{
    position: absolute;
    right: 30px;
    top: 3px;
    cursor: pointer;
    font-size: 12px;
    color: #666666;
  }
  .teaching-title-box{
      /* height: 70px; */
      margin-top:100px;
      margin-left:80px;
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
  .education-right{
    position: absolute;
    right: 0;
  }
  .education-img{
    position: absolute;
    left: 0;
  }
  .knowledge-right{
    position: absolute;
    left: 0;
  }
  .knowledge-img{
    position: absolute;
    right: 0;
  }
  .education-content{
    width: 100%;
    margin:50px auto;
    position: relative;
    height:422px;
  }
  .knowledge-content{
    width: 100%;
    margin:50px auto;
    position: relative;
    height:422px;
  }
  /* 动画效果 */
  .educationImg-leave { left: 0px; opacity: 1; }
  .educationImg-leave-active { transition: all 1s; }
  .educationImg-leave-to { left: -400px; opacity: 0; }
  .educationImg-enter { left: -400px; opacity: 0; }
  .educationImg-enter-active { transition: all 2s; }
  .educationImg-enter-to { left: 0px; opacity: 1; }

  .education-leave { right: 0px; opacity: 1; }
  .education-leave-active { transition: all 1s; }
  .education-leave-to { right: -400px; opacity: 0; }
  .education-enter { right: -400px; opacity: 0; }
  .education-enter-active { transition: all 2s; }
  .education-enter-to { right: 0px; opacity: 1; }

  .knowledge-leave { left: 0px; opacity: 1; }
  .knowledge-leave-active { transition: all 1s; }
  .knowledge-leave-to { left: -400px; opacity: 0; }
  .knowledge-enter { left: -400px; opacity: 0; }
  .knowledge-enter-active { transition: all 2s; }
  .knowledge-enter-to { left: 0px; opacity: 1; }

  .knowledgeImg-leave { right: 0px; opacity: 1; }
  .knowledgeImg-leave-active { transition: all 1s; }
  .knowledgeImg-leave-to { right: -400px; opacity: 0; }
  .knowledgeImg-enter { right: -400px; opacity: 0; }
  .knowledgeImg-enter-active { transition: all 2s; }
  .knowledgeImg-enter-to { right: 0px; opacity: 1; }
  .display-block2{
    display: none;
  }
  /*---------------------------------- 样式提取 -----------------------------------*/
  /* 布道师logo */
  .indexLogo{
    height: 68px;
    width: 200px;
  }
  /* 导航区域 */
  .nav-area{
    display: flex;
    justify-content: space-between;
    margin: 20px 30px
  }
  /* 导航 */
  .navList{
    width: 700px;
    height: 60px;
    /* margin-left: 300px; */
    display: flex;
  }
  /* 收缩导航栏 */
  .shrink-nav{
    display: none;
    position: relative;
  }
  /* 导航栏图标 */
  .nav-icon{
    font-size: 30px;
    background-color: #fff;
    color: #0033CD;
    border-radius: 5px;
    border: 1px solid #0033CD;
    width: 35px;
    height: 35px;
    line-height: 35px;
  }
  /* 收缩时的导航 */
  .contraction-nav-list{
    position:absolute;
    top: 40px;
    right: -20px;
    background-color: #fff;
    width: 250px;
  }
  .contraction-nav-list div{
    height: 40px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10;
  }
  /* 首页简介 */
  .teaching-title-info{
    line-height: 35px;
    margin-top:2px;
    margin-left:80px;
    text-align: left;
    font-size: 18px;
    font-weight: normal;
    color: white;
  }
  /* 我要开课和学习按钮样式 */
  .teaching-btn{
    display: flex;
    justify-content: center;
    padding: 0 20px;
  }
  .responsive-display-none{
    display: block;
  }
  /* 合作方图片样式 */
  .partner-img{
    width: 150px;
    height: 150px;
    border: 1px #cfcfcf dashed;
    border-radius: 5px;
  }
  /* 响应式布局 */
  @media screen and ( max-width: 650px ){
    .indexLogo{
      width: 90px;
      height: 30px;
    }
    body{
      min-width: 0px;
    }
    .nav-area{
      margin: 0;
      padding: 0 20px;
      background-color: black;
      align-items: center;
    }
    .navList{
      width: 100%;
      margin-left: 0px;
      align-items: center;
      justify-content: flex-end;
    }
    .indexNav{
      display: none;
    }
    .shrink-nav{
      display: block;
    }
    .responsive-display-none{
      display: none;
    }
    .display-block2{
      display: block;
    }
    .banner-hidden .banner-background-a{
      height: 30px;
    }
    .banner-hidden .banner-background-b{
      height: 30px;
    }
    .teaching-title-box{
      color: #2c3e50;
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      margin-top: 20px;
    }
    .teaching-title-info{
      margin: 0;
      color: #2c3e50;
      font-size: 14px;
      padding: 0 20px;
    }
    .kaike1{
      width: 140px;
      margin: 0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
    .kaike1 img{
      width: 30px;
      height: 25px;
    }
    .kaike{
      width: 140px;
      margin: 0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
    .kaike img{
      width: 30px;
      height: 25px;
    }
    .listenClass{
      width: 140px;
      margin: 0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
    .listenClass img{
      width: 25px;
      height: 25px;
    }
    .goose{
      margin: 20px auto 0;
    }
    .module_name{
      margin-top: 20px;
    }
    .edu_org_title{
      text-align: center;
    }
    .edu_org{
      text-align: center;
    }
    .partner-img{
      width: 80px;
      height: 80px;
    }
    .education-content{
      height:622px;
    }
    .knowledge-content{
      height:622px;
    }
    .education-right{
      top: 200px;
    }
    .knowledge-right{
      top: 200px;
    }
    .education-img img{
      height: 180px;
    }
    .knowledge-img img{
      height: 180px;
    }
  }
</style>
