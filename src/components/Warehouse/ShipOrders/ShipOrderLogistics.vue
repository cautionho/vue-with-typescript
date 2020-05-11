<template>
  <Form :model="SHIP_ORDER_INFO" :label-width="90" inline>
    <FormItem label="发货仓库：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.WarehouseName || '-'}}</p>
    </FormItem>
    <FormItem label="物流渠道：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.MethodName || '-'}}</p>
    </FormItem>
    <FormItem label="拣货批次：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.BatchNumber}}</p>
    </FormItem>
    <FormItem label="跟踪号：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.TrackingNumber || '-'}}</p>
    </FormItem>
    <FormItem label="重量：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.Weight || '-'}}</p>
    </FormItem>
    <FormItem label="运费：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.ShipFee || '-'}}</p>
    </FormItem>
    <FormItem label="发货员：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.ShipUserName || '-'}}</p>
    </FormItem>
    <FormItem label="发货时间：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{$UI.Render.Date(SHIP_ORDER_INFO.ShipedTime || '')}}</p>
    </FormItem>
  </Form>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "ShipOrderBaseADDRESS"
})
export default class ShipOrderBaseADDRESS extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
}
</script>
<style lang="less" scoped>
</style>