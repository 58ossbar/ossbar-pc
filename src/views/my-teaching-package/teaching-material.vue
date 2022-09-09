<!-- 活教材显示页面 -->
<template>
  <!--活教材-->
  <div :class="['teaching-material', isClassroomDetail?'':'teaching-material-two']">
    <div :style="isShowLeftChapter ? '' : 'width:0;'" class="left-teaching-material-catalogue">
      <div id="left-nav" class="serachLibrary catalogue">
        <ztree-library
          v-if="pkgId!==''"
          ref="ztreeLibrary"
          :z-nodes="zNodes"
          :pkg-id="pkgId"
          :is-show-rmenu="hasPermission"
          :has-permission="hasPermission"
          :has-permission-actual="hasPermissionActual"
          :has-set-visible-permission="hasSetVisiblePermission"
          :is-together-build="isTogetherBuild"
          :is-creator="isCreator"
          :is-classroom-detail="isClassroomDetail"
          :private-use="privateUse"
          id-key="id"
          p-id-key="parentId"
          name="chapterName"
          ztree-id="treeDemo"
          @showLibraryForm="showLibraryForm"
          @removeSucc="removeSucc"
          @setTraineesVisibleBatch="setTraineesVisibleBatch"
          @setCreateDefaultChapter="setCreateDefaultChapter"
        />
      </div>
    </div>
    <!-- 左侧章节收缩begin -->
    <div class="shrinkage-btn" @click="isShowLeftChapter = !isShowLeftChapter">
      <div>
        {{ isShowLeftChapter ? '隐藏' : '显示' }}
      </div>
    </div>
    <!-- 左侧章节收缩end -->
    <div :style="isShowLeftChapter ? '' : 'width:100%'" class="right-teaching-material-con">
      <div v-if="isClassroomDetail && ifShowClassroomIntroNew"><h4>课堂简介</h4><br>{{ classroomIntro }}</div>
      <div v-show="(hasPermission && hasNodePermission && hasPermissionActual) || (pkgResGroupList.length > 0)" class="header-nav">
        <!--资源分组 begin-->
        <div
          :style="(hasPermission && hasNodePermission && hasPermissionActual
            && clickedNodeType !== 'subject'
          && (addGroupInfoList.length + pkgResGroupList.length < 10)) ? 'max-width:calc(100% - 50px);' : 'max-width: 100%;'"
          class="editor-nav">
          <div
            v-for="(pkgResGroup,index) in pkgResGroupList"
            :draggable="hasPermission && hasNodePermission && isShowTinyMce && hasPermissionActual"
            :key="pkgResGroup.resgroupId"
            :id="pkgResGroup.resgroupId"
            :title="pkgResGroup.resgroupName"
            :class="['editor-nav-item',currentClickIndex===index?'active-editor-nav':'active-editor-no-nav']"
            @click="handleCutGroup(index, pkgResGroup)"
            @dragstart="handleDragStart($event, pkgResGroup, index)"
            @dragover.prevent="handleDragOver($event, pkgResGroup)"
            @dragenter="handleDragEnter($event, pkgResGroup)"
            @dragend="handleDragEnd($event, pkgResGroup)"
            @contextmenu.prevent="rightClick($event,pkgResGroup)">
            {{ pkgResGroup.resgroupName }}
          </div>
        </div>
        <!--资源分组 end-->
        <!--右键菜单 begin-->
        <div v-show="(menuVisible && hasPermission && hasPermissionActual) || (hasSetResVisiblePermission && menuVisible)" id="rMenu">
          <ul id="menu" class="menu">
            <li v-if="'2' !== clickPkgResGroup.dictCode && !hasNodePermission" id="m_copy" @click="handleCopyGroup">
              <img :src="clickPkgResGroup.isCanCopy === 'Y' ? 'static/image/teaching_package/ban-copy.png' : 'static/image/teaching_package/copy.png'" alt="">
              <span>{{ clickPkgResGroup.isCanCopy === 'Y' ? '禁止复制' : '允许复制' }}</span>
            </li>
            <li v-if="!hasNodePermission" id="m_look" @click="handleLookGroup()">
              <img :src="clickPkgResGroup.isTraineesVisible === 'Y' ? 'static/image/teaching_package/ban-look.png' : 'static/image/teaching_package/look.png'" alt="">
              <span>{{ clickPkgResGroup.isTraineesVisible === 'Y' ? '设置学员不可见' : '设置学员可见' }}</span>
            </li>
            <li v-if="'2' !== clickPkgResGroup.dictCode && hasNodePermission" id="m_check" @click="handleshowGroupBox(true)">
              <img src="static/image/teaching_package/renname_1.png" alt="">
              <span>重新命名</span>
            </li>
            <li v-if="hasNodePermission" id="m_del" @click="removeGroup">
              <img src="static/image/teaching_package/del_2.png" alt="">
              <span>删除分组</span>
            </li>
          </ul>
        </div>
        <!--右键菜单 end -->
        <!-- +号 begin -->
        <div
          v-if="hasPermission && hasNodePermission && hasPermissionActual
            && clickedNodeType !== 'subject'
          && (addGroupInfoList.length + pkgResGroupList.length < 10)"
          class="add-edit-nav-btn"
          @click="handleshowGroupBox(false)">
          <!-- <img src="static/image/teaching_package/add_edit_nav.png" alt=""> -->
          <div>+</div>
          <span
            v-if="hasPermission && hasNodePermission && hasPermissionActual
              && clickedNodeType !== 'subject'
              && (!pkgResGroupList || pkgResGroupList.length === 0)
            && (addGroupInfoList.length + pkgResGroupList.length < 10)"
            style="display: inline-block;line-height: 39px;">请先添加分组</span>
        </div>
        <!-- +号 end -->
      </div>
      <!--创建者或有权限时-->
      <div v-if="isShowTinyMce" :class="['teaching-package-editor',isHideNavOnScroll?'teachingCenterBoxHideNavOnScroll':'', isClassroomDetail?'':'teaching-package-editor-two']">
        <cb-editor
          ref="cbEditor"
          :height="editHeight"
          :is-copy="isCopy"
          :teaching-extra-info="teachingExtraInfo"
          :edit-read-only="!hasNodePermission"
          :is-edit-chapter="hasNodePermission"
          :tool-str="hasNodePermission ? '' : toolStr"
          :show-image-button="hasPermissionActual"
          :show-media-button="hasPermissionActual"
          :media-is-preview="hasNodePermission?'false':'true'"
          :data-form="saveResourceData"
          :is-need-content-navigation="true"
          :is-show-save-chapter-btn="hasPermission && hasNodePermission && isShowTinyMce && hasPermissionActual"
          :custom-content-navigation-style="isClassroomDetail?'':'max-height:' + (editHeight+ 47 + 15 + 36) + 'px'"
          class="chapterEditor"
          name="resContent"
          @audioOrVideoEnded="audioOrVideoEnded"
          @chapterReadEnded="chapterReadEnded"
          @ctrlS="ctrlS"
        />
      </div>
      <!--引入活动模块 begin -->
      <activity-library
        v-if="!isShowTinyMce && isShowActivityPage"
        ref="activity"
        key="fromchapter"
        :pkg-id="pkgId"
        :subject-id="subjectId"
        :is-in-the-chapter="true"
        :chapter-id="chapterId"
        :has-permission="hasPermission"
        :is-classroom-detail="isClassroomDetail"
        class="teaching-package-editor-activity"
      />
      <!--引入活动模块 end -->
    </div>
    <!-- 新建分组弹窗start -->
    <div id="addGroupBox" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog">
      <div class="modal-dialog" role="document" style="max-width: 500px">
        <div class="modal-content">
          <div class="modal-header">
            <div id="modal-title" class="modal-title modal-name" style="padding-left: 15px">新建分组</div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="handleCancelAddGroup()"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <!-- 默认分组选择开始 -->
            <div v-if="(!editGroup) && (defaultGroupList.length > 0)" class="group-form">
              <div class="default-group-name">
                默认分组
              </div>
              <div class="default-group-choose">
                <select
                  id="defaultId"
                  :disabled="(addGroupInfoList.length + pkgResGroupList.length >= 10)"
                  v-model="addDefaultGroup"
                  class="form-control"
                  data-dropup-auto="true"
                  data-live-search="false"
                  multiple
                  title="请选择默认分组" >
                  <option
                    v-for="(item,index) in defaultGroupList"
                    :value="item"
                    :key="index">{{ item.dictValue }}</option>
                </select>
              </div>
            </div>
            <!-- 默认分组选择结束 -->
            <div v-if="!editGroup">
              <div v-for="(item,index) in addGroupInfoList" :key="index">
                <div class="group-form">
                  <div class="group-name">
                    分组{{ index + 1 }}名称
                    <span>*</span>
                  </div>
                  <input
                    :id="'optionName'+index"
                    v-model="item.resgroupName"
                    type="text"
                    class="form-control group-input"
                    placeholder="请输入分组名称"
                    @keyup.enter="handleSaveResourceGroup"
                  >
                  <img
                    class="del-group-input"
                    title="删除分组"
                    src="static/image/teaching_package/delete_2.png"
                    alt="删除分组"
                    @click="delGroupInput(index)">
                </div>
                <div
                  :class="['invalid-feedback','col-10','option-hint','p-0','questionsoptionHint'+index]"
                  style="text-align: left;margin:0 0 0 23%">
                  <small >分组名称不能为空！</small>
                </div>
              </div>
            </div>
            <div v-if="editGroup" class="group-form">
              <div class="group-name">
                分组名称
                <span>*</span>
              </div>
              <input
                v-model="addGroupInfo.resgroupName"
                type="text"
                class="form-control group-input"
                placeholder="请输入分组名称"
                @keyup.enter="handleSaveResourceGroup"
              >
            </div>
            <!-- 添加分组事件内容开始 -->
            <div
              v-if="!editGroup"
              class="add-group-input-btn"
              @click="addGroupInput">
              <span>+  添加分组</span>
            </div>
            <!-- 添加分组事件内容结束 -->
            <div class="news-info-btn-list">
              <b-button
                :disabled="isViewSave"
                variant="outline-primary"
                size="sm"
                @click="handleSaveResourceGroup">确定</b-button>
              <b-button
                variant="outline-secondary"
                size="sm"
                @click="handleCancelAddGroup">取消</b-button>
            </div>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <!-- 新建分组弹窗end-->
    <!--批量设置章节对学员是否可见begin-->
    <modal-dialog
      id="set-chapter-visible"
      ref="visibleModal"
      title="快速设置章节可见性"
      @cancel="handleVisibleCancel"
      @submit="handleVisibleSubmit">
      <div slot="main" class="chapter-visible-pre-content">
        将选中的章节，设为学员可见
        <cb-tree
          id="chapter-tree-for-visible"
          :z-nodes="zNodesForVisible"
          :check="true"
          :parent-vue="{}"
          id-key="chapterId"
          p-id-key="parentId"
          name="chapterName"
          width="50"
          label-check
          expand-level="1"
        />
        <!-- @onclick="onclick" -->
      </div>
    </modal-dialog>
    <!--批量设置章节对学员是否可见end-->

    <!--设置默认生成的章节begin-->
    <div id="setCreateDefaultChapter" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog">
      <div class="modal-dialog" role="document" style="max-width: 500px">
        <div class="modal-content">
          <div class="modal-header">
            <div id="modal-title-create" class="modal-title modal-name" style="padding-left: 15px">设置默认生成的章节</div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="handleCancelAddGroup()"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <div v-for="(item,index) in chapterNameList" :key="index + '_' + item.seId">
              <div class="group-form">
                <div class="group-name">
                  默认名称{{ index + 1 }}
                  <!--<span>*</span>-->
                </div>
                <input
                  :id="index + '_input_' + item.seId"
                  v-model="item.name"
                  type="text"
                  class="form-control group-input"
                  placeholder="请输入名称"
                  @keyup.enter="saveCreateDefaultChapter"
                >
                <img
                  class="del-group-input"
                  title="删除行"
                  src="static/image/teaching_package/delete_2.png"
                  alt="删除行"
                  @click="delCreateDefaultChapter(index)">
              </div>
            </div>
            <!-- 添加分组事件内容开始 -->
            <div
              class="add-group-input-btn"
              @click="addInputLine">
              <span>+  添加行</span>
            </div>
            <!-- 添加分组事件内容结束 -->
            <div class="news-info-btn-list">
              <b-button
                variant="outline-primary"
                size="sm"
                @click="saveDefaultChapterBatch">确定</b-button>
              <b-button
                variant="outline-secondary"
                size="sm"
                @click="handleVisibleCancel('setCreateDefaultChapter')">取消</b-button>
            </div>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
    <!--设置默认生成的章节end-->

    <!-- 图片预览标签 begin -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="viewerImgSrc" alt>
    </div>
    <!-- 图片预览标签 end -->

  </div>
