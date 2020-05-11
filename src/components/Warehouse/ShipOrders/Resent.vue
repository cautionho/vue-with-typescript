<template>
  <Col>
    <Button type="primary" @click="Trigger">重发</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "ResentOrder"
})
export default class ResentOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('ReSentOrder');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (Item.ShipOrder.Status !== 6) {
        this.$UI.Tips.Floating('warning','请选择状态为已发货的发货订单进行操作')
        return;
      }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: '是否重发发货订单',
        Callback: (B:boolean) =>{
          if(B){
            this.$UI.Loading.Show()
            let PostData:number [] = D.map(Item => Item.ShipOrder.Id);
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.ResendOrder,
                Login:true
              },
              Data: PostData,
              Callback:(Res:PInterface.Res):void => {
                if(Res.IsSuccess){
                  this.$UI.Tips.Floating('success', '重发发货订单成功');
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