<template>
  <Col class="P-Inline-Block">
    <Button type="primary" @click="TriggerOperate(4)">通过</Button>
    <Button type="primary" class="P-ML-5" @click="TriggerOperate(5)">退回修改</Button>
    <Button type="error" class="P-ML-5" @click="TriggerOperate(6)">不通过</Button>
    <Modal :title="ModalTitle" v-model="ReviewModal" :width="600" @on-cancel="CancelModal">
      <Form :model="ReiviewForm" :label-width="0" onsubmit="return false;">
        <FormItem>
          <Input type="textarea" ref="RemarkIpt" :autosize="{minRows: 5,maxRows: 5}" v-model="ReiviewForm.Remark" placeholder="审核备注"></Input>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'AfterSalesReview'
})

export default class AfterSalesReview extends Vue {
  @Emit() TriggerOperate(T:number):void {}
  @Emit() EmitOperateSuccess(): void {}

  private Trigger(T:number, D: Interface.AfterSalesList[]): void {
    if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择售后单进行操作');
    }else {
      if(D.some(Item => Item.Status !== 2)){
        this.$UI.Tips.Floating('warning', '请选择状态为待审核的售后单进行操作');
      }else {
        if(T === 4){
          this.$set(this, 'ModalTitle', '审核通过');
          this.$set(this, 'ReviewApi', this.$Api.AfterSalePass)
        }else if(T === 5){
          this.$set(this, 'ModalTitle', '退回修改');
          this.$set(this, 'ReviewApi', this.$Api.AfterSaleReturnToModify)
        }else{
          this.$set(this, 'ModalTitle', '审核不通过');
          this.$set(this, 'ReviewApi', this.$Api.AfterSaleNoPass)
        }
        this.$set(this, 'ReviewModal', true);
        this.$set(this.ReiviewForm,'Id', D.map(Item => Item.AfterSalerId))
        this.$nextTick(()=>{
          (this as any).$refs.RemarkIpt.focus();
        })
      }
    }
  }

  private Validate(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.ReviewApi,
        Login: true,
      },
      Data: this.ReiviewForm,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '审核成功')
          this.EmitOperateSuccess()
          this.CancelModal();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'ReviewModal', false);
    this.$set(this, 'ModalTitle', '');
    this.$set(this, 'ReviewApi', '');
    this.$set(this, 'ReiviewForm', new Interface.ReviewAfterSales());
  }

  private ReviewModal: boolean = false
  private ModalTitle: string = ""
  private ReviewApi: string = ""
  private ReiviewForm: Interface.ReviewAfterSales = new Interface.ReviewAfterSales()
}
</script>