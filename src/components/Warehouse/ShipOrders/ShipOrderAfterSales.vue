<!-- 订单详情售后 -->
<template>
  <Row>
    <Col class="Dispted-Item" span="24" v-for="(Item, Index) in Disputeds" v-show="$Enums.CustomerService.AfterSalesType[Index]" :key="Index">
      <b>{{$Enums.CustomerService.AfterSalesType[Index]}}：</b>
      <a class="P-MR-10" href="javascript:void(0);" v-for="(Itm, Idx) in Item" :key="Idx" @click="EmitDisputedDetails(Itm.Id, $Enums.CustomerService.DisputedDetailsType[Index])">{{Itm.Code || Itm.AfterSaleCode || Itm.TicketId || Itm.OrderSn || Itm.ReturnSn}}</a>
    </Col>
    <Col span="24" v-if="Disputeds.Items && Disputeds.Items.length" class="P-MB-10">
      <Table :columns="Cols" :data="Disputeds.Items" stripe size="small" :height="250"></Table>
    </Col>
    <Col span="24">
      <Button v-if="Powers.AfterSaleOrdCreat" type="primary" @click="EmitAfterSalesOrder">添加售后单</Button>
      <CancelRequest v-if="Powers.CancelRequest && Platform === 1" class="P-ML-5" />
      <ShopeeCancelBackOrder v-if="Powers.CancelShopeeOrder && Platform === 4" class="P-ML-5" />
      <CancelBackOrder v-if="Powers.CancelBackOrder && Platform === 5" class="P-ML-5" />
      <Button class="P-ML-5" type="primary" v-if="[5,17].includes(Platform) && Powers.EmailWrite" @click="TriggerWriteEmail">发送邮件</Button>
      <WriteEmail ref="WriteEmail" v-if="[5,17].includes(Platform) && Powers.EmailWrite" />
      <WriteStationMail ref="WriteStationMail" :IsBtn="false" />
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService'
import ShipOrder from '@/assets/Interface/ShipOrder'

@Component({
  name: 'ShipOrderAfterSales',
  components: {
    CancelRequest: () => import('@/components/CustomerService/AfterSales/CancelRequest.vue'),
    ShopeeCancelBackOrder: () => import('@/components/CustomerService/AfterSales/ShopeeCancelBackOrder.vue'),
    CancelBackOrder: () => import('@/components/CustomerService/AfterSales/CancelBackOrder.vue'),
    WriteEmail: () => import('@/components/CustomerService/Mail/WriteMail.vue'),
    WriteStationMail: () => import('@/components/CustomerService/Ebay/WriteStationMail.vue')
  }
})

export default class ShipOrderAfterSales extends Vue {
  @Emit() private EmitDisputedDetails(): void {}
  @Emit() private EmitAfterSalesOrder(): void {}

  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase

  private mounted(): void {
     this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["EbayMsgSend", "AfterSaleOrdCreat", "CancelRequest", "CancelShopeeOrder", "CancelBackOrder", "EmailWrite"]));
  }

  private Trigger(Platform: number, Code: string): void {
    if(!this.Init){
      return
    }
    this.$set(this, 'Platform', Platform)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.Sales[String(Platform)].DisputedDetails,
        Login: true
      },
      Data: Code,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'Init', false)
          this.$set(this, 'Disputeds', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private RenderOperates(h: any, Params: any): string {
    if(this.Powers.EbayMsgSend){
      return h('a', { on: { click: () => { this.TriggerWriteMail(Params.row) } } },'发送站内信') 
    }else{
      return ''
    }
  }

  private TriggerWriteEmail(): void {
    (this as any).$refs.WriteEmail.TriggerWrite(this['ShipOrder/SHIP_ORDER_INFO'].BuyerEmail)
  }

  private TriggerWriteMail(Item: Interface.AfterSalesSkuInfo): void {
    (this as any).$refs.WriteStationMail.ItemIdWrite(this['ShipOrder/SHIP_ORDER_INFO'].OrderCode, Item.ItemId)
  }

  private Reset(): void {
    this.$set(this, 'Init', true)
    this.$set(this, 'Disputeds', {})
    this.$set(this, 'Platform', 0)
  }

  private Powers: PInterface.Power = {}
  private Init: boolean = true
  private Platform: number = 0
  private Disputeds: any = {}

  private Cols: PInterface.TableCol[] = [{
    title: 'SKU编号',
    key:'SkuCode',
    width: 135
  }, {
    title: 'SKU名称',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: { content: Params.row.SkuName },
        class: 'P-LINE-1'
      }, Params.row.SkuName)
    }
  }, {
    title: '购买数量',
    key: 'BuyCount',
    width: 100
  }, {
    title: '评价',
    key: 'Evaluate'
  },{
    title: '评价内容',
    key: 'Content'
  }, {
    title: '操作',
    width: 100,
    render: this.RenderOperates
  }]
}

</script>
<style lang="less" scoped>
.Dispted-Item{
  line-height: 40px;

  &>b{
    display: inline-block;
    width: 100px;
    text-align: right;
  }
}
</style>