<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Rakuten'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "RakutenShipOrder"
})
export default class RakutenShipOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status: 1, Platform: 21})
  private UsableOperations:string[] = ['ShipOrderCreate','ImportShipOrder','ToConfirmed','ToNoCheck','MergeShipOrder','ReSentOrder','ToHoldUp','ToContact','ToCancel','SetShippingMethod','ChangeShipWarehouse','SignShiped']
}
</script>
<style lang="less" scoped>
</style>