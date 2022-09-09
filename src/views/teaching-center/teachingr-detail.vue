<!-- 课堂的主页面 -->
<template>
  <div class="teaching-center-box" >
    <header-nav :current-index="hasPermission?4:(isTeacher ? 6 : 8)" :is-hide-nav-on-scroll="true"/>
    <div class="wind-1240 header-box">
      <div class="serachLibrary" >
        <img :src="classroomInfo.pic" class="teaching-packa-img">
        <div class="teaching-packa-info">
          <div class="teaching-packa-info-name">
            <div :title="classroomInfo.name" class="name-info">{{ classroomInfo.name }}</div>
          </div>
          <div>
            <span v-if="refPkgVersion" style="font-size: 14px;">教学包版本：{{ refPkgVersion }}</span>
            <el-tag
              v-if="upgradeList.length > 0 && hasPermission"
              style="cursor: pointer;magrin-left:20px;"
              type="success"
              size="mini"
              effect="plain"
              @click="changeVersion">更换版本</el-tag>
          </div>
          <div class="belong-to-department">
            <span :title="pkgInfo.deployMainType">{{ pkgInfo.deployMainType | ellipsis }}</span>
            <span>发布</span>
            <span v-if="pkgInfo.pkgLevel">|</span>
            <span v-if="pkgInfo.pkgLevel">适用于{{ pkgInfo.pkgLevel }}</span>
          </div>
        </div>
        <div class="edit-teaching-package-user">
          <div class="title">
            <span style="font-size: 14px;">邀请码：{{ classroomInfo.invitationCode }}</span>
            <div class="class-qrCode-box" @click="previewPicture()">
              <img
                class="class-qrCode"
                src="static/image/qrCode.png"
                alt="二维码">
            </div>
          </div>
        </div>

        <modal-dialog
          id="preview-picture-box"
          ref="codeModal"
          :is-show-footer-btn="false"
          :title="'课堂邀请码：' + classroomInfo.invitationCode"
          @cancel="closeModal">
          <div slot="main" style="text-align: center;">
            <img :src="classroomInfo.qrCode" style="width: 100%;max-height:100%;" alt="课堂二维码">
          </div>
        </modal-dialog>

        <div class="edit-teaching-package-user edit-teaching-package-teaching">
          <div class="user-info-box">
            <div :title="teacherInfo.teacherName" class="user-info">
              <img :src="teacherInfo.teacherPic" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>教师</div>
                <div style="overflow: hidden;">{{ teacherInfo.teacherName }}</div>
              </div>
            </div>
            <div :title="teacherInfo.teachingAssistantName" class="user-info">
              <img :src="teacherInfo.teachingAssistantPic" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>助教</div>
                <div style="overflow: hidden;">{{ teacherInfo.teachingAssistantName }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div style="margin-left: 50px;width: 1px;height: 110px;margin-top: 15px;background: #b2b2b2"></div> -->
        <div class="right-teaching-package-info">
          <div>
            班级信息
          </div>
          <div style="font-size: 13px">{{ classInfo.className }}</div>
          <div style="font-size: 13px">
            <i class="fa fa-user-circle icon-study-num" aria-hidden="true"/>
            <span>{{ classroomInfo.studyNum }}</span>人学习
          </div>
        </div>
        <div class="teaching-package-state">
          <span> {{ pkgInfo.pkgLimit }}</span>
        </div>
      </div>
    </div>
    <!--内容begin-->
    <div
      class="teaching-center wind-1240 serachContent pkg-page-center-min-height"
      style="margin:10px auto;position: relative;">
      <div class="left-teaching-center-con">
        <nav class="resouse-teach-nav">
          <div id="nav-tab" class="nav nav-tabs">
            <span
              id="nav-profile-tab"
              :class="['nav-item nav-link',(currIndex === 0)?'active':'']">活教材(<span>{{ pkgInfo.pkgResCount }}</span>)</span>
            <span
              id="nav-contact-tab"
              :class="['nav-item nav-link',(currIndex === 1)?'active':'']">活动(<span id="activityNum">{{ pkgInfo.pkgActCount }}</span>)</span>
            <span
              id="nav-home-tab"
              :class="['nav-item nav-link',(currIndex === 2)?'active':'']">课堂成员(<span>{{ studentNum }}</span>)</span>
            <span
              id="nav-cloud-disk"
              ref="cloudDisk"
              :class="['nav-item nav-link',(currIndex === 3)?'active':'']">云盘</span>
          </div>
        </nav>
        <div id="nav-tabContent" class="tab-content">
          <!--活教材begin-->
          <div
            :class="['tab-pane fade',(currIndex === 0)?'show active':'']">
            <teaching-material
              v-if ="subjectId !== '' && hasPermission!=null && tabPanelId !== 'nav-contact-tab'"
              ref="teachingMaterialInterface"
              :has-permission="hasPermission"
              :has-permission-actual="hasPermissionActual"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              :is-classroom-detail="true"
              :is-hide-nav-on-scroll="true"
              :classroom-intro="classroomInfo.intro"/>
          </div>
          <!--活教材end-->
          <!--活动库begin-->
          <div
            :class="['tab-pane fade',(currIndex === 1)?'show active':'']">
            <activity-library
              ref="activityLibraryInterface"
              :is-classroom-detail="isClassroomDetail"
              :has-permission="hasPermission"
              :is-classroom-finished="isClassroomFinished"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              @updateInfo="handleUpdateInfo"/>
          </div>
          <!--活动库end-->
          <!--成员begin-->
          <div
            :class="['tab-pane fade class-member',(currIndex === 2)?'show active':'']"
            style="width: 100%;">
            <classroom-members
              ref="classroomMembersInterface"
              :class-id="classId"
              :pkg-id="pkgId"
              :is-classroom-finished="isClassroomFinished"
              :has-permission="hasPermission"
              :ct-id="ct_id"/>
          </div>
          <!--成员end-->
          <!-- 云盘begin -->
          <div
            :class="['tab-pane fade',(currIndex === 3)?'show active':'']"
            style="width: 100%;">
            <cloud-disk
              ref="cloudDiskPage"
              :has-permission="hasPermission"
              :is-classroom-finished="isClassroomFinished"
              :is-classroom-detail="isClassroomDetail"/>
          </div>
          <!-- 云盘end -->
        </div>
      </div>

      <div class="ringh-teaching-center-menu">
        <div
          v-if="hasPermission"
          class="menu-item-arrow-box"
          role="button"
          data-toggle="collapse"
          href=""
          aria-expanded="true"
          aria-controls=""
          @click="handleScrollSidebar('up')">
          <img src="static/image/teaching_center/arrow_up_1.png" alt="向上滚动" title="向上滚动">
        </div>
        <ul v-if="hasPermission" id="" class="menu-list collapse show">
          <li v-for="(item, index) in sidebarList" :class="( (index+1) <= sideBarCurrIndex[1] && (index+1) >= sideBarCurrIndex[0] ) ?'':'menu-item-none'" :key="index" :title="item.name" :href="(item.sideType && item.sideType == 'screenRecordingTool') ? (item.href) : ''" class="menu-item" @click="handleOpenSidebar(item)">
            <i :class="[item.icon]" style="font-size:23px;"/>
            <p class="hiddenText">{{ item.name }}</p>
          </li>
        </ul>
        <div
          v-if="hasPermission"
          class="menu-item-arrow-box"
          role="button"
          data-toggle="collapse"
          href=""
          aria-expanded="true"
          aria-controls=""
          @click="handleScrollSidebar('down')">
          <img src="static/image/teaching_center/arrow_down_1.png" alt="向下滚动" title="向下滚动">
        </div>
      </div>

    </div>
    <modal-dialog
      id="upgrade-pkg-dialog"
      title="采用教学包版本切换"
      @cancel="cancelUpgradePkg"
      @submit="doUpgradePkg">
      <div slot="main">
        <div style="display: flex; padding: 20px 10px;">
          <div style="width:20%;line-height:40px;">版本选择：</div>
          <el-select v-model="value" placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in upgradeList"
              :key="item.pkgId"
              :label="item.pkgName"
              :value="item.pkgId">
              <template>
                <div>
                  {{ item.pkgName }}
                  <el-tag v-if="item.isInUseing" type="success" size="mini" effect="plain">使用中</el-tag>
                </div>
              </template>
            </el-option>

          </el-select>
        </div>
      </div>
    </modal-dialog>

    <el-dialog
      :visible.sync="boardDialogVisible"
      :fullscreen="boardDialogFullScreen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="function (){ boardDialogVisible = false;boardDialogFullScreen = false; }"
      title="教学白板"
      width="80%"
      class="boardDialogWrapper">
      <div :class="boardDialogFullScreen?'board-area-full':''" class="board-area">
        <iframe id="boardDialog" :src="XBoardSrc" allow="camera;microphone" class="board-area-iframe"/>
      </div>
    </el-dialog>

    <img id="teachingBaseImgId" :src="base64Canvas" style="display:none;" >

  </div>
</template>

<script>
import { baseUrl, toast, preventBackgroundScrolling, doMainUrl } from '@/utils/global'
import $ from '@/assets/jquery-vendor'
import HeaderNav from '@/components/header-nav'
import teachingMaterial from '@/views/my-teaching-package/teaching-material'
import activityLibrary from '@/views/activity/index'
import classroomMembers from '@/views/teaching-center/classroom-members'
import CloudDisk from '@/views/teaching-center/cloud-disk'
import FooterNav from '@/components/footer-nav-not-info'
import Activity from '@/views/activity' // 投票问卷
// 引入模态框组件页面
import ModalDialog from '@/components/modal-dialog'

const toXBoardName = 'budaosToXboardMessage' // window.postMessage 发送给 【白板】 参数originName 的名称
const fromXBoardName = 'xboardToBudaosMessage' // window.postMessage【白板】 发送给 【布道师】 参数originName 的名称
const XBoardSrcQuery = '/XBoard/?customFullScreen=true&toName=' + toXBoardName + '&fromName=' + fromXBoardName + '&doMainUrl=' // 教学白板 弹窗的url的参数

export default {
  name: 'TeachingrDetail',
  components: {
    'header-nav': HeaderNav,
    'teaching-material': teachingMaterial,
    'activity-library': activityLibrary,
    'classroom-members': classroomMembers,
    'footer-nav': FooterNav,
    'activity-modules': Activity,
    'modal-dialog': ModalDialog,
    'cloud-disk': CloudDisk
  },
  filters: {
    groupSerialNum: function(value) {
      if (value > 9) return '0' + value
      else if (value > 99) return value
      else return '00' + value
    },
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '..'
      }
      return value
    }
  },
  data() {
    return {
      base64Canvas: '',
      classroomSetting: {
        radio1: 1,
        radio2: 'up'
      },
      currIndex: 0, // 当前选中的导航下标
      editLoading: false,
      refPkgVersion: '',
      value: '',
      upgradeList: [],
      modalWidth: '40%',
      isClassroomDetail: true,
      isDownUnfold: true,
      ct_id: '', // 课堂id
      classId: '',
      pkgId: '', // 当前教学包主键
      classroomInfo: {}, // 课堂信息
      teacherInfo: {}, // 教师信息
      classInfo: {}, // 班级信息
      pkgInfo: {}, // 教学包信息
      subjectId: '',
      hasPermission: true, // 权限
      hasPermissionActual: false,
      tabPanelId: '', // 四个tab的id
      studentNum: 0, // 课堂人数
      newMsgCount: 0, // 消息的未读数量
      cloudPanNum: 0,
      isClassroomFinished: false, // 课堂是否已结束
      boardDialogVisible: false, //  教学白板弹窗 是否 显示
      boardDialogFullScreen: false, // 教学白板 弹窗 是否 全屏
      XBoardSrc: doMainUrl + XBoardSrcQuery + doMainUrl, // 教学白板 弹窗的url
      // XBoardSrc: 'http://192.168.1.3:8082' + XBoardSrcQuery + doMainUrl, // 教学白板 弹窗的url
      screenShotPlugin: null, // 截图工具 对象
      sidebarListComm: [
        { name: '教学白板', icon: 'el-icon-date', isCustom: true, sideType: 'teachingWhiteboard' },
        { name: '截图工具', icon: 'el-icon-scissors', isCustom: true, sideType: 'screenshotTool' },
        { name: '录屏工具', icon: 'el-icon-video-camera', isCustom: true, sideType: 'screenRecordingTool', href: 'CustomRecorder://' }
      ], // 侧边栏数据
      sidebarList: [], // 侧边栏数据
      rightShortcutPane: [], // 右侧快捷面板信息
      sideBarShowNum: 5, // 右边侧边栏 显示几个 快捷面板 数量
      sideBarCurrIndex: [1, this.sideBarShowNum] // 右侧快捷面板 显示数据的 下标集合
    }
  },
  watch: {
    boardDialogVisible(val) {
      preventBackgroundScrolling(val)
    },
    boardDialogFullScreen(val) {
      document.getElementById('boardDialog').contentWindow.postMessage({ name: 'fullScreenParent', originName: toXBoardName, isFullScreen: val }, '*')
      //  window.postMessage({ name: 'fullScreen',isFullScreen: _t.isFullScreen}, '*')
    }
  },
  destroyed() {
    //  console.log('teaching关闭事件beforeDestroy')
    window.removeEventListener('message', function(event) {
    }, false)
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.isTeacher = userInfo.isTeacher
    this.pkgId = localStorage.getItem('pkgId')
    this.ct_id = localStorage.getItem('ct_id')
    this.subjectId = localStorage.getItem('subjectId')
    this.classId = localStorage.getItem('class_id')
    this.currIndex = 0

    // 获取可更换的教学包
    this.queryUpgradeList()

    this.viewPkgInfo()
    this.queryRightList()
  },
  mounted() {
    if (location.href && location.href.indexOf('http://localhost') > -1) {
      // let n = location.href.indexOf('http://localhost')
      this.XBoardSrc = doMainUrl + XBoardSrcQuery + 'http://' + location.host
    }

    const that = this
    $('#nav-tab span').on('click', function(e) {
      e.preventDefault()
      $(this).tab('show')
      that.tabPanelId = this.id
      if (that.tabPanelId === 'nav-profile-tab') { // 活教材
        that.currIndex = 0
        if (that.$refs.teachingMaterialInterface) {
          that.$refs.teachingMaterialInterface.isShowPage()
        }
      } else if (that.tabPanelId === 'nav-contact-tab') { // 活动
        that.currIndex = 1
        that.$refs.activityLibraryInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-home-tab') { // 课堂成员
        that.currIndex = 2
        that.$refs.classroomMembersInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-cloud-disk') { // 云盘
        that.currIndex = 3
        that.$refs.cloudDiskPage.isShowPage()
      }
    })

    window.addEventListener('message', function(event) {
      if (event.data.originName && event.data.originName === fromXBoardName) {
        if (event.data.name && event.data.name === 'saveToCloudDisk') { // 保存 到云盘   saveToCloudDisk
          that.boardSaveFileToCloudDisk(event.data)
        } else if (event.data.name && event.data.name === 'fullScreen') { // 全屏
          that.boardDialogFullScreen = event.data.isFullScreen
        }
      }
    }, false)
  },
  methods: {
    // 设置课堂人数
    setClassroomStudentNum(value) {
      this.studentNum = value
    },
    /** 点击调用 录屏工具 */
    handleOpenScreenRecording: function(item) {
      window.protocolCheck(item.href, function() {
        // 没有 协议 给出 确认 提示
        var isDownLoad = window.confirm('无此插件，请下载程序！')
        if (isDownLoad) {
          const a = document.createElement('a')
          a.href = `${baseUrl}uploads/download/recorder-1.0.5.exe`
          a.target = '_blank'
          a.click()
        }
      })
    },
    /** 侧边栏点击 事件 */
    handleOpenSidebar(item) {
      if (item.isCustom) {
        if (item.sideType && item.sideType === 'teachingWhiteboard') { // 教学白板
          this.boardDialogVisible = true
        } else if (item.sideType && item.sideType === 'screenshotTool') { // 截图工具
          this.handleOpenScreenShortDialog()
        } else if (item.sideType && item.sideType === 'screenRecordingTool') { // 录屏工具
          this.handleOpenScreenRecording(item)
        }
      } else {
        this.handleOpenSyllabus(item.name)
      }
    },
    /** 侧边栏 快捷面板 滚动 */
    handleScrollSidebar(type) {
      if (type === 'up') { // 向上滚动
        this.sideBarCurrIndex[1] = (this.sideBarCurrIndex[1] - (this.sideBarShowNum) > (this.sideBarShowNum)) ? (this.sideBarCurrIndex[1] - (this.sideBarShowNum)) : (this.sideBarShowNum)
        // this.sideBarCurrIndex = (this.sideBarCurrIndex - 1 > 1) ? (this.sideBarCurrIndex - 1) : 1
      } else if (type === 'down') { // 向下滚动
        const max = (Math.ceil((this.sidebarList.length) / (this.sideBarShowNum))) * (this.sideBarShowNum)

        this.sideBarCurrIndex[1] = (this.sideBarCurrIndex[1] + (this.sideBarShowNum) < max) ? (this.sideBarCurrIndex[1] + (this.sideBarShowNum)) : max
        // this.sideBarCurrIndex = (this.sideBarCurrIndex + 1 < max) ? (this.sideBarCurrIndex + 1) : max
      }
      this.sideBarCurrIndex[0] = this.sideBarCurrIndex[1] - (this.sideBarShowNum - 1)
      this.$forceUpdate()
    },
    /** 点击调用截图工具 */
    handleOpenScreenShortDialog: function() {
      const that = this
      that.screenShotPlugin = new screenShotPlugin({
        enableWebRtc: false,
        level: 9998,
        triggerCallback: (res) => {
          if (res && res.code === 0) {
            //
          }
        }
      })
    },
    boardSaveFileToCloudDisk(params) { // 教学白板 保存到云盘
      // 限制文件上传大小    小于200m
      if (parseInt(params.blob.size) > (200 * 1024 * 1024)) {
        toast('上传的文件不能大于200M')
        return
      }
      params.blob.name = params.fileName // +'.pmg'
      // 创建接口调用所需的传参数据
      const formData = new FormData()
      formData.append('file', params.blob)
      formData.append('type', 'baiban')

      formData.append('pkgId', this.pkgId)
      // 调用文件上传接口
      this.$api.cloudDisk.uploadFile(formData, (progress) => { // 显 示文件进度条
      }, (cancel) => { // 取消文件上传
      }, true).then(res => {
        if (res.code === 0) {
          // 显示该文件上传成功
        } else {
          // 显示该文件上传失败
          params.onError()
        }
        toast(res.msg)
      }).catch(() => {
        // 移出上传异常的文件
      })
    },
    // 获取可更换的版本
    changeVersion(val) {
      $('#upgrade-pkg-dialog').modal('show')
    },
    queryUpgradeList() {
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.queryUpgradeList(formData).then(res => {
        if (res.code === 0) {
          this.upgradeList = res.data
          this.upgradeList.forEach(item => {
            if (item.isInUseing) {
              this.value = item.pkgId
            }
          })
        }
      })
    },
    // 更新版本
    doUpgradePkg() {
      if (!this.value) {
        return false
      }
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      formData.append('pkgId', this.value)
      this.$api.pkgInfo.doUpgradePkg(formData).then(res => {
        if (res.code === 0) {
          // 重新将缓存中的值替换
          localStorage.setItem('subjectId', res.data.subjectId)
          // 重新加载本页面
          // window.location.reload()
          toast(res.msg + '，1秒后重新加载数据')
          setTimeout(() => {
            // 重新加载本页面
            window.location.reload()
          }, 1000)
        } else {
          toast(res.msg)
        }
      })
    },
    // 取消更换版本
    cancelUpgradePkg() {
      $('#upgrade-pkg-dialog').modal('hide')
    },
    closeModal() {
      this.$refs.codeModal.cancelCodeModal()
    },
    previewPicture() {
      this.$refs.codeModal.changeCodeModal()
      $('#preview-picture-box').modal('show')
    },
    handleUnfold() {
      if (this.isDownUnfold) {
        this.isDownUnfold = false
      } else {
        this.isDownUnfold = true
      }
    },
    handleUpdateInfo() {
      this.viewPkgInfo()
    },
    /** 去云盘 */
    toCloudDisk: function() {
      this.$router.push({
        path: '/teaching-center/cloud-disk'
      })
    },
    // 教学包信息
    viewPkgInfo() {
      this.$api.classroom.viewClassroomInfo(this.ct_id).then(res => {
        if (res.code === 0) {
          if (res.data) {
            res.data.classroomInfo.pic = baseUrl + res.data.classroomInfo.pic
            res.data.classroomInfo.qrCode = baseUrl + res.data.classroomInfo.qrCode
            this.refPkgVersion = res.data.refPkgVersion
            this.studentNum = res.data.numData.traineeNum
            this.cloudPanNum = res.data.numData.cloudPanNum
            this.classroomInfo = res.data.classroomInfo
            // this.isClassroomFinished = (res.data.classroomInfo.classroomState === '3' ? true : false)
            this.isClassroomFinished = false
            if (res.data.classroomInfo.classroomState === '3') {
              this.isClassroomFinished = true
            }
            this.teacherInfo = res.data.teacherInfo
            this.classInfo = res.data.classInfo
            this.pkgInfo = res.data.pkgInfo
            this.hasPermission = res.data.hasPermission
            this.hasPermissionActual = res.data.hasPermissionActual
            const teacherPic = res.data.teacherInfo.teacherPic
            if (teacherPic && teacherPic.indexOf('https') === -1 && teacherPic.indexOf('http') === -1) {
              res.data.teacherInfo.teacherPic = baseUrl + teacherPic
            }
            const teachingAssistantPic = res.data.teacherInfo.teachingAssistantPic
            if (teachingAssistantPic.indexOf('https') === -1 && teachingAssistantPic.indexOf('http') === -1) {
              res.data.teacherInfo.teachingAssistantPic = baseUrl + teachingAssistantPic
            }
          }
        }
      })
    },
    /**
     *  打开云盘的教材大纲
     */
    handleOpenSyllabus(title) {
      if (this.tabPanelId !== 'nav-cloud-disk') {
        this.$refs['cloudDisk'].click()
      }
      this.$refs.cloudDiskPage.getLeftNavData(title)
    },
    // 查询右侧快捷面板信息
    queryRightList() {
      this.sideBarCurrIndex = [1, this.sideBarShowNum]
      // this.rightShortcutPane = []
      // this.sidebarList = JSON.parse(JSON.stringify(this.sidebarListComm))
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      this.$api.cloudDisk.queryRightList(formData).then(res => {
        if (res.code === 0) {
          this.rightShortcutPane = res.data
          this.sidebarList = JSON.parse(JSON.stringify(this.sidebarListComm))
          if (this.rightShortcutPane && this.rightShortcutPane.length > 0) {
            for (let i = 0; i < this.rightShortcutPane.length; i++) {
              if (this.rightShortcutPane[i].name.indexOf('教学大纲') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-zichan-quanbushebei'
              } else if (this.rightShortcutPane[i].name.indexOf('任务书') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-renwu'
              } else if (this.rightShortcutPane[i].name.indexOf('讲义PPT') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-ppt'
              } else if (this.rightShortcutPane[i].name.indexOf('实施计划') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-jihua'
              } else if (this.rightShortcutPane[i].name.indexOf('思维导图') > -1) {
                this.rightShortcutPane[i].icon = 'fa fa-themeisle'
              }

              this.sidebarList.push(this.rightShortcutPane[i])
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
    .teaching-center-box{
        height: 100%;
        background: #f5f5f5;
        padding-bottom: 20px;
    }
    .resouse-teach-nav{
        background-color: #f5f5f5;
    }
    .resouse-teach-nav .nav-tabs .nav-item{
        height:39px;
        line-height:39px;
        cursor: pointer;
        width: 130px;
    }
    .teaching-center{
        display: flex;
        justify-content: space-between;
        /* min-height: 70vh; */
        padding: 0;
        background-color: #fff;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1);
    }
    .left-teaching-center-con{
        width: 100%;
        height:100%;
        /* padding-top:15px; */
        border-radius: 5px;
        background: white;
        /* box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1); */
    }
     .ringh-teaching-center-menu{
        position: fixed;
        top:180px;
        left:calc(((100vw - 1200px) / 2 + 1200px + 5px));
        z-index:666;
        min-width:70px;
        /* min-height:300px; */
        font-size: 14px;
        text-align: center;
    /*  border-radius: 5px; */
        background-color: #fff;
        /* padding: 10px 0; */
        box-shadow: 0 0px 13px 0 rgba(0, 0, 0, 0.1)
    }
    .ringh-teaching-center-menu .menu-item-arrow-box{
        width: 100%;
        height: 60px;
        line-height: 63px;
        background-color: #fbfbfb;
        cursor: pointer;
    }
    .ringh-teaching-center-menu .menu-list {
        transition: 0.4s;
        max-height: 392px;
        overflow-y: scroll;
    }
    .ringh-teaching-center-menu .menu-list .menu-item{
        cursor: pointer;
        padding:3px 0;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > img{
        width:25px;
        height:25px;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > p{
        font-size: 12px;
    }
    .ringh-teaching-center-menu .menu-list .menu-item:hover{
        color: #0079fe;
        background-color: #fbfbfb;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > p{
        margin:7px 0;
    }
    .ringh-teaching-center-menu .menu-list .menu-item{
        padding-top: 10px;
        border-top: 1px solid #fafafa;
        /* border-top: 1px solid #eee; */
    }
    .ringh-teaching-center-menu .menu-list .menu-item-none{
      display: none !important;
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
        margin-left: 10px
    }
    .header-box .teaching-packa-info{
        flex:1.3;
        margin: 0 20px;
        border-right: 1px solid #e0e0e0;
    }
    .header-box .teaching-packa-info >div{
        height: 33px;
        line-height: 33px;
        overflow: hidden;
    }
    .teaching-packa-info-name .name-info{
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .header-box .teaching-packa-info .teaching-packa-info-name{
        font-size: 20px;
        display: flex;
        align-items:center;
    }
    .header-box .teaching-packa-info .belong-to-department{
        font-size: 14px;
    }
    .header-box .teaching-packa-info .belong-to-department > span{
        display: inline-block;
        padding-right: 10px;
    }
    .header-box .edit-teaching-package-user{
        flex:1;
        height: 100px;
        border-right: 1px solid #e0e0e0;
    }
    .header-box .edit-teaching-package-teaching{
      flex: 1.3;
    }
    .header-box .edit-teaching-package-user{
        position: relative;
    }
    /* .header-box .edit-teaching-package-user .class-qrCode-box{
        display: inline-block;
    } */
    .header-box .edit-teaching-package-user .class-qrCode-box:hover .hover-class-qrCode{
        display: block;
    }
    .header-box .edit-teaching-package-user .hover-class-qrCode{
        display: none;
        position: absolute;
        right: -47px;
        top:0;
        z-index: 666;
        width:100px;
        height: 100px;
        text-align: center;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }
    .header-box .edit-teaching-package-user .hover-class-qrCode > img{
        width:100px;
        height:100px;
    }
    .header-box .edit-teaching-package-user .class-qrCode{
        width: 70px;
        height: 70px;
        cursor: pointer;
    }
    .header-box .edit-teaching-package-user .title{
        text-align: center;
        margin-top: 5px;
    }
    .header-box .edit-teaching-package-user .user-info-box{
        display: flex;
        justify-content: center;
        font-size: 12px;
        height: 50px;
        margin-top:25px;
    }
    .header-box .edit-teaching-package-user .user-info-box .user-info{
        display: flex;
        /* width: 30%; */
        height: 50px;
        margin:0px 10px;
    }
    .edit-teaching-package-user .user-info-box .user-info .user-img{
        border-radius: 20px;
        margin-top: 5px;
    }
    .edit-teaching-package-user .user-info-box .user-info .right-user-detail{
        margin-left:10px;
        font-size: 12px;
    }
    .edit-teaching-package-user .user-info-box .user-info .right-user-detail > div{
       height: 25px;
       line-height: 25px;
    }
    .header-box .edit-teaching-package-teaching .user-info{
      width: 50%;
      /* justify-content: flex-end;
      justify-content: center; */
    }
    .header-box .edit-teaching-package-teaching .user-info:first-child{
      justify-content: flex-end;
    }

    .right-teaching-package-info{
        flex:1;
        padding-left: 10px;
        font-size: 14px;
        text-align: left;
        margin-left: 20px;
    }
    .right-teaching-package-info > div{
        /* height: 30px;
        line-height: 30px; */
        padding: 6px 0px;
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
        background-color: #FF740E;
        color: #fff;
    }
    .teaching-package-state > span{
        display: inline-block;
    }
    /* 头部end */

    .change-version{
      float:right;
      font-size: 12px;
      padding-right: 15px;
      cursor: pointer;
    }
    /* 经验值设置弹窗样式 */
    .empirical-setting-all-percent{
      /* display: flex;
      align-items: center;
      width: auto; */
      background-color: #f5f5f5;
      border-radius: 20px;
      padding: 5px 10px;
      box-sizing: border-box;
      display: inline-block;
      margin-bottom: 10px;
      /* position: relative;
      left: 0; */
    }
    .empirical-setting-item{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .empirical-setting-item-one{
      width: 10%;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .empirical-setting-item-two{
      width: 15%;
      text-align: left;
    }
    .empirical-setting-item-two input,
    .empirical-setting-item-two /deep/ .el-input,
    .empirical-setting-item-two /deep/ .el-input-number{
      width: 80%;
    }
    .empirical-setting-item-two input{
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: #606266;
    }
    .empirical-setting-item-three{
      width: 75%;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
      line-height: 1.5rem;
    }
    .empirical-setting-item-three input{
      width: 100px;
      border: none;
      border-bottom: 1px solid #409EFF;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      margin-left: 5px;
      margin-right: 5px;
      color: #606266;
    }

    .empirical-setting-item-three /deep/ .el-input{
      width: 100px;
      padding-left: 5px;
      padding-right: 5px;
      box-sizing: border-box;
    }
    .empirical-setting-item-three /deep/ .el-input .el-input__inner{
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom-color: #409EFF;
      height: 30px;
    }
    .empirical-setting-table{
      width: 100%;
      height: 100%;
      /* height: calc(100vh - 15vh - 50px - 54px - 140px); */
    }
    .hiddenText{
      width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .settiongsDialogContentWrapper{
      padding-left: 10px;
      min-height: 220px;
      /* max-height: calc(100vh - 10vh - 54px - 60px - 70px);
      overflow-y: scroll; */
    }

    .boardDialogWrapper /deep/ .el-dialog{
      margin-top: 50px !important;
    }
    .boardDialogWrapper /deep/ .el-dialog.is-fullscreen{
      margin-top: 0px !important;
    }
    .boardDialogWrapper /deep/ .el-dialog__body{
      padding: 10px 20px 10px !important;
    }
    .board-area{
      /* margin-top: -20px; */
      /* margin-bottom: -10px; */
      box-sizing: border-box;
      min-height: 500px;
      height: calc(100vh - 54px - 50px - 50px - 20px);
      /* height: calc(100vh - 54px - 15vh - 50px - 40px); */
    }
    .board-area-full{
      /* margin-top: 50px !important; */
       height: calc(100vh - 54px - 20px);
    }
    .board-area-iframe{
      width: 100%;
      height: 100%;
      border-top: 1px solid rgb(238, 238, 238);
      border-left: 1px solid rgb(238, 238, 238);
    }
    .sort-chose{
      margin-left: 15px;
    }
</style>
