<template>
  <Row class="Role-View">
    <Col span="24">
      <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
          <Button type="primary" @click="TriggerSearch">
            精准搜索
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <Col span="24" slot="list" class="P-P-10">
          <Select class="P-W-200 P-ML-10 P-Inline-Block" placeholder="岗位" v-model="SearchForm.PositionId" :options="DropPositionList" />
          <Cascader class="P-W-200 P-ML-10 P-Inline-Block" :data="Tree" v-model="CurOrganizationId" filterable change-on-select placeholder="组织" ></Cascader>
          </Col>
        </Dropdown>
        <FormItem class="P-ML-10 P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" :options="SearchKeyTypeDrop" />
          <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
		</Col>
    <Col span="24">
      <!-- 批量增加授权 -->
      <ModifyAuthorization
        ref="ModifyAuthorization"
        v-if="Powers.AddEmpower" 
        :SelectedData="Selected" 
        :ShowModal="ShowAuthorizationModal" 
        @handle-res-msg="HandleResMsg" 
      />
      <!-- 一键同步旧权限 -->
      <Button class="P-MB-10" v-if="Powers.SyncOldpower" type="primary" @click="HandleSyncPower">一键同步旧权限</Button>
      
    </Col>
		<Col span="24">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="ShopAuthorizationTable" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';

@Component({
  name: 'ShopAuthorization',
  components: {
    ModifyAuthorization: () => import('@/components/Sales/ModifyAuthorization.vue'),
	}
})

export default class ShopAuthorization extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
		this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SyncOldpower','AddEmpower','GetUserListPower']))
    this.$set(this, 'DropPositionList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Admin, this.$Api.GetPositionDropList, true ) )
    this.GetTree()
    this.SetOperateDrop()
  }

   // 获取 岗位 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) {
           this.$Request.Error(Res);
          }
          resolve(Res.Data.DropList || [])
		  	}
	  	})
    })
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.AddEmpower ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
  }
  // 获取组织架构树
  private GetTree(): void {
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.OGetOrganizationTree,
				Login: true
			},
			Data: true,
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

  // 整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: Interface.OrganizationTree[]):void{
    Data.forEach((Item: Interface.OrganizationTree) => {
      this.$set(Item, 'title', Item.Name)
      this.$set(Item, 'children', Item.ChildNodes)
      this.$set(Item, 'value', Item.Id.toString())
      this.$set(Item, 'label', Item.Name)
      if ( Item.ChildNodes.length > 0 ) {
        this.IntegratedData(Item.ChildNodes);
      }
    })
  }
  // 获取列表数据
  private GetList(): void {
    this.AccurateSearch = false;
		this.$UI.Loading.Show();
    this.$set(this, 'List', []);
    // 组织 取值最后一位
    this.$set(this.SearchForm, 'OrganizationId', this.CurOrganizationId.length > 0 ? Number(this.CurOrganizationId[this.CurOrganizationId.length - 1]) : "" );

		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.AuthorizationUserList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this, 'List', Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

	// 获取列表复选框选中的数据
  private GetSelected(data: Interface.ShopAuthorizationList[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["ShopAuthorizationTable"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.AuthorizationSearchForm());
    this.$set(this, 'CurOrganizationId', []);
		this.GetList();
	}
	
	//  切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//  切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
  }
  
  // 计算表格高度
	private CalculateTbHeight(): number {
		return window.innerHeight - 250;
	}
  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  // 一键同步旧权限
  private HandleSyncPower(): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否同步当前账号已有平台店铺的旧权限？`,
      Callback: (Res: boolean):void => {
        if (Res) {
    		  this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Admin,
            Api: {
              Address: this.$Api.AuthorizationOneClickSync,
              Login: true
            },
            Data: '',
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success', `同步成功！`);
              } else {
                this.$Request.Error(Res);
              }
            }
          })

        }
      }
    });
  }

  // 列表操作列 
  // 1-批量新增权限
  private OperateGroup(Type:number, Idx?:number): void{ 
    this.AccurateSearch = false;
    this.CancelSelect()
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : [])
    switch(Type){
      case 1:
        ( this.$refs["ModifyAuthorization"] as Vue ).Trigger(this.Selected);
        break;
    }
  }

  //子组件回调  0-不操作 1-启禁用操作成功 2-添加菜单模态框 3-添加/编辑操作成功
  private HandleResMsg(Type: number){
    if(Type == 2){
      ( this.$refs["ModifyAuthorization"] as Vue ).Trigger(this.Selected);
    }
  }
  
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false; // 精准搜索

  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.AuthorizationSearchForm = new Interface.AuthorizationSearchForm(); //筛选数据
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.SearchType)	//关键词下拉
  private SingleChange: boolean = false;    //监听是否点击了单个禁启用

  private DropPositionList: PInterface.KV[] = [];  // 岗位下拉
  private Tree: Interface.OrganizationTree[] = [] //左侧树数据
  private CurOrganizationId: string[] = []; // 组织数组

  private ShowAuthorizationModal: boolean = false; // 模态框 - 添加/编辑 角色权限

  private Selected: Interface.ShopAuthorizationList[] = []; // 列表选中数据
  private List: Interface.ShopAuthorizationList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'UserCode' },
    { title: '姓名', key: 'UserName' },
    { title: '组织', key: 'OrganizationName' },
    { title: '职务', key: 'PositionName' },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV): string => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }
  ];
}
</script>

<style lang="less">

</style>