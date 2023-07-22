<template>
  <div>
    <div class="container">
      <div class="form-inline">
        <input type="hidden" id="txt_url" class="input-xxlarge" value="">
        <button class="btn btn-primary" id="btn_play">播放视频</button>
      </div>

      <label></label>
      <video id="rtc_media_player" controls autoplay></video>
      <div style="display: none;">
        <label></label>
        SessionID: <span id='sessionid'></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'view-live',
  created () {
    let activtityId = this.$route.params.id
    console.log(activtityId)
    $(function () {
      var sdk = null // Global handler to do cleanup when replaying.
      var startPlay = function () {
        $('#rtc_media_player').show()

        // Close PC when user replay.
        if (sdk) {
          sdk.close()
        }
        sdk = new SrsRtcPlayerAsync()

        // https://webrtc.org/getting-started/remote-streams
        $('#rtc_media_player').prop('srcObject', sdk.stream)
        // Optional callback, SDK will add track to stream.
        // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };

        // For example: webrtc://r.ossrs.net/live/livestream
        var url = $('#txt_url').val() + '/' + activtityId
        sdk.play(url).then(function (session) {
          $('#sessionid').html(session.sessionid)
          $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid)
        }).catch(function (reason) {
          sdk.close()
          $('#rtc_media_player').hide()
          console.error(reason)
        })
      }

      $('#rtc_media_player').hide()
      var query = parse_query_string()
      srs_init_rtc('#txt_url', query)

      $('#btn_play').click(function () {
        $('#rtc_media_player').prop('muted', false)
        startPlay()
      })

      if (query.autostart === 'true') {
        $('#rtc_media_player').prop('muted', true)
        console.warn('For autostart, we should mute it, see https://www.jianshu.com/p/c3c6944eed5a ' +
          'or https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#audiovideo_elements')

        startPlay()
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      const btnPlay = document.getElementById('btn_play')
      console.log(btnPlay)
      btnPlay.click()
    })
  },
  methods () {

  },
}
</script>

<style scoped>

</style>
