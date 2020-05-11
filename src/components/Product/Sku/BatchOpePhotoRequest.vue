<template>
    <Col>
      <Modal v-model="IsShowModal" :title="Type === 1?'需求退回修改' : Type === 2 ? '图片退回修改': Type === 4 ? '审核通过' : ''" @on-cancel="ClearModal(false)" :mask-closable="false" :width="500">
        <Input v-model="Remark" placeholder="请输入备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}" ref="Remark"></Input>
        <div slot="footer">
          <Button type="primary" @click="PostOpe">提交</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'BatchOpePhotoRequest'
})
export default class BatchOpePhotoRequest extends Vue {
  @Emit() ClearModal(Res: boolean): void {
    this.Remark = "";
    this.$set(this,'IsShowModal', false)
  }

  private TriggerModal(SelectedData: Interface.PhotoRequestList[], Type: number){
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
				Address: this.$Api.PhotoRequestChangeStatus,
				Login: true
			},
			Data: {Id: this.CurrSeleData.map(Item=>Item.Id), Remark: this.Remark, Status: this.Type, Operator: 0},
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${this.Type === 1?'需求退回修改' : this.Type === 2 ? '图片退回修改': this.Type === 4 ? '审核通过': ""}成功`);
          this.ClearModal(true)
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
