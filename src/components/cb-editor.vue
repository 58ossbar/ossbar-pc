<!--
  示例
      <cb-editor name="traineeStoryInfo" :dataForm="dataForm" height='200'></cb-editor>
      注意
      dataForm: [Object]新增表单时必传，固定写法
      name：[String]与JavaBean字段一致，dataForm固定写法，不要改变。
      height：[Int]编辑器内容区的高度，可选参数，默认值为：300,值为0时表示随内容自适应高度
      readonly: [Boolean]是否只读，默认为false
      toolbar：[Boolean]是否显示工具栏，默认为true
  默认支持新增、修改及表单校验，不需要额外做处理，如需特殊处理参考以下方法(name为标签上的name属性值保持一致)
      获取内容：tinyMCE.editors['name'].getContent();
      填充内容：tinyMCE.editors['name'].setContent();
 -->
 <!-- 富文本编辑器组件 -->

<!-- 图片预览标签 -->
<template>
  <div>
    <textarea :id="name" :name="name" v-model="editorData"/>
    <!-- 编辑器内容导航 -->
    <ul v-if="tocList && tocList.length > 0" :style="customContentNavigationStyle" :class="['resConNavWrap', customContentNavigationClass]" @mousedown="mousedownClick" @mouseup="mouseupClick">
      <li v-for="(item0, index0) in tocList" :key="index0" :class="[isCurrIndex == index0? 'resConNavItemSelected' : '']" @click="toClickAnchorPoint(item0, index0)">{{ item0.innerText }}</li>
    </ul>

    <!-- <el-tabs v-if="tocList && tocList.length > 0" v-model="isCurrIndex" tab-position="right" class="resConNavWrap">
      <el-tab-pane v-for="(item0, index0) in tocList" :key="index0" :label="item0.innerText" :name="index0+''" />
    </el-tabs> -->
  </div>

  <!-- <div class="accessory-viewer" v-viewer style="display: none;">
    <img  :src="viewerImgSrc" alt>
  </div> -->
</template>

<script>
import $ from '../assets/jquery-vendor'
import tinyMCE from 'tinymce/tinymce'
import 'tinymce/themes/mobile/theme'
import 'tinymce/themes/silver/theme'
import editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/formatpainter'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/media'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/code'
// import 'tinymce/plugins/codesample'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autoresize'
import { baseUrl, alert, loadingModal } from '@/utils/global'

