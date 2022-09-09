<!-- 新增课堂页面页面 -->
<template>
  <div class="add-classroom-box backgroundColorGrey">
    <header-nav :current-index="4" />
    <div class="add-classroom">
      <div style="display: flex">
        <div style="width: 100%;text-align: left;margin: 20px" >{{ isEdit ? '编辑课堂' : '新建课堂' }}</div>
        <div style="width: 100%;text-align: right;font-size: 14px;margin: 20px;cursor: pointer;color: #158aeb" >
          <i class="fa fa-angle-left" aria-hidden="true" style="font-size: 14px;margin-right: 5px" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <div style="width: 1200px;height: 1px;background: #e0e0e0"/>
      <div style="width: 1200px">
        <form>
          <div class="form-content-box">
            <div class="form-content">

              <div class="form-item">
                <div class="input-hint">
                  课堂名称
                  <span class="color-d81e06">*</span>
                </div>
                <div class="input-box">
                  <el-input
                    id="name"
                    v-model="dataForm.name"
                    type="text"
                    placeholder="请输入课堂名称"
                    style="font-size: 14px;height: 38px"
                    maxlength="100"/>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 nameHint"><small >请输入课堂名称！</small></div>
                </div>
              </div>

              <div class="form-item">
                <div class="input-hint">职业路径<span class="color-d81e06">*</span></div>
                <div class="input-box">
                  <el-select
                    id="majorId"
                    v-model="dataForm.majorId"
                    :disabled="isEdit === 'true'"
                    style="font-size: 14px;width:100%;"
                    placeholder="请选择职业路径"
                    filterable
                    @change="changeMajor">
                    <el-option
                      v-for="item in majorList"
                      :key="item.majorId"
                      :label="item.majorName"
                      :value="item.majorId"/>
                  </el-select>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 majorNameHint"><small >请选择职业路径！</small></div>
                </div>
              </div>

              <div class="form-item">
                <div class="input-hint">课程体系<span class="color-d81e06">*</span></div>
                <div class="input-box">
                  <el-select
                    id="subjectId"
                    v-model="dataForm.subjectId"
                    :disabled="isEdit === 'true'"
                    style="font-size: 14px;width:100%;"
                    placeholder="请选择课程体系"
                    filterable
                    @change="changeSubject">
                    <el-option
                      v-for="item in subjectList"
                      :key="item.subjectId"
                      :label="item.subjectName"
                      :value="item.subjectId"/>
                  </el-select>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 subjectNameHint"><small >请选择课程体系！</small></div>
                </div>
              </div>

              <div class="form-item">
                <div class="input-hint">采用教学包</div>
                <div class="input-box">
                  <el-select
                    id="pkg"
                    v-model="dataForm.pkgId"
                    :disabled="isEdit === 'true'"
                    style="font-size: 14px;width:100%"
                    filterable
                    placeholder="请选择教学包">
                    <el-option
                      v-for="item in pkgList"
                      :key="item.pkgId"
                      :label="item.pkgName"
                      :value="item.pkgId"/>
                  </el-select>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 pkgNameHint"><small >请选择教学包！</small></div>
                </div>
              </div>

              <div class="form-item">
                <div class="input-hint">上课班级<span class="color-d81e06">*</span></div>
                <div class="input-box">

                  <el-select
                    id="classId"
                    v-model="dataForm.classId"
                    :disabled="isEdit === 'true'"
                    style="width:100%;"
                    multiple
                    filterable
                    default-first-option
                    placeholder="请选择上课班级">
                    <el-option
                      v-for="item in classList"
                      :key="item.classId"
                      :label="item.className"
                      :value="item.classId"
                      :title="item.title"
                    />
                  </el-select>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 classNameHint"><small >请选择上课班级！</small></div>
                </div>
              </div>
            </div>
            <div class="right-box">
              <div class="class-room-cover-box">
                <div class="cover-title">课堂封面<span class="color-d81e06">*</span></div>
                <div class="cover-img-box">
                  <label for="classroomPic">
                    <input
                      id="classroomPic"
                      type="file"
                      name="ClassImg"
                      accept="image/gif,image/jpeg,image/jpg,image/png"
                      style="display: none"
                      @change="changeImage($event)">
                    <img
                      v-show="dataForm.pic !== ''"
                      :src="dataForm.pic==''?pic:dataForm.pic"
                      class="img-avatar"
                      width="120px"
                      height="94px"
                      style="cursor: pointer">
                    <div v-show="dataForm.pic === ''" class="add-img">
                      <i class="el-icon-plus"/>
                    </div>
                  </label>
                </div>
              </div>
              <div class="invalid-feedback col-10 textAlignLeft p-0 classroomPicHint"><small style="margin-left:40%;">请上传课堂封面！</small></div>
              <div class="class-room-cover-box">
                <div class="cover-title">加入课堂是否审核</div>
                <div class="cover-radio">
                  <el-switch
                    v-model="dataForm.isCheck"
                    class="radio-audit"
                    active-color="#13ce66"
                    active-value="Y"
                    inactive-value="N"
                    inactive-color="#f5f5f5"/>
                    <!--<input
                                  type="radio"
                                  v-model="dataForm.isCheck"
                                  value="Y"
                                  class="radio-audit"
                                  name="radioAudit"
                                  id="radioAudit1">
                                <label for="radioAudit1">是</label>
                                <input
                                  type="radio"
                                  v-model="dataForm.isCheck"
                                  value="N"
                                  class="radio-audit"
                                  name="radioAudit"
                                  id="radioAudit2">
                                 <label for="radioAudit2">否</label>-->
                </div>
              </div>

              <div class="class-room-cover-box">
                <div class="cover-title">是否公开课</div>
                <div class="cover-radio">
                  <el-switch
                    v-model="dataForm.isPublic"
                    class="radio-audit"
                    active-value="Y"
                    inactive-value="N"
                    active-color="#13ce66"
                    inactive-color="#f5f5f5"/>
                    <!--<input
                                  type="radio"
                                  v-model="dataForm.isPublic"
                                  value="Y"
                                  class="radio-audit"
                                  name="radioPublic"
                                  id="radioPublic1">
                                <label for="radioPublic1">是</label>
                                <input
                                  type="radio"
                                  v-model="dataForm.isPublic"
                                  value="N"
                                  class="radio-audit"
                                  name="radioPublic"
                                  id="radioPublic2">
                                <label for="radioPublic2">否</label>-->
                </div>
              </div>
              <div class="class-room-cover-box">
                <div class="cover-title">是否直播课</div>
                <div class="cover-radio">
                  <el-switch
                    v-model="dataForm.ifLiveLesson"
                    class="radio-audit"
                    active-value="Y"
                    inactive-value="N"
                    active-color="#13ce66"
                    inactive-color="#f5f5f5"/>
                </div>
              </div>
            </div>
          </div>
          <div v-if="dataForm.ifLiveLesson == 'Y'" style="width: 80%;margin: 20px auto;display: flex;font-size: 14px">
            <div style="text-align: left;width: 11%;margin-right:3px;">直播地址</div>
            <el-input
              id="intro"
              v-model="dataForm.linkUrl"
              placeholder="请输入直播地址"
              maxlength="300"
              style="width: 86%;font-size: 14px;"
              show-word-limit/>
          </div>
          <div style="width: 80%;margin: 20px auto;display: flex;font-size: 14px">
            <div style="text-align: left;width: 11%;height: 100px;line-height: 100px;margin-right:3px;">课堂简介</div>
            <el-input
              id="intro"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="dataForm.intro"
              type="textarea"
              placeholder="请输入介绍信息"
              maxlength="300"
              style="width: 86%;font-size: 14px;height: 100px"
              show-word-limit/>
          </div>
          <div style="width: 80%;margin: 20px auto;display: flex">
            <button :disabled="isDisable" type="button" class="btn btn-outline-primary" style="font-size: 14px;width: 100px;margin-left: 380px;margin-right: 20px" @click="toSave()">确定</button>
            <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 20px" @click="toback()">取消</button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
