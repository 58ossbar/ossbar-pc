<!-- 登录页面 -->
<template>
  <div>
    <img class="center" src="../../static/image/registerBj.jpg">
    <div class="signToast">
      <div class="signLog">
        <div class="signLogCenter">
          <img src="static/image/bdsbiglogo.png" class="otherLogin" style="height: 60px;" @click="toIndex" >
        </div>
      </div>
      <div class="loginShow">
        <b-form class="sign-in">
          <!--tab切换-->
          <b-row>
            <b-col cols="5">
              <div :class="tabIndex == 1?'nav_active':'nav_noactive'" @click="changeSign(1)">账号密码登录</div>
            </b-col>
            <b-col cols="5">
              <div :class="tabIndex == 2?'nav_active':'nav_noactive'" @click="changeSign(2)">短信验证码登录</div>
            </b-col>
          </b-row>
          <!--登录-->
          <div >
            <div style="position: relative;">
              <b-form-input
                ref="inputAccountLogin"
                v-model="dataForm.inputAccountLogin"
                placeholder="请输入手机号"
                style="clear: both;margin-top: 30px"
                @keyup.enter="saveSignIn"/>
              <div style="clear: both"/>
            </div>
            <div v-show="tabIndex == 1" style="position: relative">
              <b-form-input
                ref="inputPasswordLogin"
                v-model="dataForm.inputPasswordLogin"
                type="password"
                placeholder="请输入密码"
                style="margin-top: 30px"
                @keyup.enter="saveSignIn"/>
              <div style="clear: both"/>
            </div>

            <div v-show="tabIndex == 2" style="position: relative">
              <drag-verify
                ref="Verify"
                :width="width"
                :height="height"
                :text="text"
                :success-text="successText"
                :background="background"
                :progress-bar-bg="progressBarBg"
                :completed-bg="completedBg"
                :handler-bg="handlerBg"
                :handler-icon="handlerIcon"
                :text-size="textSize"
                :success-icon="successIcon"
                style="margin-top: 15px"/>
            </div>

            <div v-show="tabIndex == 2" style="position: relative;width: 100%;height: 38px;display: flex;margin-top: 15px;margin-bottom: 15px;">
              <b-form-input ref="inputMescodeReg" v-model="dataForm.inputMescodeReg" placeholder="请输入验证码" style="width: 65%"/>
              <b-button
                v-show="showyzm"
                type="button"
                variant="primary"
                style="width: 30%;height: 38px; margin-left: 5%;"
                @click="sendregsms()">发送验证码
              </b-button>
              <b-button
                v-show="!showyzm"
                ref="dom"
                type="button"
                class="count"
                variant="primary"
                style="width: 40%;height: 38px;background: #838383">{{ count }}秒后重新发送
              </b-button>
            </div>

            <div v-show="tabIndex == 1" style="margin-top: 10px;font-size: 14px;float: left;">
              <label>
                <input v-model="dataForm.inputZidongLogin" style="width: 14px;height: 14px;margin: 5px;vertical-align: middle;" type="checkbox">
                <span style="display: inline-block; line-height: 24px;height: 24px">记住账号</span>
              </label>
            </div>
            <div style="clear: both"/>
            <div style="display: flex">
              <b-button type="button" variant="primary" style="width: 45%;margin: 10px auto;" @click="clearSignIn">重置</b-button>
              <b-button type="button" variant="primary" style="width: 45%;margin: 10px auto;" @click="saveSignIn">登录</b-button>
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>
<script>
import 'font-awesome/css/font-awesome.min.css'
import dragVerify from 'vue-drag-verify'
import { alert, toast, formVaildStyle, tokenKeyName } from '@/utils/global'
import { handleImagePath } from '@/utils/util'
export default {
  components: {
    dragVerify
  },
  data() {
    return {
      tabIndex: 1,
      showSendCode: true,
      codeName: '',
      signUser: true,
      signPhone: false,
      showyzm: true,
      checkBind: false,
      count: '',
      timer: null,
      dataForm: {
        inputAccountLogin: '',
        inputPasswordLogin: '',
        inputMescodeReg: '',
        inputZidongLogin: ''
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      handlerIcon: 'fa fa-angle-double-right',
      successIcon: 'fa fa-check',
      background: '#cccccc',
      progressBarBg: '#4b0',
      completedBg: '#66cc66',
      handlerBg: '#fff',
      text: '请将滑块拖动到右侧',
      successText: '验证成功',
      width: 368,
      height: 42,
      textSize: '16px',
      isCircle: 'true'
    }
  },
  created() {
  },
  methods: {
    // 切换登录方式
    changeSign: function(box) {
      this.tabIndex = box
      this.dataForm.inputMescodeReg = ''
      this.dataForm.inputPasswordLogin = ''
      this.dataForm.inputZidongLogin = ''
    },
    // 保存登录
    saveSignIn: function() {
      if (!this.dataForm.inputAccountLogin) {
        toast('手机号不能为空')
        this.$refs.inputAccountLogin.$el.focus()
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(this.dataForm.inputAccountLogin))) {
        toast('手机号码有误，请重填')
        this.$refs.inputAccountLogin.$el.focus()
        return false
      }
      formVaildStyle('.LoginAccount', '.LoginAccountInput')

      if (this.tabIndex && this.tabIndex === 2) {
        if (!this.form.inputMescodeReg) {
          toast('验证码不能为空')
          this.$refs.inputMescodeReg.$el.focus()
          return false
        }
      } else {
        if (!this.dataForm.inputPasswordLogin) {
          toast('密码不能为空')
          this.$refs.inputPasswordLogin.$el.focus()
          return false
        }
        formVaildStyle('.LoginPassword', '.LoginPasswordInput')
      }

      const userInfo = {
        inputAccountLogin: this.dataForm.inputAccountLogin,
        inputPasswordLogin: this.dataForm.inputPasswordLogin
      }
      this.$api.login.showLogin(userInfo).then((res) => {
        if (res.code === 0) {
          // 处理头像
          res.data.traineeHead = handleImagePath(res.data.traineeHead)
          // 保存至缓存中
          localStorage.setItem('userimg', res.data.traineeHead)
          localStorage.setItem('mobile', this.dataForm.inputAccountLogin)
          localStorage.setItem('username', res.data.nickName)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          localStorage.setItem('ifTeacher', res.data.ifTeacher ? 'Y' : 'N')
          this.setCookies(res)
          if (localStorage.getItem('toLoginUrl')) {
            let address = localStorage.getItem('toLoginUrl').split('#')[1]
            if (!address) {
              address = localStorage.getItem('toLoginUrl')
            }
            this.$router.push(address)
          } else {
            this.$router.push('/')
          }
        } else {
          toast(res.msg)
          this.$router.push('/login')
        }
      }).catch(() => {
      })
    },
    // 重置
    clearSignIn: function() {
      this.dataForm.inputAccountLogin = ''
      this.dataForm.inputPasswordLogin = ''
      this.dataForm.inputMescodeReg = ''

      this.$refs.Verify.isPassing = false
      this.$refs.Verify.$refs.handler.style.left = '0'
      this.$refs.Verify.$refs.handler.children[0].className = this.handlerIcon
      this.$refs.Verify.$refs.progressBar.style.width = '0'
      // this.$refs.Verify.$refs.message.style['-webkit-text-fill-color'] = 'transparent'
      // this.$refs.Verify.$refs.message.style.animation = 'slidetounlock 3s infinite'
      this.$refs.Verify.$refs.message.style.color = '#444'
    },
    // 添加Cookies
    setCookies: function(res) {
      const token = res.data.token // 令牌
      const cookieName = tokenKeyName
      const d = new Date()
      d.setDate(d.getDate() + 7)
      document.cookie = cookieName + '=' + token + ';path=/;expires=' + d.toUTCString()
    },
    // 注册发短信
    sendregsms: function() {
      if (!(/^1[3456789]\d{9}$/.test(this.dataForm.inputAccountLogin))) {
        toast('手机号码有误，请重填')
        return false
      }
      if (!this.$refs.Verify.isPassing) {
        toast('请拖动滑块验证')
        return false
      }
      const userInfo = {
        inputAccountReg: this.dataForm.inputAccountLogin,
        inputPasswordReg: ''
      }
      this.$api.login.showSendregsms(userInfo).then((res) => {
        if (res.code === 0) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.showyzm = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.showyzm = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        } else {
          alert(res.msg)
        }
      }).catch(() => {
      })
    },
    // 回首页
    toIndex() {
      this.$router.push('/')
    }
  }

}
</script>

