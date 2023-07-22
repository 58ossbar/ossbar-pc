<template>
  <div>
    <div  :id="'active'+ itemResChil.chapterId" class="card menu_child" v-for="(itemResChil, childIndex) in datas" v-if="datas.length>0">
      <div class="card-header panel-heading mb-0"  :id="itemResChil.chapterId " @click="addClassColllapseCh(itemResChil)"
           data-toggle="collapse" :data-target="'#collapse'+ itemResChil.chapterId" aria-expanded="true"
           :aria-controls="'collapse'+ itemResChil.chapterId">
        <img class="arrow_down" v-if="itemResChil.children.length>0"  src="static/creatorblue/img/arrow_right.svg">
        <a class="panel-title menu" :uid="itemResChil.chapterId" :pid="itemResChil.parentId">{{index}}.{{childIndex+1}} {{itemResChil.chapterName}}</a>
      </div>
      <div v-if="itemResChil.children.length>0" :id="'collapse'+ itemResChil.chapterId" class="collapse show" :aria-labelledby="itemResChil.chapterId"
           :data-parent="'#active'+ itemResChil.chapterId">
        <div class="card-body panel-body">
          <library-tree :datas="itemResChil.children" :index="index+'.'+(childIndex+1)" v-on:findBreadcrumb="onFindBreadcrumb"></library-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'library-tree',
  components: {
  },
  data () {
    return {
    }
  },
  props: {
    datas: Array,
    index: String
  },
  methods: {
    addClassColllapseCh: function (data) {
      let j1 = '#' + data.chapterId
      $('.menu_active').removeClass('menu_active')
      $(j1).find('a').addClass('menu_active')
      if ($(j1).hasClass('collapsed')) {
        $(j1).find('img').addClass('arrow_down')
      } else {
        $(j1).find('img').removeClass('arrow_down')
      }
      this.$emit('findBreadcrumb', data)
      /* if ($(j1).next().hasClass('collapse')) {
        let chil = $(j1).next().find('.card-header:first-child')
        chil.click(function () {
          this.addClassColllapseCh({chapterId: chil.attr('id') })
        })
        /!* this.addClassColllapseCh({chapterId: $(j1).next().find('.card-header:first-child').attr('id') }) *!/
      } */
    },
    onFindBreadcrumb: function (data) {
      // 获取到的data是点击的那个的所有信息，名称要和传到父组件的事件名findBreadcrumb一样
      this.$emit('findBreadcrumb', data)
    }
  },
  mounted () {
    this.$nextTick(function () {
    })
  }
}
</script>

<style scoped>

</style>
