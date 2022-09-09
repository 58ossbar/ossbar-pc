<!-- 云盘页面 -->
<template>
  <div class="cloud-disk-box">
    <div class="wind-1240 cloud-disk">
      <div class="displayFlex2">
        <!-- 左边菜单显示区域begin -->
        <div class="serach cloud-disk-left">
          <div class="directory-title">
            云盘目录
          </div>
          <ul class="nav-list">
            <li
              v-for="(item,index) in leftNavList"
              :key="index"
              :class="['nav-item',index === currentNavIndex ? 'nav-item-active':'']"
              style="display: flex;justify-content: space-between;"
              @click="handleLeftNav(index,item)">
              <div :style="(!item.hasOperPermission && hasPermission) ? 'color:#959da0' : ''">
                <i :class="[item.icon]"/>
                <span>{{ item.name }}</span>
              </div>
              <div v-if="(((releaseStatus && item.dictCode ==='') || isClassroomDetail) && !isClassroomFinished && index === currentNavIndex && hasPermission) && (!item.id || (item.id && item.hasOperPermission))" @click.stop>
                <el-dropdown trigger="click">
                  <i class="el-icon-more"/>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="!item.id" icon="el-icon-plus" @click.native="addLeftNav(item,'新增')">新建文件夹</el-dropdown-item>
                    <el-dropdown-item v-if="item.id && item.hasOperPermission" icon="el-icon-edit" @click.native="editLeftNav(item,'修改')">修改</el-dropdown-item>
                    <el-dropdown-item v-if="item.id && item.hasOperPermission" icon="el-icon-delete" @click.native="delLeftNav(item)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </li>
          </ul>
        </div>
        <!-- 新增/编辑弹出框 -->
        <modal-dialog
          id="edit-left-nav"
          :title="operationName"
          @cancel="handleEditCancel"
          @submit="handleEditSubmit">
          <div slot="main">
            <div class="group-form">
              <div class="group-name">
                图标
                <span>*</span>
              </div>
              <e-icon-picker v-model="icon" class="icon-picker" style="width:100%"/>
            </div>
            <div class="group-form">
              <div class="group-name">
                名称
                <span>*</span>
              </div>
              <input
                id="optionName"
                v-model="editFileName"
                type="text"
                maxlength="8"
                class="form-control group-input"
                placeholder="请输入"
                @keyup.enter="handleEditSubmit">
            </div>
          </div>
        </modal-dialog>
        <!-- 新增/编辑弹出框 end -->
        <!--  右边文件显示区域 begin -->
        <div class="cloud-disk-right">
          <!-- 按钮栏begin -->
          <div class="cloud-disk-right-btns">
            <el-dropdown v-if="(releaseStatus || isClassroomDetail) && currFilePath[currFilePath.length - 1].hasOperPermission && hasPermission && !isClassroomFinished" style="margin-right: 20px;outline: hidden;">
              <el-button type="primary" size="small" plain trigger="click">
                上传文件<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-document" @click.native="openFileUpload(true)">文件</el-dropdown-item>
                <el-dropdown-item icon="el-icon-folder-opened" @click.native="openFileUpload(false)">文件夹</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <input id="folder-upload-input" name="file" type="file" webkitdirectory style="display: none;" @change="selectFile">
            <el-drawer
              :before-close="handleClose"
              :visible.sync="drawer"
              :with-header="false"
              title="我是标题">
              <!--:limit="15"
              :on-exceed="handleExceed"-->
              <el-upload
                ref="my-upload"
                :on-progress="handleUploadProgress"
                :on-change="handleUploadChange"
                :on-remove="handleUploadRemove"
                :auto-upload="true"
                :http-request="handleUploadFile"
                class="upload-demo"
                style="padding: 50px 50px 0 50px;height: 700px;overflow-y: scroll"
                drag
                action=""
                multiple>
                <i class="el-icon-upload"/>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-drawer>
            <!-- 文件上传结束 -->
            <!-- 新增文件夹按钮 -->
            <el-button
              v-if="(releaseStatus || isClassroomDetail) && currFolder.id && currFilePath[currFilePath.length - 1].hasOperPermission && hasPermission && !isClassroomFinished"
              :disabled="isAddFolder"
              type="primary"
              plain
              size="small"
              icon="el-icon-plus"
              style="margin-right: 20px"
              @click="addFolder">新增文件夹</el-button>
            <!-- 复制文件按钮 -->
            <el-button
              v-if="(releaseStatus || isClassroomDetail) && hasPermission && !isClassroomFinished && !currFolder.refPkgDir"
              type="primary"
              plain
              size="small"
              icon="el-icon-s-open"
              style="margin: 0 20px 0 0"
              @click="fileModal(false)">复制到</el-button>
            <!-- 移动文件按钮 -->
            <el-button
              v-if="(releaseStatus || isClassroomDetail) && hasPermission && !isClassroomFinished && !currFolder.refPkgDir"
              type="primary"
              plain
              size="small"
              icon="el-icon-s-promotion"
              style="margin: 0 20px 0 0"
              @click="fileModal(true)">移动到</el-button>
            <!-- 删除文件按钮 -->
            <el-button
              v-if="(releaseStatus || isClassroomDetail) && hasPermission && !isClassroomFinished && !currFolder.refPkgDir"
              type="danger"
              size="small"
              plain
              icon="el-icon-delete-solid"
              style="margin: 0 20px 0 0"
              @click="delFile">删除</el-button>
            <!-- 编辑按钮 -->
            <el-input
              v-model="searchFileValue"
              placeholder="搜索文件"
              style="width:30%"
              size="small"
              suffix-icon="el-icon-search"
              @change="searchFile"/>
          </div>
          <!-- 按钮栏end-->
          <!-- 文件夹的当前位置begin -->
          <div class="cloud-disk-right-files-location">
            <div v-for="(item,index) in currFilePath" :key="index" class="files-location-item" @click="pathToJump(index,item)"><span>{{ item.name }}</span></div>
          </div>
          <!-- 文件夹的当前位置end-->
          <!-- 文件/文件夹 表格 begin -->
          <div class="cloud-disk-right-files-table">
            <el-table
              v-loading="isLoadingTable"
              ref="multipleTable"
              :data="currFilesList"
              :header-cell-style="{padding: '5px 0'}"
              height="465"
              tooltip-effect="dark"
              style="width: 100%"
              class="cloud-disk-table"
              @row-dblclick="!isAddFolder ? toFileOrFolder($event) : ''"
              @selection-change="handleSelectionChange">
              <!-- 复选框 -->
              <el-table-column
                v-if="hasPermission"
                :selectable="selectable"
                type="selection"
                width="55"/>
              <!-- 文件图标加名称 -->
              <el-table-column
                :width="hasPermission ? 260 : 310"
                sortable
                prop="name"
                label="名称"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-col :span="1">
                    <img
                      :src="(scope.row.type === '1') ? 'static/image/cloud_disk_icon/folder.png':
                      ( (scope.row.typeName === 'ppt' || scope.row.typeName === 'pptx') ? 'static/image/cloud_disk_icon/powerpoint.png':
                      ( (scope.row.typeName === 'doc' || scope.row.typeName === 'docx' || scope.row.typeName === 'rtf' || scope.row.typeName === 'wps') ? 'static/image/cloud_disk_icon/word.png':
                      ( (scope.row.typeName === 'pdf') ? 'static/image/cloud_disk_icon/pdf.png':
                      ( (scope.row.typeName === 'zip' || scope.row.typeName === 'rar' || scope.row.typeName === '7z') ? 'static/image/cloud_disk_icon/archive.png':
                      ( (scope.row.typeName === 'xls' || scope.row.typeName === 'xlsx') ? 'static/image/cloud_disk_icon/excel.png':
                      ( (scope.row.fileType === 'audio') ? 'static/image/cloud_disk_icon/audio.png':
                      ( (scope.row.fileType === 'video') ? 'static/image/cloud_disk_icon/video.png':
                      ( (scope.row.fileType === 'image') ? 'static/image/cloud_disk_icon/image.png':
                      ( (scope.row.typeName === 'txt') ? 'static/image/cloud_disk_icon/document.png':'static/image/cloud_disk_icon/file.png')))))))))"
                      style="width:16px;height:16px;" >
                  </el-col>
                  <el-col :span="15">
                    <b-form-input
                      v-focus="scope.row.name === ''"
                      v-if="scope.row.name === ''"
                      id="addFolder"
                      v-model="inputFolderName"
                      type="text"
                      style="height: 23px;margin-left: 10px;font-size: 13px;padding: 2px 2px;"
                      placeholder="新建文件夹"
                      @keyup.esc="cancelAddFolder"
                      @keyup.enter="$event.target.blur"
                      @blur="determineAddFolder"
                    />
                  </el-col>
                  <el-col :span="23">
                    <span v-if="scope.row.name !== ''" :title="scope.row.name" class="folder-name" @click.stop="toFileOrFolder(scope.row,true)">{{ scope.row.name }}</span>
                  </el-col>
                  <div v-viewer v-if="scope.row.fileType === 'image'" :class="scope.row.id + 'img'" style="display: none;">
                    <img :src="scope.row.fileAccessUrl" alt >
                  </div>
                </template>
              </el-table-column>
              <!-- 上次修改时间 -->
              <el-table-column
                :width="170"
                prop="updateTime"
                label="上次修改时间"
                sortable/>
              <!-- 文件大小 -->
              <el-table-column
                label="大小"
                prop="fileSize"
                sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.fileSize | filterType }}</span>
                </template>
              </el-table-column>
              <!-- 所在目录 -->
              <el-table-column
                v-if="(releaseStatus || isClassroomDetail)"
                :width="325"
                prop="fileSize"
                label="操作"
                align="left"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button v-if="scope.row.hasOperPermission && hasPermission && !isClassroomFinished" :disabled="isEditFolder" size="mini" @click.stop="editFolderName(scope.row)">重命名</el-button>
                  <el-button v-if="scope.row.hasOperPermission && hasPermission && !isClassroomFinished" size="mini" @click.stop="delOneFile(scope.row)">删除</el-button>
                  <el-button v-if="hasPermission && scope.row.type !== '1'" size="mini" @click.stop="copyFileHref(scope.row)">生成链接</el-button>
                  <el-button v-if="!hasPermission && scope.row.type !== '1' && !isClassroomFinished" size="mini" @click.stop="downloadFile(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 文件/文件夹 表格 end-->
          <div class="file-num">已全部加载，共{{ currFilesList.length }}个</div>
        </div>
        <!-- 右边文件显示区域 end -->
        <!-- 移动文件弹出框开始 -->
        <modal-dialog
          id="move-file-dialog"
          :title="isMove ? '移动到' : '复制到'"
          @submit="submitMoveFile"
          @cancel="cancelMoveFile">
          <div slot="main">
            <div class="move-tree">
              <el-tree
                :data="data"
                node-key="dirId"
                @node-click="handleNodeClick">
                <span slot-scope="{ data }" class="custom-tree-node">
                  <span>
                    <i class="el-icon-folder"/> {{ data.name }}
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </modal-dialog>
        <!-- 移动文件弹出框开始 -->
      </div>
    </div>
  </div>