export default {
  name: 'CbEditor',
  components: {
    editor
  },
  props: {
    name: {
      type: String,
      default: null
    },
    dataForm: {
      type: Object,
      default: () => {}
    },
    height: {
      type: String | Number,
      default: null
    },
    readonly: {
      type: String,
      default: 'false'
    },
    closeRight: {
      type: Boolean,
      default: false
    },
    mediaIsPreview: {
      type: String,
      default: 'false'
    },
    toolbar: {
      type: String,
      default: 'true'
    },
    // 工具栏中是否显示图片上传按钮
    showImageButton: {
      type: Boolean,
      default: true,
      required: false
    },
    // 编辑框是否只读
    editReadOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    editStart: {
      type: Boolean,
      default: true,
      required: false
    },
    isEditChapter: {
      type: Boolean,
      default: false,
      required: false
    },
    // 编辑框是否只读
    isCopy: {
      type: Boolean,
      default: false,
      required: false
    },
    // 工具栏中是否显示视频上传按钮
    showMediaButton: {
      type: Boolean,
      default: true,
      required: false
    },
    // 自定义工具栏
    toolStr: {
      type: String,
      default: '',
      required: false
    },
    pagesFrom: { //  是在哪里也没
      type: String,
      default: ''
    },
    teachingExtraInfo: { // 章节id
      type: Object,
      default: () => {}
    },
    // 编辑器内容 是否需要 内容导航
    isNeedContentNavigation: {
      type: Boolean,
      default: false
    },
    // 自定义 内容导航 样式
    customContentNavigationClass: {
      type: String,
      default: ''
    },
    // 自定义 内容导航 样式
    customContentNavigationStyle: {
      type: String,
      default: ''
    },
    // 编辑器 是否显示保存按钮
    isShowSaveChapterBtn: {
      type: Boolean,
      default: false
    }
  }, // 继承父组件中的name, dataForm属性，拓展功能请在此配置
  data() {
    return {
      codesample_languages: [ // 编辑器 codesample 语言选择数组
        {
          text: 'HTML/XML',
          value: 'markup'
        },
        {
          text: 'JavaScript',
          value: 'javascript'
        },
        {
          text: 'CSS',
          value: 'css'
        },
        {
          text: 'PHP',
          value: 'php'
        },
        {
          text: 'Ruby',
          value: 'ruby'
        },
        {
          text: 'Python',
          value: 'python'
        },
        {
          text: 'Java',
          value: 'java'
        },
        {
          text: 'C',
          value: 'c'
        },
        {
          text: 'C#',
          value: 'csharp'
        },
        {
          text: 'C++',
          value: 'cpp'
        }
      ],
      isCurrIndex: 0, // 当前选择的数组下标
      tocList: [], // 锚点数组
      viewerImgSrc: '', // 图片预览src
      editorData: this.dataForm[this.name] || '',
      errerMsg: '',
      isEditReadOnly: true,
      isHeight: true,
      timer: '',
      audioOrVideoIds: {}
    }
  },
  computed: {
    propDateWatchs() {
      const { isNeedContentNavigation, dataForm } = this
      return {
        isNeedContentNavigation,
        dataForm
      }
    }
  },
  watch: {
    'propDateWatchs': {
      handler(newVal, oldVal) {
        this.tocList = []
        if (newVal.isNeedContentNavigation) {
          this.titleAddAnchorPoint()
        }
      },
      deep: true
    },
    dataForm: function(n, o) {
      this.tocList = []
      if (n[this.name]) {
        this.judgeChapterIsEnded()
        this.audioOrVideoIds = {}
        const obj = n[this.name]
        tinyMCE.editors[this.name].setContent(obj)
        tinyMCE.editors[this.name].undoManager.clear()

        this.$nextTick(() => {
          if (this.$el.querySelector('#resContent_ifr')) {
            // console.log('editer初始化结束后执行------scrollTop', this.$el.querySelector("#resContent_ifr").contentWindow)
            // this.$el.querySelector("#resContent_ifr").scrollTop = 0;

            // iframe.contentWindow.window.scrollTo(0,0);
            // this.$el.querySelector("#resContent_ifr").scrollIntoView() // .scrollTop = 0;
            // this.$el.querySelector("#resContent_ifr").scrollIntoView() // .scrollTop = 0;
            // this.$el.querySelector("#resContent_ifr").scrollTo(0,0)

            this.$el.querySelector('#resContent_ifr').contentWindow.scrollTo(0, 0)
          }
          if (this.$el.querySelector('#resContentTogetherBuild_ifr')) {
            this.$el.querySelector('#resContentTogetherBuild_ifr').contentWindow.scrollTo(0, 0)
          }

          const preList = tinyMCE.activeEditor.getBody().querySelectorAll('pre')
          preList.forEach(item => {
            item.addEventListener('dblclick', function(e) {
              e.stopPropagation()
              e.preventDefault()
              return
            })
          })
        })
        this.titleAddAnchorPoint()
      }
      // if (!this.isEditChapter){
      //   if (tinymce.activeEditor.getBody()) {
      //     tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
      //   }
      //   this.isEditReadOnly = false;
      // }
    }
  },
  mounted() {
    // tinymce.PluginManager.add("formatpainter", function (editor, url) {
    //   editor.ui.registry.addButton("formatpainter", {
    //       title: '格式刷',
    //       icon: ' el-icon-s-open',
    //       onclick: function(){
    //         editor.settings.formatpainterCallback(function(r){
    //             console.log('inserting image to editor: '+ r);
    //         });
    //       },
    //   })
    // });
    const toolStr = (this.toolStr) ? (this.toolStr) : ('undo redo styleselect formatselect fontselect fontsizeselect bold italic forecolor backcolor hr alignleft aligncenter alignright alignjustify ' +
      ' bullist numlist toc table wordcount searchreplace formatpainter bdmap axupimgs removeformat ' + (this.showImageButton ? 'image' : '') + (this.showMediaButton ? ' media ' : '') + 'link codesample preview fullscreen previousChapter nextChapter' + (this.isShowSaveChapterBtn ? ' saveChapter' : ''))
    // 如果该ID的编辑器存在，则先销毁
    if (tinyMCE.editors[this.name]) {
      tinyMCE.execCommand('mceRemoveEditor', true, this.name)
    }
    const comp = this
    // 初始化富文本编辑器
    // eslint-disable-next-line no-undef
    tinymce.init({
      target: document.getElementById(this.name),
      language: 'zh_CN', // 中文语言
      language_url: 'static/creatorblue/tinymce/zh_CN.js', // 语言路径
      skin_url: 'static/creatorblue/tinymce/skins/ui/oxide', // 皮肤路径
      content_css: 'static/creatorblue/tinymce/prism.css',
      emoticons_database_url: 'static/creatorblue/tinymce/emoticons/emojis.js',
      // eslint-disable-next-line eqeqeq
      contextmenu: ((this.mediaIsPreview == 'true' || this.closeRight) ? '' : 'link image inserttable | cell row column deletetable'), // 右键菜单显示列表
      codesample_content_css: 'static/creatorblue/tinymce/prism.css',
      plugin_preview_width: '900', // 预览框宽度
      plugin_preview_height: '600', // 预览框高度
      plugins: // 加载插件
        // eslint-disable-next-line eqeqeq
        'advlist link lists image axupimgs formatpainter ' + (this.mediaIsPreview == 'true' ? '' : 'table') + ' wordcount bdmap preview colorpicker toc textcolor searchreplace wordcount ' + (this.mediaIsPreview == 'true' ? '' : 'contextmenu') + ' media paste fullscreen ' + 'codesample' + ' autoresize hr emoticons',
      toc_depth: 6, // 目录深度
      indentation: '2em', // 设置缩进工具的缩进大小
      menubar: false, // 菜单栏
      statusbar: false, // 状态栏
      branding: false, // 去水印
      default_link_target: '_blank',
      // paste_auto_cleanup_on_paste : true,
      // paste_remove_styles: true,
      // paste_remove_styles_if_webkit: true,
      // paste_strip_class_attributes: true,
      // media_is_preview: this.mediaIsPreview == 'true',
      // eslint-disable-next-line eqeqeq
      readonly: this.readonly == 'true',
      content_style: (this.isCopy ? 'p{overflow: scroll;}' : 'p,h1,h2,h3,h4,h5,div{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow: scroll;}') +
                      '::-webkit-scrollbar{width: 3px;height: 5px;}' +
                      '::-webkit-scrollbar-track-piece{-webkit-border-radius: 6px;}' +
                      '::-webkit-scrollbar-thumb:vertical{height: 5px;background-color: rgba(125, 125, 125, 0.7);-webkit-border-radius: 6px;}' +
                      '::-webkit-scrollbar-thumb:horizontal{width: 3px;background-color: rgba(125, 125, 125, 0.7);-webkit-border-radius: 6px;}' +
                      'audio.mce-object{border: none !important;background-color: #fff !important;}' +
                      'audio::-webkit-media-controls-enclosure{background-color: #f2f2f2 !important;border-radius: 5px !important;}' +
                      "audio::-webkit-media-controls-panel{background: #f2f2f2 url('/static/image/musrc.png') !important;}" +
                      'audio::-internal-media-controls-overflow-button{display: none !important;}' +
                      '.mce-object[data-mce-object="audio"]{background: #D5D5D5 url(/static/image/audio.png) no-repeat center !important;}' +
                      'body, td, pre{position: relative;outline: none !important;font: 14px/1.5 "PingFang SC","微软雅黑","Microsoft YaHei","Helvetica","Helvetica Neue","Tahoma","Arial,sans-serif";}' +
                      '.pre-select-languages-wrap{text-align: right;}' +
                      '.btn-pre-copy{display: none;background-color: red;color: #ffffff;position: absolute;right:30px;font-size:13px;height:30px;line-height: 30px;width:80px;text-align: center;cursor: pointer;text-shadow: none;font-weight: bolder;}' + // -webkit-user-select:none !important;;-moz-user-select:none !important;;-ms-user-select:none !important;;user-select:none !important;;
                      'table{border-collapse: collapse !important;}' +
                      '.btn-pre-copy:hover{background-color: rgb(248, 98, 98);}' +
                      'pre:hover .btn-pre-copy{display: block;}' +
                      '.mce-shim{display:none !important;}' +
                      // 'ul li{list-style:none !important;}' +
                      // eslint-disable-next-line eqeqeq
                      (this.mediaIsPreview == 'true' ? '.mce-resizehandle{display:none !important;}' : ''),
      min_height: this.height || '300px', // 默认高度设置为300
      max_height: this.height || '2000px', // 默认最高高度设置为2000

      // autoresize_min_height: this.height || '300px',//默认高度设置为300
      // autoresize_max_height: this.height || '2000px', //默认最高高度设置为2000

      codesample_global_prismjs: true,
      autoresize_bottom_margin: 1,
      toolbar: // 工具栏中的项目
        // eslint-disable-next-line eqeqeq
        this.toolbar == 'true' ? toolStr : false,
      fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px', // 字体大小
      font_formats: '宋体=宋体;黑体=黑体;仿宋_GB2312=仿宋_GB2312;楷体_GB2312=楷体_GB2312;隶书=隶书;幼圆=幼圆;微软雅黑=microsoft yahei;',
      formats: {
        removeformat: [
          {
            selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
            remove: 'all',
            split: true,
            block_expand: true,
            expand: false,
            deep: true
          },
          { selector: 'span', attributes: ['style', 'class'], remove: 'empty', split: true, expand: false, deep: true },
          { selector: '*', attributes: ['style', 'class'], split: false, expand: false, deep: true }
        ]
      },
      style_formats: [
        {
          title: '首行缩进',
          block: 'p',
          styles: { 'text-indent': '2em' }
        },
        {
          title: '行高',
          items: [
            { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
            { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
            { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
            { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
            { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
          ]
        }
      ],
      external_plugins: {
        'codesample': '/static/creatorblue/tinymce/codesample/plugin.js',
        'bdmap': '/static/creatorblue/tinymce/bdmap/plugin.min.js',
        'axupimgs': '/static/creatorblue/tinymce/axupimgs/plugin.min.js',
        'powerpaste': '/static/creatorblue/tinymce/powerpaste/plugin.min.js'
      },
      paste_data_images: true, // 支持直接粘贴图片
      images_upload_url: baseUrl + 'cbeditor/uploadImg', // 图片粘贴拖拽的上传服务地址
      images_upload_handler: function(blobInfo, success, failure) {
        comp.editorUploadFile(success, baseUrl + 'cbeditor/uploadImg', blobInfo.blob())
      },
      // toolbar_sticky: true,
      images_upload_credentials: true, // 跨域
      // 多图上传
      // images_upload_handler: function (blobInfo, succFun, failFun) {
      //     var xhr, formData;
      //     var file = blobInfo.blob();//转化为易于理解的file对象
      //     xhr = new XMLHttpRequest();
      //     xhr.withCredentials = false;
      //     xhr.open('POST', '/demo/upimg2.php');
      //     xhr.onload = function() {
      //         var json;
      //         if (xhr.status != 200) {
      //             failFun('HTTP Error: ' + xhr.status);
      //             return;
      //         }
      //         json = JSON.parse(xhr.responseText);
      //         if (!json || typeof json.location != 'string') {
      //             failFun('Invalid JSON: ' + xhr.responseText);
      //             return;
      //         }
      //         succFun(json.location);
      //     };
      //     formData = new FormData();
      //     formData.append('file', file, file.name );
      //     xhr.send(formData);
      // },
      file_picker_types: 'file image media', // 普通附件，图片，视频
      convert_urls: false,
      init_instance_callback: function() { // 初始化结束后执行
        // if ('true' === comp.mediaIsPreview){
        //   if (tinymce.activeEditor.getBody()) {
        //     tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
        //   }
        //   comp.isEditReadOnly = false;
        // }
        // eslint-disable-next-line yoda
        if ('true' === comp.mediaIsPreview) {
          // eslint-disable-next-line no-undef
          if (tinymce.activeEditor.getBody()) {
            // eslint-disable-next-line no-undef
            tinymce.activeEditor.getBody().setAttribute('contenteditable', false)
          }
          this.isEditReadOnly = false
        }
        // let a=tinymce.activeEditor.getBody().innerHTML;
        // tinymce.activeEditor.getBody().innerHTML=a.replace(/\ufeff/g,'');

        // let domScript = document.createElement('script');
        // domScript.src = 'src/assets/prism.js';
        // domScript.type = 'text/javascript';
        // domScript.onload = domScript.onreadystatechange = function() {
        //   if (!comp.readyState || comp.readyState === "loaded" || comp.readyState === "complete" ) {
        //       domScript.onload = domScript.onreadystatechange = null;
        //   }
        // };
        // tinymce.activeEditor.getBody().parentElement.querySelector('head').appendChild(domScript);
      },
      // 粘贴事件
      paste_preprocess: function(plugin, args) {
        // 解决编辑器粘贴的a标签在内部打开问题
        const div = document.createElement('div')
        div.innerHTML = args.content
        const aList = div.querySelectorAll('a')
        aList.forEach(item => {
          item.setAttribute('target', '_blank')
        })
        const imgList = div.querySelectorAll('img')
        imgList.forEach(item => {
          item.style.width = '800px'
        })
        args.content = div.innerHTML
        // 解决非编辑状态可粘贴内容问题
        if (comp.editReadOnly) {
          if (comp.dataForm[comp.name]) {
            tinyMCE.editors[comp.name].setContent(comp.dataForm[comp.name])
          }
          args.content = ''
        }
      },
      file_picker_callback: function(cb, value, meta) {
        // 创建一个隐藏的type=file的文件选择input
        const input = document.createElement('input')
        let url = ''
        input.setAttribute('type', 'file')
        if (meta.filetype === 'image') {
          url = baseUrl + 'cbeditor/uploadImg'
          input.setAttribute('accept', 'image/jpeg,image/gif,image/jpg,image/png')
        } else if (meta.filetype === 'media') {
          url = baseUrl + 'cbeditor/uploadMedia'
          input.setAttribute('accept', 'video/*,audio/*')
        } else if (meta.filetype === 'file') {
          url = baseUrl + 'cbeditor/uploadFile'
          // input.setAttribute('accept', 'aplication/zip, aplication/rar, application/vnd.ms-excel, text/plain, application/vnd.ms-powerpoint, application/msword')
        }
        input.onchange = function() {
          const file = this.files[0] // 只选取第一个文件。如果要选取全部，后面注意做修改
          comp.editorUploadFile(cb, url, file)
        }
        // 触发点击
        input.click()
      },
      setup: function(editor) {
        editor.ui.registry.addIcon('el-icon-d-arrow-left', '<i class="el-icon-d-arrow-left"></i>')
        editor.ui.registry.addIcon('el-icon-d-arrow-right', '<i class="el-icon-d-arrow-right"></i>')
        // 添加自定义按钮
        editor.ui.registry.addButton('previousChapter', {
          // 按钮名
          text: '',
          tooltip: '上一分组',
          // 是否显示图标
          icon: 'el-icon-d-arrow-left',
          // onclick事件
          onAction: function() {
            comp.$parent.chaptersSwitch(false)
          }
        })
        editor.ui.registry.addButton('nextChapter', {
          // 按钮名
          text: '',
          tooltip: '下一分组',
          // 是否显示图标
          icon: 'el-icon-d-arrow-right',
          // onclick事件
          onAction: function() {
            if (comp.$parent) {
              comp.$parent.chaptersSwitch(true)
            }
          }
        })
        editor.ui.registry.addIcon('el-icon-s-platform', '<i class="el-icon-s-platform"></i>')
        editor.ui.registry.addButton('saveChapter', {
          // 按钮名
          text: '保存',
          tooltip: '保存课程内容',
          // 是否显示图标
          icon: 'el-icon-s-platform',
          // onclick事件
          onAction: function() {
            // if (comp.$parent) {
            //   comp.$parent.handleSaveResource()
            // }
            if (comp.$parent && comp.$parent.handleSaveResource && (typeof (comp.$parent.handleSaveResource) === 'function')) {
              comp.$parent.handleSaveResource()
            }
          }
        })

        // 鼠标移入事件
        editor.on('mouseover', function(e) {
          comp.judgeChapterIsEnded()
          if (e.path[0].tagName === 'AUDIO' || e.path[0].tagName === 'VIDEO') {
            // console.log('移入了audio')
            // eslint-disable-next-line no-empty
            if (comp.audioOrVideoIds[e.path[0].id]) {
            } else {
              comp.audioOrVideoIds[e.path[0].id] = true
              // 监听 音频 或者 视频的 自然播放结束 事件
              e.path[0].addEventListener('ended', function() {
                // console.log('e.path[0].attributes22', e.path[0].attributes.id.value)
                comp.$emit('audioOrVideoEnded', { attributes: e.path[0].attributes, tagName: e.path[0].tagName })
                // audio_or_video   {id: e.path[0].id, class: e.path[0].className , attributes: e.path[0].attributes }
              }, false)
            }
          }
          // eslint-disable-next-line yoda
          if (e.path[0].tagName === 'PRE' && 'true' === comp.mediaIsPreview) {
            if (e.path[0].innerHTML.indexOf('<span class="btn-pre-copy"') === -1) {
              const btn = $("<span class='btn-pre-copy'>复制代码</span>")
              btn.prependTo(e.path[0])
            }
            e.path[0].querySelector('.btn-pre-copy').addEventListener('click', function() {
              // 执行复制
              const btn = $(this)
              const pre = btn.parent()
              // 为了实现复制功能。新增一个临时的textarea节点。使用他来复制内容
              const temp = $('<textarea></textarea>')
              // 避免复制内容时把按钮文字也复制进去。先临时置空
              btn.text('')
              temp.text(pre.text())
              temp.appendTo($('body'))
              temp[0].select()
              document.execCommand('Copy')
              temp[0].remove()
              // 修改按钮名
              btn.text('复制成功')
              // 一定时间后吧按钮名改回来
              setTimeout(() => {
                btn.text('复制代码')
              }, 1500)
            })
          }

          // eslint-disable-next-line eqeqeq
          // if (e.path[0].tagName === 'PRE' && comp.mediaIsPreview != 'true') { // 编辑 出现 选择语音 下拉选择
          //   if (e.path[0].innerHTML.indexOf('<div class="pre-select-languages-wrap"><select') === -1) {
          //     let selectStr = '<div class="pre-select-languages-wrap"><select class="pre-select-languages" contentEditable="true">'
          //     const code = ((e.path[0]).className.match(/language-(\w+)/)) ? ((e.path[0]).className.match(/language-(\w+)/)[1]) : (comp.codesample_languages[0].value)
          //     for (let i = 0; i < comp.codesample_languages.length; i++) {
          //       selectStr = selectStr + '<option ' + (comp.codesample_languages[i].value === code ? 'selected' : '') + ' value="' + comp.codesample_languages[i].value + '">' + comp.codesample_languages[i].text + '</option>'
          //     }
          //     selectStr = selectStr + '</select></div>'

          //     $(e.path[0]).append(selectStr)
          //   }
          //   e.path[0].querySelector('.pre-select-languages').addEventListener('change', function() {
          //     e.path[0].className = 'language-' + $(this).val()
          //   })
          // }
        })

        // 监听编辑器双击事件
        editor.on('dblclick', function(e) {
          // && 'true' === comp.mediaIsPreview
          if ((e.path[0].tagName === 'IMG')) { // 图片双击预览
            if (comp.$parent && comp.$parent.editorPreViewImg && (typeof (comp.$parent.editorPreViewImg) === 'function')) {
              comp.$parent.editorPreViewImg(e.path[0].src)
            }
          }
        })
        // editor.on('mouseout', function(e){
        //   if (e.path[0].tagName === 'PRE') {
        //     e.path[0].removeChild(e.path[0].querySelector(".btn-pre-copy"))
        //   }
        // })
        // 设置默认配置
        editor.on('init', function(e) {
          this.getBody().style.fontFamily = 'microsoft yahei'
          this.getBody().style.lineHeight = '1.5'
          // 监听滚动事件
          editor.getWin().addEventListener('scroll', function(event) {
            const scrollTop = event.target.scrollingElement.scrollTop
            if (comp.tocList && comp.tocList.length > 0) {
              for (let i = 0; i < comp.tocList.length; i++) {
                const next = ((i + 1) < comp.tocList.length) ? (i + 1) : i
                // 滚动条 滚动时 锚点列表 选中
                if (scrollTop < comp.tocList[next].offsetTop) {
                  comp.isCurrIndex = i
                  break
                }
              }
            }
          })

          // 设置 iframe的 宽和高 属性
          document.querySelector('.tox-edit-area__iframe').width = document.querySelector('.tox-edit-area__iframe').parentNode.offsetWidth
          document.querySelector('.tox-edit-area__iframe').height = document.querySelector('.tox-edit-area__iframe').parentNode.offsetHeight
          document.querySelector('.tox-edit-area__iframe')[document.domain] = 'budaos'
        })
        // 监听编辑器全屏事件
        editor.on('FullscreenStateChanged', function(e) {
          if (e.state) {
            // eslint-disable-next-line no-undef
            tinymce.activeEditor.getBody().style.padding = '0 5%'
            document.querySelector('.tox-toolbar__primary').style.padding = '0 5%'
            // eslint-disable-next-line no-undef
            tinymce.addI18n('zh_CN', { 'Fullscreen': '\u9000\u51fa\u5168\u5c4f' })
            // $(".mce-i-fullscreen").addClass("bi bi-fullscreen-exit")
            // $(".mce-i-fullscreen").removeClass("mce-i-fullscreen")
          } else {
            // eslint-disable-next-line no-undef
            tinymce.activeEditor.getBody().style.padding = '0'
            document.querySelector('.tox-toolbar__primary').style.padding = '0'
            // eslint-disable-next-line no-undef
            tinymce.addI18n('zh_CN', { 'Fullscreen': '\u5168\u5c4f' })
            // $(".bi-fullscreen-exit").addClass("mce-i-fullscreen")
            // $(".bi-fullscreen-exit").removeClass("bi bi-fullscreen-exit")
          }
        })

        // 监听编辑器单击事件
        editor.on('click', function(e) {
          // let a=tinymce.activeEditor.getBody().parentElement.innerHTML;
          // tinymce.activeEditor.getBody().parentElement.innerHTML=a.replace(/\ufeff/g,'')
          // eslint-disable-next-line yoda
          if ((e.path[0].tagName === 'PRE' || e.path[0].tagName === 'TD') && 'true' === comp.mediaIsPreview) {
            e.preventDefault()
            return false
          }
        })

        editor.on('mouseup', function(e) {
          if (!comp.isEditReadOnly) {
            // eslint-disable-next-line no-undef
            var a = tinymce.activeEditor.getBody().innerHTML
            // eslint-disable-next-line no-undef
            tinymce.activeEditor.getBody().innerHTML = a.replace(/\ufeff/g, '')

            // let height = tinymce.activeEditor.getBody().scrollHeight
            // tinymce.activeEditor.getBody().scrollTop = 0
            // document.querySelector("#resContent_ifr").scrollTop = 0
            // document.querySelector("#resContentTogetherBuild_ifr").scrollTop = 0

            // comp.$nextTick(() => {
            //   if (comp.$el.querySelector("#resContent_ifr")) {
            //       comp.$el.querySelector("#resContent_ifr").contentWindow.scrollTo(0,0)
            //   }
            //   if (comp.$el.querySelector("#resContentTogetherBuild_ifr")) {
            //     comp.$el.querySelector("#resContentTogetherBuild_ifr").contentWindow.scrollTo(0,0)
            //   }
            // })
            // comp.isHeight = false
          }
        })

        editor.on('input change undo redo execCommand KeyUp', function(e) {
          // if (comp.editReadOnly) {
          //   editor.setContent(comp.dataForm[comp.name]);
          //   let arrTemp = tinymce.activeEditor.getBody().querySelectorAll("p");
          //   for (let index = 0; index < arrTemp.length; index++) {
          //     arrTemp[index].setAttribute('contenteditable', false);
          //   }
          if (comp.editReadOnly && e.code && (e.code === 'Delete' || e.code === 'Backspace')) {
            e.preventDefault()
            return false
          }
          comp.dataForm[comp.name] = editor.getContent()
          comp.$emit('editorback', { name: comp.name, data: comp.dataForm[comp.name] })

          comp.titleAddAnchorPoint()
        })
        editor.on('keyDown', function(e) {
          if (comp.mediaIsPreview !== 'true' && e.code && (e.code === 'Backspace') && (e.path[0].tagName === 'VIDEO' || e.path[0].tagName === 'AUDIO')) {
            e.path[0].remove()
          }
          if (comp.editReadOnly && e.code && (e.code === 'Delete' || e.code === 'Backspace')) {
            e.preventDefault()
            return false
          }
          // Ctrl+s保存内容
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            // 阻止默认事件
            e.preventDefault()
            // ctrl+s保存
            comp.$emit('ctrlS', e, { name: comp.name })
          }
          if (e && e.key && e.key === 'Tab') { // 按tab键缩进
            if (e.shiftKey) {
              const currElement = editor.selection.getSelectedBlocks()
              if (editor.dom.getStyle(currElement, 'text-indent')) {
                if (parseInt(editor.dom.getStyle(currElement, 'text-indent')) === 2) {
                  let style = editor.dom.getAttrib(currElement, 'style')
                  style = style.replace(/text-indent:[\s]*2em;/ig, '')
                  editor.dom.setAttrib(currElement, 'style', style)
                } else {
                  const num = parseInt(editor.dom.getStyle(currElement, 'text-indent')) - 2
                  editor.dom.setStyle(currElement, 'text-indent', num + 'em')
                }
              }

              // editor.execCommand('Outdent')
            } else {
              const currElement = editor.selection.getSelectedBlocks()
              let num = 2
              if (editor.dom.getStyle(currElement, 'text-indent')) {
                num = parseInt(editor.dom.getStyle(currElement, 'text-indent')) + 2
              }
              editor.dom.setStyle(currElement, 'text-indent', num + 'em')

              // editor.execCommand('Indent')
            }
            e.preventDefault()
            e.stopPropagation()
          }
        })
        editor.on('focus', function(e) {
          comp.$emit('editorfocusback', { name: comp.name })
          comp.titleAddAnchorPoint()
        })
        editor.on('blur', function(e) {
          comp.$emit('editorblurback', { name: comp.name })
          const parent = editor.iframeElement.parentElement.parentElement.parentElement.parentElement.parentElement

          if (editor.getContent()) {
            const ele = parent.querySelector('.el-form-item__error')
            if (ele) {
              this.errerMsg = ele
              // parent.querySelector(".mce-tinymce").style.borderColor = '#67C23A'
              ele.remove()
            }
          } else {
            // parent.querySelector(".mce-tinymce").style.borderColor = '#F56C6C'
            if (this.errerMsg) {
              parent.append(this.errerMsg)
            }
          }
        })
      }
    })
    setTimeout(() => {
      this.tocList = []
      if (this.dataForm[this.name]) {
        this.judgeChapterIsEnded()
        this.audioOrVideoIds = {}
        tinyMCE.editors[this.name].setContent(this.dataForm[this.name])
        // 去掉双击代码块的编辑事件
        const preList = tinyMCE.activeEditor.getBody().querySelectorAll('pre')
        preList.forEach(item => {
          item.addEventListener('dblclick', function(e) {
            e.stopPropagation()
            e.preventDefault()
            return
          })
        })
        this.titleAddAnchorPoint()
      }
    }, 800)

    // if (!this.$parent.$el.querySelector('.accessory-viewer')) {
    //   let viewerStr = $(' <div class="accessory-viewer" v-viewer style="display: none;"><img src="" class="accessory-viewer-img" alt></div>')
    //  this.$parent.$el.appendChild(viewerStr[0])
    // }

    // eslint-disable-next-line eqeqeq
    if (!this.editReadOnly && this.mediaIsPreview == 'false') {
      // const that = this
      // this.timer = setInterval(function() {
      //   if (that.$parent && that.$parent.automaticHandleSaveResource && (typeof (that.$parent.automaticHandleSaveResource) === 'function')) {
      //     that.$parent.automaticHandleSaveResource()
      //   }
      // }, 5000)
    }
    // window.onresize = (event) => {
    //   if (comp.isNeedContentNavigation && comp.tocList && comp.tocList.length > 0) {
    //     comp.$nextTick(() => {
    //       console.log('2222.offsetLeft', document.querySelector('.resConNavWrap').offsetLeft)
    //       console.log(' document.body.clientWidth', document.body.clientWidth)
    //       const odiv = document.querySelector('.resConNavWrap')
    //       let boxLeft = odiv.offsetLeft
    //       let boxTop = odiv.offsetTop
    //       if (boxLeft < 0) {
    //         boxLeft = 0
    //       } else if (boxLeft > document.body.clientWidth - odiv.offsetWidth) {
    //         // 如果拖拽 元素定位的数值 高于 （页面可视宽 - 拖拽元素自身宽 ）（可视页面最大宽）
    //         boxLeft = document.body.clientWidth - odiv.offsetWidth
    //       }

    //       if (boxTop < 0) {
    //         boxTop = 0
    //       } else if (boxTop > document.body.clientWidth - odiv.offsetHeight) {
    //         // 如果拖拽 元素定位的数值 高于 （页面可视高 - 拖拽元素自身高 ）（可视页面最大高）
    //         boxTop = document.body.clientWidth - odiv.offsetHeight
    //       }
    //       odiv.style.left = boxLeft + 'px'
    //       odiv.style.top = boxTop + 'px'
    //     })
    //   }
    // }
  },
  beforeDestroy() {
    // eslint-disable-next-line eqeqeq
    if (!this.editReadOnly && this.mediaIsPreview == 'false') {
      clearInterval(this.timer)
    }
  },
  methods: {
    /** 监听鼠标 按下事件 */
    mousedownClick: function(event) {
      // 获取目标元素
      // let odiv = event.target
      const odiv = document.querySelector('.resConNavWrap')
      // 算出鼠标相对元素的位置 鼠标点击坐标距离 盒子 左/上 边缘的距离
      // offsetLeft/offsetTop(元素相对于最近定位父级元素的坐标，若在所有的父级上都没有定位，则相对于整个文档)
      const disX = event.clientX - odiv.offsetLeft
      const disY = event.clientY - odiv.offsetTop
      // document.onselectstart = function() { return false; }; // 解决拖动会选中文字的问题
      // 鼠标按下并移动的事件
      document.body.onmousemove = (e) => {
        // 移动时，鼠标距离当前窗口x轴坐标 - 鼠标在拖拽元素的坐标 = 剩下距离body的 x轴 坐标
        // 把这个 数值 设置为 拖拽元素的 left、top
        let boxLeft = e.clientX - disX
        let boxTop = e.clientY - disY
        // 获取 body 的页面可视 宽高
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        // 限制拖拽宽高
        if (boxLeft < 0) {
          boxLeft = 0
        } else if (boxLeft > clientWidth - odiv.offsetWidth) {
          // 如果拖拽 元素定位的数值 高于 （页面可视宽 - 拖拽元素自身宽 ）（可视页面最大宽）
          boxLeft = clientWidth - odiv.offsetWidth
        }

        if (boxTop < 0) {
          boxTop = 0
        } else if (boxTop > clientHeight - odiv.offsetHeight) {
          // 如果拖拽 元素定位的数值 高于 （页面可视高 - 拖拽元素自身高 ）（可视页面最大高）
          boxTop = clientHeight - odiv.offsetHeight
        }

        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 移动当前元素
        odiv.style.left = boxLeft + 'px'
        odiv.style.top = boxTop + 'px'

        // const bodyScreenX = e.screenX
        // const bodyClientWidth = document.body.clientWidth
        // document.onmouseup = (ev) => {
        //   if (ev.clientX - disX < 0) {
        //     odiv.style.left = 0
        //   } else if (bodyScreenX > bodyClientWidth) {
        //     odiv.style.right = 0
        //     odiv.style.left = bodyClientWidth - 100 + 'px'
        //   }
        //   document.onmousemove = null
        //   document.onmouseup = null
        // }
      }
    },
    /** 监听 鼠标抬起 触发事件 */
    mouseupClick: function() {
      // 将body的移动事件 取消
      document.body.onmousemove = null
    },
    /** 内容导航 点击 跳到 对应锚点所在位置 */
    toClickAnchorPoint: function(item, index) {
      this.isCurrIndex = index
      item.scrollIntoView()
      // tinyMCE.activeEditor.getBody().querySelector(item.id).scrollIntoView()
    },
    /** 给 tagName  添加 id */
    titleAddId: function(tagName, idName) {
      const hList = tinyMCE.activeEditor.dom.select(tagName)
      // console.log('hList', hList)
      if (hList && hList.length > 0) {
        for (let i = 0; i < hList.length; i++) {
          // 如果 有内容 并且 没有id 或者 id 没有包含 idName
          if (hList[i].innerText && hList[i].innerText !== 'br' && hList[i].innerText.trim() !== '' && (!hList[i].id || (hList[i].id && hList[i].id.indexOf(idName) < 0))) {
            const AllList = tinyMCE.activeEditor.dom.select('[id^="' + idName + '"]')
            // console.log('AllList', AllList)
            // 属性 添加 id
            tinyMCE.activeEditor.dom.setAttrib(hList[i], 'id', idName + '_' + (AllList.length + 1))
          }
        }
      }
    },
    /** 标题 添加锚点 */
    titleAddAnchorPoint: function() {
      if (!this.isNeedContentNavigation) {
        return false
      }
      // console.log('this.teachingExtraInfo', this.teachingExtraInfo)
      const idName = 'resConNav_' + this.teachingExtraInfo.chapterId

      const list = tinyMCE.activeEditor.dom.select('[id^="' + idName + '"]')
      if (list && list.length > 0) {
        for (let i = (list.length - 1); i >= 0; i--) {
          // 当 设置为标题 的标签 后面修改成段落后， 删除该标签上的 id 中包含 idName的部分
          if (list[i].localName !== 'h1' && list[i].localName !== 'h2' && list[i].localName !== 'h3' && list[i].localName !== 'h4' && list[i].localName !== 'h5' && list[i].localName !== 'h6') {
            const ids = (list[i].id).split(' ')
            ids.splice(ids.indexOf(idName), 1)
            tinyMCE.activeEditor.dom.setAttrib(list[i], 'id', ids.join(' '))
          }
        }
      }

      this.titleAddId('h1', idName)
      this.titleAddId('h2', idName)
      this.titleAddId('h3', idName)
      this.titleAddId('h4', idName)
      this.titleAddId('h5', idName)
      this.titleAddId('h6', idName)
      this.tocList = tinyMCE.activeEditor.dom.select('[id^="' + idName + '"]')
      // console.log('this.tocList', this.tocList)
    },
    // 查找body
    findBody: function(ele) {
      if (ele.parentElement === document.getElementsByTagName('body')[0]) {
        return ele.parentElement
      } else {
        this.findBody(ele.parentElement)
      }
    },

    editorUploadFile: function(cb, url, file) {
      // let comp = this

      loadingModal(true)
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.withCredentials = true
      xhr.upload.onprogress = function(e) {
        // 进度(e.loaded / e.total * 100)
        // let percent = e.loaded / e.total * 100
      }
      xhr.onerror = function() {
        // 上传失败
        loadingModal(false)
        return
      }
      xhr.onload = function() {
        if (xhr.status < 200 || xhr.status >= 300) {
          /* console.log('HTTP 错误: ' + xhr.status)*/
          loadingModal(false)
          return
        }
        const json = JSON.parse(xhr.responseText)
        if (json && json.code === 0) {
          loadingModal(false)
          // 接口返回的文件保存地址
          const mediaLocation = json.location
          // cb()回调函数，将mediaLocation显示在弹框输入框中
          const cbObj = {
            title: file.name,
            fileName: file.name,
            id: json.fileId + '',
            readId: json.fileId + '',
            class: 'audio_or_video'
          }
          // if (comp.teachingExtraInfo && JSON.stringify(comp.teachingExtraInfo) !== '{}') {
          //   for(let key in comp.teachingExtraInfo) {
          //     cbObj[key] = comp.teachingExtraInfo[key]
          //   }
          // }
          cb(baseUrl + mediaLocation, cbObj)
        } else {
          loadingModal(false)
          alert(json.msg)
          /* console.log(json.msg)*/
          return
        }
      }
      const formData = new FormData()
      // 假设接口接收参数为file,值为选中的文件
      formData.append('file', file)
      // 正式使用将下面被注释的内容恢复
      xhr.send(formData)
    },
    /** 判断 章节 是否滚动到 内容的 最底部 */
    judgeChapterIsEnded: function() {
      const comp = this
      // tinymce.activeEditor.getBody()
      // comp.$el.querySelector("#resContent_ifr").clientHeight
      // comp.$el.querySelector("#resContent_ifr").contentWindow.document.documentElement
      if (comp.$el.querySelector('#resContent_ifr')) {
        const scrollHeight = comp.$el.querySelector('#resContent_ifr').contentWindow.document.documentElement.scrollHeight // 3064
        const clientHeight = comp.$el.querySelector('#resContent_ifr').clientHeight //  527
        const scrollTo = comp.$el.querySelector('#resContent_ifr').contentWindow.scrollY //
        // let scrollWidth = comp.$el.querySelector('#resContent_ifr').contentWindow.document.documentElement.scrollWidth
        // const clientWidth = comp.$el.querySelector('#resContent_ifr').clientWidth
        // const clientWidth2 = comp.$el.querySelector('#resContent_ifr').contentWindow.document.documentElement.clientWidth
        const clientHeight2 = comp.$el.querySelector('#resContent_ifr').contentWindow.document.documentElement.clientHeight
        const scrollbarHeight = clientHeight - clientHeight2 // 滚动条的 高度
        // let scrollbarWidth = clientWidth - clientWidth2 // 滚动条  的 宽度
        // eslint-disable-next-line eqeqeq
        if ((+scrollTo) - scrollbarHeight + (+clientHeight) == (+scrollHeight)) {
          // console.log('滚动到最底下')
          comp.$emit('chapterReadEnded')
        }
      }
    }
  }
  // template: '<div><textarea :id="name" :name="name" v-model="editorData"></textarea></div>'
}

</script>

<style scoped>
  .boxSizing{
    box-sizing: border-box;
  }
  .resConNavWrap{
    position: fixed;
    top:180px;/* 教学包是188，我学的课时180 */
    left:calc(((100vw - 1200px) / 2 + 1200px + 5px));
    z-index:999;
    /* min-width:70px; */
    /* min-height:300px; */
    /* font-size: 14px; */
    /* text-align: center; */
/*  border-radius: 5px; */
    background-color: #fff;
    /* padding: 10px 0; */
    box-shadow: 0 0px 13px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    box-sizing: border-box;
    /* min-width: 50px;
    max-width: 200px; */
    width: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
  .resConNavWrap li{
    text-align: left;
    cursor: pointer;
    padding: 8px 15px;
    box-sizing: border-box;
    word-break: break-all;
  }
  .resConNavWrap li:hover,
  .resConNavWrap .resConNavItemSelected{
    color: #007bff;
  }
  .resConNavWrap .resConNavItemSelected{
    position: relative;
  }
  .resConNavWrap .resConNavItemSelected::after{
    content: '';
    position: absolute;
    left: 0px;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #007bff;
  }
  /* .mce-toc{
    position: fixed;
    right: 5px;
    top: 0;
    height: 50vh;
    width: 20%;
    overflow: auto;
  } */
</style>
