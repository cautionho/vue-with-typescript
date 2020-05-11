<!-- 客户管理、调整额度 -->
<template>
  <Col>
    <Modal title="信用额度调整" v-model="ShowModal" @on-cancel="HandleResMsg(false)">
      <Form :label-width="80" :model="UpdCredForm" ref="UpdCredForm" :rules="UpdCredRules" name="UpdCredForm" onsubmit="return false">
        <Form-item label="客户编号：">
          {{SelecData.CustomerCode}}
        </Form-item>
        <Form-item label="当前额度：">
          {{SelecData.CreditsBalance}} CNY
        </Form-item>
        <Form-item label="新额度：" prop="NewCreditsBalance">
          <Input style="width:80%" v-model="UpdCredForm.NewCreditsBalance" placeholder="请输入新额度" ref="NewCreditsBalance"></Input> CNY
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="PostUpdCred">修改</Button>
        <Button @click="HandleResMsg(false)">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>

<script lang="ts">
  import { Component, Emit, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Logistics";
  @Component({
    name: 'UpdCreditsBalance'
  })
  export default class UpdCreditsBalance extends Vue {
    @Emit() HandleResMsg(Type:Boolean): void {
      this.ShowModal = false;
      this.$nextTick(()=>{ (this.$refs['UpdCredForm'] as any).resetFields();})
      
    }

    // 打开模态框
    private TriggerModal(SelectedData: Interface.CustomerManageList[] ):void {
      this.SelecData = JSON.parse(JSON.stringify(SelectedData))[0];
      this.UpdCredForm.CustomerId = this.SelecData.Id
      this.$set(this,'ShowModal', true);

      this.$nextTick(function() {
        (this.$refs.NewCreditsBalance as any).focus()
      })
    }

    private PostUpdCred(): void {
      (this.$refs['UpdCredForm'] as any).validate((Valid: boolean) => {
        if (Valid) {
          this.UpdCredForm.NewCreditsBalance = Number(this.UpdCredForm.NewCreditsBalance)
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Logistics,
            Api: {
              Address: this.$Api.CustomerUpdCreditsBalance,
              Login: true
            },
            Data: this.UpdCredForm,
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success',  '调整客户信用额度成功');
                this.HandleResMsg(true)
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
    
    private UpdCredForm: Interface.UpdCredForm = new Interface.UpdCredForm()
    private SelecData: Interface.CustomerManageList = new Interface.CustomerManageList; // 选中数据
    private ShowModal: boolean = false; // 当前模态框

    private UpdCredRules: any = {
      NewCreditsBalance: [{ required: true, message: '请输入新额度'}, { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确的新额度' }]
    }
  }


</script>
<style lang="less">
</style>