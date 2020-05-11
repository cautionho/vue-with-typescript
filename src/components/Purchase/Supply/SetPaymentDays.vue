<template>
	<Row>
		<Modal v-model="IsShowModal" title="设置账期" :mask-closable="false" :width="500">
			<Form onsubmit="return false" ref="SetPayMsg" :model="SetPayMsg" :rules="SetPayRules" :label-width="100">
        <Form-item label="供应商名称：" prop="SupplyName">
          <span>{{SetPayMsg.SupplyName}}</span>
        </Form-item>
        <Form-item label="账期：" prop="Period" class="ivu-form-item-required">
          <Select class="P-W-100-Percent" v-model="SetPayMsg.Period" placeholder="请选择账期" :options="PeriodList" ref="period" />
          <!-- <Select class="P-W-100-Percent" v-model="SetPayMsg.Period" placeholder="请选择账期" filterable label-in-value clearable ref="period">
            <Option v-for="(item,index) in PeriodList" :value="$Enums.Purchase.PaymentDays[item]" :key="index">{{item}}</Option>
          </Select> -->
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="PostSetPay">提交</Button>
        <Button @click="EmitSetpay(false)">取消</Button>
      </footer>
      </Form>
		</Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'SetPaymentDays'
})
export default class SetPaymentDays extends Vue {
  @Emit() EmitSetpay(R: boolean): void{
    this.IsShowModal = false;
    (this.$refs.SetPayMsg as any).resetFields();
  }

  private TriggerModal(SelectedData: Interface.Supplier): void{
    this.IsShowModal = true
    this.SetPayMsg.SupplyName = SelectedData.SupplyName
    this.SetPayMsg.SupplyId = SelectedData.Id
    this.SetPayMsg.Period = SelectedData.AccountPeriod == 0 ? '' : SelectedData.AccountPeriod;
  }

  private PostSetPay(): void{
    (this.$refs['SetPayMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        let PostForm = JSON.parse(JSON.stringify(this.SetPayMsg))
        delete PostForm.SupplyName
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.SupplySetAccountPeriod,
            Login: true
          },
          Data: PostForm,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', `修改账期成功`);
              this.EmitSetpay(true)
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        })
      }
    })
  }

  
  private IsShowModal: boolean = false
  private SetPayMsg: Interface.SetPay = new Interface.SetPay()
  private PeriodList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.PaymentDays)
  private SetPayRules: any = {
    Period: [{ type: 'number', required: true, message: '请选择账期', trigger: 'change' }]
  }
}

</script>
<style lang="less"></style>
