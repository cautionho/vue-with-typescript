<!--客户管理-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
					<Cascader class="P-W-200 P-ML-10 P-Inline-Block" placeholder="筛选地区" @on-change="PickCity" :data="CityList" change-on-select filterable clearable v-model="SearchForm.LocationArea"></Cascader>
          <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.IsEnable" :options="StatusDrop" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('IsEnable')" v-model="SearchForm.IsEnable" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Public.Enable[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词"  v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Logistics.CustomerManageType[Item]" :key="Index">{{Item}}</Option>
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
		<ModifyCustomer class="P-MB-10" ref="ModifyCustomer" v-if="Powers.CustomerCreate || Powers.CustomerModify" :CityDropList="CityList" :IsShowDiscount="Powers.CustomerDiscount" :Power="Powers.CustomerCreate" @handle-res="EmitChange" />
		<Recharge class="P-MB-10" ref="Recharge" v-if="Powers.CustomerRecharge" @handle-res="EmitChange" />
		<ChangeStatus class="P-MB-10" v-if="Powers.CustomerChangeStatus" ref="ChangeStatus" @emit-change="EmitChange"></ChangeStatus>
		</Col>	
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="CustomerManage"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Col span="0">
			<UpdCreditsBalance ref="UpdCreditsBalance" @handle-res-msg="EmitChange"/>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
/*interface end*/

@Component({
	name: 'CustomerManage',
	components: {
		ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
		UpdCreditsBalance: () => import('@/components/Logistics/Client/UpdCreditsBalance.vue'),
		Recharge: () => import('@/components/Logistics/Client/Recharge.vue'),
		ModifyCustomer: () => import('@/components/Logistics/Client/ModifyCustomer.vue'),
	}
})

export default class CustomerManage extends Vue {
	private mounted() {
		this.GetPoints();
	}


	private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['CustomerCreate', 'CustomerModify', 'CustomerDiscount', 'CustomerRecharge', 'CustomerCredits', 'CustomerChangeStatus']));
		this.GetAreaTree();
		this.SetOperateDrop();
	}

	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

	// 获取省市区树
	private GetAreaTree(): void {
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ProvincialAreasGetTree,
				Login: false
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'CityList', Res.Data.Tree);
					this.SetTreeMenu(this.CityList)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
	}

	//组装成级联菜单所要的数据结构
	private SetTreeMenu(Data: PInterface.AreaTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}
	
	//级联选择地区
  private PickCity(Value: number[], selectedData: any) {
		let length = Value.length;
		switch (length) {
			case 1:
				this.SearchForm.Province = Value[0];
				break;
			case 2:
				this.SearchForm.Province = Value[0];
				this.SearchForm.City = Value[1];
				break;
			case 3:
				this.SearchForm.Province = Value[0];
				this.SearchForm.City = Value[1];
				this.SearchForm.Area = Value[2];
				break;
			default:
				this.SearchForm.Province = 0;
				this.SearchForm.City = 0;
				this.SearchForm.Area = 0;
				break;
		}
	}

	// 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.IsEnable = SearchForm.IsEnable === "" ? "" : Boolean(SearchForm.IsEnable);
		delete SearchForm.LocationArea;
		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.CustomerGetList,
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
		this.Powers.CustomerModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.CustomerCredits ? Drops.push({ Key: '调额', Value: 2 }) : null;
		this.Powers.CustomerChangeStatus ? Drops.push({ Key: '启禁用', Value: 3 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['CustomerCreate', 'CustomerRecharge', 'CustomerChangeStatus'].includes(Item) ){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	// 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.CustomerManageList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["CustomerManage"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', new Interface.CustomerManageSearch())
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


	/*
	列表操作列操作按钮触发方法  
	OpeIndex: 1-编辑 2-调额 3-禁启用
	Index： 操作列索引
	*/
	private operateGroup(OpeIndex:number, Index: number): void{	
		this.$set(this, 'AccurateSearch', false);
		this.CancelSelect();
		switch(OpeIndex){
			case 1:
				(this.$refs.ModifyCustomer as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))])
			break;
			case 2:
				(this.$refs.UpdCreditsBalance as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))])
			break;
			case 3:
				this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
				(this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj, 'CustomerId');
			break;
		}
	}

	/*
		回调组件
		Res true-操作成功
		Type  1-启用 0-禁用
	*/
	private EmitChange(Res: boolean, Type?: number){
		if(Type !== undefined){
			this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}

		if(Res){
      this.GetList()
		}
	}

	
	private Powers: PInterface.Power = {}  // 权限
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
	private CityList: PInterface.AreaTree[] = [];	//地区下拉数据
	private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Logistics, Api: this.$Api.CustomerChangeStatus, IdKey: 'CustomerId', StatusKey: 'IsEnable', ToTarget: false, TipsKey: '客户' };	//禁启用
	private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.CustomerManageType) // 搜索关键词
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private SearchForm: Interface.CustomerManageSearch = new Interface.CustomerManageSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: Interface.CustomerManageList[] = [] // 列表选中数据
	private List: Interface.CustomerManageList[] = [] // 列表数据源

	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ title: '客户编号', key: 'CustomerCode' },
		{ title: '公司', key: 'Company' },
		{ title: '联系人', key: 'Contact' },
		{ title: '电话', key: 'Phone' },
		{ title: '邮箱', key: 'Email' },
		{
			title: '地址/邮编',
			width: 300,
			render: (h: any, Params: any): string => {
				return h('p', `${(Params.row as any).ProvinceName}${(Params.row as any).CityName}${(Params.row as any).AreaName}${(Params.row as any).Street}，${(Params.row as any).ZipCode}`)
			}
		},
		{ title: '余额（CNY）', key: 'Balance' },
		{ title: '信用额度（CNY）', key: 'CreditsBalance' },
		{ title: '添加时间', key: 'CreateTime', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date( (Params.row as any).CreateTime, true))},
		{ 
			title: '状态', key: 'IsEnable', width: 80, render: (h: any, Params: any): string => {
				return h('Icon', {
          props: { 
            type: Params.row.IsEnable ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: Params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
		{
			title: '操作',width: 100, render: (h: any, Params: any): string => {
				return h('Dropdown',{
					on: {
              'on-click': (name: any) => {
                this.operateGroup(name, Params.row._index)
              }
            }
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((Item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: Item.Value
							},
							class: "P-TA-C"
						}, `${Item.Value !== 3 ? Item.Key : (Params.row.IsEnable ? '禁用' : '启用')}`);
					}))
				])
			}
		}
	]
}

</script>
<style lang="less"></style>
