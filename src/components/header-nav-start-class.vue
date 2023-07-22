<!-- 管理面板上方悬浮的头部组件 -->
<template>
    <div class="header-nav" :class="isScroll && isHideNavOnScroll?'header-nav-collapse':''">
        <div class="header-nav-fixed">
            <div class="nav-con wind-1240">
                <div class="nav-logo">
                    <img src="static/image/platfromLog.png" :alt="isTeacher ? '教学平台' : '实训平台'">
                    <span class="logo-text color-fff">{{isTeacher ? '教学平台' : '实训平台'}}</span>
                </div>
                <div class="nav-menu">
                    <!-- :to="(item.id !== 2 && item.id != 7) ? {path:item.path} : '#'" -->
                    <router-link
                        :key="index"
                        v-for="(item,index) in routerList"
                        :to="{path:item.path}"
                        @click.native="clickHeadNav(item)"
                        tag="div"
                        :class="['menu-item',currentIndex===item.id?'active':'']">
                            {{item.pathName}}
                            <i v-if="item.children && item.children.length > 0" class="el-icon-caret-bottom menu-item-icon-bottom"></i>
                            <i v-if="item.children && item.children.length > 0" class="el-icon-caret-top menu-item-icon-top"></i>
                            <div v-if="item.children && item.children.length > 0" :class="['menu-item-children']">
                                <router-link v-for="(itemc, indexc) in item.children" :key="indexc" :to="(item.id != 7) ? {path:itemc.path} : '#'" @click.native="clickHeadNav(itemc)" tag="div" :class="['menu-item-children-item',currentChildrenIndex===itemc.id?'activeChildren':'']">{{itemc.pathName}}</router-link>
                                <!-- <div v-for="(itemc, indexc) in item.children" class="menu-item-children-item" :key="indexc">{{itemc.pathName}}</div> -->
                            </div>
                        </router-link>
                <!--"@click.native="item.id === 2 ? toTestingCenter() : ''"-->
                    <!-- <router-link :to="{path:'/TeachingCenter'}" tag="div" class="menu-item">教学中心</router-link> -->
                    <!-- <router-link :to="{path:'/TestingCenter'}" tag="div" class="menu-item">评测中心</router-link>
                    <router-link :to="{path:'/'}" tag="div" class="menu-item">返回首页</router-link> -->
                </div>
                <!--<div class="nav-seach">
                    <input  type="text" v-model="userInputSearch" placeholder="教学包，活教材">
                    <img v-show="userInputSearch===''?false:true" @click="handleUserInput" class="del-search-input" src="static/image/del_1.png" alt="删除" title="删除">
                    <img  class="search" src="static/image/search_1.png" alt="搜索" title="搜索">
                </div>-->
                <div class="right-nav">
                    <div class="right-nav-item" @click="toWebsite">
                        <div :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="height: 30px;display: flex;align-items: center;">
                            <i class="fa fa-home" style="font-size: 20px;" aria-hidden="true"></i>
                        </div>
                        <div  :class="isScroll && isHideNavOnScroll?'header-nav-collapse-height':''" style="line-height: 30px;height: 30px;padding-left: 3px;">回官网</div>
                    </div>
                    <el-divider direction="vertical" style="margin-top:100px;"></el-divider>
                    <div @click="outlogin" class="right-nav-item">退出</div>
                </div>
            </div>
        </div>
        <!-- <div class="header-nav-tab-collapse-wrap">
            <i class="icon iconfont icon-jiantouarrowhead7"></i>隐藏
        </div> -->
    </div>
</template>

