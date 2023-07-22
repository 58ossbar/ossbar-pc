<!-- 消息群发的发送页面 -->
<template>
    <div class="view-messaging-sent">
        <!-- 左侧导航开始 -->
        <div class="messaging-left-nav">
            <div class="messaging-category category-active">
                <img src="static\image\logo_a.png" class="messaging-category-img">
                <span>全部</span>
            </div>
            <div class="messaging-category">
                <img src="static\image\logo_a.png" class="messaging-category-img">
                <span>公告</span>
            </div>
            <div class="messaging-category">
                <img src="static\image\logo_a.png" class="messaging-category-img">
                <span>服务器警告通知</span>
            </div>
        </div>
        <!-- 左侧导航结束 -->
        <!-- 右侧内容开始 -->
        <div class="messaging-right">
            <!-- 内容上侧导航 -->
            <div class="content-nav">
              <div class="nav-state">状态</div>
              <div class="nav-type">消息类型</div>
              <div class="nav-theme">消息主题</div>
              <div class="nav-time">时间</div>
              <div class="nav-operation">操作</div>
              <div class="iconfont icon-fenxiang nav-tag"></div>
            </div>
            <div class="messaging-right-content">
                <!-- 内容下侧消息开始 -->
                <div class="content-news" v-for="arr in [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]">
                    <!-- 发送状态 -->
                    <div class="nav-state">
                      <img src="static\image\删除.png" style="height: 15px;width: 15px" />
                      <span style="padding-left: 3px">未发送</span>
                    </div>
                    <!-- 消息类型 -->
                    <div class="nav-type">公告</div>
                    <!-- 消息主题 -->
                    <div class="nav-theme">这里是消息的主题</div>
                    <!-- 时间 -->
                    <div class="nav-time">2020年9月4日</div>
                    <!-- 操作 -->
                    <div class="nav-operation"></div>
                    <!-- 是否标记 -->
                    <div class="iconfont icon-xiugaibianji nav-tag"></div>
                </div>
                <!-- 内容下侧消息结束 -->
            </div>
        </div>
        <!-- 右侧内容结束 -->
    </div>
</template>

<script>
    export default {
        name: "view-messaging-sent"
    }
</script>

<style scoped>
  .view-messaging-sent{
    display: flex;
    height: 500px;
  }
  /* 左侧导航样式 */
  .messaging-left-nav{
    width: 16%;
    border-right: 1px solid #DCE1E6;
    background-color: #F9FAFC;
    padding-top: 15px;
    text-align: left;
  }
  .messaging-category{
    padding: 10px 0 10px 15px;
  }
  .messaging-category span{
    line-height: 25px;
    height: 25px;
    display: inline-block;
    padding-left: 3px;
  }
  .category-active{
    background-color: #4A77AC;
    color: #FFFFFF;
  }
  .messaging-category-img{
    height: 25px;
    width: 25px;
  }
  /* 右侧内容样式 */
  .messaging-right{
    width: 87%;
  }
  .messaging-right-content{
    margin-left: 5%;
    height: 440px;
    overflow-y: scroll;
    width:calc(90% + 5px);
  }
  .content-nav{
    width: 90%;
    margin-left: 5%;
    height: 25px;
    line-height: 25px;
    background-color: #FAFBFC;
    font-size: 12px;
    display: flex;
    color: #787878;
    border-top: 1px solid #E4E6E9;
    border-bottom: 1px solid #E4E6E9;
    margin-top: 15px;
  }
  .nav-state{
    width: 12%;
    text-align: left;
    padding-left: 10px;
    color: #787878;
  }
  .nav-type{
    width: 12%;
    text-align: left;
    padding-left: 10px;
  }
  .nav-theme{
    width: 40%;
    text-align: left;
    padding-left: 10px;
  }
  .nav-time{
    width: 17%;
    text-align: left;
    padding-left: 10px;
    color: #787878;
  }
  .nav-operation{
    width: 15%;
    text-align: left;
    padding-left: 10px;
  }
  .nav-tag{
    width: 4%;
    text-align: center;
  }
  .content-nav .nav-state,
  .content-nav .nav-type,
  .content-nav .nav-theme,
  .content-nav .nav-time,
  .content-nav .nav-operation{
    border-right: 1px solid #E4E6E9;
    text-align: left;
    padding-left: 10px;
  }
  .content-news{
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px solid #E4E6E9;
  }
  .content-news:hover{
    background-color: #F5F5F5;
    cursor: pointer;
  }
  .content-news:active{
    background-color: #ededed;
  }
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track-piece {
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }
</style>
