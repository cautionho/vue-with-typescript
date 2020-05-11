<template>
  <Row>
    <SearchShipOrder ref="SearchShipOrder" :SearchInit="SearchInit" :Pager="Pager" :Page="Page" @emit-list="EmitList" @emit-pager-change="EmitPagerChange"></SearchShipOrder>
    <ShipOrderList ref="ShipOrderList" :List="List" :TOperations="TOperations" :Page="Page" @emit-pager-change="EmitPagerChange" @emit-details="EmitDetails" @emit-close-search="EmitCloseSearch"></ShipOrderList>
    <ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="EmitOperateSuccess"></ShipOrderDetails>
  </Row>
</template>
<script lang="ts" src="./ShipOrder.ts">
</script>
<style lang="less" scoped>
</style>