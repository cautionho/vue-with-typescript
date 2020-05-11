<template>
  <Col class="P-Inline-Block" >
    <Button type="primary" @click="TriggerOperate">提交审核</Button>
  </Col>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'AfterSalesPostReview'
})

export default class AfterSalesPostReview extends Vue {
  @Emit() TriggerOperate(): void {}
  @Emit() EmitOperateSuccess(): void {}

  private Trigger(D: Interface.AfterSalesList[]): void {
    if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择售后单进行操作');
    }else{
      if(D.some(Item => Item.Status !== 1)){
        this.$UI.Tips.Floating('warning', '请选择状态为新建的售后单进行操作');
        return;
      }else {
        this.$UI.Tips.Modal({
          Type: 'confirm',
          Content: '是否执行提交审核操作',
          Enter: false,
          Callback: (B: boolean) => {
            if(B){
              this.PostReview(D);
            }
          }
        })
      }
    }
  }

  private PostReview(D: Interface.AfterSalesList[]): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleSubmitAudit,
        Login: true
      },
      Data: {Id: D.map(Item => Item.AfterSalerId)},
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '提交审核成功');
          this.EmitOperateSuccess();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }
}
</script>