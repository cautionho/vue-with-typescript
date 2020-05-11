<!-- 组织添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyModal">添加品类</Button>
      <Modal v-model="ShowModal" :title="OperateForm.Id === 0 ? '添加品类' : '编辑品类' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" v-if="ShowModal">
          <Form-item label="类目编号：" prop="CategoryCode">
            <Input ref="OperateFormName" v-model="OperateForm.CategoryCode" placeholder="类目编号" name="CategoryName" />
          </Form-item>
          <Form-item label="品类名称：" prop="CategoryName">
            <Input v-model="OperateForm.CategoryName" placeholder="品类名称" name="CategoryCode" />
          </Form-item>
          <Form-item label="所属类目：">
            <Cascader :data="CagtegoryTree" v-model="ModifyProductCagteforyId" @on-change="GetCagtefory" name="ParentId" filterable change-on-select placeholder="所属类目" ></Cascader>
          </Form-item>
          <Form-item label="采购员：" prop="PurchaseUserId" >
            <Select v-model="OperateForm.PurchaseUserId" placeholder="采购员" :options="DropPurchaserList" />
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
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'ModifyProductCagtegory'
  })
  export default class ModifyProductCagtegory extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    private async Trigger({
      Selected,
      Tree,
      CurrTreeDomId
    }: { 
      Selected: Interface.ProductCagtegoryList[],
      Tree: PInterface.ProductCagtegoryTree[],
      CurrTreeDomId: string[]
    }):Promise<void> {

      if (this.DropPurchaserList.length === 0) {
        this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '采购员' ))
      }
      
      this.$set(this, 'OperateForm', Selected.length > 0 ? JSON.parse(JSON.stringify(Selected[0])) : new Interface.ProductCagtegoryList());
      this.CagtegoryTree.splice(0, this.CagtegoryTree.length, ...Tree);

      // 点击 编辑 时
      if ( Selected.length > 0 && this.OperateForm.ParentId !== 0) {
        this.ModifyProductCagteforyId.unshift( this.OperateForm.ParentId.toString() );
        this.FindParentIds( this.CagtegoryTree, Number(this.OperateForm.ParentId) )
      } else {
        this.$set(this, 'ModifyProductCagteforyId', JSON.parse(JSON.stringify(CurrTreeDomId)))
      }

      this.$set(this,'ShowModal', true);
        
      this.$nextTick(function() {
        (this.$refs["OperateFormName"] as any).focus();
      })
  }


  // 获取 采购员 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) this.$Request.Error(Res);
          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

    // 组合 组织 数组
    private FindParentIds(Tree: PInterface.ProductCagtegoryTree[], NodeId: number): void {
      for (let Item in Tree) {
        if (Tree[Item].Id == NodeId) {
          if (Tree[Item].ParentId != 0) {
            this.ModifyProductCagteforyId.unshift( Tree[Item].ParentId.toString() );
            this.FindParentIds( this.CagtegoryTree , Tree[Item].ParentId)
          }
        } else {
          this.FindParentIds(Tree[Item].ChildNodes, NodeId)
        }
      }
    }

    // 回调打开添加模态框
    private OpenModifyModal():void {
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {
          // 继续往父级取
          const CategoryIdList = JSON.parse(JSON.stringify(this.ModifyProductCagteforyId))
          // CategoryIdList.pop()
          this.$set(this.OperateForm, 'ParentId', CategoryIdList.length > 0 ? Number(CategoryIdList.pop()) : 0 );
          
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Purchase,
            Api: {
              Address: this.OperateForm.Id === 0 ? this.$Api.CategoryCreate : this.$Api.CategoryModify,
              Login: true
            },
            Data: this.OperateForm,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', this.OperateForm.Id === 0 ? '添加品类成功' : '编辑品类成功');
                this.ClearModal( 1 );
              } else {
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    // 格式化 组织
    private GetCagtefory<T>(Data: T): void{
      this.$set(this.OperateForm, 'ModifyProductCagteforyId', Data);
    }

    private CagtegoryTree: PInterface.ProductCagtegoryTree[] = []; // 树

    private DropPurchaserList: PInterface.KV[] = [];  // 采购员下拉

    private ModifyProductCagteforyId: string[] = []; // 组织数组
    private ShowModal: boolean = false; // 当前模态框
    private OperateForm: Interface.ProductCagtegoryList = new Interface.ProductCagtegoryList();  // 表格数据
    private OperateFormRule: any = {
      CategoryCode: [{required: true, message: '请输入类目编号' }],
      CategoryName: [{required: true, message: '请输入品类名称' }],
      PurchaseUserId: [{required: true, message: '请选择采购员', trigger: 'change', type: 'number' }]
    }
  }


</script>