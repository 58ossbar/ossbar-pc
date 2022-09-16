<!-- 我的教学包显示页面 -->
<template>
  <div class="my-teaching-package-box backgroundColorGrey">
    <header-nav :current-index="5"/>
    <div class="continaer">
      <div class="my-teaching-nav wind-1240">
        <div class="display-flex">
          <div class="location">
            <div class="localtion-title"><b>当前位置:</b></div>
            <ul class="localtion-list">
              <li class="localtion-item" style="cursor: pointer" @click="toback()">
                管理看板
              </li>
              <li v-if="ifTeacher" class="localtion-item">
                <span>教学包</span>
              </li>
              <li v-if="ifTeacher" class="localtion-item">
                <span style="color: #959da0">我的教学包</span>
              </li>
              <li v-if="!ifTeacher" class="localtion-item">
                <span style="color: #959da0">我的书架</span>
              </li>
            </ul>
          </div>
          <div class="classroom-back">
            <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
            <span @click="toback()">返回</span>
          </div>
        </div>
        <div class="my-teaching-search">
          <el-select v-if="ifTeacher" v-model="params.type" size="medium" style="margin-left:20px;" placeholder="请选择教学包状态" @change="toShowPkgList">
            <el-option
              v-for="item in releaseStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="params.subjectId" size="medium" style="margin-left:20px;" placeholder="请选择教学包状态" @change="toShowPkgList">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"/>
          </el-select>
          <el-input
            :placeholder="'请输入' + (ifTeacher ? '教学包' : '书籍') + '名称'"
            v-model="params.pkgName"
            size="medium"
            style="width:20%;margin-left:2%;"
            clearable
            @keyup.enter.native="toShowPkgList"/>
          <el-input
            v-if="ifTeacher"
            v-model="params.pkgVersion"
            placeholder="请输入教学包版本号"
            size="medium"
            style="width:20%;margin-left:2%;"
            clearable
            @keyup.enter.native="toShowPkgList"/>
          <el-button type="primary" icon="el-icon-search" style="margin-left:2%;" size="medium" @click="toShowPkgList">搜索</el-button>
        </div>
      </div>
      <div class="my-teaching-package wind-1240">
        <!--<div class="location" style="height: 60px;">
                    <div class="localtion-title"><b>当前位置:</b></div>
                    <ul class="localtion-list">
                        <li class="localtion-item"@click="toback()" style="cursor: pointer">
                            管理看板
                        </li>
                        <li class="localtion-item">
                            <span style="color: #959da0">我的教学包</span>
                        </li>
                    </ul>
                    <div class="classroom-back">
                      <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"></i>
                      <span @click="toback()">返回</span>
                    </div>
                </div>-->

        <div class="serachLibrary teaching-package-con">
          <!-- col-md-2 col-sm-4  -->
          <div
            v-if="ifTeacher"
            class="booksAddB add-teaching-package-btn"
            @click="addPkgInfo">
            <!--@click="toTeachingPackageDetail"-->
            <img style="display: block;margin:110px auto 10px;" src="static/image/addClassromm.png">
            <span style="color: #959da0">新建教学包</span>
          </div>
          <div
            v-for="item in pkgList"
            :key="item.pkgId"
            class="teaching-package-items"
            @click="toTeachingPackageDetail(item)">
            <div v-if="!item.isShowChildren" class=" cb-video-l ">
              <div class="cb-bookbox" >
                <div class="tg-postbook">
                  <figure class="tg-featureimg">
                    <div v-if="item.pkgLogo" class="tg-bookimg">
                      <div class="tg-frontcover"><img :src="item.pkgLogo" :onerror="logo" alt="image description"></div>
                      <div class="tg-backcover"><img :src="item.pkgLogo" :onerror="logo" alt="image description"></div>
                    </div>
                    <div v-else class="tg-bookimg">
                      <div class="tg-frontcover">
                        <img src="static/creatorblue/img/wk1.jpg" alt="image description">
                      </div>
                      <div class="tg-backcover">
                        <img src="static/creatorblue/img/wk1.jpg" alt="image description">
                      </div>
                    </div>
                  </figure>
                </div>
                <img class="img-fluid" src="static/creatorblue/img/wkbg.png">
              </div>
              <div class="cb-bookbox-name displayFlex flexCenter">
                <div :title="item.pkgName" class="font-weight-bolder" style="width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: left;">{{ item.pkgName }}</div>
              </div>
              <div class="cb-bookbox-author-num displayFlex flexCenter">
                <span class="cb-bookbox-author"><span :title="item.pkgTraineeName">{{ (item.pkgTraineeName) | ellipsis }} 著</span></span>
                <!--<span class="cb-bookbox-num">被引用{{item.pkgRefCount}}<span>次</span></span>-->
                <span v-if="item.releaseStatus == 'Y'" class="cb-bookbox-num">{{ item.howManyPeopleUseIt }}人在使用</span>
              </div>
              <!-- !item.isCreator && item.isTogetherBuild -->
              <span v-if="!item.isCreator && item.isTogetherBuild && ifTeacher" class="together active" style="height:20px;width: 100px;"/>
              <span v-if="item.type == 'auth'" class="auth active"/>
              <span v-if="item.type == 'receiver'" class="receiver active"/>
              <!-- <div v-if="item.isCreator" :class="['teaching-package-state',item.releaseStatus === 'N' ? 'teaching-package-state-N':'teaching-package-state-Y']">
                              <span>{{item.releaseStatus === 'N' ? '未发布' : '已发布'}}</span>
                            </div> -->
            </div>

            <!-- 教学包历史版本显示 -->
            <div v-if="item.isShowChildren" class="version-history">
              <div :title="item.pkgName" class="version-history-title">
                {{ item.pkgName }}
              </div>
              <div v-for="(item0,index0) in item.children" :key="index0" class="history-choose" @click.stop="toTeachingPackageDetail(item0)">
                <!-- <div class="version-history-info">{{item0.pkgName}}</div>
                              <div class="version-history-info version-text"><span>{{item0.pkgVersion}}</span> <span>{{item0.createTime}}</span></div> -->
                <!-- item0.isCreator && item0.hasDeleteIcon -->
                <el-tag
                  :style=" item0.hasDeleteIcon ? '' : 'padding-right:28px;'"
                  :type=" index0%3 === 0 ? 'success' : (index0%3 === 1 ? 'warning' : '')"
                  :closable="item0.hasDeleteIcon"
                  class="version-history-nav"
                  @close="delPkgTrainee(item0.pkgId)">
                  <span>{{ item0.pkgVersion }}</span>
                  <span class="version-history-info">{{ item0.createTime.substring(0, 16) }}</span>
                </el-tag>
              </div>
            </div>
            <i v-if="item.hasDeleteIcon && ifTeacher" class="fa fa-times-circle-o del-code" aria-hidden="true" @click.stop="delPkgTrainee(item.pkgId)"/>
            <i v-if="item.hasEditPermission && !item.isShowChildren && ifTeacher" class="fa fa-edit edit-code" aria-hidden="true" @click.stop="updatePkg(item.pkgId)"/>
            <img v-if="ifTeacher && item.children && item.children.length > 0" :src="item.isShowChildren ? 'static/image/teaching_center/back_3.png' : 'static/image/teaching_center/more.png'" :title="item.isShowChildren ? '返回' : '查看衍生版本'" class="more-code" @click.stop="item.isShowChildren = !item.isShowChildren">
          </div>
        </div>
        <div>
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
  </div>
