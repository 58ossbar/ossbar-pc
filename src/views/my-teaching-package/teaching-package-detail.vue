<!-- 教学包的主页面 -->
<template>
  <div class="teaching-package-box">
    <header-nav :current-index="5"/>
    <div class="wind-1240 header-box">
      <div class="serachLibrary" >
        <label class="edit-teaching-packa-img" style="position: relative;">
          <input v-if="pkgInfo.isCreator" type="file" name="ClassImg" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none" @change="changeImage($event)">
          <img :src="pkgInfo.pkgLogo" class="teaching-packa-img">
          <div v-if="pkgInfo.isCreator" class="edit-cover">
            <img src="static/image/edit_1.png" alt="上传图片" title="上传图片">
          </div>
        </label>
        <div class="teaching-packa-info">
          <div :title="pkgInfo.pkgName" class="teaching-packa-info-name">{{ pkgInfo.pkgName }}</div>
          <div :title="pkgInfo.pkgDesc" class="belong-to-department">{{ pkgInfo.pkgDesc }}</div>
        </div>
        <div class="edit-teaching-package-user">
          <div class="title">{{ pkgInfo.deployMainType }}</div>
          <div class="user-info-box">
            <div class="user-info">
              <img :src="pkgInfo.createUserInfo.traineePic ? pkgInfo.createUserInfo.traineePic : 'static/image/teach1.jpg'" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>主编</div>
                <div style="overflow: hidden;max-width: 100px">{{ pkgInfo.createUserInfo.traineeName }}</div>
              </div>
            </div>
            <div class="user-info">
              <img :src="pkgInfo.subeditorInfo.subeditorPic ? pkgInfo.subeditorInfo.subeditorPic : 'static/image/teach1.jpg'" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>副主编</div>
                <div style="overflow: hidden;">{{ pkgInfo.subeditorInfo.traineeName }}</div>
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
          <span> {{ pkgInfo.pkgLimitName }}</span>
        </div>
      </div>
    </div>
    <!--内容begin-->
    <div
      class="teaching-center wind-1240 serachContent pkg-page-center-min-height"
      style="margin:10px auto;position: relative;">
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
            <span
              id="nav-cloud-disk"
              class="nav-item nav-link  "
              data-toggle="tab"
              href="#nav-home"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true">云盘</span>
            <!-- <span class="nav-item nav-link  " id="nav-grouping-tab" data-toggle="tab" href="#nav-grouping" role="tab"
                                aria-controls="nav-grouping" aria-selected="true">消息(100)</span> -->
            <span
              v-if="releaseStatus == 'N'"
              id="nav-teaching-pcks"
              class="nav-item nav-link  "
              data-toggle="tab"
              href="#nav-teachingPcks"
              role="tab"
              aria-controls="nav-grouping"
              aria-selected="true"
              @click="toClickPublicPkgs"
            >发布教学包</span>
          </div>
        </nav>
        <div id="nav-tabContent" class="tab-content">
          <!--文件库begin-->
          <div
            id="nav-home"
            class="tab-pane fade class-member"
            role="tabpanel"
            aria-labelledby="nav-cloud-disk"
            style="width: 100%;">
            <!-- <document-library></document-library>-->
            <cloud-disk ref="cloudDiskPage" :release-status="releaseStatus == 'N' ? true : false" :is-classroom-detail="false"/>
          </div>
          <!--文件库end-->
          <!--活教材begin-->
          <div id="nav-profile" class="tab-pane fade  show active" role="tabpanel" aria-labelledby="nav-profile-tab">
            <teaching-material
              v-if="subjectId!==''"
              ref="teachingMaterialPkgInterface"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              :has-permission="hasPermission"
              :has-permission-actual="hasPermissionActual"
              :is-classroom-detail="false"
              :private-use="privateUse"
            />
          </div>
          <!--活教材end-->
          <!-- 发布教学包begin -->
          <div id="nav-teachingPcks" class="tab-pane fade" role="tabpanel" aria-labelledby="nav-teaching-pcks" style="width: 100%;">
            <publish-teaching-package
              v-if="subjectId!==''"
              ref="publishTeachingPackageInterface"
              :pkg-id="pkgId"
              :pkg-info = "pkgInfo"
              :subject-id="subjectId"/>
          </div>
          <!-- 发布教学包end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/utils/global'
