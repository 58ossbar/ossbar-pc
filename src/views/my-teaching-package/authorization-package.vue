<!-- 教学包章节的编写授权页面 -->
<template>
  <div>
    <header-nav :current-index="5"/>
    <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
      <div class="location">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer" @click="toBack()">
            教学包
          </li>
          <li class="localtion-item">
            <span style="color: #959da0">授权共建</span>
          </li>
        </ul>
      </div>
      <div class="question-back">
        <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toBack()"/>
        <span @click="toBack()">返回</span>
      </div>
    </div>
    <div class="content-subject wind-1240">
      <div class="select-info info-right">
        <cb-tree
          ref="ztreeLibrary"
          :parent-vue="_self"
          :z-nodes="treeData"
          :id = "'treeDemo'"
          :has-search="true"
          id-key="chapterId"
          p-id-key="parentId"
          name="chapterName"
        />
      </div>

      <div class="teacher-info-choose">
        <!-- 教师查询导航开始 -->
        <div class="teacher-search">
          <div class="teacher-search-nav">
            <!-- 教师工作号查询 -->
            <span class="teacher-search-info">手机号码</span>
            <b-form-input v-model="searchInfo.mobile" placeholder="手机号码" style="width: 15%;height: 31px;font-size: 14px;" @keyup.enter="queryTrainee()"/>
            <!-- 教师姓名查询 -->
            <span class="teacher-search-info">教师姓名</span>
            <b-form-input v-model="searchInfo.traineeName" placeholder="姓名" style="width: 15%;height: 31px;font-size: 14px;" @keyup.enter="queryTrainee()"/>
            <!-- 教师性别查询 -->
            <span class="teacher-search-info">授权状态</span>
            <el-select v-model="searchInfo.traineeState" size="small" style="width: 15%;height: 31px;font-size: 14px;" @change="queryTrainee()">
              <el-option
                v-for="item in traineeState"
                :key="item.id"
                :value="item.id"
                :label="item.value"
                :id="item.id"
              />
            </el-select>
            <!-- 查询按钮 -->
            <el-button type="primary" style="margin-left: 20px;" size="small" icon="el-icon-search" @click="queryTrainee()">搜索</el-button>
          </div>
        </div>
        <!-- 教师查询导航结束 -->
        <!-- 教师信息及操作开始 -->
        <div class="teacher-list">
          <!-- 教师信息显示头部 -->
          <div class="teacher-list-header">
            <!-- 复选框 -->
            <!--<span><input type="checkbox" /></span>-->
            <!-- 头像 -->
            <div>教师头像</div>
            <!-- 名称 -->
            <div>教师名称</div>
            <!-- 院校 -->
            <div>所属院校</div>
            <!-- 职位 -->
            <div>教师职位</div>
            <!-- 账号 -->
            <div>账号</div>
            <!-- 技术大咖 -->
            <div>职业路径</div>
            <!-- 操作 -->
            <div>操作</div>
          </div>
          <!-- 教师信息显示内容 -->
          <div v-for="(item,index) in traineeList" :key="index" class="teacher-list-content">
            <!-- 复选框 -->
            <!--<span><input type="checkbox" /></span>-->
            <!-- 头像 -->
            <div>
              <img :src="item.teacherPic" class="right-teacher-img">
            </div>
            <!-- 名称 -->
            <div :title="item.teacherName">{{ item.teacherName | ellipsis }}</div>
            <!-- 院校 -->
            <div :title="item.orgId">{{ item.orgId | ellipsis }}</div>
            <!-- 职位 -->
            <div :title="item.postName">{{ item.postName | ellipsis }}</div>
            <!-- 账号 -->
            <div :title="item.mobile">{{ item.mobile | ellipsis }}</div>
            <!-- 技术大咖 -->
            <div :title="item.mainSubjects">{{ item.mainSubjects | ellipsis }}</div>
            <!-- 操作 -->
            <div>
              <el-button
                :type="item.isAuthorized ? 'success' : 'primary'"
                class="right-teacher-button"
                size="small"
                @click="openModalDialog(item.traineeId)"
              >{{ item.isAuthorized ? '已授权' : '授权共建' }}</el-button>
            </div>
          </div>
        </div>
        <!-- 教师信息及操作开始 -->
        <!-- 分页区域开始 -->
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
        </div>
        <!-- 分页区域结束 -->
      </div>

      <!-- 章节授权模态框开始 -->
      <modal-dialog
        id="authorization-box"
        title="选择授权章节"
        @cancel="cancelAuthInfo"
        @submit="saveAuthInfo">
        <div slot="main">
          <div class="authorization-info">
            <!-- 主编设置 -->
            <input
              id="VoteCheck1"
              v-model="subeditorValue"
              true-value="Y"
              false-value="N"
              type="checkbox"
              class="">
            <label for="VoteCheck1">是否设为副主编</label>
            <!-- 章节选择 -->
            <cb-tree
              :parent-vue="_self"
              :z-nodes="authorizationTreeData"
              :id = "'authorizationTree'"
              id-key="chapterId"
              p-id-key="parentId"
              name="chapterName"
              check
              label-check
              style="height: 520px; overflow-y: scroll"
              expand-level="1"
            />
          </div>
        </div>
      </modal-dialog>
      <!-- 章节授权模态框结束 -->
    </div>
  </div>
