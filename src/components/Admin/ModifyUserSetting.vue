<!-- 设置用户组件 -->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MR-10" type="primary" v-if="Powers.UserSetOrg" @click="OpenSettingModal(1)">设置组织</Button>
      <Button class="P-MR-10" type="primary" v-if="Powers.UserSetWarehouse" @click="OpenSettingModal(2)">设置仓库</Button>
      <Button class="P-MR-10" type="primary" v-if="Powers.UserSetPosition" @click="OpenSettingModal(3)">设置岗位</Button>
      <Button class="P-MR-10" type="primary" v-if="Powers.UserSetStatus" @click="OpenSettingModal(4)">设置在职状态</Button>
      <Modal v-model="ModifySettingModal" :title="['','设置组织','设置仓库','设置岗位','设置在职状态'][OperateType]" @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" >
          <Form-item label="所属组织"  prop="OrganizationId" v-if="OperateType === 1">
            <Cascader :data="TreeOrganization" v-model="ModifyOrganizationId" @on-change="GetOrganization" filterable change-on-select placeholder="所属组织" ></Cascader>
          </Form-item>
          <Form-item label="仓库" prop="WarehouseId" v-if="OperateType === 2">
            <Select v-model="OperateForm.WarehouseId" placeholder="仓库" :options="DropWarehouseList" />
            <!-- <Select v-model="OperateForm.WarehouseId" placeholder="仓库" filterable clearable>
              <Option v-for="item in DropWarehouseList" :value="item.Value" :key="item.Value">{{item.Key}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="岗位" prop="PositionId"  v-if="OperateType === 3">
            <Select v-model="OperateForm.PositionId" placeholder="岗位" :options="DropPositionList" />
            <!-- <Select v-model="OperateForm.PositionId" name="PositionId" placeholder="岗位" filterable clearable>
              <Option v-for="item in DropPositionList" :value="item.Value" :key="item.Value">{{item.Key}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="在职状态" prop="Status"  v-if="OperateType === 4">
            <Select placeholder="在职状态" v-model="OperateForm.Status" :options="DropUserStatus" />
            <!-- <Select placeholder="在职状态" v-model="OperateForm.Status" filterable clearable>
              <Option v-for="(item, index) in DropUserStatus" :key="index" :value="$Enums.User.Status[item]">{{ item }}</Option>
            </Select> -->
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
    @Prop() Powers:  PInterface.Power[]; // 权限

    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    private Trigger({
      SelectedData,
      TreeOrganization,
      CurOrganizationId,
      DropWarehouseList,
      DropPositionList,
      DropUserStatus
    }: {
      SelectedData: Interface.Organization[];   // 被选中的数据
      TreeOrganization: Interface.OrganizationTree[];  // 组织 - 树
      CurOrganizationId: string[]; // 选中的组织数组
      DropWarehouseList: PInterface.KV[];  // 仓库下拉
      DropPositionList: PInterface.KV[];   // 岗位下拉
      DropUserStatus:  PInterface.KV[];    // 用户状态
    }):void {
      
      this.SelectedData.splice(0, this.SelectedData.length, ...SelectedData)
      this.TreeOrganization.splice(0, this.TreeOrganization.length, ...TreeOrganization)
      this.CurOrganizationId.splice(0, this.CurOrganizationId.length, ...CurOrganizationId)
      this.DropWarehouseList.splice(0, this.DropWarehouseList.length, ...DropWarehouseList)
      this.DropPositionList.splice(0, this.DropPositionList.length, ...DropPositionList)
      this.DropUserStatus.splice(0, this.DropUserStatus.length, ...DropUserStatus)

      if (this.SelectedData.length === 0 ) {
        this.$UI.Tips.Floating('warning', `请选择用户进行${['','设置组织','设置仓库','设置岗位','设置在职状态'][this.OperateType]}操作`);
      } else {
        this.$set(this,'ModifySettingModal', true);
      }
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

    // 回调打开添加模态框  1-设置组织 2-设置仓库 3-设置岗位 4-设置在职状态 
    private OpenSettingModal(Type: number): void {
      this.OperateType = Type;
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifySettingModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((Valid:boolean) => {
        if (Valid) {
          
          let Api: string = "";
          let Data: any = {
            Id: this.SelectedData.map( (item: Interface.Organization): number => item.Id )
          }
          let Tips: string = ['','设置组织','设置仓库','设置岗位','设置在职状态'][this.OperateType]
          
          switch (this.OperateType) {
            case 1: // 设置组织
              Api = this.$Api.UserSetOrganization;
              Data['OrganizationId'] = Number(this.ModifyOrganizationId[this.ModifyOrganizationId.length - 1])
              break;
            case 2: // 设置仓库
              Api = this.$Api.UserSetWarehouse;
              Data['WarehouseId'] = this.OperateForm.WarehouseId
              break;
            case 3: // 设置岗位
              Api = this.$Api.UserSetPosition;
              Data['PositionId'] = this.OperateForm.PositionId
              break;
            case 4: // 设置在职状态
              Api = this.$Api.UserChangeStatus;
              Data['Status'] = this.OperateForm.Status
              break;
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: Api,
              Login: true
            },
            Data: Data,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', `${Tips}成功`);
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

    private SelectedData: Interface.Organization[] = [];   // 被选中的数据
    private TreeOrganization: Interface.OrganizationTree[] = [];  // 组织 - 树
    private CurOrganizationId: string[] = []; // 选中的组织数组
    private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
    private DropPositionList: PInterface.KV[] = [];   // 岗位下拉
    private DropUserStatus:  PInterface.KV[] = [];    // 用户状态

    private OperateType: number = 0; // 操作类型
    private ModifyOrganizationId: string[] = []; // 组织数组
    private ModifySettingModal: boolean = false; // 当前模态框
    private OperateForm: Interface.ModifyUserSetting = new Interface.ModifyUserSetting();  // 表格数据
    private OperateFormRule: any = {
      OrganizationId: [{ required: true, message: '请选择所属组织', trigger: 'change', type: 'array' }],
      WarehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change', type: 'number' }],
      PositionId: [{ required: true, message: '请选择所属岗位', trigger: 'change', type: 'number' }],
      Status: [{ required: true, message: '请选择在职状态', trigger: 'change', type: 'number' }],
    }
  }


</script>