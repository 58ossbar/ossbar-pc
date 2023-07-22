<!-- 上传 辅教视频  页面 -->
<template>
  <div class="add-classroom-box backgroundColorGrey">
    <header-nav :current-index="4" />
    <div class="add-classroom">
      <div style="display: flex">
        <div style="width: 100%;text-align: left;margin: 20px" >{{ isEdit ? '编辑视频' : '上传视频' }}</div>
        <div style="width: 100%;text-align: right;font-size: 14px;margin: 20px;cursor: pointer;color: #158aeb" >
          <i class="fa fa-angle-left" aria-hidden="true" style="font-size: 14px;margin-right: 5px" @click="toBack()"/>
          <span @click="toBack()">返回</span>
        </div>
      </div>
      <div style="width: 1200px;height: 1px;background: #e0e0e0"/>
      <div style="width: 1200px">
        <form>
          <div class="form-content-box">
            <div class="form-content">

              <div class="form-item">
                <div class="input-hint">视频分类<span class="color-d81e06">*</span></div>
                <div class="input-box">
                  <el-select
                    id="videoType"
                    v-model="dataForm.videoType"
                    style="font-size: 14px;width:100%;"
                    placeholder="请选择视频分类"
                    disabled
                  >
                    <el-option
                      v-for="item in videoTypeList"
                      :key="item.dictId"
                      :label="item.dictValue"
                      :value="item.dictCode"/>
                  </el-select>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 videoTypeHint"><small >请选择视频分类！</small></div>
                </div>
              </div>

              <!--<div class="form-item">
                            <div class="input-hint">所属课堂<span v-if="Number(dataForm.videoType) === 1" class="color-d81e06">*</span></div>
                            <div class="input-box">
                                <el-select
                                    v-model="dataForm.ctIdList"
                                    style="width:100%;"
                                    multiple
                                    id="ctIdList"
                                    filterable
                                    default-first-option
                                    placeholder="请选择所属课堂">
                                    <el-option
                                    v-for="item in roomList"
                                    :key="item.ctId"
                                    :label="item.name"
                                    :value="item.ctId">
                                    </el-option>
                                </el-select>
                                <div class="invalid-feedback col-10 textAlignLeft p-0 ctIdListHint"><small >请选择所属课堂！</small></div>
                            </div>
                        </div>-->

              <div class="form-item">
                <div class="input-hint">
                  视频标题
                  <!--<span class="color-d81e06">*</span>-->
                </div>
                <div class="input-box">
                  <el-input
                    id="title"
                    v-model="dataForm.title"
                    type="text"
                    placeholder="请输入视频标题"
                    style="font-size: 14px;height: 38px"
                    maxlength="50"/>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 titleHint"><small >请输入视频标题！</small></div>
                </div>
              </div>
              <div class="form-item">
                <div class="input-hint">
                  视频备注
                  <!--<span class="color-d81e06">*</span>-->
                </div>
                <div class="input-box">
                  <el-input
                    id="intro"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    v-model="dataForm.remark"
                    type="textarea"
                    placeholder="请输入备注信息"
                    maxlength="300"
                    style="width: 100%;font-size: 14px;height: 100px"
                    show-word-limit/>
                  <div class="invalid-feedback col-10 textAlignLeft p-0 titleHint"><small >请输入视频标题！</small></div>
                </div>
              </div>
            </div>
            <div class="right-box">
              <div class="class-room-cover-box">
                <div class="cover-title">视频文件<span class="color-d81e06">*</span></div>
                <div class="cover-img-box">
                  <label class="cursor-painter" for="classroomPic">
                    <input
                      id="classroomPic"
                      type="file"
                      name="ClassImg"
                      accept="video/*"
                      style="display: none"
                      @change="changeImage($event)">
                    <p>点此选择视频</p>
                    <div :class="dataForm.pic ? 'upload-item' : ''">
                      <video v-show="dataForm.pic" id="video" :src="src" class="video" controls width="310" height="190"/>
                    </div>
                  </label>
                </div>
              </div>
              <div class="invalid-feedback col-10 textAlignLeft p-0 classroomPicHint"><small style="margin-left:40%;">请上传视频！</small></div>
            </div>
          </div>

          <!--<div style="width: 80%;margin: 20px auto;display: flex;font-size: 14px">
                    <div style="text-align: left;width: 11%;height: 100px;line-height: 100px;margin-right:3px;">视频备注</div>
                    <el-input
                        id="intro"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="请输入备注信息"
                        maxlength="300"
                        style="width: 86%;font-size: 14px;height: 100px"
                        show-word-limit
                        v-model="dataForm.remark">
                    </el-input>
                </div>-->

          <div style="width: 80%;margin: 20px auto;display: flex">
            <button :disabled="isDisable" type="button" class="btn btn-outline-primary" style="font-size: 14px;width: 100px;margin-left: 380px;margin-right: 20px" @click="toSave()">确定</button>
            <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 20px" @click="toBack()">取消</button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
