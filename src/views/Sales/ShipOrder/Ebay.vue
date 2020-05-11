<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'eBay'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "EbayShipOrder"
})
export default class EbayShipOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:1,Platform:1})
  private UsableOperations:string[] = ['ShipOrderCreate','ImportShipOrder','ToConfirmed','ToNoCheck','MergeShipOrder','ReSentOrder','ToHoldUp','ToContact','ToCancel','SetShippingMethod','ChangeShipWarehouse','SignShiped','EbayMsgSend']
}
</script>
<style lang="less" scoped>
</style>