<template>
	<Row>
    <Form :label-width="100" :model="DetailInfoMsg" ref="PonBaseInfo" inline>
      <FormItem label="采购单号：" class="P-W-500" prop="PurchaseCode">
        <span>{{DetailInfoMsg.PurchaseCode}}</span>
      </FormItem>
      <FormItem label="来源：" class="P-W-500" prop="SourceType">
        <span>{{$Enums.Purchase.SourceType[DetailInfoMsg.SourceType]}}</span>
      </FormItem>
      <FormItem label="仓库：" class="P-W-500" prop="WarehouseName">
        <span>{{DetailInfoMsg.WarehouseName}}</span>
      </FormItem>
      <FormItem label="供应商：" class="P-W-500" prop="SupplyName">
        <span>{{DetailInfoMsg.SupplyName}}</span>
      </FormItem>
      <FormItem label="平台单号：" class="P-W-500" prop="ThirdOrderCode">
        <span>{{DetailInfoMsg.ThirdOrderCode === "" ? '-' : DetailInfoMsg.ThirdOrderCode}}</span>
      </FormItem>
      <FormItem label="运费：" class="P-W-500" prop="ShippingCost">
        <span>{{'￥'+DetailInfoMsg.ShippingCost}}</span>
      </FormItem>
      <FormItem label="采购员：" class="P-W-500" prop="PurchaserName">
        <span>{{DetailInfoMsg.PurchaserName === "" ? "-" : DetailInfoMsg.PurchaserName}}</span>
      </FormItem>
      <FormItem label="采购主管：" class="P-W-500" prop="PurchaseManagerName">
        <span>{{DetailInfoMsg.PurchaseManagerName === "" ? '-' : DetailInfoMsg.PurchaseManagerName}}</span>
      </FormItem>
      <FormItem label="销售主管：" class="P-W-500" prop="SaleManagerName">
        <span>{{DetailInfoMsg.SaleManagerName}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-500" prop="CreateTime">
        <span>{{$UI.Render.Date(DetailInfoMsg.CreateTime, true)}}</span>
      </FormItem>
      <FormItem label="预计到货日期" class="P-W-500" prop="ExpectedTime">
        <span>{{ $UI.Render.Date(DetailInfoMsg.ExpectedTime)}}</span>
      </FormItem>
    </Form>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'PonBaseInfo'
})
export default class PonBaseInfo extends Vue {
  @Prop() DetailInfoMsg: Interface.PurchaseDetail
}

</script>
<style lang="less"></style>
