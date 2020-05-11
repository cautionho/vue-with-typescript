<!-- 详单商品错误订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'SkuError'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "SkuErrorOrder"
})
export default class SkuErrorOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status: 1})
  private UsableOperations:string[] = ['ToConfirmed','ToCancel','ExportDetailsErrorOrder']
}
</script>
<style lang="less" scoped>
</style>