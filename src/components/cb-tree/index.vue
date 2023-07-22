<!-- 下拉树选择组件 -->
<template>
  <!--普通树-->
  <div v-if="!type" class="ztreeLibrary">
    <!--搜索区域 begin -->
    <div v-if="hasSearch" class="d-flex search">
      <div class="input-group input-group-sm mb-1 input-group-width-ztree ">
        <!-- <input v-model="inputKeyword" id="keyword" type="text" class="form-control" placeholder="输入关键字搜索"> -->
        <el-input
          id="keyword"
          v-model="inputKeyword"
          placeholder="输入关键字搜索"
          size="small"/>
      </div>
    </div>
    <!--搜索区域 end -->
    <ul :id="id" :style="'overflow-y: scroll;height:' + height" class="ztree"/>
  </div>
  <!--下拉树-->
  <div v-else-if="type == 'select'" class="ztreeLibrary">
    <el-input
      :class="(disabled || zNodes.length == 0) ? 'select-tree-disabled' : 'select-tree'"
      :id="'cb-select-tree-input'+ id"
      :placeholder="disabled ? '未选择' : ((zNodes == null || zNodes.length == 0) ? '暂无数据' : '请选择章节')"
      :disabled="disabled"
      type="text"
      readonly
      value=""
      @click.prevent.native="showMenu"/>
    <div id="menuContent" class="menuContent">
      <ul :id="id" class="ztree"/>
    </div>
  </div>
</template>

<!--
      示例
      <cb-tree type="select"
         :z-nodes="zNodes"
         id-key="chapterId"
         p-id-key="parentId"
         name="chapterName"
         width="50"
         :defaultValue="chapterId"
         :disabled="disabledSelectTree"
         :check="true"
         @onclick="onclick"
      ></cb-tree>
-->

