<template>
  <Col>
    <Button type="primary" @click="Trigger">释放订单到已确认</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "CancelOrder"
})
export default class CancelOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('ReturnGoods');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([3, 4, 5].some(S => S === Item.ShipOrder.Status))) {
        this.$UI.Tips.Floating('warning','请选择状态为待拣货、已拣货、已打包的发货订单进行操作')
        return;
      }
      if(Item.ShipOrder.ShipWarehouseId === 79){
        this.$UI.Tips.Floating('warning', '请选择非分销的发货订单进行操作')
        return
      }
    }
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否释放订单到已确认状态',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.BatchOrderReturnGoods,
              Login:true
            },
            Data: D.map(Item => Item.ShipOrder.Id),
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
</script>