<script>
    import {baseUrl, alert, confirm,toast,delCookies} from "@/utils/global";
    export default {
        name: 'header-nav-start-class',
        props:{
            isHideNavOnScroll:{
                type:Boolean,
                default: false
            },
            currentIndex:{
                type:Number,
                default:1
            },
            currentChildrenIndex:{
                type:Number,
                default: -1
            }
        },
        data () {
            return {
                userInputSearch:'',
                isScroll:false,
                isTeacher: true,
                routerList:[
                    {
                        id:1,
                        path:'/begin-class',
                        pathName:'管理看板'
                    },
                    {
                        id:4,
                        path:'/my/classroom',
                        pathName:'教学中心'
                    },
                    {
                        id:6,
                        path:'#',
                        pathName:'学习中心',
                        children: [
                            {
                                id: 61,
                                path:'/my/learning-classroom',
                                pathName:'我学的课',
                            },
                            {
                                id: 62,
                                path:'/my-bookshelf/my-bookshelf',
                                pathName:'我的书架',
                            },
                        ]
                    },
                    {
                        id:5,
                        path:'/my-teaching-package',
                        pathName:'教学包'
                    },

                    {
                        id:2,
                        path:'/question-bank-center/test-question-bank',
                        pathName:'评测中心',
                        // children:[
                        //     {
                        //         id: 21,
                        //         path:'/question-bank-center/test-question-bank',
                        //         pathName:'理论题库',
                        //     },
                        //     {
                        //         id: 22,
                        //         path:'/question-bank-center/test-question-bank',
                        //         pathName:'实践考核',
                        //     },
                        // ],
                    },
                    {
                        id:7,
                        path:'#',
                        pathName:'项目库',
                        children: [
                            {
                                id: 71,
                                path:'/',
                                pathName:'项目Git库',
                            },
                            /*{
                                id: 72,
                                path:'/',
                                pathName:'项目SVN库',
                            },*/
                            {
                                id: 73,
                                path:'/',
                                pathName:'项目管理平台',
                            },
                        ]
                    },
                ]
            }
        },
        mounted () {
            window.addEventListener('scroll', this.handleScroll);
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.isTeacher = userInfo.isTeacher;
            if (!this.isTeacher) {
                this.routerList = [
                    {
                        id:1,
                        path:'/begin-class',
                        pathName:'管理看板'
                    },
                    {
                        id:8,
                        path:'/my/learning-classroom',
                        pathName:'我的课堂'
                    },
                    {
                        id:6,
                        path:'/my-bookshelf/my-bookshelf',
                        pathName:'我的书架'
                    },

                    {
                        id:2,
                        path:'/question-bank-center/test-question-bank',
                        pathName:'评测中心',
                    },
                    {
                        id:7,
                        path:'#',
                        pathName:'项目库',
                        children: [
                            {
                                id: 71,
                                path:'/',
                                pathName:'项目Git库',
                            },
                            /*{
                                id: 72,
                                path:'/',
                                pathName:'项目SVN库',
                            },*/
                            {
                                id: 73,
                                path:'/',
                                pathName:'项目管理平台',
                            },
                        ]
                    },
                ]
            }
        },
        methods:{
            toWebsite() {
              this.$router.push({
                path:`/`
              });
            },
            clickHeadNav (item) {
                // localStorage.setItem('editQuesMajorId', '')
                // localStorage.setItem('editQuesSubjectId', '')
                // localStorage.setItem('editQuesChaptersId', '')
                // localStorage.setItem('editQuesQuestionsType', '')
                // localStorage.setItem('editQuesQuestionsComplexity', '')

                localStorage.removeItem('editQuesQuestionsId')
                localStorage.removeItem('editQuesMajorId')
                localStorage.removeItem('editQuesSubjectId')
                localStorage.removeItem('editQuesChaptersId')
                localStorage.removeItem('editQuesQuestionsType')
                localStorage.removeItem('editQuesQuestionsComplexity')
                localStorage.removeItem('editQuesQuestionsTab')
                localStorage.removeItem('editQuesQuestionsScrollTop')

              if (item.id == 2) {
                // this.toTestingCenter()
              } else if (item.id == 7) {
                //this.toProjects()
              } else if (item.id == 71) {
               // window.open('https://www.budaos.com/bds/login-api/gotogit', '_blank')
                window.open('https://git.creatorblue.com', '_blank')
              } else if (item.id == 72) {
                window.open('http://edu.creatorblue.com:81/usvn/login/', '_blank')
              } else if (item.id == 73) {
                window.open('https://www.ossbar.com/bug/', '_blank')
              }
            },
            toTestingCenter() {
                //window.location.href = 'https://edu.creatorblue.com/questions/listNoMenu';
                window.open('https://edu.creatorblue.com/questions/listNoMenu', '_blank')
            },
            toProjects() {
              window.open('https://www.budaos.com/bds/login-api/gotogit', '_blank')
            },
            handleScroll () {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop>50){
                   this.isScroll=true;
                }
                if(scrollTop===0){
                   this.isScroll=false;
                }
            },
            //清空用户输入
            handleUserInput:function(){
                this.userInputSearch='';
            },
             //退出登录
            outlogin:function(){
                let that = this
                confirm("您确定要退出吗",function () {

                    that.$api.login.outLogin().then((res) => {
                        if(res.code==0){
                            delCookies();
                            that.$router.push("/");
                            // that.showLogin=true;
                            // that.showUserName=false;
                        }else{
                            alert(res.code)
                        }
                    });
                })
            }
        },
        components: {

        }
    }
</script>

