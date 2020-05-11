<!-- 组织添加、编辑组件 -->
<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button class="P-MR-10 P-MB-10" type="primary" @click="OpenModifyAuthorizationModal">批量增加授权</Button>
      <Modal v-model="ModifyAuthorizationModal" :title=" IsBatch ? '批量增加授权' : '修改店铺授权' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Row class="Row-Tree">
          <Tree class="P-ML-20" ref="TargetTree" :data="Tree" show-checkbox ></Tree>
        </Row>
        <Row>
          <Col class="Row-Item" span="3">已选店铺：
          </Col>
          <Col span="21" class="Row-Authorization" v-if="Tree.length > 0">
            <span v-for="(Item, Index) in SelectedShopName" :key="Index">
              <strong>{{ Item.Platform }}:</strong>
              <span v-for="(Val, Idx) in Item.Store" :key="Idx">
                {{ Val }}
                <span v-if="Idx < Item.Store.length - 1" >,</span>
              </span>
              <span v-if="Index <= Item.length-1">；</span>
            </span>
          </Col>
        </Row>
        <Row>
          <Col class="Row-Item-UserName" span="3">用户姓名：
          </Col>
          <Col span="21" class="Row-Authorization">
            <Tag v-for="(Item, Index) in SelectedUserName" type="border" :name="Index" closable :key="Index" color="primary"  @on-close="HandleDeleteUserName">{{ Item.UserName }}</Tag>
          </Col>
        </Row>
        <Row class="P-MT-10">
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
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Sales";
  @Component({
    name: 'ModifyAuthorization'
  })
  export default class ModifyAuthorization extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    private Trigger(SelectedData: Interface.ShopAuthorizationList[]  ):void {
      if ( this.IsBatch && SelectedData.length === 0) {
        this.$UI.Tips.Floating('warning', '请选择用户进行操作');
        return;
      }

      this.SelecData = JSON.parse(JSON.stringify(SelectedData));

      this.GetTree()
      this.$nextTick(function() {
        this.$set(this,'ModifyAuthorizationModal', true);
      })
    }

    // 计算属性 - 渲染已选店铺
    get SelectedShopName(): Interface.SelectedShop[] {
      let TargetShopName: Interface.SelectedShop[] = []; // 结构： { 平台： 店铺数组 }
      const ActiveShopList: Interface.ShopAuthorizationTree[] = (this.$refs['TargetTree'] as Vue)
        .getCheckedAndIndeterminateNodes()
        .filter( (Item: Interface.ShopAuthorizationTree): boolean => Item.parent !== 0  )

      for (let Item in this.ShopTypeList) {
        const ShopTitle: string = this.ShopTypeList[Item] // 平台
        const ShopList: string[] = ActiveShopList // 店铺
          .filter( (Ite: Interface.ShopAuthorizationTree): boolean => Ite.parent === Number(Item) )
          .map( (Ite: Interface.ShopAuthorizationTree): string => Ite.Key )

        // 存在
        if ( ShopList.length > 0 ) {
          TargetShopName.push({
            Platform: ShopTitle,
            Store: ShopList
          })
        }
      }
      return TargetShopName
    }

    // 计算属性 - 渲染已选姓名
    get SelectedUserName(): Interface.SelectedUserName[] {
      const UserList: Interface.SelectedUserName[] = this.SelecData.map( (Item: Interface.ShopAuthorizationList): any => { 
        return { UserName: Item.UserName, UserId: Item.Id }
      })
      return UserList
    }


    // 获取 资源菜单树结构数据
    private GetTree(): void {
      this.$UI.Loading.Show();
      this.$set(this, 'Tree', []);

      this.$Request.Post({
        Server: this.$Server.Admin,
        Api: {
          Address: this.$Api.AuthorizationStorePermissionTree,
          Login: true
        },
        Data: {
          UserId: this.IsBatch ? 0 : this.SelecData[0].Id,
          IsBatch: this.IsBatch
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            // 存储原始数据
            this.$set(this, 'OriginalTreeData', Res.Data.Data.filter( (Item: Interface.OriginalTreeData) => Item.IsOwn === true ) );
            this.IntegratedData(Res.Data.Data)
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    // 整合成树组件需要的数据结构 以及 默认勾选
    private IntegratedData(Data: Interface.OriginalTreeData[]):void{
      Data.forEach((Item: Interface.OriginalTreeData) => {
        // 不存在
        if ( !this.Tree.some( (Ite: Interface.ShopAuthorizationTree) => Ite.Value === Item.PlatformId )  ) {

          const TreeNode: Interface.ShopAuthorizationTree = {
            Value: Item.PlatformId,
            Key: Item.PlatformName,
            parent: 0,
            title: Item.PlatformName,
            value: Item.PlatformName + '-' + Item.PlatformId,
            children: [{
              Value: Item.StoreId,
              Key: Item.StoreName,
              parent: Item.PlatformId,
              title: Item.StoreName,
              value: Item.PlatformId + '-' + Item.StoreId,
              children: [],
              checked: Item.IsOwn
            }]
          }

          // 建立父级
          this.Tree.push(TreeNode)

        } else {
          const Index:number =  this.Tree.findIndex( (Ite: Interface.ShopAuthorizationTree) => Ite.Value === Item.PlatformId  )

          const TreeChildNode = {
            Value: Item.StoreId,
            Key: Item.StoreName,
            parent: Item.PlatformId,
            title: Item.StoreName,
            value: Item.PlatformId + '-' + Item.StoreId,
            checked: Item.IsOwn,
            children: []
          }

          this.Tree[Index].children.push(TreeChildNode);

        }
      })
      // 获取全部店铺类型
      for( let Shop of this.Tree ){
        this.ShopTypeList[Shop.Value] = Shop.Key ;
      }
    }

    // 回调打开添加模态框
    private OpenModifyAuthorizationModal():void {
      this.IsBatch = true;
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.IsBatch = false;
      this.$set(this, 'ModifyAuthorizationModal', false);
      this.HandleResMsg(Val);
    }

    // 删除用户
    private HandleDeleteUserName(Event:any, Name: number): void {
      if (this.SelecData.length === 1) {
        this.$UI.Tips.Floating('warning', '新增授权至少需要选中一个用户');
        return;
      }
      this.SelecData.splice(Name, 1)
    }

    // 提交模态框
    private SubModal():void{
      let SubPower: Interface.SubmitPower[] = [];
      // 获取所有节点 过滤父级
      const AllSelectedTree: Interface.ShopAuthorizationTree[] = (this.$refs['TargetTree'] as Vue).getCheckedAndIndeterminateNodes().filter( (Item: Interface.ShopAuthorizationTree) => Item.parent !== 0  );
      if (AllSelectedTree.length === 0) {
        this.$UI.Tips.Floating('warning', '请选择店铺');
        return;
      }
      
      // 判断是否按钮点击或编辑点击
      if (this.IsBatch) {
        for (let Item of AllSelectedTree) {
          SubPower.push({
            PlatformId: Item.parent,
            StoreId: Item.Value,
            IsChange: false,
          });
        }
      } else {
        const ShopList: string[] = this.OriginalTreeData.map( (Item: Interface.OriginalTreeData): string => Item.PlatformId.toString() + '-' + Item.StoreId.toString() );
        const ActiveShopList: string[] = AllSelectedTree.map( (Item: Interface.ShopAuthorizationTree): string => Item.value );
        const AllShopList: string[] = Array.from( new Set([...ActiveShopList, ...ShopList]) )
        // 取消的权限
        for( let Item of AllShopList ){
          if( !ActiveShopList.includes(Item) ){
            const Arr: string[] = Item.split('-');
            SubPower.push({
              PlatformId: Number(Arr[0]),
              StoreId: Number(Arr[1]),
              IsChange: true,
            })
          }
        }
        // 添加勾选权限
        for( let Item of AllShopList ){
          const Arr: string[] = Item.split('-');
          SubPower.push({
            PlatformId: Number(Arr[0]),
            StoreId: Number(Arr[1]),
            IsChange: false,
          })
        }
      }


      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Admin,
        Api: {
          Address: this.$Api.AuthorizationSaveStorePermission ,
          Login: true
        },
        Data: {
          UserId: this.SelecData.map( (Item: Interface.ShopAuthorizationList): number => Item.Id ),
          Details: SubPower
        },
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', this.IsBatch ? '批量新增授权成功' : '编辑授权成功');
            this.ClearModal( 1 );
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private OriginalTreeData: Interface.OriginalTreeData[] = []
    private Tree: Interface.ShopAuthorizationTree[] = [] //资源菜单树数据
    private TargetTree: Interface.ShopAuthorizationTree[] = [] // 目标 资源菜单树

    private SelecData: Interface.ShopAuthorizationList[] = []; // 选中数据

    private IsBatch: boolean = false ; // 判断按钮点击 或 编辑

    private ShopTypeList: PInterface.Any = {}; // 店铺 - ID：Name

    private ModifyAuthorizationModal: boolean = false; // 当前模态框
  }


</script>
<style lang="less">
.Row-Tree{
  height: 300px;
  overflow: auto;
}
.Row-Item{
  padding: 20px 0px 0px 19px !important;
}
.Row-Item-UserName {
  padding: 24px 0px 0px 19px !important;
}
.Row-Authorization{
  max-height: 120px;
  overflow: auto;
  margin: 20px 0px 0 0px !important;
}

</style>