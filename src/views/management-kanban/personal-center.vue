<!-- 学生的管理面板页面 -->
<template>
  <div>
    <div class="begin-class-con wind-1240">
      <div class="left-function color-000">
        <h2 class="user-name">{{ getTimeGreat }}，{{ basicInfo.traineeName }}</h2>
        <div class="entrance">
          <p class="title">常用入口</p>
          <ul class="entrance-list">
            <li class="entrance-item" @click="handleLearningClass()">
              <img src="static/image/manage_board/classroom_img.png" alt="我的课堂">
              <!-- <span>我的课堂</span> -->

              <div class="entrance-item-label">
                <div>我的课堂</div>
                <div class="entrance-item-label-dec hide_double">查阅教材、完成老师布置的课堂任务</div>
              </div>
            </li>
            <li class="entrance-item" @click="handleBookshelf()">
              <img src="static/image/manage_board/bookcase.png" alt="我的书架">
              <!-- <span>我的书架</span> -->

              <div class="entrance-item-label">
                <div>我的书架</div>
                <div class="entrance-item-label-dec hide_double">查看课堂中的所有活教材和云盘文件</div>
              </div>
            </li>
            <li class="entrance-item" >
              <img src="static/image/manage_board/blog.png" alt="我的博客">
              <!-- <span>我的博客</span> -->

              <div class="entrance-item-label">
                <div>我的博客</div>
                <div class="entrance-item-label-dec hide_double">记录学习过程心得和技术点滴</div>
              </div>
            </li>
            <li class="entrance-item">
              <img src="static/image/manage_board/punchCard.png" alt="我的考勤">
              <!-- <span>我的资源</span> -->

              <div class="entrance-item-label">
                <div>我的资源</div>
                <div class="entrance-item-label-dec hide_double">课外拓展、丰富职业技能</div>
              </div>
            </li>
            <li class="entrance-item" >
              <img src="static/image/manage_board/certificate.png" alt="我的成绩">
              <!-- <span>我的成绩</span> -->

              <div class="entrance-item-label">
                <div>我的成绩</div>
                <div class="entrance-item-label-dec hide_double">查看各科理论考试和实践考核成绩</div>
              </div>
            </li>
            <li class="entrance-item" >
              <img src="static/image/manage_board/schedule.png" alt="我的课表">
              <!-- <span>我的课表</span> -->

              <div class="entrance-item-label">
                <div>我的课表</div>
                <div class="entrance-item-label-dec hide_double">实时查看课程上课时间和地点</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="right-personal-info">
        <div class="header-img">
          <label class="edit-header-img">
            <input v-if="!showLogin" type="file" name="ClassImg" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none" @change="changeImage($event)">
            <img :src="editInfo.pic" class="img-avatar" style="cursor: pointer">
            <div v-if="!showLogin" class="edit-cover" >
              <img src="static/image/edit_1.png" alt="更换头像" title="更换头像">
            </div>
          </label>
          <b-button v-if="!showLogin" variant="outline-primary" style="margin-left: 30px" @click="editPassword">修改密码</b-button>
        </div>
        <div class="line"/>
        <div class="base-info">
          <div class="left-title">基本信息</div>
          <div class="right-user-info">
            <p>姓名：{{ basicInfo.traineeName }}</p>
            <p>昵称：{{ basicInfo.nickName }}</p>
            <p>班级：{{ basicInfo.className }}</p>
            <p>性别：{{ basicInfo.traineeSexName }}</p>
            <p>联系电话：{{ basicInfo.mobile }}</p>
            <p>学号：{{ basicInfo.jobNumber }}</p>
            <p>所在学校：{{ basicInfo.school }}</p>
            <p>所在院系：{{ basicInfo.college }}</p>
            <el-button v-if="!showLogin" icon="el-icon-edit" size="mini" class="edit" type="primary" circle @click="handleshowGroupBox(false)"/>
          </div>
        </div>
        <div class="line"/>
        <div class="base-info">
          <div class="left-title">经验值{{ charmInfo.empiricalValue }}</div>
          <div class="right-user-info">
            <p>参加云课堂：{{ charmInfo.cloudClassroomNum }}</p>
            <p>完成任务数：{{ charmInfo.studentNum }}</p>
            <p>参加活动：{{ charmInfo.resourceNum }}</p>
            <p>累计博客：{{ charmInfo.blogsNum }}</p>
          </div>
        </div>
      </div>
      <!-- 编辑个人信息start -->
      <modal-dialog
        id="edit-user-box"
        title="编辑基本信息"
        @cancel="handleCancel"
        @submit="handleSubmit">
        <div slot="main">
          <div class="group-form">
            <div class="group-name">
              姓名
              <span>*</span>
            </div>
            <el-input
              id="traineeName"
              v-model="editInfo.traineeName"
              type="text"
              oninput="if(value.length>20) value=value.slice(0,20)"
              placeholder="请输入姓名"
              @keyup.enter.native="handleSubmit"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 traineeNameHint"><small >姓名不能为空！</small></div>
          <div class="group-form">
            <div class="group-name">
              昵称
              <span>*</span>
            </div>
            <el-input
              id="nickName"
              v-model="editInfo.nickName"
              type="text"
              oninput="if(value.length>20) value=value.slice(0,20)"
              placeholder="请输入昵称"
              @keyup.enter.native="handleSubmit"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 nickNameHint"><small >昵称不能为空！</small></div>
          <div class="group-form">
            <div class="group-name">
              性别
              <span>*</span>
            </div>
            <select id="traineeSex" v-model="editInfo.traineeSex" class="form-control" style="width:100%;">
              <option
                v-for="item in traineeSexList"
                :key="item.id"
                :label="item.value"
                :value="item.id"/>
            </select>
          </div>
          <div v-if="isTeacher" class="group-form">
            <div class="group-name">
              教师证
              <span>*</span>
            </div>
            <el-input
              id="teacherErtificateNumber"
              v-model="editInfo.teacherErtificateNumber"
              type="text"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="17"
              placeholder="请输入教师证"
              @keyup.enter.native="handleSubmit"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 teacherErtificateNumberHint"><small >教师证的编号长度至少要17位！</small></div>
          <div class="group-form">
            <div class="group-name">
              工号/学号
              <span>*</span>
            </div>
            <el-input
              id="jobNumber"
              v-model="editInfo.jobNumber"
              oninput="value=value.replace(/[^\d]/g,'')"
              type="text"
              maxlength="50"
              placeholder="请输入工号/学号"
              @keyup.enter.native="handleSubmit"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 jobNumberHint"><small >工号/学号不能为空！</small></div>
          <div class="group-form">
            <div class="group-name">
              邮箱
              <span/>
            </div>
            <el-input
              id="email"
              v-model="editInfo.email"
              type="text"
              placeholder="请输入邮箱号"
              @keyup.enter.native="handleSubmit"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeEmailHint"><small >请填写正确的邮箱地址！</small></div>
        </div>
      </modal-dialog>
      <!-- 编辑个人信息end -->
      <!-- 修改密码弹出框begin -->
      <modal-dialog
        id="edit-pass-word"
        title="修改密码"
        @cancel="handleCancelPassWord"
        @submit="handlePassWord">
        <div slot="main">
          <div class="group-form">
            <div class="group-name">
              原密码
              <span>*</span>
            </div>
            <el-input
              id="originalPassword"
              v-model="password.originalPassword"
              show-password
              type="text"
              placeholder="请输入原密码"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 originalPasswordHint"><small >原密码不能为空！</small></div>
          <div class="group-form">
            <div class="group-name">
              新密码
              <span>*</span>
            </div>
            <el-input
              id="newPassword"
              v-model="password.newPassword"
              show-password
              type="text"
              placeholder="请输入新密码"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 newPasswordHint"><small >新密码不能为空！</small></div>
          <div class="group-form">
            <div class="group-name">
              确认密码
              <span>*</span>
            </div>
            <el-input
              id="confirmPassword"
              v-model="password.confirmPassword"
              show-password
              type="text"
              placeholder="请再次输入新密码"
            />
          </div>
          <div style="margin-left: 23%" class="invalid-feedback col-10 textAlignLeft p-0 confirmPasswordHint"><small >确认密码不能为空！</small></div>
        </div>
      </modal-dialog>
      <!-- 修改密码弹出框end -->
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import $ from '@/assets/jquery-vendor'
import ModalDialog from '@/components/modal-dialog'
import { toast, formVaildStyle, formInVaildStyle, tokenKeyName } from '@/utils/global'
import { handleImagePath } from '@/utils/util'
export default {
  components: {
    'modal-dialog': ModalDialog
  },
  data() {
    return {
      showLogin: true,
      basicInfo: {}, // 基本信息
      charmInfo: {}, // 魅力值信息
      oldEditInfo: {},
      editInfo: {
        traineeName: '',
        nickName: '',
        file: null,
        pic: 'static/image/u905.png',
        teacherErtificateNumber: '',
        jobNumber: '',
        traineeSex: 0,
        email: ''
      },
      teacherNameState: null,
      teacherPic: '',
      isEditPic: false, // 是否编辑头像
      isTeacher: false,
      traineeSexList: [{ id: 0, value: '保密' }, { id: 1, value: '男' }, { id: 2, value: '女' }],
      password: {
        originalPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    // 设置问候语
    getTimeGreat() {
      var h = (new Date()).getHours()
      if (h >= 15 && h < 19) { return '下午好' }
      if (h >= 11 && h < 15) { return '中午好' }
      if (h >= 19 && h < 22) { return '晚上好' }
      if (h >= 22 && h <= 24 || h >= 0 && h < 6) { return '深夜好' }
      if (h >= 6 && h < 11) { return '早上好' }
    }
  },
  created() {
  },
  mounted() {
    const token = Cookies.get(tokenKeyName)
    if (token) {
      this.showLogin = false
      // 获取个人信息
      this.getPersonalInfo()
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    handleshowGroupBox(value) {
      this.isEditPic = value
      this.getPersonalInfo()
      this.oldEditInfo = JSON.parse(JSON.stringify(this.editInfo))
      $('#edit-user-box').modal('show')
    },
    toLogin() {
      localStorage.setItem('toLoginUrl', window.location.href)
      this.$router.push('/login')
    },
    handleLearningClass() {
      if (this.showLogin) {
        this.toLogin()
        return false
      }
      this.$router.push({
        path: `/my/learning-classroom`
      })
    },
    handleBookshelf() {
      if (this.showLogin) {
        this.toLogin()
        return false
      }
      this.$router.push({
        path: `/my-bookshelf/my-bookshelf`
      })
    },
    // 点击上传图片
    changeImage(e) {
      this.file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(this.file)
      reader.onload = function(e) {
        that.editInfo.pic = this.result
      }
      this.isEditPic = true
      // this.handleSubmit();
      const formData = new FormData()
      formData.append('file', this.file)
      this.$api.managementPanel.uploadPic(formData).then((res) => {
        if (res.code === 0) {
          const that = this
          toast(res.msg)
          that.getPersonalInfo()
        } else {
          toast(res.msg)
        }
      })
    },
    // 表单验证
    formValidity() {
      if (this.isEditPic) {
        return true
      }
      if (!this.editInfo.traineeName) {
        formInVaildStyle('.traineeNameHint', '#traineeName')
        $('#traineeName').css('borderColor', '#dc3545')
        $('#traineeName').focus()
        return false
      }
      $('#traineeName').removeAttr('style')
      formVaildStyle('.traineeNameHint', '#traineeName')

      if (!this.editInfo.nickName) {
        formInVaildStyle('.nickNameHint', '#nickName')
        $('#nickName').css('borderColor', '#dc3545')
        $('#nickName').focus()
        return false
      }
      $('#nickName').removeAttr('style')
      formVaildStyle('.nickNameHint', '#nickName')

      if (this.isTeacher) {
        if ((!this.editInfo.teacherErtificateNumber) || (this.editInfo.teacherErtificateNumber.length !== 17)) {
          formInVaildStyle('.teacherErtificateNumberHint', '#teacherErtificateNumber')
          $('#teacherErtificateNumber').css('borderColor', '#dc3545')
          $('#teacherErtificateNumber').focus()
          return false
        }
        $('#teacherErtificateNumber').removeAttr('style')
        formVaildStyle('.teacherErtificateNumberHint', '#teacherErtificateNumber')
      }

      if (!this.editInfo.jobNumber) {
        formInVaildStyle('.jobNumberHint', '#jobNumber')
        $('#jobNumber').css('borderColor', '#dc3545')
        $('#jobNumber').focus()
        return false
      }
      $('#jobNumber').removeAttr('style')
      formVaildStyle('.jobNumberHint', '#jobNumber')

      if (this.editInfo.email) {
        if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.editInfo.email))) {
          formInVaildStyle('.pkgTraineeEmailHint', '#email')
          $('#email').css('borderColor', '#dc3545')
          $('#email').focus()
          return false
        }
      }
      $('#email').removeAttr('style')
      formVaildStyle('.pkgTraineeEmailHint', '#email')
      return true
    },

    // 清空验证样式
    clearValidate() {
      $('.cb-form-valid').removeClass('cb-form-valid')
      $('.cb-form-invalid').removeClass('cb-form-invalid')
      $('.invalid-feedback').css('display', 'none')
    },

    // 提交
    handleSubmit() {
      if (this.formValidity()) {
        const formData = new FormData()
        if (this.isEditPic) {
          formData.append('file', this.file)
        } else {
          formData.append('traineeId', this.basicInfo.traineeId)
          formData.append('teacherName', this.editInfo.traineeName)
          formData.append('nickName', this.editInfo.nickName)
          formData.append('traineeSex', this.editInfo.traineeSex)
          formData.append('email', this.editInfo.email)
          if (this.isTeacher) {
            formData.append('teacherErtificateNumber', this.editInfo.teacherErtificateNumber)
          }
          formData.append('jobNumber', this.editInfo.jobNumber)
        }
        this.clearValidate()
        $('#edit-user-box').modal('hide')
        this.$api.managementPanel.saveInfo(formData).then((res) => {
          if (res.code === 0) {
            toast(res.msg)
            this.getPersonalInfo()
          } else {
            toast(res.msg)
          }
        })
      }
    },
    handleCancel() {
      this.clearValidate()
      $('#edit-user-box').modal('hide')
      this.editInfo = this.oldEditInfo
    },
    // 获取个人信息
    getPersonalInfo() {
      this.$api.managementPanel.getPersonalInfo().then((res) => {
        if (res.code === 0) {
          if (res.data) {
            // 处理头像
            const traineePic = handleImagePath(res.data.basicInfo.traineePic)
            localStorage.setItem('userimg', traineePic)
            const traineeName = res.data.basicInfo.traineeName
            localStorage.setItem('username', traineeName)
            res.data.basicInfo.teacherPic = traineePic
            this.editInfo.pic = res.data.basicInfo.teacherPic
            if (res.data.basicInfo.email) {
              this.editInfo.email = res.data.basicInfo.email
            }
            this.editInfo.traineeName = res.data.basicInfo.traineeName
            this.editInfo.nickName = res.data.basicInfo.nickName
            this.editInfo.teacherErtificateNumber = res.data.basicInfo.teacherErtificateNumber
            this.editInfo.jobNumber = res.data.basicInfo.jobNumber
            this.basicInfo = res.data.basicInfo
            this.charmInfo = res.data.charmInfo
            this.isTeacher = res.isTeacher
            if (res.data.basicInfo.traineeSex) {
              this.editInfo.traineeSex = parseInt(res.data.basicInfo.traineeSex)
            }
          }
        }
      })
    },
    /**
             * 修改密码
             */
    editPassword() {
      $('#edit-pass-word').modal('show')
    },
    /**
             * 取消修改密码
             */
    handleCancelPassWord() {
      $('#edit-pass-word').modal('hide')
      this.password = {
        originalPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.clearValidate()
    },
    /**
             * 修改密码验证
             */
    modifyPasswordAuthentication() {
      // 原密码是否为空验证
      if (!this.password.originalPassword) {
        formInVaildStyle('.originalPasswordHint', '#originalPassword')
        $('#originalPassword').css('borderColor', '#dc3545')
        $('#originalPassword').focus()
        return false
      }
      $('#originalPassword').removeAttr('style')
      formVaildStyle('.originalPasswordHint', '#originalPassword')
      // 新密码是否为空验证
      if (!this.password.newPassword) {
        $('.newPasswordHint').text('新密码不能为空！')
        formInVaildStyle('.newPasswordHint', '#newPassword')
        $('#newPassword').css('borderColor', '#dc3545')
        $('#newPassword').focus()
        return false
      } else if (this.password.newPassword.length < 6 || this.password.newPassword.length > 16) {
        $('.newPasswordHint').text('密码长度不能小于6位并且不能大于16位！')
        formInVaildStyle('.newPasswordHint', '#newPassword')
        $('#newPassword').css('borderColor', '#dc3545')
        $('#newPassword').focus()
        return false
      }
      $('#newPassword').removeAttr('style')
      formVaildStyle('.newPasswordHint', '#newPassword')
      // 确认密码是否为空验证
      if (!this.password.confirmPassword) {
        $('.confirmPasswordHint').text('确认密码不能为空！')
        formInVaildStyle('.confirmPasswordHint', '#confirmPassword')
        $('#confirmPassword').css('borderColor', '#dc3545')
        $('#confirmPassword').focus()
        return false
      }
      $('#confirmPassword').removeAttr('style')
      formVaildStyle('.originalPasswordHint', '#confirmPassword')
      // 原密码与新密码是否一致验证
      if (this.password.confirmPassword !== this.password.newPassword) {
        $('.confirmPasswordHint').text('确认密码和新密码不一致！')
        formInVaildStyle('.confirmPasswordHint', '#confirmPassword')
        $('#confirmPassword').css('borderColor', '#dc3545')
        $('#confirmPassword').focus()
        return false
      }
      $('.confirmPasswordHint').text('确认密码不能为空！')
      $('#confirmPassword').removeAttr('style')
      formVaildStyle('.originalPasswordHint', '#confirmPassword')
      return true
    },
    /**
             * 确认修改密码
             */
    handlePassWord() {
      if (this.modifyPasswordAuthentication()) {
        const formData = new FormData()
        formData.append('oldPwd', this.password.originalPassword)
        formData.append('newPwd', this.password.newPassword)
        formData.append('confimPwd', this.password.confirmPassword)
        // $('#edit-pass-word').modal('hide');
        // this.clearValidate();
        this.$api.managementPanel.updatePassword(formData).then(res => {
          if (res.code === 0) {
            $('#edit-pass-word').modal('hide')
          }
          this.clearValidate()
          toast(res.msg)
        })
      }
    }
    // 退出登录
    // outlogin:function(){
    //     let that = this
    //     confirm("您确定要退出吗",function () {
    //         that.$api.login.outLogin().then((res) => {
    //             if(res.code==0){
    //                 delCookies();
    //                 that.$router.push("/");
    //                 // that.showLogin=true;
    //                 // that.showUserName=false;
    //             }else{
    //                 alert(res.code)
    //             }
    //         });
    //     })
    // }
  }
}
</script>

<style>
    .header-img label{
      display: inline-block;
    }
    .group-form{
        display:flex;
        align-items: center;
        padding:10px 20px 10px 0;
    }
    .group-form .group-name{
        width:30%;
        text-align: left;
        padding-left: 15px;
    }
    .group-form .group-name > span{
        color: red;
        margin-left: 2px;
    }
    .begin-class-con{
        display: flex;
        background-color: #fff;
        border:1px solid #d7d7d7;
        border-right: 0;
        border-radius: 6px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .begin-class-con > .left-function{
        width: 70%;
        height:100%;
        padding:40px;
        text-align: left;
    }
    .begin-class-con .left-function .user-name{
        font-size:22px;
    }
    .entrance{
        width: 100%;
        margin-top:15px;
        border-top: 2px solid #e6e8ea;
    }
    .entrance .title{
        padding: 10px 0;
        margin-top: 20px;
    }
    .entrance .entrance-list{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        padding: 0;
    }
    .entrance .entrance-list .entrance-item{
        width:240px;
        height:90px;
        line-height:90px;
        /* color:#8d949c; */
        text-align: center;
        margin-top:15px;
        border-radius: 7px;
        border: 1px solid #e6e8ea;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
    }
    .entrance .entrance-list .entrance-item:hover{
        border: 1px solid #6496C8;
    }
    .entrance .entrance-list .entrance-item >img{
        width: 48px;
        height: 48px;
        margin-right: 10px;
    }

    .entrance .entrance-list .entrance-item .entrance-item-label{
        line-height: normal;
        text-align: left;
        /* width: 69%; */
        flex: 1;
        box-sizing: border-box;
    }
    .entrance .entrance-list .entrance-item .entrance-item-label .entrance-item-label-dec{
        font-size: 11px;
        margin-top: 5px;
         color:#8d949c;
        box-sizing: border-box;
    }
    /* 右边start */
    .begin-class-con {
        margin: 20px auto !important;
    }
    .begin-class-con .right-personal-info{
        width: 30%;
        height:100%;
        padding: 20px;
        border-left:2px dashed #f0f1f3;
        color:#333;
    }
    .right-personal-info .header-img{
        height: fit-content !important;
    }
    .right-personal-info .header-img > img{
        width:128px;
        height:128px;
        border-radius: 50%;
        margin-top:20px;
        margin-right: 20px;
    }
    .right-personal-info .line{
        margin-top:20px;
        height: 2px;
        width: 300px;
        background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#ccc,rgba(255,255,255,0));
        background: linear-gradient(to right, rgba(255, 255, 255, 0),#ccc,rgba(255,255,255,0));

    }
    .right-personal-info .base-info{
        display: flex;
        padding:30px 10px;
    }
    .right-personal-info .base-info .left-title{
        display: flex;
        align-items: center;
        width:20px;
    }
    .right-personal-info .base-info .right-user-info{
        position:relative;
        width:80%;
        margin-left: 20px;
        text-align: left;
    }
    .base-info .right-user-info .edit{
        position: absolute;
        top:-5px;
        right:0px;
    }
    .right-personal-info .base-info .right-user-info p{
        margin-bottom:10px;
    }
    .editTeachName{
        display: flex;
        align-items: center;
    }
    .editTeachName .bv-no-focus-ring{
        margin-left:20px;
    }
    .bv-no-focus-ring .form-control{
        /*width:300px !important;*/
    }
    .edit-header-img{
        display: block;
        position: relative;
        margin-left:20px;
    }
    .edit-header-img,.edit-header-img img{
        width:125px;
        height:125px;
        border-radius: 50%;
    }
    .edit-header-img .edit-cover{
        display: none;
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background-color: rgba(0, 0, 0, .5);
        z-index:1;
        text-align: center;
        line-height:125px;
        border-radius: 50%;
        cursor: pointer;
    }
    .edit-header-img .edit-cover >img{
        width:40px;
        height:40px;
    }
    .edit-header-img:hover .edit-cover{
        display: block;
    }
    .edit-btn-list{
        margin-top:30px;
        text-align: center;
    }
    .edit-btn-list button{
        width:100px;
        margin-right:10px;
    }
    /* 右边end */
</style>
