<template>
  <Row>
    <Modal v-model="OpenModal" :title="Status === 1 ? '退回修改' : Status === 2 ? '提交审核' : Status === 3 ? (Type === 1 ? '完成付款' : '完成退款') : (Type === 1 ? '终止付款' : '终止退款')" @on-cancel="EmitHandle(false)" :mask-closable="false" width="450">
      <Input placeholder="请输入备注" type="textarea" v-model="Remark" :autosize="{minRows:5,maxRows:5}" ref="Remark"></Input>
      <footer slot="footer">
				<Button type="primary" @click="PostSubmit">提交</Button>
				<Button @click="EmitHandle(false)">取消</Button>
			</footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Finance';

@Component({
  name: 'PayManageOperate',
  components: {
  }
})

export default class PayManageOperate extends Vue {
  @Emit() EmitHandle(B: boolean){
    this.OpenModal = false;
    this.Remark = "";
  }

  private TriggerModal(CurrSelect: Interface.ApplyFinanceList[], Status: number, Type: number): void{
    this.CurrSelect = CurrSelect;
    this.Status = Status;
    this.Type = Type;
    this.OpenModal = true;
    this.$nextTick(()=> { (this.$refs.Remark as any).focus() })
  }

  private PostSubmit(): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.Type === 1 ? this.$Api.PayOrderChangeStatus : this.$Api.RefundOrderChangeStatus,
				Login: true
			},
			Data: { Id: this.CurrSelect.map( Item=> Item.Id), Remark: this.Remark, Status: this.Status },
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', '操作成功');
					this.EmitHandle(true)
				} else {
					this.$Request.Error(res);
          this.$UI.Loading.Hide();
        }
			}
		})
  }

  private OpenModal: boolean = false;
  private Remark: string = "";
  private Status: number = 0;
  private Type: number = 0; //1-付款 2-退款
  private CurrSelect: Interface.ApplyFinanceList[] = [];
}
</script>