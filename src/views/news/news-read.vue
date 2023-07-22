<!-- 新闻详情页面 -->
<template>
  <div>
    <header-nav/>
    <div style="background: #ececec">
      <div style="height: 30px;width:1240px;margin:auto;">
        <ul class="nav-ul">
          <li @click="navToMain">首页</li>>
          <li @click="navToList">新闻资讯</li>>
          <li style="color: #6a7275">新闻阅读</li>
        </ul>
      </div>
    </div>
    <!-- 新闻详情 -->
    <div v-for="(item,index) in newsData" :key="index" class="news-details">
      <!-- 新闻标题 -->
      <div class="news-details-title">
        {{ item.newTitle }}
      </div>
      <!-- 新闻内容 -->
      <div class="news-details-content">
        <!-- 左边信息处 -->
        <div class="news-left-information">
          <!-- 时间年 -->
          <div class="time-year">
            <span>{{ time.year }}</span>
          </div>
          <!-- 时间月和日 -->
          <div class="time-monthday">
            <span>{{ time.month }}/{{ time.day }}</span>
          </div>
          <!-- 时间时和分 -->
          <div class="time-hoursmin">
            <span>{{ time.hours }}:{{ time.min }}</span>
          </div>
          <!-- 新闻来源 -->
          <div class="news-source">
            <div>来源:</div>
            <span>{{ item.resource }}</span>
          </div>
        </div>
        <!-- 右边内容处 -->
        <div class="news-right-content">
          <cb-editor :data-form="item" name="content" readonly="true" toolbar="false" height="0"/>
          <div style="margin-top: 10px;text-align: left;display: flex">
            上一篇：<div
              v-if="item.previousId"
              :title="item.previousTitle"
              style="color: #3399ff;cursor: pointer;width:250px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
              @click="toNewsread(item.previousId)">{{ item.previousTitle }}</div>
          </div>
          <div style="display: flex;margin-top: 10px;text-align: left">
            下一篇：<div
              v-if="item.nextId"
              :title="item.nextTitle"
              style="color: #3399ff;cursor: pointer;width:250px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
              @click="toNewsread(item.nextId)">{{ item.nextTitle }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 回顶部 -->
    <div class="back-top" @click="backTop">
      <img src="static\image\teaching_center\arrow_up_1.png" >
      <div>回顶部</div>
    </div>
    <!--<div class="content" v-for="(item,index) in newsData">
      <b-row>
        <b-col cols="9">
         <div>
           <div style="margin-top: 10px;font-size: 20px">{{item.newTitle}}</div>
           <b-row style="margin-top: 10px;font-size: 14px">
             <b-col cols="3"></b-col>
             <b-col cols="3">来源:<span style="color: #3399ff">{{item.resource}}</span></b-col>
             <b-col cols="3">发布时间:<span style="color: #3399ff">{{item.createTime}}</span></b-col>
             <b-col cols="3"></b-col>
           </b-row>
           <div style="margin-top: 10px">
             {{item.newsSummlar}}
           </div>
           <div style="height: 1px;background: #c4c4c4;margin-top: 10px"></div>
           <div style="margin-top: 10px;text-align: left;text-indent: 2em;" id="list-item-1">
             <cb-editor   name="content" :dataForm="item" readonly="true" toolbar="false" height="0"></cb-editor>
           </div>
         </div>
        </b-col>
        <b-col cols="3">
          <div>
            <div style="margin-top: 10px;">
              <img :src="item.newsLogo" width="100%" height="200px"/>
            </div>
            <div style="margin-top: 30px;text-align: left;display: flex">
              上一篇:<div v-if="item.previousId" style="color: #3399ff;cursor: pointer;width:200px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
                       :title="item.previousTitle"  @click="toNewsread(item.previousId)" >{{item.previousTitle}}</div>
            </div>
            <div style="display: flex;margin-top: 10px;text-align: left">
              下一篇:<div v-if="item.nextId" style="color: #3399ff;cursor: pointer;width:200px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
                       :title="item.nextTitle"     @click="toNewsread(item.nextId)">{{item.nextTitle}}</div>
            </div>
          </div>
        </b-col>
      </b-row>
      <div style="margin-top: 30px;text-align: left;margin-left: 3%;display: flex">
        上一篇:<div v-if="item.previousId" style="color: #3399ff;cursor: pointer;width:250px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
                 :title="item.previousTitle"    @click="toNewsread(item.previousId)">{{item.previousTitle}}</div>
      </div>
      <div style="display: flex;margin-top: 10px;text-align: left;margin-left: 3%">
        下一篇:<div v-if="item.nextId" style="color: #3399ff;cursor: pointer;width:250px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
                 :title="item.nextTitle"      @click="toNewsread(item.nextId)">{{item.nextTitle}}</div>
      </div>
    </div>-->
    <div style="height:40px"/>

    <!-- 图片预览标签 begin -->
    <div v-viewer class="accessory-viewer" style="display: none;">
      <img :src="viewerImgSrc" alt>
    </div>
    <!-- 图片预览标签 end -->

  </div>
</template>

<script>
import { baseUrl } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import CbEditor from '@/components/cb-editor'
export default {
  components: {
    'footer-nav': FooterNav,
    'header-nav': HeaderNav,
    'cb-editor': CbEditor
  },
  data() {
    return {
      viewerImgSrc: '', // 图片预览src
      newsid: localStorage.getItem('newsid'),
      newsData: [],
      time: {
        year: '',
        month: '',
        day: '',
        hours: '',
        min: '',
        sec: ''
      }
    }
  },
  created() {
    this.showNewsData()
  },
  methods: {
    // 预览v-html里面的图片
    editorPreViewImg(viewerImgSrc) {
      this.viewerImgSrc = viewerImgSrc
      // console.log(this.$el.querySelector('.accessory-viewer'))
      const viewer = this.$el.querySelector('.accessory-viewer').$viewer
      viewer.show()
    },
    navToMain: function() {
      this.$router.push('/begin-class')
    },
    navToList: function() {
      this.$router.push('/news-list')
    },
    // 新闻单个的详细页
    toNewsread: function(box) {
      localStorage.setItem('newsid', box)
      this.$router.go(0)
    },
    showNewsData: function() {
      // 以url参数的方式访问，方便后端录入新闻时做预览操作
      this.newsid = this.$route.query.id || this.newsid

      this.$api.news.showNews(this.newsid).then((res) => {
        this.newsData = []
        var obj = {}
        obj.createTime = res.data.createTime.substring(0, 10)
        obj.content = res.data.content
        obj.newTitle = res.data.newTitle
        obj.newsid = res.data.newsid
        obj.newsLogo = baseUrl + res.data.newsLogo
        obj.newsSummlar = res.data.newsSummlar
        obj.resource = res.data.resource
        if (res.next != null) {
          obj.nextId = res.next.newsid
          obj.nextTitle = res.next.newTitle
        }
        if (res.previous != null) {
          obj.previousId = res.previous.newsid
          obj.previousTitle = res.previous.newTitle
        }
        this.newsData.push(obj)
        this.time.year = res.data.createTime.substring(0, 4)
        this.time.month = res.data.createTime.substring(5, 7)
        this.time.day = res.data.createTime.substring(8, 10)
        this.time.hours = res.data.createTime.substring(11, 13)
        this.time.min = res.data.createTime.substring(14, 16)
        this.time.sec = res.data.createTime.substring(17, 19)
      })
    },
    // 回顶部
    backTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 5)
    }
  }
}
</script>

