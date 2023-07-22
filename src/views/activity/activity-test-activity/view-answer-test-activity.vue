<!-- 学员测试活动个人预览页面 -->
<template>
  <div class="view-all-overview-test">
    <!-- 当前位置导航begin -->
    <div class="present-localtion">
      <div>
        当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
      </div>
      <div class="classroom-back">
        <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
        <span @click="goToPageActivityList()">返回</span>
      </div>
    </div>
    <!-- 当前位置导航end -->

    <!-- 考试基本信息begin -->
    <div class="test-info">
        <span class="test-info-title">
            {{paperInfo.paperName}}
        </span>
        <span class="test-info-score">
            总分：{{paperInfo.paperTotalScore}}分
        </span>
        <span class="test-info-time">
            时长：{{paperInfo.paperConfinementTime !== '0' ? (paperInfo.paperConfinementTime + '分钟') : '不限时'}}
        </span>
    </div>
    <!-- 考试基本信息end -->

    <div class="test-info" style="margin-top:10px;text-align: center;" v-if="tableData.length <= 0">
        <img src="static/image/manage_board/creatkc.png" alt="">
        <p style="color:#959595;">未参与测试</p>
    </div>

    <!-- 每次答卷基本信息begin -->
    <div class="once-test-info">
        <el-timeline>
            <el-timeline-item v-for="(item, index) in tableData" :key="index" :timestamp="'第' + (tableData.length - index)  + '次 (' + item.paperEndTime + ')'" placement="top">
            <el-card>
                <div class="examination-information">
                    <div>
                        <div style="line-height:25px;"><span style="display:inline-block;width:60px;">得分：</span><span :style="(parseInt(item.paperFinalScore)/parseInt(paperInfo.paperTotalScore) >= 0.6) ? 'color:#67c23a' : 'color:red'">{{item.paperFinalScore}}分</span></div>
                        <div style="line-height:25px;"><span style="display:inline-block;width:60px;">准确率：</span>{{item.paperAccuracy}}</div>
                        <div style="line-height:25px;"><span style="display:inline-block;width:60px;">状态：</span>{{(parseInt(item.paperFinalScore)/parseInt(paperInfo.paperTotalScore)) >= 0.8 ? '优秀' : ((parseInt(item.paperFinalScore)/parseInt(paperInfo.paperTotalScore)) >= 0.6 ? '及格' : '不及格')}}</div>
                    </div>
                    <el-button style="margin-bottom: 45px;" size="mini" @click="toViewWriteInfoTestActivity(item)">查看</el-button>
                </div>
            </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
    <!-- 每次答卷基本信息end -->
    
  </div>
</template>

<script>
import {
  baseUrl,
  toast,
  alert,
  confirm,
  loadingModal,
  formVaildStyle,
  formInVaildStyle,
} from '@/utils/global'
export default {
  name: 'view-answer-test-activity',
  props: {
    // 教学包主键
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    ctId: {
      type: String,
      required: true,
      default: ''
    },
    //活动信息
    activityInfo : {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
        pageTitle: '作答详情',
        //统计信息
        tableData: [],
        paperInfo: {},  //活动信息
        testInfo: {}
    };
  },
  methods: {
    /**
     * 返回到活动主页面
     */
    goToPageActivityList() {
      // 与父组件通讯,传值为false时, 表示不显示这个新增修改页面，显示主列表页面
      this.$parent.changeVotoQuestionnairePage(false);
      
    },
    //查询所有学员答题信息
    getTraineeAnswerInfo(){
      let formData = new FormData();
      formData.append('ctId', this.ctId);
      formData.append('activityId', this.activityInfo.activityId);
      formData.append('pkgId', this.pkgId);
      this.$api.activityTest.queryTraineeAnswerInfo(formData).then(res => {
        if (res.code === 0) {
          for (let index = 0; index < res.data.length; index++) {
            let traineePic = res.data[index].traineePic;
            if (!(traineePic.indexOf('https') != -1 || traineePic.indexOf('http') != -1)) {
              res.data[index].traineePic = baseUrl + traineePic;
            }
          }
          if (res.data.length > 0) {
            this.tableData = res.data[0].historyPaperList;
            this.testInfo = res.data[0];
          }
          this.paperInfo = res.paperInfo;
        }else{
          toast(res.msg);
        }
      })
    },
    //跳转到学员答题详情页
    toViewWriteInfoTestActivity(data){
      this.$parent.toShowViewWriteInfoTestActivity(data,this.testInfo);
    }
  },
  created() {
    
  },
  mounted() {
    //获取所有学员答题信息
    this.getTraineeAnswerInfo();
  },
};
</script>

<style scoped>
  /* 返回 */
  .classroom-back{
    text-align: right;
    font-size: 14px;
    cursor: pointer;
    color: #158aeb;
    margin-right: 20px;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 当前位置 */
  .present-localtion{
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 试卷信息样式 */
  .test-info{
      text-align: left;
      padding: 40px 20px;
  }
  .test-info-title{
      font-weight: bold;
      font-size: 20px;
  }
  .test-info-score, .test-info-time{
      font-size: 14px;
      margin-left: 20px;
  }
  /* 每次答卷基本信息样式 */
  .once-test-info{
      text-align: left;
      padding: 0 40px 20px;
  }
  .examination-information{
      display: flex;
      justify-content: space-between;
  }
</style>
