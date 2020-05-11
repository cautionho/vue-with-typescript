<!-- 存在清货产品的缺货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'ClearOutStock'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ClearOutStockOrder"
})
export default class ClearOutStockOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({SkuStatus: '4,5', Status: 7})
  private UsableOperations:string[] = ['ToConfirmed', 'ToContact','ToCancel','EbayMsgSend']
}
</script>
<style lang="less" scoped>
</style>