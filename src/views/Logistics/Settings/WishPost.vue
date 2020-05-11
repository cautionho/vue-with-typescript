<!--wish邮 授权-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
        <Select class="P-W-200" placeholder="筛选账号状态" v-model="SearchForm.IsEnable" :options="DropEnable" />
        <!-- <Select class="P-W-200" placeholder="筛选账号状态" v-model="SearchForm.IsEnable" filterable clearable>
          <Option v-for="(Item, Index) in DropEnable" :key="Index" :value="$Enums.Public.Enable[Item]">{{Item}}</Option>
        </Select> -->
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Logistics.AuthorizeSearchType[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
		<Col span="24">
		<ModifyAuthorize ref="ModifyAuthorize" v-if="Powers.WishPostCreate || Powers.WishPostModify" :Power="Powers.WishPostCreate" :UseApi="'WishPost'" @handle-res="HandleRes"></ModifyAuthorize>
    <EnableApi ref="EnableApi" v-if="Powers.WishPostUseApi" :PostApi="$Api.WishPostChangeUseApi" :PostServer="$Server.Logistics" :SelectedData="Selected" @emit-modify="HandleRes"></EnableApi>
    <EnableStore ref="EnableStore" v-if="Powers.WishPostChangeStatus" :PostApi="$Api.WishPostChangeStatus" :PostServer="$Server.Logistics" :SelectedData="Selected" @emit-modify="HandleRes"></EnableStore>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="WishPost"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
import SInterface from '@/assets/Interface/Sales';
/*interface end*/

@Component({
	name: 'WishPost',
	components: {
		EnableApi: () => import('@/components/Sales/Store/EnableApi.vue'),
    EnableStore: () => import('@/components/Sales/Store/EnableStore.vue'),
    ModifyAuthorize: () => import('@/components/Logistics/Settings/ModifyAuthorize.vue'),
	}
})

export default class WishPost extends Vue {
	private mounted() {
		this.GetPoints();
	}

	private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['WishPostCreate', 'WishPostModify', 'WishPostChangeStatus', 'WishPostUseApi']));
		this.SetOperateDrop();
  }

	// 获取列表
	private GetList(): void {
		this.CancelSelect();
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.IsEnable = SearchForm.IsEnable === "" ? "" : Boolean(SearchForm.IsEnable);
		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.WishPostGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
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

	// 初始化列表操作按钮
	private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.WishPostModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.WishPostUseApi ? Drops.push({ Key:'', Value: 2 }) : null;
		this.Powers.WishPostChangeStatus ? Drops.push({ Key:'', Value: 3 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['WishPostCreate', 'WishPostChangeStatus', 'WishPostUseApi'].includes(Item) ){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	//获取列表复选框选中的数据
  private GetSelected(Data: SInterface.StoreList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["WishPost"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.AuthorizeSearch())
		this.GetList();
	}

	// 触发“切换页码”
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex', N);
		this.GetList();
	}

	// 触发“切换数据展示数量”
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}

  private OperateGroup(N: number, Idx: number): void{
    this.CancelSelect();

    switch(N){
      case 1: 
        (this as any).$refs.ModifyAuthorize.TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))]);
      break;
      case 2:
        (this as any).$refs.EnableApi.EmitApi(!this.List[Idx].IsUseApi, [JSON.parse(JSON.stringify(this.List[Idx]))]);
      break;
      case 3:
        (this as any).$refs.EnableStore.EmitAccount(!this.List[Idx].IsEnable, [JSON.parse(JSON.stringify(this.List[Idx]))]);
      break;
    }
  }

	private HandleRes(B:boolean): void{
    if(B){
      this.GetList()
    }
	}
	
	private Powers: PInterface.Power = {}  // 权限
  private DropEnable: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态下拉
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.AuthorizeSearchType) // 搜索关键词
	private OperateDrop: PInterface.KV[] = [] // 操作项
	private SearchForm: Interface.AuthorizeSearch = new Interface.AuthorizeSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: SInterface.StoreList[] = [] // 列表选中数据
	private List: SInterface.StoreList[] = [] // 列表数据源

	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
    { title: '账号', key: 'AccountName', }, 
    { title: '别名', key: 'Alias' }, 
    { title: '客户编号', key: 'CustomerCode' }, 
    { title: '创建日期', width: 160, render: (h: any, Params: any): string => h('p', this.$UI.Render.Date(Params.row.CreateTime)) },
		{ title: '有效至', width: 160, render: (h: any, Params: any): string => h('p', this.$UI.Render.Date(Params.row.Expiration)) },
		{ title: 'API状态', key: 'IsUseApi', render: (h: any, Params: any): string => {
      return h('span', { 
        class: Params.row.IsUseApi ? 'P-Text-Success' : 'P-Text-Error' 
      }, Params.row.IsUseApi ? '已启用' : '已禁用') 
    } },
    { title: '账号状态', key: 'IsEnable', render: (h: any, Params: any): string => {
      return h('span', { 
        class: Params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error' 
      }, Params.row.IsEnable ? '已启用' : '已禁用') 
    } },
		{ title:'操作', width: 100, align:'center', render: (h: any, Params: any): string => {
      return h( "Dropdown", {
        on: {
          "on-click": (Name: number) => {
            this.OperateGroup(Name, Params.row._index)
          }
        }
      }, [
        h("a", [
          h("span", { class: "P-MR-5" }, "操作"),
          h("Icon", { props: { type: "ios-arrow-down" } })
        ]),
        h( "DropdownMenu", { 
          slot: "list" 
        },
        this.OperateDrop.map((item: PInterface.KV): string => {
          return h( "DropdownItem", { 
            props: { name: item.Value }, 
            class: "P-TA-C" 
          }, item.Value === 2 ? (Params.row.IsUseApi ? '禁用API' : '启用API') : item.Value === 3 ? (Params.row.IsEnable ? '禁用账号' : '启用账号') : item.Key);
        }) )
      ]);
    } }
	]
}

</script>
<style lang="less"></style>
