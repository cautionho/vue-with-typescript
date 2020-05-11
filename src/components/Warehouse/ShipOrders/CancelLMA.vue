<template>
  <Col>
    <Button type="primary" @click="Trigger">取消LMA包裹单</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "CancelLMA"
})
export default class CancelLMA extends Vue {
  @Action private "ShipOrder/UPDATE_SHIP_ORDER_INFO": any;
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }

  private Trigger():void{
    this.$UI.Tips.Modal({
      Type:'confirm',
      Content: '是否确认取消LMA包裹单',
      Callback:(B:boolean):void => {
        if(B){
          // this['ShipOrder/UPDATE_SHIP_ORDER_INFO']()
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.CancelLMAShipOrder,
              Login:true
            },
            Data: this['SHIP_ORDER_INFO'].Id,
            Callback: (Res:PInterface.Res):void => {
              // this.$UI.Loading.Hide();
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success','取消LMA包裹单成功')
                this['ShipOrder/UPDATE_SHIP_ORDER_INFO']()
              }else{
                this.$UI.Loading.Hide();
                this.$Request.Error(Res)
              }
            }
          })
        }
      }
    })
  }
}
</script>