<script>
import $ from '@/assets/jquery-vendor'
import { baseUrl, toast, formVaildStyle, formInVaildStyle, loadingModal } from '@/utils/global'
import HeaderNav from '@/components/header-nav-start-class'
import SelectPacker from '@/components/select-packer'
export default {
  name: 'AddAuxiliaryTeachingVideo',
  components: {
    'header-nav': HeaderNav,
    'vm-select': SelectPacker
  },
  data() {
    return {
      imageUrl: '',
      // 文件列表
      fileList: [],
      // 新增/修改标识
      isEdit: this.$route.query.isEdit,
      // 防止多次提交
      isDisable: false,
      // 视频分类
      videoTypeList: [],
      // 课堂下拉列表
      roomList: [],
      selectedClassssResult: [],
      pic: '../../static/image/uploadImg.png',
      src: '',
      // 表单数据
      dataForm: {
        videoId: '', // 视频主键
        title: '', // 用户自定义名称
        name: '', // 视频地址
        videoType: '1', // 视频分类
        ctIdList: [], // 课堂集合
        remark: '', // 视频简介
        pic: '' // 图片
      },
      title: '请选择上课班级',
      isSelect: false
    }
  },
  created() {},
  mounted() {
    // 处理条件
    const videoInfo = JSON.parse(localStorage.getItem('videoInfo')) // this.$route.query.videoInfo
    if (videoInfo) {
      this.dataForm.videoId = videoInfo.videoId
      this.isEdit = videoInfo.isEdit
    }
    // 视频分类
    this.getVideoTypeList()
    // 课堂列表
    // this.getRoomList()
    // 如果是修改操作
    if (this.isEdit) {
      const formData = new FormData()
      formData.append('videoId', this.dataForm.videoId)
      this.$api.video.viewVideo(formData).then(res => {
        if (res.code === 0) {
          this.dataForm = Object.assign({}, res.data)
          this.dataForm.videoType = res.data.type
          this.dataForm.pic = baseUrl + res.data.firstCaptureAccessUrl
          this.src = baseUrl + res.data.name
          this.fileList = [{ name: res.data.name }]
        }
      })
    }
    this.isSelect = true
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
      this.dataForm.title = file.name
    },
    handleRemove(file) {
      // console.log(file)
    },
    // 课堂列表
    getRoomList() {
      const params = {
        name: ''
      }
      this.$api.video.getRoomList(params).then((res) => {
        if (res.code === 0) {
          this.roomList = res.data
        }
      })
    },
    // 视频分类
    getVideoTypeList() {
      this.$api.video.getVideoTypeList({}).then((res) => {
        if (res.code === 0) {
          this.videoTypeList = res.data
        }
      })
    },
    // 返回-视频列表页面
    toBack: function() {
      this.$router.push('/auxiliary-teaching-video/auxiliary-teaching-video-home')
    },

    /* 班级多选 */
    handleSelectedClassssResult(selectClass) {
      this.dataForm.classId = selectClass.join(',')
    },

    /**
     * 选择图片
     * @param e
     */
    changeImage(e) {
      const file = e.target.files[0]
      /*
      let reader = new FileReader()
      let that = this
      reader.readAsDataURL(file)
      reader.onload = function () {
        console.log(this.result)
        that.dataForm.pic = this.result
      }
      */
      if (file) {
        // console.log(file.size)
        if (file.size > 1024 * 1024 * 300) {
          toast('选择的视频文件大小超过300MB，不允许上传')
          return false
        }
        const video = document.querySelector('#video')
        video.src = URL.createObjectURL(file)
        this.dataForm.pic = 'cb'
        this.dataForm.title = file.name
      }
    },

    // 保存
    toSave: function() {
      // console.log(this.formVerifyBoolean())
      if (!this.formVerifyBoolean()) {
        return false
      }
      // 点击后禁用该按钮
      this.isDisable = true
      const file = document.getElementById('classroomPic').files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('videoId', this.dataForm.videoId)
      formData.append('title', this.dataForm.title)
      formData.append('name', this.dataForm.name)
      formData.append('type', this.dataForm.videoType)
      formData.append('ctIdList', this.dataForm.ctIdList)
      formData.append('remark', this.dataForm.remark)
      loadingModal(true, this.dataForm.ctId ? '正在保存... ' : '正在保存视频相关数据，请稍后...')
      this.$api.video.saveVideo(formData).then((res) => {
        if (res.code === 0) {
          toast(res.msg + '，即将跳转页面', () => {
            this.$router.push('/auxiliary-teaching-video/auxiliary-teaching-video-home')
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
      /*
      if (this.dataForm.title === '') {
        $('#title').focus()
        $('.titleHint').html('请输入视频标题!')
        formInVaildStyle('.titleHint', '#title')
        $('#title').css('borderColor', '#dc3545')
        return false
      } else {
        if (this.dataForm.title.length > 100) {
          $('.titleHint').html('视频标题不能超过100个字符!')
          $('#title').focus()
          $('#title').css('borderColor', '#dc3545')
          formInVaildStyle('.titleHint', '#title')
          return false
        }
      }
      */
      $('#title').removeAttr('style')
      formVaildStyle('.titleHint', '#title')

      // 验证-视频分类
      if (!this.dataForm.videoType) {
        formInVaildStyle('.videoTypeHint', '#videoType')
        $('#videoType').css('borderColor', '#dc3545')
        $('#videoType').focus()
        return false
      }
      $('#videoType').removeAttr('style')
      formVaildStyle('.videoTypeHint', '#videoType')

      // 验证-所属课堂
      /* if (Number(this.dataForm.videoType) === 1) {
        if (!this.dataForm.ctIdList || this.dataForm.ctIdList.length === 0) {
          formInVaildStyle('.ctIdListHint', '#ctIdList')
          $('#ctIdList').css('borderColor', '#dc3545')
          $('#ctIdList').focus()
          return false
        }
        $('#ctIdList').removeAttr('style')
        formVaildStyle('.ctIdListHint', '#ctIdList')
      }*/

      // 验证-视频
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
    }

  }
}
// $(function () {
//     Vue.initSelectPicker();
// });
</script>

<style scoped>
  .upload-item {
    padding: 0;
    border: 1px dashed #d9d9d9;
  }
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
        /*padding-left: 40px;*/
        padding-top:19px;
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
