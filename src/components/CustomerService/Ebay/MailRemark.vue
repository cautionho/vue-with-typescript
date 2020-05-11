<template>
  <Modal title="站内信备注" v-model="RemarkModal" :width="600" @on-cancel="CancelModal">
    <Form :model="RemarkForm" ref="RemarkForm" :rules="RemarkRules" :label-width="0" onsubmit="return false">
      <FormItem prop="RemarkContent">
        <Input placeholder="备注内容" ref="RemarkIpt" type="textarea" :autosize="{minRows:5, maxRows:5}" v-model="RemarkForm.RemarkContent"></Input> 
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button>取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'MailRemark'
})

export default class MailRemark extends Vue {
  @Emit() EmitHandleSuccess(): void {}

  private Trigger(D: number): void {
    this.$set(this.RemarkForm, 'MainMessageId', D);
    this.$set(this, 'RemarkModal', true)
    this.$nextTick(()=>{
      (this as any).$refs.RemarkIpt.focus();
    })
  }

  private Validate(): void {
    (this as any).$refs.RemarkForm.validate((Valid: boolean) => {
      if(Valid){
        this.$UI.Loading.Show()
        this.$Request.Post({
          Server: this.$Server.CustomerService,
          Api: {
            Address: this.$Api.EbayMessageAddRemark,
            Login: true
          },
          Data: this.RemarkForm,
          Callback: (Res: PInterface.Res): void => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success', '添加成功')
              this.EmitHandleSuccess()
              this.CancelModal()
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'RemarkModal', false);
    (this as any).$refs.RemarkForm.resetFields();
  }

  private RemarkModal: boolean =  false
  private RemarkForm: Interface.MailRemark = new Interface.MailRemark()
  private RemarkRules: any = {
    RemarkContent: [{ required: true, message: '请输入备注' }]
  }
}
</script>