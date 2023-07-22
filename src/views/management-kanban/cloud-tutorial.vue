<!-- 云教材显示页面 -->
<template>
  <div class="my-teaching-package-box backgroundColorGrey">
    <header-nav :current-index="3"/>
    <div class="continaer">
      <!-- 分类查询区域Start -->
      <div class="classroom-all">
        <div class="technology-nav">
          <div class="technology-nav-top">
            <div class="technology-type">职业路径</div>
            <ul class="nav technology-field-nav">
              <li
                v-for="(technosphere, index) in technosphereList"
                :class="{'active-type':clicked==index}"
                :key="technosphere.majorId"
                @click="selectTechnosphere(technosphere.majorId,index)">
                {{ technosphere.majorName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 分类查询区域End -->

      <!-- 排序查询区域Start -->
      <div class="classroom-all category-nav">
        <div class="category-nav-left">
          <el-input v-model="searchText" placeholder="搜教材" clearable class="input-with-select" @keyup.enter.native="showBooksList(false)" @clear="showBooksList(false)">
            <el-button slot="append" icon="el-icon-search" @click="showBooksList(false)"/>
          </el-input>
        </div>
        <div class="category-nav-right">
          <ul class="nav category-nav-left-ul">
            <li
              v-for="(sort, index) in sortList"
              :class="{'active-type':sortClicked==index}"
              :key="index"
              @click="selectSort(sort.sortBy,index)">
              {{ sort.sortName }}
            </li>
          </ul>
        </div>
      </div>
      <!-- 排序查询区域End -->

      <div class="my-teaching-package wind-1240">
        <div v-if="booksList && booksList.length > 0" class="serachLibrary teaching-package-con">
          <div
            v-for="(item, index) in booksList"
            :key="index"
            :title="item.name"
            class="teaching-package-items"
            @click="toBookshelfRead(item)">
            <div class=" cb-video-l ">
              <div class="cb-bookbox" >
                <div class="tg-postbook">
                  <figure class="tg-featureimg">
                    <div v-if="item.pic" class="tg-bookimg">
                      <div class="tg-frontcover"><img :src="item.pic" :onerror="logo" alt="image description"></div>
                      <div class="tg-backcover"><img :src="item.pic" :onerror="logo" alt="image description"></div>
                    </div>
                    <div v-else class="tg-bookimg">
                      <div class="tg-frontcover">
                        <img src="static/creatorblue/img/wk1.jpg" alt="image description">
                      </div>
                      <div class="tg-backcover">
                        <img src="static/creatorblue/img/wk1.jpg" alt="image description">
                      </div>
                    </div>
                  </figure>
                </div>
                <img class="img-fluid" src="static/creatorblue/img/wkbg.png">
              </div>
              <div class="cb-bookbox-name displayFlex flexCenter">
                <div class="font-weight-bolder" style="width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center;">{{ item.subjectName }}</div>
              </div>
              <div class="cb-bookbox-author-num displayFlex flexCenter">
                <span class="cb-bookbox-author"><span v-if="item.subjectAuthor" :title="item.subjectAuthor">{{ item.subjectAuthor }} 著</span></span>
                <span class="cb-bookbox-num" ><span v-if="item.totalViewNum">{{ item.totalViewNum }}</span><span v-else>0</span>次浏览</span>
              </div>
            </div>
            <div v-if="item.isCollection" class="del-code" title="已收藏" @click.stop="handleCollection(item)"><i class="el-icon-star-on"/></div>
            <div v-if="!item.isCollection && item.isFree" class="del-code" title="收藏至书架" @click.stop="handleCollection(item)"><i class="el-icon-star-on" style="color:#ccc;"/></div>
          </div>
        </div>
        <!-- v-if="booksList && booksList.length > 0"  -->
        <div class="pager-content">
          <!-- ref="pager" -->
          <pager
            v-if="pagerInfo.totalPage"
            :page-size-prop="pagerInfo.pageSizeProp"
            :curr-page="pagerInfo.currPage"
            :total-page="pagerInfo.totalPage"
            align="center"
            @changeIndex="changeIndex"
          />
          <!-- <span class="pager-content-text" style="margin-left: 50px">共{{ pagerInfo.totalPage }}页</span>
          <span class="pager-content-text" style="margin-left: 10px">去</span>
          <b-form-input
            v-model="goPage"
            style="margin-left: 5px; width: 50px;"
            class="pager-content-input"
            type="number"
            @keyup.enter="handleToPage()"/>
          <span class="pager-content-text" style="margin-left: 5px">页</span>
          <b-button class="pager-content-button" style="padding: 0 0 0 2px;font-size: 13px" variant="primary" @click="handleToPage()">确定</b-button> -->
        </div>
        <!-- 分页区域End -->
        <div v-if="isNoData" class="notContent-describe">
          <img src="static/image/manage_board/creatkc.png" alt="">
          <div style="padding-left: 20px; color: #6a7275">
            老师正在快马加鞭地添加此类教材<span class="dots"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { concatImgUrl, toast } from '@/utils/global'
import headernav from '@/components/header-nav-study'
import Pager from '@/components/pager'
import Cookies from 'js-cookie'
import { tokenKeyName } from '../../utils/global'
export default {
  name: 'MyBookshelf',
  components: {
    'header-nav': headernav,
    'pager': Pager
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
  },
  data() {
    return {
      showLogin: true,
      searchText: '', // 搜索内容
      // 排序信息
      sortList: [
        { 'sortName': '最新', 'sortBy': 'newest' },
        { 'sortName': '最热', 'sortBy': 'hot' }
      ],
      clicked: 0, // 分类选择下标
      subClicked: 0, // 技术选中下标
      sortClicked: 0, // 排序选中下标
      sortBy: 'newest', // 当前排序方式
      technosphereList: [], // 分类
      subjectsList: [], // 技术
      logo: 'this.src="' + 'static/creatorblue/img/wk1.jpg' + '"', // 默认图片
      booksList: [], // 教学包数据
      defaultPkgLogo: 'static/image/teaching_package/default_activity.png',
      isNoData: false, // 是否体验
      goPage: null,
      // 分页信息
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 10, // 分页大小
        pageSize: 10 // 分页大小
      }
    }
  },
  created() {
    // 获取所有分类
    this.getMajor()
  },
  mounted() {
    localStorage.removeItem('bookshelfReadData')
    const token = Cookies.get(tokenKeyName)
    if (token) {
      this.showLogin = false
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.webSockets.setInit(this, {
        paramStr: 'id=' + userInfo.traineeId + '&channel=site&token=' + token
      })
    }
  },
  methods: {
    // 分类的改变
    selectTechnosphere: function(majorId, index) {
      this.pagerInfo.currPage = 1
      this.clicked = index
      this.getSubjectsList()
    },
    // 技术改变
    selectSubjects: function(subjectId, index) {
      this.pagerInfo.currPage = 1
      this.subClicked = index
      // 调用查询课堂方法
      this.showBooksList(false)
    },
    // 获取分类
    getMajor: function() {
      this.clicked = 0
      this.technosphereList = [{ majorName: '全部', majorId: '' }]
      // 查询出所有分类信息
      this.$api.testcenter.getMajor().then(res => {
        if (res.data) {
          this.technosphereList = [{ majorName: '全部', majorId: '' }]
          const technosphereArr = res.data
          // 分类类型中添加全部类型
          for (let i = 0; i < technosphereArr.length; i++) {
            this.technosphereList.push(technosphereArr[i])
          }
        }
        this.getSubjectsList()
      }).catch(() => {
        this.getSubjectsList()
      })
    },
    // 获取技术
    getSubjectsList: function() {
      this.subClicked = 0
      this.subjectsList = [{ subjectName: '全部', subjectId: '', subjectLogo: '' }]
      // 查询出所有技术信息
      const data = {
        majorId: this.technosphereList[this.clicked].majorId
      }
      this.$api.perseverancePlate.listSubjects(data).then(res => {
        if (res.data) {
          this.subjectsList = [{ subjectName: '全部', subjectId: '', subjectLogo: '' }]
          const subjectsArr = res.data
          // 技术类型中添加全部类型
          for (let i = 0; i < subjectsArr.length; i++) {
            this.subjectsList.push(subjectsArr[i])
          }
        }
        this.showBooksList(false)
      }).catch(() => {
        this.showBooksList(false)
      })
    },
    // 返回
    toback() {
      this.$router.push('/begin-class')
    },
    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      this.showBooksList(true)
    },
    // 分页跳转
    handleToPage() {
      if (this.goPage) {
        const temp = parseInt(this.goPage)
        if (temp <= this.pagerInfo.totalPage && temp > 0) {
          this.changeIndex(temp)
        } else {
          this.changeIndex(1)
        }
      }
    },
    /**
     * 进入书籍详情页面
     * 如果是创建者isCreator，直接进入，
     * 如果学员在课堂里面isPermission，直接进入
     */
    toBookshelfRead(item) {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      if (item.ifCanView) {
      // if (item.isCreator || item.isPermission || item.isCollection) {
        localStorage.setItem('bookshelfReadData', JSON.stringify(item))
        this.$router.push({
          path: '/my-bookshelf/my-bookshelf-read'
        })
        return false
      }
      // 如果是上课教材，且人不在课堂
      if (item.type === 'room' && !item.isPermission) {
        toast(item.subjectName + '  ' + '未授权，请与老师联系！')
        return false
      }
      if (!item.isPermission) {
        toast(item.subjectName + '  ' + '未授权，请与老师联系！')
      }
    },

    // 排序改变
    selectSort(sortBy, index) {
      this.sortClicked = index
      this.sortBy = sortBy
      // 调用查询课堂方法
      this.showBooksList(true)
    },

    /**
     * 渲染教学包列表
     */
    showBooksList(isLazy = false) {
      if (!isLazy) {
        this.pagerInfo.currPage = 1
      }
      const params = {
        sidx: (this.sortClicked + 1).toString(),
        region: 'N',
        pageSize: this.pagerInfo.pageSize,
        subjectName: this.searchText,
        pageNum: this.pagerInfo.currPage,
        majorId: (this.technosphereList && this.technosphereList[this.clicked] && this.technosphereList[this.clicked].majorId) ? (this.technosphereList[this.clicked].majorId) : '',
        subjectId: (this.subjectsList && this.subjectsList[this.subClicked] && this.subjectsList[this.subClicked].subjectId) ? (this.subjectsList[this.subClicked].subjectId) : ''
      }
      // this.booksList = []
      this.isNoData = false
      // console.log(params);
      this.$api.pkgInfo.queryLiveBookList(params).then((res) => {
        if (res.code === 0) {
          this.pagerInfo.totalPage = res.data.totalPage
          // this.booksList = []
          res.data.list.forEach(a => {
            // if (a.publicSubjects && a.publicSubjects.length > 0) {
            //   a.publicSubjects.forEach(b => {
            //     b.pic = concatImgUrl(b.pic)
            //     b.name = b.subjectName
            //     b.readingVolume = (b.viewNum) ? (b.viewNum) : 0
            //     this.booksList.push(b)
            //   })
            // } else {
            a.name = a.subject_name
            a.pic = concatImgUrl(a.pkgLogo)
            a.readingVolume = (a.viewNum) ? (a.viewNum) : 0
            // this.booksList.push(a)
            // }
          })
          this.booksList = res.data.list
          this.pagerInfo.totalPage = res.data.pages
          // this.booksList = res.data.list
          if (!this.booksList || (this.booksList && this.booksList.length < 1)) {
            this.isNoData = true
          }
        }
      }).catch(() => {
        if (!this.booksList || (this.booksList && this.booksList.length < 1)) {
          this.isNoData = true
        }
      })
    },
    /**
     * 书籍收藏事件
     */
    handleCollection(value) {
      if (this.showLogin) {
        toast('请登录')
        this.tologin('showlogin')
        return
      }
      const obj = {
        pkgId: value.pkgId,
        subjectId: value.subjectId
      }
      this.$api.pkgInfo.collectionThisSubject(obj).then(res => {
        toast(res.msg)
        this.showBooksList(true)
      })
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
.classroom-all{
      width: 1200px;
      margin:20px auto;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
      background: white
    }
    /* --------------查询区域开始------------- */
    .technology-nav-top, .technology-nav-bottom{
      display: flex;
      justify-content: left;
    }
    .technology-nav-top{
      margin: 0 20px;
      /* border-bottom: 1px solid #D3D3D3; */
    }
    .technology-nav-bottom{
      margin: 0 20px;
    }
    .technology-type{
      height: 55px;
      line-height: 55px;
      font-weight: bold;
      font-size: 13px;
    }
    .technology-field-nav, .technology-label-nav{
      width: 95%;
      padding: 10px 10px;
      box-sizing:border-box;
    }
    .technology-field-nav li:hover{
      color: #FF740E;
    }
    .technology-label-nav li:hover{
      color: #FF740E;
    }
    .technology-nav li, .category-nav li{
      height: 25px;
      line-height: 25px;
      padding: 0 10px;
      border-radius: 5px;
      font-size: 13px;
      margin: 5px;
      cursor: pointer;
    }
    .active-type{
      background-color: #007bff !important;
      color: #ffffff !important;
      font-weight: bold;
    }
    .category-nav{
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }
    .category-nav-left select{
      padding: 2px 20px;
      height: 25px;
      line-height: 25px;
      font-size: 13px;
      margin-left: 18px;
      margin-top: 2px;
    }
    .category-nav-left{
      display: flex;
      justify-content: left;
      width: 400px;
    }
    /* .category-nav-left-ul li:hover{
      color: #FF740E;
    } */
    .category-nav-right span{
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      padding-right: 10px;
      font-size: 20px;
    }
    .active-button{
      color: #007bff;
    }
    /* --------------查询区域结束------------- */
    .my-teaching-package-box{
        height: 100%;
    }
    .teaching-package-con{
        display: flex;
        flex-wrap: wrap;
    }

    .teaching-package-items{
        overflow: hidden;
        position: relative;
        width: 18%;
        padding: 10px 10px 0 10px;
        background-color: #fff;
        border: 1px solid #ddd;
        margin: 10px 11px 5px;
        position: relative;
        transition: all 0.75s;
        box-shadow: 0px 0px 5px rgba(0,0,0,0.2); /*opera或ie9*/
        -moz-box-shadow: 0px 0px 5px rgba(0,0,0,0.2); /*firefox*/
        -webkit-box-shadow: 0px 0px 5px rgba(0,0,0,0.2);/* webkit*/
    }
    .teaching-package-items:hover{
        box-shadow: 0px 0px 10px rgba(0,0,0,0.35); /*opera或ie9*/
        -moz-box-shadow: 0px 0px 10px rgba(0,0,0,0.35); /*firefox*/
        -webkit-box-shadow: 0px 0px 10px rgba(0,0,0,0.35);/* webkit*/
    }
    .continaer .my-teaching-nav{
        min-height: 50px !important;
        margin: 20px auto;
        background-color: #fff;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 6px;
        padding-bottom: 20px;
    }
    .my-teaching-search{
      display: flex;
    }
    .continaer .my-teaching-package{
        min-height: 550px !important;
        margin: 20px auto;
        background-color: #fff;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 6px;
    }
    .add-teaching-package-btn{
        width: 18%;
        height: 300px;
        cursor: pointer;
        margin: 10px 11px 5px;
    }
    .teaching-package-con{
        box-shadow: none;
    }

    .together {
      position: absolute;
      right: 0px;
      top:0px;
      z-index: 800;
    }
    .del-code{
       position: absolute;
       height: 25px;
       line-height: 25px;
       width: 25px;
       font-size: 20px;
       background-color: #fff;
       border-radius: 50%;
       top: 0px;
       right: 0px;
       color: red;
       cursor: pointer;
       z-index: 801;
     }
    .edit-code{
      position: absolute;
      top: 30px;
      right: 2px;
      color: #FF740E;
      font-size: 25px;
      cursor: pointer;
      display: none;
      z-index: 801;
    }
    .more-code{
      position: absolute;
      bottom: 9px;
      right: 10px;
      color: #FF740E;
      font-size: 25px;
      cursor: pointer;
      z-index: 801;
      width: 20px;
      height: 20px;
    }
    .version-history{
      height: 255px;
      overflow-y: scroll;
    }
    .history-choose{
      cursor: pointer;
      margin-bottom: 10px;
    }
    .version-history-nav{
      display: flex;
      justify-content: space-between;
      line-height: 32px;
      width:100%;
    }
    .version-history-info{
      width: 80%;
      display: inline-block;
      text-align: left;
      margin-left: 10px;
    }
    .version-history-title{
      margin: 0 10px 5px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .version-text{
      font-size: 13px;
      display: flex;
      justify-content: space-between;
    }
    .together.active::before{
      content:'共建中';
      color:#FFFFFF;
      padding-left: 15px;
      text-align: center;
      font-size: .857em;
      position: absolute;
      top: 0px;
      right: -20px;
      background-color:#13ce66;
      transform: rotate(39deg);
      overflow: hidden;
      width:80px;
    }
    /* 返回 */
    .classroom-back{
      width: 75%;
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
    .teaching-package-state{
      z-index: 802;
      position: absolute;
      top: 0px;
      left:-20px;
      width: 80px;
      padding-right: 15px;
      font-size: .857em;
      text-align: center;
      transform: rotate(-45deg);
      color: #fff;
    }
    .teaching-package-state-N{
      background-color: #da0a25;
    }
    .teaching-package-state-Y{
      background-color: #13ce66;
    }
    .display-flex{
      display:flex;
    }
    .cb-bookbox-author,
    .cb-bookbox-num{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .cb-bookbox-author{
      width: 60%;
      text-align: left;
    }
    .cb-bookbox-num{
      width: 39%;
      text-align: right;
    }
    .notContent-describe{
      font-family: 楷体;
      font-size: 20px;
      margin-top: 100px;
    }
    .cb-bookbox-author-num{
      justify-content: flex-end;
    }
    /* 分页区域样式 */
    .pager-content{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .pager-content-text{
      height: 38px;
      margin-top: 35px;
      line-height: 38px;
    }
    .pager-content-input{
      height: 35px;
      margin-top: 35px;
      line-height: 35px;
      font-size: 13px;
      padding: 0 6px;
      text-align: center;
    }
    .pager-content-button{
      width: 50px;
      height: 35px;
      margin-top: 35px;
      line-height: 35px;
      font-size: 13px;
      margin-left: 10px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[ type= "number" ] {
      -moz-appearance: textfield;
    }
</style>
