<!-- 已发货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Shiped'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ShipedOrder"
})
export default class ShipedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:6})
  private UsableOperations:string[] = ['ReSentOrder','ExportShipOrder','SetTrackNumber','PrintLable','ReplaceLogisticsLabel']
}
</script>
<style lang="less" scoped>
</style>