<template>
  <div class="page-container" style="text-align: left;">
    <el-menu :collapse="isCollapse" class="el-menu-vertical-demo sidebar-menu toggle-others fixed" background-color="#313437" text-color="#fff" unique-opened @open="handleOpen" @close="handleClose">
      <div class="sidebar-menu-inner">
        <div class="header-img">
          <img v-show="!isCollapse" src="static/image/indexLog.png" style="width:120px;height:40px" >
          <img v-show="isCollapse" src="static/image/bdsLogo.png" style="width:40px;height:40px" >
        </div>
        <div v-for="(menu, idx) in leftListData" :key="idx">
          <el-submenu v-if="menu.children && menu.children.length>0" :index="idx + ''">
            <template slot="title">
              <i :class="menu.icon"/>
              <span v-if="!isCollapse" slot="title">{{ menu.name }}</span>
            </template>
            <el-menu-item v-for="(submenu, idx1) in menu.children" :key="idx1" :index="idx + '-' + idx1" @click.native="moveSlow(submenu.name)">{{ submenu.name }}</el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="idx + ''" class="menu-item" @click.native="moveSlow(menu.name)">
            <i :class="menu.icon"/>
            <span slot="title">{{ menu.name }}</span>
          </el-menu-item>
        </div>
      </div>
    </el-menu>

    <div class="main-content">
      <nav class="navbar user-info-navbar" role="navigation">
        <ul class="user-info-menu left-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs">
            <span @click="isCollapse = !isCollapse"><i class="fa-bars"/></span>
          </li>
        </ul>
      </nav>

      <div v-for="(item, idx) in leftListData" :key="idx">
        <div v-if="item.web">
          <WebItem ref="webItem" :item="item" />
        </div>
        <div v-for="(subItem, idx) in item.children" :key="idx">
          <WebItem ref="webItem" :item="subItem" />
        </div>
      </div>

      <!-- <Footer /> -->
      <el-backtop/>
    </div>
  </div>
</template>

<script>
import WebItem from '@/components/cb-my-resources/web-item.vue'
import Footer from '@/components/cb-my-resources/footer.vue'
import '@/assets/resources/fonts/linecons/css/linecons.css'
import '@/assets/resources/fonts/fontawesome/css/font-awesome.min.css'
import { baseUrl, toast } from '@/utils/global'

export default {
  name: 'Index',
  components: {
    WebItem,
    Footer
  },
  data() {
    return {
      leftListData: [],
      isCollapse: true
    }
  },
  created() {
    this.getLeftList()
  },
  methods: {
    handleOpen(key, keyPath) {
      const value = this.leftListData[parseInt(key)].name
      if (this.leftListData[parseInt(key)].web && this.leftListData[parseInt(key)].web.length > 0) { this.moveSlow(value) }
    },
    handleClose(key, keyPath) {
      const value = this.leftListData[parseInt(key)].name
      if (this.leftListData[parseInt(key)].web && this.leftListData[parseInt(key)].web.length > 0) { this.moveSlow(value) }
    },
    // 获取左侧列表
    getLeftList() {
      this.$api.resources.queryTypeList().then(res => {
        if (res.code === 0) {
          this.leftListData = res.data
          this.processingImg(this.leftListData)
        } else {
          toast(res.msg)
        }
      })
    },
    // 递归处理图片地址
    processingImg() {
      arguments[0].forEach(item => {
        if (item.web) {
          item.web.forEach(a => {
            if (a.icon && !a.icon.includes('http://') && !a.icon.includes('https://')) {
              a.icon = baseUrl + a.icon
              a.logo = a.icon
            }
          })
        }
        if (item.children && item.children.length > 0) {
          this.processingImg(item.children)
        }
      })
    },
    moveSlow(value) {
      console.log(value)
      const height = document.getElementById(value).offsetTop
      document.documentElement.scrollTop = height
    }
  }
}
</script>

