<template>
  <div class="backgroundColorGrey">
    <!--菜单栏 begin -->
    <header-nav2/>
    <!--菜单栏 end -->
    <div class="my-teaching-nav wind-1240">
      <div class="display-flex">
        <div class="location">
          <div class="localtion-title"><b>当前位置:</b></div>
          <ul class="localtion-list">
            <li class="localtion-item" style="cursor: pointer" @click="toback()">
              管理看板
            </li>
            <li class="localtion-item">
              <span>我的课表</span>
            </li>
          </ul>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="toback()"/>
          <span @click="toback()">返回</span>
        </div>
      </div>
      <div class="my-teaching-search">
        <el-select v-model="filters.scheduleState" size="medium" placeholder="请选择类型" style="margin-left:20px;" clearable @change="queryScheduleData" @clear="queryScheduleData">
          <el-option
            v-for="dict in scheduleStateList"
            :key="dict.dictId"
            :label="dict.dictValue"
            :value="dict.dictCode"/>
        </el-select>
        <el-select v-model="filters.classId" size="medium" placeholder="根据班级查询" style="margin-left:20px;" clearable @change="queryScheduleData" @clear="queryScheduleData">
          <el-option
            v-for="item in classList"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"/>
        </el-select>
        <el-select v-model="filters.roomId" size="medium" placeholder="根据教室查询" style="margin-left:20px;" clearable @change="queryScheduleData" @clear="queryScheduleData">
          <el-option
            v-for="room in trainingRoomList"
            :key="room.roomId"
            :label="room.roomName"
            :value="room.roomId"/>
        </el-select>
        <!--<el-select v-if="!isTeacher" v-model="filters.traineeId" size="medium" placeholder="根据老师查询" @change="queryScheduleData" style="margin-left:20px;">
          <el-option
            v-for="item in teacherList"
            :key="item.traineeId"
            :label="item.teacherName"
            :value="item.traineeId">
          </el-option>
        </el-select>-->
        <el-button type="primary" icon="el-icon-search" style="margin-left:2%;" size="medium" @click="queryScheduleData">搜索</el-button>
      </div>
    </div>

    <!-- 中间内容区 begin -->
    <div class="cb-content">
      <div class="top-mid-title">
        <div v-if="tips" class="temp-tips">温馨提示：{{ tips }}</div>
        <p v-show="isActive==1" >
          <span style="font-weight: 600" @click="leftClick">&lt;&nbsp;&nbsp;</span>
          <!--{{nowYear}}年-->{{ startTime }}-{{ endTime }}
          <span style="font-weight: 600" @click="rightClick">&gt;&nbsp;&nbsp;</span>
        </p>
      </div>
      <div class="in-body-content">
        <!-- 周视图 -->
        <table v-show="isActive==1" class="schedule-table">
          <thead style="background-color: rgb(239, 243, 248);">
            <tr class="theard">
              <td>时间（周/节次）</td>
              <td>周一({{ cupnowDateList[0] }})</td>
              <td>周二({{ cupnowDateList[1] }})</td>
              <td>周三({{ cupnowDateList[2] }})</td>
              <td>周四({{ cupnowDateList[3] }})</td>
              <td>周五({{ cupnowDateList[4] }})</td>
              <td>周六({{ cupnowDateList[5] }})</td>
              <td>周日({{ cupnowDateList[6] }})</td>
            </tr>
          </thead>
          <tbody class="tbody-class">
            <tr v-for="(dict, index) in timeSlotList" :key="dict.id + index">
              <td style="text-align: center">
                <div>{{ dict.name }}</div>
                <div>{{ dict.beginTime + ' - ' + dict.endTime }}</div>
              </td>
              <td>
                <div v-for="item in weekList[0].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[0]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[1].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[1]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[2].weeks[dict.id].list" v-if="weekList[2].weeks[dict.id]" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[2]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[3].weeks[dict.id].list" v-if="weekList[3].weeks[dict.id]" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[3]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[4].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[4]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[5].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[5]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
              <td>
                <div v-for="item in weekList[6].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[6]" :data-timeid="dict.id" class="parent-container">
                  <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"/>
                  <div>教室：{{ item.roomName }}</div>
                  <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                  <div>班级：{{ item.className }}</div>
                  <div>老师：{{ item.teacherName }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 中间内容区 end -->
  </div>
</template>

<script>
import headernav2 from '@/components/header-nav-start-class'
export default {
  name: 'MySchedule',
  components: {
    'header-nav2': headernav2
  },
  data() {
    return {
      isTeacher: false,
      scheduleStateList: [],
      trainingRoomList: [],
      classList: [],
      teacherList: [],
      filters: {
        scheduleState: '',
        roomId: '',
        classId: '',
        traineeId: ''
      },
      tips: '',
      flag: false,
      isActive: 1,
      arr: [],
      nowYear: '',
      startTime: '',
      endTime: '',
      timeSlotList: [],
      beginDate: '',
      endDate: '',
      weekList: [
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        },
        {
          'weeks': {
            '1': null,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
            '6': null
          }
        }
      ]
    }
  },
  computed: {
    cupnowDateList() {
      const array = []
      this.arr.forEach((item) => {
        const ary = item.split('-')
        array.push(ary[1] + '/' + ary[2])
      })
      return array
    },
    cupnowDateListCopy() {
      const array = []
      this.arr.forEach((item) => {
        const ary = item.split('-')
        if (Number(ary[1]) < 10) {
          ary[1] = '0' + ary[1]
        }
        if (Number(ary[2]) < 10) {
          ary[2] = '0' + ary[2]
        }
        array.push(ary[0] + '-' + ary[1] + '-' + ary[2])
      })
      return array
    }
  },
  created() {
    const isTeacherValue = localStorage.getItem('isTeacher')
    this.isTeacher = !!(((isTeacherValue && isTeacherValue === 'Y')))
  },
  mounted() {
    this.getWeeks()
    this.changeTime()
    const date = new Date()
    this.nowYear = date.getFullYear()
    // 获取数据
    this.queryScheduleData()
    this.getDictScheduleState()
    if (this.isTeacher) {
      this.findMyClassList()
    }
    if (!this.isTeacher) {
      // this.findMyTeacherList()
      this.findMyJoinedClassList()
    }
    this.queryTrainingRoomList()
  },
  methods: {
    getMyLabelCss(val) {
      const classMap = {
        1: 'corner-mark schooltime',
        2: 'corner-mark activity',
        3: 'corner-mark holiday',
        4: 'corner-mark self-study',
        5: 'corner-mark other'
      }
      return classMap[Number(val)]
    },
    leftClick() {
      const d = this.getMonDate(this.nowDate('s', -1, this.arr[0]))
      const arr = []
      for (let i = 0; i < 7; i++) {
        arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
        d.setDate(d.getDate() + 1)
      }
      this.arr = arr
      this.changeTime()
      this.queryScheduleData()
    },
    rightClick() {
      const strList = this.arr[0].split('-')
      const month = Number(strList[1]) < 10 ? '0' + strList[1] : strList[1]
      const day = Number(strList[2]) < 10 ? '0' + strList[2] : strList[2]
      const myDate = strList[0] + '-' + month + '-' + day
      // let d = this.getMonDate(this.nowDate("s",1,this.arr[6])) // 该方法有BUG，往右点击，直接跳过了一周的时间
      const res = this.addDate(new Date(myDate), 7)
      const d = this.getMonDate(res)
      const arr = []
      for (let i = 0; i < 7; i++) {
        arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
        d.setDate(d.getDate() + 1)
      }
      this.arr = arr
      this.changeTime()
      this.queryScheduleData()
    },
    /**
     * 添加
     * @param date
     */
    addDate(date, n) {
      date.setDate(date.getDate() + n)
      return date
    },
    /**
     * 获取每周的日子
     */
    getWeeks() {
      const d = this.getMonDate(this.nowDate('s'))
      const arr = []
      for (let i = 0; i < 7; i++) {
        arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
        d.setDate(d.getDate() + 1)
      }
      this.arr = arr
    },
    getMonDate(data) {
      const d = new Date(data)
      const day = d.getDay()
      const date = d.getDate()
      if (day == 1) { return d }
      if (day == 0) { d.setDate(date - 6) } else { d.setDate(date - day + 1) }
      return d
    },
    nowDate(type, dates, date) {
      var now = ''
      if (date) {
        now = new Date(date)
      } else {
        now = new Date()
      }
      var nowTime = now.getTime()
      var day = now.getDay()
      var longTime = 24 * 60 * 60 * 1000
      var n = longTime * 7 * (dates || 0)
      if (type === 's') {
        var dd = nowTime - (day - 1) * longTime + n
      }
      if (type === 'e') {
        var dd = nowTime + (7 - day) * longTime + n
      }
      dd = new Date(dd)
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1
      var d = dd.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      var day = y + '-' + m + '-' + d
      return day
    },
    changeTime() {
      const start = this.arr[0]
      const timelist = start.split('-')
      this.startTime = timelist[0] + '年' + timelist[1] + '月' + timelist[2] + '日'
      const start2 = this.arr[6]
      const timelist1 = start2.split('-')
      this.endTime = timelist1[0] + '年' + timelist1[1] + '月' + timelist1[2] + '日'

      this.beginDate = timelist[0] + '-' + timelist[1] + '-' + timelist[2]
      this.endDate = timelist1[0] + '-' + timelist1[1] + '-' + timelist1[2]
    },
    getBeginDate() {
      let str = ''
      const arr = this.beginDate.split('-')
      for (let i = 0; i < arr.length; i++) {
        if (Number(arr[i]) < 10) {
          arr[i] = '0' + arr[i]
        }
        str += arr[i] + '-'
      }
      // return str ? this.nowYear + '-' + str.substring(0, str.length - 1) : null
      return str ? str.substring(0, str.length - 1) : null
    },
    getEndDate() {
      let str = ''
      const arr = this.endDate.split('-')
      for (let i = 0; i < arr.length; i++) {
        if (Number(arr[i]) < 10) {
          arr[i] = '0' + arr[i]
        }
        str += arr[i] + '-'
      }
      // return str ? this.nowYear + '-' + str.substring(0, str.length - 1) : null
      return str ? str.substring(0, str.length - 1) : null
    },
    queryScheduleData() {
      this.filters.beginDate = this.getBeginDate()
      this.filters.endDate = this.getEndDate()
      this.$api.mySchedule.queryScheduleData(this.filters).then(res => {
        if (res.code === 0) {
          this.timeSlotList = res.data.timeSlotList
          this.weekList = res.data.weekList
          this.tips = res.data.tips
        }
      })
    },
    getDictScheduleState() {
      this.$api.mySchedule.getDictScheduleState({}).then(res => {
        if (res.code === 0) {
          this.scheduleStateList = res.data
        }
      })
    },
    findMyClassList() {
      this.$api.mySchedule.findMyClassList({}).then(res => {
        if (res.code === 0) {
          this.classList = res.data
        }
      })
    },
    findMyJoinedClassList() {
      this.$api.mySchedule.findMyJoinedClassList({}).then(res => {
        if (res.code === 0) {
          this.classList = res.data
          if (this.classList.length === 1) {
            this.filters.classId = this.classList[0].classId
          }
        }
      })
    },
    findMyTeacherList() {
      this.$api.mySchedule.findMyTeacherList({}).then(res => {
        if (res.code === 0) {
          this.teacherList = res.data
        }
      })
    },
    queryTrainingRoomList() {
      this.$api.mySchedule.queryTrainingRoomList({}).then(res => {
        if (res.code === 0) {
          this.trainingRoomList = res.data
        }
      })
    },
    toback() {
      this.$router.push('/begin-class')
    }
  }
}
</script>

