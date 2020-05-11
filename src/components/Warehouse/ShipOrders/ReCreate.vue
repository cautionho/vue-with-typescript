<template>
  <Col>
    <Button type="primary" @click="Trigger">重新下单</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "OrderReCreate"
})
export default class OrderReCreate extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('OrderReCreate');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认重新下单',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ReCreateShipOrder,
              Login:true
            },
            Data: D.map(Item => Item.ShipOrder.Id),
            Callback:(Res:PInterface.Res):void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '重新下单成功');
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