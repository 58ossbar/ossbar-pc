<!-- 统计图组件 -->
<template>
  <div
    :id="id"
    :style="'width:'+ width+'px;height:'+height+'px;'"/>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Gauge',
  components: {

  },
  props: {
    id: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '160'
    },
    width: {
      type: String,
      default: '160'
    },
    color: {
      type: Array,
      default: () => {
        return [[0.2, '#15c1e0'], [0.8, '#498bba'], [1, '#ff4500']]
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option1: {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: this.name, // '云教材学习',
            type: 'gauge',
            radius: '100%',
            'center': ['50%', '60%'], // 整体的位置设置
            detail: {
              formatter: '{value}%',
              textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#15c1e0',
                fontSize: 16
              }
            },
            data: this.data, // [{value:33.33, name: '进度'}],
            axisLabel: {
              show: false
            },
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                color: this.color,
                width: 13
              }
            },
            splitLine: {
              length: 13, // 属性length控制线长
              lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                // color: '#eee',
                width: 2,
                type: 'solid'
              }
            },
            pointer: {
              show: true,
              length: '70%',
              width: '4%'
            }
          }
        ]
      }
    }
  },
  watch: {
    'data': function(val) {
      this.option1.series[0].data = val
      this.initEcharts()
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const echartsObj = echarts.init(document.getElementById(this.id))
      echartsObj.setOption(this.option1, true)
      // setInterval(() =>{
      //     this.option1.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
      //     echartsObj.setOption(this.option1,true);
      // },2000);
    }
  }
}
</script>

<style>

</style>
