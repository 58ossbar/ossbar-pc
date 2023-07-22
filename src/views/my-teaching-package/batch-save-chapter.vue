<template>
  <div>
    <header-nav2 :current-index="5"/>
    <div class="test-question-bank-nav test-question-bank-nav2 wind-1240 ">
      <div class="location">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer" @click="toBack()">
            教学包
          </li>
          <li class="localtion-item">
            <span style="color: #959da0">批量保存章节</span>
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
          @onclick="leftClick"
        />
      </div>
      <div class="teacher-info-choose">
        <template v-if="isCanAdd && parentId">
          <el-breadcrumb v-if="pathList && pathList.length > 0" separator-class="el-icon-arrow-right teacher-bread-icon">
            <el-breadcrumb-item v-for="(itemp, indexp) in pathList" :key="indexp" ><a href="javascript:void(0);" @click="breadClick(indexp)">{{ itemp.chapterName }}</a></el-breadcrumb-item>
          </el-breadcrumb>

          <el-form ref="dataForm" :model="dataForm" label-width="0" class="teacher-right-list-wrap">
            <el-form-item
              v-for="(item1, index1) in dataForm.chapterNameList"
              :rules="{
                required: false, message: '章节名称不能为空', trigger: 'blur'
              }"
              :key="index1"
              :prop="'chapterNameList.' + index1 + '.name'"
              label=""
            >
              <div
                :draggable="true"
                @dragstart.stop="handleDragStart($event, item1)"
                @dragover.prevent="handleDragOver"
                @dragenter="handleDragEnter($event, item1)"
                @dragend="handleDragEnd">
                <el-input
                  v-model="item1.name"
                  size="medium"
                  placeholder="请输入章节名称">
                  <template slot="append">
                    <el-button icon="el-icon-plus" class="teacher-right-list-add" @click="toAdd(index1)"/>
                    <el-button icon="el-icon-close" class="teacher-right-list-del" style=" margin-left: 10px;" @click="toDel(index1)"/>
                  </template>
                </el-input>
              </div>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="saveChapter('dataForm')">保存</el-button>
              <el-button @click="resetForm('dataForm')">重置</el-button>
            </el-form-item> -->
          </el-form>
          <el-button type="primary" size="small" icon="el-icon-s-platform" class="teacher-right-list-save" @click="saveChapter('dataForm')">保存</el-button>

          <!-- <div class="teacher-right-list-wrap">
            <div v-for="(item1, index1) in chapterNameList" :key="index1" class="teacher-right-list-item">
              <el-input v-model="item1.name" placeholder="请输入章节名称">
                <template slot="append">
                  <el-button icon="el-icon-plus" class="teacher-right-list-add" @click="toAdd(index1)"/>
                  <el-button icon="el-icon-close" @click="toDel(index1)"/>
                </template>
              </el-input>
            </div>
          </div> -->

        </template>
        <div v-else-if="!isCanAdd" class="teacher-right-empty">当前最多三级节点，请选择其他节点！</div>
        <div v-else class="teacher-right-empty">请选择左侧节点！</div>
      </div>

      <div v-if="false" class="teacher-info-choose teacher-info-choose-two">
        <template v-if="isCanAdd && parentId">
          <el-breadcrumb v-if="pathList && pathList.length > 0" separator-class="el-icon-arrow-right teacher-bread-icon">
            <el-breadcrumb-item v-for="(itemp, indexp) in pathList" :key="indexp" ><a href="javascript:void(0);" @click="breadClick(indexp)">{{ itemp.chapterName }}</a></el-breadcrumb-item>
          </el-breadcrumb>

          <div class="teacher-info-choose-two-right">
            <el-form ref="dataForm" :model="dataForm" label-width="0" class="teacher-right-list-wrap">
              <el-form-item
                v-for="(item1, index1) in dataForm.chapterNameList"
                :rules="{
                  required: false, message: '章节名称不能为空', trigger: 'blur'
                }"
                :key="index1"
                :prop="'chapterNameList.' + index1 + '.name'"
                label=""
              >
                <el-input v-model="item1.name" size="medium" placeholder="请输入章节名称">
                  <template slot="append">
                    <el-button icon="el-icon-plus" class="teacher-right-list-add" @click="toAdd(index1)"/>
                    <el-button icon="el-icon-close" class="teacher-right-list-del" @click="toDel(index1)"/>
                  </template>
                </el-input>
              </el-form-item>
              <!-- <el-form-item>
                <el-button type="primary" @click="saveChapter('dataForm')">保存</el-button>
                <el-button @click="resetForm('dataForm')">重置</el-button>
              </el-form-item> -->
            </el-form>
            <el-button :loading="loading" type="primary" size="small" icon="el-icon-s-platform" class="teacher-right-list-save" @click="saveChapter('dataForm')">保存</el-button>
          </div>

        </template>
        <div v-else-if="!isCanAdd" class="teacher-right-empty">当前最多三级节点，请选择其他节点！</div>
        <div v-else class="teacher-right-empty">请选择左侧节点！</div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { toast } from '@/utils/global'
