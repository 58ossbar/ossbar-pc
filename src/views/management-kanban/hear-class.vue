<!--
 * @Author: your name
 * @Date: 2021-01-04 11:41:41
 * @LastEditTime: 2021-01-04 11:50:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \creatorblue-stp-evgl-ui\src\views\hear\hear-class.vue
-->
<template>
  <div class="backgroundColorGrey">
    <header-nav :current-index="2"/>
    <perseverance-plate/>
  </div>
</template>

<script>
import headernav from '@/components/header-nav-study'
import FooterNav from '@/components/footer-nav-not-info'
import PerseverancePlate from '@/views/perseverance/perseverance-plate'
export default {
  components: {
    'header-nav': headernav,
    'footer-nav': FooterNav,
    'perseverance-plate': PerseverancePlate
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
