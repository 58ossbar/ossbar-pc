<template>
  <footer class="main-footer sticky footer-type-1">
    <div class="footer-inner">
      <!-- 版权信息 -->
      <div class="footer-text">
        &copy; 2017-2019
        <a href="#"><strong>WebStack</strong></a> 
        design by <a href="http://viggoz.com" target="_blank"><strong>Viggo</strong></a>
      </div>
      
      <div class="go-up">
        <a href="#" rel="go-top"><i class="fa-angle-up"></i></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
/* @import '@/static/creatorblue/resources/fonts/linecons/css/linecons.css';
@import '@/static/creatorblue/resources/fonts/fontawesome/css/font-awesome.min.css';
@import '@/static/creatorblue/resources/css/xenon-core.css';
@import '@/static/creatorblue/resources/css/xenon-components.css';
@import '@/static/creatorblue/resources/css/xenon-skins.css';
@import '@/static/creatorblue/resources/css/nav.css'; */
  footer.main-footer {
      padding: 20px 30px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      margin-left: -30px;
      margin-right: -30px;
      margin-top: 10px;
      background-color: #f9f9f9;
  }

  footer.main-footer:before,
  footer.main-footer:after {
      content: " ";
      display: table
  }

  footer.main-footer:after {
      clear: both
  }

  footer.main-footer:before,
  footer.main-footer:after {
      content: " ";
      display: table
  }

  footer.main-footer:after {
      clear: both
  }

  .page-container+footer.main-footer {
      margin-left: 0;
      margin-right: 0
  }

  .page-container+footer.main-footer .footer-inner {
      max-width: 1080px;
      margin-left: auto;
      margin-right: auto
  }

  footer.main-footer .footer-text {
      float: left
  }

  footer.main-footer .go-up {
      float: right;
      margin-bottom: 20px
  }

  footer.main-footer .go-up a {
      display: inline-block;
      background-color: rgba(44, 46, 47, .05);
      padding: 2px 5px
  }

  footer.main-footer .go-up a:hover {
      background-color: rgba(44, 46, 47, .1)
  }

  footer.main-footer.footer-type-2 {
      background-color: #252729;
      border-top: 0;
      color: #fff
  }

  footer.main-footer.footer-type-2 a {
      color: #fff
  }

  footer.main-footer.footer-type-2 .go-up a {
      background-color: rgba(255, 255, 255, .05)
  }

  footer.main-footer.footer-type-2 .go-up a:hover {
      background-color: rgba(255, 255, 255, .1)
  }

  footer.main-footer.fixed {
      position: fixed;
      left: 0px;
      right: 0;
      bottom: 0;
      margin-left: 0;
      margin-right: 0;
      margin-top: 10px!important
  }
</style>