<style scoped>
    .header-nav{
        width:100%;
        height:50px;
        /* display: block; */
        transition: 0.4s;
        /* transition: height 0.4s; */
        /* background-color:#000; */
        /* overflow: hidden; */
    }
    .header-nav-static{
        position: static;
        top: 0;
        left: 0;
    }
    .header-nav-fixed{
        width: 100%;
        background-color: #000;
        position: fixed;
        padding-bottom: 3px;
        top: 0;
        left: 0;
        z-index: 999;
    }
    .header-nav .nav-con{
        display: flex;
        /*justify-content:space-around;*/
        align-content: center;
        height: 100%;
        padding-top: 5px;
        /*padding:0 10px;
        padding-top:6px;*/
    }
    .nav-logo{
      margin-left: 5%;
    }
    .nav-con .nav-logo img{
        width:40px;
        height:40px;
        vertical-align: middle;
        border-radius: 6px;
    }
    .nav-con .nav-logo .logo-text{
        display: inline-block;
        font-weight: 600;
        font-size: 16px;
        margin-left:10px;
    }
    .nav-con .nav-menu{
        display: flex;
        /* justify-content:space-between; */
        align-content: center;
        margin-left: 7%;
        width:600px;
        height:100%;
        line-height:38px;
    }
    .nav-con .menu-item{
       /*  margin: 5px 20px;
        height: 50px;
        line-height: 50px; */
        text-align: center;
        font-size: 16px;
        color: white;
        cursor: pointer;
        margin: 0 auto;

        position: relative;
        /* padding: 0 20px; */
        box-sizing: border-box;
    }
    .nav-con .active{
        color: #FF740E;
        border-bottom:2px #FF740E solid;
    }
    /*.nav-con .router-link-exact-active{
        color: #fd7512;
        border-bottom:2px #fd7512 solid;
    }*/
    .nav-con .menu-item:hover{
        color: #FF740E;
        border-bottom:2px #FF740E solid;
    }
    .nav-con .nav-seach{
        position: relative;
        width:250px;
        height:38px;
        padding:8px 10px;
        border-radius: 20px;
        background-color: #fff;
        text-align: left;
    }
    .nav-con .nav-seach >input{
        border: 0;
        outline: 0;
        text-indent: 2em;
        width:70%;
        line-height: normal;
    }
    .nav-con .nav-seach .search{
        position: absolute;
        right: 15px;
        top:8px;
        cursor: pointer;
    }
    .nav-con .nav-seach .del-search-input{
        position: absolute;
        right: 50px;
        top:11px;
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .nav-con .right-nav{
        margin-left: 15%;
        display: flex;
        align-items:center;
        height: 38px;
    }
    .nav-con .right-nav .right-nav-item:hover{
        color: #fd7512;
    }
    .right-nav-item{
        display: flex;
    }
    .nav-con .right-nav > div{
        cursor: pointer;
        color: #fff;
    }

    .nav-con .menu-item .menu-item-children{
        background-color: #000;
        position: absolute;
        z-index: 888;
        /* padding: 10px 20px; */
        box-sizing: border-box;
        top: 40px;
        width: 145px;
        font-size: 14px;
        left: -20px;
        line-height: 20px;
        padding: 5px 0px;
        text-align: left;
        border-radius: 0 0 5px 5px;
        display: none;
    }
    .nav-con .menu-item .menu-item-children .menu-item-children-item{
        padding: 3px 20px;
        box-sizing: border-box;
    }
    .nav-con .menu-item:hover .menu-item-children{
        color: #fff;
        display: block;
    }
    .nav-con .menu-item .menu-item-children .menu-item-children-item:hover,
    .nav-con .menu-item .menu-item-children .menu-item-children-item.activeChildren{
        color: #fd7512;
        background-color: #fff;
    }
    .menu-item-icon-top,
    .nav-con .menu-item:hover .menu-item-icon-bottom{
        display: none;
    }
    .menu-item-icon-bottom,
    .nav-con .menu-item:hover .menu-item-icon-top{
        display: inline-block;
    }
    .header-nav-tab-collapse-wrap{
        position: fixed;
        /* top: 100%; */
        top: 47px;
        left: calc(((100vw - 1200px) / 2 + 1200px + 5px));
        /* right: calc(((100vw - 1200px) / 2) / 2); */
        background-color: #000;
        color: #fff;
        padding: 3px 8px;
        font-size: 13px;
        border-radius: 0 0 5px 5px;
    }
    .header-nav-tab-collapse-wrap .iconfont{
        color: #fff;
        font-size: 14px;
        margin-right: 3px;
    }
    .header-nav-collapse{
        /* display: none; */
        height: 0 !important;
    }
    .header-nav-collapse .header-nav-fixed{
        padding-bottom: 0;
    }
    .header-nav-collapse-height{
        /* display: none; */
        height: 0 !important;
    }
    .header-nav-collapse .nav-con{
        display: none;
    }
    /* .header-nav-collapse .nav-con,
    .header-nav-collapse .nav-con .nav-logo img,
    .header-nav-collapse .nav-con .nav-menu,
    .header-nav-collapse .nav-con .nav-seach,
    .header-nav-collapse .nav-con .nav-seach .del-search-input,
    .header-nav-collapse .nav-con .right-nav{
        height: 0;
    } */
</style>
