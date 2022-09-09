<!-- 分页组件 -->
<template>
  <div class="pagination-box">
    <el-pagination
      :class="[alignComputdP]"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :page-count="totalPage"
      background
      layout="sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>

  </div>
</template>

<script>
export default {
  name: 'Pager',
  components: {
  },
  props: {
    // 分页的位置
    align: {
      type: String,
      default: 'left'
    },
    pageSizeProp: {
      type: Number,
      default: 10
    },
    currPage: {
      type: Number,
      default: 1
    }, // 当前页面
    totalPage: {
      type: Number,
      default: null
    } // 总页数
  },
  data() {
    return {
      pageSizes: [], // [10, 20, 30, 40, 50] 每页显示个数选择器的选项设置
      pageSize: this.pageSizeProp, // 一页显示几条
      pageIndex: this.currPage
    }
  },
  computed: {
    alignComputdP: function() {
      if (this.align === 'center') {
        return 'textAlignCenter'
      } else if (this.align === 'right') {
        return 'textAlignRight'
      } else {
        return 'textAlignLeft'
      }
    }
  },
  watch: {
    pageSizeProp: {
      handler(newindex, oldindex) {
        if (newindex && newindex > 0) {
          this.pageSize = newindex

          this.pageSizes = [newindex * 1, newindex * 2, newindex * 3, newindex * 4, newindex * 5]
        }
      },
      deep: true,
      immediate: true
    },
    currPage: function(newindex, oldindex) {
      if (newindex != oldindex) {
        this.pageIndex = newindex
      }
    },
    totalPage: function(newTotalPage, oldTotalPage) {
      if (newTotalPage != oldTotalPage) {
        this.totalPage = newTotalPage
      }
    }
  },
  mounted() {
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getPage()
    },
    handleSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getPage()
    },
    // 获取页面
    getPage() {
      this.$emit('changeIndex', this.pageIndex, this.pageSize)
    }
  }
}
</script>

<style scoped>
     /* 分页 */
    .pagination-box{
        padding:35px 0;
    }
    .pagination .page-item .page-link{
        margin: 0px 3px;
        z-index: 1;
        border-radius: 0.25rem !important;
    }
</style>
