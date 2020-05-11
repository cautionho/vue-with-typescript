<!--供应商管理-->
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
					<!-- <Cascader class="P-W-200 P-ML-10 P-Inline-Block" placeholder="筛选地区" @on-change="PickCity" :data="CityList" change-on-select filterable clearable v-model="SearchForm.LocationArea"></Cascader> -->
          
					<Select class="P-W-200 P-ML-10" placeholder="筛选省份" v-model="SearchForm.Province" :options="PList" optionValKey="Id" optionKey="Name" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选城市" v-model="SearchForm.City" :options="CList" optionValKey="Id" optionKey="Name" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选区域" v-model="SearchForm.Area" :options="AList" optionValKey="Id" optionKey="Name" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="StatusDrop" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(item,index) in StatusDrop" :value="$Enums.Public.Enable[item]" :key="index">{{ item }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(item,index) in SearchKeyTypeDrop" :value="$Enums.Purchase.SupplySearchType[item]" :key="index">{{item}}</Option>
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
		<ModifySupplier class="P-MB-10" ref="ModifySupplier" v-if="Powers.SupplyCreate||Powers.SupplyModify" :Power="Powers.SupplyCreate" :AreaTree="PList" @emit-supplier="EmitChange"></ModifySupplier>
		<ChangeStatus class="P-MR-10 P-MB-10" ref="ChangeStatus" v-if="Powers.SupplyChangeStatus" @emit-change="EmitChange"></ChangeStatus>
		<SendOpsMail class="P-MB-10" ref="SendOpsMail" v-if="Powers.SendPmsMsg" :CityList="PList" @emit-send-mail="EmitChange"></SendOpsMail>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Supplier"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Col span="0">
		
		<SetPayDays ref="SetPayDays" @emit-setpay="EmitChange"></SetPayDays>
		<SupplierDetail ref="SupplierDetail" @handle-res="EmitChange"></SupplierDetail>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
/*interface end*/

@Component({
	name: 'SupplierManage',
	components: {
		ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
		ModifySupplier: () => import('@/components/Purchase/Supply/ModifySupplier.vue'),
		SupplierDetail: () => import('@/components/Purchase/Supply/SupplierDetails.vue'),
		SetPayDays: () => import('@/components/Purchase/Supply/SetPaymentDays.vue'),
		SendOpsMail: () => import('@/components/Purchase/Supply/SendOpsMail.vue'),
	}
})

export default class SupplierManage extends Vue {
	@Watch('SearchForm.Province')
	private ChangeProvince(Val: number): void{
		this.CList = [];
		this.AList = [];
		this.SearchForm.City = 0;
		this.SearchForm.Area = 0;
		if(Val !== 0){
			this.CList = (this.PList.find(Item => Item.Id === Val) as PInterface.AreaTree).ChildNodes;
		}
	}

	@Watch('SearchForm.City')
	private ChangeCity(Val: number): void{
		this.AList = [];
		this.SearchForm.Area = 0;
		if(Val !== 0){
			this.AList = (this.CList.find(Item => Item.Id === Val) as PInterface.AreaTree).ChildNodes;
		}
	}

	private mounted() {
		this.GetPoints();
	}

