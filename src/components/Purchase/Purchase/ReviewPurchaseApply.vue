<!-- 退回修改  通过 不通过-->
<template>
  <Row  class="P-Inline-Block">
    <Button class="P-MR-10" type="primary" @click="HandleToReview(false, 'ReturnEdit')">退回修改</Button>
    <Button class="P-MR-10" type="primary" @click="HandleToReview(false, 'SuccessEdit')">通过</Button>
    <Button class="P-MR-10" type="error" @click="HandleToReview(false, 'ErrorEdit')">不通过</Button>
    <Modal v-model="ModifyModal" :title="BatchEditTitle" :mask-closable="false" @on-cancel="ClearModal(0)">
      <Form :model="ChangeStatusData" :label-width="60" ref="ChangeStatusData" onsubmit="return false">
        <Form-item label="备注：" prop="Remark">
          <Input v-model="ChangeStatusData.Remark" ref="OperateInput" type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="请输入备注" />
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
  import Interface from "@/assets/Interface/Purchase";
  @Component({
    name: 'PurchaseApplyToReview'
  })
  export default class PurchaseApplyToReview extends Vue {
    @Prop() SelectedData: Interface.PurchaseApply[];   //选中数据
    @Prop() TypeEdit: string; // 类型

    @Emit() HandleResMsg(IsSub: boolean, TypeString: string): void {} // 回调
    
     // 打开模态框 检测类型
    @Watch('TypeEdit')
    private IsShowModal(TypeEdit: string):void {

      if (TypeEdit == '') {
        return;
      }

      switch (TypeEdit) {
        case 'SuccessEdit':
          this.BatchEditTitle = '审核通过';
          this.ChangeStatusData.Status = 3;
          break;
        case 'ErrorEdit':
          this.BatchEditTitle = '审核不通过';
          this.ChangeStatusData.Status = 4;
          break;
        case 'ReturnEdit':
          this.BatchEditTitle = '退回修改';
          this.ChangeStatusData.Status = 1;
          break;
      }
      if (this.SelectedData.length === 0) {
        this.$UI.Tips.Floating('warning', `请选择采购申请进行操作`);
        this.HandleToReview(false, '');
        return;
      }

      this.ChangeStatusData.Id = [];
      for (let item in this.SelectedData) {

        this.ChangeStatusData.Id.push(this.SelectedData[item].ApplySummary.Id)

        if (this.SelectedData[item].ApplySummary.Status !== 2) {
          this.$UI.Tips.Floating('warning', `请选择状态为待审核的采购申请进行审核操作`);
          this.HandleToReview(false, '');
          return;
        }
        if ( Number(item) >= this.SelectedData.length - 1) {
          this.$set(this, 'ModifyModal', true);
          this.$nextTick(()=>{
            (this.$refs['OperateInput'] as Vue).focus();
          })
        }
      }
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
          Address: this.$Api.PurchaseApplyChangeStatus,
          Login: true
        },
        Data: this.ChangeStatusData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            if (this.ChangeStatusData.Status == 3) {
              this.$UI.Tips.Floating('success', `审核通过成功`);
            } else if (this.ChangeStatusData.Status == 4) {
              this.$UI.Tips.Floating('success', `审核不通过成功`);
            } else if (this.ChangeStatusData.Status == 1) {
              this.$UI.Tips.Floating('success', `退回修改成功`);
            }
            this.ClearModal(1)
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
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
