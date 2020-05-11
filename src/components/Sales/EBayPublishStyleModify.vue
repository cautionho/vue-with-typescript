<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" @click="OpenModal({Type:0})" class="P-MR-10">添加风格</Button>
      <Modal v-model="IsShowModal" :title="['添加风格','编辑风格'][ModalType]" @on-cancel="ClearModal(false)" :mask-closable="false" :width="1200">
        <Form ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110">
          <Form-item label="风格标题：" prop="Title">
            <Input v-model.trim="OperateForm.Title" ref="Title_Ipt" placeholder="请输入风格标题"></Input>
          </Form-item>
          <Form-item label="添加数据字段：">
            <Select v-model="DataField" :options="DropDataField" placeholder="请选择数据字段"/>
          </Form-item>
          <Form-item label="风格详情：" required>
            <Editor ref="Editor" :DomHeight="400"></Editor>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">{{['添加','修改'][ModalType]}}</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Sales"

  @Component({
    name: "EBayPublishStyleModify",
    components: {
      Editor: () => import("@/components/Public/Jodit.vue"),
    }
  })
  export default class EBayPublishStyleModify extends Vue {
    @Watch("DataField")
    private WatchDataField(Val: string): void {
      if (Val) {
        (this.$refs["Editor"] as any).InsertCtn(Val);
      }
    }

    @Emit() EmitChange(Res: boolean): void {
    }

    private OpenModal({Type, Detail}: { Type: number, Detail: Interface.EBayStyleTable }) {
      this.ModalType = Type;
      this.DataField = "";
      if (this.ModalType === 1) {
        this.$set(this, "OperateForm", new Interface.EBayStyleTable(Detail.Id, Detail.Title, Detail.Description, Detail.IsEnable));
        (this.$refs["Editor"] as any).SetContent(this.OperateForm.Description);
      } else {
        (this.$refs["Editor"] as any).SetContent("");
        this.$set(this, "OperateForm", new Interface.EBayStyleTable());
        (this.$refs["OperateForm"] as any).resetFields();
      }
      this.IsShowModal = true;
      this.$nextTick(() => {
        (this.$refs["Title_Ipt"] as any).focus();
      })
    }

    private ClearModal(Bool: boolean): void {
      this.IsShowModal = false;
      this.EmitChange(Bool);
    }

    private SubModal(): void {
      (this.$refs["OperateForm"] as any).validate((Bool: boolean) => {
        if (Bool) {
          if ((this.$refs["Editor"] as any).GetContent() == "") {
            this.$UI.Tips.Floating("warning", `请输入风格详情`);
            return;
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Sales,
            Api: {
              Address: this.$Api[["CreateEBayTempDescription", "UpdateEBayTempDescription"][this.ModalType]],
              Login: true
            },
            Data: {
              Id: this.OperateForm.Id,
              Title: this.OperateForm.Title,
              IsEnable: this.OperateForm.IsEnable,
              Description: (this.$refs["Editor"] as any).GetContent()
            },
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating("warning", ["添加风格成功", "修改风格成功"][this.ModalType]);
                this.ClearModal(true);
              } else {
                this.$Request.Error(Res);
              }
              this.$UI.Loading.Hide();
            }
          })
        }
      });

    }

    private IsShowModal: boolean = false;
    private ModalType: number = 0;
    private DataField: string = "";
    private DropDataField: PInterface.KV[] = [
      {Key: "[DESCRIPTION_AND_IMAGES]", Value: "[DESCRIPTION_AND_IMAGES]"},
      {Key: "[IMG1]", Value: "[IMG1]"},
      {Key: "[IMG2]", Value: "[IMG2]"},
      {Key: "[IMG3]", Value: "[IMG3]"},
      {Key: "[IMG4]", Value: "[IMG4]"},
      {Key: "[IMG5]", Value: "[IMG5]"},
      {Key: "[IMG6]", Value: "[IMG6]"},
      {Key: "[IMG7]", Value: "[IMG7]"},
      {Key: "[IMG8]", Value: "[IMG8]"},
      {Key: "[IMG9]", Value: "[IMG9]"},
      {Key: "[IMG10]", Value: "[IMG10]"},
      {Key: "[IMG11]", Value: "[IMG11]"},
      {Key: "[IMG12]", Value: "[IMG12]"}
    ]
    private OperateForm: Interface.EBayStyleTable = new Interface.EBayStyleTable();
    private OperateFormRule: any = {
      Title: [{required: true, message: "请输入风格标题"}]
    }
  }

</script>
<style lang="less"></style>
