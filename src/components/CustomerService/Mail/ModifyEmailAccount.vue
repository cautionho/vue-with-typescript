<!-- 添加、编辑邮箱账号 -->
<template>
  <Modal v-model="EmailAccountModal" :title="ModalTitle" :width="800" @on-cancel="CancelModal">
    <Form :model="EmailAccountForm" ref="EmailAccountForm" :rules="EmailAccountRules" :label-width="100" onsubmit="return false">
      <FormItem label="名称：" prop="Name">
        <Input ref="NameIpt" placeholder="邮箱名称" v-model="EmailAccountForm.Name"></Input>
      </FormItem>
      <FormItem label="邮箱：" prop="Account">
        <Input placeholder="邮箱地址" v-model="EmailAccountForm.Account"></Input>
      </FormItem>
      <FormItem label="收件服务器：" class="P-W-500 P-Inline-Block" prop="ReceiveHost">
        <Input placeholder="收件服务器" v-model="EmailAccountForm.ReceiveHost"></Input>
      </FormItem>
      <span class="P-MR-20 P-ML-20">:</span>
      <FormItem class="P-W-200 P-Inline-Block" :label-width="0" prop="ReceiveHostPort">
         <Input placeholder="端口" v-model="EmailAccountForm.ReceiveHostPort"></Input>
      </FormItem>
      <FormItem label="发件服务器：" class="P-W-500 P-Inline-Block" prop="SendHost">
        <Input placeholder="发件服务器" v-model="EmailAccountForm.SendHost"></Input>
      </FormItem>
      <span class="P-MR-20 P-ML-20">:</span>
      <FormItem class="P-W-200 P-Inline-Block" :label-width="0" prop="SendHostPort">
        <Input placeholder="端口" v-model="EmailAccountForm.SendHostPort"></Input>
      </FormItem>
      <FormItem label="文件夹：" prop="FolderName">
        <Input placeholder="文件夹" v-model="EmailAccountForm.FolderName"></Input>
      </FormItem>
      <FormItem label="密码：" prop="Password">
        <Input type="password" placeholder="密码" v-model="EmailAccountForm.Password"></Input>
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'ModifyEmailAccount'
})

export default class ModifyEmailAccount extends Vue {
  @Emit() private EmitOperateSuccess(): void {}

  private Trigger(D: Interface.EmailAccountInfo = new Interface.EmailAccountInfo()): void {
    this.$set(this, 'EmailAccountModal', true)
    this.$set(this, 'ModalTitle', D.Id ? '编辑邮箱账号' : '添加邮箱账号')
    this.$set(this, 'EmailAccountForm', D);
    this.$nextTick(()=>{
      (this as any).$refs.NameIpt.focus();
    })
  }

  private Validate(): void {
    (this as any).$refs.EmailAccountForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostModifyEmailAccount();
      }
    })
  }

  private PostModifyEmailAccount(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.EmailAccountForm.Id ? this.$Api.EmailAccountEdit : this.$Api.EmailAccountAdd,
        Login: true
      },
      Data: this.EmailAccountForm,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.EmailAccountForm.Id ? '修改成功' : '添加成功')
          this.CancelModal()
          this.EmitOperateSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'EmailAccountModal', false)
    this.$set(this, 'EmailAccountForm', new Interface.EmailAccountInfo())
    this.$set(this, 'ModalTitle', '')
    this.$nextTick(()=>{
      (this as any).$refs.EmailAccountForm.resetFields()
    })
  }

  private EmailAccountModal: boolean = false
  private ModalTitle: string = ""

  private EmailAccountForm: Interface.EmailAccountInfo = new Interface.EmailAccountInfo()

  private EmailAccountRules: any = {
    Name: [{required:true, message: '请输入名称'}],
    Account: [{required:true, message: '请输入邮箱'}, {pattern: this.$Pattern.Email, message: '请输入正确格式的邮箱地址'}],
    ReceiveHost: [{required:true, message: '请输入收件服务器'}],
    ReceiveHostPort: [{required:true, message: '请输入收件服务器端口'}, {pattern: this.$Pattern.PositiveNotZero, message: '请输入正确格式的端口号'}],
    SendHost: [{required:true, message: '请输入发件服务器'}],
    SendHostPort: [{required:true, message: '请输入发件服务器端口'}, {pattern: this.$Pattern.PositiveNotZero, message: '请输入正确格式的端口号'}],
    FolderName: [{required:true, message: '请输入文件夹名称'}],
    Password: [{required:true, message: '请输入密码'}]
  }
}
</script>
<style lang="less" scoped>

</style>