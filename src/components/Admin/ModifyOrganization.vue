<!-- 组织添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyOrgModal">添加组织</Button>
      <Modal v-model="ModifyOrgModal" :title="OperateForm.Id === 0 ? '添加组织' : '编辑组织' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" >
          <Form-item label="组织名称：" prop="Name">
            <Input ref="OperateFormName" v-model="OperateForm.Name" placeholder="组织名称" name="UserName" />
          </Form-item>
          <Form-item label="所属组织：">
            <Cascader v-if="ModifyOrgModal" :data="TreeOrganization" v-model="ModifyOrganizationId" @on-change="GetOrganization" name="OrganizationId" filterable change-on-select placeholder="所属组织" ></Cascader>
          </Form-item>
          <Form-item label="负责人：" >
            <Select v-model="OperateForm.PrincipalId" placeholder="负责人" :options="UserDropList" />
            <!-- <Select v-model="OperateForm.PrincipalId" name="PrincipalId" placeholder="负责人" filterable clearable>
              <Option v-for="item in UserDropList" :value="item.Value" :key="item.Value">{{item.Key}}</Option>
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
    name: 'ModifyOrganization'
  })
  export default class ModifyOrganization extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    private Trigger({
      SelectedData,
      TreeOrganization,
      CurOrganizationId,
      UserDropList
    }: {
      SelectedData: Interface.Organization,   // 被选中的数据
      TreeOrganization: Interface.OrganizationTree[],  // 组织 - 树
      CurOrganizationId: string[], // 选中的组织数组
      UserDropList: PInterface.KV[], // 负责人 下拉
    }):void {
        CurOrganizationId.pop()
        this.UserDropList.splice(0, this.UserDropList.length, ...JSON.parse(JSON.stringify(UserDropList)))
        this.TreeOrganization.splice(0, this.TreeOrganization.length, ...JSON.parse(JSON.stringify(TreeOrganization)))
        this.ModifyOrganizationId.splice(0)
        
        this.$set(this, 'OperateForm', SelectedData.Id > 0 ? SelectedData : new Interface.ModifyOrganization());

        // 点击 编辑组织 时
        if ( this.OperateForm.Id > 0 ) {
          this.FindParentIds( this.TreeOrganization, Number(this.OperateForm.Id) )
        } else {
          this.ModifyOrganizationId.push(...CurOrganizationId.map(Item=>Item.toString()));
        }

        this.UseApi = SelectedData.Id === 0 ? this.$Api.OrganizationCreate : this.$Api.OrganizationModify,

        this.$set(this,'ModifyOrgModal', true);
        
        this.$nextTick(function() {
          (this.$refs["OperateFormName"] as any).focus();
        })
    }

    // 组合 组织 数组
    private FindParentIds(Tree: Interface.OrganizationTree[], NodeId: number): void {
      for (let item in Tree) {
        if (Tree[item].Id == NodeId) {
          if (Tree[item].ParentId != 0) {
            this.ModifyOrganizationId.splice(0, 0,  Tree[item].ParentId.toString() );
            this.FindParentIds( this.TreeOrganization , Tree[item].ParentId)
          }
        } else {
          this.FindParentIds(Tree[item].ChildNodes, NodeId)
        }
      }
    }

    // 回调打开添加模态框
    private OpenModifyOrgModal():void {
      this.HandleResMsg(3);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifyOrgModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((Valid:boolean) => {
        if (Valid) {
          // 继续往父级取
          this.$set(this.OperateForm, 'ParentId', this.ModifyOrganizationId.length > 0 ? Number(this.ModifyOrganizationId[this.ModifyOrganizationId.length - 1]) : 0 );

          let PostData: any = JSON.parse(JSON.stringify(this.OperateForm))

          if (PostData.Id === PostData.ParentId) {
            this.$UI.Tips.Floating('warning', '请选择非自身组织');
            return;
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: this.UseApi,
              Login: true
            },
            Data: PostData,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', this.OperateForm.Id === 0 ? '添加组织成功' : '编辑组织成功');
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
      this.$set(this, 'ModifyOrganizationId', Data);
    }

    private TreeOrganization: Interface.OrganizationTree[] = [];  // 组织 - 树
    private UserDropList: PInterface.KV[] = []; // 负责人 下拉

    private UseApi: string = ""; // 目标Api

    private ModifyOrganizationId: string[] = []; // 组织数组
    // private OrganizationId: string[] = []; // 组织
    private ModifyOrgModal: boolean = false; // 当前模态框
    private OperateForm: Interface.Organization = new Interface.Organization();  // 表格数据
    private OperateFormRule: any = {
      Name: [{required: true, message: '请输入组织名称' }]
    }
  }


</script>