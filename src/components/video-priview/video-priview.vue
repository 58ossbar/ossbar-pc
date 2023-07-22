<!-- 视频预览组件 -->
<template>
    <div class="video-box" v-if="videoFlag">
        <span class="close-btn" @click="close"></span>
        <video :src="urlString" autoplay="true" controls="controls">
            您的浏览器不支持 video 标签。
        </video>
    </div>
</template>

<script>
 export default {
    data () {
        return {

        }
    },
    components: {

    }
 }
</script>

<style scoped>
    .video-box{
        position: fixed;
        top :0px;
        right :0px;
        bottom :0px;
        left :0px;
        z-index :999;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
    }
    .video-box  .close-btn{
        position :absolute;
        top :10px;;
        right :10px;
        z-index: 11;
        display :inline-block;
        width :30px;
        height :30px;
        background: url('/static/image/teaching_package/delete_2.png') center center no-repeat;
        background-size :contain;
        cursor: pointer;
    }
    .video-box video{
        position :absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width :100%;
        max-height :100%;
    }
</style>
