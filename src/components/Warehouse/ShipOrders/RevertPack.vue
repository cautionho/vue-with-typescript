<template>
  <Col>
    <Button type="primary" @click="Trigger">还原打包</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "RevertPack"
})
export default class RevertPack extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('RevertPack');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    if(D.length > 1){
      this.$UI.Tips.Floating('warning','仅支持选择单个发货订单进行还原打包操作');
      return
    }
    if(D.some(Item => Item.ShipOrder.Status !== 5)){
      this.$UI.Tips.Floating('warning','请选择状态为已打包的发货订单进行操作');
      return
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认还原打包',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          let PostData:Interface.InfoParams = {
            OrderId: D[0].ShipOrder.Id,
            OrderCode: D[0].ShipOrder.OrderCode
          }
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ShipOrderRevertPack,
              Login:true
            },
            Data: PostData,
            Callback:(Res:PInterface.Res):void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '还原打包成功');
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