<template>
  <div>
    <AddShipOrderRemark ref="AddShipOrderRemark" class="P-Inline-Block P-MR-5" @emit-operate-success="EmitOperateSuccess"></AddShipOrderRemark>
    <Col class="P-Inline-Block" v-if="DisputedType > 1 && DisputedType < 5">
      <Button type="primary" @click="Validate">{{ DisputedCompName !=='AllegroDisputedDetails' ? '提交' : DisputedType === 3 ? '退款' : DisputedType === 4 ? '申诉' : '提交' }}</Button>
    </Col>
    <Col class="P-Inline-Block" v-if="DisputedType === 5">
      <Button type="primary" @click="Validate(1)">关闭</Button>
      <Button type="primary" @click="Validate(2)">回复</Button>
      <Button type="primary" @click="Validate(3)">Wish客服协助</Button>
    </Col>
    <Button class="P-ML-5" @click="CancelShipOrderModal">返回</Button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'DisputedOperate',
  components: {
    AddShipOrderRemark: () => import("@/components/Warehouse/ShipOrders/AddRemark.vue")
  }
})

export default class DisputedOperate extends Vue {
  @Prop(String) private DisputedCompName: string
  @Prop(Number) private DisputedType: number

  @Emit() CancelShipOrderModal():void {}
  @Emit() EmitOperateSuccess(Action:string = 'ShipOrder/UPDATE_SHIP_ORDER_INFO'):void {}

  private Validate(T?: number): void {
    const ParentComp: Vue = this.$parent.$parent.$parent;
    (ParentComp as any).$refs[ParentComp.DisputedCompName].Validate(T);
  }

}
</script>
<style lang="less" scoped>

</style>