<style>
/* @import '@/assets/resources/fonts/linecons/css/linecons.css';
@import '@/assets/resources/fonts/fontawesome/css/font-awesome.min.css';
@import '@/assets/resources/css/xenon-core.css';
@import '@/assets/resources/css/xenon-components.css';
@import '@/assets/resources/css/xenon-skins.css';
@import '@/assets/resources/css/nav.css'; */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
}
.header-img{
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-container {
    display: table;
    width: 100%;
    height: 100%;
    vertical-align: top;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed
}

.boxed-container .page-container {
    max-width: 1140px;
    margin: 20px auto
}

@media screen and (max-width:768px) {
    .boxed-container .page-container {
        margin: 0
    }
}

.page-container.container {
    max-width: 1140px;
    table-layout: auto
}

.page-container .main-content {
    display: table-cell;
    position: relative;
    z-index: 1;
    padding: 30px;
    padding-bottom: 0;
    vertical-align: top;
    word-break: break-word;
    width: 100%;
    -webkit-transition: opacity 100ms ease-in-out;
    -moz-transition: opacity 100ms ease-in-out;
    -o-transition: opacity 100ms ease-in-out;
    transition: opacity 100ms ease-in-out
}

.page-container .main-content.is-loading {
    zoom: 1;
    filter: alpha(opacity=50);
    -webkit-opacity: .5;
    -moz-opacity: .5;
    opacity: .5;
    -webkit-transition: opacity 300ms ease-in-out;
    -moz-transition: opacity 300ms ease-in-out;
    -o-transition: opacity 300ms ease-in-out;
    transition: opacity 300ms ease-in-out
}

.boxed-container .page-container .main-content {
    background-color: #f9f9f9
}

.page-container .main-content:hover {
    z-index: 15
}

.page-container .main-content .page-title {
    background: #f8f8f8;
    margin: -30px;
    margin-bottom: 30px;
    padding: 20px 0;
    -webkit-box-shadow: 0 1px 0 rgba(0, 1, 1, .08), inset 0 1px 0 #ededed;
    -moz-box-shadow: 0 1px 0 rgba(0, 1, 1, .08), inset 0 1px 0 #ededed;
    box-shadow: 0 1px 0 rgba(0, 1, 1, .08), inset 0 1px 0 #ededed
}

@media screen and (max-width:768px) {
    .page-container .main-content .page-title {
        padding: 15px 0
    }
}

.page-container .main-content .page-title.full-width .title-env {
    width: 100%;
    padding-right: 30px
}

.page-container .main-content .page-title .title-env,
.page-container .main-content .page-title .breadcrumb-env {
    display: block
}

.page-container .main-content .page-title .title-env {
    float: left;
    padding-left: 30px
}

.page-container .main-content .page-title .title-env .title {
    margin: 0;
    font-size: 27px
}

@media screen and (max-width:768px) {
    .page-container .main-content .page-title .title-env .title {
        font-size: 23px
    }
    .page-container .main-content .page-title .title-env .title+p {
        font-size: 12px
    }
}

@media screen and (max-width:480px) {
    .page-container .main-content .page-title .title-env .title {
        font-size: 19px
    }
}

.page-container .main-content .page-title .title-env .title+p {
    margin: 0;
    margin-top: 5px;
    color: #979898
}

.page-container .main-content .page-title .breadcrumb-env {
    float: right;
    padding-right: 30px
}

@media screen and (max-width:480px) {
    .page-container .main-content .page-title .breadcrumb-env {
        clear: both;
        float: none;
        padding: 0 10px
    }
}

.page-container .main-content .page-title .breadcrumb-env .breadcrumb {
    margin-bottom: 0;
    margin-top: 8px
}

@media screen and (max-width:768px) {
    .page-container .main-content .page-title .breadcrumb-env .breadcrumb {
        margin-top: 4px
    }
    .page-container .main-content .page-title .breadcrumb-env .breadcrumb li a {
        font-size: 12px
    }
}

.sidebar-menu {
    display: table-cell;
    position: relative;
    min-width: 80px;
    background: #2c2e2f;
    z-index: 1
}

.sidebar-menu .logo-env {
    padding: 19px 45px;
    border-bottom: 1px solid #313437
}

.sidebar-menu .logo-env .logo {
    float: left
}

.sidebar-menu .logo-env .logo .logo-collapsed {
    display: none
}

.sidebar-menu .logo-env .settings-icon {
    float: right;
    position: relative;
    top: 1px
}

.sidebar-menu .logo-env .settings-icon a {
    color: #979898;
    line-height: 1
}

.sidebar-menu .logo-env .settings-icon a i {
    line-height: 1;
    font-size: 18px
}

.sidebar-menu .logo-env .settings-icon a:hover {
    color: #fff
}

.sidebar-menu .main-menu {
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    list-style: none
}

@media screen and (max-width:768px) {
    .sidebar-menu .main-menu {
        margin-top: 10px;
        margin-bottom: 10px
    }
}

.sidebar-menu .main-menu a {
    color: #979898;
    text-decoration: none;
    display: block;
    padding: 13px 5px;
    border-bottom: 1px solid #313437
}

.sidebar-menu .main-menu a>i {
    display: inline-block;
    margin-right: 10px
}

.sidebar-menu .main-menu a>i+span {
    padding-right: 10px
}

.sidebar-menu .main-menu a>span {
    display: inline-block
}

.sidebar-menu .main-menu a>.label {
    margin-top: 1px
}

.sidebar-menu .main-menu a>.badge {
    font-size: 75%;
    line-height: 1.2
}

.sidebar-menu .main-menu a:hover {
    color: #fff
}

.sidebar-menu .main-menu li.active>a {
    color: #fff
}

.sidebar-menu .main-menu li.has-sub>a:before {
    position: relative;
    display: inline-block;
    font-family: FontAwesome;
    content: '\f107';
    float: right;
    color: #6d747a;
    margin-left: 10px;
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotate(-90deg);
    -webkit-transition: all 150ms ease-in-out;
    -moz-transition: all 150ms ease-in-out;
    -o-transition: all 150ms ease-in-out;
    transition: all 150ms ease-in-out
}

.sidebar-menu .main-menu li.has-sub.opened>a:before,
.sidebar-menu .main-menu li.has-sub.expanded>a:before {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg)
}

