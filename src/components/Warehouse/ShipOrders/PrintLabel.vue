<template>
  <Col>
    <Button type="primary" @click="Trigger">重打面单</Button>
  </col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'
import { PmsPrint, MailPrint } from '@/assets/Global/Print'
import { Getter } from "vuex-class";

@Component({
  name: "PrintLabel"
})
export default class PrintLabel extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('PrintLable');
  } 

  private Validate(D:Interface.ShipOrderList[]):void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否对选中的订单进行重打面单操作？',
      Callback: (B:boolean) =>{
        if(B){
          let PmsIds: number[] = [], OrderId:number[] = [], OrderCodes:string[] = [];
          D.forEach(Item=>{
            if(Item.ShipOrder.ApiType == 6) { // 渠道为美国PMS专线)
              PmsIds.push(Item.ShipOrder.Id)
            } else{
              OrderId.push(Item.Address.OrderId)
              OrderCodes.push(Item.ShipOrder.OrderCode)
            }
          })

          if(PmsIds.length > 0){ this.GetPmsPrintData(PmsIds, OrderId) }
          if(OrderId.length > 0){ this.GetPrintData(OrderId, OrderCodes) }
          // this.EmitOperateSuccess();
        }
      }
    })
  }

  private GetPmsPrintData(PmsIds: number[], OrderIds:number[]): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderPrintPms,
        Login: true
      },
      Data: { OrderId: PmsIds, IsRePrint: true },
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          PmsPrint(Res.Data.Data);
          if (OrderIds.length == 0) {
            this.$UI.Tips.Floating('success', '订单重打面单成功');
          }
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetPrintData(OrderId:number[], OrderCodes:string[]){
    let postData = {
      OrderCode: OrderCodes,
      OrderId: OrderId
    }
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderGetPrintData,
        Login: true
      },
      Data: { OrderCode: OrderCodes, OrderId: OrderId },
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          MailPrint(Res.Data.Data);
          this.$UI.Tips.Floating('success', '重打面单成功');
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  
}
</script>