<template>
  <Row class="P-Inline-Block">
	<Col>
    <Button type="primary" @click="HandlePay(1)" class="P-MR-10 P-MB-10">跨境宝付款</Button>
		<Modal v-model="PageModal" title="跨境宝付款" :mask-closable="false" @on-cancel="HandlePay" :width="600">
			<h2 style="margin-left: 150px;">付款订单数：{{SelecData.length}}</h2>
			<h2 style="margin-left: 150px;">付款总金额： {{OrderAmount}}</h2>
			<footer slot="footer">
	      <Button type="primary" @click="PostReq">打开付款页面</Button>
	      <Button type="primary" @click="HandlePay(3)">完成付款</Button>
	      <Button @click="HandlePay(4)">取消付款</Button>
	    </footer>
		</Modal>
	</Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Finance';
import PInterface from '@/assets/Interface/Public';
@Component({
  name: 'OpenPayPage'
})
export default class OpenPayPage extends Vue {
  @Emit() private HandlePay(N:number){
    this.PageModal = false;
  }

  private TriggerModal(SelecData: Interface.ApplyFinanceList[]): void{
    this.SelecData = SelecData;
    this.OrderAmount = 0;
    this.SelecData.forEach(Item=>{
      this.OrderAmount += Item.PayAmount as number;
    })
    this.PageModal = true;
  }

  private PostReq(): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.$Api.PayOrderOpenPayPage,
				Login: true
			},
			Data: this.SelecData.map(Item=> Item.Id),
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          window.open(Res.Data.Data, "_blank")
				} else {
					this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
			}
		})
  }

  private PageModal: boolean = false;
  private OrderAmount: number = 0;
  private SelecData: Interface.ApplyFinanceList[] = []
}
</script>