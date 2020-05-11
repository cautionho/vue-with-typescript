<template>
	<Row>
    <Modal v-model="OpenPreventModal" :title="TabTitle" @on-cancel="EmitPurchase(false)" :mask-closable="false" width="600">
      <Form :label-width="100" ref="PreventForm" :model="PreventForm">
        <FormItem label="备注：">
          <Input placeholder="请输入备注" type="textarea" v-model="PreventForm.Remark" :autosize="{minRows:6,maxRows:6}" ref="Remark"></Input>
        </FormItem>
      </Form>
      <footer slot="footer">
				<Button type="primary" @click="PostPrevent">提交</Button>
				<Button @click="EmitPurchase(false)">取消</Button>
			</footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase';
import PInterface from '@/assets/Interface/Public';
@Component({
  name: 'PreventPon'
})
export default class PreventPon extends Vue {
  @Emit() private EmitPurchase(r: boolean):void{
    this.OpenPreventModal = false;
    this.$set(this, 'PreventForm', new Interface.PreventData())
  }

  private TriggerModal(SelectedData: Interface.PurchaseOrd[], CurrentPon: number):void{
    if(CurrentPon === 6 && !(SelectedData.every( (Item) => { return ((Item.Status == 1) || (Item.Status == 9 && Item.PayStatus == 1) || ((Item.Status == 9 || Item.Status == 4) && Item.RefundStatus == 2)) }))){
			this.$UI.Tips.Floating('warning', `请选择状态为新建、待付款且未申请付款、待付款且已申请退款、待发货且已申请退款的采购单进行操作`);
			return;
    }

    if(CurrentPon === 7 && !(SelectedData.every( (Item) => { return ((Item.Status == 7 || Item.Status == 6 || Item.Status == 5) && Item.RefundStatus == 2) } ))){
			this.$UI.Tips.Floating('warning', `请选择状态为待签收、待入库、部分入库，且已申请退款的采购单进行操作`);
			return;
		}
    
    this.SelectedData = SelectedData;
    this.CurrentPon = CurrentPon;
    this.TabTitle = this.CurrentPon == 6 ? '终止采购' : this.CurrentPon == 7 ? '不等待余货' : ''
    this.OpenPreventModal = true
    this.$nextTick(()=>{(this as any).$refs.Remark.focus()})
  }

  private PostPrevent(): void{
    let PostData = JSON.parse(JSON.stringify(this.PreventForm))
    PostData.Id = this.SelectedData.map(item => item.Id)

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.CurrentPon == 6 ? this.$Api.PurchaseOrderStop : this.$Api.PurchaseOrderNoWait,
				Login: true
			},
			Data: PostData,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', this.CurrentPon == 6 ? `终止采购成功，采购单状态变更为已终止` : `不等待余货成功，采购单状态变更为已完成`);
					this.EmitPurchase(true)
				} else {  
					this.$Request.Error(res);
          this.$UI.Loading.Hide();
        }
			}
		})
  }

  private CurrentPon: number = 0
  private PreventForm: Interface.PreventData = new Interface.PreventData()
  private TabTitle: string = ""
  private OpenPreventModal: boolean = false;
  private SelectedData: Interface.PurchaseOrd[] = []
}

</script>
<style lang="less"></style>
