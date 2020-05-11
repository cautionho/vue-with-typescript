<!-- 添加  编辑 -->
<template>
  <Row class="P-Inline-Block P-MR-10">
    <Button type="primary" @click="HandleToReview()">提交审核</Button>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'ProductDevToReview'
  })
  export default class ProductDevToReview extends Vue {
    @Prop() SelectedData: Interface.ProductDevList[];   //选中数据

    @Emit() HandleResMsg(Type:number): void {} // 回调

    // 校验 审核
    private HandleToReview(): void{
      if (this.SelectedData.length < 1) {
        this.$UI.Tips.Floating('warning', `请选择新品申请进行操作`);
        return;
      }
      let ToExamineId: number[] = [];
      for (let item in this.SelectedData) {
        if (this.SelectedData[item].Status != 1) {
          this.$UI.Tips.Floating('warning', `请选择状态为新建的新品申请进行操作`);
          this.HandleResMsg(0)
          return;
        } else {
          ToExamineId.push(this.SelectedData[item].Id)
        }
      }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: `是否执行提交审核新品申请操作`,
        Callback: (Res: boolean):void => {
          if (Res) {
            this.PostToReview(ToExamineId);
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
          Address: this.$Api.ProductToReview,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', `提审新品申请成功`);
            this.HandleResMsg(1)
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

  }
</script>
<style lang="less" scoped>
</style>
