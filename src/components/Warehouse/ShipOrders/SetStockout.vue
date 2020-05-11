<template>
  <Col>
    <Button type="primary" @click="Trigger">设置缺货</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "Stockout"
})
export default class Stockout extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}
  
  private Trigger():void{
    this.TriggerOperations('ToOutStock');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    if(D.some(Item => Item.ShipOrder.Status !== 3)){
      this.$UI.Tips.Floating('warning','请选择状态为待拣货的发货订单进行操作');
      return
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否将发货订单状态变更为缺货',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          let PostData:Interface.ChangeShipOrderStatus = {
            OrderId: D.map(Item => Item.ShipOrder.Id),
            Targetstatus: 7,
            Remark: ""
          }
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ShipOrderChangeStatus,
              Login:true
            },
            Data: PostData,
            Callback:(Res:PInterface.Res):void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '发货订单状态已变更为缺货');
                this.EmitOperateSuccess()
              }else{
                this.$UI.Loading.Hide()
                this.$Request.Error(Res);
              }
            }
          })
        }
      }
    })
  }
}
</script>