<script>
import { fuzzySearch } from '@/utils/global'
export default {
  name: 'CbTree',
  components: {},
  props: {
    // 是否显示搜索框
    hasSearch: {
      type: Boolean,
      default: false,
      required: false
    },
    parentVue: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    },
    type: {
      type: String,
      default: '',
      required: false
    },
    // 同页面有多个树的话，用以区别
    id: {
      type: String,
      default: 'cbTree',
      required: false
    },
    // 默认值
    defaultValue: {
      type: String,
      default: '',
      required: false
    },
    width: {
      type: String | Number,
      default: () => {
        return '500px'
      },
      required: false
    },
    height: {
      type: String | Number,
      default: () => {
        return 'calc(100% - 36px)'
      },
      required: false
    },
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    zNodes: {
      type: Array,
      default: () => [],
      required: true
    },
    // 节点数据中保存唯一标识的属性名称
    idKey: {
      type: String,
      default: 'id',
      required: false
    },
    // 节点数据中保存其父节点唯一标识的属性名称
    pIdKey: {
      type: String,
      default: 'parentId',
      required: false
    },
    // zTree 节点数据保存节点名称的属性名称
    name: {
      type: String,
      default: 'name',
      required: false
    },
    // 是否禁选
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否多选
    isMultiple: {
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
    // 展开 / 折叠 全部节点
    expandAll: {
      type: Boolean,
      default: false,
      required: false
    },
    // 需要展开的级别
    expandLevel: {
      type: String | Number,
      default: 1,
      required: false
    },
    setting: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    // 在点击文本时，是否也勾选节点
    labelCheck: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      inputKeyword: '',
      // 全局对象
      ztree: {},
      zTreeObj: {}
      // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
      /* setting: {
        check: {
          autoCheckTrigger: false,
          enable: this.check
        },
        data: {
          keep: {},
          key: {
            checked: 'checked', // zTree 节点数据中保存 check 状态的属性名称。
            children: 'children', // zTree 节点数据中保存子节点数据的属性名称。
            isParent: 'isParent', // zTree 节点数据保存节点是否为父节点的属性名称。
            isHidden: 'isHidden', // zTree 节点数据保存节点是否隐藏的属性名称。
            name: this.name || 'name', // zTree 节点数据保存节点名称的属性名称。
            title: '',
            url: 'url', // zTree 节点数据保存节点链接的目标 URL 的属性名称。特殊用途：当后台数据只能生成 url 属性，又不想实现点击节点跳转的功能时，可以直接修改此属性为其他不存在的属性名称
          },
          // 确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
          // 不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式
          simpleData: {
            enable: false,
            idKey: this.idKey || 'id',
            pIdKey: this.pIdKey || 'parentId',
            rootPId: null,
          },
        },
        callback: {
          beforeClick: this.beforeClick,
          onClick: this.onClick,
          onCheck: this.onCheck
        }
      },*/
    }
  },
  computed: {},
  watch: {
    defaultValue(newValue, oldValue) {
      var nodes = this.ztree.getNodesByParam(this.idKey, this.defaultValue, null)
      if (nodes[0]) {
        const inputElement = document.querySelector('#cb-select-tree-input' + this.id)
        inputElement.setAttribute('value', nodes[0][this.name])
      }
    },
    zNodes(newValue, oldValue) {
      this.initTreeData()
    }
  },
  created() {},
  mounted() {
    this.initTreeData()
  },
  updated() {},
  destroyed() {},
  methods: {
    /**
     * 初始化zTree
     */
    initTreeData() {
      if (!this.setting.check) {
        this.setting.check = {
          autoCheckTrigger: false,
          enable: this.check
        }
      }
      if (!this.setting.data) {
        this.setting.data = {}
        if (!this.setting.data.keep) {
          //
        }
        if (!this.setting.data.key) {
          this.setting.data.key = {
            checked: 'checked', // zTree 节点数据中保存 check 状态的属性名称。
            children: 'children', // zTree 节点数据中保存子节点数据的属性名称。
            isParent: 'isParent', // zTree 节点数据保存节点是否为父节点的属性名称。
            isHidden: 'isHidden', // zTree 节点数据保存节点是否隐藏的属性名称。
            name: this.name || 'name', // zTree 节点数据保存节点名称的属性名称。
            title: '',
            url: 'url' // zTree 节点数据保存节点链接的目标 URL 的属性名称。特殊用途：当后台数据只能生成 url 属性，又不想实现点击节点跳转的功能时，可以直接修改此属性为其他不存在的属性名称
          }
        }
        if (!this.setting.data.key) {
          // 确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
          // 不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式
          this.setting.data.simpleData = {
            enable: false,
            idKey: this.idKey || 'id',
            pIdKey: this.pIdKey || 'parentId',
            rootPId: null
          }
        }
      }
      // 事件
      if (!this.setting.callback) {
        this.setting.callback = {
          beforeClick: this.beforeClick,
          onClick: this.onClick,
          onCheck: this.onCheck
        }
      }
      // eslint-disable-next-line no-undef
      $.fn.zTree.init($('#' + this.id), this.setting, this.zNodes)
      // eslint-disable-next-line no-undef
      this.ztree = $.fn.zTree.getZTreeObj(this.id)
      // this.ztree.refresh();
      // this.$refs[this.id]  = $.fn.zTree.getZTreeObj(this.id)

      if (this.hasSearch) {
        // 初始化模糊搜索方法
        fuzzySearch(this.id, '#keyword', null, true)
      }

      // select模式下默认选中的值
      if (this.defaultValue) {
        var nodes = this.ztree.getNodesByParam(this.idKey, this.defaultValue, null)
        if (nodes[0]) {
          const inputElement = document.querySelector('#cb-select-tree-input' + this.id)
          inputElement.setAttribute('value', nodes[0][this.name])
        }
      }
      // 展开 / 折叠 全部节点
      if (this.expandAll) {
        this.ztree.expandAll(true)
      } else {
        // eslint-disable-next-line no-undef
        const treeObj = $.fn.zTree.getZTreeObj(this.id)
        const nodes = treeObj.getNodes()
        this.initDefaultExpandNodes(nodes, 1)
      }
    },

    initDefaultExpandNodes(nodes, level) {
      // eslint-disable-next-line eqeqeq
      if (this.expandLevel == 0 || this.expandLevel == '0' || this.expandAll) {
        return false
      }
      for (let i = 0; i < nodes.length; i++) {
        this.ztree.expandNode(nodes[i])
        if (this.expandLevel > level) {
          const children = nodes[i].children
          // eslint-disable-next-line eqeqeq
          if (children != null && children.length > 0 && children != undefined) {
            this.initDefaultExpandNodes(children, level + 1)
          }
        }
      }
    },

    // 显示下拉树
    showMenu() {
      if (this.disabled) {
        return false
      }
      // eslint-disable-next-line eqeqeq
      if (!this.zNodes || this.zNodes.length == 0) {
        return false
      }
      // eslint-disable-next-line no-undef
      const inputElement = $('#cb-select-tree-input' + this.id)
      // eslint-disable-next-line no-undef
      const cityOffset = $('#cb-select-tree-input' + this.id).offset()

      if (this.type === 'select') {
        // eslint-disable-next-line no-undef
        $('#menuContent').slideDown('fast')
      } else {
        // eslint-disable-next-line no-undef
        $('#menuContent').css({ top: (cityOffset.top - 130) + inputElement.outerHeight() + 'px' }).slideDown('fast')
      }

      // $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + inputElement.outerHeight() + "px"}).slideDown("fast");
      // 绑定事件
      // eslint-disable-next-line no-undef
      $('body').bind('mousedown', this.onBodyDown)
    },

    /**
     * 鼠标按下
     * @param event
     */
    onBodyDown(event) {
      if (!(event.target.id == 'cb-select-tree-input' + this.id || event.target.id == 'menuContent' || $(event.target).parents('#menuContent').length > 0)) {
        this.hideMenu()
      }
    },

    // 隐藏下拉树
    hideMenu() {
      // eslint-disable-next-line no-undef
      $('#menuContent').fadeOut('fast')
      // 解绑
      // eslint-disable-next-line no-undef
      $('body').unbind('mousedown', this.onBodyDown)
    },

    /**
     * 用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
     * @param treeId
     * @param treeNode
     */
    beforeClick(treeId, treeNode) {
      if (this.disabled) {
        return false
      }
      /* if (treeNode.type == 'subject') {
        return false
      }*/
    },

    /**
     * 用于捕获节点被点击的事件回调函数
     * 如果设置了 setting.callback.beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数。
     * @param e
     * @param treeId
     * @param treeNode
     */
    onClick(e, treeId, treeNode) {
      let v = ''
      if (this.isMultiple) { // 多选
        const nodes = this.ztree.getSelectedNodes()
        for (var i = 0, l = nodes.length; i < l; i++) {
          v += nodes[i][this.name] + ','
        }
        if (v.length > 0) v = v.substring(0, v.length - 1)
        this.$emit('onclick', treeNode, nodes, this.isMultiple)
      } else { // 单选
        v = treeNode[this.name]
        // this.$emit(this.value, treeNode[this.idKey])
        // 传递当前选中的节点给父组件
        this.$emit('onclick', treeNode, null, this.isMultiple)
      }
      // eslint-disable-next-line no-undef
      var inputElement = $('#cb-select-tree-input' + this.id)
      inputElement.attr('value', v)
      if (this.check && this.labelCheck) {
        // 已选中后再点击则是取消选中
        if (treeNode.checked) {
          this.ztree.checkNode(treeNode, false, true)
        } else {
          this.ztree.checkNode(treeNode, true, true)
        }
      }
    },

    /**
     * 用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数
       如果设置了 setting.callback.beforeCheck 方法，且返回 false，将无法触发 onCheck 事件回调函数。
        默认值：null
      * @param event
      * @param treeId
      * @param treeNode
      */
    onCheck(event, treeId, treeNode) {
      this.$emit('onCheck', event, treeId, treeNode, this.ztree)
    }

  }
}
</script>

<style scoped>
.ztreeLibrary{
  height: 100%;
}

  .select-tree {
    cursor: pointer;
    background-color: #FFFFFF;
  }
  .select-tree-disabled {
    background-color: #ececec;
  }

  .menuContent {
    background-color: #ececec;
    display: none;
    position: absolute;
    max-height: 300px;
    overflow-y: scroll;
  }
  .active {
    display: block;
  }

  .ztree {
    border: 1px solid #ced4da;
  }

  .ztree li span.button.roots_docu{
    visibility: hidden !important;
    width: 1px;
  }

  .ztree li span.button.roots_docu::before {
    content: none  !important;
}
  /* .ztree li.level0 span.button.switch.level0 {
    visibility:hidden !important;
     width:1px;
  } */
/* .ztree li ul.level0 {
  padding:0;
  background:none;
  } */
/* .ztree li ul */

</style>
