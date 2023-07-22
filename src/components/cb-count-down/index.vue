<!-- 考试倒计时显示组件 -->
<template>
    <!-- 考试倒计时显示 -->
    <span style="font-size:20px;color:red;">{{hourString+':'+minuteString+':'+secondString}}</span>
</template>

<script>
  export default {
    data () {
      return {
        hour: '',       //小时
        minute: '',     //分钟
        second: '',     //秒
        promiseTimer: ''    //定时器
      }
    },
    props: {
      remainTime: {    // 倒计时间总秒数
        default: ''
      }
    },
    watch: {
      //监听  剩余考试秒数的改变   调整时间格式
      remainTime(newValue, oldValue){
        if (this.remainTime > 0) {
          this.hour = Math.floor((this.remainTime / 3600) % 24)
          this.minute = Math.floor((this.remainTime / 60) % 60)
          this.second = Math.floor(this.remainTime % 60)
          this.countDowm()
        }
      }
    },
    mounted () {

      if (this.remainTime > 0) {
        //格式化秒数
        this.hour = Math.floor((this.remainTime / 3600) % 24)
        this.minute = Math.floor((this.remainTime / 60) % 60)
        this.second = Math.floor(this.remainTime % 60)
        this.countDowm()
      }

    },
    methods: {
      //创建倒计时定时器
      countDowm () {
        var self = this
        clearInterval(this.promiseTimer)
        this.promiseTimer = setInterval(function () {
          if (self.hour === 0 && self.minute === 0 && self.second === 0) {
            self.$parent.submitAnswer();
          }
          if (self.hour === 0) {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.second = 0
              self.$emit('countDowmEnd', true)
              clearInterval(self.promiseTimer)
            } else {
              self.second -= 1
            }
          } else {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.hour -= 1
              self.minute = 59
              self.second = 59
            } else {
              self.second -= 1
            }
          }
        }, 1000)
      },
      //值小于10，十位数补0
      formatNum (num) {
        return num < 10 ? '0' + num : '' + num
      }
    },
    computed: {
      //时分秒值小于10，十位数补0
      hourString () {
        return this.formatNum(this.hour)
      },
      minuteString () {
        return this.formatNum(this.minute)
      },
      secondString () {
        return this.formatNum(this.second)
      }
    },
    beforeDestroy() {
      clearInterval(this.promiseTimer);
    }
  }
</script>