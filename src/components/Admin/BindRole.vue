<template>
  <div class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="OpenModal">绑定角色</Button>
      <Modal v-model="IsShowModal" title="绑定角色" @on-cancel="ClearModal(false)">
        <Form :model="OperateForm" ref="OperateForm" :rules="OperateFormRules" :label-width="80" onsubmit="return false">
          <Form-item label="角色：" prop="RoleId">
            <Select v-model="OperateForm.RoleId" placeholder="请选择角色" :options="PropDropPosition" />
            <!-- <Select v-model="OperateForm.RoleId" placeholder="请选择角色" clearable filterable label-in-value>
              <Option v-for="(Item,Index) in PropDropPosition" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
            </Select> -->
          </Form-item>
        </Form>
        <footer slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "../../assets/Interface/Public";
  import Interface from "../../assets/Interface/Admin";

  @Component({
    name: "BindRole"
  })
  export default class BindRole extends Vue {
    @Prop() PropIsShowBindRole: boolean;
    @Prop() PropDropPosition: PInterface.KV[];
    @Prop() PropSelected: Interface.PositionTableList[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private OpenModal(): void {
      this.$nextTick(() => {
        if (this.PropSelected.length == 0) {
          this.$UI.Tips.Floating("warning", "请选择岗位进行操作");
          return;
        }
        this.IsShowModal = true;
      })
    }

    private SubModal(): void {
      (this as any).$refs["OperateForm"].validate((valid: boolean): void => {
        if (valid) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: this.$Api.PositionSetRole,
              Login: true
            },
            Data: {
              Id: this.PropSelected.map((Item): number => Item.Id),
              RoleId: this.OperateForm.RoleId
            },
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating("success", "绑定角色成功");
                this.ClearModal(true);
              } else {
                this.$UI.Loading.Hide();
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    private ClearModal(Bool: boolean): void {
      this.IsShowModal = false;
      this.$set(this, "OperateForm", new Interface.PositionRoleId());
      (this.$refs["OperateForm"] as any).resetFields();
      if (Bool) {
        this.EmitChange(Bool);
      }
    }

    private OperateForm: Interface.PositionRoleId = new Interface.PositionRoleId();
    private IsShowModal: boolean = false;
    private OperateFormRules: any = {
      RoleId: [{required: true, message: "请选择绑定的角色", trigger: "change", type: "number"}]
    }
  }
</script>

<style scoped>

</style>