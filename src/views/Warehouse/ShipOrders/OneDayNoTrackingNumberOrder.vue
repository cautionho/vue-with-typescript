<!-- 24小时无跟踪号 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'OneDayNoTrackingNumber'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "OneDayNoTrackingNumberOrder"
})
export default class OneDayNoTrackingNumberOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ToContact','SetShippingMethod','ChangeShipWarehouse']
}
</script>
<style lang="less" scoped>
</style>