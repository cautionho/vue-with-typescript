<!-- 无法分配仓库订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'NoMatchWarehouse'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "NoMatchWarehouseOrder"
})
export default class NoMatchWarehouseOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status: 1})
  private UsableOperations:string[] = ['ToConfirmed','ToCancel','ReviewShipOrder']
}
</script>
<style lang="less" scoped>
</style>