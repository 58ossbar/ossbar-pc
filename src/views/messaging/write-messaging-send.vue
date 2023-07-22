<!-- 消息群发的所有消息查看页面 -->
<template>
    <div class="write-messaging-send">
        <!-- 消息分类 -->
        <div class="messaging-classification">
            <!-- 消息主题输入 -->
            <div class="messaging-title">
                <input type="text" name="title"
                       oninput="if(value.length>20) value=value.slice(0,20)"
                       v-model="messaging.title"
                       @input = "descInput"
                       placeholder="请输入标题" />
                <span class="titleNum">{{remnant}}/20</span>
            </div>
            <!-- 消息分类选择 -->
            <div>
                <span>消息分类</span>
                <span style="padding-left: 20px">公告</span>
            </div>
        </div>
        <!-- 选择发送范围 -->
        <div class="messaging-scope">
            <span>选择发送范围</span>
        </div>
        <!-- 消息富文本编辑框 -->
        <div class="messaging-content">
            <cb-editor
                height="350px"
                ref="cbEditor"
                name="resContent"
                toolbar="true"
                :dataForm="saveResourceData" >
            </cb-editor>
        </div>
        <!-- 下方按钮 -->
        <div class="messaging-button">
            <button class="messaging-button-other messaging-button-send">发送</button>
            <button class="messaging-button-other">定时发送</button>
            <button class="messaging-button-other">存为草稿</button>
            <button class="messaging-button-other">预览</button>
        </div>

        <!-- 图片预览标签 begin -->
        <div class="accessory-viewer" v-viewer style="display: none;">
          <img  :src="viewerImgSrc" alt>
        </div>
        <!-- 图片预览标签 end -->

    </div>
</template>

<script>
    import CbEditor from '../../components/cb-editor'
    export default {
        name: "write-messaging-send",
        components: {
          'cb-editor': CbEditor,
        },
        data(){
            return{
              viewerImgSrc:'',//图片预览src
              remnant: 0,//输入数
              //消息信息
              messaging: {
                title: '',
              },
              //富文本输入信息
              saveResourceData: {
                resContent:'',
                resId:''
              },
            }
        },
        methods:{
          // 预览v-html里面的图片
          editorPreViewImg (viewerImgSrc) {
            this.viewerImgSrc = viewerImgSrc
            // console.log(this.$el.querySelector('.accessory-viewer'))
            let viewer = this.$el.querySelector('.accessory-viewer').$viewer
            viewer.show()
          },
          //计算主题输入数
          descInput(){
            let titleVal = this.messaging.title.length;
            this.remnant = titleVal;
          },

        },
    }
</script>

<style scoped>
  .write-messaging-send{
    width: 80%;
    margin-left: 10%;
    text-align: left;
  }
  /* 消息公告样式 */
  .messaging-title input{
    height: 30px;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    width: 350px;
  }
  input:-webkit-autofill{
    -webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset;
  }
  .titleNum{
    width: 40px;
    float: right;
    color: #909399;
    margin-right: 90px;
  }
  .messaging-classification{
    border-bottom: 1px solid #E4E6E9;
    display: flex;
    justify-content: left;
    height: 60px;
    line-height: 60px;
    padding: 10px 0;
  }
  /* 选择发送范围样式 */
  .messaging-scope{
    border-bottom: 1px solid #E4E6E9;
    height: 60px;
    line-height: 60px;
    padding: 10px 0;
    color: #007bff;
  }
  .messaging-scope:hover{
    cursor: pointer;
  }
  /* 富文本编辑器样式 */
  .messaging-content{
    margin-top: 30px;
  }
  /* 按钮样式 */
  .messaging-button{
    margin-top: 20px;
    margin-bottom: 50px;
  }
  .messaging-button-other{
    background-color: #fafafa;
    border: 1px solid #aaaaaa;
    padding: 2px 18px;
    font-size: 13px;
    margin-right: 15px;
    border-radius: 3px;
    outline: none;
  }
  .messaging-button-other:hover{
    cursor: pointer;
  }
  .messaging-button-other:active{
    opacity: 0.8;
  }
  .messaging-button-send{
    background-color: #3F8ACC;
    color: #FFFFFF;
    border: 1px solid #007bff;
  }
</style>
