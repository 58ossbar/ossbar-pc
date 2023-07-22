<template>
  <div class="blog-read">
    <!-- 顶部导航 -->
    <header-nav :current-index="4" class="header-nav"/>

    <div class="content">
      <!-- 左侧个人基本信息显示begin -->
      <div class="left-user">
        <!-- 头像加昵称、简介 -->
        <div class="header-name">
          <!-- 头像 -->
          <div class="header-left">
            <el-avatar :src="blogData.blogHead" :size="60" class="header-img"/>
          </div>
          <!-- 详情 -->
          <div class="details">
            <!-- 昵称 -->
            <div class="name text-ellipsis">
              {{ blogData.blogName }}
            </div>
            <!-- 简介 -->
            <div class="details-content">
              {{ blogData.blogRemark || '这个人很懒，啥也没留下' }}
            </div>
          </div>
        </div>
        <!-- 原创、性别等资料显示 -->
        <div class="basic-info">
          <!-- 性别 -->
          <div class="basic-content">
            <div>
              {{ blogData.sex }}
            </div>
            <div>
              性别
            </div>
          </div>
          <!-- 原创 -->
          <div class="basic-content">
            <div>
              {{ blogData.blogsNum | numFilter }}
            </div>
            <div>
              原创
            </div>
          </div>
          <!-- 粉丝 -->
          <div class="basic-content">
            <div>
              {{ blogData.fansNum | numFilter }}
            </div>
            <div>
              粉丝
            </div>
          </div>
          <!-- 关注 -->
          <div class="basic-content">
            <div>
              {{ blogData.followNum | numFilter }}
            </div>
            <div>
              关注
            </div>
          </div>
          <!-- 收藏 -->
          <div class="basic-content">
            <div>
              {{ blogData.storeNum | numFilter }}
            </div>
            <div>
              收藏
            </div>
          </div>
        </div>
        <!-- 关注按钮 -->
        <div v-if="!blogData.isCreator" class="attention-btn">
          <el-button v-if="!blogData.isFollow" type="danger" round style="width:50%;" size="small" @click="followBlog">关注</el-button>
          <el-button v-if="blogData.isFollow" type="info" round style="width:50%;" size="small" @click="followBlog">已关注</el-button>
        </div>
      </div>
      <!-- 左侧个人基本信息显示end -->

      <!-- 右侧博客内容显示begin -->
      <div class="right-blog">
        <!-- 博客内容 -->
        <div class="blog-content">
          <!-- 标题 -->
          <div class="content-title">
            <div class="title">
              <!-- 标题 -->
              <div>{{ blogData.title }}</div>
              <!-- 涉及的技术 -->
              <span v-for="(item, index) in blogTabs" :key="index" :title="item" class="title-tabs">{{ item }}</span>
            </div>
            <div class="operation">
              <div>
                <!-- 时间 -->
                <span>{{ blogData.postTime }}</span>
                <!-- 查看 -->
                <span><i class="el-icon-view"/> {{ blogData.viewNum | numFilter }}</span>
                <!-- 评论 -->
                <span><i class="el-icon-chat-dot-round"/> {{ blogData.replyNum | numFilter }}</span>
                <!-- 点赞 -->
                <span><i class="el-icon-magic-stick"/> {{ blogData.likeNum | numFilter }}</span>
              </div>
              <div class="operation-list">
                <!-- 点赞 -->
                <span @click="likeBlog"><span v-if="!blogData.isThumbsUp"><i class="el-icon-magic-stick"/>点赞</span><span v-if="blogData.isThumbsUp" style="color: red;"><i class="el-icon-magic-stick"/>已赞</span></span>
                <!-- 收藏 -->
                <span @click="collectBlog"><span v-if="!blogData.isCollect"><i class="el-icon-star-off"/>收藏</span><span v-if="blogData.isCollect" style="color: red;"><i class="el-icon-star-off"/>已收藏</span></span>
                <!-- 分享 -->
                <span @click="shareLinks"><i class="el-icon-position"/>分享链接</span>
                <!-- 举报 -->
                <!-- <span><i class="el-icon-warning-outline"></i>举报</span> -->
              </div>

            </div>
          </div>
          <!-- 内容 -->
          <div class="content-info">
            <cb-editor :data-form="blogContentData" :height="'100%'" :media-is-preview="'true'" :is-copy="true" name="blogContent"/>
          </div>
        </div>
        <!-- 讨论 -->
        <div class="blog-discuss">
          <!-- 评论的编辑 -->
          <div class="discuss-edit">
            <!-- 富文本编辑器 -->
            <div class="edit-text">
              <cb-editor :data-form="commentData" :height="200" :tool-str="toolStr" :is-edit-chapter="true" :close-right="true" name="comment"/>
            </div>
            <!-- 发表按钮 -->
            <div class="edit-btn">
              <el-button type="primary" @click="handleComment()">发表评论</el-button>
            </div>
          </div>
          <!-- 所有评论的显示 -->
          <div class="discuss-content">
            <div v-for="(item, index) in commentList" :key="index" class="user-discuss">
              <!-- 评论的信息 -->
              <div class="discuss-info">
                <!-- 头像 -->
                <div>
                  <el-avatar :src="item.trainee_pic" :size="30" class="header-img"/>
                </div>
                <!-- 姓名 -->
                <div class="info-name">{{ item.trainee_name }}:</div>
                <!-- 内容 -->
                <div class="info-reply" v-html="item.ci_content"/>
              </div>
              <!-- 评论的操作 -->
              <div class="discuss-operation">
                <!-- 时间 -->
                <span>{{ item.ci_time }}</span>
                <!-- 回复 -->
                <span @click="handleReply(item.ci_id)"><i class="el-icon-chat-dot-round"/>回复({{ item.ci_total }})</span>
                <!-- 点赞 -->
                <span :style="item.isCommentLike ? 'color:red;':''" @click="handleLike(item.ci_id),!item.isCommentLike ? item.ci_like++ : item.ci_like--,item.isCommentLike=!item.isCommentLike"><i class="el-icon-magic-stick"/>{{ item.isCommentLike?'已赞':'点赞' }}({{ item.ci_like }})</span>
                <!-- 删除 -->
                <span v-if="item.isCreator" @click="delReply(item.ci_id)"><i class="el-icon-delete"/>删除</span>
              </div>
              <div v-if="currCiId === item.ci_id" class="discuss-edit" style="padding: 30px 0 30px 30px;">
                <!-- 富文本编辑器 -->
                <div class="edit-text">
                  <cb-editor :name="'discussEdit'" :data-form="dataForm" :height="200" :tool-str="toolStr" :is-edit-chapter="true" :close-right="true"/>
                </div>
                <!-- 发表按钮 -->
                <div class="edit-btn" style="height: 100px;">
                  <el-button type="info" style="margin-left:10px;" @click="cancalReply()">取消回复</el-button>
                  <el-button type="primary" style="margin-top:20px;" @click="handleComment(item.ci_id)">发表评论</el-button>
                </div>
              </div>
              <!-- 评论的回复信息 -->
              <div v-for="(item0, index0) in item.replyCommentList" :key="index0" class="discuss-reply">
                <!-- 评论的信息 -->
                <div class="discuss-info">
                  <!-- 头像 -->
                  <div>
                    <el-avatar :src="item0.trainee_pic" :size="30" class="header-img"/>
                  </div>
                  <!-- 姓名 -->
                  <div class="info-name">{{ item0.trainee_name }} <span style="color:#a3a2a2;">回复</span> {{ item0.toTraineeInfo.trainee_name }}:</div>
                  <!-- 内容 -->
                  <div class="info-reply" v-html="item0.ci_content"/>
                </div>
                <!-- 评论的操作 -->
                <div class="discuss-operation">
                  <!-- 时间 -->
                  <span>{{ item0.ci_time }}</span>
                  <!-- 回复 -->
                  <span @click="handleReply(item0.ci_id)"><i class="el-icon-chat-dot-round"/>回复({{ item0.ci_total }})</span>
                  <!-- 点赞 -->
                  <span :style="item0.isCommentLike ? 'color:red;':''" @click="handleLike(item0.ci_id),!item0.isCommentLike ? item0.ci_like++ : item0.ci_like--,item0.isCommentLike=!item0.isCommentLike"><i class="el-icon-magic-stick"/>{{ item0.isCommentLike?'已赞':'点赞' }}({{ item0.ci_like }})</span>
                  <!-- 删除 -->
                  <span v-if="item0.isCreator" @click="delReply(item0.ci_id)"><i class="el-icon-delete"/>删除</span>
                </div>
                <div v-if="currCiId === item0.ci_id" class="discuss-edit" style="padding: 30px 0 30px 30px;">
                  <!-- 富文本编辑器 -->
                  <div class="edit-text">
                    <cb-editor :name="'discussEdit'" :data-form="dataForm" :height="200" :tool-str="toolStr" :is-edit-chapter="true" :media-is-preview="'true'"/>
                  </div>
                  <!-- 发表按钮 -->
                  <div class="edit-btn" style="height: 100px;">
                    <el-button type="info" style="margin-left:10px;" @click="cancalReply()">取消回复</el-button>
                    <el-button type="primary" style="margin-top:20px;" @click="handleComment(item0.ci_id)">发表评论</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <div style="margin: 20px 0;">
            <pager
              v-if="pagerInfo.totalPage"
              :curr-page="pagerInfo.currPage"
              :page-size-prop="pagerInfo.pageSizeProp"
              :total-page="pagerInfo.totalPage"
              align="center"
              @changeIndex="changeIndex"
            />
          </div>
        </div>
      </div>
      <!-- 右侧博客内容显示end -->
    </div>
    <el-backtop/>

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
import Pager from '@/components/pager'
import Prism from '@/assets/prism'
import { baseUrl, toast, filterNumerical, confirm } from '@/utils/global'
import { tokenKeyName } from '../../utils/global'
export default {
  name: 'BlogRead',
  components: {
    'header-nav': headernav,
    'cb-editor': CbEditor,
    'pager': Pager
  },
  filters: {
    // 过滤破万数值  保留一位小数
    numFilter(value) {
      return filterNumerical(value) | ''
    }
  },
  // metaInfo: {
  //     title: '布道师', // set a title
  //     meta: [{                 // set meta
  //         name: '布道师，软件实训，企业内训，教学实训，智慧教学，智慧实训，智慧管理，智慧评价，budaos,budaos.com，布道师高校版，布道师高校版小程序',
  //         content: this.metaInfoContent
  //     }]
  // },
  // metaInfo () {
  //     return {
  //         title: this.metaInfoContent + ' -布道师',
  //         meta: [{                 // set meta
  //             name: 'keywords',
  //             content: this.keywordsContent
  //         },{                 // set meta
  //             name: 'description',
  //             content: this.descriptionContent
  //         }]
  //     }
  // },
  data() {
    return {
      viewerImgSrc: '', // 图片预览src
      metaInfoContent: '布道师博客',
      keywordsContent: '',
      descriptionContent: '',
      showLogin: true,
      // 博客内容
      blogContentData: {
        resContent: '',
        resContentTogetherBuild: '',
        resId: ''
      },
      // 发表评论内容
      commentData: {
        resContent: '',
        resContentTogetherBuild: '',
        resId: ''
      },
      currCiId: '', // 当前回复评论id
      postId: '',
      blogTabs: [], // 博客标签集合
      blogData: {}, // 博客详情数据
      commentList: [], // 留言信息
      dataForm: {
        resContent: '',
        resContentTogetherBuild: '',
        resId: ''
      },
      toolStr: 'codesample preview fullscreen emoticons', // 编辑器的tabstr
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 15, // 分页大小
        pageSize: 15// 分页大小
      }
    }
  },
  created() {
    // this.getCookie();
    // let postId = localStorage.getItem('postId');
    // let temp = this.$route.query.value;
    // if (temp) {
    //     localStorage.setItem('postId',temp);
    //     this.queryBlogDetails(temp);
    //     this.postId = temp;
    // }else{
    //     this.queryBlogDetails(postId);
    //     this.postId = postId;
    // }
    // this.queryBlogCommentList();
  },
  mounted() {
    this.getCookie()
    this.postId = this.$route.params.postId // localStorage.getItem('postId');
    this.queryBlogDetails(this.postId)
    // let postId = localStorage.getItem('postId');
    // let temp = this.$route.query.value;
    // if (temp) {
    //     localStorage.setItem('postId',temp);
    //     this.queryBlogDetails(temp);
    //     this.postId = temp;
    // }else{
    //     this.queryBlogDetails(postId);
    //     this.postId = postId;
    // }
    this.queryBlogCommentList()
  },
  methods: {
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    // 获取留言信息
    queryBlogCommentList() {
      const formData = new FormData()
      formData.append('postId', this.postId)
      formData.append('pageNum', this.pagerInfo.currPage)
      formData.append('pageSize', this.pagerInfo.pageSize)

      this.$api.blog.queryBlogCommentList(formData).then(res => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.totalPage
          this.commentList = res.data.list
          this.timer = setTimeout(() => {
            Prism.highlightAll() // 这里加定时器让它后执行，不然没效果
          }, 0)
        } else {
          toast(res.msg)
        }
      })
    },
    // 获取博客内容
    queryBlogDetails(value) {
      this.$api.blog.queryBlogDetails(value).then(res => {
        if (res.code === 0) {
          this.keywordsContent = res.data[0].label
          this.metaInfoContent = res.data[0].title
          // let content = res.data[0].content;
          // content = content.replace(/<\/?.+?>/g,"");
          // content = content.replace(/ /g,"");
          // this.descriptionContent = content;
          this.blogData = res.data[0]
          if (!(this.blogData.blogHead.indexOf('http') !== -1 || this.blogData.blogHead.indexOf('https') !== -1)) {
            this.blogData.blogHead = baseUrl + this.blogData.blogHead
          }
          this.blogContentData.resContent = this.blogData.content
          this.blogContentData.blogContent = this.blogData.content
          this.blogContentData.resContentTogetherBuild = this.blogData.content
          this.blogContentData.resId = this.postId
          this.blogTabs = this.blogData.label.split(',')

          // this.$nextTick(() => {
          //     tinyMCE.editors['blogContent'].setContent(this.blogData.content);
          // })

          if (tinyMCE.editors['blogContent']) {
            setTimeout(() => {
              tinyMCE.editors['blogContent'].setContent(this.blogData.content)
            }, 100)
          } else {
            const tempTimer = setInterval(() => {
              if (tinyMCE.editors['blogContent']) {
                tinyMCE.editors['blogContent'].setContent(this.blogData.content)
                clearInterval(tempTimer)
              }
            }, 100)
          }
        } else {
          toast(res.msg)
        }
      })
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      // 调用课堂查询方法
      this.queryBlogCommentList()
    },
    // 发表评论
    handleComment(value) {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      const formData = new FormData()
      formData.append('postId', this.postId)
      if (value) {
        formData.append('parentId', value)
        const temp = tinyMCE.editors['discussEdit'].getContent().replace(new RegExp('<p>&nbsp;</p>', ('gm')), '')
        formData.append('content', temp)
      } else {
        formData.append('parentId', this.postId)
        const temp = tinyMCE.editors['comment'].getContent().replace(new RegExp('<p>&nbsp;</p>', ('gm')), '')
        formData.append('content', temp)
      }
      this.$api.blog.saveCommentInfo(formData).then(res => {
        toast(res.msg)
        tinyMCE.editors['comment'].setContent('')
        if (tinyMCE.editors['discussEdit']) {
          tinyMCE.editors['discussEdit'].setContent('')
        }
        this.currCiId = ''
        this.queryBlogCommentList()
      })
    },
    // 收藏博客
    collectBlog() {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.$api.blog.collect(this.postId).then(res => {
        toast(res.msg)
        this.queryBlogDetails(this.postId)
      })
    },
    // 分享链接
    shareLinks() {
      const integrityurl = window.location.href + '?value=' + this.postId
      const oInput = document.createElement('input')
      oInput.value = integrityurl
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      toast('已复制博客链接')
    },
    // 点赞博客
    likeBlog() {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.$api.blog.like(this.postId).then(res => {
        toast(res.msg)
        this.queryBlogDetails(this.postId)
      })
    },
    // 点赞评论
    handleLike(value) {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.$api.blog.clickLike(value).then(res => {
        toast(res.msg)
      })
    },
    // 关注博客
    followBlog() {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.$api.blog.follow(this.blogData.traineeId).then(res => {
        toast(res.msg)
        this.queryBlogDetails(this.postId)
      })
    },
    // 显示回复输入框
    handleReply(value) {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.currCiId = value
    },
    // 取消回复
    cancalReply() {
      tinyMCE.editors['discussEdit'].setContent('')
      this.currCiId = ''
    },
    // 删除回复
    delReply(value) {
      const that = this
      const obj = {
        ciId: value,
        postId: this.postId
      }
      confirm('是否删除此评论', () => {
        that.$api.blog.deleteReply(obj).then(res => {
          toast(res.msg)
          if (res.code === 0) {
            that.queryBlogCommentList()
          }
        })
      })
    },
    getCookieByName: function(cookie_name) {
      var allcookies = document.cookie
      // 索引长度，开始索引的位置
      var cookie_pos = allcookies.indexOf(cookie_name)

      // 如果找到了索引，就代表cookie存在,否则不存在
      if (cookie_pos !== -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        // 计算取cookie值得开始索引，加的1为“=”
        cookie_pos = cookie_pos + cookie_name.length + 1
        // 计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(';', cookie_pos)

        if (cookie_end === -1) {
          cookie_end = allcookies.length
        }
        // 得到想要的cookie的值
        var value = unescape(allcookies.substring(cookie_pos, cookie_end))
      }
      return value
    },
    // 拿到Cookie
    getCookie: function() {
      const token = this.getCookieByName(tokenKeyName)
      if (token) {
        // userInfo = JSON.parse(userInfo)
        this.$api.login.checkToken({ token: token }).then((res) => {
          if (res.code === 0 && res.stats) {
            this.webSockets.setInit(this, {
              paramStr: 'id=' + res.data.traineeId + '&channel=site&token=' + res.data.token
            })
            this.showLogin = false
          } else {
            localStorage.setItem('showLoginVue', 'showlogin')
            this.showLogin = true
          }
        })
      } else {
        // 因为cookie不存在，所以不做任何处理
        localStorage.setItem('showLoginVue', 'showlogin')
        this.showLogin = true
      }
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
    .content{
        width: 1200px;
        margin: 20px auto 40px;
        display: flex;
        justify-content: space-between;
    }
    .header-img{
        border: 2px solid #ffffff;
    }
    /* 左侧个人基本信息展示样式 */
    .content .left-user{
        width: 300px;
        height: fit-content;
        min-height: 300px;
        padding-bottom: 20px;
        /* height: 300px; */
        background-color: #ffffff;
    }
    .content .left-user .header-name{
        /* height: 80px; */
        height: fit-content;
        min-height: 80px;
        display: flex;
    }
    .content .left-user .header-name .header-left{
        height: 80px;
        line-height: 80px;
        display: flex;
        align-items:center;
        justify-content:center;
        width: 25%;
    }
    .content .left-user .header-name .details{
        width: 75%;
        text-align: left;
        padding: 10px 5px 10px 0;
    }
    .content .left-user .header-name .details .name{
        height: 30px;
        line-height: 30px;
        margin: 5px 0 5px;
        font-weight: bold;
        font-size: 14px;
    }
    .content .left-user .header-name .details .details-content{
        /* height: 20px; */
        height: fit-content;
        min-height: 20px;
        line-height: 20px;
        color: #a3a2a2;
        font-size: 13px;
    }
    .content .left-user .basic-info{
        margin-top: 10px;
        display: flex;
    }
    .content .left-user .basic-info .basic-content{
        width: 20%;
        height: 60px;
    }
    .content .left-user .basic-info .basic-content div{
        height: 25px;
        line-height: 25px;
    }
    .content .left-user .basic-info .basic-content div:last-child{
        color: #a3a2a2;
    }
    .content .left-user .attention-btn{
        margin-top: 100px;
    }
    /* 右侧博客内容显示样式 */
    .content-info{
        padding: 0 15px;
    }
    .content .right-blog{
        width: 890px;
    }
    .content .right-blog .blog-content{
        width: 100%;
        min-height: 300px;
        background-color: #ffffff;
    }
    .content .right-blog .blog-content .content-title{
        width: 100%;
    }
    .content .right-blog .blog-content .content-title .title{
        width: 100%;
        text-align: left;
        padding-left: 20px;
    }
    .content .right-blog .blog-content .content-title .title .title-tabs{
        display: inline-block;
        height: 20px;
        text-align: center;
        line-height: 20px;
        padding: 0 10px;
        border-radius: 4px;
        margin: 0 10px 10px 0;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #409eff;
        color: #ffffff;
    }
    .content .right-blog .blog-content .content-title .title .title-tabs:hover{

    }
    .content .right-blog .blog-content .content-title .title div{
        line-height: 50px;
        font-size: 20px;
        font-weight: bold;
    }
    .content .right-blog .blog-content .content-title .operation{
        text-align: left;
        padding: 0 20px;
        display: flex;
        align-items:center;
        justify-content: space-between;
        color: #a3a2a2;
    }
    .content .right-blog .blog-content .content-title .operation span{
        margin-right: 10px;
    }
    .content .right-blog .blog-content .content-title .operation .operation-list span:hover{
        cursor: pointer;
        color: #409eff;
    }
    .content .right-blog .blog-discuss{
        margin-top: 10px;
        width: 100%;
        min-height: 300px;
        background-color: #ffffff;
        padding: 30px 0 40px 30px;
    }
    .content .right-blog .blog-discuss .discuss-edit{
        display: flex;
        align-items:flex-end;
    }
    .content .right-blog .blog-discuss .discuss-edit .edit-text{
        width: 85%;
        height: 200px;
    }
    .content .right-blog .blog-discuss .discuss-edit .edit-btn{
        width: 15%;
        height: 40px;
    }
    .content .right-blog .blog-discuss .discuss-content{
        margin-top: 50px;
        padding-right: 30px;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss{
        width: 100%;
        padding: 20px 0;
        border-bottom: 1px solid #aaaaaa;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss:last-child{
        border-bottom: none;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-info{
        display: flex;
        text-align: left;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-info .info-name{
        margin-left: 10px;
        flex-shrink: 0;
        height: 30px;
        line-height: 30px;
        color: #757575;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-info .info-reply{
        margin-left: 10px;
        line-height: 30px;
        width: 100%;
        overflow-y: scroll;
    }
    .info-reply /deep/ p{
        word-break: break-all;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-operation{
        width: 100%;
        color: #a3a2a2;
        text-align: right;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-operation span{
        margin-left: 10px;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-operation span:not(:first-child):hover{
        color: #409eff;
        cursor: pointer;
    }
    .content .right-blog .blog-discuss .discuss-content .user-discuss .discuss-reply{
        margin-left: 30px;
        padding-left: 10px;
        border-left: 2px solid #f2f2f2;
    }
</style>