<style scoped>
  /* ************************************************** 导航栏样式 begin ************************************************** */
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
  .question-back{
    width: 100%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb;
  }
  .question-back-icon{
    font-size: 14px;
    margin-right: 5px
  }

  .my-teaching-nav{
    min-height: 50px !important;
    margin: 20px auto;
    background-color: #fff;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    padding-bottom: 20px;
  }
  .my-teaching-search{
    display: flex;
  }
  .display-flex{
    display:flex;
  }
  /* 返回 */
  .classroom-back{
    width: 100%;
    text-align: right;
    font-size: 14px;
    margin: 20px;
    cursor: pointer;
    color: #158aeb;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* ************************************************** 导航栏样式 end ************************************************** */
  .cb-content{
    width: 1200px;
    margin:20px auto;
    box-shadow: 2px 2px 2px #e0e0e0;
    border: 1px #e0e0e0 solid;
    border-radius: 6px;
    background: white;
    min-height: 650px;
  }

  /* ************************************************** 表格相关样式 begin ************************************************** */
  .in-body-content{
    width: 100%;
    /* height: 400px; */
    /* border: 1px solid red; */
    margin-top: 10px;
  }

  .top-mid-title{
    width: 280px;
    /*margin: 0 auto;*/
    margin: 10px auto;
    cursor: pointer;
  }
  .top-mid-title p{
    margin: 0;
  }

  .schedule-table{
    border-collapse: collapse;
    margin: 15px 15px;
  }

  .theard td{
    width: 200px;
    height: 50px;
    /*border: 1px solid grey;*/
    border: 1px solid #DCDFE6;
    text-align: center;
  }
  .tbody-class td{
    width: 200px;
    height: 80px;
    /*border: 1px solid grey;*/
    border: 1px solid #DCDFE6;
  }
  /* ************************************************** 表格相关样式 end ************************************************** */
  .temp-tips {
    /*position: absolute;
    right: 28%;*/
    color: #FF740E;
  }

  /* ************************************************** 角标徽标相关样式 begin ************************************************** */
  .parent-container {
    position: relative;
    overflow: hidden;
    /*height: 100%;*/
  }
  .corner-mark {
    position: absolute;
    left: 0px;
    top:0px;
  }
  /*上课*/
  .corner-mark.schooltime::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #ff7f27;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*活动日*/
  .corner-mark.activity::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #87CEEB;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*放假*/
  .corner-mark.holiday::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #3CB371;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*晚自习*/
  .corner-mark.self-study::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #2F4F4F;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /* ************************************************** 角标徽标相关样式 begin ************************************************** */
</style>
