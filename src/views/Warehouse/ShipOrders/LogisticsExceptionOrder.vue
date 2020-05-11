<!-- 物流异常订单 -->
<template>
  <Row>
    <Search ref="Search" :SearchInit="SearchInit" :Pager="Pager" :Page="'LogisticsException'" @emit-list="EmitList"  @emit-pager-change="EmitPagerChange" />
    <List ref="List" @emit-pager-change="GetList" />
  </Row>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Interface from "@/assets/Interface/ShipOrder";
import PInterface from '@/assets/Interface/Public';

@Component({
  name: "LogisticsExceptionOrder",
  components: {
    Search: () => import('@/components/Warehouse/ShipOrders/SearchShipOrder.vue'),
    List: () => import('@/components/Warehouse/ShipOrders/LogisticsExceptionOrderList.vue')
  }
})
export default class LogisticsExceptionOrder extends Vue {

  private EmitList(List: any, Total: number): void {
    (this as any).$refs.List.List = List;
    (this as any).$refs.List.Pager.TotalItems = Total;
  }

  private EmitPagerChange(Pager: PInterface.Pager): void {
    (this as any).$refs.List.Pager = Pager;
    this.$set(this, 'Pager', Pager);
    this.$nextTick(()=>{
      (this as any).$refs.Search.SearchList()
    })
  }

  private GetList(Pager: PInterface.Pager): void {
    this.$set(this, 'Pager', Pager);
    this.$nextTick(()=>{
      (this as any).$refs.Search.SearchList()
    })
  }

  private SearchInit: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()
  private Pager: PInterface.Pager = new PInterface.Pager()
  // private UsableOperations:string[] = []
}
</script>
<style lang="less" scoped>
</style>