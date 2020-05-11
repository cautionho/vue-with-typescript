<!-- 退回修改 -->
<template>
  <Row  class="P-Inline-Block">
    <Button class="P-MR-10" type="primary" @click="HandleToReview(false, 'ReturnEdit')">退回修改</Button>
    <Modal v-model="ModifyModal" title="退回修改" :mask-closable="false" @on-cancel="ClearModal(0)">
      <Form :model="ChangeStatusData" :label-width="100" ref="ChangeStatusData" onsubmit="return false">
        <Form-item label="备注：" prop="Remark">
          <Input v-model="ChangeStatusData.Remark" type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="请输入备注" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostToReview()">提交</Button>
        <Button @click="ClearModal(0)">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'ProductDevBackModify'
  })
  export default class ProductDevBackModify extends Vue {

    @Emit() HandleResMsg(IsSub: boolean, TypeString: string): void {} // 回调
    
     // 打开模态框 检测类型
    private Trigger(SelectedData: Interface.ProductDevList[]):void {

      if (SelectedData.length === 0) {
        this.$UI.Tips.Floating('warning', `请选择状态为待审核的新品申请进行审核操作`);
        return;
      }

      this.ChangeStatusData.Id = [];
      for (let Item in SelectedData) {
        this.ChangeStatusData.Id.push(SelectedData[Item].Id)
        if (SelectedData[Item].Status !== 2) {
          this.$UI.Tips.Floating('warning', `请选择状态为待审核的新品申请进行审核操作`);
          return;
        }
      }

      this.ChangeStatusData.ReviewType = 3;
      this.$set(this, 'ModifyModal', true);
    }

    // 校验 审核
    private HandleToReview(IsSub: boolean, TypeString: string): void{
      this.HandleResMsg(IsSub, TypeString)
    }

    // 发送请求 
    private PostToReview(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.ProductProReview,
          Login: true
        },
        Data: this.ChangeStatusData,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating('success', `退回修改成功`);
            this.ClearModal(1)
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifyModal', false);
      this.HandleToReview( Val === 1 , '');
      this.ChangeStatusData = new Interface.ChangeStatusData()
    }

    private ModifyModal: boolean = false // 当前模态框

    private BatchEditTitle: string = '' // 模态框标题
    private ChangeStatusData: Interface.ChangeStatusData = new Interface.ChangeStatusData() //状态改变提交信息

  }
</script>
<style lang="less" scoped>
</style>
