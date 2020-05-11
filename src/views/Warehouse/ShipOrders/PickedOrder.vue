<!-- 已拣货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Picked'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "PickedOrder"
})
export default class PickedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:4})
  private UsableOperations:string[] = ['SetShippingMethod','ReturnGoods','ExportShipOrder']
}
</script>
<style lang="less" scoped>
</style>