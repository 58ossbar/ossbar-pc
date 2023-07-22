<template>
  <div class="view-news-details wind-1240">
    <!-- 新闻详情 -->
    <div class="news-details">
      <!-- 新闻标题 -->
      <div class="news-details-title">
        独立自由勋章 | 抗日将士的荣耀
      </div>
      <!-- 新闻内容 -->
      <div class="news-details-content">
        <!-- 左边信息处 -->
        <div class="news-left-information">
          <!-- 时间 -->
        </div>
        <!-- 右边内容处 -->
        <div class="news-right-content"/>
      </div>
    </div>
    <!-- 没有新闻时页面 -->
    <div v-if="false" style="height: 500px"/>
  </div>
</template>

<script>
export default {
  name: 'ViewAllNewsDetails'
}
</script>

<style scoped>
    .view-news-details{
      display: flex;
      background-color: #fff;
      border:1px solid #d7d7d7;
      border-right: 0;
      border-radius: 6px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin: 20px auto !important;
    }
    /* 标题样式 */
    .news-details{
      width: 100%;
      text-align: left;
    }
    .news-details-title{
      font-size: 35px;
      font-weight: 600;
      padding: 20px 0 20px 30px;
      width: 90%;
    }
    /* 内容样式开始 */
    .news-details-content{
      width: 90%;
      padding: 0 0 20px 30px;
    }
    /* 左边信息处样式 */
    .news-left-information{
     width: 16%;
    }
    .news-right-content{
      width: 84%;
    }
    /* 内容样式结束 */
</style>
