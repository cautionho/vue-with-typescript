<!-- 所有订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :Page="'All'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "AllOrder"
})
export default class AllOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch({Status: 2})
}
</script>
<style lang="less" scoped>
</style>