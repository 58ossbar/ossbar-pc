<!-- 题库的 添加试题页面 -->
<template>
    <div class="backgroundColorGrey ">
        <header-nav :currentIndex="2" ></header-nav>
        <!-- 导航栏 begin  -->
        <div class="test-question-bank-nav test-question-bank-nav2 wind-1240">
            <div class="location">
                <div class="localtion-title"><b>当前位置:</b></div>
                <ul class="localtion-list">
                    <li class="localtion-item" style="cursor: pointer">
                        评测中心
                    </li>
                    <li class="localtion-item" @click="toback('/question-bank-center/test-question-bank')" style="cursor: pointer">
                        试题库
                    </li>
                    <li class="localtion-item">
                    <span style="color: #959da0">{{type}}</span>
                    </li>
                </ul>
            </div>
            <div class="question-back">
                <i class="fa fa-angle-left question-back-icon" aria-hidden="true" @click="toback('/question-bank-center/test-question-bank')"></i>
                <span @click="toback('/question-bank-center/test-question-bank')">返回</span>
            </div>
        </div>
        <!-- 导航栏end -->
        <div class="wind-1240">
          <cd-creator-test-question-comm pagesType="0"></cd-creator-test-question-comm>
        </div>
        <footer-nav></footer-nav>
    </div>
</template>
<script>
import {toast, confirm, loadingModal} from '@/utils/global'
import $ from '@/assets/jquery-vendor'
import HeaderNav from '@/components/header-nav-start-class'
import FooterNav from '@/components/footer-nav-not-info'
import CreatorTestQuestion from '@/components/cb-creator-question/creator-test-question'
export default {
  name: 'CreatorTestQuestion',
  components: {
    'header-nav': HeaderNav,
    'footer-nav': FooterNav,
    'cd-creator-test-question-comm': CreatorTestQuestion
  },
  data () {
    return {
      type: '添加试题',
      questionsId: '' // 试题id，如果有则为编辑

    }
  },
  watch: {},
  computed: {
  },
  created () {
  },
  mounted () {
    this.questionsId = localStorage.getItem('editQuesQuestionsId') // (this.$route && this.$route.query && this.$route.query.questionsId) ? (this.$route.query.questionsId) : ''
    if (this.questionsId) {
      this.type = '编辑试题'
    } else {
      this.type = '添加试题'
    }
  },
  methods: {
    /** 返回 */
    toback: function (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
    /* 返回 */
    .test-question-bank-nav{
        /* width: 100%; */
        display: flex;
    }
    .test-question-bank-nav2{
        display: flex;

        margin: 20px auto;
        background-color: #fff;
        -webkit-box-shadow: 2px 2px 2px #e0e0e0;
        box-shadow: 2px 2px 2px #e0e0e0;
        border: 1px #e0e0e0 solid;
        border-radius: 6px;
    }
    .location,
    .question-back{
      height: 50px;
      line-height: 50px;
    }
    .question-back{
        width: 100%;
        text-align: right;
        font-size: 14px;
        /* margin: 20px; */
        padding-right: 20px;
        cursor: pointer;
        color: #158aeb;
        box-sizing: border-box;
    }
    .question-back-icon{
        font-size: 14px;
        margin-right: 5px
    }
</style>
