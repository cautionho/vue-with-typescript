<!-- 缺货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'StockOut'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "StockOutOrder"
})
export default class StockOutOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:7})
  private UsableOperations:string[] = ['ToConfirmed','ToContact','ToCancel','SetShippingMethod','ChangeShipWarehouse','EbayMsgSend']
}
</script>
<style lang="less" scoped>
</style>