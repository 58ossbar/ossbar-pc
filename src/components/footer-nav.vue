<!-- 首页页面尾部组件 -->
<template >
  <div>

    <!-- 尾部 -->
    <div class="footer-father">
      <div class="footer">
        <div class="footer-top">
          <b-row style="margin: auto;">
            <b-col sm="5" style="padding: 10px;">
              <div style="text-align: left"><img alt="" src="../../static/image/indexLog.png" style="height:60px"></div>
              <div style="color: white;font-size: 14px;text-align: left;margin-top: 10px">
                布道是一种技术传承，更是一种责任；师者，所以传道授业解惑也。<br>践行互联网+教育，专注软件人才培养的在线教学实训云平台。
              </div>
              <div style="text-align: left;cursor: pointer;color: #ff652f;font-size: 14px;margin-top: 10px">
                了解更多>
              </div>
            </b-col>
            <b-col sm="4" style="padding: 10px;">
              <div style="color: white;font-size: 14px;height: 36px;line-height: 36px;text-align: left">联系我们</div>
              <div style="color: white;font-size: 14px;text-align: left;margin-top: 10px">
                联系电话 ：0731-89913439
              </div>
              <div style="color: white;font-size: 14px;text-align: left;">
                QQ号码 ：28449472
              </div>
              <div style="color: white;font-size: 14px;text-align: left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                邮箱 ：postmanager@creatorblue.com
              </div>
              <div style="text-align: left;cursor: pointer;color: #ff652f;font-size: 14px;margin-top: 10px">
                了解更多>
              </div>
            </b-col>
            <b-col sm="3" style="padding: 20px 0;display: flex">
              <div style="margin:0 10px">
                <div style="margin-bottom: 5px"><img alt="" src="../../static/creatorblue/img/creator-blue-wx.jpg" width="120" height="120" style="border-radius: 5px"></div>
                <!--                <span style="color: white;font-size: 16px;">布道师小程序</span>-->
              </div>
              <div style="margin:0 10px">
                <div style="margin-bottom: 5px"><img alt="" src="../../static/image/ewm.png" width="120" height="120" style="border-radius: 5px"></div>
                <!--                <span style="color: white;font-size: 16px;">布道师二维码</span>-->
              </div>
            </b-col>
          </b-row>
        </div>
        <div class="footer-bottom">
          <div style="height: 1px;width: 100%;background:  #999999;margin:-20px auto"/>
          <div style="font-size: 13px;color:  #999999;margin-top: 30px">关于我们&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 帮助中心
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;  商务合作 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;开放平台 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          搜索推荐 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 友情链接</div>
          <div style="font-size: 13px;color:  #999999;margin-top: 10px">
            <a style="font-size: 13px;color: #999999;margin-top: 10px" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" target="_blank">湘ICP备17000093号-2</a>
            CopyRight @ 创蓝信息 2016- 2027 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/header-nav'
export default {
  name: 'FooterNav',
  components: {
    'header-nav': HeaderNav
  },
  data() {
    return {
      showLogin: true,
      showUserName: false,
      userName: '',
      userImg: '',
      teacherList: [],
      startList: [],
      menuList: [],
      newsList: [],
      subjectList: [],
      tevglPkgInfoList: [],
      partnerList: [],
      major: []
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style>
  .footer-father{
    width: 100%;
    position: relative;
    background: #000034;
  }
  .footer{
    max-width: 1200px;
    margin:auto ;
    position: relative;
  }
  .footer-top{
    padding: 20px 0;
  }
</style>