// 引入头部导航页面
import HeaderNavStartClass from '@/components/header-nav-start-class'
// 引入树插件页面
import CbTree from '@/components/cb-tree/index'
import ZtreeLibrary from '@/components/ztree-library'
export default {
  name: 'BatchSaveChapter',
  components: {
    'header-nav2': HeaderNavStartClass,
    CbTree,
    ZtreeLibrary
  },
  data() {
    return {
      loading: false,
      dragging: null,
      isCanAdd: true, // 是否可 添加节点
      pathList: [],
      parentId: '', // 选中节点 的 章节id
      dataForm: {
        chapterNameList: [] // 右侧 数组
      },
      pkgId: '', // 教学包id
      subjectId: '',
      isClassroomDetail: false,
      ztree: $.fn.zTree.getZTreeObj('authorizationTree'),
      treeObj: $.fn.zTree.getZTreeObj('treeDemo'), // 树节点的对象
      treeData: [], // 章节显示数据
      authorizationTreeData: []
    }
  },
  created() {
    // 获取当前页面的教学包id
    this.pkgId = localStorage.getItem('under_authorization_pkg_id')
    this.subjectId = localStorage.getItem('under_authorization_pkg_subject_id')
    this.isClassroomDetail = localStorage.getItem('isClassroomDetail')
  },
  mounted() {
    // 获取当前教学包的数据
    this.getBookTreeData()
  },
  methods: {
    saveChapter(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const arr = []
          if (this.dataForm.chapterNameList && this.dataForm.chapterNameList.length > 0) {
            for (let i = 0; i < this.dataForm.chapterNameList.length; i++) {
              arr.push(this.dataForm.chapterNameList[i].name)
            }
          }
          // 提交的数据格式
          const commitData = {
            pkgId: this.pkgId,
            parentId: this.parentId,
            chapterNameList: arr
          }
          this.loading = true
          this.$api.chapter.batchSaveChapter(commitData).then(res => {
            this.loading = false
            if (res.code === 0) {
              toast(res.msg || '保存成功')
              this.getBookTreeData(commitData.parentId)
              this.parentId = ''
            } else {
              toast(res.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleDragStart(event, item) {
      this.dragging = item
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(event) {
      event.dataTransfer.dropEffect = 'move' // 在dragenter中针对放置目标来设置!
    },
    handleDragEnter(event, item) {
      event.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.dataForm.chapterNameList]

      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)

      newItems.splice(dst, 0, ...newItems.splice(src, 1))

      this.dataForm.chapterNameList = newItems
    },
    handleDragEnd() {
      this.dragging = null
    },
    breadClick(index) {
      // 选中当前选择的节点
      this.$refs.ztreeLibrary.ztree.selectNode(this.pathList[index])
      this.leftClick(this.pathList[index])
    },
    // 左侧 树 点击
    leftClick(event) {
      this.isCanAdd = true
      if (event.level >= 3) {
        this.isCanAdd = false
        this.parentId = ''
        return false
      }
      this.parentId = event.chapterId
      this.dataForm.chapterNameList = [
        { id: 0, name: '' },
        { id: 1, name: '' },
        { id: 2, name: '' },
        { id: 3, name: '' },
        { id: 4, name: '' }
      ]
      this.pathList = event.getPath()
      this.$nextTick(() => {
        this.resetForm('dataForm')
      })
    },
    // 添加 章节
    toAdd(index) {
      const obj = { id: this.dataForm.chapterNameList.length + 1, name: '' }
      this.dataForm.chapterNameList.splice(index + 1, 0, obj)
    },
    // 删除 章节
    toDel(index) {
      if (this.dataForm.chapterNameList.length < 2) {
        this.dataForm.chapterNameList[0].name = ''
      } else {
        this.dataForm.chapterNameList.splice(index, 1)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 返回
    toBack() {
      this.$router.push({
        path: '/teaching-package-detail',
        name: 'teaching-package-detail'
      })
    },
    // 获取 左边树  数据
    getBookTreeData(chapterId) {
      this.treeData = []
      const params = {
        pkgId: this.pkgId,
        subjectId: this.subjectId
      }
      this.$api.pkgInfo.getBookTreeData(params).then((res) => {
        if (res.code === 0) {
          this.treeData.push(res.data)

          if (chapterId && chapterId !== null) {
            this.$nextTick(() => {
              const currNode = this.$refs.ztreeLibrary.ztree.getNodesByParam('id', chapterId, null)[0]
              // 展开节点
              this.$refs.ztreeLibrary.ztree.expandNode(currNode)
              // 选中当前选择的节点
              this.$refs.ztreeLibrary.ztree.selectNode(currNode)
              this.leftClick(currNode)
            })
          }
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
    height: calc(100vh - 50px - 101px - 10px);
    min-height: 400px;
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
    padding: 20px 40px;
    margin-left: 10px;
    text-align: left;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
  }
  .teacher-right-list-wrap{
    /* padding-top: 15px; */
    /* padding-right: calc(20% + 40px); */
    padding: 0  20%;
    /* margin-right: -40px; */
    box-sizing: border-box;
    max-height: calc(100% - 50px - 63px);
    overflow-y: auto;
  }
  .teacher-right-list-add{
    border-right: 1px solid #dcdfe6 !important;
  }
  .teacher-right-list-item{
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  .teacher-right-list-save{
    /* margin-left: 100px; */
    /* margin-top: 10px; */
    box-sizing: border-box;
    width: fit-content;
    margin: 10px auto 0;
  }
  .teacher-info-choose /deep/ .teacher-bread-icon{
    color: #333;
    font-weight: bold;
  }
  .teacher-right-empty{
    margin-left: 100px;
    margin-top: 50px;
    color: #e6a23c;
    font-size: 16px;
  }
  .teacher-right-list-del{
    margin-left: 10px;
  }

  input::-webkit-input-placeholder{
    font-size:14px;
  }

  .teacher-info-choose .el-breadcrumb{
    padding: 15px 0 20px;
    /* font-size: 16px; */
    line-height: 1.8;
    box-sizing: border-box;
  }
  .teacher-info-choose /deep/ .el-form-item{
    margin-bottom: 10px;
  }

  .teacher-info-choose-two{
    flex-direction: row;
    /* align-items: center; */
  }
  .teacher-info-choose-two .teacher-right-list-wrap{
    margin-right: 0;
    padding-right:0;
    max-height: calc(100% - 50px);
  }
  .teacher-info-choose-two .el-breadcrumb{
    width: 50%;
  }
  .teacher-info-choose-two .teacher-info-choose-two-right{
    flex: 1;
    height: 100%;
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