</template>

<script>
import tinyMCE from 'tinymce/tinymce'
import $ from '@/assets/jquery-vendor'
import ZtreeLibrary from '@/components/ztree-library-new'
import CbEditor from '@/components/cb-editor'
import activityLibrary from '@/views/activity/index'
import { toast, confirm, formVaildStyle, formInVaildStyle } from '@/utils/global'
import ModalDialog from '@/components/modal-dialog'
import CbTree from '@/components/cb-tree'
export default {
  name: 'TeachingMaterial',
  components: {
    'ztree-library': ZtreeLibrary,
    'cb-editor': CbEditor,
    'activity-library': activityLibrary,
    'modal-dialog': ModalDialog,
    'cb-tree': CbTree
  },
  filters: {
    filterActivityState(value) {
      if (value === '0') {
        return '未开始'
      } else if (value === '1') {
        return '进行中'
      } else {
        return '已结束'
      }
    }
  },
  props: {
    isHideNavOnScroll: {
      type: Boolean,
      default: false
    },
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    subjectId: {
      type: String,
      required: true,
      default: ''
    },
    hasPermission: {
      type: Boolean,
      default: false,
      required: true
    },
    hasPermissionActual: {
      type: Boolean,
      default: false,
      required: true
    },
    // 是否为课堂详情页面
    isClassroomDetail: {
      type: Boolean,
      default: false,
      required: true
    },
    // 是否显示出课堂简介信息
    ifShowClassroomIntro: {
      type: Boolean,
      default: true,
      required: false
    },
    // 课堂简介信息
    classroomIntro: {
      type: String,
      default: '',
      required: false
    }
    // privateUse: {
    //   type: String,
    //   default: '',
    //   required: false
    // },
  },
  data() {
    return {
      ifShowClassroomIntroNew: true,
      chapterNameList: [{ seId: '', name: '' }, { seId: '', name: '' }, { seId: '', name: '' }],
      hasSetVisiblePermission: false,
      viewerImgSrc: '', // 图片预览src
      zNodesForVisible: [],
      editHeight: 500,
      toolStr: 'preview fullscreen previousChapter nextChapter', // 编辑器的tabstr
      dragging: null,
      hasNodePermission: false, // 某节点是否有权限
      isCreator: false, // 是否为创建
      isTogetherBuild: false, // 是否为共建者
      clickedNodeType: 'chapter', // 当前点击的节点类型，suject为课程节点，否则为章节节点
      chapterId: '', // 当前选中的章节节点
      resgroupId: '', // 当前 选中的 分组id
      isShowActivityPage: false, // 是否显示活动列表
      isShowTinyMce: false, // 是否显示富文本编辑器
      menuVisible: false,
      hasSetResVisiblePermission: false,
      newSubjectId: '',
      ctId: localStorage.getItem('ct_id'),
      privateUse: '',
      zNodes: [],
      saveResourceData: {
        resContent: '',
        resContentTogetherBuild: '',
        resId: ''
      },
      addGroupInfo: {
        resgroupId: '',
        resgroupName: '',
        chapterId: '',
        pkgId: ''
      },
      teachingExtraInfo: {
        ctId: localStorage.getItem('ct_id'),
        pkgId: this.pkgId,
        subjectId: this.subjectId,
        chapterId: '',
        resId: ''
      }, // 活教材 要传到 编辑器的 额外的 参数
      addGroupInfoList: [],
      addDefaultGroup: [], // 选择的默认分组
      pkgResGroupList: [],
      chapterInfo: {},
      clickPkgResGroup: {}, // 当前右键点击的分组
      currentClickIndex: 0, // 当前显示的分组内容 0为默认为第一篇
      editGroup: false,
      defaultGroupList: [], // 默认分组信息
      isCopy: false, // 当前章节内容是否可复制
      isShowLeftChapter: true, // 是否显示左侧章节
      allChapterId: [], // 所有章节的id
      editorToolbarOffsetTop: 0,
      isViewSave: false, // 是否禁用新增按钮
      resgroupIsRead: false // 分组是否 查看
    }
  },
  watch: {
    ifShowClassroomIntro: {
      handler(newVal, oldVal) {
        this.ifShowClassroomIntroNew = newVal
      },
      immediate: true
    },
    currentClickIndex() {
      if (this.pkgResGroupList[this.currentClickIndex].isCanCopy) {
        this.isCopy = (this.pkgResGroupList[this.currentClickIndex].isCanCopy === 'Y')
      } else {
        this.isCopy = false
      }
      // console.log(this.pkgResGroupList)
    },
    pkgResGroupList() {
      if (this.pkgResGroupList && this.pkgResGroupList.length > 0) {
        if (this.pkgResGroupList[this.currentClickIndex].isCanCopy) {
          this.isCopy = (this.pkgResGroupList[this.currentClickIndex].isCanCopy === 'Y')
        } else {
          this.isCopy = false
        }
      }
    },
    isCopy() {
      if (!this.isCreator && this.pkgResGroupList[this.currentClickIndex].dictCode !== '2') {
        this.isShowTinyMce = false
        this.$nextTick(() => (this.isShowTinyMce = true))
      }
    },
    hasNodePermission() {
      if (this.pkgResGroupList.length > 0) {
        this.isShowTinyMce = false
        this.$nextTick(() => (this.isShowTinyMce = true))
      }
    }
    // "subjectId":function(newValue){
    //     this.newSubjectId=newValue;
    // },
    // value(newV,oldV){
    //   $('#defaultId').selectpicker('val',newV);
    // }
  },
  created() {
    this.isShowPage()
  },
  mounted() {
    this.mountedInit()
    window.addEventListener('scroll', this.onScroll)
  },
  updated() {
    this.$nextTick(function() {
      $('#defaultId').selectpicker('refresh')
    })
  },
  destroyed() {
    $('#defaultId').selectpicker('destroy')
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    ctrlS() {
      if (this.hasNodePermission) {
        this.handleSaveResource()
      }
    },
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    setCreateDefaultChapter(data) {
      $('#setCreateDefaultChapter').modal('show')
      const formData = new FormData()
      formData.append('pkgId', data.pkgId)
      this.$api.pkgInfo.queryDefaultNameList(formData).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.chapterNameList = res.data
          }
        } else {
          toast(res.msg)
        }
      })
    },
    // 添加分组的输入框
    addInputLine() {
      if (this.chapterNameList.length < 5) {
        const obj = { seId: '', name: '' }
        this.chapterNameList.push(obj)
      } else {
        toast('只允许添加5个')
      }
    },
    delCreateDefaultChapter(index) {
      this.chapterNameList.splice(index, 1)
    },
    saveCreateDefaultChapter() {},
    saveDefaultChapterBatch() {
      const data = {
        pkgId: this.pkgId,
        list: this.chapterNameList
      }
      this.$api.pkgInfo.saveDefaultChapterBatch(data).then(res => {
        toast(res.msg)
        if (res.code === 0) {
          $('#setCreateDefaultChapter').modal('hide')
        }
      })
    },

    setTraineesVisibleBatch() {
      // 打开批量设置章节章节是否可见的窗口大小
      // $(".modal-dialog").css("max-width","800px");
      $('#set-chapter-visible').modal('show')
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.getChapterTreeVisible(formData).then((res) => {
        if (res.code === 0) {
          this.zNodesForVisible = []
          this.zNodesForVisible.push(res.data)
        }
      })
    },
    handleVisibleCancel(domId) {
      if (domId) {
        $('#' + domId).modal('hide')
      } else {
        $('#set-chapter-visible').modal('hide')
      }
    },
    handleVisibleSubmit() {
      // 获取所有选中的集合
      const nodes = $.fn.zTree.getZTreeObj('chapter-tree-for-visible').getCheckedNodes(true)
      const chapterIds = []
      if (nodes && nodes.length > 0) {
        nodes.forEach(item => {
          chapterIds.push(item.chapterId)
        })
      }
      const data = {
        ctId: this.ctId,
        pkgId: this.pkgId,
        chapterIds: chapterIds
      }
      this.$api.pkgInfo.setTraineesVisibleBatch(data).then(res => {
        toast(res.msg)
        if (res.code === 0) {
          // 关闭弹窗
          $('#set-chapter-visible').modal('hide')
          // 重新加载左侧树形数据
          const ele = document.getElementById('nav-profile-tab')
          if (ele) {
            ele.click()
          }
        }
      })
    },
    /** 查看课程内容，滑动到最下面时，触发此接口   */
    chapterReadEnded: function() {
      if (this.resgroupIsRead) {
        return false
      }
      this.resgroupIsRead = true
      const params = JSON.parse(JSON.stringify(this.teachingExtraInfo))
      this.$api.classroom.viewChapter(params).then((res) => {})
    },
    /** 音频 和视频 的 自然播放结束 事件  */
    audioOrVideoEnded: function(event) {
      if (!event.attributes || !event.attributes.readid) {
        return false
      }
      const params = JSON.parse(JSON.stringify(this.teachingExtraInfo))
      delete params.resId
      //  let params = {
      //   ctId: (event.attributes.ctid && event.attributes.ctid.value) ? (event.attributes.ctid.value) : '',
      //   pkgId: (event.attributes.pkgid && event.attributes.pkgid.value) ? (event.attributes.pkgid.value) : '',
      //   subjectId: (event.attributes.subjectid && event.attributes.subjectid.value) ? (event.attributes.subjectid.value) : '',
      //   chapterId: (event.attributes.chapterid && event.attributes.chapterid.value) ? (event.attributes.chapterid.value) : '',
      // }
      let url = ''
      if (event.tagName && event.tagName === 'AUDIO') {
        url = 'viewAudio'
        params.audioId = event.attributes.readid.value
      } else if (event.tagName && event.tagName === 'VIDEO') {
        url = 'viewVideo'
        params.videoId = event.attributes.readid.value
      }
      if (!url) {
        return false
      }
      this.$api.classroom[url](params).then((res) => {})
    },
    /** 页面初始数据的方法  */
    isShowPage: function() {
      this.addGroupInfo.pkgId = this.pkgId
      const params = {
        pkgId: this.pkgId,
        subjectId: this.subjectId
      }
      // 如果是课堂详情页面里
      if (this.isClassroomDetail) {
        params.ctId = this.ctId
      }
      this.zNodes = []
      this.pkgResGroupList = []
      this.isShowTinyMce = false
      this.hasNodePermission = false
      this.isShowActivityPage = false
      this.$api.pkgInfo.getBookTreeDataNew(params).then((res) => {
        if (res.code === 0) {
          this.zNodes = []
          this.zNodes.push(res.data)
          this.allChapterId = []
          this.recursiveTree(this.zNodes)
          this.isCreator = res.data.isCreator
          this.isTogetherBuild = res.data.isTogetherBuild
          this.hasSetVisiblePermission = res.data.hasSetVisiblePermission
        }
      })
      this.mountedInit()
    },

    // 递归树
    recursiveTree(value) {
      for (let i = 0; i < value.length; i++) {
        this.allChapterId.push(value[i].chapterId)
        if (value[i].hasActivity) {
          value[i].icon = 'static/image/activity_icon.png'
          value[i].iconSkin = '33'
        }
        if (value[i].children) {
          this.recursiveTree(value[i].children)
        }
      }
    },

    /**
           * 分组前后切换
           */
    chaptersSwitch(value) { // true为下一章  false为上一章  操作
      if (value) {
        if (this.pkgResGroupList.length !== 0 && this.pkgResGroupList.length - 1 > this.currentClickIndex && this.pkgResGroupList[this.currentClickIndex + 1].dictCode !== '2') { // 下一组
          this.handleCutGroup(this.currentClickIndex + 1, this.pkgResGroupList[this.currentClickIndex + 1])
        } else if (this.pkgResGroupList.length !== 0 && this.pkgResGroupList.length > this.currentClickIndex + 2 && this.pkgResGroupList[this.currentClickIndex + 1].dictCode === '2') { // 下下组
          this.handleCutGroup(this.currentClickIndex + 2, this.pkgResGroupList[this.currentClickIndex + 2])
        } else { // 下一章
          for (let i = 0; i < this.allChapterId.length; i++) {
            if (this.allChapterId[i] === this.chapterId && i < this.allChapterId.length - 1) {
              this.$refs.ztreeLibrary.selectNode(this.allChapterId[i + 1])
              setTimeout(() => {
                if (this.pkgResGroupList.length === 0 || this.pkgResGroupList[0].dictCode === '2') {
                  this.chaptersSwitch(true)
                }
              }, 500)
            } else if (this.allChapterId[i] === this.chapterId && i === this.allChapterId.length - 1) {
              toast('这是最后一个分组了，不能再往下了')
            }
          }
        }
      } else {
        if (this.pkgResGroupList.length !== 0 && this.currentClickIndex > 0 && this.pkgResGroupList[this.currentClickIndex - 1].dictCode !== '2') { // 上一组
          this.handleCutGroup(this.currentClickIndex - 1, this.pkgResGroupList[this.currentClickIndex - 1])
        } else if (this.pkgResGroupList.length !== 0 && this.currentClickIndex > 1 && this.pkgResGroupList[this.currentClickIndex - 1].dictCode === '2') { // 上上组
          this.handleCutGroup(this.currentClickIndex - 2, this.pkgResGroupList[this.currentClickIndex - 2])
        } else { // 上一章
          for (let i = 0; i < this.allChapterId.length; i++) {
            if (this.allChapterId[i] === this.chapterId && i > 1) {
              this.$refs.ztreeLibrary.selectNode(this.allChapterId[i - 1])
              setTimeout(() => {
                if (this.pkgResGroupList.length > 0 && this.pkgResGroupList[this.pkgResGroupList.length - 1].dictCode !== '2') {
                  this.handleCutGroup(this.pkgResGroupList.length - 1, this.pkgResGroupList[this.pkgResGroupList.length - 1])
                } else if (this.pkgResGroupList.length > 1 && this.pkgResGroupList[this.pkgResGroupList.length - 1].dictCode === '2') {
                  this.handleCutGroup(this.pkgResGroupList.length - 2, this.pkgResGroupList[this.pkgResGroupList.length - 2])
                } else if (this.pkgResGroupList.length === 0 || this.pkgResGroupList[0].dictCode === '2') {
                  this.chaptersSwitch(false)
                }
              }, 500)
            } else if (this.allChapterId[i] === this.chapterId && i === 1) {
              toast('这是第一个分组了，不能再往上了')
            }
          }
        }
      }
    },

    /** 写在 mounted 上的方法 */
    mountedInit: function() {
      var vm = this
      $('#defaultId').selectpicker('val', this.value != null ? this.value : null)
      $('#defaultId').on('changed.bs.select', function() {
        vm.$emit('input', $('#defaultId').val())
        if (typeof (vm.method) !== 'undefined') {
          vm.method(vm.index, vm.childidx, vm.value)
        }
      })
      $('#defaultId').on('show.bs.select', function() {
        if (typeof (vm.load) !== 'undefined') {
          vm.load(vm.index, vm.childidx)
        }
      })
      if (document.querySelector('#left-nav') && document.querySelector('#left-nav').offsetHeight) {
        vm.editHeight = document.querySelector('#left-nav').offsetHeight - (vm.isClassroomDetail ? 130 : 54) // - 130
      }
    },
    // 设置滚动条高度
    setScrollTop(height) {
      $('.teaching-package-editor-activity').scrollTop(height)
    },
    handleDragStart(e, item, index) {
      if (!this.hasPermission) {
        return false
      }
      this.dragging = item
      this.handleCutGroup(index, item)
    },
    handleDragEnd(e, item) {
      if (!this.hasPermission) {
        return false
      }
      const pkgResGroupIdList = []
      for (let i = 0; i < this.pkgResGroupList.length; i++) {
        if (this.pkgResGroupList[i].resgroupId === this.dragging.resgroupId) {
          this.currentClickIndex = i
        }
        pkgResGroupIdList.push(this.pkgResGroupList[i].resgroupId)
      }
      this.dragging = null
      this.resGroupSort(pkgResGroupIdList)
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(e) {
      if (!this.hasPermission) {
        return false
      }
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      if (!this.hasPermission) {
        return false
      }
      e.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.pkgResGroupList]

      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)

      newItems.splice(dst, 0, ...newItems.splice(src, 1))

      this.pkgResGroupList = newItems
    },

    // 分组移动排序
    resGroupSort(pkgResGroupIdList) {
      const obj = {
        pkgId: this.pkgId,
        resgroupIds: pkgResGroupIdList
      }
      this.$api.pkgInfo.moveResourceGroup(obj)
    },

    // 右键显示自定义菜单
    rightClick(event, group) {
      this.clickPkgResGroup = group
      // 鼠标右击触发事件
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
      if (group.hasSetResVisiblePermission) {
        this.hasSetResVisiblePermission = true
      }
      const menu = document.querySelector('#menu')
      if (menu) {
        menu.style.left = event.clientX + 10 + 'px'
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        menu.style.top = event.clientY + 15 + 'px'
      }
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    },
    // 删除分组
    removeGroup() {
      const nowGroup = this.clickPkgResGroup
      this.menuVisible = false
      const that = this
      confirm('你确定要删除这个分组吗？', () => {
        that.$api.pkgInfo.deleteResourceGroup(nowGroup.resgroupId).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.currentClickIndex = 0
            this.viewChapterInfo()
            /* for (let i = 0; i < that.pkgResGroupList.length; i++) {
                        if (that.pkgResGroupList[i] === nowGroup){
                          that.pkgResGroupList.splice(i,1);
                        }
                      }*/
          } else {
            toast(res.msg)
          }
        })
      })
    },
    /**
             * 是否可以复制当前分组的文本
             */
    handleCopyGroup() {
      const nowGroup = this.clickPkgResGroup
      // console.log(this.clickPkgResGroup)
      const formData = new FormData()
      formData.append('ctId', this.ctId)
      formData.append('pkgId', this.pkgId)
      formData.append('cpId', nowGroup.cpId)
      formData.append('value', nowGroup.isCanCopy === 'Y' ? 'N' : 'Y')
      this.$api.pkgInfo.updateValue(formData).then(res => {
        if (res.code === 0) {
          this.viewChapterInfo()
        }
        toast(res.msg)
      })
    },
    /**
             * 设置学员是否可见
             */
    handleLookGroup() {
      const nowGroup = this.clickPkgResGroup
      const formData = new FormData()
      formData.append('ctId', this.ctId)
      formData.append('pkgId', this.pkgId)
      formData.append('resgroupId', nowGroup.resgroupId)
      formData.append('isTraineesVisible', nowGroup.isTraineesVisible === 'Y' ? 'N' : 'Y')
      this.$api.pkgInfo.setTraineesVisibleResgroup(formData).then(res => {
        if (res.code === 0) {
          this.viewChapterInfo()
        }
        toast(res.msg)
      })
    },
    /**
             * 点击查看章节、分组、资源
             */
    viewChapterInfo() {
      const params = {
        chapterId: this.chapterId,
        pkgId: this.pkgId
      }
      this.$parent.viewPkgInfo()
      if (!this.isClassroomDetail) {
        params.type = 'pkg'
      }
      this.pkgResGroupList = []
      this.$api.pkgInfo.viewChapterInfo(params).then((res) => {
        if (res.code === 0) {
          this.pkgResGroupList = res.data.pkgResGroupList
          if (this.pkgResGroupList == null || this.pkgResGroupList.length === 0) {
            this.isShowTinyMce = false
            this.isShowActivityPage = false
            return false
          }
          const group = this.pkgResGroupList[0]
          const ele = document.getElementById(group.resgroupId)
          if (ele) {
            ele.click()
          }
        }
      })
    },

    // 重命名分组
    renameGroup() {
      const nowGroup = this.clickPkgResGroup
      nowGroup.resgroupName = this.addGroupInfo.resgroupName
      const obj = {
        resgroupId: nowGroup.resgroupId,
        resgroupName: nowGroup.resgroupName
      }
      this.$api.pkgInfo.renameResourceGroup(obj).then(res => {
        if (res.code === 0) {
          toast(res.msg)
          for (let i = 0; i < this.pkgResGroupList.length; i++) {
            if (this.pkgResGroupList[i].resgroupId === nowGroup.resgroupId) {
              this.pkgResGroupList[i] = nowGroup
            }
          }
          $('#addGroupBox').modal('hide')
        } else {
          toast(res.msg)
        }
      })
    },

    // 新增分组判断
    addResourceGroupBoolean() {
      formVaildStyle('.questionsNameHint', '#questionName')
      for (let i = 0; i < this.addGroupInfoList.length > 0; i++) {
        if (!this.addGroupInfoList[i].resgroupName) {
          formInVaildStyle('.questionsoptionHint' + i, '#optionName' + i)
          return false
        }
        formVaildStyle('.questionsoptionHint' + i, '#optionName' + i)
      }
      return true
    },

    // 点击确定新建/编辑分组
    handleSaveResourceGroup() {
      if (this.editGroup) {
        this.renameGroup()
      } else {
        if (this.addResourceGroupBoolean()) {
          this.isViewSave = true
          let addGroupNameList = []
          for (let i = 0; i < this.addGroupInfoList.length; i++) {
            addGroupNameList.push(this.addGroupInfoList[i].resgroupName)
          }
          // 去重
          const arr = new Set(addGroupNameList)
          addGroupNameList = [...arr]
          // 创建接口调用所传对象
          const obj = {
            resgroupId: '',
            chapterId: this.addGroupInfo.chapterId,
            pkgId: this.pkgId,
            subjectId: this.subjectId,
            dictList: this.addDefaultGroup,
            resgroupNameList: addGroupNameList
          }
          this.$api.pkgInfo.saveResourceGroup(obj).then(res => {
            if (res.code === 0) {
              toast(res.msg)
              this.handleCancelAddGroup()
              const params = {
                chapterId: this.addGroupInfo.chapterId,
                pkgId: this.pkgId
              }
              this.$api.pkgInfo.viewChapterInfo(params).then((res) => {
                if (res.code === 0) {
                  if (res.data.pkgResGroupList) { // 点击课程节点
                    const tempNum = this.pkgResGroupList.length
                    this.pkgResGroupList = res.data.pkgResGroupList
                    if (this.pkgResGroupList[tempNum]) {
                      this.$parent.viewPkgInfo()
                      const group = this.pkgResGroupList[tempNum]
                      this.$nextTick(() => {
                        const dom = document.getElementById(group.resgroupId)
                        if (dom) {
                          dom.classList.add('active-editor-nav')
                          dom.click()
                        }
                      })
                    }
                    // this.viewResInfo(this.pkgResGroupList[this.currentClickIndex].resgroupId);
                  }
                  if (res.data.chapterInfo) {
                    this.chapterInfo = res.data.chapterInfo
                    this.addGroupInfo.chapterId = this.chapterInfo.chapterId
                  }
                  this.handleCancelAddGroup()
                }
              })
            } else {
              this.handleCancelAddGroup()
              toast(res.msg)
            }
            this.isViewSave = false
          })
        }
      }
    },

    // 取消新建分组
    handleCancelAddGroup() {
      this.addGroupInfo.resgroupName = ''
      $('#addGroupBox').modal('hide')
      this.addGroupInfoList = []
      this.addDefaultGroup = []
      $('.cb-form-valid').removeClass('cb-form-valid')
      $('.cb-form-invalid').removeClass('cb-form-invalid')
    },

    // 点击切换分组
    handleCutGroup(index, pkgResGroup) {
      this.resgroupIsRead = false
      this.currentClickIndex = index
      this.resgroupId = this.pkgResGroupList[this.currentClickIndex].resgroupId
      this.teachingExtraInfo.resId = this.pkgResGroupList[this.currentClickIndex].resId
      // 如果为[活动]
      if (String(pkgResGroup.dictCode) === '2') {
        // TODO 隐藏富文本、显示活动列表等操作
        this.isShowActivityPage = true
        this.isShowTinyMce = false
        const that = this
        setTimeout(() => {
          if (that.$refs.activity) {
            that.$refs.activity.isShowPage()
          }
        }, 500)
      } else {
        this.isShowTinyMce = true
        this.isShowActivityPage = false
        this.viewResInfo(this.pkgResGroupList[this.currentClickIndex].resgroupId)
      }
    },

    // 点击显示新建/编辑分组弹窗
    handleshowGroupBox(value) {
      this.menuVisible = false
      this.editGroup = value
      if (value) {
        $('.modal-name').html('重命名分组')
        this.addGroupInfo.resgroupName = this.clickPkgResGroup.resgroupName
      } else {
        this.getDefaultGroup()
        $('.modal-name').html('新建分组')
        this.addGroupInfo.resgroupName = ''
        this.addGroupInput()
      }
      $('#addGroupBox').modal('show')
    },

    // 点击保存
    handleSaveResource() {
      if (this.saveResourceData.resId) {
        this.saveResourceData.resContent = tinyMCE.editors['resContent'].getContent()
        this.saveResourceData.pkgId = this.pkgId
        this.$api.pkgInfo.saveResource(this.saveResourceData).then(res => {
          toast(res.msg)
        })
      }
    },
    // 自动保存
    automaticHandleSaveResource() {
      if (this.saveResourceData.resId) {
        this.saveResourceData.pkgId = this.pkgId
        this.$api.pkgInfo.saveResource(this.saveResourceData).then(res => {})
      }
    },
    // 左则树节点点击事件
    showLibraryForm(data) {
      this.ifShowClassroomIntroNew = false
      // 章节节点是否有权限
      this.hasNodePermission = data.treeNode.hasPermission
      if (data.type === 'subject') {
        // 课堂节点目前是没有分组的
        this.pkgResGroupList = []
        this.isShowTinyMce = false // 关闭富文本
        this.isShowActivityPage = false // 关闭活动页面
        this.clickedNodeType = data.type
      } else {
        this.clickedNodeType = 'chapter'
      }
      this.chapterId = data.chapterId
      this.resgroupIsRead = false
      this.teachingExtraInfo.chapterId = data.chapterId
      if (data.dataForm && data.dataForm != null && data.dataForm !== 'null') {
        this.currentClickIndex = 0
        // 资源分组
        if (data.dataForm.pkgResGroupList) {
          this.pkgResGroupList = data.dataForm.pkgResGroupList
          this.clearSaveResourceData()
          if (data.dataForm.pkgResGroupList[0]) {
            this.resgroupId = data.dataForm.pkgResGroupList[0].resgroupId
            this.teachingExtraInfo.resId = data.dataForm.pkgResGroupList[0].resId
            this.saveResourceData.resContent = data.dataForm.pkgResGroupList[0].resContent
            this.saveResourceData.resContentTogetherBuild = this.saveResourceData.resContent
            this.saveResourceData.resId = data.dataForm.pkgResGroupList[0].resId
            // 富文本赋值
            if (tinyMCE.editors['resContent']) {
              tinyMCE.editors['resContent'].setContent(this.pkgResGroupList[0].resContent)
            }
          }
          if (this.pkgResGroupList.length > 0) {
            if (this.pkgResGroupList[0].dictCode !== '2') {
              this.isShowTinyMce = true // 显示富文本
              this.isShowActivityPage = false
            } else {
              this.isShowActivityPage = true // 显示活动页面
              this.isShowTinyMce = false
              const that = this
              setTimeout(() => {
                if (that.$refs.activity) {
                  that.$refs.activity.isShowPage()
                }
              }, 500)
            }
          } else {
            this.isShowTinyMce = false // 关闭富文本
            this.isShowActivityPage = false // 关闭活动页面
          }
          // this.viewResInfo(this.pkgResGroupList[this.currentClickIndex].resgroupId);
        }
        // 资源
        if (data.dataForm.chapterInfo) {
          this.chapterInfo = data.dataForm.chapterInfo
          this.addGroupInfo.chapterId = this.chapterInfo.chapterId
        }
      }
      this.$nextTick(() => {
        if (!this.isClassroomDetail && document.querySelector('#left-nav') && document.querySelector('#left-nav').offsetHeight) {
          this.editHeight = document.querySelector('#left-nav').offsetHeight - 54 // - 130
          // 动态更改编辑器的高度
          if (this.$el.querySelector('.teaching-package-editor .tox') && (this.$el.querySelector('.teaching-package-editor .tox').className).indexOf('fullscreen') < 0) {
            this.$el.querySelector('.teaching-package-editor .tox').style.height = this.editHeight + 'px'
          }
        }
      })
    },
    // 清空
    clearSaveResourceData() {
      this.saveResourceData = {
        resContent: '',
        resId: ''
      }
      if (tinyMCE.editors['resContent']) {
        tinyMCE.editors['resContent'].setContent('') // 富文本赋值
      }
    },

    // 显示资源内容
    viewResInfo(resgroupId) {
      this.$api.pkgInfo.viewResInfo(resgroupId).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.clearSaveResourceData()
            this.saveResourceData.resContent = res.data.resContent
            this.saveResourceData.resId = res.data.resId
            if (this.saveResourceData.resContent) {
              if (tinyMCE.editors['resContent']) {
                tinyMCE.editors['resContent'].setContent(this.saveResourceData.resContent) // 富文本赋值
              }
            }
          }
        }
      })
    },

    removeSucc() {

    },

    // 获取默认分组消息
    getDefaultGroup() {
      const obj = { chapterId: this.chapterId, pkgId: this.pkgId }
      this.$api.pkgInfo.listResourceGroup(obj).then((res) => {
        if (res.code === 0) {
          this.defaultGroupList = res.data
        }
      })
    },

    // 添加分组的输入框
    addGroupInput() {
      if (this.addGroupInfoList.length + this.pkgResGroupList.length + this.addDefaultGroup.length < 10) {
        const obj = { resgroupId: '', resgroupName: '', chapterId: '', pkgId: '' }
        this.addGroupInfoList.push(obj)
      } else {
        toast('该章节分组已满')
      }
    },

    // 删除分组的输入框
    delGroupInput(index) {
      this.addGroupInfoList.splice(index, 1)
    },

    // 编辑工具栏浮动
    onScroll() {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      // var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      // var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if ($('.tox-editor-header').css('position') && $('.tox-editor-header').css('position') === 'relative') {
        this.editorToolbarOffsetTop = $('.tox-editor-header').offset().top
      }
      if ($('.tox-editor-header').offset() && this.editorToolbarOffsetTop <= scrollTop && this.editorToolbarOffsetTop !== 0) {
        $('.tox-editor-header').css({ 'position': 'fixed', 'width': '843px', 'top': '50px' })
      } else {
        $('.tox-editor-header').css({ 'position': 'relative', 'width': '100%', 'top': '0' })
      }

      this.foo()
    }

  }
}
</script>

