<template>
  <div>
    <h4 class="text-gray" v-if="item.web.length > 0">
      <i class="linecons-tag" :id="item.name"></i>{{item.name}}
    </h4>
    <div class="row">
      <div class="col-sm-3" v-for="(web, idx) in item.web" :key="idx">
        <div class="xe-widget xe-conversations box2 label-info" title=""
          @click="openweb(web.friendUrl)"
          data-toggle="tooltip" 
          data-placement="bottom" 
          :data-original-title="web.url">

          <div class="xe-comment-entry">
            <a class="xe-user-img">
              <img :src="web.logo" class="lozad img-circle" width="40" height="40">
            </a>
            <div class="xe-comment">
              <a href="#" class="xe-user-name overflowClip_1">
                <strong>{{web.name}}</strong>
              </a>
              <p class="overflowClip_2">{{web.friendSummary}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import '@/assets/resources/css/xenon-components.css'
import '@/assets/resources/css/nav.css'
export default {
  name: 'WebItem',
  props: {
    item: Object,
  },
  methods: {
    //页面跳转
    openweb(url) {
      window.open(url, '_blank');
    },
    //定位 
    positioning(value){
      let height = document.getElementById(value).offsetTop;
      document.documentElement.scrollTop = height + 70;
    },
  }
}
</script>

<style scoped>
/* @import '@/static/creatorblue/resources/fonts/linecons/css/linecons.css';
@import '@/static/creatorblue/resources/fonts/fontawesome/css/font-awesome.min.css';
@import '@/static/creatorblue/resources/css/xenon-core.css';
@import '@/static/creatorblue/resources/css/xenon-components.css';
@import '@/static/creatorblue/resources/css/xenon-skins.css';
@import '@/static/creatorblue/resources/css/nav.css'; */
i {
  margin-right: 7px;
}
.text-gray {
    color: #555
}
.img-circle{
  border-radius: 50%;
}
.overflowClip_2{
  font-size: 13px;
  color: #979898;
}
.overflowClip_1{
  font-size: 13px;
}
</style>
