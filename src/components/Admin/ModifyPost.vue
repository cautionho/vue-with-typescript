<template>
  <div class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="OpenModal({Type:0})">添加职位</Button>
      <Modal v-model="IsShowModal" :title="['添加职位', '编辑职位'][ModalType]" @on-cancel="ClearModal(false)" :mask-closable="false" :width="800">
        <Form ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110">
          <Form-item label="职位名称" prop="Name">
            <Input ref="Name_Ipt" v-model="OperateForm.Name" placeholder="职位名称" name="wareNameInput"></Input>
          </Form-item>
          <Form-item label="角色" prop="RoleId">
            <Select v-model="OperateForm.RoleId" placeholder="角色(可多选)" multiple :options="PropDropPosition" />
            <!-- <Select v-model="OperateForm.RoleId" placeholder="角色(可多选)" filterable clearable multiple>
              <Option v-for="(Item,index) in PropDropPosition" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="待办事项" prop="ToDoId">
            <F-SelectGroup v-model="OperateForm.ToDoId" placeholder="待办事项(可多选)" :options="PropDropCategoryTree" optionTitleKey="CategoryName" optionChildKey="ChildNods" optionValKey="Id" optionKey="ItemName" :multiple="true" />
            <!-- <Select v-model="OperateForm.ToDoId" multiple filterable clearable placeholder="待办事项(可多选)">
              <OptionGroup v-for="(Item,index) in PropDropCategoryTree" :label="Item.CategoryName" :key="Item.CategoryName">
                <Option v-for="(val,idx) in Item.ChildNods" :value="val.Id" :key="val.Id">{{ val.ItemName }}</Option>
              </OptionGroup>
            </Select> -->
          </Form-item>
          <Form-item label="备注">
            <Input ref="OperateFormRemark" v-model="OperateForm.Remark" :autosize="{minRows:4,maxRows:4}" type="textarea" placeholder="备注"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="CurSubModal">提交</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "../../assets/Interface/Public";
  import Interface from "../../assets/Interface/Admin";

  @Component({
    name: "ModifyPost"
  })
  export default class ModifyPost extends Vue {
    @Prop() PropDropPosition: PInterface.KV[];
    @Prop() PropDropCategoryTree: Interface.PositionToDoTree[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private OpenModal({Type,Selected}:{Type:number,Selected:Interface.PositionTableList}): void {
      this.ModalType = Type;
      this.$nextTick(() => {
        if (Selected) {
          this.$set(this, "OperateForm", Selected);
        }
        this.IsShowModal = true;
        this.$nextTick(() => {
          (this.$refs["Name_Ipt"] as any).focus();
        });
      })
    }

    private ClearModal(bool: boolean): void {
      this.$set(this, "OperateForm", new Interface.PositionTableList());
      (this.$refs["OperateForm"] as any).resetFields();
      this.IsShowModal = false;
      this.EmitChange(bool);
    }

    private CurSubModal(): void {
      (this as any).$refs["OperateForm"].validate((valid: boolean): void => {
        if (valid) {
          let SelectedPosition = this.PropDropPosition.filter((Item: PInterface.KV): boolean => (this.OperateForm.RoleId as any).includes(Item.Value));
          this.$set(this.OperateForm, "RoleId", SelectedPosition.map((Item) => Item.Value));
          this.$set(this.OperateForm, "RoleName", SelectedPosition.map((Item) => Item.Key).join(","));
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: [this.$Api.PositionCreate, this.$Api.PositionModify][this.ModalType],
              Login: true
            },
            Data: this.OperateForm,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating("success", ["添加岗位成功","编辑岗位成功"][this.ModalType]);
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

    private IsShowModal: boolean = false;// 当前模态框
    private OperateForm: Interface.PositionTableList = new Interface.PositionTableList(); // 表格数据
    private ModalType: number = 0;
    private OperateFormRule: any = {
      Name: [{required: true, message: "请输入职位名称"}],
      RoleId: [{required: true, type: "array", min: 1, message: "请选择角色", trigger: "change"}],
      ToDoId: [{required: true, type: "array", min: 1, message: "请选择绑定待办事项", trigger: "change"}]
    }
  }


</script>