<template>
  <div class="join-us">
    <!-- 头部begin -->
    <div class="header-nav">
      <div class="header-nav-fixed">
        <div class="nav-con wind-1240">
          <div class="nav-logo">
            <img src="static/image/indexLog.png" @click="toIndex">
          </div>
        </div>
      </div>
    </div>
    <!-- 头部end -->
    <div class="edit wind-1240">
      <!-- 标题 -->
      <div class="edit-title">
        加入我们
      </div>
      <!-- 填写区域 -->
      <div class="edit-info">
        <!-- 姓名 -->
        <div class="info">
          <div class="title">
            <span>* </span>姓名：
          </div>
          <div class="input">
            <el-input v-model="info.name" class="name" placeholder="请输入您的姓名"/>
          </div>
        </div>
        <!-- 公司： -->
        <div class="info">
          <div class="title">
            <span>* </span>公司：
          </div>
          <div class="input">
            <el-input v-model="info.company" class="company" placeholder="请输入您的公司名称"/>
          </div>
        </div>
        <!-- 职位： -->
        <div class="info">
          <div class="title">
            <span>* </span>职位：
          </div>
          <div class="input">
            <el-input v-model="info.position" class="position" placeholder="请输入您的职位"/>
          </div>
        </div>
        <!-- 邮箱： -->
        <div class="info">
          <div class="title">
            <span>* </span>邮箱：
          </div>
          <div class="input">
            <el-input v-model="info.eMail" class="eMail" placeholder="请输入您的邮箱"/>
          </div>
        </div>
        <!-- 电话： -->
        <div class="info">
          <div class="title">
            <span>* </span>电话：
          </div>
          <div class="input">
            <el-input v-model="info.mobile" class="mobile" placeholder="请输入您的手机号码"/>
          </div>
        </div>
        <!-- 模式： -->
        <div class="info">
          <div class="title">
            <span>* </span>模式：
          </div>
          <div class="input">
            <el-radio-group v-model="info.model">
              <el-radio label="1">产品代理合作</el-radio>
              <el-radio label="2">解决方案合作</el-radio>
              <el-radio label="3">实施服务合作</el-radio>
              <el-radio label="4">战略生态合作</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!-- 按钮区域 -->
      <div class="btn">
        <el-button :loading="isSubmit" type="primary" size="medium" @click="submitInfo">提交</el-button>
        <el-button type="primary" size="medium" style="margin-left:20px" @click="resetInfo">重置</el-button>
      </div>
      <!-- 文字区域 -->
      <div class="text">
        请您务必保障以上信息的准确性，我们会第一时间和您取得联系！<br >
        您也可以直接致电 0731-89913439 或邮件postmanager@creatorblue.com与我们联系。
      </div>
    </div>
    <!-- 尾部begin -->
    <footer-nav/>
    <!-- 尾部end -->
  </div>
</template>

<script>
import FooterNav from '@/components/footer-nav'
import { toast } from '../../utils/global'
export default {
  name: 'JoinUs',
  components: {
    'footer-nav': FooterNav
  },
  data() {
    return {
      isSubmit: false, // 是否提交
      info: {
        name: '', // 姓名
        company: '', // 公司
        position: '', // 职位
        eMail: '', // 邮箱
        mobile: '', // 电话
        model: '1' // 模式
      }
    }
  },
  mounted: {

  },
  methods: {
    /**
             * 到首页
             */
    toIndex() {
      this.$router.push({
        path: `/`
      })
    },
    /**
             * 重置
             */
    resetInfo() {
      this.info = {
        name: '', // 姓名
        company: '', // 公司
        position: '', // 职位
        eMail: '', // 邮箱
        mobile: '', // 电话
        model: '1' // 模式
      }
    },
    /**
             * 提交验证
             */
    submitValidation() {
      // 姓名验证
      if (!this.info.name || this.info.name === '') {
        toast('请填写姓名')
        $('.name input').focus()
        return false
      }
      // 公司
      if (!this.info.company || this.info.company === '') {
        toast('请填写公司名称')
        $('.company input').focus()
        return false
      }
      // 职位
      if (!this.info.position || this.info.position === '') {
        toast('请填写职位')
        $('.position input').focus()
        return false
      }
      // 邮箱
      if (!this.info.eMail || this.info.eMail === '') {
        toast('请填写邮箱')
        $('.eMail input').focus()
        return false
      } else if ((this.info.eMail) && (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.info.eMail)))) {
        toast('邮箱格式错误')
        $('.eMail input').focus()
        return false
      }
      // 手机号
      if (!this.info.mobile || this.info.mobile === '') {
        toast('请填写手机号码')
        $('.mobile input').focus()
        return false
      } else if ((this.info.mobile) && (!(/^1[3456789]\d{9}$/.test(this.info.mobile)))) {
        toast('手机号码格式错误')
        $('.mobile input').focus()
        return false
      }

      return true
    },
    /**
             * 提交
             */
    submitInfo() {
      if (this.submitValidation()) {
        const obj = {
          userName: this.info.name,
          companyName: this.info.company,
          postName: this.info.position,
          email: this.info.eMail,
          mobile: this.info.mobile,
          type: this.info.model
        }
        this.isSubmit = true
        this.$api.cooperate.commit(obj).then(res => {
          toast(res.msg)
          this.isSubmit = false
        }).catch(() => {
          this.isSubmit = false
        })
      }
    }
  }
}
</script>

<style scoped>
    /* 头部样式 */
    .header-nav{
        width:100%;
        height:50px;
        /* background-color:#000; */
        /* overflow: hidden; */
    }
    .header-nav-fixed{
        width: 100%;
        background-color: #000;
        position: fixed;
        padding-bottom: 3px;
        top: 0;
        left: 0;
        z-index: 999;
    }
    .header-nav .nav-con{
        display: flex;
        align-content: center;
        height: 100%;
        padding-top: 5px;
        /*padding:0 10px;
        padding-top:6px;*/
    }
    .nav-logo{
      margin-left: 50px;
    }
    .nav-con .nav-logo img{
        height:40px;
        vertical-align: middle;
        border-radius: 6px;
        cursor: pointer;
    }
    /* 填写处样式 */
    .edit{
        height: 100%;
        padding: 80px 0;
    }
    .edit .edit-title{
        font-size: 28px;
    }
    .edit-info{
        width: 500px;
        margin: 30px auto 0;
    }
    .edit-info .info{
        width: 100%;
        display: flex;
        line-height: 40px;
        height: 40px;
        margin-bottom: 20px;
    }
    .edit-info .info .title{
        width: 15%;
    }
    .edit-info .info span{
        color: red;
    }
    .edit-info .info .input{
        width: 85%;
    }
    .input label{
        width: 50%;
        margin: 0;
        line-height: 40px;
        height: 40px;
        text-align: left;
    }
    .btn{
        margin-top: 50px;
    }
    .btn button{
        padding-left: 40px;
        padding-right: 40px;
    }
    .text{
       margin-top: 30px;
    }
</style>
