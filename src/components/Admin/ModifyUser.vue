<!-- 用户添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyUserModal">添加用户</Button>
      <Modal v-model="ModifyUserModal" :title="OperateForm.Id === 0 ? '添加用户' : '编辑用户' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" onsubmit="return false" :label-width="110" >
          <Form-item label="用户名称" prop="UserName">
            <Input ref="OperateFormName" v-model="OperateForm.UserName" placeholder="用户名称" />
          </Form-item>
          <Form-item label="性别" prop="Sex" class="ivu-form-item-required">
            <RadioGroup v-model="OperateForm.Sex">
              <Radio :label="1">男</Radio>
              <Radio :label="2">女</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="邮箱" prop="Email">
            <Input v-model="OperateForm.Email" placeholder="邮箱" />
          </Form-item>
          <Form-item label="联系电话" prop="TelePhone">
            <Input v-model="OperateForm.TelePhone" placeholder="联系电话" />
          </Form-item>
          <Form-item label="入职时间" prop="CreateTime">
            <DatePicker v-model="OperateForm.CreateTime" type="date" placeholder="入职日期" class="P-W-100-Percent"></DatePicker>
          </Form-item>
          <Form-item label="岗位" prop="PositionId">
            <Select v-model="OperateForm.PositionId" placeholder="岗位" :options="DropPositionList" />
          </Form-item>
          <Form-item label="组织" prop="OrganizationId">
            <Cascader :data="TreeOrganization" v-model="ModifyOrganizationId" @on-change="GetOrganization" name="OrganizationId" filterable change-on-select placeholder="组织" ></Cascader>
          </Form-item>
          <Form-item label="仓库" prop="WarehouseId">
            <Select v-model="OperateForm.WarehouseId" placeholder="仓库" :options="DropWarehouseList" />

          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '../../assets/Interface/Public';
  import Interface from "../../assets/Interface/Admin";
  @Component({
    name: 'ModifyUser'
  })
  export default class Position_ModifyOrAddPost extends Vue {
    @Prop() TreeOrganization: Interface.OrganizationTree[];  // 组织 - 树

    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    private Trigger({
      SelectedData,
      DropWarehouseList,
      DropPositionList,
      CurOrganizationId
    }: {
      SelectedData: Interface.Organization[],   // 被选中的数据
      DropWarehouseList: PInterface.KV[],  // 仓库下拉
      DropPositionList: PInterface.KV[],   // 岗位下拉
      CurOrganizationId: string[], // 选中的组织数组
    }):void {



        this.$set(this, 'OperateForm',SelectedData.length > 0 ? SelectedData[0] : new Interface.Organization());
        this.$set(this,'ModifyOrganizationId', JSON.parse(JSON.stringify(this.CurOrganizationId)))

        this.DropWarehouseList.splice(0, this.DropWarehouseList.length, ...DropWarehouseList)
        this.DropPositionList.splice(0, this.DropPositionList.length, ...DropPositionList)
        this.CurOrganizationId.splice(0, this.CurOrganizationId.length, ...CurOrganizationId)
        
        // 点击 编辑用户 时
        if ( SelectedData.length > 0 ) {
          this.ModifyOrganizationId.unshift( this.OperateForm.OrganizationId.toString() )
          this.FindParentIds( this.TreeOrganization, Number(this.OperateForm.OrganizationId) )
          this.$set(this.OperateForm, 'OrganizationId', JSON.parse(JSON.stringify(this.ModifyOrganizationId)))
        }

        this.$set(this,'ModifyUserModal', true);
        
        this.$nextTick(function() {
          (this.$refs["OperateFormName"] as any).focus();
        })
    }

    // 组合 组织 数组
    private FindParentIds(Tree: Interface.OrganizationTree[], NodeId: number): void {
      for (let item in Tree) {
        if (Tree[item].Id == NodeId) {
          if (Tree[item].ParentId != 0) {
            this.ModifyOrganizationId.unshift( Tree[item].ParentId.toString() );
            this.FindParentIds( this.TreeOrganization , Tree[item].ParentId)
          }
        } else {
          this.FindParentIds(Tree[item].ChildNodes, NodeId)
        }
      }
    }

    //回调打开添加模态框
    private OpenModifyUserModal():void {
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifyUserModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {
          // 组织取值最后一位
          let PostData:any = JSON.parse(JSON.stringify(this.OperateForm));
          PostData.CreateTime = this.$UI.Render.NewDate( PostData.CreateTime, true);
          PostData.OrganizationId = this.ModifyOrganizationId[this.ModifyOrganizationId.length - 1];

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: this.OperateForm.Id === 0 ? this.$Api.UserCreate : this.$Api.UserModify,
              Login: true
            },
            Data: PostData,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', this.OperateForm.Id === 0 ? '添加用户成功' : '编辑用户成功');
                this.ClearModal( 1 );
              } else {
                this.$UI.Loading.Hide();
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    // 格式化 组织
    private GetOrganization<T>(Data: T): void{
      this.$set(this.OperateForm, 'OrganizationId', Data);
    }

    private DropWarehouseList: PInterface.KV[] = []  // 仓库下拉
    private DropPositionList: PInterface.KV[] = []   // 岗位下拉
    // private TreeOrganization: Interface.OrganizationTree[] = []  // 组织 - 树
    private CurOrganizationId: string[] = []// 选中的组织数组

    private ModifyOrganizationId: string[] = []; // 组织数组
    private ModifyUserModal: boolean = false; // 当前模态框
    private OperateForm: Interface.Organization = new Interface.Organization();  // 表格数据
    private OperateFormRule: any = {
      UserName: [{required: true, message: '请输入用户名称' }],
      Email: [{ required: true, message: '请输入邮箱' },
              { pattern: this.$Pattern.Email, message: '请输入正确的邮箱' }],
      TelePhone: [{required: true, message: '请输入联系电话' },
                  { pattern: this.$Pattern.Mobile, message: '请输入11位有效移动电话号码' }],
      CreateTime: [{required: true, message: '请选择入职时间', trigger: 'blur', type: "date"}],
      PositionId: [{required: true, type: "number", message: '请选择岗位', trigger: 'change'}],
      OrganizationId: [{required: true, message: '请选择组织', trigger: 'change', type: "array" }],
      WarehouseId: [{required: true, type: "number", message: '请选择仓库', trigger: 'change'}]
    }
  }


</script>