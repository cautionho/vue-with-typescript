<template>
	<Row>
    <Col>
    <Modal v-model="ShowDetailModal" title="供应商详情" @on-cancel="CancelModal" :mask-closable="false" :width="900" class="Container-Tabs">
      <Form onsubmit="return false" :label-width="100" inline>
        <Tabs type="card" name="SupplierDetail" :value="TabPane" @on-click="ChangePane">
          <TabPane label="基本信息" name="Info" tab="SupplierDetail">
            <Form-item label="供应商名称：" class="P-W-400">
              <span>{{DetailsDatas.SupplyName}}</span>
            </Form-item>
            <Form-item label="联系人：" class="P-W-400">
              <span>{{DetailsDatas.Contact}}</span>
            </Form-item>
            <Form-item label="联系电话：" class="P-W-400">
              <span>{{DetailsDatas.Phone}}</span>
            </Form-item>
            <Form-item label="阿里旺旺：" class="P-W-400">
              <span>{{DetailsDatas.AliNum === "" ? "-" : DetailsDatas.AliNum}}</span>
            </Form-item>
            <Form-item label="邮箱：" class="P-W-400">
              <span>{{DetailsDatas.Email === "" ? "-" : DetailsDatas.Email}}</span>
            </Form-item>
            <Form-item label="QQ：" class="P-W-400">
              <span>{{DetailsDatas.QQNum === "" ? "-" : DetailsDatas.QQNum}}</span>
            </Form-item>
            <Form-item label="相关链接:" class="P-W-400">
              <span>{{DetailsDatas.Url === "" ? "-" : DetailsDatas.Url}}</span>
            </Form-item>
            <Form-item label="邮编：" class="P-W-400">
              <span>{{DetailsDatas.ZipCode === "" ? "-" : DetailsDatas.ZipCode}}</span>
            </Form-item>
            <Form-item label="地址：" class="P-W-100-Percent">
              <span>{{DetailsDatas.ProvinceName}}{{DetailsDatas.CityName}}{{DetailsDatas.AreaName}}{{DetailsDatas.Street}}</span>
            </Form-item>
            <Form-item label="备注：" class="P-W-100-Percent">
              <span>{{DetailsDatas.Remark === "" ? "-" : DetailsDatas.Remark}}</span>
            </Form-item>
          </TabPane>
          <TabPane label="财务结算" name="Finance" tab="SupplierDetail">
            <Form-item label="结算方式" class="P-W-400">
              <span>{{DetailsDatas.BillType == 0 ? '-' : this.$Enums.Purchase.BillType[DetailsDatas.BillType]}}</span>
            </Form-item>
            <Form-item label="支付方式" class="P-W-400">
              <span>{{DetailsDatas.PayType == 0 ? '-' : this.$Enums.Purchase.PayType[DetailsDatas.PayType]}}</span>
            </Form-item>
            <Form-item label="开户行" class="P-W-400">
              <span>{{DetailsDatas.BankName === "" ? "-" : DetailsDatas.BankName}}</span>
            </Form-item>
            <Form-item label="账户名" class="P-W-400">
              <span>{{DetailsDatas.BankAccount === "" ? "-" : DetailsDatas.BankAccount}}</span>
            </Form-item>
            <Form-item label="账号" class="P-W-400">
              <span>{{DetailsDatas.BankNumber === "" ? "-" : DetailsDatas.BankNumber}}</span>
            </Form-item>
          </TabPane>
        </Tabs>
      </Form>
      <div slot="footer">
        <Button @click="CancelModal">返回</Button>
      </div>
    </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop, Emit } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'SupplierDetails'
})
export default class SupplierDetails extends Vue {
  private TriggerModal(SelectedData: Interface.Supplier): void{
    this.$set(this, 'DetailsDatas', SelectedData)
    this.$set(this, 'ShowDetailModal', true)
  }

  private CancelModal(){
    this.ShowDetailModal = false;
    this.$set(this, 'DetailsDatas', new Interface.Supplier());
    this.$set(this, 'TabPane', 'Info');
  }

  private ChangePane(Val: string) {
    this.TabPane = Val;
  }

  private ShowDetailModal: boolean = false; //控制模态框
  private TabPane: string = "Info";
  private DetailsDatas: Interface.Supplier = new Interface.Supplier()
}

</script>
<style lang="less"></style>
