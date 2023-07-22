<!-- 多选组件 -->
<template>
  <div>
    <select
      :id='id'
      class='selectpicker show-tick  form-control'
      data-dropup-auto='true'
      :disabled="disabled === 'true' ? true : false"
      data-live-search='false'
      multiple :title='title' >
      <option
          :value='option.classId'
          :key="option.classId"
          v-for='option in options'>
        {{option.className}}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'select-packer',
  //props:['options','value','id'],
  components: {

  },
  props: {
    id: {
      type: String,
      default: 'cb-mul-select',
      required: true
    },
    value: {
      type: String,
      default: '',
      required: false
    },
    options: {
      type: Array,
      default: [],
      required: true,
    },
    disabled:{
      type: String,
      default: 'false',
      required: false
    },
    title: {
      type: String,
      default: '请选择',
      required: false
    },
  },
  data () {
    return {

    }
  },
  mounted:function(){
    var vm = this;
    $('#'+this.id).selectpicker('val',this.value!=null?this.value:null);
    $('#'+this.id).on('changed.bs.select',function(){
　　  vm.$emit('input',$('#'+vm.id).val());
　　　if (typeof(vm.method) != 'undefined'){
　　　 vm.method(vm.index,vm.childidx,vm.value);
　　　}
　　});
    $('#'+this.id).on('show.bs.select',function(){
      if (typeof(vm.load) != 'undefined'){
        vm.load(vm.index,vm.childidx);
      }
    })
  },
  watch:{
    value(newV,oldV){
　　  $('#'+this.id).selectpicker('val',newV);
    }
  },
  updated:function(){
    this.$nextTick(function(){
      $('#'+this.id).selectpicker('refresh');
    })
  },
  destroyed:function(){
    $('#'+this.id).selectpicker('destroy');
  }
}
</script>

<style>


</style>
