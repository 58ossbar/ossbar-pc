<!-- 云课堂页面 -->
<template>
  <div>
    <!-- 分类查询区域Start -->
    <div class="classroom-all">
      <div class="technology-nav">
        <div class="technology-nav-top">
          <div class="technology-type">职业路径</div>
          <ul class="nav technology-field-nav">
            <li
              v-for="(technosphere, index) in technosphereList"
              :class="{'active-type':clicked==index}"
              :key="technosphere.majorId"
              @click="selectTechnosphere(technosphere.majorId,index)">
              {{ technosphere.majorName }}
            </li>
          </ul>
        </div>
        <div class="technology-nav-bottom">
          <div class="technology-type">课程</div>
          <ul class="nav technology-label-nav">
            <li
              v-for="(subjects, index) in subjectsList"
              :class="{'active-type':subClicked==index}"
              :key="subjects.subjectId"
              @click="selectSubjects(subjects.subjectId,index)">
              {{ subjects.subjectName }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 分类查询区域End -->
    <!-- 排序查询区域Start -->
    <div class="classroom-all category-nav">
      <div class="category-nav-left">
        <ul class="nav category-nav-left-ul">
          <li
            v-for="(item, index) in stateList"
            :class="{'active-type':stateClicked==index}"
            :key="index"
            @click="selectState(item.dictCode,index)">
            {{ item.dictValue }}
          </li>
        </ul>
      </div>
      <div class="category-nav-right">
        <ul class="nav category-nav-left-ul">
          <li
            v-for="(sort, index) in sortList"
            :class="{'active-type':sortClicked==index}"
            :key="index"
            @click="selectSort(sort.sortBy,index)">
            {{ sort.sortName }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 排序查询区域End -->
    <!-- 内容区域Start -->
    <div class="classroom-all tutorial-area">
      <div :class="{'notContent':ClassList.length <= 0}" style="width: 100%">
        <div v-if="ClassList.length <= 0" class="notContent-describe">
          <img src="static/image/manage_board/creatkc.png" alt="">
          <div style="padding-left: 20px; color: #6a7275">
            老师正在快马加鞭地添加此类课堂<span class="dots"/>
          </div>
        </div>
        <div
          v-for="(item, index) in ClassList"
          :key="index"
          style="position: relative"
          class="classroom-area classroom-item">
          <div class="teaching-one-class" style="border-radius: 10px 10px 0 0;overflow: hidden" @click="clickClassroom(item, $event)">

            <div style="overflow: hidden;position: relative;border-top-right-radius: 10px;">
              <img :src="item.pic" class="classroom-pic">
              <div :class="['classroom-state',item.classroomStateBg]"/>

              <div class="classroom-state-title">
                <span>{{ item.classroomStateName }}</span>
              </div>
              <div v-if="item.ifLiveLesson === 'Y'" class="classroom-live-title classroom-live">
                <el-link :title="item.linkUrl" type="primary" @click="clickLinkUrl(item.linkUrl)">进入直播</el-link>
              </div>
            </div>
            <div class="module-info">
              <div>
                <div :title="item.name" class="classroom-name">{{ item.name }}</div>
              </div>
              <div class="teacher-info-area">
                <div class="teacher-info">
                  <div>
                    <img :src="item.teacherPic" class="teacher-pic">
                  </div>
                  <div class="right-teaching-info-detail">
                    <span>授课</span><br>
                    <span class="text-ellipsis name">{{ item.teacherName }}</span>
                  </div>
                </div>
                <div class="teacher-info">
                  <div>
                    <img :src="item.traineePic" class="teacher-pic">
                  </div>
                  <div class="right-teaching-info-detail">
                    <span>教辅</span><br>
                    <span class="text-ellipsis name">{{ item.traineeName }}</span>
                  </div>
                </div>
              </div>
              <div class="classroom-other-info">
                <div class="other-info-item1">
                  {{ item.className }}
                </div>
                <div class="other-info-item2">
                  <div class="classroom-study-num">
                    <i class="fa fa-user-circle icon-study-num" aria-hidden="true"/><span>{{ item.studyNum }}</span>人学习
                  </div>
                  <div class="subject-property-info">{{ item.subjectProperty }}</div>
                </div>
              </div>
              <div class="classroom-info">
                <div style="color: #FFFFFF; font-size: 13px">{{ item.intro | ellipsis }}</div>
                <div style="color: #FFCC61; font-size: 13px">{{ item.teacherName }} &nbsp;&nbsp;发布</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页区域Start -->
      <!-- v-if="ClassList.length > 0" -->
      <div class="pager-content">
        <pager
          v-if="pagerInfo.totalPage"
          ref="pager"
          :page-size-prop="pagerInfo.pageSizeProp"
          :curr-page="pagerInfo.currPage"
          :total-page="pagerInfo.totalPage"
          align="center"
          @changeIndex="changeIndex"
        />
        <!-- <span class="pager-content-text" style="margin-left: 50px">共{{ pagerInfo.totalPage }}页</span>
        <span class="pager-content-text" style="margin-left: 10px">去</span>
        <b-form-input
          v-model="goPage"
          style="margin-left: 5px; width: 50px;"
          class="pager-content-input"
          type="number"
          @keyup.enter="handleToPage()"/>
        <span class="pager-content-text" style="margin-left: 5px">页</span>
        <b-button class="pager-content-button" style="padding: 0 0 0 2px;font-size: 13px" variant="primary" @click="handleToPage()">确定</b-button> -->
      </div>
      <!-- 分页区域End -->
    </div>
    <!-- 内容区域End -->
    <!-- 加入课堂邀请码输入弹出框begin -->
    <modal-dialog
      id="class-code-input"
      :is-show-footer-btn="false"
      title="加入课堂"
      @cancel="cancelClassCodeInput()">
      <div slot="main" style="padding: 0 10%;">
        <div>
          <!-- 邀请码输入 -->
          <div>
            <el-input v-model="classCode" size="small" suffix-icon="el-icon-search" placeholder="请输入邀请码" @input="selectClassroom(classCode)"/>
          </div>
          <!-- 课堂显示 -->
          <div style="min-height:192px;">
            <div v-show="codeClassroom.pic" class="code-class">
              <!-- 课堂图片 -->
              <div class="code-class-img">
                <el-image :src="codeClassroom.pic" style="height:100px;width:130px;"/>
              </div>
              <!-- 课堂基本信息 -->
              <div class="code-class-content">
                <!-- 课堂名称 -->
                <div style="font-weight: bold;font-size:16px;">{{ codeClassroom.name }}</div>
                <div style="font-size:12px;height:35px;width:100%;word-wrap:break-word;word-break:break-all;overflow: hidden;text-overflow: ellipsis;">{{ codeClassroom.intro | ellipsis2 }}</div>
                <div style="font-size:12px;"><i class="fa fa-user-circle icon-study-num" aria-hidden="true"> {{ codeClassroom.studyNum }}人</i></div>
              </div>
            </div>
            <!-- 加入课堂按钮 -->
            <div v-show="codeClassroom.pic" style="text-align:right;margin-bottom:10px;height:32px;">
              <el-button size="small" type="primary" plain @click="joinTheClassroom(codeClassroom,{'ctId':codeClassroom.ctId})">申请加入</el-button>
            </div>
          </div>
        </div>

      </div>
    </modal-dialog>
    <!-- 加入课堂邀请码输入弹出框end -->
  </div>
</template>

<script>
import { baseUrl, toast, tokenKeyName } from '@/utils/global'
import $ from 'jquery'
import Cookies from 'js-cookie'
import Pager from '@/components/pager'
import ModalDialog from '@/components/modal-dialog'

export default {
  name: 'PerseverancePlate',
  components: {
    'pager': Pager,
    'modal-dialog': ModalDialog
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
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    },
    ellipsis2(value) {
      if (!value) return ''
      if (value.length > 40) {
        return value.slice(0, 40) + '...'
      }
      return value
    }
  },
  data() {
    return {
      showLogin: true,
      classCode: '', // 申请加入时课堂输入的邀请码
      codeClassroom: {}, // 输入邀请码得到的课堂
      isSwitchPager: false, // 判断是否是分页的切换
      clicked: 0, // 分类选择下标
      subClicked: 0, // 技术选中下标
      sortClicked: 0, // 排序选中下标
      stateClicked: 0, // 课堂状态选中下标
      technosphereList: [], // 分类
      ClassList: [], // 课堂列表
      subjectsList: [], // 技术
      stateList: [], // 课堂状态值
      // 排序信息
      sortList: [
        { 'sortName': '最新', 'sortBy': 'newest' },
        { 'sortName': '最热', 'sortBy': 'hot' }
      ],
      goPage: null,
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 8, // 分页大小
        pageSize: 8// 分页大小
      },
      majorId: '0', // 当前分类id
      subjectId: '0', // 当前技术id
      sortBy: 'newest', // 当前排序方式
      state: '0', // 当前查询的课堂状态
      dots: 0
    }
  },
  mounted() {
    this.timer = setInterval(this.refreshDots, 500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    // 调用初始化数据
    this.initData()
    const that = this
    window.eventBus.$on('eventBusReceivedMsgData', function(data) {
      that.handleMessBackData(data)
    })
    const token = Cookies.get(tokenKeyName)
    if (token) {
      this.showLogin = false
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.webSockets.setInit(this, {
        paramStr: 'id=' + userInfo.traineeId + '&channel=site&token=' + token
      })
    }
  },
  methods: {
    clickLinkUrl(url) {
      window.open(url)
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function(res) {
      const that = this
      if (res.busitypeIndexNew === 16 || res.busitypeIndexNew === 17 || res.busitypeIndexNew === 18 || res.busitypeIndexNew === 24) { // 当申请加入某个课堂时  这个消息表示课堂创建者“通过”或者“不通过”了我的申请
        if (res.code === 0) {
          that.initData()
        }
      }
    },
    // 初始化评测中心数据
    initData: function() {
      // 获取所有分类
      this.getMajor()
      // 获取所有技术
      this.getSubjectsList()
      // 获取所有课堂信息
      this.getClassList()
      // 获得所有课堂状态
      this.getClassroomState()
    },
    // 获得课堂状态
    getClassroomState() {
      this.state = '0'
      this.sortClicked = 0
      this.stateList = [{ dictValue: '全部', dictCode: '0', dictId: '', dictUrl: '' }]
      // 调用课堂状态查询接口
      this.$api.perseverancePlate.listClassroomState().then(res => {
        if (res.data) {
          // 将查询出来的课堂状态拼接上全部
          const stateArr = res.data
          for (let i = 0; i < stateArr.length; i++) {
            this.stateList.push(stateArr[i])
          }
        }
      })
    },
    // 点的加载动画
    refreshDots() {
      if (this.dots < 6) {
        $('.dots').append('.')
        this.dots++
      } else {
        $('.dots').html('')
        this.dots = 0
      }
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用查询课堂方法
      this.getClassList()
    },
    handleToPage() {
      if (this.goPage) {
        const temp = parseInt(this.goPage)
        if (temp <= this.pagerInfo.totalPage && temp > 0) {
          this.changeIndex(temp)
        } else {
          this.changeIndex(1)
        }
      }
    },
    // 获取分类
    getMajor: function(data) {
      this.technosphereList = [{ majorName: '全部', majorId: '0' }]
      // 查询出所有分类信息
      this.$api.testcenter.getMajor(data).then(res => {
        if (res.data) {
          const technosphereArr = res.data
          // 分类类型中添加全部类型
          for (let i = 0; i < technosphereArr.length; i++) {
            this.technosphereList.push(technosphereArr[i])
          }
        }
      })
    },
    // 获取技术
    getSubjectsList: function(data) {
      this.subjectId = '0'
      this.subClicked = 0
      this.subjectsList = [{ subjectName: '全部', subjectId: '0', subjectLogo: '' }]
      // 查询出所有技术信息
      this.$api.perseverancePlate.listSubjects(data).then(res => {
        if (res.data) {
          const subjectsArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < subjectsArr.length; i++) {
            this.subjectsList.push(subjectsArr[i])
          }
        }
      })
    },
    // 排序改变
    selectSort(sortBy, index) {
      this.sortClicked = index
      this.sortBy = sortBy
      // 调用查询课堂方法
      this.getClassList()
    },
    // 状态改变
    selectState(state, index) {
      this.pagerInfo.currPage = 1
      this.stateClicked = index
      this.state = state
      // 调用查询课堂方法
      this.getClassList()
    },
    // 分类的改变
    selectTechnosphere: function(majorId, index) {
      this.pagerInfo.currPage = 1
      this.clicked = index
      this.majorId = majorId
      let obj = {}
      // 获取分类中的技术
      if (majorId !== '0') {
        obj = { 'majorId': majorId }
      }
      this.getSubjectsList(obj)
      // 获取数据
      this.getClassList()
    },
    // 技术改变
    selectSubjects: function(subjectId, index) {
      // 改变当前点击技术的显示位置
      if (index > 1) {
        const temp = this.subjectsList[index]
        this.subjectsList.splice(index, 1)
        this.subjectsList.splice(1, 0, temp)
        this.subClicked = 1
      } else {
        this.subClicked = index
      }

      this.pagerInfo.currPage = 1
      this.subjectId = subjectId
      // 调用查询课堂方法
      this.getClassList()
    },
    // 获得所有课堂
    getClassList: function() {
      const obj = {
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize,
        sortBy: this.sortBy
      }
      if (this.majorId !== '0') {
        obj['majorId'] = this.majorId
      }
      if (this.state !== '0') {
        obj['classroomState'] = this.state
      }
      if (this.subjectId !== '0') {
        obj['subjectId'] = this.subjectId
      }
      this.$api.classroom.queryClassroomList(obj).then(res => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.totalPage
          res.data.list.forEach(item => {
            // 图片路径处理
            item.pic = baseUrl + item.pic
            if (!(item.teacherPic.indexOf('https') !== -1 || item.teacherPic.indexOf('http') !== -1)) {
              item.teacherPic = baseUrl + item.teacherPic
            }
            if (!(item.traineePic.indexOf('https') !== -1 || item.traineePic.indexOf('http') !== -1)) {
              const traineePic = item.traineePic
              if (traineePic) {
                item.traineePic = baseUrl + traineePic
              }
            }
            if (item.classroomState === '2') {
              item.classroomStateBg = 'classroom-state-start'
            } else if (item.classroomState === '1') {
              item.classroomStateBg = 'classroom-state-nostart'
            } else {
              item.classroomStateBg = 'classroom-state-end'
            }
          })
          this.ClassList = res.data.list
        }
      })
    },
    // 取消课堂邀请码输入
    cancelClassCodeInput() {
      $('#class-code-input').modal('hide')
      this.classCode = ''
      this.codeClassroom = {}
    },
    // 根据邀请码查询课堂
    selectClassroom(value) {
      const obj = { invitationCode: value }
      this.$api.addLearningCourses.serachClassroom(obj).then(res => {
        if (res.code === 0) {
          if (res.data.list.length === 1) {
            if (res.data.list[0].pic.indexOf('http://') === -1 && res.data.list[0].pic.indexOf('https://') === -1) {
              res.data.list[0].pic = baseUrl + res.data.list[0].pic
            }
            this.codeClassroom = res.data.list[0]
          }
        }
      })
    },
    // 点击课堂
    // 根据用户在此课堂中的权限判断后续操作
    clickClassroom(item, event) {
      if (event.target.classList.contains('el-link--inner')) {
        return false
      }
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      // 如果是课堂创建者、或已加入课堂，就直接进入课堂详情页
      if (item.isOwner || (item.isJoined && item.classroomState !== '3')) {
        if (item.classroomState === '3' && item.accessState === 'N') {
          toast('课堂已结束，请与系统管理员联系')
          return false
        }
        this.toClassroomDetails(item)
      } else { // 否则
        if (item.classroomState === '3' && item.accessState === 'N') {
          toast('课堂已结束，请与系统管理员联系')
          return false
        }
        // 如果加入课堂需要审核
        if (item.isCheck === 'Y') {
          // 如果通过了审核则直接进入课堂详情页面
          if (item.isPass) {
            this.toClassroomDetails(item)
          } else {
            $('#class-code-input').modal('show')
          }
        } else { // 加入课堂不需要审核的情况
          if (!item.isJoined) {
            $('#class-code-input').modal('show')
          }
        }
      }
    },
    // 加入课堂事件
    joinTheClassroom(item, data) {
      $('#class-code-input').modal('hide')
      this.$api.addLearningCourses.joinTheClassroom(data).then(res => {
        if (res.code === 0) {
          if (res.data.code === 520) {
            toast(res.data.msg)
          } else {
            toast(res.msg, () => {
              this.toClassroomDetails(item)
            })
          }
        } else {
          toast(res.msg)
        }
      })
    },
    // 进入课堂详情
    toClassroomDetails: function(item) {
      localStorage.setItem('classname', item.name) // 课堂名称
      localStorage.setItem('class_id', item.classId) // 班级主键
      localStorage.setItem('subjectId', item.subjectId) // 教材主键
      localStorage.setItem('ct_id', item.ctId) // 课堂主键
      localStorage.setItem('pkgId', item.pkgId) // 教学包主键
      localStorage.setItem('isShowActivityState', true)
      this.$router.push('/teaching-center/teachingr-detail')
    },
    tologin: function(box) {
      localStorage.setItem('showLoginVue', box)// 保存用户到本地会话
      localStorage.setItem('toLoginUrl', window.location.href)
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
    .classroom-all{
      width: 1200px;
      margin:20px auto;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
      background: white
    }
    /* --------------查询区域开始------------- */
    .technology-nav-top, .technology-nav-bottom{
      display: flex;
      justify-content: left;
      height: 55px;
      overflow: hidden;
    }
    .technology-nav-top, .technology-nav-bottom:hover{
      height: 100%;
      overflow: auto;
    }
    .technology-nav-top{
      margin: 0 20px;
      border-bottom: 1px solid #D3D3D3;
    }
    .technology-nav-bottom{
      margin: 0 20px;
    }
    .technology-type{
      height: 55px;
      line-height: 55px;
      font-weight: bold;
      font-size: 13px;

      /* 文字 两端 对齐 */
      width: 52px;
      text-align: justify;
      text-align-last: justify;
      text-justify: inter-ideograph;
    }
    .technology-field-nav, .technology-label-nav{
      width: 95%;
      padding: 10px 10px;
      box-sizing:border-box;
    }
    .technology-field-nav li:hover{
      color: #FF740E;
    }
    .technology-label-nav li:hover{
      color: #FF740E;
    }
    .technology-nav li, .category-nav li{
      height: 25px;
      line-height: 25px;
      padding: 0 10px;
      border-radius: 5px;
      font-size: 13px;
      margin: 5px;
      cursor: pointer;
    }
    .active-type{
      background-color: #007bff !important;
      color: #ffffff !important;
      font-weight: bold;
    }
    .category-nav{
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }
    .category-nav-left select{
      padding: 2px 20px;
      height: 25px;
      line-height: 25px;
      font-size: 13px;
      margin-left: 18px;
      margin-top: 2px;
    }
    .category-nav-left{
      display: flex;
      justify-content: left;
    }
    /* .category-nav-left-ul li:hover{
      color: #FF740E;
    } */
    .category-nav-right span{
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      padding-right: 10px;
      font-size: 20px;
    }
    .active-button{
      color: #007bff;
    }
    /* --------------查询区域结束------------- */
    /* --------------内容区域开始------------- */
    .notContent{
      height: 350px;
    }
    .dots{
      display: inline-block;
      width: 60px;
      text-align: left;
      font-weight: bold;
    }
    .notContent-describe{
      font-family: 楷体;
      font-size: 20px;
    }
    .tutorial-area{
      display: flex;
      justify-content: left;
      flex-wrap: wrap;
      padding: 15px 0px;
    }
    /* 学习人数、必修 */
    .classroom-other-info{
      display: flex;
      margin-top: 27px;
      font-size: 12px
    }
    .other-info-item1{
      width: 50%;
      padding-left: 17px;
      text-align: left;
    }
    .other-info-item2{
      width: 50%;
      display: flex
    }
    .classroom-study-num{
      width: 70%;
      overflow: hidden;
      font-size: 12px
    }
    .subject-property-info{
      width: 30%;
      float: right;
      margin-right: 10px;
      overflow: hidden
    }
    /* 课堂封面 */
    .classroom-pic{
      width: 100%;
      height: 140px;
      border-radius: 10px 10px 0 0;
    }
    /* 课堂名称 */
    .classroom-name{
      font-size: 16px;
      overflow: hidden;
      padding: 7px 15px;
      height: 30px;
      line-height: 30px;
    }
    /* 活动数、资源数 */
    .classroom-area-number {
      position: absolute;
      top: 125px;
      right: 0px;
      z-index: 10;
      margin-right: 5%;
      display: flex
    }
    .classroom-area-nums{
      background: #2C828B;
      padding: 2px;
      font-size: 12px;
      margin-right: 5px;
      color: white
    }
    .icon-study-num{
      margin-right: 10px
    }
    /* 教师、助教 */
    .teacher-info-area{
      display: flex;
      font-size: 12px;
      overflow: hidden;
      padding-top: 22px;
      width: 90%;
      margin: auto;
    }
    .teacher-info{
      display: flex;
    }
    .teacher-info .right-teaching-info-detail{
      padding-top: 3px;
      text-align: left;
      padding-left: 4px;
    }
    .teacher-info .right-teaching-info-detail > span{
      display: inline-block;
    }
    .teacher-info .right-teaching-info-detail > .name{
      width: 80px;
    }
    /* 头像 */
    .teacher-pic{
      width: 40px;
      height: 40px;
      border-radius: 25px;
      border: 1px solid #959da0;
    }
    .classroom-area {
      width: 23%;
      padding: 5px 0px;
      float: left;
      /* margin-left: 20px; */
      margin: 5px 11px;
    }
    /*.classroom-all .classroom-item .teaching-one-class:hover{
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
      transform: translateY(-8px);
      transition: .2s;
      !* box-shadow: 0 2px 8px #cac6c6; *!
    }*/
    .classroom-all .classroom-item .teaching-one-class  .classroom-state{
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
    .classroom-state{
      display: block;
      height: 30px;
      line-height: 30px;
      padding: 0 3px;
      border-radius: 10px;
      background-color: #3e69ed;
    }
    .classroom-state-title{
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
    .classroom-live-title{
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
    .classroom-all .classroom-item .teaching-one-class  .classroom-state-start{
      background-color: #da0a25;
    }
    .classroom-all .classroom-item .teaching-one-class  .classroom-state-end{
      background-color: #7f7f7f;
    }
    .classroom-all .classroom-item .teaching-one-class  .classroom-state-nostart{
      background-color: #3e69ed;
    }
    .classroom-all .classroom-item .teaching-one-class  .classroom-state > img{
      vertical-align: middle;
    }
    .teaching-one-class{
      width: 100%;
      margin-bottom:10px;
      cursor: pointer;
      height: 290px;
      position: relative;
      transition: all .3s ease;
      transition-property: all;
      transition-duration: 0.3s;
      transition-timing-function: ease;
      transition-delay: 0s;
      box-shadow: 0 0 4px #cac6c6;
      border-radius: 2px;
    }
    .module-info{
      width: 100%;
      height: 150px;
      background: #ffffff;
      position: relative;
      z-index: 2;
    }
    .module-info:hover .classroom-info{
      display: block;
    }
    @keyframes animate{
      from {
        height: 0px;
        top : 150px;
      }
    }
    .classroom-info{
      animation: animate 0.3s ease 1;
      display: none;
      height: 150px;
      text-align: left;
      padding: 10px 20px;
      width: 100%;
      position: absolute;
      bottom: 0;
      background-color: #E36844;
      z-index: 10000;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[ type= "number" ] {
      -moz-appearance: textfield;
    }
    /* --------------内容区域结束------------- */
    /* 分页区域样式 */
    .pager-content{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .pager-content-text{
      height: 38px;
      margin-top: 35px;
      line-height: 38px;
    }
    .pager-content-input{
      height: 35px;
      margin-top: 35px;
      line-height: 35px;
      font-size: 13px;
      padding: 0 6px;
      text-align: center;
    }
    .pager-content-button{
      width: 50px;
      height: 35px;
      margin-top: 35px;
      line-height: 35px;
      font-size: 13px;
      margin-left: 10px;
    }
    /* 课堂弹出框样式 */
    .code-class{
      height: 100px;
      display: flex;
      margin: 30px 0;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .code-class-content{
      height: 100px;
      text-align: left;
      display: flex;
      flex-direction:column;
      justify-content: space-between;
      padding-left: 20px;
      padding-bottom: 5px;
    }
</style>
