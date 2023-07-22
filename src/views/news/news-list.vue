<!-- 所有新闻列表页面 -->
<template>
  <div>
    <header-nav/>
    <div>
      <div style="width: 1200px;margin: auto">
        <div class="classroom-all" style="margin-top:20px;">
          <div class="display-flex">
            <div class="location">
              <div class="localtion-title"><b>当前位置:</b></div>
              <ul class="localtion-list">
                <li class="localtion-item" style="cursor: pointer" @click="toback()">
                  管理看板
                </li>
                <li class="localtion-item">
                  <span style="color: #959da0">新闻咨询</span>
                </li>
              </ul>
            </div>
            <div class="classroom-back">
              <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
              <span @click="toback()">返回</span>
            </div>
          </div>
          <!-- 新闻分类导航开始 -->
          <div style="display: flex;padding: 0 20px;">
            <span style="font-weight: bold;line-height: 40px;">新闻类型：</span>
            <div v-for="(item,index) in newsType" :class="index===currIndex?'newsClick  news':'newsNotClick news'" :id="item.dictId" :key="index" @click="changeType(index)">{{ item.dictValue }}</div>
          </div>
          <!-- 新闻分类导航结束 -->
        </div>

        <!-- 新闻简介开始 -->
        <div
          v-if="newsData.length > 0"
          class="classroom-all"
          style="margin-left: 0;padding: 0 20px 20px;min-height: calc(100vh - 70px - 140px - 30px );">
          <b-row>
            <b-col v-for="(item,index) in newsData" :key="index" cols="4" style="margin-top: 10px">
              <div style="padding: 5px 0;position: relative">
                <div style="display: flex;justify-content: center;margin-bottom: 7px">
                  <div class="news-synopsis-time">{{ item.createTime }}</div>
                </div>
                <div style="cursor: pointer;box-shadow: 0 2px 5px 0 rgba(0,0,0,.15);" @click="toNewsread(item.newsid)">
                  <img :src="item.newsLogo" width="100%" height="200">
                  <div class="news-synopsis-content">{{ item.newTitle }}</div>
                  <div class="news-synopsis-bottom">
                    <span>详情</span>
                    <span class="fa fa-angle-right" style="font-size: 20px"/>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>

        <!-- 新闻简介结束 -->
        <!-- 没有新闻时的默认显示 -->
        <div v-if="newsData.length <= 0" class="not-news-show classroom-all">
          <img src="static\image\manage_board\joinkc.png" >
          <div class="show-text">
            暂无相关的新闻
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageRes.totalCount === newsData.length" style="height:40px"/>
  </div>
</template>

<script>
import { baseUrl } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import { toast } from '../../utils/global'

