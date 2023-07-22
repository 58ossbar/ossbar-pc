<template>
  <div class="backgroundColorGrey">
    <header-nav/>
    <view-all-news-details/>
    <footer-nav/>
  </div>
</template>

<script>
import headernav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import ViewAllNewsDetails from './view-all-news-details'
export default {
  components: {
    'header-nav2': headernav,
    'footer-nav': FooterNav,
    'view-all-news-details': ViewAllNewsDetails
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
