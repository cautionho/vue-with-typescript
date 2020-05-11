<template>
  <Col>
    <Table :columns="Cols" :data="SHIP_ORDER_HISTORY" size="small" stripe :height="CalculateHeight()"></Table>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ShipOrderHistory"
})

export default class ShipOrderItems extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_HISTORY": Interface.ShipOrderHistory[];
  get SHIP_ORDER_HISTORY() {
    return this["ShipOrder/SHIP_ORDER_HISTORY"];
  }

  private CalculateHeight() {
    return 500;
  }

  private Cols: PInterface.TableCol[] = [{
    title: '编号',
    width:100,
    key: 'Id'
  }, {
    title: '操作人',
    width:100,
    key: 'Operator'
  }, {
    title: '操作记录',
    render: (h:any,Params:any) => {
      return h('Tooltip', {
        props: {
          content: Params.row.OperateLog
        },
        class: 'P-LINE-1'
      }, Params.row.OperateLog)
    }
  }, {
    title: '操作时间',
    width:160,
    render: (h:any,Params:any):string => {
      return h('span', this.$UI.Render.Date(Params.row.OperateTime,true));
    }
  }]
}
</script>
<style lang="less"></style>