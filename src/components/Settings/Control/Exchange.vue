<!-- 汇率转换组件-->
<template>
  <div id="Exchange">
    <Collapse v-model="Active">
      <Panel name="Exchange" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">汇率转换</span>
        <div slot="content" style="height: 180px;">
          <div class="P-MB-20" v-if="IsShow">
            <div class="P-Inline-Block P-MR-10">
              <img src="@/assets/Images/exchange.png" width="50">
            </div>
            <div class="WrapText P-Inline-Block P-FW-Bold">
              <p>{{BaseNum}} {{CurrentCountry}} = {{ (BaseNum*Rate).toFixed(4) }} {{BaseCountry}}</p>
              <p>{{BaseNum}} {{BaseCountry}} = {{ (BaseNum/Rate).toFixed(4) }} {{CurrentCountry}}</p>
            </div>
          </div>
          <Row :gutter="16" span="24" class="P-MB-30">
            <Col span="6">
              <Input-number v-model="BaseNum" class="P-W-100-Percent" :min="1"></Input-number>
            </Col>
            <Col span="9">
              <Select v-model="CurrentCode" :onChange="GetCurrentCountry" :options="ERlist" placeholder="美元USD" ref="CurrentCode" />
            </Col>
            <Col span="9">
              <Select v-model="BaseCode" :onChange="GetBaseCountry" :options="ERlist" placeholder="人民币CNY"  ref="BaseCode"/>
            </Col>
          </Row>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'Exchange',
  components: {
  }
})
export default class Exchange extends Vue {
  @Prop() ERlist: PInterface.KV[]
  @Prop() BaseExchange: number //基础汇率

  @Watch('BaseExchange') 
  private ChangeExchange(V: number): void{
    this.Rate = V
    this.IsShow = true
  }

  private GetCurrentCountry(Val: string): void {
    this.CurrentCountry = (this as any).$refs.CurrentCode.Key;

    if (Val === "") {
      this.IsShow = false;
      return;
    }
    if (this.BaseCountry != "") {
      this.GetData()
    }
  }

  private GetBaseCountry(Val: string): void  {
  this.BaseCountry = (this as any).$refs.BaseCode.Key;
    if (Val === "") {
      this.IsShow = false;
      return;
    }
    if (this.CurrentCountry != "") {
      this.GetData()
    }

  }

  private GetData() : void{
    var Obj = {
      SourceCode: this.CurrentCode,
      TargetCode: this.BaseCode
    };
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ERExchangeRate,
				Login: true
			},
			Data: Obj,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.IsShow = true;
          this.Rate = Res.Data.Rate;
				} else {
					this.$Request.Error(Res);
        }
			}
		})
  }

  private Active: string = 'Exchange'
  private Country: []
  private BaseNum: number = 1
  private CurrentCountry: string = '美元(USD)' //查询货币名称
  private BaseCountry: string = '人民币(CNY)' //换算货币名称
  private CurrentCode: string = 'USD' //查询货币编码
  private BaseCode: string = 'CNY' //换算货币编码
  private Rate: number = 1

  private IsShow: boolean = false
}
</script>
<style lang="less">
#Exchange{
  & .WrapText{
    height: 50px;
    width: 70%;
    vertical-align: top;
    font-size: 18px;
  }
}
</style>