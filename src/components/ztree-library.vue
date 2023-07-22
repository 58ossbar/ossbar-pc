<!-- 章节树组件 -->
<template>
  <div class="ztreeLibrary widthAll">
    <!--搜索区域 begin -->
    <div v-if="searchVislib" class="d-flex search">
      <div class="input-group input-group-sm mb-1 input-group-width-ztree ">
        <!-- <input v-model="inputKeyword" id="keyword" type="text" class="form-control" placeholder="输入关键字搜索"> -->
        <el-input
          placeholder="输入关键字搜索"
          id="keyword"
          size="small"
          v-model="inputKeyword">
        </el-input>
        <!--删除按钮 begin -->
        <div class="input-group-append" @click="clearFilterInput" v-if="showSearchDeleteButton">
          <button  type="button" class="btn btn-primary">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <!--删除按钮 end -->
      </div>
      <!--添加按钮-->
      <button type="button" class="btn btn-primary btn-sm fa-plus-btn" @click="showLibraryForm()" v-if="showSearchAddButton">
        <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
      <!--查询按钮-->
      <button type="button" class="btn btn-primary btn-sm fa-plus-btn" @click="query()" v-if="showSearchButton">
        <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
    </div>
    <!--搜索区域 end -->
    <!-- ztree树形数据 begin -->
    <div class="content_wrap ">
      <div class="bg left">
        <!-- <div v-if="hasPermission" class="right-tip">温馨提示！选择章节节点右键操作</div> -->
        <ul :id="ztreeId" class="ztree"></ul>
      </div>
    </div>
    <!-- ztree树形数据 end -->

    <!--右键菜单 begin-->
    <div id="rMenu" v-if="searchVislib && hasPermissionActual">
      <ul id="rightMenuUl">
        <li id="m_add" @click="addTreeNode()" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/add_3.png" alt="">
          <span>新增节点</span>
        </li>
        <li id="m_check" @click="renameTreeNode()" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/renname_1.png" alt="">
          <span>重新命名</span>
        </li>
        <li id="m_del" @click="removeTreeNode()" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/del_2.png" alt="">
          <span>删除节点</span>
        </li>
        <li id="m_unCheck" @click="moveTreeNode('prev')" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/move_up_1.png" alt="">
          <span>上移节点</span>
        </li>
        <li id="m_reset" @click="moveTreeNode('next')" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/move_down_1.png" alt="">
          <span>下移节点</span>
        </li>
        <li id="m_set" class="m_set" @click="setTraineesVisible" v-if="isClassroomDetail">
          <img src="static/image/teaching_package/set.png" alt="">
          <span>设置学员是否可见</span>
        </li>
        <li id="m_create" @click="createDefaultChapter" v-if="treeNodeHasPermission">
          <img src="static/image/teaching_package/set.png" alt="">
          <span>生成默认节点</span>
        </li>
      </ul>
    </div>
    <!--右键菜单 end -->
  </div>
</template>

