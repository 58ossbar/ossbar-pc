<!-- 新增教学包页面 -->
<template>
  <div class="backgroundColorGrey">
    <header-nav :current-index="5" />
    <div class="form-box wind-1240">
      <div style="display: flex">
        <div style="width: 100%;text-align: left;margin: 20px" >{{ edit ? '修改教学包' : '新建教学包' }}</div>
        <div style="width: 100%;text-align: right;font-size: 14px;margin: 20px;cursor: pointer;color: #158aeb" >
          <i class="fa fa-angle-left" aria-hidden="true" style="font-size: 14px;margin-right: 5px" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <div style="width: 1200px;height: 1px;background: #e0e0e0"/>
      <form>
        <div class="add-package-info-form">
          <div class="form-content">
            <div class="form-item">
              <div class="input-hint">名称<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-input
                  id="pkgName"
                  v-model="dataForm.pkgName"
                  maxlength="50"
                  type="text"
                  placeholder="请输入教学包名称"/>
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgNameHint"><small >请输入教学包名称！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">版本号<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-input
                  id="pkgVersion"
                  :disabled="edit"
                  v-model="dataForm.pkgVersion"
                  maxlength="10"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入版本号"/>
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgVersionHint"><small >请输入版本号！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">职业路径<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-select
                  id="majorId"
                  v-model="dataForm.majorId"
                  :disabled="edit"
                  style="font-size: 14px;width:100%;"
                  filterable
                  @change="changeMajor">
                  <el-option
                    v-for="item in majorList"
                    :key="item.majorId"
                    :label="item.majorName"
                    :value="item.majorId"/>
                </el-select>
                <div class="invalid-feedback col-10 textAlignLeft p-0 majorIdHint"><small >请选择职业路径！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">课程体系<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-select
                  id="subjectId"
                  v-model="dataForm.subjectId"
                  :disabled="edit"
                  style="font-size: 14px;width:100%;"
                  filterable
                  @change="changeSubject">
                  <el-option
                    v-for="item in subjectList"
                    :key="item.subjectId"
                    :label="item.subjectName"
                    :value="item.subjectId"/>
                </el-select>
                <div class="invalid-feedback col-10 textAlignLeft p-0 subjectIdHint"><small >请选择课程体系！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">发布方<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-select
                  id="deployMainType"
                  v-model="dataForm.deployMainType"
                  style="width:100%;"
                  class="cb-pkg-form-font-size" >
                  <el-option
                    v-for="item in dictListDeployMainType"
                    :key="item.dictId"
                    :label="item.dictValue"
                    :value="item.dictCode"/>
                </el-select>
                <div class="invalid-feedback col-10 textAlignLeft p-0 deployMainTypeHint"><small >请选择发布方！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">使用限制<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-select
                  id="pkgLimit"
                  v-model="dataForm.pkgLimit"
                  style="width:100%;"
                  class="cb-pkg-form-font-size">
                  <el-option
                    v-for="item in dictListPkgLimit"
                    :key="item.dictId"
                    :label="item.dictValue"
                    :value="item.dictCode"/>
                </el-select>
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgLimitHint"><small >请选择使用限制！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">适用层次<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-select
                  id="pkgLevel"
                  v-model="dataForm.pkgLevel"
                  style="width:100%;"
                  class="cb-pkg-form-font-size" >
                  <el-option
                    v-for="item in dictListPkgLevel"
                    :key="item.dictId"
                    :label="item.dictValue"
                    :value="item.dictCode"/>
                </el-select>
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgLevelHint"><small >请选择试用层次！</small></div>
              </div>
            </div>
            <div class="form-item">
              <div class="input-hint">教材类型</div>
              <div class="input-box">
                <el-select
                  id="pkgLevel"
                  v-model="dataForm.pkgBookType"
                  style="width:100%;"
                  class="cb-pkg-form-font-size" >
                  <el-option
                    v-for="item in dictListPkgBookType"
                    :key="item.dictId"
                    :label="item.dictValue"
                    :value="item.dictCode"/>
                </el-select>
              </div>
            </div>
          </div>

          <div class="form-content">

            <div style="display: flex;height: 120px;line-height: 120px;">
              <div style="text-align: left;width: 25%">教学包封面</div>
              <div style="width: 30%; padding-top: 15px">
                <label>
                  <input id="classroomPic" type="file" name="ClassImg" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none" @change="changeImage($event)">
                  <img v-show="dataForm.pkgLogo !== ''" :src="dataForm.pkgLogo" class="img-avatar" width="130px" height="100px" style="cursor: pointer">
                  <div v-show="dataForm.pkgLogo === ''" class="add-img">
                    <i class="el-icon-plus"/>
                  </div>
                </label>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">联系人<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-input
                  id="pkgTraineeName"
                  v-model="dataForm.pkgTraineeName"
                  maxlength="50"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入联系人姓名" />
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeNameHint"><small >请输入联系人！</small></div>
              </div>
            </div>

            <div class="form-item">
              <div class="input-hint">手机号码<span class="color-d81e06">*</span></div>
              <div class="input-box">
                <el-input
                  id="pkgTraineeMobile"
                  v-model="dataForm.pkgTraineeMobile"
                  maxlength="20"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入手机号码" />
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeMobileHint"><small >手机号码错误！</small></div>
              </div>
            </div>
            <div class="form-item">
              <div class="input-hint">微信号码</div>
              <div class="input-box">
                <el-input
                  id="pkgTraineeWx"
                  v-model="dataForm.pkgTraineeWx"
                  maxlength="20"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入微信号" />
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeWxHint"><small >请输入微信号！</small></div>
              </div>
            </div>
            <div class="form-item">
              <div class="input-hint">QQ号码</div>
              <div class="input-box">
                <el-input
                  id="pkgTraineeQq"
                  v-model="dataForm.pkgTraineeQq"
                  maxlength="20"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入QQ号码" />
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeQqHint"><small >请输入QQ号！</small></div>
              </div>
            </div>
            <div class="form-item">
              <div class="input-hint">邮箱地址</div>
              <div class="input-box">
                <el-input
                  id="pkgTraineeEmail"
                  v-model="dataForm.pkgTraineeEmail"
                  maxlength="20"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入邮箱地址" />
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeEmailHint"><small >请填写邮箱地址！</small></div>
              </div>
            </div>
            <div class="form-item">
              <div class="input-hint">关键字</div>
              <div class="input-box">
                <el-input
                  id="pkgKey"
                  v-model="dataForm.pkgKey"
                  maxlength="50"
                  type="text"
                  class="cb-pkg-form-font-size"
                  placeholder="请输入关键字" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="add-package-info-form" >
          <div style="text-align: left;width: 10%;height: 60px;line-height: 60px;margin-right:3px;">关键字</div>
          <el-input
            id="pkgKey"
            :autosize="{ minRows: 2, maxRows: 2}"
            v-model="dataForm.pkgKey"
            type="textarea"
            placeholder="请输入关键字"
            maxlength="300"
            style="width: 83%;font-size: 14px;"/>
        </div> -->
        <div class="add-package-info-form" >
          <div style="text-align: left;width: 10%;height: 100px;line-height: 100px;margin-right:3px;">简介</div>
          <el-input
            id="pkgDesc"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="dataForm.pkgDesc"
            type="textarea"
            placeholder="请输入介绍信息"
            maxlength="300"
            style="width: 83%;font-size: 14px;height: 100px"
            show-word-limit/>
        </div>
        <div style="width: 80%;margin: 20px auto;display: flex">
          <button
            :disabled="isSubmitCom"
            type="button"
            class="btn btn-outline-primary"
            style="font-size: 14px;width: 100px;margin-left: 380px;margin-right: 20px"
            @click="saveInfo">确定</button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            style="font-size: 14px;width: 100px;margin-left: 20px"
            @click="toBack">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import HeaderNav from '@/components/header-nav-start-class'