	private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SupplyCreate', 'SupplyModify', 'SupplyChangeStatus', 'SupplySetPeriod', 'SendPmsMsg']));
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
					this.$set(this, 'PList', Res.Data.Tree);
					// this.SetTreeMenu(this.PList)
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
		//分页列表仅取id 即value参数
		// this.selectCityId = []
		// for (let item in value) {
		// 	this.selectCityId.push(parseFloat(value[item]))
		// }
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
		this.$set(this, 'AccurateSearch', false);
		this.CancelSelect();
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.Status = SearchForm.Status === "" ? "" : Boolean(SearchForm.Status);
		SearchForm.IsPeriod = SearchForm.IsPeriod === "" ? "" : Boolean(SearchForm.IsPeriod);
		delete SearchForm.LocationArea;
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SupplyGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this, 'List', Res.Data.PageModel.Items)
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
		this.Powers.SupplyModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.SupplyChangeStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		Drops.push({ Key: 'QQ交谈', Value: 3 });
		Drops.push({ Key: '阿里旺旺交谈', Value: 4 });
		this.Powers.SupplySetPeriod ? Drops.push({ Key: '设置账期', Value: 5 }) : null;
		Drops.push({ Key: '查看', Value: 0 })
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['SupplyCreate', 'SupplyChangeStatus', 'SendPmsMsg'].includes(Item)){
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
  private GetSelected(Data: Interface.Supplier[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["Supplier"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.SupplierSearch())
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

	// 触发“添加供应商”按钮
	private CreateSupplier(): void {
		this.CancelSelect();
		(this as any).$refs.ModifySupplier.TriggerModal([])
	}

	// 触发批量操作按钮
	// private ValidateSelected(T: number): void {
	// 	if (!this.Selected.length) {
	// 		this.$UI.Tips.Floating('warning', `请选择供应商进行${T === 1 ? '启用' : T === 2 ? '禁用' : '发送站内信'}操作`);
	// 		return;
	// 	}
	// }

	/*
	列表操作列操作按钮触发方法  
	OpeIndex: 0-查看 1-编辑 2-禁启用 3-QQ交谈 4-阿里旺旺 5-设置账期
	Index： 操作列索引
	*/
	private operateGroup(OpeIndex:number, Index: number): void{	
		this.$set(this, 'AccurateSearch', false);
		this.CancelSelect();
		switch(OpeIndex){
			case 0:
				(this as any).$refs.SupplierDetail.TriggerModal(JSON.parse(JSON.stringify(this.List[Index])));
			break;
			case 1:
				(this as any).$refs.ModifySupplier.TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))])
			break;
			case 2:
				this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
				(this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj);
			break;
			case 3:
				window.location.href = 'tencent://message/?uin=' + this.List[Index].QQNum + '&Site=http://vps.shuidazhe.com&Menu=yes';
			break;
			case 4:
				window.open('http://web.im.alisoft.com/msg.aw?v=2&uid=' + this.List[Index].AliNum + '&site=cnalichn&s=1', '_blank');
			break;
			case 5: 
				(this as any).$refs.SetPayDays.TriggerModal(JSON.parse(JSON.stringify(this.List[Index])))
			break;
		}
	}

	//控制列表操作列下拉按钮显示隐藏
	private ControlOpera(OpeIndex:number, RowData: Interface.Supplier): string{
		if(OpeIndex === 3 && RowData.QQNum === ""){
			return 'none'
		}
		if(OpeIndex === 4 && RowData.AliNum === ""){
			return 'none'
		}

		return 'block'
	}

	/*
	  组件回调
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
	private PList: PInterface.AreaTree[] = [];	//省份下拉数据
	private CList: PInterface.AreaTree[] = [];	//城市下拉数据
	private AList: PInterface.AreaTree[] = [];	//区域下拉数据
	private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Purchase, Api: this.$Api.SupplyChangeStatus, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '供应商' };	//禁启用
	private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.SupplySearchType) // 搜索关键词
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private SearchForm: Interface.SupplierSearch = new Interface.SupplierSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: Interface.Supplier[] = [] // 列表选中数据
	private List: Interface.Supplier[] = [] // 列表数据源

	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ title: '供应商名称', key: 'SupplyName' },
		{ title: '联系人', key: 'Contact' },
		{ title: '联系电话', key: 'Phone' },
		{
			title: '地址',
			width: 500,
			render: (h: any, params: any): string => {
				return h('p', `${(params.row as any).ProvinceName}${(params.row as any).CityName}${(params.row as any).AreaName}${(params.row as any).Street}`)
			}
		},
		{
			title: '付款方式',
			render: (h: any, params: any): string => {
				return h('span', params.row.PayType == 0 ? '-' :this.$Enums.Purchase.PayType[params.row.PayType])
			}
		},
		{ 
			title: '状态', key: 'IsEnable', width: 80, render: (h: any, params: any): string => {
				return h('Icon', {
          props: { 
            type: params.row.IsEnable ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
		{
			title: '操作',width: 100,render: (h: any, params: any): string => {
				return h('Dropdown',{
					on: {
              'on-click': (name: any) => {
                this.operateGroup(name, params.row._index)
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
							class: "P-TA-C",
							style: { display: this.ControlOpera(Number(Item.Value), params.row) },
						}, `${Item.Value !== 2 ? Item.Key : (params.row.IsEnable ? '禁用' : '启用')}`);
					}))
				])
			}
		}
	]
}

</script>
<style lang="less"></style>
