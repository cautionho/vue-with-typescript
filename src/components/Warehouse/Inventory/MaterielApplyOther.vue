<template>
  <!-- 物料申请 ==> 提交审核|作废|通过|不通过|退回修改-->
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-5" @click="OpenModal(1)">提交审核</Button>
    <Button type="primary" class="P-Inline-Block P-MR-5" @click="OpenModal(2)">通过</Button>
    <Button type="primary" class="P-Inline-Block P-MR-5" @click="OpenModal(3)">不通过</Button>
    <Button type="primary" class="P-Inline-Block P-MR-5" @click="OpenModal(4)">退回修改</Button>
    <Button type="primary" class="P-Inline-Block" @click="OpenModal(5)">作废</Button>
    <Modal v-model="ShowModal" :title="['','提交审核','审核通过','审核不通过','退回修改','作废物料申请'][ModalType]" :mask-closable="false" @on-cancel="CancelModal(false)">
      <Form onsubmit="return false">
        <FormItem>
          <Input v-model="Remark" ref="Remark_Ipt" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubModal" style="margin-left: 8px">{{['','提交审核', '通过', '不通过', '退回修改', '作废'][ModalType]}}</Button>
        <Button @click="CancelModal(false)" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </Row>

</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "MaterielApplyDetail"
  })
  export default class MaterielApplyDetail extends Vue {
    @Prop() PropSelected: Interface.MaterielApplyTable[]

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({ModalType}: { ModalType: number }) {
      this.ModalType = ModalType;
      this.ShowModal = true;
      this.$nextTick(() => {
        (this.$refs["Remark_Ipt"] as any).focus();
      });
    }

    private OpenModal(Type: number): void {
      if (this.PropSelected.length == 0) {
        this.$UI.Tips.Floating("warning", "请选择物料申请后进行操作");
        return;
      }
      if ((Type == 1 || Type == 5) && this.PropSelected.some((Item) => Item.Status != 1)) {
        this.$UI.Tips.Floating("warning", "请选择状态为新建的物料申请进行操作");
        return;
      }
      if ((Type == 2 || Type == 3 || Type == 4) && this.PropSelected.some((Item) => Item.Status != 2)) {
        this.$UI.Tips.Floating("warning", "请选择状态为待审核的物料申请进行操作");
        return;
      }
      this.$Trigger({ModalType: Type});
    }

    private SubModal(): void {
      let PostData = {
        Ids: this.PropSelected.map((Item) => Item.Id),
        Remark: this.Remark,
        IsPass: false,
      }
      if (this.ModalType == 2 || this.ModalType == 3) {
        PostData.IsPass = Boolean(this.ModalType == 2)
      } else {
        delete PostData.IsPass;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: ["", this.$Api.MaterialApplySubmitApply, this.$Api.MaterialApplyAudit, this.$Api.MaterialApplyAudit, this.$Api.MaterialApplyReturnModify, this.$Api.MaterialApplyCancel][this.ModalType],
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating("success", ["", "提交审核物料申请成功", "操作通过物料申请成功", "操作不通过物料申请成功", "操作退回修改物料申请成功", "作废物料申请成功"][this.ModalType]);
            this.CancelModal(true);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private CancelModal(Res: boolean): void {
      this.ShowModal = false;
      this.$set(this, "Remark", "");
      this.EmitChange(Res);
    }

    private Remark: string = "";

    private ShowModal: boolean = false;
    private ModalType: number = 0;
  }
</script>

<style scoped>

</style>