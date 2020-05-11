<!-- 待人工审核订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'WaitAudit'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "WaitAuditOrder"
})
export default class WaitAuditOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ToConfirmed', 'ToCancel', 'ReviewShipOrder']
}
</script>
<style lang="less" scoped>
</style>