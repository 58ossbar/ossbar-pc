<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
    width: 100%;
    /* height: 100%; */
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #f5f5f5;
}
/* 解决element-ui的table表格控件表头与内容列不对齐间题 */
.el-table th.gutter{
    display: table-cell!important;
}
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  -webkit-border-radius: 6px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 3px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
/*解决按钮点击时的边框问题*/
button:hover, button:focus, button:active, button:visited {
  outline: none;
  box-shadow: none !important;
}
/* 解决element-ui中tree的复选框偏上问题 */
.el-tree-node__content>label.el-checkbox{
  margin-top: 8px;
}

.el-avatar>img{
  width: 100%;
}
</style>
