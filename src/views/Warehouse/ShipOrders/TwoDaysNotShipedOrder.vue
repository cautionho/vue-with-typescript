<!-- 48小时未发货 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'TwoDaysNotShiped'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "TwoDaysNotShipedOrder"
})
export default class TwoDaysNotShipedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ToConfirmed', 'ToCancel', 'ToContact', 'ToOutStock', 'SetShippingMethod','ChangeShipWarehouse', 'ExportShipOrder']
}
</script>
<style lang="less" scoped>
</style>