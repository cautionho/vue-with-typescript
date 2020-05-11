<template>
  <Col>
    <Button type="primary" @click="Trigger">更新eDIS包裹单</Button>
  </col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "UpdateEdis"
})
export default class UpdateEdis extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('UpdEdisPackage');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认更新eDIS包裹单',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ReSendEdisLogisticsOrder,
              Login:true
            },
            Data: D[0].ShipOrder.Id,
            Callback:(Res:PInterface.Res):void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '更新eDIS包裹单成功');
                this.EmitOperateSuccess();
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