<script>
import $ from '@/assets/jquery-vendor'
import { baseUrl, toast, formVaildStyle, formInVaildStyle, loadingModal } from '@/utils/global'
import HeaderNav from '@/components/header-nav'
export default {
  name: 'AddClassroom',
  components: {
    'header-nav': HeaderNav
  },
  data() {
    return {
      isEdit: this.$route.query.isEdit,
      isDisable: false, // 防止多次提交
      pkgList: [], // 教学包下拉列表
      majorList: [], // 职业课程路径
      subjectList: [], // 课程下拉列表
      classList: [], // 班级下拉列表
      pic: '../../static/image/uploadImg.png',
      dataForm: {
        ctId: '', // 课堂主键
        intro: '', // 课堂简介
        name: '', // 课堂名称
        majorId: '', // 职业课程路径ID
        classId: '', // 班级ID
        pic: '', // 图片
        pkgId: '', // 教学包ID
        subjectId: '',
        isCheck: 'N', // 是否审核
        isPublic: 'N', // 是否公开课
        ifLiveLesson: 'N', // 是否直播课Y/N
        linkUrl: ''
      },
      selectedClassssResult: [],
      title: '请选择上课班级',
      isSelect: false
    }
  },
  created() {
    /* if ('true' === this.isEdit){
              this.dataForm = this.$route.query.classroom;
              this.showClassList();
            } */
    this.showClassroomData()
  },
  mounted() {
    // this.$api.login.checkIsLogin().then((res) => {
    //   if (res.code == 0) {
    //     if (res.data.isTeacher) {
    //       this.$router.push("/my/add-classroom");
    //     } else {
    //       this.$router.push("/");
    //     }
    //   } else {
    //     cbalert.alert(res.msg, () => {
    //       this.$router.push("/login");
    //     })
    //   }
    // })
    if (this.isEdit) {
      const obj = this.$route.query.classroom
      this.$api.classroom.viewClassroomBaseInfo({ ctId: obj.ctId }).then(res => {
        if (res.code === 0) {
          res.data.pic = baseUrl + res.data.pic
          const arrTemp = []
          arrTemp.push(res.data.classId)
          res.data.classId = arrTemp
          this.dataForm = res.data
          this.changeMajor()
        }
      })
      // this.dataForm = obj;
      this.title = obj.className
    }
    this.isSelect = true
  },
  methods: {
    /* 班级多选 */
    handleSelectedClassssResult(selectClass) {
      this.dataForm.classId = selectClass.join(',')
    },

    /**
             * 初始化渲染数据
             */
    showClassroomData: function() {
      // 职业课程路径
      this.$api.addclassroom.getMajorList().then((res) => {
        if (res.code === 0) {
          this.majorList = res.data
        }
      })
      this.showSubjectList()
      this.showPkgList()
    },

    // 上课班级
    showClassList() {
      const params = {
        majorId: this.dataForm.majorId
      }
      // this.dataForm.classId = "";
      this.$api.addclassroom.getClassList(params).then((res) => {
        if (res.code === 0) {
          this.classList = res.data
        }
      })
    },

    /**
             * 选择职业路径
             */
    changeMajor: function(event) {
      if (!this.isEdit) {
        this.dataForm.subjectId = ''
        this.dataForm.classId = ''
        this.dataForm.pkgId = ''
      }
      this.showSubjectList()
      this.showPkgList()
      this.showClassList()
    },

    /**
             * 选择课程
             */
    changeSubject() {
      if (!this.isEdit) {
        this.dataForm.pkgId = ''
      }
      this.showPkgList()
    },

    /**
             * 选择图片
             * @param e
             */
    changeImage(e) {
      var file = e.target.files[0]
      var reader = new FileReader()
      var that = this
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.dataForm.pic = this.result
      }
    },

    toback: function() {
      this.$router.push('/my/classroom')
    },

    // 保存
    toSave: function() {
      if (!this.formVerifyBoolean()) {
        return false
      }
      this.isDisable = true// 点击后禁用该按钮；
      // const classId = this.dataForm.classId.join(',')

      const file = document.getElementById('classroomPic').files[0]
      const formData = new FormData()
      formData.append('ctId', this.dataForm.ctId)
      formData.append('name', this.dataForm.name)
      formData.append('file', file)
      formData.append('majorId', this.dataForm.majorId)
      // 多个已逗号隔开
      // this.dataForm.classId = 'ea730e9ea30149b4b50d96ac02cff659,d9f88090548a40fbb47a216d02aec7fa,c15b382647064c7489baba0b742da7f1'
      formData.append('classId', this.dataForm.classId)
      formData.append('subjectId', this.dataForm.subjectId)
      formData.append('pkgId', this.dataForm.pkgId)
      formData.append('intro', this.dataForm.intro)
      /* let isCheck = 'N';
      if (this.dataForm.isCheck){
          isCheck = 'Y';
      }
      let isPublic = 'N';
      if (this.dataForm.isPublic){
          isPublic = 'Y';
      } */
      formData.append('isCheck', this.dataForm.isCheck)
      formData.append('isPublic', this.dataForm.isPublic)
      formData.append('ifLiveLesson', this.dataForm.ifLiveLesson)
      formData.append('linkUrl', this.dataForm.linkUrl)
      loadingModal(true, this.dataForm.ctId ? '正在保存... ' : '正在生成课堂相关数据，请稍后...')
      this.$api.addclassroom.save(formData).then((res) => {
        if (res.code === 0) {
          toast(res.msg + '，即将跳转页面', () => {
            this.$router.push('/my/classroom')
          })
        } else {
          toast(res.msg)
          this.isDisable = false
        }
        loadingModal(false)
      })
    },

    // 表单验证
    formVerifyBoolean() {
      if (this.dataForm.name === '') {
        $('#name').focus()
        $('.nameHint').html('请输入课堂名称!')
        formInVaildStyle('.nameHint', '#name')
        $('#name').css('borderColor', '#dc3545')
        return false
      } else {
        if (this.dataForm.name.length > 100) {
          $('.nameHint').html('课堂名称不能超过100个字符!')
          $('#name').focus()
          $('#name').css('borderColor', '#dc3545')
          formInVaildStyle('.nameHint', '#name')
          return false
        }
      }
      $('#name').removeAttr('style')
      formVaildStyle('.nameHint', '#name')

      if (!this.dataForm.majorId) {
        formInVaildStyle('.majorNameHint', '#majorId')
        $('#majorId').css('borderColor', '#dc3545')
        $('#majorId').focus()
        return false
      }
      $('#majorId').removeAttr('style')
      formVaildStyle('.majorNameHint', '#majorId')

      if (!this.dataForm.subjectId) {
        formInVaildStyle('.subjectNameHint', '#subjectId')
        $('#subjectId').css('borderColor', '#dc3545')
        $('#subjectId').focus()
        return false
      }
      $('#subjectId').removeAttr('style')
      formVaildStyle('.subjectNameHint', '#subjectId')

      if (this.dataForm.pkgId) {
        formVaildStyle('.pkgNameHint', '#pkg')
      }
      if (!this.dataForm.classId.length > 0) {
        $('#classId').focus()
        formInVaildStyle('.classNameHint', '#classId')
        $('#classId').css('borderColor', '#dc3545')
        return false
      }
      $('#classId').removeAttr('style')
      formVaildStyle('.classNameHint', '#classId')

      if (!this.dataForm.pic) {
        formInVaildStyle('.classroomPicHint', '#classroomPic')
        return false
      }
      formVaildStyle('.classroomPicHint', '#classroomPic')
      return true
    },

    /** *
             * 渲染课程信息
             */
    showSubjectList() {
      const params = {
        majorId: this.dataForm.majorId
      }
      this.$api.addclassroom.listSelectSubject(params).then(res => {
        if (res.code === 0) {
          this.subjectList = res.data
          // res.data.map(item=>{
          //     this.subjectList.push(item);
          // })
        }
      })
    },

    showPkgList() {
      const params = {
        ctId: this.dataForm.ctId,
        majorId: this.dataForm.majorId,
        subjectRef: this.dataForm.subjectId
      }
      // this.dataForm.pkgId = "";
      this.$api.pkgInfo.listPkgInfoSelect(params).then((res) => {
        if (res.code === 0) {
          this.pkgList = res.data
        }
      })
    }

  }
}

