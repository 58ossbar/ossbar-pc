<template>
  <div class="backgroundColorGrey">
    <header-nav/>
    <manage-board v-if="isTeacher"/>
    <personal-center v-if="!isTeacher"/>
    <!--<footer-nav></footer-nav>-->
  </div>
</template>

<script>
import HeaderNav from '@/components/header-nav'
import FooterNav from '@/components/footer-nav-not-info'
import manageBoard from '@/views/manage-board/manage-board'
import PersonalCenter from '@/views/management-kanban/personal-center'
import { handleImagePath } from '@/utils/util'
export default {
  components: {
    'header-nav': HeaderNav,
    'manage-board': manageBoard,
    'footer-nav': FooterNav,
    'personal-center': PersonalCenter
  },
  data() {
    return {
      isTeacher: false
    }
  },
  mounted() {
    // this.$api.login.getUser().then((res) => {
    //   // 处理头像
    //   res.data.traineeHead = handleImagePath(res.data.traineeHead)
    //   // 保存至缓存中
    //   localStorage.setItem('username', res.data.nickName)
    //   localStorage.setItem('userimg', res.data.traineeHead)
    //   localStorage.setItem('userInfo', JSON.stringify(res.data))
    //   localStorage.setItem('isTeacher', res.data.isTeacher ? 'Y' : 'N')
    //   const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //   this.userName = userInfo.nickName
    //   this.isTeacher = userInfo.isTeacher
    // })
  },
  methods: {

  }
}
</script>

<style scoped>
    .wind-1220{
        width:1220px;
        height:100%;
        margin:0 auto;
    }
    .color-000{
        color:#000;
    }
    .color-fff{
        color:#fff;
    }

    .title{
        font-weight:400;
        color:#8d949c;
        margin-top:10px;
    }

</style>
