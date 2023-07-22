<!-- 博客首页 -->
<template>
  <div class="blog blogHomeWrap">
    <!-- 顶部导航 -->
    <header-nav :current-index="4"/>

    <!-- 顶部头像、基本信息显示区域begin -->
    <div class="top-area" @click="openEditImg">
      <!-- 背景图片 -->
      <!-- <el-image class="bg-img" src="static/image/knowledge_a2.png" :fit="scale-down"></el-image> -->
      <img :src="userData.backgroundImage" class="bg-img" >
      <div v-if="userData.headPortrait" class="info">
        <!-- 头像 -->
        <el-avatar :src="userData.headPortrait" :size="150" class="header-img"/>
        <!-- 基本信息 -->
        <div class="basic-info text-ellipsis">
          <div class="text-ellipsis">{{ userData.name }}</div>
          <div class="basic-explain">
            <span v-if="!isShowExplainInput" :title="(!currBlogger && !showLogin) ? '编辑' : 'explain'" @click="handleExplainInput">{{ userData.blogRemark ? userData.blogRemark : '这个人很懒，啥也没留下' }}</span>
            <el-input
              v-if="isShowExplainInput"
              ref="basicExplain"
              v-model="basicExplain"
              style="width:300px"
              placeholder="请输入个人说明"
              size="mini"
              autofocus
              maxlength="100"
              show-word-limit
              @change="submitExplainInput"
              @blur="submitExplainInput"/>
          </div>
        </div>
      </div>
      <imgCutter
        v-if="(!currBlogger && !showLogin)"
        class="selectImg"
        rate="6:1"
        @cutDown="cutDown">
        <el-button slot="open" size="mini" round>更换背景</el-button>
      </imgCutter>
    </div>

    <!-- 编辑图片弹窗 -->
    <!-- <el-dialog title="图片选择" :visible.sync="isShowEditImg">
            <div>
                <imgCutter v-on:cutDown="cutDown">
                    <button slot="open">Select image</button>
                </imgCutter>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowEditImg = false">取 消</el-button>
                <el-button type="primary" @click="isShowEditImg = false">确 定</el-button>
            </div>
        </el-dialog> -->
    <!-- 顶部头像、基本信息显示区域end -->

    <!-- 博客筛选区域begin -->
    <div class="screen-area">
      <!-- 搜索框 -->
      <el-input v-model="searchText" :disabled="activeName === '4'" placeholder="搜博客" clearable class="input-with-select" style="width:50%" @keyup.enter.native="getBlogData()" @clear="getBlogData()">
        <el-button slot="append" :disabled="activeName === '4'" icon="el-icon-search" @click="getBlogData()"/>
      </el-input>
      <!-- 写博客按钮 -->
      <div>
        <el-button v-if="(!currBlogger)" type="primary" icon="el-icon-edit" size="medium" @click="toBlogEditPage">写博客</el-button>
        <el-button v-if="(currBlogger && !showLogin)" type="primary" icon="el-icon-s-custom" size="medium" @click="toPersonalPage">返回个人</el-button>
        <el-button v-if="(currBlogger && showLogin)" type="primary" icon="el-icon-s-custom" size="medium" @click="toPersonalPage">返回</el-button>
      </div>
    </div>
    <!-- 博客筛选区域end -->

    <div class="content-area">
      <!-- 左侧博客展示区域begin -->
      <div class="left-content">
        <!-- 筛选 -->
        <div class="screen">
          <!--类别切换 -->
          <el-tabs v-model="activeName" class="category-switching" @tab-click="handleClick">
            <el-tab-pane v-if="(!currBlogger)" label="全部博客" name="0"/>
            <el-tab-pane v-if="(currBlogger || !showLogin)" label="个人博客" name="1"/>
            <el-tab-pane v-if="(!currBlogger && !showLogin)" label="收藏博客" name="2"/>
            <el-tab-pane v-if="(!currBlogger && !showLogin)" label="关注博主博客" name="3"/>
            <el-tab-pane v-if="(!currBlogger && !showLogin)" label="关注博主" name="4"/>
          </el-tabs>
          <!-- 排序 -->
          <div v-if="activeName !== '1'" class="sort">
            <div v-if="activeName !== '4'" :class="['sort-type', 'inline-block', currSort === '' ? 'active' : '']" @click="handleSort('')">
              默认
            </div>
            <div v-if="activeName !== '4'" :class="['sort-type', 'inline-block', currSort === '1' ? 'active' : '']" @click="handleSort('1')">
              最新优先
            </div>
            <div v-if="activeName !== '4'" :class="['sort-type', 'inline-block', currSort === '2' ? 'active' : '']" @click="handleSort('2')">
              热门优先
            </div>
            <el-divider v-if="activeName !== '4'" direction="vertical"/>
            <el-dropdown v-if="activeName !== '4'" trigger="click" class="time-sort" @command="handleCommand">
              <span class="el-dropdown-link">
                <span v-if="currTimeCheck === '1'">时间不限</span><span v-if="currTimeCheck === '2'">最近一周</span><span v-if="currTimeCheck === '3'">最近一月</span><span v-if="currTimeCheck === '4'">最近三月</span><span v-if="currTimeCheck === '5'">最近一年</span><i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="beforeHandleCommand(1,'1')">时间不限</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'2')">最近一周</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'3')">最近一月</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'4')">最近三月</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'5')">最近一年</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="prompt inline-block">
              <span v-if="!editBlog && activeName !== '4'">已寻找到{{ searchNum }}条内容</span>
            </div>
          </div>
          <!-- 个人博客操作 -->
          <div v-if="activeName === '1'" class="blog-operation sort">
            <div :class="['sort-type', 'inline-block', currSort === '' ? 'active' : '']" @click="handleSort('')">
              默认
            </div>
            <div :class="['sort-type', 'inline-block', currSort === '1' ? 'active' : '']" @click="handleSort('1')">
              最新优先
            </div>
            <div :class="['sort-type', 'inline-block', currSort === '2' ? 'active' : '']" @click="handleSort('2')">
              热门优先
            </div>
            <el-divider direction="vertical"/>
            <el-dropdown trigger="click" class="time-sort" @command="handleCommand">
              <span class="el-dropdown-link">
                <span v-if="currTimeCheck === '1'">时间不限</span><span v-if="currTimeCheck === '2'">最近一周</span><span v-if="currTimeCheck === '3'">最近一月</span><span v-if="currTimeCheck === '4'">最近三月</span><span v-if="currTimeCheck === '5'">最近一年</span><i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="beforeHandleCommand(1,'1')">时间不限</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'2')">最近一周</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'3')">最近一月</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'4')">最近三月</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(1,'5')">最近一年</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-divider direction="vertical"/>
            <el-button v-if="!editBlog && !currBlogger" type="primary" size="mini" style="margin-left: 20px;" @click="editBlog = true">编辑</el-button>
            <el-button v-if="editBlog" type="primary" size="mini" style="margin-left: 20px;" @click="handleCheckAllChange"><span v-if="selectBolg.length === blogData.length && blogData.length !== 0">取消</span>全选</el-button>
            <el-button v-if="editBlog" type="danger" size="mini" @click="delBlog()">删除</el-button>
            <el-button v-if="editBlog" type="info" size="mini" @click="editBlog = false">取消</el-button>
            <div class="prompt inline-block">
              <span v-if="!editBlog">已寻找到{{ searchNum }}条内容</span>
              <span v-if="editBlog">已选中{{ selectBolg.length }}条内容</span>
            </div>
          </div>
        </div>
        <!-- 博客展示 -->
        <div class="blog-post">
          <el-checkbox-group v-if="activeName !== '4'" v-model="selectBolg" @change="handleCheckedChange">
            <div v-for="(item,index) in blogData" :key="index" class="post-info">
              <!-- 复选框 -->
              <el-checkbox v-if="editBlog" :label="item.postId" style="margin-left:20px;" @click.stop.native="clickChecked"><span v-show="false">复选框</span></el-checkbox>
              <!-- 头像 -->
              <el-avatar :src="item.blogHead" :size="55" :class="[(item.replyContent && item.replyContent !== '') ? 'header-img' : 'header-img2']" @click.native="getBlogData(item)"/>
              <!-- 内容 -->
              <div class="post-content" @click="toBlogRead(item.postId)">
                <!-- 上方标题 -->
                <div :style="editBlog ? 'padding-right: 30px;' : ''" class="top-title" style="line-height:50px;">
                  <div class="bottom-data">
                    <span class="text-ellipsis" style="color:#049eff;flex:1;">{{ item.title }}</span>
                    <div v-if="activeName === '1' && !currBlogger">
                      <i class="el-icon-edit" style="color:#409EFF;" @click.stop="editBlogInfo(item.postId)">编辑</i>
                      <i class="el-icon-delete" style="margin:0 19px 0 10px;color:#f56c6c;" @click.stop="delBlog(item.postId)">删除</i>
                    </div>
                    <div v-if="activeName === '2'">
                      <i class="el-icon-star-off" style="margin-right:19px;color:#f56c6c;" @click.stop="cancalCollect(item.postId)">取消收藏</i>
                    </div>
                  </div>
                </div>
                <!-- 下方数据显示 -->
                <div :style="editBlog ? 'padding-right: 30px;' : ''" class="top-title bottom-data" style="line-height:30px;">
                  <div class="top-title-item-wrap text-ellipsis">
                    <span class="text-ellipsis">{{ item.traineeName }}</span>
                    <span>{{ item.postTime }}</span>
                  </div>
                  <div>
                    <span><i class="el-icon-view"/> {{ item.viewNum | numFilter }}</span>
                    <span><i class="el-icon-chat-dot-round"/> {{ item.replyNum | numFilter }}</span>
                    <span><i class="el-icon-magic-stick"/> {{ item.likeNum | numFilter }}</span>
                  </div>
                </div>
                <!-- 最新回复 -->
                <div v-if="item.replyContent && item.replyContent !== ''" class="latest-reply">
                  <span style="flex-shrink: 0;max-width:250px;"><span style="font-weight: bold;">最新回复</span> {{ item.replier }}</span>
                  <span>：{{ item.replyContent }}</span>
                </div>
              </div>
            </div>
          </el-checkbox-group>

          <div v-if="activeName === '4'">
            <div v-for="(item, index) in focusBloggerList" :key="index" class="focus-blogger" @click="getBlogData(item)">
              <!-- 头像 -->
              <div class="blogger-head">
                <el-avatar :src="item.traineeHead" :size="50" class="header-img"/>
              </div>
              <!-- 姓名和粉丝等展示数据 -->
              <div class="name-data">
                <!-- 姓名 -->
                <div class="blogger-name">
                  {{ item.blogName }}
                </div>
                <!-- 展示数据 -->
                <div class="blogger-data">
                  博客 {{ item.blogsNum | numFilter }}
                  <el-divider direction="vertical"/>
                  粉丝 {{ item.fansNum | numFilter }}
                  <el-divider direction="vertical"/>
                  关注 {{ item.followNum | numFilter }}
                </div>
              </div>
              <!-- 操作按钮 -->
              <div class="blogger-btn">
                <el-button v-if="!item.mutualConcern" type="info" size="small" icon="el-icon-circle-check" @click.stop="followBlog(item.traineeId)">已关注</el-button>
                <el-button v-if="item.mutualConcern" type="info" size="small" icon="el-icon-refresh" @click.stop="followBlog(item.traineeId)">相互关注</el-button>
              </div>
            </div>
          </div>

          <!-- 没有数据时显示提示 -->
          <div v-if="(activeName === '4' && focusBloggerList.length === 0) || (activeName !== '4' && blogData.length === 0)" style="padding-top:50px;">
            <img src="static/image/manage_board/creatkc.png" alt="">
            <div style="padding-left: 20px; color: #6a7275">
              暂无数据
            </div>
          </div>

          <!-- 分页 -->
          <div style="margin: 20px 0;">
            <pager
              v-if="pagerInfo.totalPage"
              :page-size-prop="pagerInfo.pageSizeProp"
              :curr-page="pagerInfo.currPage"
              :total-page="pagerInfo.totalPage"
              align="center"
              @changeIndex="changeIndex"
            />
          </div>
        </div>
      </div>
      <!-- 左侧博客展示区域end -->

      <!-- 右侧标签以及热门博主显示区域begin -->
      <div class="right-content">
        <!-- 推荐标签 -->
        <div class="recommended-tags">
          <!-- 标题 -->
          <div class="title">
            热门标签
          </div>
          <!-- 内容 -->
          <div class="tags-content" >
            <el-tag v-for="(item, index) in tagsList" v-if="index < 10 && item" :type="index % 5 === 1 ? 'success' : (index % 5 === 2 ? 'info' : (index % 5 === 3 ? 'warning' : (index % 5 === 4 ? 'danger' : '')))" :key="index" class="el-tags" @click="handelTags(item)">{{ item }}</el-tag>
          </div>
        </div>
        <!-- 热门博主 -->
        <div class="popular-blogger">
          <!-- 标题 -->
          <div class="title">
            热门博主
          </div>
          <!-- 内容 -->
          <div v-for="(item, index) in bloggerList" :key="index" class="blogger-content" @click="getBlogData(item)">
            <!-- 头像 -->
            <div class="blogger-content-img">
              <el-avatar :src="item.blogHead" :size="45" class="header-img"/>
            </div>
            <!-- 详情 -->
            <div class="blogger-content-details">
              <!-- 昵称 -->
              <div class="details-name text-ellipsis">
                {{ item.traineeName }}
              </div>
              <!-- 数据 -->
              <div class="details-data">
                博客({{ item.blogsNum | numFilter }}) 粉丝({{ item.fansNum | numFilter }}) 关注({{ item.followNum | numFilter }})
              </div>
            </div>
          </div>
        </div>
        <!-- 友情社区 -->
        <div class="friendship-community">
          <!-- 标题 -->
          <div class="title">
            <span class="title-name">友情社区</span>
            <span class="title-right" @click="handleResourcse">更多</span>
          </div>
          <!-- 内容 -->
          <div class="community-content">
            <div v-for="(item, index) in communityList" :key="index" :title="item.friendName" class="community-content-details" @click="toCommunityContent(item.friendUrl)">
              <el-avatar :src="item.friendLogo" :size="45" class="header-img" style="margin-right:10px; flex-shrink: 0;"/>
              <span class="overHide">{{ item.friendName }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧标签以及热门博主显示区域end -->
    </div>
    <el-backtop/>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import $ from 'jquery'
import ImgCutter from 'vue-img-cutter'
import headernav from '@/components/header-nav-study'
// import { VueCropper }  from 'vue-cropper'
import Pager from '@/components/pager'
import { baseUrl, toast, filterNumerical, confirm } from '@/utils/global'
import { tokenKeyName } from '../../utils/global'
export default {
  name: 'BlogIndex',
  components: {
    'header-nav': headernav,
    'pager': Pager,
    'imgCutter': ImgCutter
    // VueCropper,
  },
  metaInfo: {
    title: '布道师', // set a title
    meta: [{ // set meta
      name: 'keywords',
      content: '布道师，软件实训，企业内训，教学实训，智慧教学，智慧实训，智慧管理，智慧评价，budaos,budaos.com，布道师高校版，布道师高校版小程序'
    }, { // set meta
      name: 'description',
      content: '依托云技术，采用“平台+”的方式，融合容器技术和虚拟化技术，构建多维度、个性化、智能化的数字化教育资源体系，促进教育机构、企业”资源、教学、实训、评价”完整可持续发展的学习生态系统。'
    }]
  },
  filters: {
    // 过滤破万数值  保留一位小数
    numFilter(value) {
      return filterNumerical(value)
    }
  },
  data() {
    return {
      isShowExplainInput: false, // 是否显示个人说明输入框
      basicExplain: '', // 个人说明编写
      showLogin: true,
      isShowEditImg: false, // 是否打开背景图片上传弹出框
      currUser: '', // 当前用户id
      currBlogger: '', // 当前博主id
      searchText: '', // 搜索博客的内容
      activeName: '0', // 当前分类位置
      currTimeCheck: '1', // 当前查看的时间区域
      currSort: '', // 当前排序方式
      editBlog: false, // 个人博客是否处于编辑状态
      selectBolg: [], // 当前选中的博客id
      isCheckAll: false, // 是否全选
      blogData: [], // 当前博客数据
      tagsList: [], // 标签集合
      bloggerList: [], // 博主集合
      communityList: [], // 友情社区集合
      focusBloggerList: [], // 关注博主集合
      searchNum: 0, // 搜索出来的总条数
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 12, // 分页大小
        pageSize: 12// 分页大小
      },
      // 用户数据
      userData: {
        backgroundImage: 'static/image/blog-bg.jpg',
        headPortrait: '',
        name: '',
        blogRemark: ''
      },
      // 编辑图片数据
      option: {
        img: 'static/image/knowledge_a2.png',
        size: '1',
        outputType: 'jpeg || png'
      }
    }
  },
  mounted() {
    this.getCookie()
    const isEditBlog = localStorage.getItem('isEditBlog')
    if (isEditBlog) {
      this.activeName = '1'
      localStorage.removeItem('isEditBlog')
    }
    this.getBlogData()
    this.getTagsList()
    this.getBloggerList()
    this.getCommunityList()
    // 获取用户数据
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (user) {
      if (user.traineeHead) {
        if (!(user.traineeHead.indexOf('http') !== -1 || user.traineeHead.indexOf('https') !== -1)) {
          user.traineeHead = baseUrl + user.traineeHead
        }
      }
      this.currUser = user.traineeId
      this.userData.headPortrait = user.traineeHead
      this.userData.name = user.nickName
    }
  },
  methods: {
    // 背景图片图片裁剪
    cutDown(value) {
      // console.log(value)
      // let a = document.createElement("a");
      // a.href = value.dataURL;
      // a.setAttribute("download", "chart-download");
      // a.click();
      const formData = new FormData()
      formData.append('file', value.file)
      this.$api.blog.changeBackgroundImage(formData).then(res => {
        if (res.code === 0) {
          this.getBlogData()
        }
        toast(res.msg)
      })
    },
    // 获取热门标签
    getTagsList() {
      this.$api.blog.recommendedLabel().then(res => {
        if (res.code === 0 && res.data.length > 0) {
          this.tagsList = res.data.map((item) => {
            return Object.keys(item)[0]
          })
        } else if (res.code !== 0) {
          toast(res.msg)
        }
      })
    },
    // 获取热门博主
    getBloggerList() {
      this.$api.blog.popularBloggers().then(res => {
        if (res.code === 0) {
          this.bloggerList = res.data
          this.bloggerList.forEach(b => {
            if (!(b.blogHead.indexOf('http') !== -1 || b.blogHead.indexOf('https') !== -1)) {
              b.blogHead = baseUrl + b.blogHead
            }
          })
        } else {
          toast(res.msg)
        }
      })
    },
    // 获取友情社区
    getCommunityList() {
      this.$api.blog.friendshipCommunity().then(res => {
        if (res.code === 0) {
          this.communityList = res.data
          this.communityList.forEach(b => {
            if (!(b.friendLogo.indexOf('http') !== -1 || b.friendLogo.indexOf('https') !== -1)) {
              b.friendLogo = baseUrl + b.friendLogo
            }
          })
        } else {
          toast(res.msg)
        }
      })
    },
    // 默认排序和时间选择
    clearData() {
      this.currSort = ''
      this.currTimeCheck = '1'
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size

      // 调用课堂查询方法
      if (this.activeName !== '4') {
        this.getBlogData()
      } else {
        this.getMyFollowList()
      }
    },
    // 点击个人说明事件,显示个人说明输入框
    handleExplainInput() {
      if (this.currBlogger || this.showLogin) {
        return false
      }
      this.basicExplain = this.userData.blogRemark
      this.isShowExplainInput = true
      const _this = this
      setTimeout(function() {
        _this.$refs['basicExplain'].focus()
      }, 1)
    },
    // 个人说明输入确定事件
    submitExplainInput() {
      this.userData.blogRemark = this.basicExplain
      this.isShowExplainInput = false
      const formData = new FormData()
      formData.append('blogRemark', this.userData.blogRemark)
      this.$api.blog.updateInfo(formData).then(res => {})
    },
    // 查询博客列表信息
    getBlogData(value) {
      this.blogData = []
      if (value && this.currBlogger !== value.traineeId) {
        if (this.currUser === value.traineeId) {
          this.currBlogger = ''
        } else {
          this.currBlogger = value.traineeId
        }
        this.userData.headPortrait = value.blogHead
        this.userData.name = value.traineeName ? value.traineeName : value.blogName
        this.activeName = '1'
        this.pagerInfo.currPage = 1
      }
      const obj = {
        traineeId: this.currBlogger,
        title: this.searchText,
        filterType: this.activeName === '0' ? '' : this.activeName,
        sidx: this.currSort,
        pubdate: this.currTimeCheck,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize
      }
      this.$api.blog.queryBlogList(obj).then(res => {
        if (res.code === 0) {
          if (res.backgroundImage) {
            if (res.backgroundImage.indexOf('http') < 0) {
              this.userData.backgroundImage = baseUrl + res.backgroundImage
            }
          } else {
            this.userData.backgroundImage = 'static/image/blog-bg.jpg'
          }
          this.userData.blogRemark = res.blogRemark ? res.blogRemark : ''
          this.blogData = []
          if (res.data.list) {
            this.blogData = res.data.list
            // 头像处理
            this.blogData.forEach(blog => {
              if (!(blog.blogHead.indexOf('http') !== -1 || blog.blogHead.indexOf('https') !== -1)) {
                blog.blogHead = baseUrl + blog.blogHead
              }
              if (blog.replyContent) {
                // 清空回复中的标签
                blog.replyContent = blog.replyContent.replace(/<\/?.+?>/g, '')
                blog.replyContent = blog.replyContent.replace(/ /g, '')
                blog.replyContent = blog.replyContent.replaceAll('&lt;', '<')
                blog.replyContent = blog.replyContent.replaceAll('&gt;', '>')
              }
            })
            this.searchNum = res.data.total
          }
          this.pagerInfo.totalPage = res.data.pages
        } else {
          toast(res.msg)
        }
      })
    },
    // 博客排序方式切换
    handleSort(value) {
      this.currSort = value
      this.getBlogData()
    },
    // 博客分类切换事件
    handleClick(tab, event) {
      this.blogData = []
      this.pagerInfo.currPage = 1
      if (this.activeName !== '4') {
        this.editBlog = false
        this.getBlogData()
      } else if (this.activeName === '4') {
        this.getMyFollowList()
      }
    },
    // 关注博主
    followBlog(value) {
      this.$api.blog.follow(value).then(res => {
        toast(res.msg)
        this.getMyFollowList()
      })
    },
    // 获取关注博主
    getMyFollowList() {
      const obj = {
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize
      }
      this.$api.blog.queryMyFollowList(obj).then(res => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.pages
          this.focusBloggerList = res.data.list
          this.focusBloggerList.forEach(blog => {
            if (!(blog.traineeHead.indexOf('http') !== -1 || blog.traineeHead.indexOf('https') !== -1)) {
              blog.traineeHead = baseUrl + blog.traineeHead
            }
          })
        }
      })
    },
    // 时间切换
    handleTime(value) {
      this.currTimeCheck = value
      this.getBlogData()
    },
    // 标签选择
    handelTags(value) {
      this.searchText = value
      this.clearData()
      this.getBlogData()
    },
    // 博客选中事件
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.isCheckAll = checkedCount === this.blogData.length
    },
    // 博客全选事件
    handleCheckAllChange() {
      if (this.selectBolg.length === this.blogData.length) {
        this.selectBolg = []
      } else {
        const arrTemp = []
        this.blogData.forEach(obj => {
          arrTemp.push(obj.postId)
        })
        this.selectBolg = arrTemp
      }
    },
    // 复选框单击事件
    clickChecked() {},
    /**
             * 返回新的command对象
             */
    beforeHandleCommand(command, value) {
      const obj = {
        command: command,
        item: value
      }
      return obj
    },

    /**
             * 下拉菜单列表的事件触发
             */
    handleCommand(command) {
      if (command.command === 1) {
        this.handleTime(command.item)
      } else if (command.command === 2) {
        this.delBlog(command.item)
      }
    },
    // 删除多个博客
    delBlog(value) {
      const that = this
      if (this.selectBolg.length <= 0 && !value) {
        toast('未选择需要删除的博客！')
        return
      }
      confirm('是否删除博客', () => {
        let delTemp = ''
        if (value) {
          delTemp = value
        } else {
          delTemp = that.selectBolg.join(',')
        }

        const formData = new FormData()
        formData.append('postId', delTemp)
        that.$api.blog.deleteBlog(formData).then(res => {
          toast(res.msg)
          if (!value) {
            this.selectBolg = []
          }
          that.getBlogData()
        })
      })
    },
    // 取消收藏
    cancalCollect(value) {
      this.$api.blog.collect(value).then(res => {
        toast(res.msg)
        this.getBlogData()
      })
    },
    // 打开编辑图片
    openEditImg() {
      $('.selectImg').trigger('click')
      this.isShowEditImg = true
    },
    // 跳转到博客详情页面
    toBlogRead(value) {
      // 判断当前处于编辑状态 还是查看状态
      if (this.editBlog) { // 编辑时选中或取消复选框
        let temp = true
        this.selectBolg.forEach((s, i) => {
          if (s === value) {
            this.selectBolg.splice(i, 1)
            temp = false
          }
        })
        if (temp) {
          this.selectBolg.push(value)
        }
        this.handleCheckedChange(this.selectBolg)
        return
      }
      // 查看时跳转页面
      const blogRead = this.$router.resolve({
        path: '/blog-read/' + value
        // query: {
        //     value: value
        // },
      })
      localStorage.setItem('postId', value)
      window.open(blogRead.href, '_blank')
    },
    editBlogInfo(value) {
      this.$router.push({
        path: '/blog-edit',
        query: { id: value }
      })
    },
    // 跳转到博客新增页面
    toBlogEditPage() {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      this.$router.push('/blog-edit')
    },
    // 友情社区跳转
    toCommunityContent(value) {
      window.open(value, '_blank')
    },
    // 更多社区跳转
    handleResourcse() {
      const blogRead = this.$router.resolve({
        path: `/my-resources/index`
      })
      window.open(blogRead.href, '_blank')
    },
    // 重新刷新当前页面
    toPersonalPage() {
      this.$router.go(0)
    },
    // 拿到Cookie
    getCookie: function() {
      const token = Cookies.get(tokenKeyName)
      if (token) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userName = userInfo.nickName
        this.isTeacher = userInfo.isTeacher
        this.userImg = localStorage.getItem('userimg')
        this.showLogin = false
        this.showUserName = true
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
    .overHide{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .blog{
        padding-bottom: 30px;
    }
    .inline-block{
        display: inline-block;
    }
    .active{
        background-color: #f2f2f2;
    }
    /* 头部样式 */
    .top-area{
        width: 1200px;
        height: 200px;
        margin: 0 auto;
        position: relative;
    }
    .bg-img{
        width: 100%;
        height: 100%;
    }
    .info{
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        padding: 30px 0 0 60px;
        position: absolute;
        top: 0;
        left: 0;
    }
    .basic-info{
        flex: 1;
        text-align: left;
        padding-top: 90px;
        height: 150px;
        font-size: 25px;
        margin-left: 30px;
        font-weight: bold;
        text-shadow:-1px 0 white,0 1px white,1px 0 white,0 -1px white;
    }
    .basic-explain{
        font-size: 16px;
        max-width: 800px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .basic-explain /deep/ .el-input__inner{
        padding-right: 50px !important;
    }
    .header-img{
        border: 2px solid #ffffff;
    }
    .selectImg{
        position: absolute;
        right: 32px;
        bottom: 20px;
    }
    .selectImg /deep/ .copyright{
        display: none !important;
    }
    /* 筛选区域样式 */
    .screen-area{
        width: 1200px;
        height: 50px;
        line-height: 50px;
        padding: 0 30px;
        margin: 10px auto 0;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    /* 博客主内容区域begin */
    .content-area{
        width: 1200px;
        margin: 10px auto 0;
        display: flex;
    }
    /* 左侧 */
    .content-area .left-content {
        width: 890px;
    }
    .content-area .left-content .screen{
        width: 100%;
        height: 80px;
        background-color: #ffffff;
    }
    .content-area .left-content .blog-post{
        margin-top: 10px;
        min-height: 900px;
        width: 100%;
        background-color: #ffffff;
    }
    .content-area .left-content .blog-post .focus-blogger{
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
    }
    .content-area .left-content .blog-post .focus-blogger:hover{
        background-color: #f2f2f2;
        cursor: pointer;
    }
    .content-area .left-content .blog-post .focus-blogger .blogger-head{
        width: 15%;
        text-align: center;
    }
    .content-area .left-content .blog-post .focus-blogger .name-data{
        width: 70%;
        height: 100%;
        text-align: left;
    }
    .content-area .left-content .blog-post .focus-blogger .name-data .blogger-name{
        font-size: 16px;
        font-weight: bold;
        height: 40px;
        line-height: 50px;
    }
    .content-area .left-content .blog-post .focus-blogger .name-data .blogger-data{
        height: 40px;
        line-height: 25px;
    }
    .content-area .left-content .blog-post .focus-blogger .blogger-btn{
        width: 15%;
        text-align: center;
    }
    .content-area .left-content .blog-post .focus-blogger .blogger-head{
        width: 15%;
        text-align: center;
    }
    .content-area .left-content .blog-post .post-info{
        display: flex;
        width: 100%;
        min-height: 90px;
        max-height: 130px;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
    }
    .content-area .left-content .blog-post .post-info .post-content{
        text-align: left;
        width: 85%;
    }
    .content-area .left-content .blog-post .post-info:hover{
        background-color: #f2f2f2;
        cursor: pointer;
    }
    .content-area .left-content .blog-post .post-info .top-title{
        height: 40px;
        line-height: 40px;
        width: 100%;
        overflow: hidden;
    }
    .bottom-data{
        display: flex;
        justify-content: space-between;
    }
    .content-area .left-content .blog-post .post-info .bottom-data span{
        margin-right: 20px;
    }
    .content-area .left-content .blog-post .post-info  .latest-reply{
        overflow: hidden;
        display: flex;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 0 10px;
        border-left: 3px solid #409eff;
    }
    .content-area .left-content .blog-post .post-info  .latest-reply span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .content-area .left-content .blog-post .post-info .header-img{
        margin: 0 20px 40px;
    }
    .content-area .left-content .blog-post .post-info .header-img2{
        margin: 0 20px;
    }
    .content-area .left-content .screen .category-switching {
        width: 100%;
    }
    .content-area .left-content .screen .sort {
        text-align: left;
        width: 100%;
        padding: 0 30px;
        height: 40px;
        line-height: 40px;
    }
    .content-area .left-content .screen .sort .sort-type{
        height: 26px;
        line-height: 26px;
        width: 70px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        margin-right: 10px;
    }
    .content-area .left-content .screen .sort .time-sort{
        margin: 0 14px;
    }
    .content-area .left-content .screen .sort .prompt{
        float: right;
        color: #a3a2a2;
    }
    /* 右侧 */
    .content-area .right-content {
        margin-left: 10px;
        width: 300px;
    }
    .content-area .right-content .recommended-tags{
        background-color: #ffffff;
        height: 320px;
        width: 100%;
    }
    .content-area .right-content .recommended-tags .tags-content{
        text-align: left;
        padding: 20px;
    }
    .content-area .right-content .recommended-tags .tags-content .el-tags{
        margin: 0 15px 10px 0;
        cursor: pointer;
    }
    .content-area .right-content .title{
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #f2f2f2;
        font-weight: bold;
    }
    .content-area .right-content .popular-blogger{
        margin-top: 10px;
        background-color: #ffffff;
        /* height: 350px; */
        width: 100%;
    }
    .content-area .right-content .popular-blogger .blogger-content{
        height: 62px;
        line-height: 62px;
        display: flex;
    }
    .content-area .right-content .popular-blogger .blogger-content .blogger-content-img{
        height: 62px;
        line-height: 62px;
        display: flex;
        align-items:center;
        justify-content:center;
        width: 25%;
    }
    .content-area .right-content .popular-blogger .blogger-content .blogger-content-details{
        width: 75%;
        text-align: left;
        padding: 10px 0;
    }
    .content-area .right-content .popular-blogger .blogger-content .blogger-content-details .details-name{
        height: 24px;
        line-height: 24px;
        font-weight: bold;
    }
    .content-area .right-content .popular-blogger .blogger-content .blogger-content-details .details-data{
        height: 16px;
        line-height: 22px;
        color: #a3a2a2;
        font-size: 13px;
    }
    .content-area .right-content .popular-blogger .blogger-content:hover{
        background-color: #f2f2f2;
        cursor: pointer;
    }
    .content-area .right-content .friendship-community{
        position: relative;
        margin-top: 10px;
        background-color: #ffffff;
        width: 100%;
    }
    .content-area .right-content .friendship-community .title-right{
        position: absolute;
        right: 47px;
        top: 0px;
        font-weight: normal;
        color: #049eff;
        cursor: pointer;
    }
    .content-area .right-content .friendship-community .community-content {
        display: flex;
        flex-wrap:wrap;
    }
    .content-area .right-content .friendship-community .community-content .community-content-details{
        height: 65px;
        width: 50%;
        display: flex;
        align-items:center;
        padding-left: 20px;
        text-align: left;
    }
    .content-area .right-content .friendship-community .community-content .community-content-details:hover{
        background-color: #f2f2f2;
        cursor: pointer;
    }
    /* 博客主内容区域end */
    .blog-post /deep/ .el-checkbox-group{
        font-size: inherit !important;
    }
    .top-title-item-wrap{
        flex: 1;
        display: flex;
        /* max-width: 50%; */
    }
    .top-title-item-wrap span:first{
        flex: 1;
        /* max-width: 50%; */
    }
</style>