<style scoped>
  .content{
    width: 1240px;
    margin:  auto;
  }
  .nav-ul{
    list-style-type: none;
    display: flex;
    line-height: 30px;
    font-size: 14px;
  }
  .nav-ul li{
    margin-left: 10px;
    margin-right: 10px;
  }
  .nav-ul li:nth-of-type(1):hover, .nav-ul li:nth-of-type(2):hover{
    color:#ff8400;
    cursor: pointer;
  }
  /* 标题样式 */
  .news-details{
    width: 1240px;
    margin: 0 auto;
    text-align: left;
  }
  .news-details-title{
    font-size: 35px;
    font-weight: 600;
    padding: 20px 0 30px 0;
    width: 100%;
  }
  /* 内容样式开始 */
  .news-details-content{
    width: 100%;
    padding: 0 0 20px 0;
    display: flex;
  }
  /* 左边信息处样式 */
  .news-left-information{
    width: 16%;
  }
  .time-year{
    width: 80%;
    position: relative;
    text-align: center;
  }
  .time-monthday{
    width: 80%;
    text-align: center;
    font-size: 30px;
  }
  .time-hoursmin{
    width: 80%;
    text-align: center;
    font-size: 20px;
  }
  .news-source{
    width: 80%;
    text-align: center;
    font-size: 12px;
    color: #485053;
    margin-top: 40px;
    word-wrap:break-word;
  }
  .time-year span{
    padding: 0 5px;
    background-color: #f5f5f5;
    position: relative;
    z-index: 2;
    font-size: 20px;
  }
  .time-year:after{
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #2a2a2a;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 1;
  }
  /* 右边内容处样式 */
  .news-right-content{
    width: 84%;
  }
  /* 内容样式结束 */
  /* 回顶部样式 */
  .back-top{
    position: fixed;
    bottom: 40px;
    right: 100px;
    cursor: pointer;
  }
</style>
