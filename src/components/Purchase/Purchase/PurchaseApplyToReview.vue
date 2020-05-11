<!-- 添加  编辑 -->
<template>
  <Row class="P-Inline-Block P-MR-10">
    <Button type="primary" @click="HandleToReview()">提交审核</Button>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Purchase";
  @Component({
    name: 'PurchaseApplyToReview'
  })
  export default class PurchaseApplyToReview extends Vue {
    @Prop() SelectedData: Interface.PurchaseApply[];   //选中数据

    @Emit() HandleResMsg(Type:number): void {} // 回调

    // 校验 审核
    private HandleToReview(): void{
      if (this.SelectedData.length < 1) {
        this.$UI.Tips.Floating('warning', `请选择采购申请进行操作`);
        return;
      }
      let ToExamineId: number[] = [];
      for (let item in this.SelectedData) {
        if (this.SelectedData[item].ApplySummary.Status != 1) {
          this.$UI.Tips.Floating('warning', `请选择状态为新建的采购申请进行操作`);
          this.HandleResMsg(0)
          return;
        } else {
          ToExamineId.push(this.SelectedData[item].ApplySummary.Id)
        }
      }

      const PostData:object = {
        "Id": ToExamineId,
        "Status": 2,
        "Remark": ''
      }
      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: `是否确认执行提交审核操作`,
        Callback: (Res: boolean):void => {
          if (Res) {
            this.PostToReview(PostData);
          } else {
            this.HandleResMsg(0)
          }
        }
      });
    }

    // 发送请求 
    private PostToReview(PostData: object): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseApplyChangeStatus,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', `提交审核成功`);
            this.HandleResMsg(1)
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

  }
</script>
<style lang="less" scoped>
</style>
