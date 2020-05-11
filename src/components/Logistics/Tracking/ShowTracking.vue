<!-- 显示物流信息 -->
<template>
  <Col>
  <div ref="TrackBox" id="TrackBox"></div>
  <Externalcall />
  </Col>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
declare let YQV5: any;

@Component({
	name: 'LogisticsTracking',
	components: { 
    'Externalcall': {
      render(h: any){
        return h('script', {
          attrs: {
            type: 'text/javascript',
            src: '//www.17track.net/externalcall.js'
          }
        })
      }
    }
  }
})

export default class LogisticsTracking extends Vue {
  private Trigger(TrackingNum: number) {
    YQV5.trackSingleF2({
      //必须，指定悬浮位置的元素ID。
      YQ_ElementId: "TrackBox",
      //可选，指定运输商，默认为自动识别。
      YQ_Width: 600,
      YQ_Height: 500,
      YQ_Fc: "0",
      //可选，指定UI语言，默认根据浏览器自动识别。
      YQ_Lang: "en",
      //必须，指定要查询的单号。
      YQ_Num: TrackingNum
    });
  }

}
</script>