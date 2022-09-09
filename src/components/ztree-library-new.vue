<!-- 章节树组件 -->
<template>
  <div class="ztreeLibrary widthAll">

    <!--搜索区域 begin -->
    <div v-if="searchVislib" class="d-flex search">
      <div class="input-group input-group-sm mb-1 input-group-width-ztree ">
        <el-input id="keyword" v-model="inputKeyword" size="small" placeholder="输入关键字搜索"/>
      </div>
      <!--添加按钮-->
      <button v-if="showSearchAddButton" type="button" class="btn btn-primary btn-sm fa-plus-btn" @click="showLibraryForm()">
        <i class="fa fa-plus" aria-hidden="true"/>
      </button>
      <!--查询按钮-->
      <button v-if="showSearchButton" type="button" class="btn btn-primary btn-sm fa-plus-btn" @click="query()">
        <i class="fa fa-plus" aria-hidden="true"/>
      </button>
      <!--设置-->
      <button
        v-if="isClassroomDetail && hasSetVisiblePermission"
        class="btn btn-primary btn-sm fa-plus-btn"
        type="button"
        title="设置章节对学员是否可见"
        @click="setTraineesVisibleBatch"
      >
        <i class="fa fa-cog" aria-hidden="true"/>
      </button>
    </div>
    <!--搜索区域 end -->

    <!-- ztree树形数据 begin -->
    <div class="content_wrap ">
      <div class="bg left">
        <ul :id="ztreeId" :class="['ztree', isClassroomDetail?'':'ztreeTwo']"/>
      </div>
    </div>
    <!-- ztree树形数据 end -->

    <!--右键菜单 begin-->
    <div id="rMenu"/>
    <!--右键菜单 end -->

    <modal-dialog
      id="move-nodes-dialog"
      :title="myTitle"
      @submit="doDemotionNodes"
      @cancel="closeModal">
      <div slot="main">
        <div class="move-tree">
          <el-tree
            :data="zNodes"
            :props="{label: 'chapterName', children: 'children'}"
            :default-expanded-keys="zNodes.length ? [zNodes[0].subjectId] : []"
            node-key="chapterId"
            @node-click="handleNodeClick">
            <span slot-scope="{ data }" class="custom-tree-node">
              <span>
                <i class="el-icon-folder"/> {{ data.chapterName }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </modal-dialog>
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import Cookies from 'js-cookie'
import { baseUrl, fuzzySearch, toast, confirm } from '@/utils/global'
import ModalDialog from '@/components/modal-dialog'

export default {
  name: 'ZtreeLibraryNew',
  components: {
    'modal-dialog': ModalDialog
  },
  props: {
    // 是否显示右键菜单和搜索框、新增按钮
    searchVislib: {
      type: Boolean,
      default: true,
      required: false
    },
    // 是否显示搜索区域的+按钮
    showSearchAddButton: {
      type: Boolean,
      default: false,
      required: false
    },
    showSearchButton: {
      type: Boolean,
      default: false,
      required: false
    },
    ztreeId: {
      type: String,
      default: 'ztreeId',
      required: false
    },
    // 教学包主键
    pkgId: {
      type: String,
      default: '',
      required: true
    },
    // 是否显示右键菜单
    isShowRMenu: {
      type: Boolean,
      default: false,
      required: false
    },
    // 树的数据
    zNodes: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    //
    name: {
      type: String,
      default: 'name',
      required: true
    },
    idKey: {
      type: String,
      default: 'id',
      required: false
    },
    simpleDataEnable: {
      type: Boolean,
      default: false,
      required: false
    },
    // 设置 zTree 的节点上是否显示 checkbox / radio
    check: {
      type: Boolean,
      default: false,
      required: false
    },
    pIdKey: {
      type: String,
      default: 'parentId',
      required: false
    },
    // 是否显示连接线
    showLine: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否有权限
    hasPermission: {
      type: Boolean,
      default: false,
      required: true
    },
    // 是否有实际操作的权限（改版）
    hasPermissionActual: {
      type: Boolean,
      default: false,
      required: false
    },
    // 如果是只能自己用，则不能再次授权给其它人
    privateUse: {
      type: String,
      default: '',
      required: false
    },
    // 是否为课程创建者：1.教学包教材(课程)创建者时，拥有新增、重命名、删除、上移、下移、生成默认节点等操作按钮权限
    isCreator: {
      type: Boolean,
      default: false,
      required: true
    },
    // 是否为共建者
    isTogetherBuild: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否是章节授权页的树
    isAuthorization: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否为课堂详情页面
    isClassroomDetail: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否全部展开
    expandAll: {
      type: Boolean,
      required: false,
      default: false
    },
    // 默认展开的层级
    expandLevel: {
      type: String,
      required: false,
      default: '0'
    },
    // 手风琴模式，对于同一级的节点，每次只能展开一个
    accordion: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否来自书架
    isFromBookshelf: {
      type: Boolean,
      default: false
    },
    hasSetVisiblePermission: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      myTitle: '移动层级',
      currenNode: {},
      selectedNode: {},
      // 当前登录用户是否为此本教材的创建者
      // hasPermission: false,
      isTraineesVisibleText: false,
      treeNodeHasPermission: false,
      renameFlag: false, // 是否为重命名
      inputKeyword: '',
      // true时显示根节点表单，false时显示章节表单
      formVisible: null,
      // zTree
      zTree: $.fn.zTree.getZTreeObj(this.ztreeId),
      // 当前节点的序号
      serial: '',
      IDMark_A: '_a',
      setting: {
        check: {
          autoCheckTrigger: false,
          enable: this.check
        },
        async: {
          enable: true,
          type: 'get',
          evglToken: Cookies.get('evglToken'),
          url: baseUrl + 'resourceCenter-api/listChapters',
          autoParam: ['id', 'serial', 'type', 'subjectId'],
          otherParam: {
            'pkgId': this.pkgId,
            'page': this.isClassroomDetail ? 'room' : 'pkg',
            'evglToken': Cookies.get('evglToken')
          }
        },
        view: {
          selectedMulti: false,
          nameIsHTML: true, // 允许name支持html
          addDiyDom: this.addDiyDom,
          fontCss: this.setFontCss
        },
        edit: {
          drag: {
            autoExpandTrigger: true,
            prev: true,
            inner: true,
            next: true
          },
          enable: true,
          showRemoveBtn: false,
          showRenameBtn: false,
          editNameSelectAll: false
        },
        data: {
          key: {
            parent: true,
            name: this.name
          },
          simpleData: {
            enable: true,
            idKey: this.idKey,
            pIdKey: this.pIdKey,
            rootPId: 0
          }
        },
        callback: {
          onMouseDown: this.onMouseDown, // zTree 上鼠标按键按下后
          onRightClick: this.onRightClick, // 右键菜单
          beforeRename: this.beforeRename,
          beforeDrag: this.beforeDrag, // 节点被拖拽之前
          beforeDrop: this.beforeDrop, // 节点拖拽操作结束之前
          beforeDragOpen: this.beforeDragOpen, // 自动展开该父节点之前
          beforeClick: this.zTreeBeforeClick,
          onClick: this.zTreeOnClick, // 用于捕获节点被点击的事件回调函数
          onDblClick: this.zTreeOnDblClick, // 用于捕获 zTree 上鼠标双击之后的事件回调函数
          onDrag: this.onDrag,
          onDrop: this.onDrop
        }
      }
    }
  },
  watch: {
    // 监听树节点的变化更新树
    'zNodes': function(val) {
      this.freshArea()
    }
  },
  mounted() {
    this.freshArea()
  },
  methods: {
    doDemotionNodes() {
      const psData = {
        pkgId: this.pkgId,
        soureNodeId: this.currenNode.chapterId,
        targetId: this.selectedNode.chapterId,
        moveType: 'inner'
      }
      console.log(psData)
    },
    closeModal() {
      $('#move-nodes-dialog').modal('hide')
    },
    handleNodeClick(node) {
      this.myTitle = '将 【' + this.currenNode.chapterName + '】 移动成为 【' + node.chapterName + '】 的子节点'
      this.selectedNode = node
    },
    doUpgradeNodes(treeNode) {
      // 隐藏右键菜单
      this.hideRMenu()
      confirm('确认升级该节点的层级吗？', () => {
        const formData = new FormData()
        formData.append('chapterId', treeNode.chapterId)
        this.$api.resource.upgradeNodes(formData).then(res => {
          if (res.code === 0) {
            // 获取父节点
            const tempParentNode = treeNode.getParentNode()
            const parentNode = tempParentNode.getParentNode()
            console.log(parentNode)
            //  更改有活动章节的图标
            if (parentNode.hasActivity) {
              parentNode.icon = 'static/image/activity_icon.png'
              parentNode.iconSkin = '33'
            }
            if (parentNode.children && parentNode.children.length > 0) {
              this.recursiveTree(parentNode.children)
            }
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(parentNode, 'refresh')
            setTimeout(() => {
              const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
              this.zTree.selectNode(node)
              // 展开节点
              this.zTree.expandNode(node, true, true, true)
            }, 500)
          }
        })
      })
    },

    setTraineesVisibleBatch() {
      this.$emit('setTraineesVisibleBatch')
    },

    /**
     * 生成默认章节
     */
    createDefaultChapter() {
      // 隐藏右键菜单
      this.hideRMenu()
      // 获取当前选中的节点对象
      const nodes = this.zTree.getSelectedNodes()
      const treeNode = nodes[0]
      if (!treeNode) {
        return false
      }
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('chapterId', treeNode[this.idKey])
      confirm('确认一键生成默认节点吗？', () => {
        this.$api.resource.createDefaultChapter(formData).then(res => {
          toast(res.msg)
          if (res.code === 0) {
            // 获取父节点
            const parentNode = treeNode.getParentNode()
            //  更改有活动章节的图标
            if (parentNode.hasActivity) {
              parentNode.icon = 'static/image/activity_icon.png'
              parentNode.iconSkin = '33'
            }
            if (parentNode.children && parentNode.children.length > 0) {
              this.recursiveTree(parentNode.children)
            }
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(parentNode, 'refresh')
            setTimeout(() => {
              const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
              this.zTree.selectNode(node)
              // 展开节点
              this.zTree.expandNode(node, true, true, true)
            }, 500)
          }
        })
      })
    },

    /**
     * 设置章节对学员不可见
     */
    setTraineesVisible() {
      // 隐藏右键菜单
      this.hideRMenu()
      // 获取当前选中的节点对象
      const nodes = this.zTree.getSelectedNodes()
      const treeNode = nodes[0]
      if (!treeNode) {
        return false
      }
      const formData = new FormData()
      formData.append('ctId', treeNode.ctId)
      formData.append('pkgId', this.pkgId)
      formData.append('chapterId', treeNode[this.idKey])
      if (treeNode.isTraineesVisible === 'N') {
        formData.append('isTraineesVisible', 'Y')
        confirm('确认设置章节【' + treeNode[this.name] + '】以及其下所有子节点，对学员可见吗？', () => {
          this.$api.resource.setTraineesVisible(formData).then(res => {
            toast(res.msg)
            // 获取父节点
            const parentNode = treeNode.getParentNode()
            //  更改有活动章节的图标
            if (parentNode.hasActivity) {
              parentNode.icon = 'static/image/activity_icon.png'
              parentNode.iconSkin = '33'
            }
            if (parentNode.children && parentNode.children.length > 0) {
              this.recursiveTree(parentNode.children)
            }
            // 强行异步加载父节点的子节点
            // this.zTree.reAsyncChildNodes(parentNode, "refresh");
            const cNode = this.zTree.getNodeByParam('id', treeNode.subjectId)
            this.zTree.reAsyncChildNodes(cNode, 'refresh')
            setTimeout(() => {
              const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
              this.zTree.selectNode(node)
            }, 500)
          })
        })
      } else {
        formData.append('isTraineesVisible', 'N')
        confirm('确认设置章节【' + treeNode[this.name] + '】以及其下所有子节点，对学员不可见吗？', () => {
          this.$api.resource.setTraineesVisible(formData).then(res => {
            toast(res.msg)
            // 获取父节点
            const parentNode = treeNode.getParentNode()
            //  更改有活动章节的图标
            if (parentNode.hasActivity) {
              parentNode.icon = 'static/image/activity_icon.png'
              parentNode.iconSkin = '33'
            }
            if (parentNode.children && parentNode.children.length > 0) {
              this.recursiveTree(parentNode.children)
            }
            // 强行异步加载父节点的子节点
            // this.zTree.reAsyncChildNodes(parentNode, "refresh"); // 不要删除先
            const cNode = this.zTree.getNodeByParam('id', treeNode.subjectId)
            this.zTree.reAsyncChildNodes(cNode, 'refresh')
            setTimeout(() => {
              const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
              this.zTree.selectNode(node)
            }, 500)
          })
        })
      }
    },

    /**
     * 用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
     */
    zTreeBeforeClick(treeId, treeNode, clickFlag) {
      return true// 当是父节点 返回false 不让选取
    },

    /**
     * 用于捕获节点被点击的事件回调函数
     * 如果设置了 setting.callback.beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数。
     */
    zTreeOnClick(event, treeId, treeNode) {
      // this.doExpandNodeAccordion(treeNode)
    },

    /**
     * 用于捕获 zTree 上鼠标双击之后的事件回调函数
     * 如果设置了 setting.callback.beforeDblClick 方法，且返回 false，将无法触发 onDblClick 事件回调函数。
     */
    zTreeOnDblClick(event, treeId, treeNode) {
      this.doExpandNodeAccordion(treeNode)
    },

    // 手风琴模式
    doExpandNodeAccordion(treeNode) {
      if (!treeNode) {
        return false
      }
      // 找到当前同级的节点
      const nodes = this.zTree.getNodesByParam('level', treeNode.level, null)
      nodes.forEach(node => {
        if (node[this.idKey] !== treeNode[this.idKey]) {
          if (node.open) {
            // 折叠同级中已经展开的节点
            this.zTree.expandNode(node, false, true, true)
          }
        }
      })
    },

    // 寻找根节点的id
    findRootId: function() {
      const rootNode = this.zTree.getNodesByParam('level', '0', null)
      if (rootNode[0]) {
        return rootNode[0].id
      } else {
        return null
      }
    },
    // 点击新增
    showLibraryForm: function() {
      this.formVisible = true
      this.$emit('showLibraryForm', { formVisible: this.formVisible, dataForm: 'null', rootId: this.findRootId() })
    },
    // 将数据传给父组件的公共数据
    commData: function(treeNode) {
      const jj = {
        parentNode: treeNode.getParentNode(),
        preNode: treeNode.getPreNode(),
        nextNode: treeNode.getNextNode(),
        children: treeNode.children,
        treeNode: treeNode
      }
      if (treeNode.getPreNode()) {
        jj.parentNodeChildren = treeNode.getPreNode().children
      }
      if (treeNode.getParentNode()) {
        jj.parentNodeNext = treeNode.getParentNode().getNextNode()
      }
      return jj
    },
    // event   js event 对象  标准的 js event 对象
    // treeId   String   对应 zTree 的 treeId，便于用户操控
    // treeNode  JSON 鼠标按键按下时所在节点的 JSON 数据对象 如果不在节点上，则返回 null
    onMouseDown: function(event, treeId, treeNode) {
      if (treeNode) {
        this.selectNode(treeNode.id)
      }
    },
    // 获取被选中节点的数据并将数据传给父组件
    selectNodeGetForm: function(data) {
      let treeNode = null
      if (data) {
        treeNode = data
      } else {
        if (this.zTree.getSelectedNodes() && this.zTree.getSelectedNodes()[0]) {
          treeNode = this.zTree.getSelectedNodes()[0]
        }
      }
      if (treeNode) {
        if (this.isFromBookshelf) {
          if (treeNode.level === 0) {
            this.formVisible = true // 根节点
            this.$emit('showLibraryForm', { treeNode: treeNode, type: 'subject', chapterId: treeNode.id, formVisible: this.formVisible, root: 'root', dataForm: data, rootId: this.findRootId() })
          } else {
            this.formVisible = false
            this.$emit('showLibraryForm', { treeNode: treeNode, chapterId: treeNode.id, formVisible: this.formVisible, dataForm: data, rootId: this.findRootId() })
          }
          return false
        }

        const obj = {
          id: treeNode.id,
          pkgId: this.pkgId
        }
        if (treeNode.level === 0) { // treeNode.isParent
          this.formVisible = true // 根节点
          this.$emit('showLibraryForm', { treeNode: treeNode, type: 'subject', formVisible: this.formVisible, dataForm: data, root: 'root', rootId: this.findRootId() })
        } else {
          this.formVisible = false
          if (!this.isClassroomDetail) {
            obj.type = 'pkg'
          }
          this.$api.library.findDataDetailsContent(obj).then((res) => {
            if (res.data) {
              const data = res.data
              this.$emit('showLibraryForm', { treeNode: treeNode, chapterId: treeNode.id, formVisible: this.formVisible, dataForm: data, rootId: this.findRootId() })
              const kk = this.commData(treeNode)
              kk.subject = res.data
              kk.chapterContent = res.data.chapterContent
              this.$emit('showLibraryRead', kk)
            }
          })
        }
      }
    },
    // 清除input
    clearFilterInput: function() {
      $('#keyword').val('')
      this.freshArea()
    },
    // 节点被拖拽之前 treeId :String:被拖拽的节点treeNodes 所在 zTree 的 treeId，便于用户操控
    // treeNodes  Array(JSON)  要被拖拽的节点 JSON 数据集合
    // 返回值是 true / false  如果返回 false，zTree 将终止拖拽
    beforeDrag: function(treeId, treeNodes) {
      console.log('当前被拖拽的节点', treeNodes[0].chapterName, treeNodes[0])
      // 如果是根节点，不允许拖拽
      if (treeNodes[0].subjectId === treeNodes[0].chapterId) {
        return false
      }
      // 如果当前节点没有权限操作，不允许拖拽
      if (treeNodes[0] && !treeNodes[0].hasPermission) {
        return false
      }
      return true
    },
    // 节点拖拽操作结束之前
    // treeNodes 被拖拽放开的目标节点 JSON 数据对象。  如果拖拽成为根节点，则 targetNode = null
    // moveType  String指定移动到目标节点的相对位置 "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
    // isCopy   Boolean 拖拽节点操作是 复制 或 移动  true：复制；false：移动
    // 返回值Boolean  返回值是 true / false  如果返回 false，zTree 将恢复被拖拽的节点
    beforeDrop: function(treeId, treeNodes, targetNode, moveType, isCopy) {
      console.log('被托拽至', moveType, targetNode)
      // 不允许章节拖拽成为根节点的同级节点
      if (!targetNode || ((moveType === 'prev' || moveType === 'next') && targetNode.chapterId === targetNode.subjectId)) {
        console.log('不允许章节拖拽成为根节点的同级节点')
        return false
      }
      // 如果被拖拽至的节点没有权限，也不允许拖拽
      if (!targetNode.hasPermission) {
        console.log('被拖拽至的节点没有权限，也不允许拖拽')
        toast('节点没有操作权限，不允许拖拽')
        return false
      }
      // 如果是托拽成为子节点
      if (moveType && moveType === 'inner') {
        const num = this.getLevelNum(treeNodes)
        if (targetNode.level + num > 3) {
          toast('节点层级将超过3级，无法托拽至其下')
          return false
        }
      } else {
        const num = this.getLevelNum(treeNodes)
        if (targetNode.getParentNode().level + num > 3) {
          toast('节点层级将超过3级，无法托拽至其下')
          return false
        }
      }
      return true
    },
    onDrag(event, treeId, treeNodes) {
      console.log(treeNodes)
    },
    /**
     * event 标准的 js event 对象
     * treeId 目标节点 targetNode 所在 zTree 的 treeId，便于用户操控
     * treeNodes 被拖拽的节点 JSON 数据集合，如果拖拽操作为 移动，treeNodes 是当前被拖拽节点的数据集合。如果拖拽操作为 复制，treeNodes 是复制后 clone 得到的新节点数据。
     * targetNode 成为 treeNodes 拖拽结束的目标节点 JSON 数据对象。
     * moveType 指定移动到目标节点的相对位置 "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点 如果 moveType = null，表明拖拽无效
     * isCopy 拖拽节点操作是 复制 或 移动
     */
    onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
      if (moveType == null) {
        return false
      }
      const treeNode = treeNodes[0]
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      formData.append('subjectId', treeNode.subjectId)
      formData.append('moveType', moveType)
      formData.append('soureNodeId', treeNode.chapterId) // 当前被选择托拽的节点
      formData.append('targetId', targetNode.chapterId) // 被托拽至该节点上、里、下
      let dataList = []
      if (moveType && moveType !== 'inner') {
        dataList = targetNode.getParentNode().children || []
      } else {
        dataList = targetNode.children || []
      }
      if (dataList) {
        formData.append('list', JSON.stringify(dataList.map(a => { return { chapterId: a.id, chapterName: a.chapterName } })))
      }
      this.$api.library.dragNode(formData).then(res => {
        toast(res.msg)
        if (res.code !== 0) {
          this.freshArea()
        } else {
          if (moveType && moveType === 'inner') {
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(targetNode, 'refresh')
          } else {
            this.zTree.reAsyncChildNodes(targetNode.getParentNode(), 'refresh')
          }
        }
      })
    },
    // 判断当前节点有几层（包含本身计算）
    getLevelNum(treeNodes) {
      if (!treeNodes || !treeNodes.length) {
        return 0
      }
      let num = 1
      const currNode = treeNodes[0]
      if (currNode.children && currNode.children.length) {
        num = 2
        for (let i = 0; i < currNode.children.length; i++) {
          const v2Node = currNode.children[i]
          if (v2Node.children && v2Node.children.length) {
            num = 3
            break
          }
        }
      }
      return num
    },
    // 自动展开该父节点之前
    beforeDragOpen: function(treeId, treeNode) {
      return true
    },
    // 上下移
    moveTreeNode: function(moveType) {
      this.hideRMenu()
      const nodes = this.zTree.getSelectedNodes()
      const treeNode = nodes[0]
      // const index = this.zTree.getNodeIndex(treeNode)
      const PreNode = treeNode.getPreNode()
      const NextNode = treeNode.getNextNode()
      if (nodes.length === 0) {
        toast('请先选择一个节点')
        return
      }
      if (moveType === 'prev') {
        if (PreNode) {
          this.$api.library.move({ currId: treeNode.id, targetId: PreNode.id, pkgId: this.pkgId }).then((res) => {
            if (res.code === 0) {
              toast('上移成功')
              /* targetNode  JSON  要移动到的目标节点 JSON 数据   如果移动成为根节点，请设置 targetNode 为 null 即可
        treeNode   JSON  需要被移动的节点数据
        moveType  String  指定移动到目标节点的相对位置
              "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
        isSilent   Boolean  设定移动节点后是否自动展开父节点。
              isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开。 */
              this.zTree.moveNode(PreNode, treeNode, 'prev', false)
              // 获取父节点
              const parentNode = treeNode.getParentNode()
              //  更改有活动章节的图标
              if (parentNode.hasActivity) {
                parentNode.icon = 'static/image/activity_icon.png'
                parentNode.iconSkin = '33'
              }
              if (parentNode.children && parentNode.children.length > 0) {
                this.recursiveTree(parentNode.children)
              }
              // 强行异步加载父节点的子节点
              this.zTree.reAsyncChildNodes(parentNode, 'refresh')
              setTimeout(() => {
                const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
                this.zTree.selectNode(node)
              }, 500)
              return true
            } else {
              toast('上移失败' + res.msg)
              return false
            }
          })
        } else {
          toast('该节点已经是第一个节点，不可上移')
          return false
        }
      }
      if (moveType === 'next') {
        if (NextNode) {
          this.$api.library.move({ currId: treeNode.id, targetId: NextNode.id, pkgId: this.pkgId }).then((res) => {
            if (res.code === 0) {
              toast('下移成功')
              this.zTree.moveNode(NextNode, treeNode, 'next', false)
              // 获取父节点
              const parentNode = treeNode.getParentNode()
              //  更改有活动章节的图标
              if (parentNode.hasActivity) {
                parentNode.icon = 'static/image/activity_icon.png'
                parentNode.iconSkin = '33'
              }
              if (parentNode.children && parentNode.children.length > 0) {
                this.recursiveTree(parentNode.children)
              }
              // 强行异步加载父节点的子节点
              this.zTree.reAsyncChildNodes(parentNode, 'refresh')
              setTimeout(() => {
                const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
                this.zTree.selectNode(node)
              }, 500)
              return true
            } else {
              toast('下移失败' + res.msg)
              return false
            }
          })
        } else {
          toast('该节点已经是最后一个节点，不可下移')
          return false
        }
      }
      this.selectNodeGetForm()
    },

    // 递归树  改变有活动的章节的图标
    recursiveTree(value) {
      for (let i = 0; i < value.length; i++) {
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
     * 重命名之前的事件判断
     * treeId 对应 zTree 的 treeId，便于用户操控
     * treeNode 将要更改名称的节点 JSON 数据对象
     * newName 修改后的新名称
     * isCancel 是否取消操作 (v3.5.13+)
     *          isCancel = true 表示取消编辑操作（按下 ESC 或 使用 cancelEditName 方法）
     isCancel = false 表示确认修改操作
     * */
    beforeRename: function(treeId, treeNode, newName, isCancel) {
      // 隐藏右键菜单
      this.hideRMenu()
      // 获取父节点
      const parentNode = treeNode.getParentNode()
      if (parentNode.hasActivity) {
        parentNode.icon = 'static/image/activity_icon.png'
        parentNode.iconSkin = '33'
      }
      if (parentNode.children && parentNode.children.length > 0) {
        this.recursiveTree(parentNode.children)
      }
      // 如果取消了编辑,
      if (isCancel) {
        // 如果没有输入直接退出
        if (!treeNode.chapterId) {
          // 则移除该节点
          this.zTree.removeNode(treeNode)
          // 选中父节点
          setTimeout(() => {
            if (parentNode.children) {
              const node = parentNode.children[parentNode.children.length - 1]
              this.zTree.selectNode(node)
              this.selectNodeGetForm(node) // 其它业务操作
            }
            // this.zTree.selectNode(parentNode)
          }, 500)
          // this.selectNodeGetForm(parentNode) // 其它业务操作
        } else {
          // TODO
          /* setTimeout(() => {
            treeNode.name = treeNode.chapterNameOld
            this.zTree.updateNode(treeNode)
          }, 300) */
          // 强行异步加载父节点的子节点
          this.zTree.reAsyncChildNodes(parentNode, 'refresh')
          setTimeout(() => {
            const node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode)
            // 重新选中选中被重命名的节点
            this.zTree.selectNode(node)
          }, 300)
        }
        return
      } else {
        // 非空判断
        if (newName.length === 0) {
          // toast('节点名称不能为空!')
          this.zTree.cancelEditName()
          return false
        }
      }
      // 构建传递给后台的数据
      const data = {
        pkgId: this.pkgId,
        subjectId: treeNode.subjectId,
        parentId: treeNode.parentId,
        chapterId: treeNode.chapterId,
        chapterName: newName,
        // 追加节点所需参数
        operationType: treeNode.operationType,
        previousChapterId: treeNode.previousChapterId
      }
      // 触发http请求将数据传递给后台
      this.$api.library.saveChapter(data).then((res) => {
        if (res.code === 0) {
          toast(res.msg)
          // 如果是右键重命名进来的
          if (this.renameFlag) {
            // return false
          }
          // 后台返回新章节
          const chapterId = res.chapterId
          // 强行异步加载父节点的子节点
          this.zTree.reAsyncChildNodes(parentNode, 'refresh')
          // 如果是追加的情况
          if (treeNode.operationType === 'appendPeerNode') {
            setTimeout(() => {
              // 获取节点
              const node = this.zTree.getNodeByParam('id', chapterId, parentNode)
              // 选中节点
              this.zTree.selectNode(node)
              // 其它业务操作
              this.selectNodeGetForm(node)
            }, 500)
            return false
          }
          // 一种体验情况：重新选中父节点
          // this.zTree.selectNode(parentNode)
          // 另一个种体验情况：找到父节点的子节点，选中此新节点
          setTimeout(() => {
            // 获取节点
            const node = this.zTree.getNodeByParam('id', chapterId, parentNode)
            // 选中节点
            this.zTree.selectNode(node)
            this.selectNodeGetForm(node) // 其它业务操作
            // 如果是新增节点
            if (!data.chapterId) {
              // 再次构建一个新的节点
              const newNode = { name: '', chapterName: '' }
              newNode.pkgId = this.pkgId
              newNode.parentId = parentNode.id
              newNode.subjectId = this.findRootId()
              // 为父节点添加一个子节点
              const newNodes = this.zTree.addNodes(parentNode, newNode)
              // 设置新添加的这个节点为编辑状态
              this.zTree.editName(newNodes[0])
            }
          }, 500)
        } else {
          toast(res.msg)
          if (!data.chapterId) {
            // 则移除该节点
            this.zTree.removeNode(treeNode)
            // 重新将其父节点设为选中状态
            if (parentNode) {
              this.zTree.selectNode(parentNode)
            }
          } else {
            if (this.renameFlag) {
              treeNode.chapterName = res.chapterName
              this.zTree.updateNode(treeNode)
              return false
            }
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(parentNode, 'refresh')
            setTimeout(() => {
              const node = this.zTree.getNodeByParam('id', res.chapterId, parentNode)
              // 重新选中选中被重命名的节点
              this.zTree.selectNode(node)
            }, 500)
          }
        }
      })
    },
    // 新增节点
    addTreeNode: function() {
      // 隐藏右键菜单
      this.hideRMenu()
      // 找到父节点
      const treeNode = this.zTree.getSelectedNodes()[0]
      // 构建一个新节点
      const newNode = { name: '', chapterName: '' }
      if (treeNode) {
        newNode.pkgId = this.pkgId
        newNode.parentId = treeNode.id
        newNode.subjectId = this.findRootId()
        // 为父节点添加一个子节点
        const newNodes = this.zTree.addNodes(treeNode, newNode)
        // 设置新添加的这个节点为编辑状态
        this.zTree.editName(newNodes[0])
      }
    },
    /**
     * treeNode 右键选中的节点
     */
    appendPeerTreeNode() {
      // 隐藏右键菜单
      this.hideRMenu()
      // 找到父节点（此节点是新节点的父节点）
      const treeNode = this.zTree.getSelectedNodes()[0]
      const parentTreeNode = treeNode.getParentNode()
      // 构建一个新节点
      const newNode = {
        name: '',
        chapterName: '',
        pkgId: this.pkgId,
        parentId: parentTreeNode.parentId === 0 ? parentTreeNode.subjectId : parentTreeNode.parentId,
        subjectId: this.findRootId(),
        operationType: 'appendPeerNode',
        previousChapterId: treeNode.id
      }
      // 为父节点添加一个子节点
      const newNodes = this.zTree.addNodes(parentTreeNode, [treeNode.orderNum], newNode)
      // 设置新添加的这个节点为编辑状态
      this.zTree.editName(newNodes[0])
    },
    // 使data对应的节点被选中
    selectNode: function(data) {
      const gg = this.zTree.getNodesByParam('id', data, null)
      this.zTree.selectNode(gg[0])
      this.selectNodeGetForm()
    },
    // 删除节点
    removeTreeNode: function() {
      this.hideRMenu()
      var nodes = this.zTree.getSelectedNodes()
      if (nodes.length === 0) {
        toast('请先选择一个节点')
        return
      }
      if (nodes && nodes.length > 0) {
        let msg = ''
        if (nodes[0].children && nodes[0].children.length > 0) {
          msg = '确认删除 ' + nodes[0][this.name] + ' 以及其下子节点吗？'
        } else {
          msg = '确认删除 ' + nodes[0][this.name] + ' 吗？'
        }
        const that = this
        confirm(msg, () => {
          const jj = { id: nodes[0].id }
          if (nodes[0].level === 0) {
            jj.type = '1'
          } else {
            jj.type = '2'
          }
          jj.pkgId = this.pkgId
          that.$api.library.remove(jj).then((res) => {
            if (res.code === 0) {
              toast('删除成功')
              that.zTree.removeNode(nodes[0])
              that.$emit('removeSucc', { remove: jj.type })
              that.selectNodeGetForm()
              that.selectNode(nodes[0].getParentNode().id)
              return true
            } else {
              toast('删除失败' + res.msg)
              return false
            }
          })
        })
      }
    },
    // 重命名节点
    renameTreeNode: function() {
      this.renameFlag = true
      // 隐藏右键菜单
      this.hideRMenu()
      const nodes = this.zTree.getSelectedNodes()
      if (nodes.length === 0) {
        toast('请先选择一个节点')
        return false
      }
      const treeNode = nodes[0]
      if (treeNode.level === 0) {
        toast('课程点名称不能修改!')
        return false
      }
      // 去掉序号
      treeNode.chapterNameOld = treeNode.chapterName
      const i = treeNode.chapterName.indexOf(' ')
      if (i !== 0) {
        treeNode.chapterName = treeNode.chapterName.substring(i + 1, treeNode.chapterName.length)
      }
      this.zTree.editName(treeNode)
    },
    // 右键菜单
    onRightClick: function(event, treeId, treeNode) {
      // treeNode.hasPermission = true
      // 1.如果节点没有权限，直接返回
      if (!treeNode.hasPermission && !treeNode.hasSetVisiblePermission) {
        return false
      }
      const arr = []
      const addNodeObject = {
        id: 'm_add',
        name: '新增节点',
        src: 'static/image/teaching_package/add_3.png',
        alt: '',
        onClick: (event) => {
          this.addTreeNode()
        }
      }
      const appendPeerNodeObject = {
        id: 'm_add',
        name: '追加节点',
        src: 'static/image/teaching_package/add_3.png',
        alt: '',
        onClick: (event) => {
          this.appendPeerTreeNode(treeNode)
        }
      }
      const renameNodeObject = {
        id: 'm_check',
        name: '重新命名',
        src: 'static/image/teaching_package/renname_1.png',
        alt: '',
        onClick: (event) => {
          this.renameTreeNode()
        }
      }
      const deleteNodeObject = {
        id: 'm_del',
        name: '删除节点',
        src: 'static/image/teaching_package/del_2.png',
        alt: '',
        onClick: (event) => {
          this.removeTreeNode()
        }
      }
      const moveUpNodeObject = {
        id: 'm_move_up',
        name: '上移节点',
        src: 'static/image/teaching_package/move_up_1.png',
        alt: '',
        onClick: (event) => {
          this.moveTreeNode('prev')
        }
      }
      const moveDownNodeObject = {
        id: 'm_reset',
        name: '下移节点',
        src: 'static/image/teaching_package/move_down_1.png',
        alt: '',
        onClick: (event) => {
          this.moveTreeNode('next')
        }
      }
      const createDefaultNodeObject = {
        id: 'm_create',
        name: '默认节点',
        src: 'static/image/teaching_package/set.png',
        alt: '生成默认节点',
        onClick: (event) => {
          this.createDefaultChapter()
        }
      }
      const setNodeTraineesVisible = {
        id: 'm_set',
        name: treeNode.isTraineesVisible === 'N' ? '设置为学员可见' : '设置为学员<a style="color: red;">不</a>可见',
        src: 'static/image/teaching_package/set.png',
        alt: '设置章节对学员是否可见',
        onClick: (event) => {
          this.setTraineesVisible()
        }
      }
      const upgradeNodesObject = {
        id: 'm_upgrade',
        name: '升级层级',
        src: 'static/image/teaching_package/move_up_1.png',
        alt: '升级节点的层级',
        onClick: () => {
          this.doUpgradeNodes(treeNode)
        }
      }
      // const demotionNodesObject = {
      //   id: 'm_demotion',
      //   name: '降级层级',
      //   src: 'static/image/teaching_package/move_down_1.png',
      //   alt: '降级节点的层级',
      //   onClick: () => {
      //     this.currenNode = treeNode
      //     // 打开模态框
      //     $('#move-nodes-dialog').modal('show')
      //     this.hideRMenu()
      //     // this.doDemotionNodes(treeNode)
      //   }
      // }
      // 如果右键的是顶级课程节点
      if (treeNode.type === 'subject') {
        // 且为教材的创建者，且拥有操作节点的权限
        if (treeNode.hasPermission) {
          arr.push(addNodeObject)
        }
      }
      // 否则就是点击的章节节点，如果有权限，则加入数组
      if (treeNode.type === 'chapter') {
        if (treeNode.hasPermission) {
          if (treeNode.level < 3) {
            arr.push(addNodeObject)
            if (treeNode.level >= 1) {
              arr.push(appendPeerNodeObject)
            }
          }
          if (treeNode.level === 3) {
            arr.push(appendPeerNodeObject)
          }
          arr.push(renameNodeObject)
          arr.push(deleteNodeObject)
          arr.push(moveUpNodeObject)
          arr.push(moveDownNodeObject)
          if (treeNode.level < 3) {
            arr.push(createDefaultNodeObject)
          }
          // 大于1级的才可以升级
          if (treeNode.level > 1) {
            arr.push(upgradeNodesObject)
          }
          // 有子节点才可以降级
          if (treeNode.children && treeNode.children.length) {
            // arr.push(demotionNodesObject)
          }
        }
      }
      // TODO 是否有操作【设置章节对学员可见】权限，逻辑判断交由后台处理
      if (treeNode.hasSetVisiblePermission) {
        arr.push(setNodeTraineesVisible)
        this.isTraineesVisibleText = true
      }
      const options = {
        menus: arr
      }
      this.createMenu(options)
      const toBottomHeight = document.documentElement.clientHeight - event.clientY
      this.showRMenu('node', event.clientX + 50, event.clientY + 10, toBottomHeight)
      return false
    },

    /**
     * 右键菜单出现前的一些处理
     */
    handleCb(treeNode) {
      const ele = document.getElementById('rightMenuUl')
      if (!ele) {
        return false
      }
      this.setTraineesVisibleText(treeNode, ele)
      this.$nextTick(() => {
        const lis = ele.querySelectorAll('li')
        // 如果为课程节点，只显示新增
        if (treeNode.type === 'subject') {
          lis.forEach(item => {
            if (item.id !== 'm_add') {
              // ele.removeChild(item)
              item.style.display = 'none'
            }
          })
        } else {
          lis.forEach(item => {
            // 如果处于第三级，不显示新增节点
            if (item.id === 'm_add' && treeNode.level === 3) {
              item.style.display = 'none'
            } else {
              item.style.display = 'block'
            }
            // 如果当前节点处于第三级，不显示【生成】
            if (item.id === 'm_create') {
              if (treeNode.level === 3) {
                item.style.display = 'none'
              }
            }
          })
        }
      })
    },

    /**
     * 处理右键设置学员是否可见的文本
     */
    setTraineesVisibleText(treeNode, ele) {
      if (!treeNode) {
        return false
      }
      this.treeNodeHasPermission = treeNode.hasPermission
      if (treeNode.isTraineesVisible === 'N') {
        this.$nextTick(() => {
          if (ele) {
            const li = ele.querySelector('#m_set')
            if (li) {
              const span = li.querySelector('span')
              span.innerText = '设置为学员可见'
            }
          }
        })
      } else {
        this.$nextTick(() => {
          const ele = document.getElementById('rightMenuUl')
          if (ele) {
            const li = ele.querySelector('#m_set')
            if (li) {
              const span = li.querySelector('span')
              span.innerHTML = '设置为学员<a style="color: red;">不</a>可见'
            }
          }
        })
      }
    },

    // 显示右键菜单
    showRMenu: function(type, x, y, toBottomHeight) {
      x = x - 40
      $('#rMenu ul').show()
      let rMenuHeight = $('#rMenu ul').height()
      if (rMenuHeight < 240) {
        if (this.isClassroomDetail && !this.isTraineesVisibleText) {
          rMenuHeight = 280
        } else if (this.isClassroomDetail && this.isTraineesVisibleText) {
          rMenuHeight = 40
        } else {
          rMenuHeight = 240
        }
      }
      this.isTraineesVisibleText = false
      if (toBottomHeight < rMenuHeight) {
        $('#rMenu').css({ 'top': (y - rMenuHeight - 20) + 'px', 'left': x + 'px', 'visibility': 'visible' })
      } else {
        $('#rMenu').css({ 'top': y + 'px', 'left': x + 'px', 'visibility': 'visible' })
      }
      $('body').bind('mousedown', this.onBodyMouseDown)
      window.addEventListener('scroll', this.onBodyMouseDown)
    },
    // 隐藏右键菜单
    hideRMenu: function() {
      if ($('#rMenu')) $('#rMenu').css({ 'visibility': 'hidden' })
      $('body').unbind('mousedown', this.onBodyMouseDown)
      window.removeEventListener('scroll', this.onBodyMouseDown)
    },
    // 在空白处按下
    onBodyMouseDown: function(event) {
      if (!(event.target.id === 'rMenu' || $(event.target).parents('#rMenu').length > 0)) {
        $('#rMenu').css({ 'visibility': 'hidden' })
      }
    },
    // 取消节点选中状态
    cancelSelectedNode: function(data) {
      if (data) {
        this.zTree.cancelSelectedNode(data)
      } else {
        this.zTree.cancelSelectedNode()
      }
    },

    /**
     * 初始化树
     */
    freshArea: function() {
      $.fn.zTree.init($('#' + this.ztreeId), this.setting, this.zNodes)
      this.zTree = $.fn.zTree.getZTreeObj(this.ztreeId)
      const nodeAll = this.zTree.transformToArray(this.zTree.getNodes())
      // 初始化模糊搜索方法
      fuzzySearch(this.ztreeId, '#keyword', null, true)
      // 默认展开
      if (this.expandAll) {
        this.zTree.expandAll(true)
      } else {
        this.zTree.expandNode(nodeAll[0], true, false, true)
      }
    },

    /**
     * 学员不可见章节的字体颜色
     */
    setFontCss(treeId, treeNode) {
      return treeNode.isTraineesVisible === 'N' ? { color: '#bbbbbb' } : {}
    },

    /**
     * 用于在节点上固定显示用户自定义控件
     * @param treeId
     * @param treeNode
     */
    addDiyDom(treeId, treeNode) {
      // 为根节点（课程节点）手动添加一个自定义控件
      if (treeNode.type === 'subject') {
        if (this.isClassroomDetail) {
          return false
        }
        if (!treeNode.isBookCreator) {
          return false
        }
        if (this.privateUse === 'Y') {
          return false
        }
        const aObj = $('#' + treeNode.tId + this.IDMark_A)
        // 授权教材的按钮
        const editStr = "<span class='demoIcon' id='diyBtn_" + treeNode[this.idKey] + "' title='章节授权，共建教材' onfocus='this.blur();'><span class='button icon02'></span></span>"
        aObj.after(editStr)
        const btn = $('#diyBtn_' + treeNode[this.idKey])
        // TODO 跳转至章节授权页面
        if (btn) {
          btn.bind('click', () => {
            if (treeNode.pkgLimit === '2') {
              toast('免费的教学包，无需授权')
              return false
            }
            const data = {
              pkgId: this.pkgId,
              subjectId: treeNode.subjectId,
              isClassroomDetail: this.isClassroomDetail
            }
            localStorage.setItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB, this.pkgId)
            localStorage.setItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB, treeNode.subjectId)
            localStorage.setItem('isClassroomDetail', this.isClassroomDetail)
            if (this.$store.state.pkg.releaseStatus === 'N') {
              this.$router.push({
                name: 'authorization-package',
                params: data
              })
            } else {
              this.$router.push({
                name: 'authorization-package-released',
                params: data
              })
            }
          })
        }
        if (this.$store.state.pkg.releaseStatus === 'N') {
          // 设置生成默认章节的按钮
          const setDefaultChapterStr = "<span class='set-default-chapter' id='diyBtn_" + treeNode[this.idKey] + "_set' title='设置默认生成的章节' onfocus='this.blur();'><span class='button defaultchapert'></span></span>"
          aObj.after(setDefaultChapterStr)
          const btnSet = $('#diyBtn_' + treeNode[this.idKey] + '_set')
          if (btnSet) {
            btnSet.bind('click', () => {
              this.$emit('setCreateDefaultChapter', { pkgId: this.pkgId })
            })
          }
          const batchSaveChapterStr = "<span class='batch-save-chapter' id='diyBtn_" + treeNode[this.idKey] + "_batch' title='批量保存章节目录' onfocus='this.blur();'><span class='button batchSaveChapter'></span></span>"
          aObj.after(batchSaveChapterStr)
          const btnSet2 = $('#diyBtn_' + treeNode[this.idKey] + '_batch')
          if (btnSet2) {
            const data = {
              pkgId: this.pkgId,
              subjectId: treeNode.subjectId,
              isClassroomDetail: this.isClassroomDetail
            }
            localStorage.setItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB, this.pkgId)
            localStorage.setItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB, treeNode.subjectId)
            localStorage.setItem('isClassroomDetail', this.isClassroomDetail)
            btnSet2.bind('click', () => {
              this.$router.push({
                name: 'batch-save-chapter',
                params: data
                // path: '/pkg/batch-save-chapter',
                // query: {
                //   pkgId: this.pkgId,
                //   subjectId: treeNode.subjectId
                // }
              })
            })
          }
        }
        return false
      } else {
        // 如果不是创建者，且是共建者，且不是课堂页面
        // if (!this.isCreator && this.isTogetherBuild && treeNode.hasPermission && !this.isClassroomDetail) {
        if (!treeNode.isBookCreator && treeNode.hasPermission && !this.isClassroomDetail) {
          const aObj = $('#' + treeNode.tId + this.IDMark_A)
          const editStr = "<span class='demoIcon' id='diyBtn_" + treeNode[this.idKey] + "' title='已授权' onfocus='this.blur();'><span class='button hasPermission'></span></span>"
          aObj.after(editStr)

          aObj.addClass('custom_pkg_a')
          $('#' + treeNode.tId + '_span').addClass('text-ellipsis custom_pkg_span')
        }
      }
    },
    createMenu: function(options) {
      const ztreeLibrary = document.querySelector('.ztreeLibrary')
      if (!ztreeLibrary) {
        return false
      }
      const rMenuDiv = ztreeLibrary.querySelector('#rMenu')
      if (!rMenuDiv) {
        return false
      }
      const ele = ztreeLibrary.querySelector('#rightMenuUl')
      if (ele) {
        rMenuDiv.removeChild(ele)
      }
      const ul = document.createElement('ul')
      ul.id = 'rightMenuUl'
      ul.classList.add('rightMenuUl')
      const { menus } = options
      if (menus && menus.length > 0) {
        for (const menu of menus) {
          const li = document.createElement('li')
          li.id = menu.id
          li.onclick = menu.onClick
          const img = document.createElement('img')
          img.src = menu.src
          img.alt = menu.alt
          li.appendChild(img)
          const span = document.createElement('span')
          span.innerHTML = menu.name
          li.appendChild(span)
          ul.appendChild(li)
        }
      }
      rMenuDiv.appendChild(ul)
    }
  }
}
</script>

<style scoped>
  .search {
    margin-top: 10px;
    margin-left: 8px;
  }
  .ztree {
    height: 600px;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
  }
  .ztreeTwo{
    /* height: calc(100vh - 50px - 138px - 20px - 36px - 15px - 46px - 20px ); */
    height: calc(100vh - 325px );
  }
  .right-tip{
      font-size:12px;
      padding-top:10px;
      padding-left:10px;
      color:#ffd200;
      text-align: left;
      height: 25px;
      line-height: 15px;
      width: 100%;
      overflow: hidden;
  }
</style>