<style scoped>

    .teaching-material{
        display: flex;
        width: 100%;
        padding-top: 15px;
        border-bottom: 1px solid #e0e0e0;
        position: relative;
    }
    .teaching-material-two{
      /* height: calc(100vh - 50px - 138px - 10px - 36px - 20px ); */
      height: calc(100vh - 254px );
    }
    /* 左边列表start */
    .left-teaching-material-catalogue{
        width: 29%;
        height: 100%;
        padding: 0 5px;
        transition: width 1s;
    }
    .left-teaching-material-catalogue .catalogue{
        width: 100%;
        /* min-height: calc(100vh - 110px - 289px - 30px); */
        /*min-height: calc(100vh - 50px - 110px - 30px);*/
        min-height: calc(100vh - 270px);
        overflow-x: hidden;
        overflow-y: auto;
    }
    .ztree li a{
        color: #333;
    }
    /* 左边列表end */
    /* 右边内容start */
    .right-teaching-material-con{
        width: 71%;
        height:100%;
        /*background-color: #e4e4e4;*/
        /*padding-left: 6px;*/
        margin-left: 6px;
        margin-right: 6px;
        transition: width 1s;
    }
    .right-teaching-material-con .header-nav{
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height:39px;
        background-color: #f5f5f5;
        color: #666;
        font-size: 14px;
        border-bottom: 1px solid #dee2e6;
    }
    .right-teaching-material-con .header-nav .editor-nav{
        display: flex;
        align-items: center;
        height:100%;
        z-index: inherit;
        position: relative;
    }
    .header-nav .editor-nav .editor-nav-item{
        padding: 0 5px;
        width: 100px;
        height:100%;
        line-height: 36px;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        margin-bottom: -1px;
    }
    .header-nav .editor-nav .editor-nav-item:hover{
        color: #FF740E;
    }
    .header-nav .editor-nav .active-editor-nav{
        background-color: #ffffff;
        color: #0079fe;
        border-top: 1px solid #dee2e6;
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;
    }
    .right-teaching-material-con .header-nav .add-edit-nav-btn{
        cursor: pointer;
        display: flex;
        align-items:center;
        flex-shrink: 0;
    }
    .right-teaching-material-con .header-nav .add-edit-nav-btn > img{
        width: 32px;
        height:32px;
    }
    .right-teaching-material-con .header-nav .add-edit-nav-btn > div{
        font-size: 25px;
        width: 32px;
        height:32px;
        line-height: 32px;
        border-radius: 50%;
    }
    .right-teaching-material-con .header-nav .add-edit-nav-btn > div:hover{
        background-color: #dadada;
    }
    .right-teaching-material-con .header-nav .add-edit-nav-btn{
       margin: 0 8px;
    }
    .right-teaching-material-con .header-nav .save-btn{
        position: absolute;
        bottom:-82px;
        z-index: 888;
        right: 10px;
    }
    .right-teaching-material-con .header-nav .save-btn .save-icon{
        margin-right: 5px;
    }
    .right-tip{
        font-size:12px;
        padding-top:20px;
        padding-left:20px;
        color:#ffd200;
        text-align: left;
    }
    .teaching-package-editor{
        width: 100%;
        height: 610px;
        background-color: #fff;
        padding-top:8px;
    }
    .teaching-package-editor-activity{
        width: 100%;
        height: 610px;
        background-color: #fff;
        margin-top:8px;
        overflow-y: scroll;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 0px 5px 0px!important;
    }
    .teaching-package-editor-two{
      height: calc(100% - 47px);
    }
    .news-info-btn-list{
        margin-top:10px;
        text-align: center;
    }
    .news-info-btn-list button{
        width: 100px;
        margin-right:10px;
    }
    .group-form{
        display:flex;
        align-items: center;
        padding:8px 0;
        height: 54px;
    }
    .group-form .group-name{
        width:23%;
    }
    .group-form .group-name > span{
        color: red;
        margin-left: 2px;
    }
    .group-input{
        width: 65%;
    }
    .del-group-input:hover{
        cursor: pointer;
    }
    .default-group-name{
        width:23%;
    }
    .default-group-name > span{
        color: red;
        margin-left: 2px;
    }
    .default-group-choose{
        width: 65%;
        font-size: 16px;
        height: 38px;
    }
    .del-group-input{
        margin-left: 10px;
    }
    .add-group-input-btn{
        text-align: right;
        padding-right: 12%;
        color: #4acacb;
    }
    .add-group-input-btn span:hover{
        cursor: pointer;
    }
    /* 右边内容end*/
    .menu {
      cursor: default;
      position: fixed;
      z-index: 99999;
      padding-inline-start: 0px;
      background-color: #FFFFFF;
    }
    #rMenu{
      position: relative;
      visibility: visible;
    }
    /* 左侧章节收缩按钮样式 */
    .shrinkage-btn{
      position: absolute;
      top: 50%;
      left: -20px;
      margin-top: -100px;
      height:100px;
      padding: 12px 0;
      line-height: 37px;
      color: #fff;
      width:20px;
      background-color: #c4c6c9f6;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      cursor: pointer;
    }
    .shrinkage-btn:hover{
      background-color: #0079fe;
    }
    /*批量设置章节是否可见的滚动条*/
    .chapter-visible-pre-content {
      height: 500px;
      overflow: hidden;
      overflow-y: scroll;
    }
</style>
