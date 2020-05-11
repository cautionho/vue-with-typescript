<!-- 5天未发货 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'FiveDaysNotShiped'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "FiveDaysNotShipedOrder"
})
export default class FiveDaysNotShipedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ToConfirmed', 'ToCancel', 'ToHoldUp', 'ToContact', 'ToOutStock', 'SetShippingMethod','ChangeShipWarehouse', 'ExportShipOrder', 'EbayMsgSend']
}
</script>
<style lang="less" scoped>
</style>