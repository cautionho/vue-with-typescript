<template>
  <Col>
    <Table :columns="Cols" :data="Profits" size="small" stripe :height="CalculateHeight()"></Table>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";
import ReportInterface from '@/assets/Interface/Report'

@Component({
  name: "ShipOrderGrossProfits"
})
export default class ShipOrderGrossProfits extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }

  private CalculateHeight() {
    return 500;
  }

  private Trigger(): void {
    if(!this.Profits.length){
      this.$UI.Loading.Show()
      let PostData: ReportInterface.GrossProfitSearch = new ReportInterface.GrossProfitSearch()
      PostData.IsConfirm = false
      PostData.SearchKey = this.SHIP_ORDER_INFO.OrderCode
      PostData.SearchKeyType = 1
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.StatisticsSalesTradingProfit,
          Login: true
        },
        Data: {
          PageIndex: 1,
          PageSize: 99999,
          Conditions: PostData
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide()
          if(Res.IsSuccess){
            this.Profits.push(...Res.Data.PageModel.Items);
          }else{
            this.$Request.Error(Res)
          }
        }
      })
    }
  }

  private Profits: ReportInterface.GrossProfitList[] = []

  private Cols: PInterface.TableCol[] = [{
    title: '订单金额(USD)',
    key: 'OrderTotal'
  }, {
    title: '汇损(USD)',
    key: 'ExchangeLoss'
  }, {
    title: '平台佣金(USD)',
    key: 'PlatformCommission'
  }, {
    title: 'Paypal手续费(USD)',
    key: 'PaypalServiceCharge'
  }, {
    title: '成本(USD)',
    key: 'OrderCost'
  }, {
    title: '运费(USD)',
    key: 'OrderFreight'
  }, {
    title: '退款金额',
    key: 'RefundAmount'
  }, {
    title: '毛利',
    key: 'Profit'
  }, {
    title: '毛利率',
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.ProfitRate}%`)
    }
  }]
}
</script>
<style lang="less" scoped>
</style>