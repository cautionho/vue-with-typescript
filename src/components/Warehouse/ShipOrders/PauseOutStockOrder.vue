<!-- 存在暂停产品的缺货订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'PauseOutStock'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "PauseOutStockOrder"
})
export default class PauseOutStockOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ToComfirmed', 'ToContact','ToCancel']
}
</script>
<style lang="less" scoped>
</style>