<style scoped>
  .signToast{
    width: 450px;
    height: 480px;
    position: absolute;
    top: 0;
    left:0;
    /* transform: translate(-50%,-20%); */
    right:0;
    margin: calc(50vh - 310px) auto 0 auto;
  }
  .signLog{
    height: 75px;
    width: 450px;
  }
  .signLogCenter{
    margin: auto
  }
  .loginShow{
    margin-top: 10px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .center{
    width: 100%;
    height: 100vh;
    background-size: 0 0;
  }
  .footer a:hover {
    color: royalblue;
    cursor: pointer;
  }
  .otherLogin{
    cursor: pointer;
  }
  .nav_noactive{
    text-align: center;
    padding: 5px;
    cursor: pointer;
  }
  .nav_active{
    text-align: center;
    border-bottom: 2px #007bff solid;
    padding: 5px;
    color: #007bff;
    cursor: pointer;
  }
  .all {
    position:absolute;
    left:50%;
    top:50%;
    height:600px;
    margin-left:-500px;
    margin-top:-300px;
    width: 1000px;
    font-size: 14px;
  }
  .dialog {
    display: flex;
    box-shadow: 10px 10px 30px #838383;
  }

  .left {
    width: 50%;
    padding: 70px;
    color: white;
    position: relative;
    background: #fafafa;
   /* background: -webkit-gradient(linear, left bottom, left top, from(#A6DCE5), to(#E8BCCB));*/
   /* background: -webkit-gradient(linear, left bottom, left top, from(#3a485a), to(#607089));*/
  }

  .right {
    width: 50%;
    padding: 20px;
    background: white;
  }

  .left-top {
    text-align: left;
    padding: 10px;
  }

  .left-center {
    padding: 10px;
    margin-top: 30px;
  }

  .left-center h6 {
    color: #a4a4a4;
    font-size: 14px;
    text-align: left;
  }

  .left-center h6 span {
    margin-left: 20px;
  }

  .left-center h5 {
    margin-top: 20px;
    font-size: 14px;
    text-align: left;
  }

  .left-bottom {
    clear: both;
    text-align: left;
    padding: 10px;
    margin-top: 145px;
  }

  .left-bottom .top {
    background: #a4a4a4;
    width: 100%;
    height: 1px;
  }

  .left-bottom .bottom {
    margin-top: 40px;
    font-size: 16px;
  }

  .sign-in {
    padding: 40px;
    height: 100%;
  }

  input::-webkit-input-placeholder{
    font-size:14px;
  }
</style>
