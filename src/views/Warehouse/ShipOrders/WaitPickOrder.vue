<!-- 待拣货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'WaitPick'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "WaitPickOrder"
})
export default class WaitPickOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:3})
  private UsableOperations:string[] = ['ToOutStock','ReturnGoods','ExportShipOrder']
}
</script>
<style lang="less" scoped>
</style>