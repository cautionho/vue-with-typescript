<template>
  <Col>
    <Button type="primary" @click="Trigger">确认</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "ConfirmOrder"
})
export default class ConfirmOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('ToConfirmed');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([1, 7, 8, 9].some(S => S === Item.ShipOrder.Status))) {
        this.$UI.Tips.Floating('warning','请选择状态为待检查、缺货、已拦截、联系客户的发货订单进行操作')
        return;
      }
      if(!Item.ShipOrder.ShipWarehouseId || !Item.ShipOrder.ShippingMethodId){
        this.$UI.Tips.Floating('warning','请选择已分配发货仓和物流渠道的发货订单进行操作')
        return;
      }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: '是否将发货订单状态变更为已确认',
        Callback: (B:boolean) =>{
          if(B){
            this.$UI.Loading.Show()
            let PostData:Interface.ChangeShipOrderStatus = {
              OrderId: D.map(Item => Item.ShipOrder.Id),
              Targetstatus: 2,
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
                  this.$UI.Tips.Floating('success', '发货订单状态已变更为已确认');
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
}
</script>