</template>

<script>
import { formInVaildStyle, formVaildStyle, baseUrl, toast, confirm, loadingModal, concatImgUrl } from '@/utils/global'
import ModalDialog from '@/components/modal-dialog'
import $ from '@/assets/jquery-vendor'
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
export default {
  name: 'CloudDisk',
  components: {
    'modal-dialog': ModalDialog
  },
  // 自定义指令
  directives: {
    focus: {
      inserted: function(el, binding, vnode, oldVnode) {
        el.focus()
        el.select()
      }
    }
  },
  filters: {
    // 文件大小格式显示
    filterType: function(val) {
      if (!val) return '--'
      val = +val
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(val) / Math.log(k))
      return (val / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    // 文字过长省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 20) {
        return value.slice(0, 20) + '...'
      }
      return value
    }
  },
  props: {
    // 是否为课堂详情页面
    isClassroomDetail: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否不显示操作按钮
    releaseStatus: {
      type: Boolean,
      required: false,
      default: false
    },
    isClassroomFinished: {
      type: Boolean,
      default: false
    },
    // 当前用户权限
    hasPermission: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showDirectoryLookList: [], // 可查看目录的值
      directoryLooklList: [], // 所有目录的值
      operationName: '新增', // 新增/编辑弹出框头部标题
      pkgId: localStorage.getItem('pkgId'), // 当前教学包主键
      ctId: localStorage.getItem('ct_id'),
      currLeftNav: {}, // 当前点击的左侧导航栏
      isSearch: false,
      isAddFolder: false, // 是否正在新建文件夹
      isEditFolder: false, // 是否正在修改文件名
      inputFolderName: '', // 新增文件夹的名称
      editFileName: '', // 修改文件的名称
      editFile: {}, // 当前修改的文件
      drawer: false, // 右侧文件上传抽屉
      pageName: '云盘', // 当前页面在当前位置的名称
      currFilePath: [{ name: '全部', id: '' }],
      currFilesList: [], // 当前表格的 文件数据
      allFilesList: [], // 所有文件数据
      isLoadingTable: false, //  当前表格 是否正在加载
      leftNavList: [], // 左边导航
      currentNavIndex: 0, // 当前显示左边导航的下标
      selectedFilesList: [], // 当前选手中复选框的数据
      currFolder: { createTime: '', name: '全部', id: '', hasOperPermission: true, dictCode: '' }, // 当前访问的文件夹
      isUploadSate: false, // 关闭上传模态框是否出现提示
      totalUploadFileNum: 0, // 上传的总文件个数
      uploadFileNum: 0, // 上传了的文件个数
      fileList: [], // 上传的文件
      data: [], // 移动/复制 树控件信息
      // 当前点击的  移动/复制  树控件中文件夹的信息
      defaultProps: {
        dirId: ''
      },
      isMove: false, // 是否是移动文件
      searchFileValue: '', // 搜索文件内容
      icon: '',
      editNameTempArr: [],
      allStudent: [], // 当前课堂的所有学员
      checkedAll: false, // 是否全选
      filterMethod(query, item) {
        return item.traineeName.indexOf(query) > -1
      },
      dirData: [], // 文件树的数据
      dirDataNum: 0,
      stuCheckList: [], // 所有选中学员
      checkStudentAll: false, // 文件授权是否全选学员
      isIndeterminate: false,

      checkPreAll: false, // 文件选择是否全选
      isIndeterminatePre: false,

      singleFilePermsMemberlist: [], // 单个文件授权  全课堂学员数组
      selectSingleFilePermsMemberlist: [], // 单个文件授权  已授权的学员数组
      singleFilePermsMemberlistPagerInfo: {
        mobile: '',
        traineeName: ''
      }, //  单个文件授权  全部课堂成员 搜索条件
      isCheckAllSingleFilePermsTrainee: false, // 单个文件授权  全课堂学员数组 是否全选
      singleFilePermsCurrInfo: {}, // 单个文件授权   选择的文件的 数据项

      filterAllStudentName: ''// 全部文件 授权  学员列表 筛选  过滤

    }
  },
  watch: {
    'singleFilePermsMemberlist': function(nValue) {
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelected === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllSingleFilePermsTrainee = false
        } else {
          this.isCheckAllSingleFilePermsTrainee = true
        }
      }
    }

  },
  methods: {
    selectFile(e) {
      // 文件大小限制
      let size = 0
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('dirId', this.currFolder.id)
      Object.keys(e.target.files).forEach(function(key) {
        formData.append('file', e.target.files[key])
        size += e.target.files[key].size
      })
      console.log('文件夹上传')
      console.log('大小', size, size / 1024 / 1024 + 'MB')
      if (size / 1024 / 1024 > 300) {
        toast('所选文件夹大小超过300MB')
        return false
      }
      loadingModal(true, '正在上传中...')
      this.$api.cloudDisk.uploadFolder(formData).then(res => {
        // 提示
        toast(res.msg)
        // 关闭弹窗
        loadingModal(false)
        // 加载左侧目录
        if (!this.currFolder.id) {
          this.getLeftNavData('全部')
          this.getCurrFilesList()
        } else {
          // 重新加载右侧表格中的数据
          this.getCurrFilesList()
        }
        // 清空值，避免重复上传时，无法上传
        const input = document.getElementById('folder-upload-input')
        if (input) {
          input.value = null
        }
      })
    },
    // 打开文件上传抽屉
    openFileUpload(isFile) {
      if (!isFile) {
        // toast('暂不支持文件夹上传！')
        const input = document.getElementById('folder-upload-input')
        if (input) {
          input.click()
        }
        return false
      } else {
        this.drawer = true
        this.$nextTick(() => {
          // console.log(document.getElementsByClassName('el-upload__input'))
          const inputList = document.getElementsByClassName('el-upload__input')
          if (inputList && inputList.length > 0) {
            for (let i = 0; i < inputList.length; i++) {
              inputList[i].webkitdirectory = false
              inputList[i].directory = false
              this.$forceUpdate()
            }
          }
        })
      }
    },
    // 获取当前课堂所有成员
    getAllStudent() {
      const formData = new FormData()
      formData.append('ctId', this.ctId)
      formData.append('traineeName', this.filterAllStudentName)

      this.$api.classroomMember.queryAllTrainee(formData).then(res => {
        if (res.code === 0) {
          this.allStudent = res.data.filter(item => item.state === 'Y')
        }
      })
    },

    // 点击操作选择按钮
    handleOperationBtn(state) {
      if (this.selectedFilesList.length <= 0) {
        toast('请选择要操作的文件或文件夹')
        return
      }
      if (state === 0) {
        this.fileModal(false)
      } else if (state === 1) {
        this.fileModal(true)
      } else if (state === 2) {
        this.delFile()
      } else if (state === 3) {
        this.editFolderName()
      }
    },
    // 判断文件是否可以勾选
    selectable(row, index) {
      return !!row.hasOperPermission
    },
    /**
     * 返回课堂
     */
    toBackTeachingrDetail: function() {
      this.$router.push('/teaching-center/teachingr-detail')
    },
    /**
     * 获取 当前表格的 文件数据
     */
    getCurrFilesList: function() {
      this.isSearch = false
      // 显示忙碌加载
      this.isLoadingTable = true
      // 存入当前需要查看的文件夹的参数
      const formData = new FormData()
      formData.append('dirId', this.currFolder.id)
      formData.append('pkgId', this.pkgId)
      if (this.isClassroomDetail) {
        formData.append('ctId', this.ctId)
      }
      // 调用查看文件夹内容的接口
      this.$api.cloudDisk.viewDetail(formData).then(res => {
        if (res.code === 0) {
          // 清空之前显示的文件信息
          this.currFilesList = []
          // 截取出文件类型并存入
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].type === '2') {
              res.data[i].fileAccessUrl = baseUrl + res.data[i].fileAccessUrl
              res.data[i].typeName = res.data[i].name.slice(res.data[i].name.lastIndexOf('.') + 1)
            }
            this.currFilesList.push(res.data[i])
          }
        } else {
          this.currFilesList = []
          toast(res.msg)
        }
        // 取消忙碌加载
        this.isLoadingTable = false
      })
    },
    /**
     * 获取左边导航的数据
     */
    getLeftNavData(value) {
      const obj = {
        name: '',
        pkgId: this.pkgId
      }
      if (this.isClassroomDetail) {
        obj.ctId = this.ctId
      }

      this.$api.cloudDisk.queryDirList(obj).then(res => {
        if (res.code === 0) {
          // 存入根目录
          this.leftNavList = [{ createTime: '', hasOperPermission: true, name: '全部', dictCode: '', id: '', dirId: '', icon: 'iconfont icon-quanbudingdan' }]
          // 左导航插入图标信息
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].name.indexOf('教学大纲') > -1) {
              res.data[i].icon = res.data[i].icon || 'iconfont icon-zichan-quanbushebei'
            } else if (res.data[i].name.indexOf('任务书') > -1) {
              res.data[i].icon = res.data[i].icon || 'iconfont icon-renwu'
            } else if (res.data[i].name.indexOf('讲义PPT') > -1) {
              res.data[i].icon = res.data[i].icon || 'iconfont icon-ppt'
            } else if (res.data[i].name.indexOf('实施计划') > -1) {
              res.data[i].icon = res.data[i].icon || 'iconfont icon-jihua'
            } else if (res.data[i].name.indexOf('思维导图') > -1) {
              res.data[i].icon = res.data[i].icon || 'fa fa-themeisle'
            }
            res.data[i].id = res.data[i].dirId
            this.leftNavList.push(res.data[i])
            // 定位到点击的左导航
            if (value && res.data[i].name === value) {
              this.currentNavIndex = i + 1
              this.currFolder = res.data[i]
              this.getCurrFilesList()
            }
          }
        }
      })
    },

    isShowPage: function() {
      this.getLeftNavData('全部')
      this.getAllStudent()
      this.searchFileValue = ''
      this.handleLeftNav(0, { createTime: '', hasOperPermission: true, name: '全部', dictCode: '', id: '', dirId: '', icon: 'icon-quanbudingdan' })
    },
    /**
     * 左导航切换事件
     */
    handleLeftNav(index, item) {
      this.searchFileValue = ''
      // 当前导航下标
      this.currentNavIndex = index
      // 当前导航信息
      this.currFolder = item
      // 清空路径导航
      this.currFilePath = []
      // 路径导航存入当前导航信息
      this.currFilePath.push(item)
      // 刷新文件数据
      this.getCurrFilesList()
    },
    /**
     *  文件上传
     */
    handleUploadFile(params) {
      // 限制文件上传大小    小于200m
      if (parseInt(params.file.size) > (200 * 1024 * 1024)) {
        toast('上传的文件不能大于200M')
        return
      }
      // 创建接口调用所需的传参数据
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('dirId', this.currFolder.id)
      formData.append('pkgId', this.pkgId)
      // 调用文件上传接口
      const that = this
      this.$api.cloudDisk.uploadFile(formData, (progress) => {
        if (progress) { // 显示文件进度条
          params.onProgress({ percent: progress })
        }
      }, (cancel) => { // 取消文件上传
        // 取消文件上传事件  存入当前文件中
        params.file.cancelFun = cancel
        that.fileList.push(params.file)
      }).then(res => {
        if (res.code === 0) {
          // 显示该文件上传成功
          params.onSuccess()
          // 移出上传成功的文件
          for (let i = 0; i < that.fileList.length; i++) {
            if (that.fileList[i].uid === params.file.uid) {
              that.fileList.splice(i, 1)
              i--
            }
          }
          // 刷新数据
          this.getCurrFilesList()
        } else {
          // 显示该文件上传失败
          params.onError()
        }
        toast(res.msg)
      }).catch(() => { // err
        // 移出上传异常的文件
        for (let i = 0; i < that.fileList.length; i++) {
          if (that.fileList[i].uid === params.file.uid) {
            that.fileList.splice(i, 1)
            i--
          }
        }
      })
    },
    // 文件下载
    downloadFile(item) {
      // this.upload(item);
      const a = document.createElement('a')
      a.href = `${baseUrl}cloud-api/file/downloadFile?fileId=${item.id}&pkgId=${this.pkgId}`
      a.target = '_blank'
      a.download = item.name
      a.click()
    },

    upload(value) {
      const image = new Image()
      // 解决跨域 canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function() {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        // 得到图片的base64编码数据
        const url = canvas.toDataURL('image/png')
        // 生成一个 a 标签
        const a = document.createElement('a')
        // 创建一个点击事件
        const event = new MouseEvent('click')
        // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
        a.download = value.name || '图片'
        // 将生成的 URL 设置为 a.href 属性
        a.href = url
        // 触发 a 的点击事件
        a.dispatchEvent(event)
        // return a;
      }
      image.src = value.fileAccessUrl
    },
    /**
     *  移出文件
     */
    handleUploadRemove(file, fileList) {
      // 找出当前取消的文件
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid === file.uid) {
          this.fileList[i].cancelFun('cancel')
          this.fileList.splice(i, 1)
          return false
        }
      }
    },
    /**
     * 管理文件删除窗口
     */
    handleClose(done) {
      const that = this
      if (this.isUploadSate) {
        done()
      } else {
        done()
        that.uploadFileNum = 0
        that.totalUploadFileNum = 0
        that.$refs['my-upload'].clearFiles()
      }
    },
    /**
     * 新增文件夹操作
     */
    addFolder() {
      // 获取当前时间
      const time = this.getFormatDate()
      // 新增文件夹中  使新增文件夹按钮禁用
      this.isAddFolder = true
      this.isEditFolder = false
      // 文件首行添加一个新增文件夹对象
      const obj = { name: '', updateTime: time, id: '0', type: '1' }
      this.currFilesList.unshift(obj)
      // 清空新建文件夹输入框
      this.inputFolderName = ''
    },
    /**
     * 获取当前时间
     */
    getFormatDate() {
      const date = new Date() // 获取当前时间
      let month = date.getMonth() + 1 // 获取月份
      let strDate = date.getDate() // 获取天
      let hours = date.getHours() // 获取小时
      let minutes = date.getMinutes() // 获取分钟
      let seconds = date.getSeconds() // 获取秒
      // 月、天、时、分、秒不足两位数，前面补0
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hours >= 1 && hours <= 9) {
        hours = '0' + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      // 拼接时间 生成  yyyy-MM-dd HH:mm:ss 格式
      const currentDate = date.getFullYear() + '-' + month + '-' + strDate +
        ' ' + hours + ':' + minutes + ':' + minutes
      return currentDate
    },
    /**
     * 确定新建文件夹
     */
    determineAddFolder() {
      // 判断重命名时的名称是否已存在
      for (let i = 0; i < this.currFilesList.length; i++) {
        if (this.inputFolderName && this.currFilesList[i].name === this.inputFolderName && this.inputFolderName !== this.editFileName) {
          toast('文件名重复')
          return false
        }
      }

      if (this.inputFolderName.indexOf('.') !== -1) {
        toast('文件或文件夹命名不能存在.符号')
        return false
      }

      if (this.inputFolderName.trim() === '') {
        // 取消 新建/修改 文件
        this.cancelAddFolder()
      } else if (this.isAddFolder) {
        // 文件夹新增结束
        this.isAddFolder = false
        // 存入新建的文件夹名称
        const formData = new FormData()
        formData.append('dirId', this.currFolder.id)
        formData.append('name', this.inputFolderName.trim())
        formData.append('pkgId', this.pkgId)
        // 调用文件夹创建接口
        this.$api.cloudDisk.createDir(formData).then(res => {
          if (res.code === 0) {
            // 刷新文件数据
            this.getCurrFilesList()
            toast(res.msg)
          } else {
            // 取消 新建/修改 文件
            this.cancelAddFolder()
          }
        })
      } else if (this.isEditFolder) {
        // 存入修改的文件夹名称
        const formData = new FormData()
        formData.append('id', this.editFile.id)
        formData.append('name', this.inputFolderName.trim() + (this.editNameTempArr[1] ? ('.' + this.editNameTempArr[1]) : ''))
        formData.append('type', this.editFile.type)
        formData.append('pkgId', this.pkgId)
        // 调用修改文件名称的接口
        this.$api.cloudDisk.rename(formData).then(res => {
          if (res.code === 0) {
            // 刷新文件数据
            this.getCurrFilesList()
            toast('重命名成功')
            // 文件夹修改结束
            this.isEditFolder = false
          } else {
            // 取消修改
            this.isEditFolder = true
            this.cancelAddFolder()
            toast('重命名失败')
          }
        })
      }
    },
    /**
     * 取消新建文件夹
     */
    cancelAddFolder() {
      if (this.isEditFolder) { // 修改
        // 改变是否修改状态
        this.isEditFolder = false
        // 还原修改前的名称
        for (let i = 0; i < this.currFilesList.length; i++) {
          if (this.currFilesList[i].name === '') {
            this.currFilesList[i].name = this.editFileName
          }
        }
      } else if (this.isAddFolder) { // 新建
        // 新建文件夹结束
        this.isAddFolder = false
        // 删除新增的文件夹数据
        for (let i = 0; i < this.currFilesList.length; i++) {
          if (this.currFilesList[i].name === '') {
            this.currFilesList.splice(i, 1)
          }
        }
      }
    },
    // 新增左侧导航
    addLeftNav(item, title) {
      this.operationName = title
      this.editFileName = ''
      $('#edit-left-nav').modal('show')
      $('#edit-left-nav').on('shown.bs.modal', function() {
        $('#edit-left-nav #optionName').focus()// 获取焦点
      })
    },
    // 修改左侧导航
    editLeftNav(item, title) {
      this.operationName = title
      this.currLeftNav = item
      this.editFileName = item.name
      this.icon = item.icon
      $('#edit-left-nav').modal('show')
      $('#edit-left-nav').on('shown.bs.modal', function() {
        $('#edit-left-nav #optionName').focus()// 获取焦点
      })
    },
    // 取消编辑
    handleEditCancel() {
      this.editFileName = ''
      $('#edit-left-nav').modal('hide')
    },
    // 提交编辑
    handleEditSubmit() {
      if (!this.icon) {
        toast('请选择图标')
        return false
      }
      if (this.editFileName.trim() === '') {
        formInVaildStyle('', '#optionName')
        $('#optionName').focus()
        return false
      }
      formVaildStyle('', '#optionName')
      $('#edit-left-nav').modal('hide')
      this.clearValidate()
      if (this.operationName === '新增') {
        // 存入新建的文件夹名称
        const formData = new FormData()
        formData.append('icon', this.icon)
        formData.append('name', this.editFileName.trim())
        formData.append('pkgId', this.pkgId)
        // 调用文件夹创建接口
        this.$api.cloudDisk.createDir(formData).then(res => {
          if (res.code === 0) {
            // 刷新文件数据
            this.getLeftNavData()
            this.getCurrFilesList()
          }
          this.editFileName = ''
          toast(res.msg)
        })
      } else {
        const formData = new FormData()
        formData.append('icon', this.icon)
        formData.append('id', this.currLeftNav.id)
        formData.append('name', this.editFileName)
        formData.append('type', this.currLeftNav.type)
        formData.append('pkgId', this.pkgId)
        // 调用修改文件名称的接口
        this.$api.cloudDisk.rename(formData).then(res => {
          if (res.code === 0) {
            // 刷新文件数据
            this.getLeftNavData()
            this.getCurrFilesList()
          }
          this.editFileName = ''
          toast(res.msg)
        })
      }
    },
    // 清空验证样式
    clearValidate() {
      $('.cb-form-valid').removeClass('cb-form-valid')
      $('.cb-form-invalid').removeClass('cb-form-invalid')
      $('.invalid-feedback').css('display', 'none')
    },
    // 删除左导航
    delLeftNav(value) {
      this.delOneFile(value)
    },
    /**
     * 批量删除文件/文件夹
     */
    delFile() {
      // 判断当前是否有选中对象
      if (this.selectedFilesList.length <= 0) {
        toast('请选择要删除的文件或文件夹')
        return
      }
      const that = this
      confirm('你确定要删除选中的文件或文件夹吗？', function() {
        // 获取要删除文件的主键
        const fileIdList = []
        for (let i = 0; i < that.selectedFilesList.length; i++) {
          const obj = {
            id: that.selectedFilesList[i].id,
            type: that.selectedFilesList[i].type
          }
          fileIdList.push(obj)
        }
        const data = {
          list: fileIdList,
          pkgId: that.pkgId
        }
        // 调用删除接口
        that.$api.cloudDisk.deletes(data).then(res => {
          if (res.code === 0) {
            // 刷新文件显示的数据
            that.getLeftNavData()
            that.getCurrFilesList()
          }
          toast(res.msg)
        })
      })
    },
    /**
     * 删除单个文件/文件夹
     */
    delOneFile(value) {
      const that = this
      confirm('你确定要删除选中的文件或文件夹吗？', function() {
        // 获取要删除文件的主键
        const fileIdList = []
        const obj = {
          id: value.id,
          type: value.type
        }
        fileIdList.push(obj)
        const data = {
          list: fileIdList,
          pkgId: that.pkgId
        }
        // 调用删除接口
        that.$api.cloudDisk.deletes(data).then(res => {
          if (res.code === 0) {
            // 刷新文件显示的数据
            that.getLeftNavData()
            that.getCurrFilesList()
          }
          toast(res.msg)
        })
      })
    },
    /**
     * 当前选中的文件
     */
    handleSelectionChange(val) {
      // 存入选中文件信息
      this.selectedFilesList = val
    },
    /**
     * 复制文件链接
     */
    copyFileHref(value) {
      const oInput = document.createElement('input')
      oInput.value = value.fileAccessUrl
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      toast('已复制文件链接')
    },
    /**
     *  打开文件或文件夹
     */
    toFileOrFolder(e, click = false) {
      // 如果双击的是输入框，取消进入文件夹或打开文件操作
      if (event.target.nodeName === 'SPAN' && !click) {
        return false
      }
      if (e.type === '1') { // 打开文件夹
        // 添加文件路径导航
        this.currFilePath.push(e)
        // 存入当前打开文件夹信息
        this.currFolder = e
        // 刷新文件显示
        this.getCurrFilesList()
      } else if (e.fileType === 'image') { // 打开图片
        // 图片显示
        const viewer = $('.' + e.id + 'img')[0].$viewer
        viewer.show()
      } else if (e.fileType === 'video') {
        this.$videoPreview(concatImgUrl(e.fileAccessUrl))
      } else {
        this.downloadFile(e)
      }
    },
    /**
     * 文件重命名
     */
    editFolderName(value) {
      // 获取重命名的文件
      this.editNameTempArr = value.name.split('.')
      this.editFile = value
      this.isEditFolder = true
      // 输入框中显示文件修改前的名称
      this.inputFolderName = this.editNameTempArr[0]
      // 存入文件修改前的名称
      this.editFileName = value.name
      // 显示文件名输入框  （文件名的数据是空字符串便会显示文件名输入框）
      for (let i = 0; i < this.currFilesList.length; i++) {
        if (this.currFilesList[i].id === value.id) {
          this.currFilesList[i].name = ''
        }
      }
    },
    /** 预览视频 */
    openVideo(url) {
      this.$videoPreview(url)
    },
    /**
     * 文件路径跳转
     */
    pathToJump(index, item) {
      // 截取到点击的路径
      this.currFilePath.splice(index + 1)
      // 存入当前点击的文件夹信息
      this.currFolder = item
      // 刷新文件数据
      this.getCurrFilesList()
    },
    /**
     * 文件上传时状态改变  （用于判断上传文件模态框关闭时是否有提示）
     *  文件未上传完  提示    否则没有提示
     */
    handleUploadChange(file, fileList) {
      this.isUploadSate = (this.fileList.length !== 1)
    },
    /**
     *  文件上传时
     */
    handleUploadProgress(event, file, fileList) {},
    /**
     *  打开 移动/复制 文件或文件夹
     */
    fileModal(value) {
      if (this.selectedFilesList.length <= 0) {
        toast('请选择要操作的文件或文件夹')
        return
      }
      this.isMove = value
      // 获取云盘树控件数据
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      this.$api.cloudDisk.getDirectoryTree(formData).then(res => {
        if (res.code === 0) {
          this.data = res.data
        } else {
          toast(res.msg)
        }
      })
      // 打开模态框
      $('#move-file-dialog').modal('show')
    },
    /**
     * 移动的树控件点击事件
     */
    handleNodeClick(data) {
      this.defaultProps = data
    },
    /**
     *  确定文件移动/复制
     */
    submitMoveFile() {
      if (!this.defaultProps.dirId) {
        return false
      }
      // 获取移动的文件集合
      const fileIdList = []
      for (let i = 0; i < this.selectedFilesList.length; i++) {
        const obj = {
          id: this.selectedFilesList[i].id,
          type: this.selectedFilesList[i].type
        }
        fileIdList.push(obj)
      }
      const obj = {
        targetDirId: this.defaultProps.dirId,
        list: fileIdList
      }
      if (this.isMove) {
        this.moveFile(obj)
      } else {
        this.copyFile(obj)
      }
      // 初始化
      this.defaultProps = {
        dirId: ''
      }
    },
    /**
     * 复制事件
     */
    copyFile(obj) {
      // 调用文件复制接口
      obj.pkgId = this.pkgId
      this.$api.cloudDisk.copyFile(obj).then(res => {
        if (res.code === 0) {
          // 关闭模态框
          $('#move-file-dialog').modal('hide')
          // 刷新文件数据
          this.getCurrFilesList()
        }
        toast(res.msg)
      })
    },
    /**
     * 移动事件
     */
    moveFile(obj) {
      // 调用文件移动接口
      obj.pkgId = this.pkgId
      this.$api.cloudDisk.moveFile(obj).then(res => {
        if (res.code === 0) {
          // 关闭模态框
          $('#move-file-dialog').modal('hide')
          // 刷新文件数据
          this.getCurrFilesList()
        }
        toast(res.msg)
      })
    },
    /**
     * 取消文件移动/复制
     */
    cancelMoveFile() {
      $('#move-file-dialog').modal('hide')
      // 初始化
      this.defaultProps = {
        dirId: ''
      }
    },
    /**
     * 文件查询
     */
    searchFile() {
      if (this.isSearch) {
        this.currFilePath.splice(this.currFilePath.length - 1, 1)
      }
      this.isSearch = !!this.searchFileValue.trim()
      if (this.isSearch) {
        // 显示忙碌加载
        this.isLoadingTable = true
        this.currFilePath.push({ name: '搜索"' + this.searchFileValue + '"', id: '' })
        const obj = {
          name: this.searchFileValue,
          pkgId: this.pkgId,
          dirId: this.currFolder.id
        }
        if (this.isClassroomDetail) {
          obj.ctId = this.ctId
        }
        this.$api.cloudDisk.queryDirList(obj).then(res => {
          if (res.code === 0) {
            // 清空之前显示的文件信息
            this.currFilesList = []
            // 截取出文件类型并存入
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].type === '2') {
                // res.data[i].fileAccessUrl = baseUrl + res.data[i].fileAccessUrl;
                res.data[i].typeName = res.data[i].name.slice(res.data[i].name.lastIndexOf('.') + 1)
                if (res.data[i].typeName === 'png' || res.data[i].typeName === 'gif' || res.data[i].typeName === 'svg' || res.data[i].typeName === 'jpg') {
                  res.data[i].fileType = 'image'
                } else if (res.data[i].typeName === 'mp4') {
                  res.data[i].fileType = 'video'
                }
              }
              this.currFilesList.push(res.data[i])
            }
          } else {
            this.currFilesList = []
            toast(res.msg)
          }
          // 取消忙碌加载
          this.isLoadingTable = false
        })
      } else {
        this.getCurrFilesList()
      }
    }
  }
}
</script>