</script>

<style scoped>
    .add-classroom-box .add-classroom{
        width: 1200px;
        height: 100%;
        margin:20px auto;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 10px;
        background: white;
    }
    .right-box{
        width: 48%;
        margin-left: 40px;
    }
    .class-room-cover-box .cover-title{
        height: 38px;
        text-align: left;
        margin-top: 20px;
    }
    .class-room-cover-box{
      display: flex;
    }
    .class-room-cover-box .cover-img-box{
        width: 80%;
        text-align: left;
        padding-left: 40px;
        padding-top:17px;
        padding-bottom: 13px;
    }
    .add-img{
        border: 1px solid #d4d4d4;
        height: 94px;
        line-height: 94px;
        width: 120px;
        text-align: center;
        font-size: 50px;
        color: #d4d4d4;
        font-weight: 100;
        cursor: pointer;
    }
    .form-content-box{
        width: 80%;
        margin: 20px auto;
        display: flex;
        font-size: 14px;
    }
    .form-content-box .form-content{
        width: 48%;
        margin-right: 2%;
    }
    .form-content-box .form-content .form-item{
        display: flex;
        /* align-items: center; */
        /* height: 38px;
        line-height: 38px; */
        margin-top: 20px;
    }
    .form-content-box .form-content .form-item .input-hint{
        width: 22%;
        line-height: 38px;
        text-align: left;
        margin-right:10px;
    }
    .form-content-box .form-content .form-item  .input-box{
        width:76%;
    }
    .right-box .cover-title {
      width: 25%;
    }
    .cover-radio{
        height: 38px;
        text-align: left;
        margin-top: 20px;
    }
    .radio-audit{
        margin-left: 35px;
    }
</style>
