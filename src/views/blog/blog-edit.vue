<template>
  <div class="blog-edit">
    <!-- 顶部导航 -->
    <header-nav :current-index="4" class="header-nav"/>

    <div class="edit">
      <!-- 技术标签与标题的输入区域begin -->
      <div class="label-title-area">
        <!-- 标签输入 -->
        <el-select
          ref="blogLabels"
          v-model="labelValue"
          :remote-method="remoteMethod"
          :loading="loading"
          :multiple-limit="5"
          style="min-width: 40%;margin-right:30px;"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入博客涉及的技术标签"
          @change="changeLabelValue">
          <el-option
            v-for="item in options"
            :key="item.dictCode"
            :label="item.dictValue"
            :value="item.dictCode"/>
        </el-select>
        <!-- 标题输入 -->
        <el-input v-model="titleValue" placeholder="请输入标题" maxlength="50" show-word-limit/>
      </div>
      <!-- 技术标签与标题的输入区域end -->

      <!-- 博客内容输入区域begin -->
      <div class="blog-edit-area">
        <cb-editor :name="'blogEdit'" :data-form="dataForm" :height="500" :tool-str="toolStr" :is-edit-chapter="true"/>
      </div>
      <!-- 博客内容输入区域end -->

      <!-- 操作按钮区域begin -->
      <div class="btn-area">
        <el-button type="primary" size="small" style="width:10%;" @click="submitBlog">提交</el-button>
        <el-button size="small" style="width:10%;" @click="toBlog">返回</el-button>
      </div>
      <!-- 操作按钮区域end -->
    </div>

    <!-- 图片预览标签 begin -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="viewerImgSrc" alt>
    </div>
    <!-- 图片预览标签 end -->

  </div>
</template>

<script>
import headernav from '@/components/header-nav-study'
import CbEditor from '@/components/cb-editor'
import { toast } from '@/utils/global'
export default {
  name: 'BlogEdit',
  components: {
    'header-nav': headernav,
    'cb-editor': CbEditor
  },
  data() {
    return {
      viewerImgSrc: '', // 图片预览src
      loading: false,
      list: [],
      options: [],
      labelValue: [], // 输入的标签
      titleValue: '', // 标题
      dataForm: {},
      postId: '', // 博客id
      toolStr: 'undo redo styleselect formatselect fontselect fontsizeselect bold italic forecolor backcolor hr alignleft aligncenter alignright alignjustify numlist toc table wordcount searchreplace formatpainter removeformat image axupimgs link codesample preview fullscreen' // 编辑器的tabstr
    }
  },
  created() {
    this.getBlogTechnologyLabel()
  },
  mounted() {
    // $(".el-select__input").keyup(function(event){
    //     let a=$(".el-select__input").val();
    //     if(a.length > 5){
    //         $(".el-select__input").val($(".el-select__input").val().substr(0,5));
    //     }
    // })
    // 限制输入最大长度
    document.querySelector('.el-select__input').setAttribute('maxlength', 20)
    if (this.$route.query.id) {
      this.postId = this.$route.query.id
      localStorage.setItem('isEditBlog', true)
      this.getBlogInfo(this.postId)
    }
  },
  methods: {
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    // 标签的选中事件
    changeLabelValue(event) {
      this.$refs.blogLabels.query = ''
      this.$emit('changeLabelValue', event)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.dictValue.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = this.list
      }
    },
    // 获取所有博客技术
    getBlogTechnologyLabel() {
      this.$api.blog.getSubjectTypeList().then(res => {
        if (res.code === 0) {
          this.list = res.data.map(item => {
            return { dictCode: `${item.dictCode}`, dictValue: `${item.dictValue}` }
          })
          this.options = this.list
        } else {
          toast(res.msg)
        }
      })
    },
    // 查询博客信息
    getBlogInfo(value) {
      this.$api.blog.queryBlogDetails(value).then(res => {
        if (res.code === 0) {
          this.blogData = res.data[0]
          this.dataForm.resContent = res.data[0].content
          this.dataForm.resContentTogetherBuild = res.data[0].content
          this.dataForm.resId = value
          this.dataForm.blogEdit = res.data[0].content
          const arrTemp = res.data[0].label.split(',')
          arrTemp.forEach(item => {
            this.list.forEach(item2 => {
              if (item2.dictValue === item) {
                this.labelValue.push(item2.dictCode)
              }
            })
          })
          this.titleValue = res.data[0].title
          if (tinyMCE.editors['blogEdit']) {
            tinyMCE.editors['blogEdit'].setContent(res.data[0].content)
          }
        } else {
          toast(res.msg)
        }
      })
    },
    // 回到博客主页面
    toBlog() {
      this.$router.push('/blog')
    },
    // 提交博客
    submitBlog() {
      // 必填参数判断
      if (!this.dataForm.blogEdit || this.dataForm.blogEdit === '' || this.titleValue === '' || this.labelValue.length <= 0) {
        toast('博客的技术标签、标题、内容不能为空')
        return
      }
      if (this.titleValue && this.titleValue.length > 50) {
        toast('标题过长！请自行调整')
        return false
      }
      const obj = {
        'dictCode': this.labelValue.join(','),
        'postTitle': this.titleValue,
        'postContent': this.dataForm.blogEdit,
        'postId': this.postId
      }
      this.$api.blog.writeBlogInfo(obj).then(res => {
        if (res.code === 0) {
          this.toBlog()
        }
        toast(res.msg)
      })
    },
    // 计算字符串的字符长度
    countCharLength(value) {
      let charLen = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
          charLen += 2
        } else {
          charLen++
        }
      }
      return charLen
    }
  }
}
</script>

<style scoped>
    .edit{
        width: 1200px;
        margin: 20px auto 40px;
        background-color: #ffffff;
        padding: 0 30px 30px;
    }
    /* 标签标题输入区域样式 */
    .label-title-area{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    /* 按钮区域样式 */
    .btn-area{
        padding-top: 30px;
        text-align: right;
    }
</style>
