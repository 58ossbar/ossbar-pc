<!-- 模态框组件 -->
<template>
  <div
    :id="id"
    class="modal fade "
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
    data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div id="modal-title" class="modal-title" style="padding-left: 15px">{{ title }}</div>

          <!-- 模态框右上方关闭X按钮 -->
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

        </div>
        <div class="modal-body">
          <!-- 模态框内容区域 -->
          <slot name="main" class="modal-body-main"/>
          <!-- 模态框按钮 -->
          <div v-if="isShowFooterBtn" class="news-info-btn-list">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="handleSubmit">确定</b-button>
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="handleCancel">取消</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import { preventBackgroundScrolling } from '@/utils/global'
export default {
  name: 'ModalDialog',
  components: {

  },
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isShowFooterBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    const that = this
    $('#' + this.id).on('hide.bs.modal', function() {
      preventBackgroundScrolling(false)
      setTimeout(() => {
        that.cancelCodeModal()
      }, 500)
    })
    $('#' + this.id).on('show.bs.modal', function() {
      preventBackgroundScrolling(true)
    })
    $('#' + this.id).on('hidden.bs.modal', function() {
      // document.body.style.height = '100%';
      that.handleCancel()
    })
    $('#' + this.id).on('shown.bs.modal', function() {
      // document.body.style.height = '100vh';
    })
  },
  methods: {
    handleSubmit() {
      this.$emit('submit')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    // 打开与关闭课堂二维码时窗口的大小设置
    changeCodeModal() {
      $('.modal-dialog').css('max-width', '40%')
      $('.modal-body').css('overflow-y', 'hidden')
    },
    // 打开权限设置弹出框时的窗口大小
    changePermissionsModal() {
      $('.modal-dialog').css('max-width', '800px')
    },
    // 打开  移出课堂成员  弹出框时的窗口大小
    changeDelMemberModal() {
      $('.modal-dialog').css('max-width', '942px').css('margin-top', '5vh')
    },
    changeExperienceModal(width) {
      $('.modal-dialog').css('max-width', width || '650px')
    },
    cancelCodeModal() {
      $('.modal-dialog').css('max-width', '500px')
    }
  }
}
</script>

<style scoped>
     .news-info-btn-list{
        margin-top:10px;
        text-align: center;
    }
    .news-info-btn-list button{
        width: 100px;
        margin-right:10px;
    }
    .modalZIndex{
      z-index: 65536 !important;
    }
    .modal{
      overflow: auto !important;
    }
    .modal-dialog{
      margin: 0 auto 50px;
      /* top: 15%; */
      /* margin-top: 15vh; */
      /* padding-top: 15vh; */
      box-sizing: border-box;
    }
    .modal-body{
      max-height: calc(100vh - 2rem - 22px - 10vh);
      overflow-y: scroll;
    }

</style>
