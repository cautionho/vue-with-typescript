<!-- 联系客户订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Contact'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ContactOrder"
})
export default class ContactOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch(
    { Status: 9 }
  )
  private UsableOperations:string[] = ['ToConfirmed','ToCancel','MergeShipOrder', 'SetShippingMethod', 'ChangeShipWarehouse']
}
</script>
<style lang="less" scoped>
</style>