<script>
  import $ from 'jquery'
  import Cookies from 'js-cookie'
  import {baseUrl, fuzzySearch, alert, toast, confirm, loadingModal} from '@/utils/global'

  export default {
    name: 'ztree-library',
    props: {
      // 是否显示右键菜单和搜索框、新增按钮
      searchVislib: {
        type: Boolean,
        default: true,
        required: false
      },
      // 是否显示搜索区域的删除按钮
      showSearchDeleteButton: {
        type: Boolean,
        default: false,
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
        required: false,
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
        default: [],
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
        required: true,
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
        required: true
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
      // 是否为课程创建者
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
      //是否是章节授权页的树
      isAuthorization: {
        type: Boolean,
        default: false,
        required: false
      },
      // 是否为课堂详情页面
      isClassroomDetail: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 是否全部展开
      expandAll: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 默认展开的层级
      expandLevel: {
        type: String,
        required: false,
        default: '0',
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
      }
    },
    components: {},
    data () {
      return {
        isTraineesVisibleText : false,
        treeNodeHasPermission: false,
        renameFlag: false, // 是否为重命名
        inputKeyword:"",
        // true时显示根节点表单，false时显示章节表单
        formVisible: null,
        // zTree
        zTree: $.fn.zTree.getZTreeObj(this.ztreeId),
        // 当前节点的序号
        serial: '',
        IDMark_A: "_a",
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
            otherParam: { "pkgId": this.pkgId}
          },
          view: {
            selectedMulti: false,
            nameIsHTML: true, // 允许name支持html
            addDiyDom: this.addDiyDom,
            fontCss: this.setFontCss
          },
          edit: {
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
            onRightClick: this.onRightClick,//右键菜单
            beforeRename: this.beforeRename,
            beforeDrag: this.beforeDrag, // 节点被拖拽之前
            beforeDrop: this.beforeDrop, // 节点拖拽操作结束之前
            beforeDragOpen: this.beforeDragOpen, // 自动展开该父节点之前
            beforeClick: this.zTreeBeforeClick,
            onClick: this.zTreeOnClick, // 用于捕获节点被点击的事件回调函数
            onDblClick: this.zTreeOnDblClick // 用于捕获 zTree 上鼠标双击之后的事件回调函数
          }
        },
      }
    },
    methods: {

      /**
       * 生成默认章节
       */
      createDefaultChapter () {
        // 隐藏右键菜单
        this.hideRMenu()
        // 获取当前选中的节点对象
        let nodes = this.zTree.getSelectedNodes()
        let treeNode = nodes[0]
        if (!treeNode) {
          return false
        }
        let _this = this
        let formData = new FormData()
        formData.append('pkgId', this.pkgId)
        formData.append('chapterId', treeNode[this.idKey])
        confirm('确认一键生成默认节点吗？', () => {
          this.$api.resource.createDefaultChapter(formData).then(res => {
            toast(res.msg)
            if (res.code == 0) {
              // 获取父节点
              let parentNode = treeNode.getParentNode()
              //  更改有活动章节的图标
              if (parentNode.hasActivity) {
                parentNode.icon = 'static/image/activity_icon.png';
                parentNode.iconSkin = '33'
              }
              if (parentNode.children && parentNode.children.length > 0) {
                this.recursiveTree(parentNode.children);
              }
              // 强行异步加载父节点的子节点
              this.zTree.reAsyncChildNodes(parentNode, "refresh");
              setTimeout(() => {
                let node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode);
                this.zTree.selectNode(node)
                // 展开节点
                this.zTree.expandNode(node, true, true, true);
              }, 500)
            }
          })
        })
      },

      /**
       * 设置章节对学员不可见
       */
      setTraineesVisible () {
        // 隐藏右键菜单
        this.hideRMenu()
        // 获取当前选中的节点对象
        let nodes = this.zTree.getSelectedNodes()
        let treeNode = nodes[0]
        if (!treeNode) {
          return false
        }
        let _this = this
        let formData = new FormData()
        formData.append('pkgId', this.pkgId)
        formData.append('chapterId', treeNode[this.idKey])
        if ('N' === treeNode.isTraineesVisible) {
          formData.append('isTraineesVisible', 'Y')
          confirm('确认设置章节【' + treeNode[this.name] + '】以及其下所有子节点，对学员可见吗？', () => {
            this.$api.resource.setTraineesVisible(formData).then(res => {
              toast(res.msg)
              // 获取父节点
              let parentNode = treeNode.getParentNode()
              //  更改有活动章节的图标
              if (parentNode.hasActivity) {
                parentNode.icon = 'static/image/activity_icon.png';
                parentNode.iconSkin = '33'
              }
              if (parentNode.children && parentNode.children.length > 0) {
                this.recursiveTree(parentNode.children);
              }
              // 强行异步加载父节点的子节点
              //this.zTree.reAsyncChildNodes(parentNode, "refresh");
              let cNode = this.zTree.getNodeByParam('id', treeNode.subjectId);
              this.zTree.reAsyncChildNodes(cNode, "refresh");
              setTimeout(() => {
                let node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode);
                console.log('哈哈哈哈：', node)
                this.zTree.selectNode(node)
              }, 1500)
            })
          })
        } else {
          formData.append('isTraineesVisible', 'N')
          confirm('确认设置章节【' + treeNode[this.name] + '】以及其下所有子节点，对学员不可见吗？', () => {
            this.$api.resource.setTraineesVisible(formData).then(res => {
              toast(res.msg)
              // 获取父节点
              let parentNode = treeNode.getParentNode()
              //  更改有活动章节的图标
              if (parentNode.hasActivity) {
                parentNode.icon = 'static/image/activity_icon.png';
                parentNode.iconSkin = '33'
              }
              if (parentNode.children && parentNode.children.length > 0) {
                this.recursiveTree(parentNode.children);
              }
              // 强行异步加载父节点的子节点
              //this.zTree.reAsyncChildNodes(parentNode, "refresh"); // 不要删除先
              let cNode = this.zTree.getNodeByParam('id', treeNode.subjectId);
              this.zTree.reAsyncChildNodes(cNode, "refresh");
              setTimeout(() => {
                let node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode);
                this.zTree.selectNode(node)
              }, 500)
            })
          })
        }

      },

      /**
       * 用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
       */
      zTreeBeforeClick (treeId, treeNode, clickFlag){
        return true;//当是父节点 返回false 不让选取
      },

      /**
       * 用于捕获节点被点击的事件回调函数
       * 如果设置了 setting.callback.beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数。
       */
      zTreeOnClick (event, treeId, treeNode) {
        //this.doExpandNodeAccordion(treeNode)
      },

      /**
       * 用于捕获 zTree 上鼠标双击之后的事件回调函数
       * 如果设置了 setting.callback.beforeDblClick 方法，且返回 false，将无法触发 onDblClick 事件回调函数。
       */
      zTreeOnDblClick (event, treeId, treeNode) {
        this.doExpandNodeAccordion(treeNode)
      },

      // 手风琴模式
      doExpandNodeAccordion (treeNode) {
        if (!treeNode) {
          return false
        }
        // 找到当前同级的节点
        let nodes = this.zTree.getNodesByParam('level', treeNode.level, null);
        nodes.forEach(node => {
          if (node[this.idKey] != treeNode[this.idKey]) {
            if (node.open) {
              // 折叠同级中已经展开的节点
              this.zTree.expandNode(node, false , true, true);
            }
          }
        })
      },

      // 寻找根节点的id
      findRootId: function () {
        let rootNode = this.zTree.getNodesByParam('level', '0', null)
        if (rootNode[0]) {
          return rootNode[0].id
        } else {
          return null
        }
      },
      // 点击新增
      showLibraryForm: function () {
        this.formVisible = true
        this.$emit('showLibraryForm', {formVisible: this.formVisible, dataForm: 'null', rootId: this.findRootId()})
      },
      // 将数据传给父组件的公共数据
      commData: function (treeNode) {
        let jj = {
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
      onMouseDown: function (event, treeId, treeNode) {
        if (treeNode) {
          this.selectNode(treeNode.id);
        }
      },
      // 获取被选中节点的数据并将数据传给父组件
      selectNodeGetForm: function (data) {
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
              this.$emit('showLibraryForm', {treeNode: treeNode, type: 'subject', chapterId: treeNode.id, formVisible: this.formVisible, root: 'root', dataForm: data, rootId: this.findRootId()})
            } else {
              this.formVisible = false
              this.$emit('showLibraryForm', {treeNode: treeNode, chapterId: treeNode.id, formVisible: this.formVisible, dataForm: data, rootId: this.findRootId()})
            }
            return false
          }

          let obj={
            id:treeNode.id,
            pkgId:this.pkgId
          }
          if (treeNode.level === 0) {//treeNode.isParent
            this.formVisible = true // 根节点
            this.$emit('showLibraryForm', {treeNode: treeNode, type: 'subject', formVisible: this.formVisible, dataForm: data, root: 'root', rootId: this.findRootId()})
            /* // 目前业务需求貌似不需要，暂时注释
            this.$api.library.findDataView(obj).then((res) => {
              if (res.code === 0) {
                if (res.data) {
                  let data = res.data
                  this.$emit('showLibraryForm', {type: 'subject', formVisible: this.formVisible, dataForm: data, root: 'root', rootId: this.findRootId()})
                  let kk = this.commData(treeNode)
                  kk.subject = res.data.subject
                  kk.chapterContent = res.data.subject.subjectRemark
                  this.$emit('showLibraryRead', kk)

                }
              }
            })
            */
          } else {
            this.formVisible = false
            if (!this.isClassroomDetail) {
              obj.type = 'pkg'
            }
            this.$api.library.findDataDetailsContent(obj).then((res) => {
              if (res.data) {
                let data = res.data;
                let arr = {
                  chapterId: "c021b2e0dc324639b98cc5aaa477abba",
                  dictCode: "",
                  isCanCopy: "Y",
                  isTraineesVisible: "Y",
                  num: 0,
                  pkgId: "f9c5f47c7e7143688f34a1eec469696b",
                  resContent: "",
                  resId: "897ea4d19faa495f9976f44789e7b54b",
                  resgroupId: "6bfc8b379f51499e807859c5555fa4e6",
                  resgroupName: "回家撒返回酒店设计发货",
                  sortNum: 1,
                };
                this.$emit('showLibraryForm', {treeNode: treeNode, chapterId: treeNode.id, formVisible: this.formVisible, dataForm: data, rootId: this.findRootId()})
                let kk = this.commData(treeNode)
                kk.subject = res.data
                kk.chapterContent = res.data.chapterContent
                this.$emit('showLibraryRead', kk)
                /*loadingModal(false)*/
              }
            })
          }
        }

      },
      // 清除input
      clearFilterInput: function () {
        $('#keyword').val('')
        this.freshArea()
      },
      // 节点被拖拽之前 treeId :String:被拖拽的节点treeNodes 所在 zTree 的 treeId，便于用户操控
      // treeNodes  Array(JSON)  要被拖拽的节点 JSON 数据集合
      // 返回值是 true / false  如果返回 false，zTree 将终止拖拽
      beforeDrag: function (treeId, treeNodes) {
        return false
      },
      // 节点拖拽操作结束之前
      // treeNodes 被拖拽放开的目标节点 JSON 数据对象。  如果拖拽成为根节点，则 targetNode = null
      // moveType  String指定移动到目标节点的相对位置 "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
      // isCopy   Boolean 拖拽节点操作是 复制 或 移动  true：复制；false：移动
      // 返回值Boolean  返回值是 true / false  如果返回 false，zTree 将恢复被拖拽的节点
      beforeDrop: function (treeId, treeNodes, targetNode, moveType, isCopy) {
        return true
      },
      // 自动展开该父节点之前
      beforeDragOpen: function (treeId, treeNode) {
        return true
      },
      // 上下移
      moveTreeNode: function (moveType) {
        this.hideRMenu()
        let nodes = this.zTree.getSelectedNodes()
        let treeNode = nodes[0]
        let index = this.zTree.getNodeIndex(treeNode)
        let PreNode = treeNode.getPreNode()
        let NextNode = treeNode.getNextNode()
        if (nodes.length === 0) {
          toast('请先选择一个节点')
          return
        }
        if (moveType === 'prev') {
          if (PreNode) {
            this.$api.library.move({currId: treeNode.id, targetId: PreNode.id, pkgId: this.pkgId }).then((res) => {
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
                let parentNode = treeNode.getParentNode();
                //  更改有活动章节的图标
                if (parentNode.hasActivity) {
                  parentNode.icon = 'static/image/activity_icon.png';
                  parentNode.iconSkin = '33'
                }
                if (parentNode.children && parentNode.children.length > 0) {
                  this.recursiveTree(parentNode.children);
                }
                // 强行异步加载父节点的子节点
                this.zTree.reAsyncChildNodes(parentNode, "refresh");
                setTimeout(() => {
                  let node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode);
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
            this.$api.library.move({currId: treeNode.id, targetId: NextNode.id, pkgId: this.pkgId }).then((res) => {
              if (res.code === 0) {
                toast('下移成功')
                this.zTree.moveNode(NextNode, treeNode, 'next', false)
                // 获取父节点
                let parentNode = treeNode.getParentNode()
                //  更改有活动章节的图标
                if (parentNode.hasActivity) {
                  parentNode.icon = 'static/image/activity_icon.png';
                  parentNode.iconSkin = '33'
                }
                if (parentNode.children && parentNode.children.length > 0) {
                  this.recursiveTree(parentNode.children);
                }
                // 强行异步加载父节点的子节点
                this.zTree.reAsyncChildNodes(parentNode, "refresh");
                setTimeout(() => {
                  let node = this.zTree.getNodeByParam('id', treeNode.chapterId, parentNode);
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

      //递归树  改变有活动的章节的图标
      recursiveTree(value){
        for (let i = 0; i < value.length; i++) {
          if (value[i].hasActivity) {
            value[i].icon = 'static/image/activity_icon.png';
            value[i].iconSkin = '33'
          }
          if (value[i].children) {
            this.recursiveTree(value[i].children);
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
      beforeRename: function (treeId, treeNode, newName, isCancel) {
        // 隐藏右键菜单
        this.hideRMenu()
        // 获取父节点
        let parentNode = treeNode.getParentNode()
        if (parentNode.hasActivity) {
          parentNode.icon = 'static/image/activity_icon.png';
          parentNode.iconSkin = '33'
        }
        if (parentNode.children && parentNode.children.length > 0) {
          this.recursiveTree(parentNode.children);
        }
        // 默认为新增操作
        let isAdd = true
        // 如果取消了编辑,
        if (isCancel) {
          // 如果没有输入直接退出
          if (!treeNode.chapterId) {
            // 则移除该节点
            this.zTree.removeNode(treeNode)
            // 选中父节点
            setTimeout(() => {
              if (parentNode.children) {
                let node = parentNode.children[parentNode.children.length-1]
                this.zTree.selectNode(node)
                this.selectNodeGetForm(node) // 其它业务操作
              }
              //this.zTree.selectNode(parentNode)
            }, 500)
            //this.selectNodeGetForm(parentNode) // 其它业务操作
            isAdd = false
          } else {
            // TODO
            /*setTimeout(() => {
              treeNode.name = treeNode.chapterNameOld
              this.zTree.updateNode(treeNode)
            }, 300)*/
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(parentNode, "refresh");
            setTimeout(() => {
              let node = this.zTree.getNodeByParam("id", treeNode.chapterId, parentNode);
              // 重新选中选中被重命名的节点
              this.zTree.selectNode(node)
            }, 300)
          }
          return
        } else {
          // 非空判断
          if (newName.length === 0) {
            //toast('节点名称不能为空!')
            this.zTree.cancelEditName()
            return false
          }
        }
        // 构建传递给后台的数据
        let data = {
          pkgId: this.pkgId,
          subjectId: treeNode.subjectId,
          parentId: treeNode.parentId,
          chapterId: treeNode.chapterId,
          chapterName: newName,
        }
        // 触发http请求将数据传递给后台
        this.$api.library.saveChapter(data).then((res) => {
          if (res.code === 0) {
            toast(res.msg)
            // 如果是右键重命名进来的
            if (this.renameFlag) {
              //return false
            }
            // 后台返回新章节
            let chapterId = res.chapterId
            // 强行异步加载父节点的子节点
            this.zTree.reAsyncChildNodes(parentNode, "refresh");
            // 一种体验情况：重新选中父节点
            // this.zTree.selectNode(parentNode)
            // 另一个种体验情况：找到父节点的子节点，选中此新节点
            setTimeout(() => {
              // 获取节点
              let node = this.zTree.getNodeByParam('id', chapterId, parentNode);
              // 选中节点
              this.zTree.selectNode(node)
              this.selectNodeGetForm(node) // 其它业务操作
              // 如果是新增节点
              if (!data.chapterId) {
                // 再次构建一个新的节点
                let newNode = {name: '', chapterName: ''}
                newNode.pkgId = this.pkgId
                newNode.parentId = parentNode.id
                newNode.subjectId = this.findRootId()
                // 为父节点添加一个子节点
                let newNodes = this.zTree.addNodes(parentNode, newNode)
                // 设置新添加的这个节点为编辑状态
                this.zTree.editName(newNodes[0])
              }
            }, 500)
          } else {
            toast(res.msg)
            if (!data.chapterId) {
              // 则移除该节点
              this.zTree.removeNode(treeNode);
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
              this.zTree.reAsyncChildNodes(parentNode, "refresh");
              setTimeout(() => {
                let node = this.zTree.getNodeByParam("id", res.chapterId, parentNode);
                // 重新选中选中被重命名的节点
                this.zTree.selectNode(node)
              }, 500)
            }
          }
        })
      },
      // 新增节点
      addTreeNode: function () {
        // 隐藏右键菜单
        this.hideRMenu();
        // 找到父节点
        let treeNode = this.zTree.getSelectedNodes()[0];
        // 构建一个新节点
        let newNode = {name: '', chapterName: ''}
        if (treeNode) {
          newNode.pkgId = this.pkgId
          newNode.parentId = treeNode.id
          newNode.subjectId = this.findRootId()
          // 为父节点添加一个子节点
          let newNodes = this.zTree.addNodes(treeNode, newNode)
          // 设置新添加的这个节点为编辑状态
          this.zTree.editName(newNodes[0])
        }
      },
      // 使data对应的节点被选中
      selectNode: function (data) {
        let gg = this.zTree.getNodesByParam('id', data, null)
        this.zTree.selectNode(gg[0])
        this.selectNodeGetForm()
      },
      // 删除节点
      removeTreeNode: function () {
        this.hideRMenu()
        var nodes = this.zTree.getSelectedNodes()
        if (nodes.length === 0) {
          toast('请先选择一个节点')
          return
        }
        if (nodes && nodes.length > 0) {
          if (nodes[0].children && nodes[0].children.length > 0) {
            toast('该节点下面有子节点，不可删除！')
            return false
          } else {
            let that = this
            confirm('确认删除 节点 -- ' + nodes[0][this.name] + ' 吗？', () => {
              let jj = {id: nodes[0].id}
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
                  that.$emit('removeSucc', {remove: jj.type})
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
        }
      },
      // 重命名节点
      renameTreeNode: function () {
        this.renameFlag = true
        // 隐藏右键菜单
        this.hideRMenu()
        let nodes = this.zTree.getSelectedNodes()
        if (nodes.length === 0) {
          toast('请先选择一个节点')
          return false
        }
        let treeNode = nodes[0]
        if (treeNode.level === 0) {
          toast('课程点名称不能修改!')
          return false
        }
        // 去掉序号
        treeNode.chapterNameOld = treeNode.chapterName
        let i = treeNode.chapterName.indexOf(" ")
        if (i != 0) {
          treeNode.chapterName = treeNode.chapterName.substring(i+1, treeNode.chapterName.length)
        }
        this.zTree.editName(treeNode)
      },
      // 右键菜单
      onRightClick: function (event, treeId, treeNode) {
        // 如果是课堂主键，需要显示
        if (treeNode.isTeachingAssistant) {
          this.isShowRMenu = true
        }
        if(!this.isShowRMenu){
          return
        }
        this.treeNodeHasPermission = treeNode.hasPermission
        // 如果为创建者
        if (this.isCreator) {
          // 且节点没有权限，则不显示右键菜单
          if (!treeNode.hasPermission) {
            //return false
            this.isTraineesVisibleText = true;
          }
        } else { // 否则不是创建
          // 如果为共建者
          if (this.isTogetherBuild) {
            // 如果为课程节点
            if ('subject' == treeNode.type) {
              return false
            }
            // 且节点没有权限，则不显示右键菜单
            if (!treeNode.hasPermission) {
              //return false
              this.isTraineesVisibleText = true;
            }
          } else if (treeNode.isTeachingAssistant) { // 如果是课堂助教

          } else {
            // 否则是学员，直接不展示右键菜单
            return false
          }
        }
        // 另外一些处理
        this.handleCb(treeNode)
        // 核心
        let toBottomHeight = document.documentElement.clientHeight-event.clientY;
        if (!treeNode && event.target.tagName.toLowerCase() !== 'button' && $(event.target).parents('a').length === 0) {
          this.showRMenu('root', event.clientX+50, event.clientY+10, toBottomHeight);
        } else if (treeNode && !treeNode.noR) {
          this.showRMenu('node', event.clientX+50, event.clientY+10, toBottomHeight);
        }
      },

      /**
       * 右键菜单出现前的一些处理
       */
      handleCb (treeNode) {
        let ele = document.getElementById('rightMenuUl')
        if (!ele) {
          return false
        }
        this.setTraineesVisibleText(treeNode, ele);
        this.$nextTick(() => {
          let lis = ele.querySelectorAll('li')
          // 如果为课程节点，只显示新增
          if ('subject' == treeNode.type) {
            lis.forEach(item => {
              if ('m_add' !== item.id) {
                //ele.removeChild(item)
                item.style.display = 'none'
              }
            })
          } else {
            lis.forEach(item => {
              // 如果处于第三级，不显示新增节点
              if ('m_add' === item.id && 3 == treeNode.level) {
                item.style.display = 'none'
              } else {
                item.style.display = 'block'
              }
              // 如果当前节点处于第三级，不显示【生成】
              if ('m_create' == item.id) {
                if (3 == treeNode.level) {
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
      setTraineesVisibleText (treeNode, ele) {
        if (!treeNode) {
          return false
        }
        this.treeNodeHasPermission = treeNode.hasPermission
        if ('N' === treeNode.isTraineesVisible) {
          this.$nextTick(() => {
            if (ele) {
              let li = ele.querySelector('#m_set')
              if (li) {
                let span = li.querySelector('span')
                span.innerText = '设置为学员可见'
              }
            }
          })
        } else {
          this.$nextTick(() => {
            let ele = document.getElementById('rightMenuUl')
            if (ele) {
              let li = ele.querySelector('#m_set')
              if (li) {
                let span = li.querySelector('span')
                span.innerHTML = '设置为学员<a style="color: red;">不</a>可见'
              }
            }
          })

        }
      },

      // 显示右键菜单
      showRMenu: function (type, x, y, toBottomHeight) {
        x = x - 40
        $('#rMenu ul').show()
        let rMenuHeight = $("#rMenu ul").height();
        if (rMenuHeight < 240) {
          if (this.isClassroomDetail && !this.isTraineesVisibleText) {
            rMenuHeight = 280;
          }else if (this.isClassroomDetail && this.isTraineesVisibleText) {
            rMenuHeight = 40;
          }else{
            rMenuHeight = 240;
          }
        }
        this.isTraineesVisibleText = false;
        if (toBottomHeight < rMenuHeight) {
          $('#rMenu').css({'top': (y - rMenuHeight - 20) + 'px', 'left': x + 'px', 'visibility': 'visible'})
        }else{
          $('#rMenu').css({'top': y + 'px', 'left': x + 'px', 'visibility': 'visible'})
        }
        $('body').bind('mousedown', this.onBodyMouseDown)

        window.addEventListener('scroll', this.onBodyMouseDown);
      },
      // 隐藏右键菜单
      hideRMenu: function () {
        if ($('#rMenu')) $('#rMenu').css({'visibility': 'hidden'})
        $('body').unbind('mousedown', this.onBodyMouseDown)
        window.removeEventListener('scroll', this.onBodyMouseDown)
      },
      // 在空白处按下
      onBodyMouseDown: function (event) {
        if (!(event.target.id === 'rMenu' || $(event.target).parents('#rMenu').length > 0)) {
          $('#rMenu').css({'visibility': 'hidden'})
        }
      },
      // 取消节点选中状态
      cancelSelectedNode: function (data) {
        if (data) {
          this.zTree.cancelSelectedNode(data)
        } else {
          this.zTree.cancelSelectedNode()
        }
      },

      /**
       * 初始化树
       */
      freshArea: function () {
        $.fn.zTree.init($('#' + this.ztreeId), this.setting, this.zNodes)
        this.zTree = $.fn.zTree.getZTreeObj(this.ztreeId)
        let nodeAll = this.zTree.transformToArray(this.zTree.getNodes());
        // 初始化模糊搜索方法
        fuzzySearch(this.ztreeId, '#keyword', null, true)
        // 默认展开
        if (this.expandAll) {
          this.zTree.expandAll(true);
        } else {
          this.zTree.expandNode(nodeAll[0], true, false, true);
        }
      },
      /** 处理 返回的消息数据 */
      handleMessBackData: function (res) {
        let that = this
        if (res.busitypeIndexNew === 21 && !that.isCreator && !that.isFromBookshelf) { // 获取消息主界面列表数据
          if (res.code === 0) {
            if (res.data.msg.ctId && localStorage.getItem("ct_id") && localStorage.getItem("ct_id") === res.data.msg.ctId) {
              let nodes = this.zTree.getSelectedNodes()
              if(nodes && nodes[0] && nodes[0].id && res.data.msg.chapterId && nodes[0].id === res.data.msg.chapterId){
                let treeNode =  nodes[0]
                let obj={
                  id:treeNode.id,
                  pkgId:this.pkgId
                }
                this.$api.library.findDataDetailsContent(obj).then((res) => {
                  if (res.data) {
                    let data = res.data
                    this.$emit('showLibraryForm', {treeNode: treeNode, chapterId: treeNode.id, formVisible: this.formVisible, dataForm: data, rootId: this.findRootId()})
                    let kk = this.commData(treeNode)
                    kk.subject = res.data
                    kk.chapterContent = res.data.chapterContent
                    this.$emit('showLibraryRead', kk)
                    /*loadingModal(false)*/
                  }
                })
              }
            }

          }
        }
      },

      /**
       * 学员不可见章节的字体颜色
       */
      setFontCss(treeId, treeNode){
          return treeNode.isTraineesVisible === 'N' ? {color:"#bbbbbb"} : {};
      },

      /**
       * 用于在节点上固定显示用户自定义控件
       * @param treeId
       * @param treeNode
       */
      addDiyDom (treeId, treeNode) {
        if (this.isAuthorization) {
          let aObj = $("#" + treeNode.tId + this.IDMark_A);
          let editStr = "<span>--刘凯胃</span>";
          aObj.after(editStr);
          return false;
        }
        // 为根节点（课程节点）手动添加一个自定义控件
        if (treeNode.type == 'subject') {
          if (this.isClassroomDetail) {
            return false
          }
          if (!this.hasPermission) {
            return
          }
          if (!this.isCreator) {
            return
          }
          if (this.privateUse == 'Y') {
            return
          }
          /*if (!this.hasPermissionActual) {
            return
          }*/
          let aObj = $("#" + treeNode.tId + this.IDMark_A);
          let editStr = "<span class='demoIcon' id='diyBtn_" +treeNode[this.idKey]+ "' title='去授权' onfocus='this.blur();'><span class='button icon02'></span></span>";
          aObj.after(editStr);
          let btn = $("#diyBtn_"+treeNode[this.idKey]);
          // TODO 跳转至章节授权页面
          if (btn) btn.bind("click", () => {
            let data = {
              pkgId: this.pkgId,
              subjectId: treeNode.subjectId,
              isClassroomDetail: this.isClassroomDetail
            }
            localStorage.setItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB, this.pkgId)
            localStorage.setItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB, treeNode.subjectId)
            localStorage.setItem('isClassroomDetail', this.isClassroomDetail)
            if ('N' === this.$store.state.pkg.releaseStatus) {
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
          return
        } else {
          // 如果不是创建者，且是共建者，且不是课堂页面
          if (!this.isCreator && this.isTogetherBuild && treeNode.hasPermission && !this.isClassroomDetail) {
            let aObj = $("#" + treeNode.tId + this.IDMark_A);
            let editStr = "<span class='demoIcon' id='diyBtn_" +treeNode[this.idKey]+ "' title='已授权' onfocus='this.blur();'><span class='button hasPermission'></span></span>";
            aObj.after(editStr);
          }
        }
      },


    },
    watch: {
      // 监听树节点的变化更新树
      zNodes: function (val) {
        this.freshArea()
      }
    },
    created () {
      let that = this
      window.eventBus.$on('eventBusReceivedMsgData', function (data) {
        that.handleMessBackData(data)
      })
    },
    mounted () {
      this.freshArea()
      this.$nextTick(function () {
      })
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