.sidebar-menu .main-menu>li.opened>ul {
    display: block
}

.sidebar-menu .main-menu>li.opened .opened>ul {
    display: block
}

.sidebar-menu .main-menu ul {
    display: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    list-style: none
}

.sidebar-menu .main-menu ul li {
    position: relative
}

@media screen and (min-width:768px) {
    .sidebar-menu .main-menu ul li.is-hidden {
        left: -20px;
        zoom: 1;
        filter: alpha(opacity=0);
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0
    }
}

.sidebar-menu .main-menu ul li.is-shown {
    left: 0;
    zoom: 1;
    filter: alpha(opacity=100);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
    -webkit-transition: all 200ms ease-in-out;
    -moz-transition: all 200ms ease-in-out;
    -o-transition: all 200ms ease-in-out;
    transition: all 200ms ease-in-out
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown {
    -webkit-transition-delay: 80ms;
    -moz-transition-delay: 80ms;
    -o-transition-delay: 80ms;
    transition-delay: 80ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 120ms;
    -moz-transition-delay: 120ms;
    -o-transition-delay: 120ms;
    transition-delay: 120ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 160ms;
    -moz-transition-delay: 160ms;
    -o-transition-delay: 160ms;
    transition-delay: 160ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 200ms;
    -moz-transition-delay: 200ms;
    -o-transition-delay: 200ms;
    transition-delay: 200ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 240ms;
    -moz-transition-delay: 240ms;
    -o-transition-delay: 240ms;
    transition-delay: 240ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 280ms;
    -moz-transition-delay: 280ms;
    -o-transition-delay: 280ms;
    transition-delay: 280ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 320ms;
    -moz-transition-delay: 320ms;
    -o-transition-delay: 320ms;
    transition-delay: 320ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 360ms;
    -moz-transition-delay: 360ms;
    -o-transition-delay: 360ms;
    transition-delay: 360ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 400ms;
    -moz-transition-delay: 400ms;
    -o-transition-delay: 400ms;
    transition-delay: 400ms
}

.sidebar-menu .main-menu ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
    -webkit-transition-delay: 440ms;
    -moz-transition-delay: 440ms;
    -o-transition-delay: 440ms;
    transition-delay: 440ms
}

.sidebar-menu .main-menu ul li.hidden-item {
    visibility: hidden;
    zoom: 1;
    filter: alpha(opacity=0);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
    -webkit-transition: all 250ms ease-in-out;
    -moz-transition: all 250ms ease-in-out;
    -o-transition: all 250ms ease-in-out;
    transition: all 250ms ease-in-out
}

.sidebar-menu .main-menu ul li a {
    padding-left: 35px
}

.sidebar-menu .main-menu ul li ul li a {
    padding-left: 60px
}

.sidebar-menu .main-menu ul li ul li ul li a {
    padding-left: 85px
}

.sidebar-menu .main-menu ul li ul li ul li ul li a {
    padding-left: 110px
}

.sidebar-menu .ps-scrollbar-x-rail .ps-scrollbar-x,
.sidebar-menu .ps-scrollbar-y-rail .ps-scrollbar-y {
    background-color: rgba(255, 255, 255, .6)
}

.sidebar-menu.fixed {
    height: 100vh;
}

.sidebar-menu.fixed .sidebar-menu-inner {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: inherit;
    overflow: hidden
}

.page-body.right-sidebar .sidebar-menu.fixed .sidebar-menu-inner {
    left: auto;
    right: 0
}

