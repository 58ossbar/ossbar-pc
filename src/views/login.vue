<!-- 登录页面 -->
<template>
  <div>
    <!--绑定-->
    <div v-if="Binding" style="background-image: url('../../static/image/registerBj.jpg');width: 100%;height: 100vh">
      <div class="dialog all">
        <div class="left">
          <img src="../../static/image/logo.png" style="width: 160px;height: 60px;position: absolute;top: 50px;left: 50px;z-index: 10">
          <img src="../../static/image/loginLog.png" style="width:auto;height:auto;max-width:100%;max-height:100%;margin-top:50px">
        </div>
        <div class="right">
          <b-form class="sign-in">
            <div style="height: 34px">
              <span style="font-size: 25px;float: left">绑定</span>
              <span style="font-size: 14px;float: right;margin-top: 12px">已有账号？
              <a style="cursor: pointer;color: #5281ff" @click="showSignIn">点我登录</a></span>
            </div>
            <b-form-input
              v-model="Bindform.inputAccountBind"
              placeholder="请输入手机号"
              style="margin-top: 15px"/>
            <div style="width: 100%;height: 38px;display: flex;margin-top: 15px;">
              <b-form-input v-model="Bindform.inputMescodeBind" placeholder="请输入验证码" style="width: 60%"/>
              <b-button
                v-show="showyzm"
                type="button"
                variant="primary"
                style="width: 40%;height: 38px"
                @click="sendbindsms()">发送验证码
              </b-button>
              <b-button
                v-show="!showyzm"
                ref="dom"
                type="button"
                class="count"
                variant="primary"
                style="width: 40%;height: 38px;background: #838383">重新发送 {{ count }} s
              </b-button>
            </div>
            <b-form-input
              v-model="Bindform.inputPasswordBind"
              type="password"
              placeholder="请输入密码"
              style="clear: both;margin-top: 15px"/>
            <b-form-checkbox v-model="checkBind" style="margin-top: 15px;float: left">已阅读并同意《使用条款》以及 《非活跃账号处理规范》
            </b-form-checkbox>
            <b-button type="button" variant="primary" style="width: 100%;margin-top: 15px;" @click="saveBind">立即绑定
            </b-button>
          </b-form>
        </div>
      </div>
    </div>
    <div v-if="SignIn||Register">
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
                <b-col cols="4">
                  <div :class="SignIn?'nav_active':'nav_noactive'" @click="changeSign(1)">登录</div>
                </b-col>
                <b-col cols="4">
                  <div :class="Register?'nav_active':'nav_noactive'" @click="changeSign(2)">注册</div>
                </b-col>
              </b-row>
              <!--登录-->
              <div v-if="SignIn">
                <div style="position: relative;">
                  <b-form-input
                    ref="inputAccountLogin"
                    v-model="dataForm.inputAccountLogin"
                    placeholder="请输入账号或手机号"
                    style="clear: both;margin-top: 30px"
                    @keyup.enter="saveSignIn"/>
                  <div style="clear: both"/>
                </div>
                <div style="position: relative">
                  <b-form-input
                    ref="inputPasswordLogin"
                    v-model="dataForm.inputPasswordLogin"
                    type="password"
                    placeholder="请输入密码"
                    style="margin-top: 30px"
                    @keyup.enter="saveSignIn"/>
                  <div style="clear: both"/>
                </div>
                <div style="margin-top: 10px;font-size: 14px;float: left;">
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
                <div style="display: flex;margin-top: 10px">
                  <div style="background: #a4a4a4;width: 36%;height: 1px;margin-top: 10px"/>
                  <div style="width: 28%;">其他方式登录</div>
                  <span style="background: #a4a4a4;width: 36%;height: 1px;margin-top: 10px"/>
                </div>
                <div style="display: flex;margin-top: 10px;">
                  <div style="width: 49%;font-size: 12px;cursor: pointer" @click="showOneKeyLogin('login-api/wxlogin')">
                    <img src="../../static/image/vx.png" class="otherLogin" >&nbsp;&nbsp;&nbsp;微信登录
                  </div>
                  <div style="width: 49%;font-size: 12px;cursor: pointer" @click="showOneKeyLogin('login-api/qqlogin')">
                    <img src="../../static/image/qq.png" class="otherLogin" >&nbsp;&nbsp;&nbsp;QQ登录
                  </div>
                </div>
              </div>
              <!--注册-->
              <div v-if="Register">
                <b-form >
                  <b-form-input
                    ref="inputAccountReg"
                    v-model="form.inputAccountReg"
                    placeholder="请输入有效的手机号"
                    style="clear: both;margin-top: 30px"/>
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
                  <div style="width: 100%;height: 38px;display: flex;margin-top: 15px;">
                    <b-form-input ref="inputMescodeReg" v-model="form.inputMescodeReg" placeholder="请输入验证码" style="width: 65%"/>
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
                  <b-form-input
                    ref="inputPasswordReg"
                    v-model="form.inputPasswordReg"
                    type="password"
                    placeholder="请输入密码"
                    style="clear: both;margin-top: 15px"/>
                  <b-form-checkbox v-model="checkRegister" style="margin-top: 10px;float: left;font-size: 13px">已阅读并同意《服务协议条款》
                  </b-form-checkbox>
                  <b-button type="button" variant="primary" style="width: 100%;margin-top: 10px;" @click="saveRegister">立即注册
                  </b-button>
                  <div style="display: flex;margin-top: 15px">
                    <div style="background: #a4a4a4;width: 36%;height: 1px;margin-top: 10px"/>
                    <div style="width: 28%;">其他方式登录</div>
                    <span style="background: #a4a4a4;width: 36%;height: 1px;margin-top: 10px"/>
                  </div>
                  <div style="display: flex;margin-top: 10px">
                    <div style="width: 49%;font-size: 12px;cursor: pointer" @click="showOneKeyLogin('login-api/wxlogin')">
                      <img src="../../static/image/vx.png" class="otherLogin" >&nbsp;&nbsp;&nbsp;微信登录
                    </div>
                    <div style="width: 49%;font-size: 12px;cursor: pointer" @click="showOneKeyLogin('login-api/qqlogin')">
                      <img src="../../static/image/qq.png" class="otherLogin" >&nbsp;&nbsp;&nbsp;QQ登录
                    </div>
                  </div>
                </b-form>
              </div>
            </b-form>
          </div>
        </div>
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
      showSendCode: true,
      codeName: '',
      signUser: true,
      signPhone: false,
      SignIn: true,
      Register: false,
      Binding: false,
      showyzm: true,
      checkRegister: false,
      checkBind: false,
      count: '',
      timer: null,
      dataForm: {
        inputAccountLogin: '',
        inputPasswordLogin: '',
        inputNumberPhone: '',
        inputCodePhone: '',
        inputZidongLogin: ''
      },
      form: {
        inputPasswordReg: '',
        inputNickName: '',
        inputMescodeReg: '',
        inputAccountReg: ''
      },
      Bindform: {
        inputAccountBind: '',
        inputPasswordBind: '',
        inputNickName: '',
        inputMescodeBind: ''
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
    this.showLoginVue()
  },
  methods: {
    // 切换登录方式
    changeSign: function(box) {
      // 登录
      if (box === 1) {
        this.SignIn = true
        this.Register = false
        this.dataForm.inputAccountLogin = ''
        this.dataForm.inputPasswordLogin = ''
        this.dataForm.inputNumberPhone = ''
        this.dataForm.inputCodePhone = ''
        this.dataForm.inputZidongLogin = ''
      } else if (box === 2) { // 注册
        this.SignIn = false
        this.Register = true
        this.dataForm.inputPasswordReg = ''
        this.dataForm.inputNickName = ''
        this.dataForm.inputMescodeReg = ''
        this.dataForm.inputAccountReg = ''
      }
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
      if (!this.dataForm.inputPasswordLogin) {
        toast('密码不能为空')
        this.$refs.inputPasswordLogin.$el.focus()
        return false
      }
      formVaildStyle('.LoginPassword', '.LoginPasswordInput')
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
          localStorage.setItem('isTeacher', res.data.isTeacher ? 'Y' : 'N')
          this.setCookies(res)
          // 即时通讯
          this.webSockets.setInit(this, {
            paramStr: 'id=' + res.data.traineeId + '&channel=site&token=' + res.data.token
          })
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
    },
    // 添加Cookies
    setCookies: function(res) {
      const token = res.data.token // 令牌
      const cookieName = tokenKeyName
      const d = new Date()
      d.setDate(d.getDate() + 7)
      document.cookie = cookieName + '=' + token + ';path=/;expires=' + d.toUTCString()
      // const millisecond = d.getTime()
      // if (this.dataForm.inputZidongLogin) {
      //   const expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24 * 7)
      //   d.setTime(expiresTime)
      // } else {
      //   const expiresTime = new Date(millisecond + 60 * 1000 * 0.5) // 30秒
      //   d.setTime(expiresTime)
      // }
      // document.cookie = cookieName + '=' + token + ';path=/;expires=' + d.toUTCString()
    },
    // 保存注册
    saveRegister: function() {
      if (!this.form.inputAccountReg) {
        toast('手机号不能为空')
        this.$refs.inputAccountReg.$el.focus()
        return false
      }
      if (!this.form.inputMescodeReg) {
        toast('验证码不能为空')
        this.$refs.inputMescodeReg.$el.focus()
        return false
      }
      if (!this.form.inputPasswordReg) {
        toast('密码不能为空')
        this.$refs.inputPasswordReg.$el.focus()
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(this.form.inputAccountReg))) {
        toast('手机号码有误，请重填')
        this.$refs.inputAccountReg.$el.focus()
        return false
      }
      if (this.checkRegister) {
        const userInfo = {
          inputAccountReg: this.form.inputAccountReg,
          inputPasswordReg: this.form.inputPasswordReg,
          inputMescodeReg: this.form.inputMescodeReg
        }
        this.$api.login.showRegister(userInfo).then((res) => {
          if (res.code === 0) {
            toast('注册成功')
            this.showSignIn()
          } else {
            toast(res.msg)
          }
        }).catch(() => {
        })
      } else {
        toast('请阅读《使用条款》以及 《非活跃账号处理规范》')
      }
    },
    // 注册发短信
    sendregsms: function() {
      if (!(/^1[3456789]\d{9}$/.test(this.form.inputAccountReg))) {
        toast('手机号码有误，请重填')
        return false
      }
      if (!this.$refs.Verify.isPassing) {
        toast('请拖动滑块验证')
        return false
      }
      const userInfo = {
        inputAccountReg: this.form.inputAccountReg,
        inputPasswordReg: this.form.inputPasswordReg
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
    // 绑定发短信
    sendbindsms: function() {
      if (!(/^1[3456789]\d{9}$/.test(this.Bindform.inputAccountBind))) {
        toast('手机号码有误，请重填')
        return false
      }
      const userInfo = { inputAccountBind: this.Bindform.inputAccountBind }
      this.$api.login.showSendbindsms(userInfo).then((res) => {
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
          toast(res.msg)
        }
      }).catch(() => {
      })
    },
    // 微信登录重定向页面
    showOneKeyLogin: function(m) {
      localStorage.removeItem('showLoginVue')
      var url = window.location.href
      window.location.href = process.env.baseUrl + m + '?url=' + encodeURIComponent(url)
    },
    // 显示登录页面
    showSignIn: function() {
      this.SignIn = true
      this.Register = false
      this.Binding = false
    },
    // 显示注册页面
    showRegister: function() {
      this.SignIn = false
      this.Register = true
      this.Binding = false
    },
    // 显示绑定页面
    showBinding: function() {
      this.SignIn = false
      this.Register = false
      this.Binding = true
    },
    // 保存绑定
    saveBind: function() {
      if (!this.Bindform.inputPasswordBind) {
        toast('密码不能为空')
        return false
      }
      if (!this.Bindform.inputAccountBind) {
        toast('手机号不能为空')
        return false
      }
      if (!this.Bindform.inputMescodeBind) {
        toast('验证码不能为空')
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(this.Bindform.inputAccountBind))) {
        toast('手机号码有误，请重填')
        return false
      }
      if (this.checkBind) {
        const userInfo = {
          inputAccountBind: this.Bindform.inputAccountBind,
          inputMescodeBind: this.Bindform.inputMescodeBind,
          inputPasswordBind: this.Bindform.inputPasswordBind
        }
        this.$api.login.getBindmobile(userInfo).then((res) => {
          if (res.code === 0) {
            toast('绑定成功')
            if (localStorage.getItem('toLoginUrl')) {
              this.$router.push(localStorage.getItem('toLoginUrl').split('#')[1])
            } else {
              this.$router.push('/')
            }
          } else {
            alert(res.msg)
          }
        }).catch(() => {
        })
      } else {
        toast('请阅读《使用条款》以及 《非活跃账号处理规范》')
      }
    },
    // 回首页
    toIndex() {
      this.$router.push('/')
    },
    // 页面加载后的数据初始化
    showLoginVue: function() {
      if (localStorage.getItem('showLoginVue') === 'showlogin') {
        this.showSignIn()
        return false
      } else if (localStorage.getItem('showLoginVue') === 'showregister') {
        this.showRegister()
        return false
      }
      this.$api.login.getUser().then((res) => {
        // 处理头像
        res.data.traineeHead = handleImagePath(res.data.traineeHead)
        // 保存至缓存中
        localStorage.setItem('username', res.data.nickName)
        localStorage.setItem('userimg', res.data.traineeHead)
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        localStorage.setItem('isTeacher', res.data.isTeacher ? 'Y' : 'N')
        this.setCookies(res)
        if (res.data.isBind === 'Y' && res.code === 0) {
          if (localStorage.getItem('toLoginUrl')) {
            this.$router.push(localStorage.getItem('toLoginUrl').split('#')[1])
          } else {
            this.$router.push('/')
          }
        } else {
          this.showBinding()
        }
      }).catch(() => {
      })
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
