<!-- 已确认订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Confirmed'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ConfirmedOrder"
})
export default class ConfirmedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch(
    { Status: 2, IsException: false }
  )
  private UsableOperations:string[] = ['CreateBatchOrder','ToContact','QuickCreateBatchOrder']
}
</script>
<style lang="less" scoped>
</style>