</template>

<script>
// import $ from '@/assets/jquery-vendor'
import { baseUrl, confirm, toast } from '@/utils/global'
import HeaderNav from '@/components/header-nav'
import Pager from '@/components/pager'
import { handleImagePath } from '@/utils/util'
// import FooterNav from '@/components/footer-nav-not-info'
export default {
  name: 'MyTeachingPackage',
  components: {
    'header-nav': HeaderNav,
    'pager': Pager
  },
  filters: {
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 4) {
        return value.slice(0, 4) + '..'
      }
      return value
    }
  },
  data() {
    return {
      notifyPromise: Promise.resolve(),
      ifTeacher: false,
      // 查询条件
      params: {
        type: '',
        releaseStatus: '',
        pageNum: 1,
        pageSize: 10,
        pkgName: '',
        pkgVersion: '',
        pkgLimit: '',
        pkgLevel: '',
        deployMainType: '',
        deploySubType: '',
        deployTime: '',
        subjectId: ''
      },
      logo: 'this.src="' + 'static/creatorblue/img/wk1.jpg' + '"', // 默认图片
      pkgList: [], // 教学包数据
      defaultPkgLogo: 'static/image/teaching_package/default_activity.png',
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 9, // 分页大小
        pageSize: 9// 分页大小
      },
      releaseStatusList: [
        /* {value: '',label: '所有状态'},
          {value: 'ower',label: '自建'},
          {value: 'together',label: '共建'},
          {value: 'auth',label: '授权'},*/
      ],
      subjectList: [] // 课程体系
    }
  },
  mounted() {
    // 判断当前人的身份
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.ifTeacher = userInfo.ifTeacher
    // 初始化教学包
    this.showPkgList()
    //
    this.$api.pkgInfo.selectSubjectRefList().then(res => {
      if (res.code === 0) {
        this.subjectList = res.data
        this.subjectList.unshift({ subjectId: '', subjectName: '所有课程体系' })
      } else {
        toast(res.msg)
      }
    })
    this.$api.pkgInfo.getFilterTypeList({}).then(res => {
      this.releaseStatusList = res.data
    })
    // this.findDatas()
    this.$nextTick(function() {
    })
  },
  methods: {
    // 返回
    toback() {
      this.$router.push('/')
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      this.showPkgList()
    },
    // 进入授权页面
    toAuthorization() {
      this.$router.push('/pkg/authorization-package')
    },

    // 进入教学包详情页面
    toTeachingPackageDetail(item) {
      // 如果不是创建者而是共建者，才进入此页面
      if (!item.isCreator && item.isTogetherBuild) {
        localStorage.setItem(this.constant.PKG_ID_FOR_TOGETHER_BUILD, item.pkgId)
        localStorage.setItem(this.constant.PKG_ID_SUBJECT_FOR_TOGETHER_BUILD, item.subjectId)
        this.$store.commit('setPkgId', item.pkgId)
        this.$store.commit('setReleaseStatus', item.releaseStatus)
        const data = Object.assign({}, item)
        this.$router.push({
          name: 'together-build-subject',
          params: data
        })
        return false
      }
      localStorage.setItem('pkgId', item.pkgId)
      localStorage.setItem('isShowActivityState', false)
      this.$store.commit('setPkgId', item.pkgId)
      this.$store.commit('setReleaseStatus', item.releaseStatus)
      this.$router.push({
        path: '/teaching-package-detail',
        name: 'teaching-package-detail'
      })
    },

    toAddLib: function(subjectId) {
      localStorage.setItem('subjectZtreeId', subjectId)
      this.$router.push('/addLibrary')
    },

    /**
     *  查看更多信息
     */
    handleMoreInfo() {

    },

    /**
     * 重选
     */
    toShowPkgList() {
      this.pagerInfo.currPage = 1
      this.showPkgList()
    },

    /** *
     * 渲染教学包列表
     */
    showPkgList() {
      this.params.pageNum = this.pagerInfo.currPage
      this.params.pageSize = this.pagerInfo.pageSize

      if (this.ifTeacher) {
        this.$api.pkgInfo.listPkgInfo(this.params).then((res) => {
          if (res.code === 0) {
            this.pagerInfo.totalPage = res.data.totalPage
            res.data.list.forEach(a => {
              if (a.pkgLogo) {
                // a.pkgLogo = baseUrl + a.pkgLogo
                a.pkgLogo = handleImagePath(a.pkgLogo)
              }
              a.isShowChildren = false
            })
            this.pkgList = res.data.list
            if (res.msgList && res.msgList.length) {
              res.msgList.push(res.msgList[0])
              for (let index = 0; index < res.msgList.length; index++) {
                const item = res.msgList[index]
                this.notifyPromise = this.notifyPromise.then(() => {
                  this.$notify({
                    title: item.msgTitle,
                    message: item.msgContent,
                    type: 'warning'
                  })
                })
              }
            }
          } else {
            toast(res.msg)
          }
        })
      } else {
        this.params.pageSize = 10
        this.$api.pkgInfo.queryBookList(this.params).then((res) => {
          if (res.code === 0) {
            this.pagerInfo.totalPage = res.data.pages
            res.data.list.forEach(a => {
              if (a.pic) {
                a.pic = baseUrl + a.pic
              }
              a.isShowChildren = false
              a.pkgLogo = a.pic
              a.pkgName = a.name
              // a.pkgTraineeName =
            })
            this.pkgList = res.data.list
          } else {
            toast(res.msg)
          }
        })
      }
    },

    updatePkg(pkgId) {
      this.$router.push({
        // path: 'pkg/add-package-info',
        name: 'add-package-info',
        params: { pkgId: pkgId }
      })
    },

    /**
     *  删除教学包
     */
    delPkgTrainee(pkgId) {
      const _this = this
      confirm('你确定要删除这个教学包吗？', function() {
        const formData = new FormData()
        formData.append('pkgId', pkgId)
        _this.$api.pkgInfo.deletePkg(formData).then(res => {
          toast(res.msg)
          if (res.code === 0) {
            // 初始化教学包数据
            _this.showPkgList()
          }
        })
      })
    },

    /**
     * 进入新增教学包页面
     */
    addPkgInfo() {
      const ifTeacher = localStorage.getItem('ifTeacher')
      if (ifTeacher !== 'Y') {
        toast('还未开通新建【教学包】授权，请联系管理员！')
        return false
      }
      this.$router.push('/pkg/add-package-info')
    }

  }
}
</script>