export default {
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav
  },
  data() {
    return {
      currIndex: 0,
      newsData: [],
      isLoading: false,
      pageRes: {
        page: 1,
        limit: 6,
        totalPage: null,
        totalCount: 0
      },
      newsType: [],
      loading: false
    }
  },
  computed: {
    noMore() {
      return this.newsData.length === this.pageRes.totalCount
    }
  },
  mounted() {
    if (this.$route.query.categoryId) {
      this.pageRes.page = 1
      this.pageRes.categoryId = this.$route.query.categoryId
    }
    this.findDatas(null)
    // this.scroll();
    // window.addEventListener('beforeunload', e => {
    //   window.scrollTo(0, 0)
    // });
    // this.$nextTick(function () {})
    window.addEventListener('scroll', this.onScroll)
    this.$nextTick(function() {})
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    /**
         * 返回
         */
    toback: function() {
      this.$router.push('/begin-class')
    },
    // 懒加载事件
    load() {
      if (!this.noMore) {
        this.$message({
          iconClass: 'el-icon-loading',
          message: '加载中...',
          offset: 100,
          duration: 1000
        })
      } else {
        // this.$message({
        //   message: '我也是有底线的',
        //   type: 'warning',
        //   offset: 100,
        //   duration: 1000
        // });
        return false
      }
      setTimeout(() => {
        this.pageRes.page++
        this.$api.news.showNewsList(this.pageRes).then(res => {
          if (res.code === 0) {
            this.pageRes.limit = res.data.pageSize
            this.pageRes.page = res.data.currPage
            this.pageRes.totalPage = res.data.totalPage
            this.pageRes.totalCount = res.data.totalCount
            if (res.data.list) {
              for (let i = 0; i < res.data.list.length; i++) {
                this.newsData.push({ 'createTime': res.data.list[i].createTime ? res.data.list[i].createTime : '没有时间',
                  'newTitle': res.data.list[i].newTitle,
                  'newsLogo': baseUrl + res.data.list[i].newsLogo,
                  'newsid': res.data.list[i].newsid })
              }
            }
          } else {
            toast(res.msg)
          }
        })
      }, 1000)
    },
    findDatas: function() {
      this.$api.news.showGetCategory().then(res => {
        if (res.code === 0) {
          this.newsType = []
          for (let i = 0; i < res.data.length; i++) {
            this.newsType.push(res.data[i])
            // if (res.data.dictValue === this.$route.query.categoryId) {
            //   this.currIndex = i
            // }
          }
          /* if (this.newsType && this.newsType.length > 0) {
                this.changeType(this.newsType[0].dictCode,this.currIndex);
              }*/
          this.changeType(this.currIndex)
        } else {
          toast(res.msg)
        }
      })
    },
    // scroll() {
    //   window.onscroll = () => {
    //     this.pageRes.page++;
    //       if (this.pageRes.page <= this.pageRes.totalPage) {
    //         this.$api.news.showNewsList(this.pageRes).then(res => {
    //           if (res.code === 0) {
    //             this.pageRes.limit = res.data.pageSize;
    //             this.pageRes.page = res.data.currPage;
    //             this.pageRes.totalPage = res.data.totalPage;
    //             this.pageRes.totalCount = res.data.totalCount;
    //             if (res.data.list) {
    //               for (let i = 0; i < res.data.list.length; i++) {
    //                 this.newsData.push({"createTime":res.data.list[i].createTime,
    //                   "newTitle":res.data.list[i].newTitle,
    //                   "newsLogo":baseUrl+res.data.list[i].newsLogo,
    //                   "newsid":res.data.list[i].newsid});
    //               }
    //             }
    //           }else{
    //             toast(res.msg)
    //           }
    //         })
    //       }
    //   }
    // },
    // 新闻单个的详细页
    toNewsread: function(box) {
      localStorage.setItem('newsid', box)
      this.$router.push('/news-read')
    },
    changeType: function(index) {
      // if(dictId){
      //   $(".newsClick").attr("class","news");
      //   $("#"+dictId).addClass("newsClick");
      // }
      this.pageRes = { page: 1, limit: 9, totalPage: null }
      this.currIndex = index
      this.pageRes.categoryId = this.newsType[index].dictCode
      this.showNewsList()
    },

    showNewsList() {
      this.$api.news.showNewsList(this.pageRes).then(res => {
        if (res.code === 0) {
          this.pageRes.limit = res.data.pageSize
          this.pageRes.page = res.data.currPage
          this.pageRes.totalPage = res.data.totalPage
          this.pageRes.totalCount = res.data.totalCount
          this.newsData = []
          for (let i = 0; i < res.data.list.length; i++) {
            this.newsData.push({ 'createTime': res.data.list[i].createTime ? res.data.list[i].createTime : '没有时间',
              'newTitle': res.data.list[i].newTitle,
              'newsLogo': baseUrl + res.data.list[i].newsLogo,
              'newsid': res.data.list[i].newsid })
          }
        } else {
          toast(res.msg)
        }
      })
    },
    onScroll() {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if (scrollTop + windowHeight === scrollHeight && scrollTop > 0) {
        this.load()
      }
    }

  }
}
</script>

<style scoped>
  .classroom-all{
    width: 1200px;
    margin-bottom: 20px;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    background: white;
  }
  .news{
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
  }
  .newsNotClick.news:hover{
      color: #FF740E;
    }
  .newsClick{
    background:#007bff;
    color:white;
    font-weight: bold;
  }
  /* 没有新闻时显示的样式 */
  .not-news-show{
    min-height: calc(100vh - 70px - 140px - 30px );
  }
  .not-news-show img{
    padding-top: 40px;
  }
  .show-text{
    color: #6a7275;
  }
  /* 新闻简介的样式 */
  .news-synopsis-time{
    color: #FFFFFF;
    background-color: #DADADA;
    font-size: 12px;
    width: 35%;
    padding: 3px;
    border-radius: 3px;
  }
  .news-synopsis-content{
    margin-top: 5px;
    overflow: hidden;
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 45px;
    background: rgba(0, 0, 0, 0.36);
    color: #FFFFFF;
    font-size: 14px;
    text-align: left;
    padding-left: 20px;
  }
  .news-synopsis-bottom{
    height: 40px;
    line-height: 40px;
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
  }
  .news-synopsis-bottom span{
    padding: 0 10px;
    line-height: 40px;
  }
  .loaded-tip{
    margin: 15px 0;
  }
  .display-flex{
    display:flex;
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
</style>
