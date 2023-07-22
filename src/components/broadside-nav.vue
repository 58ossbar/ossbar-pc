<!-- 首页悬浮组件 -->
<template>
    <div class="all">
      <ul style="list-style: none;">
        <li @click="toTop">
          <div><i class="fa fa-arrow-circle-o-up" aria-hidden="true" style="font-size: 20px;"></i></div>
          <div style="font-size: 12px;">返回顶部</div>
        </li>
        <div style="width: 100%;height: 1px;background: #e0e0e0"></div>
        <li class="showEwm">
          <div><i class="fa fa-mobile" aria-hidden="true" style="font-size: 20px;"></i></div>
          <div style="font-size: 12px;">下载APP</div>
          <div class="ewmTop">
            <img src="../../static/image/ewm.png" alt="" width="150" height="150" style="padding: 5px">
            <div style="font-size: 14px">扫描布道师二维码查看布道师小程序</div>
          </div>
        </li>
        <div style="width: 100%;height: 1px;background: #e0e0e0"></div>
        <li>
          <div><i class="fa fa-comments-o" aria-hidden="true" style="font-size: 20px;"></i></div>
          <div @click="toCustomer()" style="font-size: 12px;">在线客服</div>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        methods:{
          toTop:function(){
            scroll(0,0)
          },
          //在线客服
          toCustomer:function(){
            this.$router.push("/Customer");
          },
        }
    }
</script>

<style scoped>
.all{
  position: fixed;
  right: 0;
  bottom: 10px;
  z-index: 999;
}
  li{
    padding: 15px  2px 15px  2px;
    cursor: pointer;
    background: white;
    color: #c9c9c9
  }
  li:hover {
    color: #158aeb;
  }
  .ewmTop{
    position: absolute;
    top: 20px;
    right:80px;
    z-index: auto;
    background: white;
    color: #838383;
    display:none
  }
  .showEwm:hover .ewmTop {
    display:block;
  }
</style>