<style scoped>
  .cloud-disk-box{
    background: #f5f5f5;
  }
  .cloud-disk{
    margin:10px auto 0;
    padding: 5px 5px 5px 5px;
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
  }
  /* 返回 */
  .classroom-back{
    width: 100%;
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
  .cloud-disk-left{
    width: 280px;
    padding: 0 5px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: 10px;
  }
  .cloud-disk-right{
    width: 894px;
    height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
  }
  .cloud-disk-right-btns{
    width: 100%;
    text-align: left;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1) ;
    border-bottom: 1px #e0e0e0 solid;
    padding: 0 10px 10px;
    box-sizing: border-box;
    display: flex;
  }
  .cloud-disk-right-btns .btn,
  .cloud-disk-right-btns .btn-group > .btn{
    margin-right: 10px;
    padding: 0.375rem 1.75rem !important;
  }
  .cloud-disk-right-btns .btn-group .btn-sm,
  .cloud-disk-right-btns .btn-group-sm > .btn{
    padding: 0.375rem 1.75rem !important;
  }
  /*.cloud-disk-right-btns .btn-group > .btn{*/
  /*  font-size: 0.875rem;*/
  /*  line-height: 1.5;*/
  /*  border-radius: 0.2rem;*/
  /*}*/
  .cloud-disk-right-files-location{
    text-align: left;
    padding: 10px;
  }
  .cloud-disk-right-files-location .files-location-item{
    display: inline-block;
    cursor: pointer;
  }
  .cloud-disk-right-files-location .files-location-item:not(:first-child)::before{
    content: '>';
    padding: 0 5px;
  }
  .cloud-disk-right-files-location .files-location-item:last-child span{
    color: #959da0 ;
  }
  /* 左边菜单样式开始 */
  .serach{
    box-shadow:rgba(0, 0, 0, 0.1) 0px 0px 5px 0px;
    border-radius: 5px;
    background-color: #fff;
  }
  .directory-title{
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
    height: 53px;
    line-height: 53px;
    padding: 0 25px;
    text-align: left;
    font-weight: bold;
  }
  .nav-list{
    width: 100%;
    height: 510px;
    overflow-y: scroll;
  }
  .nav-list > li{
    padding:0px 23px;
    margin:8px 0px;
  }
  .nav-list .nav-search{
    padding:5px 10px;
    background-color: #e8e8e8;
    margin-bottom: 10px;
  }
  .nav-list .nav-search >img{
    width: 20px;
    height:20px;
    cursor: pointer;
  }
  .nav-list .nav-search input{
    width: 85%;
    text-indent: 1em;
    background-color: transparent;
    border: none;
    outline: none;
  }
  .nav-list .nav-item{
    display: flex;
    align-items: center;
    color: #666;
    cursor: pointer;
    border-left: 2px solid #ffffff;
    margin-top: 13px;
    margin-bottom: 13px;
  }
  .nav-list .nav-item > i{
    font-size:20px;
  }
  .nav-list .nav-item > span{
    display: block;
    margin-left: 15px;
  }
  .nav-list .nav-item:hover{
    color: #0062cc;
  }
  .nav-list .nav-item:hover span{
    color: #0062cc;
  }
  .nav-list .nav-item-active{
    color: #0062cc;
    border-left: 2px solid #0062cc;
  }
  .nav-list .nav-item-active span{
    color: #0062cc;
  }
  .nav-list .nav-item-active i{
    color: #0062cc;
  }
  .nav-list .nav-item .line{
    width: 100%;
    height:1px;
    margin:9px 0;
    background-color: #e8e8e8;
  }
  .nav-list .recently{
    position: relative;
  }
  .nav-list .recently .recently-btn{
    position: absolute;
    right: 23px;
  }
  /* 左边菜单样式结束 */
  /* 右边文件显示样式开始 */
  .folder-name{
    margin-left: 10px;
    cursor: pointer;
  }
  .folder-name:hover{
    border-bottom: 1px solid #606266;
  }

  /* 右边文件显示样式结束 */
  /* 去掉input的聚焦样式 */
  input:focus {
    outline: none;
    border-color: #0062cc;
    box-shadow: 0 0 5px #ffffff;
    border-radius: 5px;
  }
  /* 滚动条样式 */
  /* ::-webkit-scrollbar {
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
  } */
  /* 移动文件弹出框样式 */
  .move-tree{
    width: 90%;
    margin: 10px auto 20px;
    border: 1px solid #c3ced1;
    height: 300px;
    overflow-y: scroll;
    padding-top: 10px;
  }
  /* 权限设置弹出框样式 */
  .student-content{
    padding: 0 0 20px 20px;
    width: 35%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .student-list{
    height: 360px;
    overflow-y: scroll;
  }
  .pre-title, .student-title{
    height: 40px;
    line-height: 40px;
  }

  /* 弹出框样式 */
  .group-form{
    display:flex;
    align-items: center;
    padding:10px 0;
  }
  .group-form .group-name{
    width:25%;
    padding-left: 15px;
    text-align: left;
  }
  .group-form .group-name > span{
    color: red;
    margin-left: 2px;
  }
  .permissions-edit{
    display: flex;
    padding: 15px 0 30px 15px;
  }
  /* 复选框对齐 */
  .cloud-disk-table /deep/ .el-table-column--selection > .cell{
    padding-left: 15px!important;
  }
  .cloud-disk-table /deep/ .el-table-column--selection > .cell .el-checkbox{
    margin-bottom: 0!important;
  }
  /* 饿了么下拉框的样式 */
  .el-select /deep/ .select-popper {
    z-index: 8888 !important;
    top: auto !important;
    left: auto !important;
    text-align: left;
  }
  .el-checkbox{
    text-align: right;
    width: 100%;
    padding-right: 10px;
  }
  /* 文件数量提示 */
  .file-num{
    text-align: right;
    padding-right: 20px;
    color: #b6b6b6;
  }
  /* 快捷方式的显示调整弹出框样式 */
  .move-btn{
    text-align: right;
  }
  .shortcut-panel-icon{
    margin: 10px 0 20px;
  }
  .shortcut-panel-icon .el-checkbox{
    text-align: left;
    margin: 0 !important;
  }
  .bg-color{
    background-color: rgb(218, 214, 214);
  }
  .shortcut-panel{
    padding: 5px 10px;
  }
  .student-title /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #409eff;
    border-color: #409eff;
  }
  .pre-title /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #409eff;
    border-color: #409eff;
  }
  .student-list .el-checkbox{
    text-align: left;
    margin: 0 !important;
  }
  .student-title .el-checkbox{
    text-align: center;
    padding: 0;
  }
  .pre-title .el-checkbox{
    text-align: center;
    padding: 0;
  }

