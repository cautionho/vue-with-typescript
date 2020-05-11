<!-- 客户管理、充值 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="TriggerModal" class="P-MR-10">充值金额</Button>
      <Modal title="信用额度调整" v-model="ShowModal" @on-cancel="HandleRes(false)">
        <Form :label-width="90" :model="RechargeForm" ref="RechargeForm" :rules="RechargeRules" name="RechargeForm" onsubmit="return false">
          <Form-item label="客户编号：" prop="CustomerCode">
            <Input v-model="RechargeForm.CustomerCode" ref="CustomerCode" placeholder="请输入客户编号"></Input>
          </Form-item>
          <Form-item label="充值金额：" prop="Amount">
            <Input v-model="RechargeForm.Amount" placeholder="请输入充值金额"></Input>
          </Form-item>
          <Form-item label="备注：" prop="Remark">
            <Input v-model="RechargeForm.Remark" type="textarea" :autosize="{maxRows:4,minRows:4}" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
        <footer slot="footer">
          <Button type="primary" @click="PostRecharge">充值</Button>
          <Button @click="HandleRes(false)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Emit, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Logistics";
  @Component({
    name: 'Recharge'
  })
  export default class Recharge extends Vue {
    @Emit() HandleRes(Type:boolean): void {
      if(!Type){
        this.ShowModal = false;
      }
      this.$nextTick(()=>{ (this.$refs['RechargeForm'] as any).resetFields();})
    }

    // 打开模态框
    private TriggerModal():void {
      this.$set(this,'ShowModal', true);

      this.$nextTick(function() {
        (this.$refs.CustomerCode as any).focus()
      })
    }

    private PostRecharge(): void {
      (this.$refs['RechargeForm'] as any).validate((Valid: boolean) => {
        let RechargeForm = JSON.parse(JSON.stringify(this.RechargeForm))
        RechargeForm.Amount = Number(RechargeForm.Amount)
        if (Valid) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Logistics,
            Api: {
              Address: this.$Api.CustomerRecharge,
              Login: true
            },
            Data: RechargeForm,
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success',  '充值成功');
                this.HandleRes(true);
                (this.$refs.CustomerCode as any).focus();
              } else {
                this.$UI.Loading.Hide();
                this.$Request.Error(Res);
              }
            }
          }) 
        } else {
          return;
        }
      })
    }
    
    private RechargeForm: Interface.RechargeForm = new Interface.RechargeForm()
    private ShowModal: boolean = false; // 当前模态框

    private RechargeRules: any = {
      CustomerCode: [{ required: true, message: '请输入用户编号'}],
      Amount: [{ required: true, message: '请输入充值金额'}, { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确的充值金额' }]
    }
  }


</script>
<style lang="less">
</style>