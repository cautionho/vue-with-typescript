<template>
  <Col span="24">
  <Table size="small" :columns="Cols" :data="SHIP_ORDER_REMARK" :show-header="false" class="P-MB-10" v-if="SHIP_ORDER_REMARK.length"></Table>
  <Form :model="SHIP_ORDER_INFO" :label-width="90" inline>
    <FormItem label="发货单号：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.OrderCode}}</p>
    </FormItem>
    <FormItem label="订单号：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.OrderCode}}</p>
    </FormItem>
    <FormItem label="卖家店铺：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.StoreName || '-'}}</p>
    </FormItem>
    <FormItem label="交易号：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.PlatformOrderId}}</p>
    </FormItem>
    <FormItem label="原付金额：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.PayPrice}} {{SHIP_ORDER_INFO.PayCurrency}}</p>
    </FormItem>
    <FormItem label="美金金额：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.TotalPrice}}</p>
    </FormItem>
    <FormItem label="状态：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{$Enums.Warehouse.ShipOrderStatus[SHIP_ORDER_INFO.Status]}}</p>
    </FormItem>
    <FormItem label="下单时间：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{$UI.Render.Date(SHIP_ORDER_INFO.CreateTime || '')}}</p>
    </FormItem>
    <FormItem label="付款时间：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{$UI.Render.Date(SHIP_ORDER_INFO.PaidTime || '')}}</p>
    </FormItem>
    <FormItem label="发货时间：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{$UI.Render.Date(SHIP_ORDER_INFO.ShipedTime || '')}}</p>
    </FormItem>
    <FormItem label="买家备注：" class="P-W-100-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.BuyerRemark || '-'}}</p>
    </FormItem>
    <FormItem label="操作备注：" class="P-W-100-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.Remark || '-'}}</p>
    </FormItem>
    <FormItem label="异常备注：" class="P-W-100-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.AutoMatchRemark || '-'}}</p>
    </FormItem>
  </Form>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "ShipOrderBaseInfo"
})
export default class ShipOrderBaseInfo extends Vue {
  @Emit() EmitOperateSuccess(Action:string = 'ShipOrder/UPDATE_SHIP_ORDER_INFO'):void {}

  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  @Getter private "ShipOrder/SHIP_ORDER_REMARK": Interface.ShipOrderRemark[];
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
  get SHIP_ORDER_REMARK() {
    return this["ShipOrder/SHIP_ORDER_REMARK"];
  }

  private DelRemark(Idx: number):void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderDelRemark,
        Login: true
      },
      Data: this.SHIP_ORDER_REMARK[Idx].Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '删除备注成功')
          this.EmitOperateSuccess('ShipOrder/UPDATE_SHIP_ORDER_REMARK')
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Cols:PInterface.TableCol[] = [{
    title: '备注',
    tooltip: true,
    render: (h:any, Params: any) => {
      return h('span', `${Params.row.Created.replace('T', ' ')} ${Params.row.UserName}：${Params.row.Content}`)
    }
  }, {
    title: '操作',
    width: 78,
    render: (h: any, Params: any) => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: () => {
            this.DelRemark(Params.row._index);
          }
        }
      },'删除')
    }
  }]
}
</script>
<style lang="less" scoped>
</style>