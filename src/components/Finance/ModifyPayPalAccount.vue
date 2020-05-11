<template>
  <Row class="P-Inline-Block">
	<Col>
    <Button type="primary" @click="TriggerModal" v-if="Power">添加PayPal账号</Button>
		<Modal v-model="ShowModal" :title="AccountMsg.Id === 0 ? '添加PayPal账号' : '修改PayPal账号'" :mask-closable="false" @on-cancel="HandleRes(false)" :width="600">
			<Form onsubmit="return false" ref="AccountMsg" :model="AccountMsg" :rules="PAccountRules" :label-width="120">
        <Form-item label="注册邮箱：" prop="PaypalEmail">
          <Input v-model="AccountMsg.PaypalEmail" placeholder="请输入注册邮箱" ref="PaypalEmail"></Input>
        </Form-item>
        <Form-item label="API名称：" prop="ApiUserName">
          <Input v-model="AccountMsg.ApiUserName" placeholder="请输入API名称"></Input>
        </Form-item>
        <Form-item label="API密码：" prop="ApiPassword">
          <Input type="password" v-model="AccountMsg.ApiPassword" placeholder="请输入API密码"></Input>
        </Form-item>
        <Form-item label="API签名：" prop="ApiSignature">
          <Input v-model="AccountMsg.ApiSignature" placeholder="请输入API签名"></Input>
        </Form-item>
        <Form-item label="API Subject：" prop="Subject">
          <Input v-model="AccountMsg.Subject" placeholder="请输入API Subject"></Input>
        </Form-item>
      </Form>
			<footer slot="footer">
	      <Button type="primary" @click="Valid">提交</Button>
	      <Button @click="HandleRes(false)">返回</Button>
	    </footer>
		</Modal>
	</Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Finance';
import PInterface from '@/assets/Interface/Public';
@Component({
  name: 'ModifyPayPalAccount'
})
export default class ModifyPayPalAccount extends Vue {
  @Prop() Power: boolean
  
  @Emit() private HandleRes(N:boolean){
    this.ShowModal = false;
    this.AccountMsg = new Interface.PayPalAccountData();
    this.$nextTick(()=>{ (this.$refs['AccountMsg'] as any).resetFields()})
  }

  private TriggerModal(SelecData: Interface.PayPalAccountList[]): void{
    if(SelecData.length){ //修改
      this.AccountMsg.Id = SelecData[0].Id
      this.AccountMsg.AccountBalance = SelecData[0].AccountBalance
      this.AccountMsg.IsEnable = SelecData[0].IsEnable
      this.AccountMsg.PaypalEmail = SelecData[0].PaypalEmail
    }
    
    this.ShowModal = true;
    this.$nextTick(()=>{(this as any).$refs.PaypalEmail.focus()})
  }

  private Valid(): void{
    (this.$refs['AccountMsg'] as any).validate((Valid: boolean) => {
      if(Valid){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Finance,
          Api: {
            Address: this.AccountMsg.Id === 0 ? this.$Api.PaypalCreate : this.$Api.PaypalModify,
            Login: true
          },
          Data: this.AccountMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tip.Floating('success', (this.AccountMsg.Id === 0 ? '添加' : '修改') + 'PayPal账号成功')
              this.HandleRes(true)
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        })
      }
    })
  }

  private ShowModal: boolean = false;
  private OrderAmount: number = 0;
  private AccountMsg = new Interface.PayPalAccountData;
  private PAccountRules: any = {
    PaypalEmail: [{ required: true, message: '请输入注册邮箱' }, { pattern: this.$Pattern.Email, message: '请输入正确格式的邮箱' }],
    ApiUserName: [{ required: true, message: '请输入API名称' }],
    ApiPassword: [{ required: true, message: '请输入API密码' }],
    ApiSignature: [{ required: true, message: '请输入API签名' }],
    Subject: [{ required: true, message: '请输入API Subject' }]
  }
}
</script>