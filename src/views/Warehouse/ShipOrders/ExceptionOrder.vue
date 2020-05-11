<!-- 异常订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Exception'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ExceptionOrder"
})
export default class ExceptionOrder extends Vue {
  private GetTime(Type: number): string {
    const Now = +new Date();
    if(Type === 1){
      return this.$UI.Render.NewDate(new Date(Now - 86400000 * 30), true)
    }else{
      return this.$UI.Render.NewDate(new Date(Now), true)
    }
  }

  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({IsException:true, TimeType: 1, StartTime: this.GetTime(1), EndTime: this.GetTime(2)})
  private UsableOperations:string[] = ['OrderReCreate','SetShippingMethod', 'EbayMsgSend']
}
</script>
<style lang="less" scoped>
</style>