<template>
  <div class="backgroundColorGrey">
    <header-nav/>
    <manage-board v-if="ifTeacher"/>
    <personal-center v-if="!ifTeacher"/>
    <!--<footer-nav></footer-nav>-->
  </div>
</template>

<script>
import HeaderNav from '@/components/header-nav'
import FooterNav from '@/components/footer-nav-not-info'
import manageBoard from '@/views/manage-board/manage-board'
import PersonalCenter from '@/views/management-kanban/personal-center'
export default {
  components: {
    'header-nav': HeaderNav,
    'manage-board': manageBoard,
    'footer-nav': FooterNav,
    'personal-center': PersonalCenter
  },
  data() {
    return {
      ifTeacher: false
    }
  },
  mounted() {
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
