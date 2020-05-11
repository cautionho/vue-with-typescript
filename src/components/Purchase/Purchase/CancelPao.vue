<!-- 作废到货单 -->
<template>
  <Row class="P-Inline-Block P-MR-10">
    <Button type="primary" @click="HandleResMsg(2)">作废到货单</Button>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Purchase";
  @Component({
    name: 'CancelPao'
  })
  export default class CancelPao extends Vue {
    @Emit() HandleResMsg(Type:number): void {} // 回调

    // 打开模态框
    private Trigger(SelectedData: Interface.Pao[]): void {
      this.SelectedData.splice(0, this.SelectedData.length, ...SelectedData);
      this.HandleToCancel()
    }
    
    // 校验 审核
    private HandleToCancel(): void{
      if (this.SelectedData.length < 1) {
        this.$UI.Tips.Floating('warning', `请选择到货单进行作废操作`);
        return;
      }
      let ToCancelId: number[] = [];
      for (let item in this.SelectedData) {
        if (this.SelectedData[item].Status === 5 || this.SelectedData[item].ExceptStatus === 1) {
          this.$UI.Tips.Floating('warning', `请选择状态为待签收、待质检、部分入库状态且无异常需要处理的到货单进行操作`);
          this.HandleResMsg(0)
          return;
        } else {
          ToCancelId.push(this.SelectedData[item].Id)
        }
      }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: `是否确认执行作废到货单操作`,
        Callback: (Res: boolean):void => {
          if (Res) {
            this.PostToCancel(ToCancelId);
          } else {
            this.HandleResMsg(0)
          }
        }
      });
    }

    // 发送请求 
    private PostToCancel(PostData: number[]): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseArrivalOrderCancel,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', `作废到货单成功`);
            this.HandleResMsg(1)
          } else {
            this.$UI.Loading.Hide();
            this.$Request.Error(res);
          }
        }
      })
    }

    private SelectedData: Interface.Pao[] = [];   //选中数据

  }
</script>
<style lang="less" scoped>
</style>
