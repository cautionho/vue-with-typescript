<!-- 角色权限添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyRoleModal">添加角色</Button>
      <Modal v-model="ModifyRoleModal" :title="OperateForm.Id === 0 ? '添加角色' : '编辑角色' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Row class="Row-Tree">
          <Tree class="P-ML-20" ref="TargetTree" :data="TargetTree" show-checkbox @on-check-change="HandleSelectedRole"></Tree>
        </Row>
        <Row>
          <Col class="Row-Role" span="3">已选择权限
          </Col>
          <Col span="21" class="Row-Role-Selected">
            <Tooltip :content="SelectedRole()" maxWidth="600">
              <p class="P-LINE-3 P-Inline-Block">{{ SelectedRole() }}</p>
            </Tooltip>
          </Col>
        </Row>
        <Row class="P-MT-10">
          <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" >
            <Form-item label="角色名称：" prop="RoleName">
              <Input ref="OperateFormName" v-model="OperateForm.RoleName" placeholder="角色名称" name="RoleName" />
            </Form-item>
            <Form-item label="角色描述：" prop="Description">
              <Input v-model="OperateForm.Description" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="角色描述" name="Description" />
            </Form-item>
          </Form>
        </Row>
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
    name: 'ModifyRole'
  })
  export default class ModifyRole extends Vue {
    @Prop() SelectedData: Interface.Role[];   // 被选中的数据
    @Prop() ShowModal: boolean;     // 模态框

    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    @Watch('ShowModal')
    private IsShowModal(Bool: boolean):void {
      if( Bool ){
        this.$set(this, 'OperateForm', this.SelectedData.length > 0 ? this.SelectedData[0] : new Interface.Role());
        this.$set(this, 'TargetTree', JSON.parse(JSON.stringify(this.Tree)))
        this.$set(this, 'TargetTreeSelectedName', {})
        this.DefaultCheckedTree(this.TargetTree)

        this.$nextTick(function() {
          this.$set(this,'ModifyRoleModal', true);
          (this.$refs["OperateFormName"] as Vue).focus();
        })
      } 
    }

    // 初始化 获得资源菜单树
    private mounted() :void {
      this.GetTree()
    }
    
    // 计算属性 - 渲染已选权限
    private SelectedRole(): string {
      let ArrayString: string[] = [];
      for ( let Item in this.TargetTreeSelectedName ) {
        ArrayString.push( `【${Item}】${this.TargetTreeSelectedName[Item].join("，")}` )
      }
      return ArrayString.join("；");
    }

    // 获取 资源菜单树结构数据
    private GetTree(): void {
      this.$Request.Post({
        Server: this.$Server.Settings,
        Api: {
          Address: this.$Api.MenuTree,
          Login: true
        },
        Data: "",
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$set(this, 'Tree', Res.Data.Tree)
            this.IntegratedData(this.Tree)
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 勾选权限方法
    private HandleSelectedRole(): void {
      // 获取所有被勾选和半勾选的节点树
      const AllSelectedTree: Interface.RoleResources[] = (this.$refs['TargetTree'] as Vue).getCheckedAndIndeterminateNodes();

      this.OperateForm.ResourceId = AllSelectedTree.map( (Item: Interface.RoleResources): number => Item.Id )
      this.$set(this, 'TargetTreeSelectedName', {})
      this.DefaultCheckedTree(this.TargetTree)
    }

    // 整合成树组件需要的数据结构 以及 默认勾选
    private IntegratedData(Data: Interface.RoleResources[]):void{
      Data.forEach((Item: Interface.RoleResources) => {
        this.$set(Item, 'title', Item.ResourceName)
        this.$set(Item, 'children', Item.ChildNods)
        this.$set(Item, 'value', Item.Id.toString())
        this.$set(Item, 'label', Item.ResourceName)
        this.$set(Item, 'checked', false)
        if( Item.ChildNods.length > 0 ){
          this.IntegratedData(Item.ChildNods)
        }
      })
      
    }

    // 资源树 默认勾选
    private DefaultCheckedTree(Tree: Interface.RoleResources[], ParentName?: string): void{
      Tree.forEach( (Item: Interface.RoleResources, Index: number): void => {
        if( Item.children.length > 0 ){
          this.DefaultCheckedTree(Item.children, Item.ResourceName)
        } else {
          // 是否存在勾选的资源菜单 -- 只勾选最里层 
          if( this.OperateForm.ResourceId.length > 0 ){
            if ( this.OperateForm.ResourceId.some( (NodeId: number): boolean => NodeId === Item.Id ) ) {
              this.$set(Item, 'checked', true)

              // 判断是否第一级
              const Key:string = ParentName === undefined ? Item.ResourceName : ParentName

              // 组合已选权限数组
              if (this.TargetTreeSelectedName[Key] === undefined) 
                this.TargetTreeSelectedName[Key] = []
              
              this.TargetTreeSelectedName[Key].push(Item.ResourceName)
              
            }
          }
        }
      })
      
    }

    // 回调打开添加模态框
    private OpenModifyRoleModal():void {
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifyRoleModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((Valid:boolean) => {
        if (Valid) {

          if (this.OperateForm.ResourceId.length === 0) {
            this.$UI.Tips.Floating('warning', '请选择权限');
            return;
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: this.OperateForm.Id === 0 ? this.$Api.RoleCreate : this.$Api.RoleModify,
              Login: true
            },
            Data: this.OperateForm,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', this.OperateForm.Id === 0 ? '添加角色成功' : '编辑角色成功');
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

    private Tree: Interface.RoleResources[] = [] //资源菜单树数据
    private TargetTree: Interface.RoleResources[] = [] // 目标 资源菜单树

    private TargetTreeSelectedName: Interface.SelectedTree = {}; // 已选权限

    private ModifyRoleModal: boolean = false; // 当前模态框
    private OperateForm: Interface.Role = new Interface.Role();  // 表格数据
    private OperateFormRule: any = {
      RoleName: [{required: true, message: '请输入角色名字' }]
    }
  }


</script>
<style lang="less">
.Row-Tree{
  height: 300px;
  overflow: auto;
}
.Row-Role{
  padding: 20px 0px 0px 29px;
}
.Row-Role-Selected{
  padding: 20px 10px 0 10px;
}
</style>