<!-- 统计图组件 -->
<template>
  <div
    :id="id"
    :style="'width:'+ width+';height:'+height+';'"/>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'BrokenLine',
  components: {
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '170px'
    },
    width: {
      type: String,
      default: '170px'
    },
    dataInfo: {
      type: Object,
      default: function() {
        return {
          title: '',
          xAxisArr: [],
          seriesArr: []
        }
      }
    }
  },
  data() {
    return {
      option1: {
        title: {
          text: this.dataInfo.title // '出勤统计图（%）'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: false
        },
        // legend: {
        //     data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          //   boundaryGap: false,
          data: this.dataInfo.xAxisArr // ['04-01']
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %'
            },
            show: true
          }
        ],
        series: this.dataInfo.seriesArr
      }
    }
  },
  watch: {
    'dataInfo': function(val) {
      this.option1.title.text = val.title
      this.option1.xAxis.data = val.xAxisArr
      this.option1.series = val.seriesArr
      this.initEcharts()
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const echartsObj = echarts.init(document.getElementById(this.id))
      echartsObj.setOption(this.option1)
    }
  }
}
</script>

<style>
</style>
