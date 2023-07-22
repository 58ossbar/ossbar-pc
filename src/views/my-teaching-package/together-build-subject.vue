<!-- 共建活教材页面 -->
<template>
  <div class="teaching-package-box">
    <!--导航栏-->
    <headernav2 :current-index="5" :is-hide-nav-on-scroll="true"/>
    <!--头部信息begin-->
    <div class="wind-1240 header-box">
      <div class="serachLibrary" >
        <img :src="pkgInfo.pkgLogo" class="teaching-packa-img">
        <div class="teaching-packa-info">
          <div :title="pkgInfo.pkgName" class="teaching-packa-info-name">{{ pkgInfo.pkgName }}</div>
          <div :title="pkgInfo.pkgDesc" class="belong-to-department">{{ pkgInfo.pkgDesc }}</div>
        </div>
        <div class="edit-teaching-package-user">
          <div class="title">{{ pkgInfo.deployMainType }}</div>
          <div class="user-info-box">
            <div v-if="pkgInfo.createUserInfo" class="user-info">
              <img :src="pkgInfo.createUserInfo.traineePic ? pkgInfo.createUserInfo.traineePic : 'static/image/teach1.jpg'" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>主编</div>
                <div>{{ pkgInfo.createUserInfo.traineeName }}</div>
              </div>
            </div>
            <div v-if="pkgInfo.subeditorInfo" class="user-info">
              <img :src="pkgInfo.subeditorInfo.traineePic" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>副主编</div>
                <div>{{ pkgInfo.subeditorInfo.traineeName }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-teaching-package-info">
          <div>
            版本：{{ pkgInfo.pkgVersion }}
          </div>
          <div>
            适用范围：{{ pkgInfo.pkgLevel }}
          </div>
          <div>
            学分：{{ pkgInfo.classScore }}分
          </div>
        </div>
        <div class="teaching-package-state">
          <span> {{ pkgInfo.pkgLimit }}</span>
        </div>
      </div>
    </div>
    <!--头部信息end-->
    <!--主体内容begin-->
    <div class="teaching-center wind-1240 serachContent pkg-page-center-min-height" style="margin:10px auto;position: relative;">
      <div class="left-teaching-center-con">
        <nav class="resouse-teach-nav">
          <div id="nav-tab" class="nav nav-tabs" role="tablist">
            <span
              id="nav-profile-tab"
              class="nav-item nav-link  active"
              data-toggle="tab"
              href="#nav-profile"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >活教材(<span>{{ pkgInfo.pkgResCount }}</span>)</span>
          </div>
        </nav>
        <div id="nav-tabContent" class="tab-content">
          <!--活教材begin-->
          <div id="nav-profile" class="tab-pane fade  show active" role="tabpanel" aria-labelledby="nav-profile-tab">
            <teaching-material
              v-if="subjectId!==''"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              :has-permission="hasPermission"
              :is-classroom-detail="false"
              :is-hide-nav-on-scroll="true"
              :has-permission-actual="hasPermissionActual"
            />
          </div>
          <!--活教材end-->
        </div>
      </div>
    </div>
    <!--主体内容end-->
  </div>
</template>

<script>
import Headernav2 from '@/components/header-nav-start-class'
import { baseUrl } from '@/utils/global'
import TeachingMaterial from './teaching-material'
export default {
  name: 'TogetherBuildSubject',
  components: {
    Headernav2,
    TeachingMaterial
  },
  prop: {},
  data() {
    return {
      // 是否用权限
      hasPermission: true,
      //
      hasPermissionActual: false,
      // 教学包
      pkgId: '',
      // 教学包对应的课程
      subjectId: '',
      // 教学包相关信息
      pkgInfo: {
        createUserInfo: {
          traineePic: '1.jpg',
          traineeName: '李四'
        },
        subeditorInfo: {
          traineePic: '1.jpg',
          traineeName: '张三'
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    /* console.log(this.$store.state.pkg)
      this.pkgId = this.$store.state.pkg.pkgId*/
    /* if (this.$route.params) {
        let data = Object.assign({}, this.$route.params)
        if (data) {
          this.pkgId = data.pkgId
          this.viewPkgInfo()
        }
      }*/
    this.pkgId = localStorage.getItem(this.constant.PKG_ID_FOR_TOGETHER_BUILD)
    this.subjectId = localStorage.getItem(this.constant.PKG_ID_SUBJECT_FOR_TOGETHER_BUILD)
    this.viewPkgInfo()
  },
  mounted() {

  },
  updated() {},
  methods: {

    // 查看教学包信息
    viewPkgInfo() {
      this.$api.pkgInfo.viewPkgInfo(this.pkgId).then(res => {
        if (res.code === 0) {
          // 教学包封面
          res.data.pkgLogo = baseUrl + res.data.pkgLogo
          // 教学包对应的课程
          this.subjectId = res.data.subjectId
          // 主编
          const traineePic = res.data.createUserInfo.traineePic
          if (!(traineePic.indexOf('https') !== -1 || traineePic.indexOf('http') !== -1)) {
            res.data.createUserInfo.traineePic = baseUrl + traineePic
          }
          // 副主编
          const subeditorPic = res.data.subeditorInfo.traineePic
          if (subeditorPic) {
            if (!(subeditorPic.indexOf('https') !== -1 || subeditorPic.indexOf('http') !== -1)) {
              res.data.subeditorInfo.subeditorPic = baseUrl + subeditorPic
              res.data.subeditorInfo.traineePic = baseUrl + subeditorPic
            }
          }
          this.pkgInfo = res.data
          this.pkgInfo.pkgLimit = '共建中'
          this.hasPermissionActual = res.data.hasPermissionActual
        }
      })
    }

  }
}
</script>

<style scoped>
  /* 头部start */
  .header-box{
    display: flex;
    position: relative;
    background: white;
    margin:10px auto;
    text-align: left;
    overflow: hidden;
  }
  .header-box .serachLibrary{
    padding:5px;
  }
  .header-box .teaching-packa-img{
    width: 120px;
    height: 100px;
    margin-left: 10px
  }
  .header-box .teaching-packa-info{
    flex:1.3;
    margin: 0 20px;
    width: 400px;
  }
  .header-box .teaching-packa-info >div{
    height: 50px;
    line-height: 50px;
    overflow: hidden
  }
  .header-box .teaching-packa-info .teaching-packa-info-name{
    font-size: 20px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header-box .teaching-packa-info .belong-to-department{
    font-size: 14px;
    line-height: 20px;
    height: 40px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .header-box .edit-teaching-package-user{
    flex:1;
    height: 100px;
    margin-right: 20px;
    border-right: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
  }
  .header-box .edit-teaching-package-user .title{
    text-align: center;
  }
  .header-box .edit-teaching-package-user .user-info-box{
    display: flex;
    justify-content: center;
    height: 50px;
    margin-top:10px;
  }
  .header-box .edit-teaching-package-user .user-info-box .user-info{
    display: flex;
    height: 50px;
    margin:0px 10px;
  }
  .edit-teaching-package-user .user-info-box .user-info .user-img{
    border-radius: 20px;
    margin-top: 5px;
  }
  .edit-teaching-package-user .user-info-box .user-info .right-user-detail{
    margin-left:10px;
  }
  .edit-teaching-package-user .user-info-box .user-info .right-user-detail > div{
    height: 25px;
    line-height: 25px;
  }
  .right-teaching-package-info{
    flex:1;
    padding-left: 10px;
    font-size: 14px;
    text-align: left;
  }
  .right-teaching-package-info > div{
    height: 30px;
    line-height: 30px;
  }
  .teaching-package-state{
    position: absolute;
    top: 25px;;
    right:-43px;
    width: 184px;
    height:30px;
    line-height:30px;
    text-align: center;
    transform: rotate(40deg);
    background-color: #fec446;
    color: #fff;
  }
  .teaching-package-state > span{
     display: inline-block;
   }
  /* 头部end */

  /* 主体内容begin */

  .teaching-center{
    display: flex;
    min-height: 60vh;
    justify-content: space-between;
    padding: 0;
    background-color: transparent;
  }
  .left-teaching-center-con{
    width: 100%;
    height:100%;
    /*padding-top:15px;*/
    border-radius: 5px;
    background: white;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1);
  }
  .teaching-package-box{
    background: #f5f5f5;
  }
  .resouse-teach-nav .nav-tabs .nav-item{
    height:36px;
    line-height:32px;
    cursor: pointer;
  }

</style>
