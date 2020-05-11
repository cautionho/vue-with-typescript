<template>
  <Form :model="SHIP_ORDER_ADDRESS" :label-width="90" inline>
    <FormItem label="买家ID：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.BuyerUserId || '-'}}</p>
    </FormItem>
    <FormItem label="收件人：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerFullName || '-'}}</p>
    </FormItem>
    <FormItem label="国家：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{`${SHIP_ORDER_ADDRESS.Country ? SHIP_ORDER_ADDRESS.Country.CountryNameCn : '-'}(${SHIP_ORDER_ADDRESS.Country ? SHIP_ORDER_ADDRESS.Country.CountryName : '-'})`}}</p>
    </FormItem>
    <FormItem label="省/州：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerState || '-'}}</p>
    </FormItem>
    <FormItem label="城市：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerCity || '-'}}</p>
    </FormItem>
    <FormItem label="地址1：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerStreet1 || '-'}}</p>
    </FormItem>
    <FormItem label="地址2：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerStreet2 || '-'}}</p>
    </FormItem>
    <FormItem label="邮编：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerZipCode || '-'}}</p>
    </FormItem>
    <FormItem label="买家Email：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_INFO.BuyerEmail || '-'}}</p>
    </FormItem>
    <FormItem label="电话：" class="P-W-50-Percent P-MR-0 P-MB-10">
      <p>{{SHIP_ORDER_ADDRESS.BuyerPhone || '-'}}</p>
    </FormItem>
  </Form>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "ShipOrderBaseADDRESS"
})
export default class ShipOrderBaseADDRESS extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_ADDRESS": PInterface.ShipToAddress;
  get SHIP_ORDER_ADDRESS() {
    return this["ShipOrder/SHIP_ORDER_ADDRESS"];
  }
   @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
}
</script>
<style lang="less" scoped>
</style>