import { handleImagePath } from '@/utils/util'
import $ from '@/assets/jquery-vendor'
import CbEditor from '@/components/cb-editor'
import HeaderNav from '@/components/header-nav'
import CloudDisk from '@/views/teaching-center/cloud-disk'
import RingLing from '../../components/ring-ling'
import teachingMaterial from '@/views/my-teaching-package/teaching-material'
// import activityLibrary from '@/views/my-teaching-package/activity-library' // 原版本
import activityLibrary from '@/views/activity/index'
import publishTeachingPackage from '@/views/my-teaching-package/publish-teaching-package'
import FooterNav from '@/components/footer-nav-not-info'
import { toast } from '@/utils/global'
export default {
  name: 'TeachingPackageDetail',
  components: {
    'cb-editor': CbEditor,
    'header-nav': HeaderNav,
    'ring-ling': RingLing,
    'teaching-material': teachingMaterial,
    'activity-library': activityLibrary,
    'publish-teaching-package': publishTeachingPackage,
    'footer-nav': FooterNav,
    'cloud-disk': CloudDisk
  },
  filters: {
    groupSerialNum: function(value) {
      if (value > 9) return '0' + value
      else if (value > 99) return value
      else return '00' + value
    }
  },
  props: {
    hasPermission: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data() {
    return {
      privateUse: '',
      pkgId: localStorage.getItem('pkgId'), // 当前教学包主键
      pkgInfo: {
        createUserInfo: {},
        subeditorInfo: {}
      }, // 教学包信息
      subjectId: '',
      activityNum: 0, // 活动数量
      releaseStatus: '',
      tabPanelId: '' // 四个tab的id
    }
  },
  created() {
    this.viewPkgInfo()
    this.pkgId = localStorage.getItem('pkgId')
    // console.log(store.state.pkg.releaseStatus)
    // this.releaseStatus = store.state.pkg.releaseStatus
  },
  mounted() {
    // this.viewPkgInfo();

    const that = this
    $('#nav-tab span').on('click', function(e) {
      e.preventDefault()
      $(this).tab('show')
      that.tabPanelId = this.id
      if (that.tabPanelId === 'nav-profile-tab') { // 活教材
        that.$refs.teachingMaterialPkgInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-contact-tab') { // 活动
        that.$refs.activityLibraryInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-cloud-disk') { // 云盘
        that.$refs.cloudDiskPage.isShowPage()
      } else if (that.tabPanelId === 'nav-teaching-pcks') { // 发布教学包
        that.$refs.publishTeachingPackageInterface.toPublishPageOr()
      }
    })
  },
  methods: {

    handleGetaActivityNum(value) {
      this.activityNum = value
    },
    // 教学包封面上传
    changeImage(e) {
      if (!e.target.files[0]) {
        return false
      }
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('file', file)
      this.$api.pkgInfo.updatePkgLogo(formData).then(res => {
        if (res.code === 0) {
          this.viewPkgInfo()
        }
        toast(res.msg)
      })
    },
    // 教学包信息
    viewPkgInfo() {
      this.$api.pkgInfo.viewPkgInfo(this.pkgId).then(res => {
        if (res.code === 0) {
          if (res.data) {
            res.data.pkgLogo = baseUrl + res.data.pkgLogo
            this.subjectId = res.data.subjectId
            const traineePic = res.data.createUserInfo.traineePic
            res.data.createUserInfo.traineePic = handleImagePath(traineePic)
            const subeditorPic = res.data.subeditorInfo.traineePic
            res.data.subeditorInfo.subeditorPic = baseUrl + subeditorPic
            this.pkgInfo = res.data
            this.privateUse = res.data.privateUse
            this.hasPermissionActual = res.data.hasPermissionActual
            this.releaseStatus = res.data.releaseStatus
            this.$store.commit('setReleaseStatus', res.data.releaseStatus)
          }
        } else {
          toast(res.msg)
        }
      })
    },
    /** 点击 发布教学包 */
    toClickPublicPkgs: function() {
      this.$refs.publishTeachingPackageInterface.toPublishPageOr()
    }
  }
}
</script>

<style scoped>
    .teaching-package-box{
        /* height: 100%; */
        background: #f5f5f5;
    }
    .resouse-teach-nav{
        background-color: #f5f5f5;
    }
    .resouse-teach-nav .nav-tabs .nav-item{
        height:36px;
        line-height:32px;
        cursor: pointer;
        width: 130px;
    }
    .teaching-center{
        display: flex;
        min-height: 60vh;
        justify-content: space-between;
        padding: 0;
        background-color: transparent;
        padding-bottom: 20px;
    }
    .left-teaching-center-con{
        width: 100%;
        height:100%;
        /*padding-top:15px;*/
        border-radius: 5px;
        background: white;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1);
    }

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
        margin-left: 10px;
        cursor: pointer;
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
        font-size: 12px;
        height: 50px;
    }
    .header-box .edit-teaching-package-user .user-info-box .user-info{
        display: flex;
        height: 50px;
        margin:15px 10px;
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
        background-color: #ff740e;
        color: #fff;
    }
    .teaching-package-state > span{
        display: inline-block;
    }
    /* 头部end */
    /* 修改教学包图片 */
    .edit-teaching-packa-img{
        display: block;
        position: relative;
        margin-bottom: 0;
    }
    .edit-teaching-packa-img .edit-cover{
        display: none;
        position: absolute;
        top:0;
        left:10px;
        background-color: rgba(0, 0, 0, .5);
        z-index:1;
        text-align: center;
        line-height:100px;
        width: 120px;
        cursor: pointer;
    }
    .edit-teaching-packa-img .edit-cover >img{
        width:40px;
        height:40px;
    }
    .edit-teaching-packa-img:hover .edit-cover{
        display: block;
    }
</style>