@media screen and (min-width:768px) {
    .sidebar-menu.collapsed {
        width: 80px;
        z-index: 10;
        overflow: visible
    }
    .sidebar-menu.collapsed .hidden-collapsed {
        display: none!important
    }
    .sidebar-menu.collapsed+.main-content .user-info-navbar .user-info-menu a[data-toggle=sidebar] {
        color: #606161
    }
    .sidebar-menu.collapsed+.main-content .main-footer {
        left: 80px
    }
    .sidebar-menu.collapsed .sidebar-menu-inner {
        overflow: visible;
        position: relative
    }
    .sidebar-menu.collapsed .logo-env {
        padding: 18px 0
    }
    .sidebar-menu.collapsed .logo-env .logo-collapsed {
        display: block;
        text-align: center
    }
    .sidebar-menu.collapsed .logo-env .logo-collapsed img {
        display: inline-block
    }
    .sidebar-menu.collapsed .logo-env .logo-expanded,
    .sidebar-menu.collapsed .logo-env .settings-icon {
        display: none
    }
    .sidebar-menu.collapsed .logo-env .logo {
        float: none
    }
    .sidebar-menu.collapsed .main-menu {
        padding-left: 0;
        padding-right: 0
    }
    .sidebar-menu.collapsed .main-menu>li {
        text-align: center;
        position: relative
    }
    .sidebar-menu.collapsed .main-menu>li.active,
    .sidebar-menu.collapsed .main-menu>li li.active {
        background-color: #252627
    }
    .sidebar-menu.collapsed .main-menu>li>a>i {
        margin-right: 0;
        font-size: 16px
    }
    .sidebar-menu.collapsed .main-menu>li>a>span {
        display: none
    }
    .sidebar-menu.collapsed .main-menu>li>a>span.label {
        display: block;
        position: absolute;
        right: 0;
        top: 0
    }
    .sidebar-menu.collapsed .main-menu>li.has-sub>a:before {
        display: none
    }
    .sidebar-menu.collapsed .main-menu>li.opened>ul {
        display: none
    }
    .sidebar-menu.collapsed .main-menu>li>ul {
        position: absolute;
        background: #2c2e2f;
        width: 250px;
        top: 0;
        left: 100%;
        text-align: left
    }
    .page-body.right-sidebar .sidebar-menu.collapsed .main-menu>li>ul {
        left: auto;
        right: 100%
    }
    .sidebar-menu.collapsed .main-menu>li>ul>li>a {
        padding-left: 20px
    }
    .sidebar-menu.collapsed .main-menu>li>ul>li>ul>li>a {
        padding-left: 35px
    }
    .sidebar-menu.collapsed .main-menu>li>ul>li>ul>li>ul>li>a {
        padding-left: 50px
    }
    .sidebar-menu.collapsed .main-menu>li>ul>li>ul>li>ul>li>ul>li>a {
        padding-left: 65px
    }
    .sidebar-menu.collapsed .main-menu>li>ul>li>ul>li>ul>li>ul>li>ul>li>a {
        padding-left: 80px
    }
    .sidebar-menu.collapsed .main-menu>li>ul li.has-sub>a:before {
        margin-right: 10px
    }
    .sidebar-menu.collapsed .main-menu>li:hover>ul {
        display: block
    }
}

.page-body.right-sidebar .page-container {
    direction: rtl
}

.page-body.right-sidebar .page-container>* {
    direction: ltr
}

.navbar.horizontal-menu {
    position: relative;
    height: 85px;
    background: #fff;
    margin: 0;
    padding: 0;
    z-index: 101;
    min-height: 0;
    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .15);
    -moz-box-shadow: 0 0 1px rgba(0, 0, 0, .15);
    box-shadow: 0 0 1px rgba(0, 0, 0, .15)
}

.navbar.horizontal-menu.navbar-fixed-top {
    position: fixed;
    left: 0;
    right: 0;
    top: 0
}

.navbar.horizontal-menu.navbar-fixed-top+.page-container {
    margin-top: 85px
}

.navbar.horizontal-menu.navbar-fixed-top+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
    top: 85px
}

.settings-pane-open .navbar.horizontal-menu.navbar-fixed-top {
    position: relative
}

.settings-pane-open .navbar.horizontal-menu.navbar-fixed-top+.page-container {
    margin-top: 0
}

.settings-pane-open .navbar.horizontal-menu.navbar-fixed-top+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
    top: 0
}

.settings-pane-open .navbar.horizontal-menu.navbar-minimal+.page-container {
    margin-top: 0!important
}

.navbar.horizontal-menu+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
    top: 85px
}

.navbar.horizontal-menu .navbar-inner .navbar-brand {
    padding: 0 30px;
    margin: 0;
    float: left;
    height: 85px;
    display: table
}

.navbar.horizontal-menu .navbar-inner .navbar-brand:hover a[data-toggle=settings-pane] {
    zoom: 1;
    filter: alpha(opacity=100);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1
}

.settings-pane-open .navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane] {
    zoom: 1;
    filter: alpha(opacity=100);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1
}

