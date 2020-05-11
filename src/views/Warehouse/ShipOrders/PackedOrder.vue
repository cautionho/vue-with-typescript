<!-- 已打包订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'Packed'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "PackedOrder"
})
export default class PackedOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status:5})
  private UsableOperations:string[] = ['RevertPack','PrintLable','SetTrackNumber','ReturnGoods','ExportShipOrder']
}
</script>
<style lang="less" scoped>
</style>