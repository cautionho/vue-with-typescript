<!-- 编辑买家黑名单 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button v-if="PropShowCreateBtn" @click="OpenCurModal" type="primary">添加黑名单</Button>
      <Modal v-model="CurIsShowModal" :title="CurIsModify ? '编辑黑名单' : '添加黑名单' " @on-cancel="ClearModal(false)" :mask-closable="false" :width="800">
        <Form ref="OperateForm" :model="CurOperateForm" :rules="CurOperateFormRule" name="CurOperateForm" onsubmit="return false" :label-width="110">
          <Form-item label="平台：" prop="Platform">
            <Select placeholder="请选择平台" v-model="CurOperateForm.Platform" :options="PlatformDrop" />
            <!-- <Select placeholder="请选择平台" v-model="CurOperateForm.Platform" clearable filterable>
              <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{Item}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="买家ID：" prop="BuyerUserId">
            <Input v-model="CurOperateForm.BuyerUserId" placeholder="请输入买家ID"/>
          </Form-item>
          <Form-item label="电话号码：" prop="BuyerPhone">
            <Input v-model="CurOperateForm.BuyerPhone" placeholder="请输入电话号码"/>
          </Form-item>
          <Form-item label="邮箱：" prop="BuyerEmail">
            <Input v-model="CurOperateForm.BuyerEmail" placeholder="请输入邮箱"/>
          </Form-item>
          <Form-item label="备注：" prop="Remark">
            <Input v-model="CurOperateForm.Remark" type="textarea" placeholder="请输入备注"/>
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
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "../../../assets/Interface/Public";
  import Interface from "../../../assets/Interface/Warehouse";

  @Component({
    name: "ModifyBlackList"
  })
  export default class ModifyBlackList extends Vue {
    @Prop() PropShowCreateBtn: boolean;

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    // 打开模态框
    private Trigger({IsShowModal, SelectedDetail}: {
      IsShowModal: boolean,
      SelectedDetail?: Interface.BlacklistTable
    }): void {
      this.CurIsShowModal = IsShowModal;
      this.CurIsModify = Boolean(SelectedDetail);
      this.$set(this, "CurOperateForm", SelectedDetail || new Interface.BlacklistTable());
    }

    private OpenCurModal(): void {
      this.Trigger({IsShowModal: true})
    }

    private SubModal(): void {
      (this as any).$refs["OperateForm"].validate((Bool: boolean): void => {
        if (Bool) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Settings,
            Api: {
              Address: this.CurIsModify ? this.$Api.BlackListModify : this.$Api.BlackListCreate,
              Login: true
            },
            Data: this.CurOperateForm,
            Callback: (res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (res.IsSuccess) {
                this.$UI.Tips.Floating("success", this.CurIsModify ? "编辑黑名单成功" : "添加黑名单成功");
                this.ClearModal(true);
              } else {
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    private ClearModal(Res?: boolean): void {
      this.CurIsShowModal = false;
      (this.$refs["OperateForm"] as any).resetFields();

      Res ? this.EmitChange(Res) : "";
    }

    private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);

    private CurIsModify: boolean = false;
    private CurIsShowModal: boolean = false;
    private CurOperateForm: Interface.BlacklistTable = new Interface.BlacklistTable();
    private CurOperateFormRule: any = {
      Platform: [{required: true, message: "请选择平台", trigger: "change", type: "number"}],
      BuyerUserId: [{required: true, message: "请输入买家ID", trigger: "blur"}],
      BuyerEmail: [{
        pattern: /^[0-9A-Za-z][\.0-9A-Za-z_-]+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
        message: "请输入正确的邮箱格式",
        trigger: "change"
      }
      ],
    }
  }
</script>