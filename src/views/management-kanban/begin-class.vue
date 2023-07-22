<!--
 * @Author: your name
 * @Date: 2021-01-04 11:41:41
 * @LastEditTime: 2021-01-04 11:48:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \creatorblue-stp-evgl-ui\src\views\begin\begin-class.vue
-->
<template>
  <div class="backgroundColorGrey">
    <header-nav2/>
    <manage-board v-if="isTeacher"/>
    <personal-center v-if="!isTeacher"/>
    <!--<footer-nav></footer-nav>-->
  </div>
</template>

<script>
import headernav2 from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import manageBoard from '@/views/manage-board/manage-board'
import PersonalCenter from '@/views/management-kanban/personal-center'
export default {
  components: {
    'header-nav2': headernav2,
    'manage-board': manageBoard,
    'footer-nav': FooterNav,
    'personal-center': PersonalCenter
  },
  data() {
    return {
      isTeacher: true
    }
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.isTeacher = userInfo.isTeacher
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
