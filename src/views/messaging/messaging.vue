<!-- 消息群发的主页面 -->
<template>
    <div class="messaging">
      <header-nav2></header-nav2>
      <!-- 导航栏 begin  -->
      <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
          <div class="location">
              <div class="localtion-title"><b>当前位置:</b></div>
              <ul class="localtion-list">
                  <li class="localtion-item" @click="toback('/begin-class')" style="cursor: pointer">
                      管理看板
                  </li>
                  <li class="localtion-item">
                      <span style="color: #959da0">消息群发</span>
                  </li>
              </ul>
          </div>
          <div class="question-back">
              <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/begin-class')"></i>
              <span @click="toback('/begin-class')">返回</span>
          </div>
      </div>
      <!-- 导航栏end -->
      <div class="messaging-all">
        <!-- 消息群发导航栏开始 -->
        <div class="messaging-nav ">
          <div :class="['messaging-send',isShowSend?'messaging-active':'']" @click="SwitchMessagingModel(true)">发信息</div>
          <div :class="['messaging-sent',isShowSend?'':'messaging-active']" @click="SwitchMessagingModel(false)">已发送</div>
        </div>
        <!-- 发信息页面 -->
        <write-messaging-send v-if="isShowSend"></write-messaging-send>
        <!-- 已发送页面 -->
        <view-messaging-sent v-if="!isShowSend"></view-messaging-sent>
      </div>
      <!-- 消息群发导航栏结束 -->
      <footer-nav></footer-nav>
    </div>
</template>

<script>
    import headernav2 from '@/components/header-nav-start-class'
    import FooterNav from '@/components/footer-nav-not-info'
    import WriteMessagingSend from '@/views/messaging/write-messaging-send'
    import ViewMessagingSent from '@/views/messaging/view-messaging-sent'
    export default {
        name: "messaging",
        components: {
          "header-nav2":headernav2,
          "footer-nav":FooterNav,
          "write-messaging-send":WriteMessagingSend,
          "view-messaging-sent":ViewMessagingSent,
        },
        data () {
          return {
            isShowSend:true, //当前是否是发消息页
          }
        },
        methods:{
          //发信息页面和已发送页面切换
          SwitchMessagingModel(value){
            this.isShowSend = value;
          },
          /** 返回 */
          toback: function (url) {
            this.$router.push(url)
          }
        },
    }
</script>

<style scoped>
  .messaging-all{
    width: 1200px;
    margin:20px auto;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    background: white;
  }
  /* 消息群发导航栏样式 */
  .messaging-nav{
    display: flex;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 10px 0;
    border-bottom: 1px solid #DCE1E6;
  }
  .messaging-send, .messaging-sent{
    background-color: #FCFCFC;
    border: 1px solid #aaaaaa;
    padding: 5px 40px;
    font-size: 14px;
    cursor: pointer;
  }
  .messaging-send{
    border-right: none;
  }
  .messaging-active{
    background-color: #aaaaaa;
    color: #FFFFFF;
  }
  /* 返回 */
  .test-question-bank-nav{
      /* width: 100%; */
      display: flex;
  }
  .test-question-bank-nav2{
      display: flex;

      margin: 20px auto;
      background-color: #fff;
      -webkit-box-shadow: 2px 2px 2px #e0e0e0;
      box-shadow: 2px 2px 2px #e0e0e0;
      border: 1px #e0e0e0 solid;
      border-radius: 6px;
  }
  .question-back{
      width: 100%;
      text-align: right;
      font-size: 14px;
      margin: 20px;
      cursor: pointer;
      color: #158aeb;
  }
  .question-back-icon{
      font-size: 14px;
      margin-right: 5px
  }
</style>
