<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Jumia'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "JumiaShipOrder"
})
export default class JumiaShipOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status: 1, Platform: 16})
  private UsableOperations:string[] = ['ShipOrderCreate','ImportShipOrder','ToConfirmed','ToNoCheck','MergeShipOrder','ReSentOrder','ToHoldUp','ToContact','ToCancel','SetShippingMethod','ChangeShipWarehouse','SignShiped']
}
</script>
<style lang="less" scoped>
</style>