import { baseUrl, toast, formVaildStyle, formInVaildStyle } from '@/utils/global'
export default {
  name: 'AddPackageInfo',
  components: {
    'header-nav': HeaderNav
  },
  data() {
    return {
      // 标识新增false/修改true
      edit: false,
      pic: '../../static/image/uploadImg.png',
      majorList: [], // 职业课程路径
      subjectList: [], // 课程下拉列表
      dictListDeployMainType: [],
      isSubmitCom: false,
      dictListPkgLimit: [],
      dictListPkgLevel: [],
      dictListPkgBookType: [],
      dataForm: {
        pkgId: '',
        pkgName: '',
        subjectId: '',
        pkgVersion: 'v1.0.0',
        pkgDesc: '',
        deployMainType: '2',
        pkgLimit: '1',
        pkgLevel: '1',
        pkgTraineeName: '',
        pkgTraineeQq: '',
        pkgTraineeMobile: '',
        pkgTraineeWx: '',
        pkgTraineeEmail: '',
        pkgKey: '',
        pkgRemark: '',
        pkgLogo: '',
        pkgBookType: '1'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // 初始化相关数据
    this.showMajorListData()
    this.showSubjectListData()
    this.showDeployMainTypeListData()
    this.showPkgLimitListData()
    this.showPkgLevelListData()
    this.showPkgBookTypeListData()
    // let pkgId = localStorage.getItem(this.constant.PKG_ID_FOR_UPDATE)
    const pkgId = this.$route.params.pkgId
    if (pkgId) {
      this.edit = true
      this.$api.pkgInfo.viewPkgInfoForUpdate(pkgId).then(res => {
        if (res.code === 0) {
          res.data.pkgLogo = baseUrl + res.data.pkgLogo
          this.dataForm = Object.assign({}, res.data)
        }
      })
    }
  },
  mounted() {
    if (localStorage.getItem('userInfo')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.dataForm.pkgTraineeName = userInfo.traineeName || userInfo.nickName
      if (!this.edit) {
        this.dataForm.pkgTraineeMobile = localStorage.getItem('mobile') || ''
        this.dataForm.pkgTraineeEmail = userInfo.email || ''
        this.dataForm.pkgTraineeQq = userInfo.traineeQq || ''
      }
    }
  },
  updated() {},
  methods: {
    // 返回
    toback: function() {
      this.$router.push('/my-teaching-package')
    },

    /**
         * 选择职业路径
         */
    changeMajor: function(event) {
      if (!this.edit) {
        this.dataForm.subjectId = ''
      }
      this.showSubjectListData()
    },

    /**
         * 选择课程
         */
    changeSubject() {
      this.showSubjectListData()
    },

    /**
         * 选择图片
         */
    changeImage(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.pic = this.result
        that.dataForm.pkgLogo = this.result
      }
    },

    // 表单验证
    formVerifyBoolean() {
      if (!this.dataForm.pkgName) {
        formInVaildStyle('.pkgNameHint', '#pkgName')
        $('#pkgName').css('borderColor', '#dc3545')
        $('#pkgName').focus()
        return false
      } else {
        if (this.dataForm.pkgName.length > 100) {
          $('.nameHint').html('教学包名称不能超过100个字符!')
          $('#pkgName').focus()
          formInVaildStyle('.nameHint', '#pkgName')
          $('#pkgName').css('borderColor', '#dc3545')
          return false
        }
      }
      $('#pkgName').removeAttr('style')
      formVaildStyle('.pkgNameHint', '#pkgName')

      if (!this.dataForm.pkgVersion) {
        formInVaildStyle('.pkgVersionHint', '#pkgVersion')
        $('#pkgVersion').css('borderColor', '#dc3545')
        $('#pkgVersion').focus()
        return false
      }
      $('#pkgVersion').removeAttr('style')
      formVaildStyle('.pkgVersionHint', '#pkgVersion')

      if (!this.dataForm.majorId) {
        $('#majorId').css('borderColor', '#dc3545')
        formInVaildStyle('.majorIdHint', '#majorId')
        $('#majorId').focus()
        return false
      }
      $('#majorId').removeAttr('style')
      formVaildStyle('.majorIdHint', '#majorId')

      if (!this.dataForm.subjectId) {
        formInVaildStyle('.subjectIdHint', '#subjectId')
        $('#subjectId').css('borderColor', '#dc3545')
        return false
      }
      $('#subjectId').removeAttr('style')
      formVaildStyle('.subjectIdHint', '#subjectId')

      if (!this.dataForm.deployMainType) {
        $('#deployMainType').css('borderColor', '#dc3545')
        formInVaildStyle('.deployMainTypeHint', '#deployMainType')
        return false
      }
      $('#deployMainType').removeAttr('style')
      formVaildStyle('.deployMainTypeHint', '#deployMainType')

      if (!this.dataForm.pkgLimit) {
        $('#pkgLimit').css('borderColor', '#dc3545')
        formInVaildStyle('.pkgLimitHint', '#pkgLimit')
        return false
      }
      $('#pkgLimit').removeAttr('style')
      formVaildStyle('.pkgLimitHint', '#pkgLimit')

      if (!this.dataForm.pkgLevel) {
        $('#pkgLevel').css('borderColor', '#dc3545')
        formInVaildStyle('.pkgLevelHint', '#pkgLevel')
        return false
      }
      $('#pkgLevel').removeAttr('style')
      formVaildStyle('.pkgLevelHint', '#pkgLevel')

      if (!this.dataForm.pkgTraineeName) {
        $('#pkgTraineeName').css('borderColor', '#dc3545')
        formInVaildStyle('.pkgTraineeNameHint', '#pkgTraineeName')
        return false
      }
      $('#pkgTraineeName').removeAttr('style')
      formVaildStyle('.pkgTraineeNameHint', '#pkgTraineeName')

      if (!this.dataForm.pkgTraineeMobile) {
        $('.pkgTraineeMobileHint').html('请输入手机号!')
        $('#pkgTraineeMobile').css('borderColor', '#dc3545')
        formInVaildStyle('.pkgTraineeMobileHint', '#pkgTraineeMobile')
        return false
      } else {
        if (this.dataForm.pkgTraineeMobile !== '' && !(/^1[3456789]\d{9}$/.test(this.dataForm.pkgTraineeMobile))) {
          $('.pkgTraineeMobileHint').html('手机号错误!')
          $('#pkgTraineeMobile').css('borderColor', '#dc3545')
          formInVaildStyle('.pkgTraineeMobileHint', '#pkgTraineeMobile')
          return false
        }
      }
      $('#pkgTraineeMobile').removeAttr('style')
      formVaildStyle('.pkgTraineeMobileHint', '#pkgTraineeMobile')
      /* if(!this.dataForm.pkgTraineeWx){
                formInVaildStyle('.pkgTraineeWxHint',"#pkgTraineeWx");
                return false;
            }
            formVaildStyle('.pkgTraineeWxHint',"#pkgTraineeWx");
            if(!this.dataForm.pkgTraineeQq){
                formInVaildStyle('.pkgTraineeQqHint',"#pkgTraineeQq");
                return false;
            }
            formVaildStyle('.pkgTraineeQqHint',"#pkgTraineeQq");*/
      if (!this.dataForm.pkgTraineeEmail) {
        /* $(".pkgTraineeEmailHint").html("请输入邮箱地址!");
                formInVaildStyle('.pkgTraineeEmailHint',"#pkgTraineeEmail");
                return false;*/
      } else {
        if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.dataForm.pkgTraineeEmail))) {
          $('.pkgTraineeEmailHint').html('邮箱地址错误!')
          $('#pkgTraineeEmail').css('borderColor', '#dc3545')
          formInVaildStyle('.pkgTraineeEmailHint', '#pkgTraineeEmail')
          return false
        }
        $('#pkgTraineeEmail').removeAttr('style')
        formVaildStyle('.pkgTraineeEmailHint', '#pkgTraineeEmail')
      }
      return true
    },

    // 保存教学包信息
    saveInfo() {
      if (!this.formVerifyBoolean()) {
        return
      }
      this.isSubmitCom = true
      const formData = new FormData()
      const file = document.getElementById('classroomPic').files[0]
      if (file) {
        formData.append('file', file)
      }
      formData.append('pkgId', this.dataForm.pkgId)
      formData.append('pkgName', this.dataForm.pkgName)
      formData.append('majorId', this.dataForm.majorId)
      formData.append('subjectId', this.dataForm.subjectId)
      formData.append('pkgVersion', this.dataForm.pkgVersion)
      formData.append('deployMainType', this.dataForm.deployMainType)
      formData.append('pkgLimit', this.dataForm.pkgLimit)
      formData.append('pkgLevel', this.dataForm.pkgLevel)
      formData.append('pkgTraineeName', this.dataForm.pkgTraineeName)
      formData.append('pkgTraineeQq', this.dataForm.pkgTraineeQq)
      formData.append('pkgTraineeMobile', this.dataForm.pkgTraineeMobile)
      formData.append('pkgTraineeWx', this.dataForm.pkgTraineeWx)
      formData.append('pkgTraineeEmail', this.dataForm.pkgTraineeEmail)
      formData.append('pkgKey', this.dataForm.pkgKey)
      formData.append('pkgDesc', this.dataForm.pkgDesc)
      formData.append('pkgBookType', this.dataForm.pkgBookType)
      this.$api.pkgInfo.saveInfo(formData).then((res) => {
        if (res.code === 0) {
          // 此乃新增后返回的教学包主键,跳转页面请传参
          const pkgId = res.data
          localStorage.setItem('pkgId', pkgId)
          toast(res.msg, () => {
            this.isSubmitCom = false
            this.$router.push({
              path: '/teaching-package-detail'
              // query: {
              //     pkgId: pkgId
              // }
            })
          })
        } else {
          toast(res.msg)
          this.isSubmitCom = false
        }
      })
    },

    toBack() {
      this.$router.push('/my-teaching-package')
    },

    /**
         * 职业课程路径
         */
    showMajorListData() {
      this.$api.addclassroom.getMajorList().then((res) => {
        if (res.code === 0) {
          this.majorList = res.data
        }
      })
    },

    /** *
         * 课程信息
         */
    showSubjectListData() {
      const params = {
        majorId: this.dataForm.majorId
      }
      this.$api.addclassroom.listSelectSubject(params).then(res => {
        if (res.code === 0) {
          this.subjectList = res.data
        }
      })
    },

    /** *
         * 发布方大类
         */
    showDeployMainTypeListData() {
      this.$api.dict.listDeployMainType().then((res) => {
        if (res.code === 0) {
          this.dictListDeployMainType = res.data
        }
      })
    },

    /** *
         * 教学包使用限制
         */
    showPkgLimitListData() {
      this.$api.dict.listPkgLimit().then((res) => {
        if (res.code === 0) {
          this.dictListPkgLimit = res.data
        }
      })
    },

    /** *
         * 教学包适用层次
         */
    showPkgLevelListData() {
      this.$api.dict.listPkgLevel().then((res) => {
        if (res.code === 0) {
          this.dictListPkgLevel = res.data
        }
      })
    },

    showPkgBookTypeListData() {
      this.$api.dict.listPkgBookType().then((res) => {
        if (res.code === 0) {
          this.dictListPkgBookType = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
    .form-box{
        height: 100%;
        background-color: #fff;
        margin: 20px auto;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 6px;
    }
    .add-package-info-form{
        width: 85%;
        padding-top:20px;
        margin: 0px auto;
        display: flex;
        font-size: 14px;
    }
    .add-package-info-form .form-content{
        width: 48%;
        margin-right: 7%;
    }
    .add-package-info-form .form-content .form-item{
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    .add-package-info-form .form-content .form-item .input-hint{
        width: 22%;
        text-align: left;
        margin-right:10px;
    }
    .add-package-info-form .form-content .form-item  .input-box{
        width:76%;
    }
    .cb-pkg-form-font-size{
        font-size: 14px;
    }
    .right-box{
        width: 48%;
        margin-right: 2%;
    }
    .class-room-cover-box{
        width: 100%;
        height: 95px;
        line-height: 95px;
    }
    .add-img{
        border: 1px solid #d4d4d4;
        height: 100px;
        line-height: 100px;
        width: 130px;
        text-align: center;
        font-size: 50px;
        color: #d4d4d4;
        font-weight: 100;
        cursor: pointer;
    }
</style>
