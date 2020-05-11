<template>
    <div class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-MR-10" @click="HandleRes(false, 1)">审核通过</Button>
      <Button type="primary" @click="HandleRes(false, 2)">审核不通过</Button>
      <Modal v-model="IsShowModal" :title="Type === 1?'审核通过' : '审核不通过'" @on-cancel="HandleRes(false)" :mask-closable="false" :width="500">
        <Input v-model="Remark" placeholder="请输入备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}" ref="Remark"></Input>
        <div slot="footer">
          <Button type="primary" @click="PostOpe">提交</Button>
          <Button @click="HandleRes(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'AuditOverseasWare'
})
export default class AuditOverseasWare extends Vue {
  @Emit() HandleRes(Res: boolean, Target?: number): void { // Target 1-通过 2-不通过
    this.Remark = "";
    this.$set(this,'IsShowModal', false)
  }

  private TriggerModal(SelectedData: Interface.PhotoRequestList[], Type: number){
    if(Type === 1 && !(SelectedData.every( Item => Item.Status == 7 || Item.Status == 8)) ){
      this.$UI.Tips.Floating('warning', `请选择状态为待审核或不通过的产品进行操作`);
			return;
    }

    if(Type === 2 && !(SelectedData.every( Item => Item.Status == 7)) ){
      this.$UI.Tips.Floating('warning', `请选择状态为待审核的产品进行操作`);
			return;
    }

    this.Type = Type;
    this.CurrSeleData = SelectedData;
    this.IsShowModal = true;
    this.$nextTick(()=>{
      (this.$refs.Remark as any).focus();
    })
  }

  private PostOpe(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.OverseaSkuAuditPass,
				Login: true
			},
			Data: { Ids: this.CurrSeleData.map(Item=>Item.Id), IsAudit: this.Type === 1 ? true : false, Remark: this.Remark },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `操作成功`);
          this.HandleRes(true)
				} else {
					this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
				}
			}
    });
  }

  
  private CurrSeleData: Interface.PhotoRequestList[] = [];
  private IsShowModal: boolean = false;
  private Type: number = 0;
  private Remark: string = ""
}

</script>
<style lang="less"></style>
