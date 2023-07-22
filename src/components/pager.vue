<!-- 分页组件 -->
<template>
 <div class="pagination-box">
     <ul v-if="!isElPagination" :class="['pagination',alignComputd]">
        <li :class="['page-item',((pageArr.length <= 1) || (currPage == 1))?'disabled not-allowed':'']">
            <a
                @click="setPage('prev')"
                class="page-link"
                href="javascript:void(0)"
            ><img src="static/image/teaching_center/left_arrow_2.png" alt=""></a>
        </li>
        <li
            v-if="pageIndex-2>1"
            :class="['page-item',pageIndex===1?'active':'']">
            <a
                @click="setPage(1)"
                class="page-link"
                href="javascript:void(0)"
            >1</a>
        </li>
        <li
            class="page-item"
            v-if="(pageIndex-3>1) && pageArr.length > 3"
        >
            <a
                @click="setPage(currPage-4)"
                class="page-link "
                href="javascript:void(0)" >...</a>
        </li>
        <li
            v-for="(value,index) in pageArrPager"
            :key="index"
            v-if="value < (pageIndex + 3) && value > (pageIndex - 3)"
            :class="['page-item',pageIndex===value?'active':'']">
            <a
                @click="setPage(value)"
                class="page-link"
                href="javascript:void(0)"
            >{{value}}</a>
        </li>
       <li
            class="page-item"
            v-if="pageArr.length > pageIndex+3" >
            <a
                @click="setPage(currPage+4)"
                class="page-link page-forward"
                href="javascript:void(0)">...</a>
        </li>
         <li
            v-if="pageArr.length > 3 && pageArr.length > pageIndex+2"
            :class="['page-item',pageIndex===pageArr.length?'active':'']">
            <a
                @click="setPage(pageArr.length)"
                class="page-link"
                href="javascript:void(0)"
            >{{pageArr.length}}</a>
        </li>
        <li
            :class="['page-item',((pageArr.length <= 1) || (pageArr.length == currPage)) ? 'disabled not-allowed' : '']"
            class="page-item">
            <a
                @click="setPage('next')"
                class="page-link"
                href="javascript:void(0)"
            ><img src="static/image/teaching_center/right_arrow_2.png" alt=""></a>
        </li>
    </ul>

    <el-pagination
    v-if="isElPagination"
    :class="[alignComputdP]"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageIndex"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="sizes, prev, pager, next, jumper"
    :page-count="totalPage">
    </el-pagination>

 </div>
</template>

<script>
export default {
  name: 'pager',
  props: {
    // 是否是element ui 组件
    isElPagination: {
      type: Boolean,
      default: true
    },
    // 分页的位置
    align: {
      type: String,
      default: 'left'
    },
    pageSizeProp: {
      type: Number,
      default: 10
    },
    currPage: Number, // 当前页面
    totalPage: Number // 总页数
  },
  data () {
    return {
      pageSizes: [], // [10, 20, 30, 40, 50] 每页显示个数选择器的选项设置
      pageSize: this.pageSizeProp, // 一页显示几条
      pageArr: [], // 存放全部页面
      pageArrPager: [],
      pageIndex: this.currPage
    }
  },
  components: {

  },
  watch: {
    pageSizeProp: {
      handler (newindex, oldindex) {
        if (newindex && newindex > 0) {
          this.pageSize = newindex

          this.pageSizes = [newindex * 1, newindex * 2, newindex * 3, newindex * 4, newindex * 5]
        }
      },
      deep: true,
      immediate: true
    },
    // currPage: {
    //   handler (newindex, oldindex) {
    //     if (newindex != oldindex) {
    //       this.pageIndex = newindex
    //       this.initPageArr()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    currPage: function (newindex, oldindex) {
      if (newindex != oldindex) {
        this.pageIndex = newindex
        this.initPageArr()
      }
    },
    totalPage: function (newTotalPage, oldTotalPage) {
      if (newTotalPage != oldTotalPage) {
        this.totalPage = newTotalPage
        this.initPageArr()
      }
    }
  },
  computed: {
    alignComputd: function () {
      if (this.align === 'center') {
        return 'justify-conten-center'
      } else if (this.align === 'right') {
        return 'justify-conten-end'
      } else {
        return 'justify-conten-start'
      }
    },
    alignComputdP: function () {
      if (this.align === 'center') {
        return 'textAlignCenter'
      } else if (this.align === 'right') {
        return 'textAlignRight'
      } else {
        return 'textAlignLeft'
      }
    }
  },
  mounted () {
    this.initPageArr()
  },
  methods: {
    setPage (value) {
      if (value === 'prev') {
        if (this.pageIndex > 1) {
          this.pageIndex = this.pageIndex - 1
        }
      } else if (value === 'next') {
        if (this.pageIndex < this.pageArr.length) {
          this.pageIndex = this.pageIndex + 1
        }
      } else {
        this.pageIndex = parseInt(value)
      }
      this.getPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getPage()
    },
    handleSizeChange (val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getPage()
    },
    // 获取页面
    getPage () {
      this.$emit('changeIndex', this.pageIndex, this.pageSize)
    },
    initPageArr () {
      this.pageArr = []
      for (let i = 0; i < this.totalPage; i++) {
        this.pageArr.push(i + 1)
      }
      // 分页的省略号优化
      if (this.pageArr.length > 9) {
        if (this.pageIndex > 5) {
          if (this.pageArr.length - 3 > this.pageIndex || this.pageArr.length - 3 == this.pageIndex) {
            this.pageArrPager = this.pageArr.slice(this.pageIndex - 4, this.pageIndex + 3)
          } else if ((this.pageArr.length - 3 < this.pageIndex && this.pageIndex < this.pageArr.length) || this.pageIndex == this.pageArr.length) {
            this.pageArrPager = this.pageArr.slice(this.pageArr.length - 8, this.pageArr.length)
          }
        } else {
          this.pageArrPager = this.pageArr.slice(0, 8)
        }
      } else {
        this.pageArrPager = this.pageArr.slice(0, this.pageArr.length)
      }
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
    .justify-conten-end{
        justify-content: flex-end;
    }
    .justify-conten-start{
        justify-content: flex-start;
    }
    .justify-conten-center{
        justify-content: center;
    }
    a:active, a:focus, a:hover, a:visited {
        color: #fd7512;
        border: 1px solid #dee2e6 !important;
    }
    .not-allowed{
        cursor:not-allowed;
    }
</style>
