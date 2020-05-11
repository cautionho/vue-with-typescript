<!-- 待拦截订单 -->
<template>
  <ShipOrder :SearchInit="SearchInit" :UsableOperations="UsableOperations" :Page="'WaitHoldUp'"></ShipOrder>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "WaitHoldUpOrder"
})
export default class WaitHoldUpOrder extends Vue {
  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private UsableOperations:string[] = ['ReturnGoods']
}
</script>
<style lang="less" scoped>
</style>