</template>

<script>

// 引入头部导航页面
import HeaderNav from '@/components/header-nav'
// 引入树插件页面
import CbTree from '@/components/cb-tree'
// 引入分页组件页面
import Pager from '@/components/pager'
// 引入模态框组件页面
import ModalDialog from '@/components/modal-dialog'
// 引入的一些工具
import { baseUrl, toast, alert } from '@/utils/global'
import $ from '@/assets/jquery-vendor'

export default {
  name: 'AuthorizationPackage',
  components: {
    'header-nav': HeaderNav,
    CbTree,
    'pager': Pager,
    'modal-dialog': ModalDialog
  },
  filters: {
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 6) {
        return value.slice(0, 6) + '...'
      }
      return value
    }
  },
  props: {

  },
  data() {
    return {
      isClassroomDetail: false,
      ztree: $.fn.zTree.getZTreeObj('authorizationTree'),
      treeObj: $.fn.zTree.getZTreeObj('treeDemo'), // 树节点的对象
      treeData: [], // 章节显示数据
      authorizationTreeData: [], // 授权树的章节数据
      show: false,
      msg: '操作成功',
      pkgId: '', // 教学包id
      subjectId: '',
      traineeId: '', // 选择的学员id
      traineeList: [], // 学员列表
      selectedTraineeIds: [], // 选择的学员
      optionsPkgList: [], // 教学包列表
      optionsChapterList: [], // 章节列表
      subeditorValue: 'N',
      // 搜索信息
      searchInfo: {
        traineeName: '', // 姓名
        mobile: '', // 手机号
        traineeState: '', // 授权状态
        jobNumber: '' // 工作号
      },
      // 性别下拉选中查询数据
      traineeState: [{ id: '', value: '不限' }, { id: '1', value: '已授权' }, { id: '2', value: '未授权' }],
      isSearch: false,
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 8, // 分页大小
        pageSize: 8// 分页大小
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // this.queryMyPkg()
    // this.listTrainee()
    // console.log(this.$route.query)
    // console.log(this.$route.params)

    // 获取当前页面的教学包id
    this.pkgId = localStorage.getItem('under_authorization_pkg_id')
    this.subjectId = localStorage.getItem('under_authorization_pkg_subject_id')
    this.isClassroomDetail = localStorage.getItem('isClassroomDetail')
    // 获取当前教学包的数据
    this.getBookTreeData()
    this.getChapterInfo()
    // 获取可授权教师
    this.listTrainee()
  },
  mounted() {},
  updated() {},
  methods: {

    removeSucc() {},

    // 返回
    toBack() {
      this.$router.push({
        path: '/teaching-package-detail',
        name: 'teaching-package-detail'
      })
    },

    getFont(treeId, node) {
      return node.font ? node.font : {}
    },

    // 教学包列表
    queryMyPkg() {
      this.$api.authorizationPackage.queryMyPkg({}).then((res) => {
        if (res.code === 0) {
          this.optionsPkgList = res.data
        }
      })
    },

    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用查询课堂方法
      this.listTrainee()
    },
    // 查询操作
    queryTrainee() {
      this.pagerInfo.currPage = 1
      // 调用查询课堂方法
      this.listTrainee()
    },
    // 获取教师
    listTrainee() {
      this.traineeId = ''
      this.selectedTraineeIds = []
      // 创建接口调用所传参数
      const obj = {
        teacherName: this.searchInfo.traineeName,
        type: this.searchInfo.traineeState,
        jobNumber: this.searchInfo.jobNumber,
        mobile: this.searchInfo.mobile,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize,
        pkgId: this.pkgId
      }
      // 调用所有教师获取接口
      this.$api.authorizationPackage.queryTeacherList(obj).then(res => {
        if (res.code === 0) {
          this.traineeList = []
          this.pagerInfo.totalPage = res.data.totalPage
          // 教师头像显示处理
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].teacherPic) {
              const traineePic = res.data.list[i].teacherPic
              if (!(traineePic.indexOf('https') !== -1 || traineePic.indexOf('http') !== -1)) {
                res.data.list[i].teacherPic = baseUrl + traineePic
              }
            }
          }
          // this.optionsTraineeList = res.data;
          this.traineeList = res.data.list
          this.isSearch = true
        }
      })
    },
    // 切换教学包
    changePkg(id) {
      this.pkgId = id
      const ele = document.getElementById(id)
      if (ele) {
        const subjectId = ele.getAttribute('data-cb')
        this.subjectId = subjectId
      }
    },

    clickTrainee(value) {
      this.traineeId = value
      this.changeTrainee(value)
    },

    // 打开授权模态框
    openModalDialog(traineeId) {
      $('#authorization-box').modal('show')
      this.clickTrainee(traineeId)
    },

    // 关闭模态框
    cancelAuthInfo() {
      $('#authorization-box').modal('hide')
    },

    /**
       * 选中学员
       * @param val
       */
    changeTrainee(val) {
      this.selectedTraineeIds = []
      this.selectedTraineeIds.push(val)
      // 获取当前教师的所有章节权限列表
      const data = {
        pkgId: this.pkgId,
        subjectId: this.subjectId,
        // userId: this.selectedTraineeIds
        userId: val
      }
      this.$api.authorizationPackage.queryAuthorization(data).then(res => {
        if (res.code === 0) {
          // 存入是否是课堂创建者
          if (res.data.isSubeditor) {
            this.subeditorValue = res.data.isSubeditor
          } else {
            this.subeditorValue = 'N'
          }
          // 获取树形组件全部节点
          let nodes = $.fn.zTree.getZTreeObj('authorizationTree').getNodes()
          const nodesArr = $.fn.zTree.getZTreeObj('authorizationTree').transformToArray(nodes)
          nodes = nodesArr
          // 先还原
          this.clearNode(nodes)
          // 将其他人的章节禁止选择
          if (res.data.otherUserChapterIds && res.data.otherUserChapterIds.length > 0) {
            this.setDisable(nodes, res.data.otherUserChapterIds, res.data.userChapterIds)
          }
          // 如果被选用户有章节，回显被选人的章节
          if (res.data.userChapterIds && res.data.userChapterIds.length > 0) {
            this.setSelectChapter(nodes, res.data.userChapterIds)
          }
          // 如果有此父节有未被授权给任何用户的章节,则将此父节点设为可选
          this.changeParentNode(nodes)
        }
      })
    },

    /**
       * 递归设置选中节点
       * @param nodes
       * @param chapterIds
       */
    setSelectChapter(nodes, chapterIds) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < chapterIds.length; j++) {
          if (nodes[i].chapterId === chapterIds[j]) {
            nodes[i].nocheck = false
            nodes[i].checked = true
            $.fn.zTree.getZTreeObj('authorizationTree').updateNode(nodes[i])
            const children = nodes[i].children
            if (children !== undefined && children != null && children.length > 0) {
              this.setSelectChapter(children, chapterIds)
            }
          }
        }
      }
    },

    /**
       * 禁止选择其他人的章节
       * @param nodes 树形组件的全部节点
       * @param otherUserChapterIds 此教学包，非被选人所拥有的权限
       * @param userChapterIds 此教学包，被选人所拥有的章节权限
       */
    setDisable(nodes, otherUserChapterIds, userChapterIds) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < otherUserChapterIds.length; j++) {
          if (nodes[i].chapterId === otherUserChapterIds[j]) {
            // 如果匹配上了，且不是父节点，直接设置没有复选框
            if (nodes[i].isParent === false) {
              nodes[i].nocheck = true
            } else {
              // 否则，判断，非被选人所拥有的权限与被选人所拥有的章节权限，如果没有，则设置没有复选框
              if (userChapterIds.indexOf(otherUserChapterIds[j]) === -1) {
                nodes[i].nocheck = true
              }
            }
            $.fn.zTree.getZTreeObj('authorizationTree').updateNode(nodes[i])
            const children = nodes[i].children
            if (children !== undefined && children != null && children.length > 0) {
              this.setDisable(children, otherUserChapterIds, userChapterIds)
            }
          }
        }
      }
    },

    clearNode(nodes) {
      nodes.forEach(node => {
        node.nocheck = false
        node.checked = false
        $.fn.zTree.getZTreeObj('authorizationTree').updateNode(node)
        if (node.children !== undefined && node.children != null && node.children.length > 0) {
          this.clearNode(node.children)
        }
      })
    },

    // 如果父节点下面有未选中的节点
    changeParentNode(nodes) {
      nodes.forEach(node => {
        if (node.nocheck === true) {
          // 如果有此父节有未被授权给任何用户的章节,则将此父节点设为可选
          const children = node.children
          if (children !== undefined && children != null && children.length > 0) {
            children.forEach(item => {
              if (item.nocheck === false) {
                node.nocheck = false
                $.fn.zTree.getZTreeObj('authorizationTree').updateNode(node)
                if (item.children !== undefined && item.children != null && item.children.length > 0) {
                  this.changeParentNode(item.children)
                }
              }
            })
          }
        }
      })
    },

    /**
       * 获取树形数据
       */
    getBookTreeData() {
      const params = {
        pkgId: this.pkgId,
        subjectId: this.subjectId
      }
      this.$api.pkgInfo.getBookTreeData(params).then((res) => {
        if (res.code === 0) {
          const arrTemp = []
          arrTemp.push(res.data)
          this.authorizationTreeData = JSON.parse(JSON.stringify(arrTemp))
        }
      })
    },

    // 保存授权信息
    saveAuthInfo() {
      if (!this.pkgId) {
        alert('请选择教学包')
        return false
      }
      if (!this.subjectId) {
        alert('请选择教学包')
        return false
      }
      // 存入当前单击授权的教师id
      /* this.selectedTraineeIds = [];
        this.selectedTraineeIds.push(traineeId);*/
      // 获取所有被选中的节点
      const nodes = $.fn.zTree.getZTreeObj('authorizationTree').getCheckedNodes(true)
      // let selectedNodes = this.ztree.getCheckedNodes(true)
      // 获取所有被选中的节点id
      const chapterIds = []
      if (nodes != null && nodes.length > 0) {
        nodes.forEach(item => {
          if (this.subjectId !== item.chapterId) {
            chapterIds.push(item.chapterId)
          }
        })
      }
      // 存入对应参数并调用授权接口
      const data = {
        pkgId: this.pkgId,
        subjectId: this.subjectId,
        traineeIds: this.selectedTraineeIds,
        chapterIdList: chapterIds
      }
      data.subeditorTraineeId = this.subeditorValue === 'Y' ? this.traineeId : ''
      $('#authorization-box').modal('hide')
      this.$api.authorizationPackage.saveAuthInfo(data).then(res => {
        if (res.code === 0) {
          this.show = true
          toast(res.msg)
        } else {
          toast(res.msg)
        }
        this.getChapterInfo()
        this.queryTrainee()
      })
    },
    // 查询章节所授权的教师信息
    getChapterInfo() {
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('subjectId', this.subjectId)
      this.$api.authorizationPackage.getChapterTreeWithTeacherName(formData).then(res => {
        if (res.code === 0) {
          this.treeData = []
          this.treeData.push(res.data)
        } else {
          toast(res.msg)
        }
      })
    }

  }
}
</script>