.main-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .main-top .search-box{
        width: 100%;
        margin: 10px 0 20px;
    }
    .main-list-top{
        display: flex;
        justify-content: space-between;
        background-color: #eff3f3;
        padding: 10px;
    }
    .main-list-top .left-operation-box{
        display: flex;
        align-items: center;
    }
    .main-list-top .left-operation-box .selected-member-num{
        color: #999;
        margin-left: 20px;
    }
    .main-list-top .sure-btn{
        color: #007bff;
        cursor: pointer;
    }
    .main-list{
        min-height: 228px;
    }
    .main-list .main-list-item{
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
    }
    .main-list .main-list-item:hover{
        background-color: #f5f5f5;
    }
    /* .main-list .main-list-item > input{
        flex:1;
    } */
    .main-list .main-list-item > .trainee-info{
        flex:2;
        margin-left: 30px;
    }
    .main-list .main-list-item .trainee-info > img{
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }
    ::-webkit-input-placeholder{
        color: #bbb;
    }
    .main-list-del{
        flex-wrap: wrap;
        display: flex;
        box-sizing: border-box;

        padding-bottom: 35px;
    }
    .main-list-del .main-list-item{
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        border-bottom: none;
        flex-direction: column;
        margin: 10px 10px 0 0;
        position: relative;
        box-sizing: border-box;
        width: 80px;
        height: 80px;
        overflow: hidden;
    }
    .main-list-del .main-list-item img{
        width: 40px;
        height: 40px;
        border-radius: 5px;
        margin-bottom: 4px;
        box-sizing: border-box;
    }
    .main-list-del .main-list-item  input{
        position: absolute;
        right: 3px;
        top: 3px;
    }
    .main-list-del .main-list-item  span{
        /* background-color: rgba(0, 0, 0, 0.46); */
        width: 100%;
        text-align: center;
        display: -webkit-box;
        overflow: hidden !important;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;/*这是设置显示的多少行 */

    }
    .search-box-del{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search-box-del .el-input{
        width: 43%;
    }
    .msgModalDel{
        z-index: 65536 !important;
    }
    .msgModalDelBackdrop{
        z-index: 65535 !important;
    }

</style>