<style scoped>
.my-teaching-package-box{
  height: 100%;
}
.teaching-package-con{
  display: flex;
  flex-wrap: wrap;
}

.teaching-package-items{
  overflow: hidden;
  position: relative;
  width: 18%;
  padding: 10px 10px 0 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  margin: 10px 11px 5px;
  position: relative;
  transition: all 0.75s;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.2); /*opera或ie9*/
  -moz-box-shadow: 0px 0px 5px rgba(0,0,0,0.2); /*firefox*/
  -webkit-box-shadow: 0px 0px 5px rgba(0,0,0,0.2);/* webkit*/
}
.teaching-package-items:hover{
  box-shadow: 0px 0px 10px rgba(0,0,0,0.35); /*opera或ie9*/
  -moz-box-shadow: 0px 0px 10px rgba(0,0,0,0.35); /*firefox*/
  -webkit-box-shadow: 0px 0px 10px rgba(0,0,0,0.35);/* webkit*/
}
.teaching-package-items:hover .del-code{
  display: block;
}
.teaching-package-items:hover .edit-code{
  display: block;
}
.continaer .my-teaching-nav{
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
.continaer .my-teaching-package{
  min-height: 550px !important;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 2px 2px 2px #e0e0e0;
  border: 1px #e0e0e0 solid;
  border-radius: 6px;
}
.add-teaching-package-btn{
  width: 18%;
  height: 300px;
  cursor: pointer;
  margin: 10px 11px 5px;
}
.teaching-package-con{
  box-shadow: none;
}

.together {
  position: absolute;
  right: 0px;
  top:0px;
  z-index: 800;
}
.del-code{
  position: absolute;
  top: 2px;
  right: 2px;
  color: #FF740E;
  font-size: 25px;
  cursor: pointer;
  display: none;
  z-index: 801;
}
.edit-code{
  position: absolute;
  top: 30px;
  right: 2px;
  color: #FF740E;
  font-size: 25px;
  cursor: pointer;
  display: none;
  z-index: 801;
}
.more-code{
  position: absolute;
  bottom: 9px;
  right: 10px;
  color: #FF740E;
  font-size: 25px;
  cursor: pointer;
  z-index: 801;
  width: 20px;
  height: 20px;
}
.version-history{
  height: 255px;
  overflow-y: scroll;
}
.history-choose{
  cursor: pointer;
  margin-bottom: 10px;
}
.version-history-nav{
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  width:100%;
}
.version-history-info{
  width: 80%;
  display: inline-block;
  text-align: left;
  margin-left: 10px;
}
.version-history-title{
  margin: 0 10px 5px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.version-text{
  font-size: 13px;
  display: flex;
  justify-content: space-between;
}
.together.active::before{
  content:'共建中';
  color:#FFFFFF;
  padding-left: 15px;
  text-align: center;
  font-size: .857em;
  position: absolute;
  top: 0px;
  right: -20px;
  background-color:#13ce66;
  transform: rotate(39deg);
  overflow: hidden;
  width:80px;
}
.auth {
  position: absolute;
  right: 0px;
  top:0px;
  z-index: 800;
}
.auth.active::before{
  content:'授权';
  color:#FFFFFF;
  padding-left: 15px;
  text-align: center;
  font-size: .857em;
  position: absolute;
  top: 0px;
  right: -20px;
  background-color:#990055;
  transform: rotate(39deg);
  overflow: hidden;
  width:80px;
}
.receiver {
  position: absolute;
  right: 0px;
  top:0px;
  z-index: 800;
}
.receiver.active::before{
  content:'接管';
  color:#fff;
  padding-left: 15px;
  text-align: center;
  font-size: .857em;
  position: absolute;
  top: 0px;
  right: -20px;
  background-color:#000d99;
  transform: rotate(39deg);
  overflow: hidden;
  width:80px;
}
/* 返回 */
.classroom-back{
  width: 75%;
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
.teaching-package-state{
  z-index: 802;
  position: absolute;
  top: 0px;
  left:-20px;
  width: 80px;
  padding-right: 15px;
  font-size: .857em;
  text-align: center;
  transform: rotate(-45deg);
  color: #fff;
}
.teaching-package-state-N{
  background-color: #da0a25;
}
.teaching-package-state-Y{
  background-color: #13ce66;
}
.display-flex{
  display:flex;
}
</style>
