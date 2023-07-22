<!-- element多层表头渲染组件 -->
<template>
  <el-table-column
    :prop="col.regular_id"
    :label="col.regular_name"
    :align="alignType"
  >
    <template v-for="(item, index) of col.children">
      <recursive-table v-if="item.children" :key="index" :col="item" :isView="isView"></recursive-table>
      <el-table-column
        v-else
        :key="index"
        :label="item.regular_name + (item.regular_sum ? '\n(' + item.regular_sum + '分)' : '')"
        :prop="item.regular_id"
        :align="alignType"
      >
        <template slot-scope="scope">
            <el-input
                size="mini"
                :disabled="isView"
                :oninput="'if(value>' + item.regular_sum + ')value=' + item.regular_sum"
                onkeyup="this.value=this.value.replace(/\D/g,'')"
                v-model="scope.row[item.regular_id]">
            </el-input>
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "recursive-table",
  props: {
    isView: {
      type: Boolean,
      default: false,
    },
    col: {
      type: Object,
    },
    //判断单元格文字是居中还是左对齐显示
    alignType: {
      type: String,
      default: "center",//默认居中
    },
  },
};
</script>
<style scoped>
  
</style>