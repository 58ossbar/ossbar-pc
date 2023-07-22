<!-- 所有新闻列表页面 -->
<template>
  <div>
    <header-nav :current-index="5"/>
    <div>
      <div style="width: 1200px;margin: auto">
        <div class="classroom-all" style="margin-top:20px;">
          <div class="display-flex">
            <div class="location">
              <div class="localtion-title"><b>当前位置:</b></div>
              <ul class="localtion-list">
                <li class="localtion-item">
                  <!-- 合作伙伴 -->
                  <span style="color: #959da0">我们的客户</span>
                </li>
              </ul>
            </div>
            <div class="classroom-back">
              <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
              <span @click="toback()">返回</span>
            </div>
          </div>
          <!-- 新闻分类导航开始 -->
          <!--<div style="display: flex;padding: 0 20px;">
            <span style="font-weight: bold;line-height: 40px;">新闻类型：</span>
            <div :class="index===currIndex?'newsClick  news':'newsNotClick news'" :id="item.dictId" @click="changeType(index)" v-for="(item,index) in newsType" :key="index">{{item.dictValue}}</div>
          </div>-->
          <!-- 新闻分类导航结束 -->
        </div>

        <!-- 新闻简介开始 -->
        <div
          v-if="partnerList.length > 0"
          class="classroom-all pather-content-wrap">
          <b-row class="pather-content-list">
            <b-col v-for="(item,index) in partnerList" :key="index" cols="3" style="margin-top: 10px">
              <div style="padding: 5px 0;position: relative">
                <div style="display: flex;justify-content: center;margin-bottom: 7px">
                  <div class="news-synopsis-time">{{ item.cooperationTime }}</div>
                </div>
                <div :title="item.companyName" class="news-synopsis-content-wrap" @click="toNewsread(item)">
                  <img :src="item.companyLogo" width="200" height="200" style="object-fit:cover;">
                  <div class="news-synopsis-content">{{ item.companyName }}</div>
                  <!--<div class="news-synopsis-bottom">
                    <span>详情</span>
                    <span class="fa fa-angle-right" style="font-size: 20px"></span>
                  </div>-->
                </div>
              </div>
            </b-col>
          </b-row>

          <div class="page-bto">
            <pager
              v-if="totalPage"
              :class="'custom-css'"
              :page-size-prop="filters.pageSizeProp"
              :curr-page="filters.pageNum"
              :total-page="totalPage"
              align="center"
              @changeIndex="changePage"
            />
          </div>

        </div>

        <!-- 新闻简介结束 -->
        <!-- 没有新闻时的默认显示 -->
        <div v-if="partnerList.length <= 0" class="not-news-show classroom-all">
          <img src="static\image\manage_board\joinkc.png" >
          <div class="show-text">
            暂无相关数据
          </div>
        </div>

      </div>
    </div>
    <div v-if="totalCount === partnerList.length" style="height:40px"/>
  </div>
</template>

<script>
import { baseUrl } from '@/utils/global'
import HeaderNav from '@/components/header-nav-study'
import FooterNav from '@/components/footer-nav-not-info'
import Pager from '@/components/pager'

export default {
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'pager': Pager
  },
  data() {
    return {
      totalPage: 0,
      totalCount: 0,
      partnerList: [],
      filters: {
        pageNum: 1,
        pageSizeProp: 8,
        pageSize: 8
      },
      isLoading: false,
      loading: false
    }
  },
  computed: {
    noMore() {
      return this.partnerList.length === this.totalPage
    }
  },
  mounted() {
    // window.addEventListener('scroll', this.onScroll)
    this.findPage()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    // 分页更新数据
    changePage(value, size) {
      this.filters.pageNum = value
      this.filters.pageSize = size
      this.findPage()
    },
    findPage() {
      this.$api.partner.findData(this.filters).then(res => {
        if (res.code === 0) {
          this.totalPage = res.data.totalPage
          this.partnerList = res.data.list
          this.partnerList.forEach(item => {
            item.companyLogo = baseUrl + item.companyLogo
          })
        }
      })
    },
    /**
       * 返回
       */
    toback: function() {
      this.$router.push('/')
    },
    // 新闻单个的详细页
    toNewsread: function(box) {
      // localStorage.setItem('newsid', box)
      // this.$router.push('/news-read')
      window.open(box.companyWebsite)
    },
    onScroll() {
      /* // 变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if (scrollTop + windowHeight === scrollHeight && scrollTop > 0) {
        this.load()
      } */
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
  .pather-content-wrap{
    margin-left: 0;
    padding: 0 20px 20px;
    /* min-height: calc(100vh - 70px - 140px - 30px ); */
    position:relative;
  }
  .pather-content-list{
    min-height: 510px;
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
  .news-synopsis-content-wrap{
    cursor: pointer;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.15);
    position:relative;
  }
  .news-synopsis-content{
    margin-top: 5px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 0;
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
  /* .page-bto{
    position: absolute;
    bottom: 0;
    width: 100%;
  } */
</style>