<style scoped>

  .content-subject {
    text-align: center;
    display: flex;
  }

  .select-info{
    width: 400px;
    box-shadow: 0 0 2px #cac6c6;
    background-color: #FFFFFF;
    padding: 20px;
  }
  /*.info-left{
    margin-left: 5%;
  }
  .info-right{
     margin-left: 5%;
   }*/

  .bottom-save{
    margin-left: 5%;
    margin-top: 50px;
    width: 200px;
    clear: both;
  }
  .bottom-save button{
    width: 100%;
    margin-bottom: 50px;
  }
  /* 左边教师查看选中样式 */
  .teacher-info-choose{
    width: 800px;
    box-shadow: 0 0 2px #cac6c6;
    background-color: #FFFFFF;
    padding: 20px 0;
    margin-left: 10px;
  }
  .teacher-search{
    height: 50px;
    border-bottom: 2px solid #cac6c6;
  }
  .teacher-search-nav{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    line-height: 31px;
  }
  .teacher-search-info{
    margin: 0 20px;
  }
  input::-webkit-input-placeholder{
    font-size:14px;
  }
  .teacher-list{
    padding: 20px 10px;
    font-size: 14px;
    /* height: 450px; */
    height: 480px;
    overflow-y: auto;
  }
  .teacher-list-header{
    display: flex;
    height: 40px;
    border-bottom: 1px solid #F0F3F8;
  }
  .teacher-list-content{
    display: flex;
    height: 50px;
    border-bottom: 1px solid #F0F3F8;
    line-height: 50px;
  }
  .teacher-list-content:hover{
    background-color: #f5f5f5;
  }
  .teacher-list-content > div{
    width: 14%;
    text-align: center;
  }
  .teacher-list-content > span{
    width: 4%;
    text-align: center;
  }
  .teacher-list-header > div{
    width: 14%;
    text-align: center;
  }
  .teacher-list-header > span{
    width: 4%;
    text-align: center;
  }
  .right-teacher-img{
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  .right-teacher-button{
    margin-top: 13px;
    height: 24px;
    width: 60px;
    padding: 4px 5px;
  }
  /*.left-teacher{
    text-align: left;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .left-teacher:hover{
    background-color: #d9e6e9;
  }
  .left-teacher-active{
    background-color: #d9e6e9;
  }
  .left-teacher-img{
    height: 30px;
    width: 30px;
    margin-left: 10px;
  }*/
  .authorization-info{
      text-align: left;
  }
  /* 复选框样式 */
  input[type="checkbox"]:hover{
    cursor: pointer;
  }
  input[type="checkbox"]{
    width:16px;
    height:16px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 18px;
    position: relative;
    margin-top: -3px;
  }
  input[type="checkbox"]::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
  }
  input[type="checkbox"]:checked::before{
    content: "\2713";
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    border: 1px solid #000000;
    color:#000000;
    font-size: 15px;
    font-weight: bold;
  }
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }
  ::-webkit-scrollbar-track-piece {
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 3px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  /* 返回 */
  .classroom-back{
    width: 50%;
    text-align: right;
    font-size: 14px;
    cursor: pointer;
    color: #158aeb
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  .location1{
    display: flex;
    align-items: center;
    width: 1200px;
    height:40px;
    line-height:40px;
    margin: 0 auto;
    /* background-color: #fafafa; */
  }
  .location1 .localtion-title{
    margin-right: 8px;
  }
  .location1 .localtion-list{
    display: flex;
    align-items: center;
  }
  .location1 .localtion-list .localtion-item+ .localtion-item::before{
    content: '>';
    padding: 0 5px;
  }
  .test-question-bank-nav{
        /* width: 100%; */
        display: flex;
  }
  .test-question-bank-nav2{
      display: flex;

      margin: 20px auto;
      background-color: #fff;
      -webkit-box-shadow: 2px 2px 2px #e0e0e0;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
  }
  .question-back{
      width: 100%;
      text-align: right;
      font-size: 14px;
      margin: 20px;
      cursor: pointer;
      color: #158aeb;
  }
  .question-back-icon{
      font-size: 14px;
      margin-right: 5px
  }

  .info-right /deep/ .ztree{
    border: none;
  }
</style>
