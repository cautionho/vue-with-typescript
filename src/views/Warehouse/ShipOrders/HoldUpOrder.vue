<!-- 已拦截订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'HoldUp'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "HoldUpOrder"
})
export default class HoldUpOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:8})
  private UsableOperations:string[] = ['ToConfirmed','ToContact','ToCancel','MergeShipOrder']
}
</script>
<style lang="less" scoped>
</style>