.settings-pane-open .navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane] i {
    color: #2c2e2f
}

.navbar.horizontal-menu .navbar-inner .navbar-brand a {
    display: table-cell;
    vertical-align: middle
}

.navbar.horizontal-menu .navbar-inner .navbar-brand a.logo img {
    margin: 0
}

.navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane] {
    padding-left: 10px;
    zoom: 1;
    filter: alpha(opacity=0);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0
}

.navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane] i {
    display: block;
    line-height: 1;
    font-size: 12px;
    color: #979898;
    margin-top: 1px
}

.navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane]:hover i {
    color: #2c2e2f
}

@media screen and (min-width:768px) {
    .navbar.horizontal-menu .navbar-inner .navbar-nav {
        list-style: none;
        padding: 0;
        margin: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav.click-to-expand .has-sub:hover>a:before {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav.click-to-expand .has-sub.expanded>a:before {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg)
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a {
        position: relative;
        display: inline-block;
        line-height: 1;
        color: #7d7f7f;
        z-index: 1
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>i {
        display: inline-block;
        margin-right: 5px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>.label.pull-right {
        margin-top: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>.title {
        display: inline-block
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>.title+.badge {
        margin-left: 7px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav li:hover>a,
    .navbar.horizontal-menu .navbar-inner .navbar-nav li.active>a {
        color: #313232
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li {
        position: relative;
        z-index: 1;
        line-height: 85px;
        border: 1px solid transparent;
        border-top: 0;
        border-bottom: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li:hover {
        z-index: 2
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.active,
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li:hover {
        border-color: #f3f3f3;
        background-color: #fafafa
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.active {
        margin-left: -1px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.active+li:hover {
        border-left-color: transparent
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li>a {
        padding: 0 15px;
        line-height: 85px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li>ul {
        position: absolute;
        min-width: 270px;
        border: 1px solid #eee;
        visibility: hidden;
        display: block;
        left: -1px;
        -webkit-border-radius: 0;
        -webkit-background-clip: padding-box;
        -moz-border-radius: 0;
        -moz-background-clip: padding;
        border-radius: 0;
        background-clip: padding-box;
        -webkit-box-shadow: 0 2px 8px rgba(0, 1, 1, .05);
        -moz-box-shadow: 0 2px 8px rgba(0, 1, 1, .05);
        box-shadow: 0 2px 8px rgba(0, 1, 1, .05);
        -webkit-transition: opacity 180ms linear, visibility 180ms linear;
        -moz-transition: opacity 180ms linear, visibility 180ms linear;
        -o-transition: opacity 180ms linear, visibility 180ms linear;
        transition: opacity 180ms linear, visibility 180ms linear;
        zoom: 1;
        filter: alpha(opacity=0);
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.hover>ul {
        visibility: visible;
        zoom: 1;
        filter: alpha(opacity=100);
        -webkit-opacity: 1;
        -moz-opacity: 1;
        opacity: 1
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul {
        position: relative;
        display: none;
        list-style: none;
        padding: 0;
        margin: 0;
        top: 100%;
        min-width: 100%;
        background: #fff;
        z-index: 2
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul ul {
        display: block;
        height: 0;
        overflow: hidden;
        visibility: hidden;
        zoom: 1;
        filter: alpha(opacity=0);
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0;
        -webkit-transition: opacity 350ms linear;
        -moz-transition: opacity 350ms linear;
        -o-transition: opacity 350ms linear;
        transition: opacity 350ms linear
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul ul.is-visible {
        height: auto;
        visibility: visible;
        zoom: 1;
        filter: alpha(opacity=100);
        -webkit-opacity: 1;
        -moz-opacity: 1;
        opacity: 1
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li:last-child>a:after {
        display: none
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li {
        line-height: 1;
        margin: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li>a {
        position: relative;
        display: block;
        white-space: nowrap;
        padding: 15px 25px;
        color: #979898
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li>a:after {
        content: '';
        position: absolute;
        left: 25px;
        right: 25px;
        bottom: 0;
        background: #eee;
        height: 1px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li.active>a {
        color: #313232;
        background: #fafafa;
        border-top: 1px solid #eee;
        margin-top: -2px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li.active>a:after {
        left: 0;
        right: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li.has-sub>a:before {
        content: '\f105';
        font-family: FontAwesome;
        display: block;
        float: right;
        color: #979898;
        position: relative;
        margin-left: 10px;
        line-height: 1.3;
        -webkit-transform-origin: center center;
        -moz-transform-origin: center center;
        -o-transform-origin: center center;
        -ms-transform-origin: center center;
        transform-origin: center center
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li.has-sub:hover>a:before,
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li.has-sub.expanded>a:before {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg)
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li ul {
        background: #f6f6f6;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-top: -1px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li ul ul {
        background: #f1f1f1;
        border-top-color: #e7e7e7;
        border-bottom-color: #e7e7e7
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li ul ul a:after {
        background-color: #e7e7e7
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li ul ul ul {
        background: #ececec;
        border-top-color: #e2e2e2;
        border-bottom-color: #e2e2e2
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul>li ul ul ul a:after {
        background-color: #e2e2e2
    }
}

.navbar.horizontal-menu .navbar-inner .navbar-mobile-clear {
    display: block
}

.navbar.horizontal-menu .navbar-inner>.nav {
    list-style: none;
    margin: 0;
    padding: 0
}

.navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile {
    display: none
}

.navbar.horizontal-menu .navbar-inner>.nav>li {
    line-height: 85px;
    display: inline-block
}

.navbar.horizontal-menu .navbar-inner>.nav>li i {
    font-size: 15px;
    color: #979898;
    line-height: 1
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a {
    position: relative;
    padding: 0 15px;
    margin: 0;
    border: 1px solid transparent;
    border-top: 0;
    border-bottom: 0;
    z-index: 2
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a:hover {
    background: #fafafa
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a:hover i {
    color: #717272
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon {
    padding: 0 20px
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon:before {
    content: '';
    position: absolute;
    height: 2px;
    top: 0;
    left: 0;
    right: 0;
    background: #68b828;
    display: none
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon:hover:before {
    display: block
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon i {
    margin-right: 2px
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon .badge {
    font-size: 9px;
    position: absolute;
    top: 50%;
    right: 10px;
    padding: 4px;
    min-width: 18px;
    font-weight: 400;
    line-height: 1;
    margin-top: -20px
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon.notification-icon-messages:before {
    background-color: #7c38bc
}

.navbar.horizontal-menu .navbar-inner>.nav>li>a[data-toggle=chat] {
    padding: 0 20px
}

.chat-open .navbar.horizontal-menu .navbar-inner>.nav>li>a[data-toggle=chat] i {
    color: #717272
}

.navbar.horizontal-menu .navbar-inner>.nav>li.open>a.notification-icon {
    background-color: #fff;
    border-color: #f3f3f3;
    color: #717272
}

.navbar.horizontal-menu .navbar-inner>.nav>li.open>a.notification-icon i {
    color: #717272
}

.navbar.horizontal-menu .navbar-inner>.nav>li.open>a.notification-icon:before {
    display: block
}

.navbar.horizontal-menu .navbar-inner>.nav>li>ul {
    z-index: 1;
    border-color: #f3f3f3
}

.navbar.horizontal-menu .navbar-inner>.nav>li.search-form {
    padding: 0 20px
}

.navbar.horizontal-menu .navbar-inner>.nav>li.user-profile>a {
    border: 1px solid transparent;
    border-top: 0;
    border-bottom: 0
}

.navbar.horizontal-menu .navbar-inner>.nav>li.user-profile>a:focus {
    background-color: #fff
}

.navbar.horizontal-menu .navbar-inner>.nav>li.user-profile.open>a {
    background-color: #fff;
    border-color: #f3f3f3
}

.navbar.horizontal-menu .navbar-inner>.nav>li.user-profile.open>.dropdown-menu {
    margin-left: -1px
}

.navbar.horizontal-menu .navbar-inner>.nav>li .dropdown-menu {
    line-height: 1.42857143
}

.navbar.horizontal-menu .navbar-inner>.nav>li .dropdown-menu.messages,
.navbar.horizontal-menu .navbar-inner>.nav>li .dropdown-menu.notifications,
.navbar.horizontal-menu .navbar-inner>.nav>li .dropdown-menu.user-profile-menu {
    z-index: 1;
    margin-top: -1px
}

.navbar.horizontal-menu .navbar-inner>.nav>li .dropdown-menu.user-profile-menu {
    right: 0!important
}

@media screen and (min-width:767px) and (max-width:992px) {
    .navbar.horizontal-menu .navbar-inner .navbar-brand {
        padding: 0 15px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li {
        line-height: 84px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li>a {
        padding: 0 10px;
        font-size: 12px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li>a>.badge {
        display: none
    }
    .navbar.horizontal-menu .navbar-inner>.nav>li i {
        font-size: 13px
    }
    .navbar.horizontal-menu .navbar-inner>.nav>li>a.notification-icon {
        padding-left: 15px;
        padding-right: 15px
    }
    .navbar.horizontal-menu .navbar-inner>.nav>li.user-profile>a>span {
        display: none!important
    }
}

.navbar.horizontal-menu.click-to-expand .has-sub:hover>a:before {
    -webkit-transform: rotate(0deg)!important;
    -moz-transform: rotate(0deg)!important;
    -o-transform: rotate(0deg)!important;
    -ms-transform: rotate(0deg)!important;
    transform: rotate(0deg)!important
}

.navbar.horizontal-menu.click-to-expand .has-sub.expanded>a:before {
    -webkit-transform: rotate(90deg)!important;
    -moz-transform: rotate(90deg)!important;
    -o-transform: rotate(90deg)!important;
    -ms-transform: rotate(90deg)!important;
    transform: rotate(90deg)!important
}

@media screen and (min-width:768px) {
    .navbar.horizontal-menu.navbar-minimal {
        height: 55px
    }
}

.navbar.horizontal-menu.navbar-minimal.navbar-fixed-top+.page-container {
    margin-top: 55px
}

@media screen and (max-width:768px) {
    .navbar.horizontal-menu.navbar-minimal.navbar-fixed-top+.page-container {
        margin-top: 0
    }
}

.navbar.horizontal-menu.navbar-minimal.navbar-fixed-top+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
    top: 55px
}

.navbar.horizontal-menu.navbar-minimal+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
    top: 55px
}

@media screen and (min-width:768px) {
    .navbar.horizontal-menu.navbar-minimal .navbar-inner .navbar-brand {
        height: 55px
    }
    .navbar.horizontal-menu.navbar-minimal .navbar-inner .navbar-nav>li {
        line-height: 55px
    }
    .navbar.horizontal-menu.navbar-minimal .navbar-inner .navbar-nav>li>a {
        line-height: 55px
    }
}

.navbar.horizontal-menu.navbar-minimal .navbar-inner>.nav>li {
    line-height: 55px
}

@media screen and (min-width:767px) and (max-width:992px) {
    .navbar.horizontal-menu.navbar-minimal .navbar-inner .navbar-nav>li {
        line-height: 54px
    }
}

@media screen and (max-width:768px) {
    .navbar.horizontal-menu {
        background: #2c2e2f;
        color: #fff;
        height: auto
    }
    .chat-open .navbar.horizontal-menu {
        left: -340px
    }
    .navbar.horizontal-menu.navbar-fixed-top {
        position: relative
    }
    .navbar.horizontal-menu.navbar-fixed-top+.page-container {
        margin-top: 0
    }
    .navbar.horizontal-menu.navbar-fixed-top+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
        top: 0
    }
    .settings-pane-open .navbar.horizontal-menu.navbar-fixed-top {
        position: relative
    }
    .settings-pane-open .navbar.horizontal-menu.navbar-fixed-top+.page-container {
        margin-top: 0
    }
    .settings-pane-open .navbar.horizontal-menu.navbar-fixed-top+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
        top: 0
    }
    .navbar.horizontal-menu+.page-container>.sidebar-menu.fixed .sidebar-menu-inner {
        top: 85px
    }
    .navbar.horizontal-menu .navbar-inner {
        padding: 20px 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-brand {
        height: auto;
        padding-left: 20px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-brand a[data-toggle=settings-pane] {
        display: none
    }
    .navbar.horizontal-menu .navbar-inner .navbar-mobile-clear {
        display: block;
        clear: both
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav {
        display: none;
        padding-left: 40px;
        padding-right: 40px;
        margin-top: 20px;
        margin-bottom: 20px;
        list-style: none;
        margin-bottom: 0
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a {
        color: #979898;
        text-decoration: none;
        display: block;
        padding: 13px 5px;
        border-bottom: 1px solid #313437
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>i {
        display: inline-block;
        margin-right: 10px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>i+span {
        padding-right: 10px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>span {
        display: inline-block
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>.label {
        margin-top: 1px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a>.badge {
        font-size: 75%;
        line-height: 1.2
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav a:hover {
        color: #fff
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav li.active>a {
        color: #fff
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav li.has-sub>a:before {
        position: relative;
        display: inline-block;
        font-family: FontAwesome;
        content: '\f107';
        float: right;
        color: #6d747a;
        margin-left: 10px;
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        transform: rotate(-90deg);
        -webkit-transition: all 150ms ease-in-out;
        -moz-transition: all 150ms ease-in-out;
        -o-transition: all 150ms ease-in-out;
        transition: all 150ms ease-in-out
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav li.has-sub.opened>a:before,
    .navbar.horizontal-menu .navbar-inner .navbar-nav li.has-sub.expanded>a:before {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.opened>ul {
        display: block
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav>li.opened .opened>ul {
        display: block
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul {
        display: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        list-style: none
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li {
        position: relative
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown {
        left: 0;
        zoom: 1;
        filter: alpha(opacity=100);
        -webkit-opacity: 1;
        -moz-opacity: 1;
        opacity: 1;
        -webkit-transition: all 200ms ease-in-out;
        -moz-transition: all 200ms ease-in-out;
        -o-transition: all 200ms ease-in-out;
        transition: all 200ms ease-in-out
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown {
        -webkit-transition-delay: 80ms;
        -moz-transition-delay: 80ms;
        -o-transition-delay: 80ms;
        transition-delay: 80ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 120ms;
        -moz-transition-delay: 120ms;
        -o-transition-delay: 120ms;
        transition-delay: 120ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 160ms;
        -moz-transition-delay: 160ms;
        -o-transition-delay: 160ms;
        transition-delay: 160ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 200ms;
        -moz-transition-delay: 200ms;
        -o-transition-delay: 200ms;
        transition-delay: 200ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 240ms;
        -moz-transition-delay: 240ms;
        -o-transition-delay: 240ms;
        transition-delay: 240ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 280ms;
        -moz-transition-delay: 280ms;
        -o-transition-delay: 280ms;
        transition-delay: 280ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 320ms;
        -moz-transition-delay: 320ms;
        -o-transition-delay: 320ms;
        transition-delay: 320ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 360ms;
        -moz-transition-delay: 360ms;
        -o-transition-delay: 360ms;
        transition-delay: 360ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 400ms;
        -moz-transition-delay: 400ms;
        -o-transition-delay: 400ms;
        transition-delay: 400ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown+.is-shown {
        -webkit-transition-delay: 440ms;
        -moz-transition-delay: 440ms;
        -o-transition-delay: 440ms;
        transition-delay: 440ms
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.hidden-item {
        visibility: hidden;
        zoom: 1;
        filter: alpha(opacity=0);
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0;
        -webkit-transition: all 250ms ease-in-out;
        -moz-transition: all 250ms ease-in-out;
        -o-transition: all 250ms ease-in-out;
        transition: all 250ms ease-in-out
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li a {
        padding-left: 35px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li ul li a {
        padding-left: 60px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li ul li ul li a {
        padding-left: 85px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li ul li ul li ul li a {
        padding-left: 110px
    }
    .navbar.horizontal-menu .navbar-inner .navbar-nav.mobile-is-visible {
        display: block
    }
    .navbar.horizontal-menu .navbar-inner>.nav {
        display: none
    }
    .navbar.horizontal-menu .navbar-inner>.nav>li {
        line-height: 65px
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo {
        float: none;
        width: 100%;
        display: none;
        background: #fff;
        position: relative;
        top: 20px;
        text-align: right
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo.mobile-is-visible {
        display: block
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo>.xs-left {
        float: left
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo>.xs-left.open>.dropdown-menu {
        left: 1px
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo .notification-icon .badge {
        top: 50%
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo .user-profile>a span {
        display: none
    }
    .navbar.horizontal-menu .navbar-inner>.nav.nav-userinfo .user-profile.open>a {
        background-color: #fafafa
    }
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile {
        display: block;
        float: right;
        padding-right: 20px
    }
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a {
        position: relative;
        display: inline-block;
        color: #979898;
        line-height: 1;
        margin-left: 20px
    }
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a i {
        line-height: 1;
        font-size: 18px;
        position: relative;
        top: 1px
    }
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a:hover,
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a:active,
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a:focus {
        color: #fff
    }
    .navbar.horizontal-menu .navbar-inner>.nav.navbar-mobile a .badge {
        position: absolute;
        right: -3px;
        top: -8px;
        font-size: 8px;
        padding: 1px 2px;
        min-width: 14px
    }
}

@media screen and (max-width:768px) and screen and (max-width:768px) {
    .navbar.horizontal-menu .navbar-inner .navbar-nav {
        margin-top: 10px;
        margin-bottom: 10px
    }
}

@media screen and (max-width:768px) and screen and (min-width:768px) {
    .navbar.horizontal-menu .navbar-inner .navbar-nav ul li.is-hidden {
        left: -20px;
        zoom: 1;
        filter: alpha(opacity=0);
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0
    }
}
nav.navbar {
    border: 0;
}
.user-info-navbar {
    background-color: #fff;
    min-height: 0;
    border: 0;
    padding: 0;
    margin: -30px;
    margin-bottom: 30px;
}
.user-info-navbar .user-info-menu>li>span {
    position: relative;
    display: block;
    padding: 30px 20px;
    color: #979898;
    border-bottom: 1px solid #fff;
    top: 1px;
    z-index: 5;
    text-decoration: none;
}
[class*=fa-] {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}
.el-submenu i{
    margin-right: 5px;
    width: 20px;
}
.el-menu-item i{
    margin-right: 5px;
    width: 20px;
}
</style>
