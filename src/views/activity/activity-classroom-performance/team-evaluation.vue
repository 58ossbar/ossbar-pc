<!-- 小组评价页面 -->
<template>
    <div class="team-evaluation">
        <!-- 路径导航开始 -->
        <div class="present-localtion">
            <div>
                当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="cursor" @click="goToPagePerformance">课堂表现</span> > <span class="present-localtion-title">小组评分</span>
            </div>
            <div class="classroom-back">
                <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
                <span @click="goToPagePerformance()">返回</span>
            </div>
        </div>
        <!-- 路径导航结束 -->
        
        
    </div>
</template>

<script>
    export default {
        name: "team-evaluation",
        data(){
            return{
                
            }
        },
        methods:{
            /**
             * 跳页面
             */
            goToPagePerformance () {
                this.$parent.showPerformance();
            },
            goToPageActivityList () {
                this.$parent.changeVotoQuestionnairePage(false);
            },
            
        },
    }
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
    /* 当前位置 */
    .present-localtion{
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        text-align: left;
        padding-left: 15px;
        display: flex;
        justify-content: space-between;
    }
    .present-localtion-title{
        color: #959da0;
    }
    /* 手势动作 */
    .cursor{
        cursor: pointer;
    }
    
</style>
