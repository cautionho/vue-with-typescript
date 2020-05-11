<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button class="P-MR-10" type="primary" @click="OpenModal">退回费用</Button>
      <Modal v-model="IsShowModal" title="退回费用" @on-cancel="ClearModal(false)" :mask-closable="false" :width="500">
        <Form onsubmit="return false" :label-width="80">
          <Form-item label="备注：" required>
            <Input v-model.trim="Remark" ref="Remark_Ipt" type="textarea" :autosize="{maxRows:4,minRows:4}" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Logistics"

  @Component({
    name: "TransactionRecordReturn"
  })
  export default class TransactionRecordReturn extends Vue {
    @Prop() PropSelected: Interface.TransactionRecordTable[];

    @Emit() EmitChange(Res: boolean): void {
    }

    private OpenModal() {
      if (this.PropSelected.length === 0 || this.PropSelected.some((Item) => Item.TransactionType !== 1)) {
        this.$UI.Tips.Floating("warning", "请选择类型为扣费的交易记录进行操作");
        return;
      }
      this.IsShowModal = true;
      this.$nextTick(() => {
        (this.$refs["Remark_Ipt"] as any).focus();
      })
    }

    private ClearModal(Bool: boolean): void {
      this.IsShowModal = false;
      this.Remark = "";
      this.EmitChange(Bool);
    }

    private SubModal(): void {
      if (this.Remark === "") {
        this.$UI.Tips.Floating("warning", "请输入备注");
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.TransactionRefund,
          Login: true
        },
        Data: {
          RecordId: this.PropSelected.map((Item) => Item.Id),
          Remark: this.Remark
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating("success", "退回费用成功");
            this.ClearModal(true);
          } else {
            this.$Request.Error(Res);
          }
        }
      });
    }

    private IsShowModal: boolean = false
    private Remark: string = "";
  }

</script>
<style lang="less"></style>
