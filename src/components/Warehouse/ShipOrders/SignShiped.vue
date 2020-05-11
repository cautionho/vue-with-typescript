<template>
  <Col>
    <Button type="primary" @click="Trigger">标记发货</Button>
  </col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "SignShiped"
})
export default class SignShiped extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('SignShiped');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if([1,4,9].every(Platform => Platform !== Item.ShipOrder.Platform) && Item.ShipOrder.TrackingNumber === ""){
        this.$UI.Tips.Floating('warning','eBay、Fyndiq和Shopee平台以外的订单标记发货时须先获取跟踪号');
        return
      }
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认标记发货',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ShipOrderSignShiped,
              Login:true
            },
            Data: {
              OrderId: D.map(Item => Item.ShipOrder.Id),
              OrderCode: []
            },
            Callback:(Res:PInterface.Res):void => {
              this.$UI.Loading.Hide();
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '标记发货成功');
              }else{
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