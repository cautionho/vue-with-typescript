<!-- 汇率转换组件-->
<template>
  <div id="LogisticsQuery">
    <Collapse v-model="Active">
      <Panel name="LogisticsQuery" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">物流查询</span>
        <div slot="content" style="min-height: 180px;">
          <Form ref="YqForm" :model="YqForm" :rules="YqRules" onsubmit="return false" :label-width="110">
            <Form-item prop="CodeNumber">
            <Input v-model="YqForm.CodeNumber" placeholder="请扫描/输入单号" @on-enter="GetTrack">
              <Button slot="append" @click="GetTrack">查询</Button>
            </Input>
            </Form-item>
          </Form>
          <div class="P-MT-30 P-TA-C">
            <div id="YQContainer"></div>
            <img src="@/assets/Images/logistics.png" width="120" v-if="!IsTrack">
          </div>
        </div>
      </Panel>
    </Collapse>
  <Externalcall />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';
declare let YQV5: any;

@Component({
  name: 'LogisticsQuery',
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
export default class LogisticsQuery extends Vue {
  private GetTrack(): void{
    (this as any).$refs.YqForm.validate((Valid: boolean)=>{
      if(Valid){
        YQV5.trackSingle({
          //必须，指定悬浮位置的元素ID。
          YQ_ContainerId: "YQContainer",
          //可选，指定运输商，默认为自动识别。
          YQ_Height: 560,
          // YQ_Float: 'right',
          YQ_Fc: "0",
          //可选，指定UI语言，默认根据浏览器自动识别。
          YQ_Lang: "en",
          //必须，指定要查询的单号。
          YQ_Num: this.YqForm.CodeNumber
        });
        this.IsTrack = true
      }
    })
  }

  private Active: string = 'LogisticsQuery'
  private IsTrack: boolean = false;
  private YqForm: {CodeNumber: string} = {CodeNumber: ""}
  private YqRules: any = {
    CodeNumber: [{ required: true, message: '请输入单号' }]
  }
}
</script>
<style lang="less">
#LogisticsQuery{
  .ivu-form-item-content{
    margin-left: 0 !important;
  }
}
</style>