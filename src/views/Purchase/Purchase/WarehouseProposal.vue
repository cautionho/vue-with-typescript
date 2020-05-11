<!--国内仓采购建议-->
<template>
	<Row class="WarehouseProposal">
    <Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选采购员" v-model="SearchForm.Purchaser" :options="DropPurchaserList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选供应商" v-model="SearchForm.SupplyId" :options="DropSupplyIdList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选状态" v-model="SearchForm.PurchaseState" :options="DropPurchaseState" />
					<!-- <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
						<Option v-for="(item, index) in DropWarehouseList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选采购员" @on-change="OnClearSelect('Purchaser')" v-model="SearchForm.Purchaser" filterable clearable>
						<Option v-for="(item,index) in DropPurchaserList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="输入筛选供应商" @on-change="OnClearSelect('SupplyId')" v-model="SearchForm.SupplyId" filterable clearable remote :remote-method="RemoteSupply" :loading="SupplyLoading">
						<Option v-for="(item,index) in RemoteSupplyList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选状态" @on-change="OnClearSelect('PurchaseState')" v-model="SearchForm.PurchaseState" filterable clearable>
						<Option v-for="(item,index) in DropPurchaseState" :value="$Enums.Purchase.PurchaseState[item]" :key="index">{{ item }}</Option>
					</Select> -->
					<div class="P-ML-10 P-MT-10 P-Inline-Block" style="vertical-align: middle;">
						<Input class="P-W-300" v-model.trim="SearchForm.InventoryStart" placeholder="开始范围">
            <Select slot="prepend" class="P-W-200 P-TA-L" v-model="SearchForm.InventorySearchKeyType" placeholder="库存数量范围" :options="InvSeachKeyTypeList" />
						<!-- <Select slot="prepend" class="P-W-200" v-model="SearchForm.InventorySearchKeyType" @on-change="OnClearSelect('InventorySearchKeyType')" placeholder="库存数量范围" filterable clearable>
							<Option v-for="(item,index) in InvSeachKeyTypeList" :value="$Enums.Public.Inventory[item]" :key="index">{{ item }}</Option>
						</Select> -->
						</Input>
					</div>
					<span class="P-ML-10 P-MT-10 P-Inline-Block" style="vertical-align: middle;">-</span>	
					<Input class="P-W-100 P-ML-10 P-MT-10" v-model.trim="SearchForm.InventoryEnd" placeholder="结束范围"></Input>
					<span class="P-ML-10 P-Inline-Block P-MT-10" style="vertical-align: middle;">可卖天数范围：</span>
					<Input class="P-W-100 P-ML-10 P-MT-10" v-model.trim="SearchForm.StartCanSellDay" placeholder="开始范围"></Input>
					<span class="P-ML-10 P-MT-10 P-Inline-Block" style="vertical-align: middle;">-</span>	
					<Input class="P-W-100 P-ML-10 P-MT-10" v-model.trim="SearchForm.EndCanSellDay" placeholder="结束范围"></Input>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="DropProposalType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(item,index) in DropProposalType" :value="$Enums.Purchase.ProposalType[item]" :key="index">{{item}}</Option>
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
			<Button type="primary" v-if="Powers.CreateAndAuditPur" @click="OperateGroup(3)" class="P-MR-10 P-MB-10">生成采购单</Button>
			<Button type="primary" v-if="Powers.UpdDefaultSupply" @click="OperateGroup(2)" class="P-MR-10 P-MB-10">编辑供应商</Button>
			<Button type="primary" @click="OperateGroup(4)" class="P-MR-10 P-MB-10">按2的倍数取整</Button>
			<Button type="primary" @click="OperateGroup(5)" class="P-MR-10 P-MB-10">按5的倍数取整</Button>
			<Button type="primary" @click="Export" class="P-MR-10 P-MB-10">导出采购建议</Button>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="ProposalTable"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Col span="0">
			<Modal v-model="PurchaseDetailsModal" title="采购单详情" class-name="Container-Tabs" :mask-closable="false" @on-cancel="PurchaseDetailsModal = false" :width="1200">
				<PonDetails ref="PonDetails" :DetailsModal="PurchaseDetailsModal" :PonPurchaseOrd="PonPurchaseOrd" :HideArrival="false" />
				<footer slot="footer">
					<Button @click="PurchaseDetailsModal = false">返回</Button>
				</footer>
			</Modal>
			<ShowBigPic ref="ShowBigPic" />
			<EnableSupplier ref="ShowEnableModal" :AddCityList="CityTrees" @emit-eable-supplier="CloseEnableSupp" />
			<ViewSalesReport ref="ViewSalesReport" @emit-proposal="EmitProposal" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
	name: 'WarehouseProposal',
	components: {
		PonDetails: () => import('@/components/Purchase/Purchase/PonDetails.vue'),
		EnableSupplier: () => import('@/components/Public/EnableSupplier.vue'),
		ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
		ViewSalesReport: () => import('@/components/Purchase/Purchase/ViewSalesReport.vue')
	}
})
export default class WarehouseProposal extends Vue {
  private mounted() {
		this.GetPoints();
	}

  private async GetPoints(): Promise<void>  {
		this.$UI.Loading.Show();
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['CreateAndAuditPur', 'UpdDefaultSupply', 'ExportPurSuggest']));
    this.$set(this, 'DropWarehouseList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true ) )
    this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "采购员" ) )
		this.$set(this, 'DropSupplyIdList', await this.GetDropList<string, PInterface.KV>(this.$Server.Purchase, this.$Api.SupplyDropList, "" ) )
		this.SetOperateDrop();
		this.GetAreaTree();
  }

  private SetOperateDrop(): void{
		let Drops: PInterface.KV[] = [];
		this.Powers.UpdDefaultSupply ? Drops.push({ Key: '编辑供应商', Value: 2 }) : null;
		Drops.push({ Key: '查看', Value: 1 })
		this.OperateDrop.push(...Drops);
		this.GetList();
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取下拉请求
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (Res.IsSuccess) {
            resolve(Res.Data.DropList)
		  		} else {
						this.$UI.Loading.Hide();
           this.$Request.Error(Res);
		  		}
		  	}
	  	})
    })
	}
  
  private RemoteSupply(Query: string) {
		if (Query !== '') {
			this.SupplyLoading = true;
			setTimeout(() => {
				const list = this.DropSupplyIdList.map( (Item: PInterface.KV) => {
					this.SupplyLoading = false;
					return {
						Value: Item.Value,
						Key: Item.Key
					};
				});
				this.RemoteSupplyList = list.filter( (Item: PInterface.KV | any):boolean => Item.Key.toLowerCase().indexOf(Query.toLowerCase()) > -1);
			}, 200);
		} else {
			this.RemoteSupplyList = [];
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
					this.$set(this, 'CityTrees', Res.Data.Tree);
					// this.SetTreeMenu(this.CityTrees)
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

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  // 计算列表高度
	private CalculateTbHeight(): number {
		// let Flag: number = 210;
		// for(let Item in this.Powers){
		// 	if(this.Powers[Item]){
		// 		Flag = 255;
		// 	}
		// }
		return (window.innerHeight - 255);
  }


  // 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.CancelSelect();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.PurchaseState = SearchForm.PurchaseState === "" ? "" : Boolean(SearchForm.PurchaseState)
		SearchForm.InventoryStart = SearchForm.InventoryStart == "" ? 0 : Number(SearchForm.InventoryStart)
		SearchForm.InventoryEnd = SearchForm.InventoryEnd == "" ? 0 : Number(SearchForm.InventoryEnd)
		SearchForm.StartCanSellDay = SearchForm.StartCanSellDay == "" ? 0 : Number(SearchForm.StartCanSellDay)
		SearchForm.EndCanSellDay = SearchForm.EndCanSellDay == "" ? 0 : Number(SearchForm.EndCanSellDay)
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetDomesticWarehouseSuggestList,
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

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.ProposalList[] ): void{
    this.$set(this, 'Selected', Data)
  }
  
  //取消全选
  private CancelSelect():void {
    (this.$refs["ProposalTable"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		if (this.SearchForm.SearchKeyType == 1 && this.SearchForm.SearchKey != "" && this.SearchForm.SearchKey.indexOf('-') != -1) {
			this.SearchForm.SearchKey = this.SearchForm.SearchKey.slice(0, this.SearchForm.SearchKey.lastIndexOf('-'))
		}
		if ((this.SearchForm.InventoryStart != "" && this.SearchForm.InventoryEnd == "") || (this.SearchForm.InventoryStart == "" && this.SearchForm.InventoryEnd != "")) {
			this.$UI.Tips.Floating('warning', '请输入正确的库存范围')
			return
		}

		if (this.SearchForm.InventoryStart != "" && this.SearchForm.InventoryEnd != "" && this.SearchForm.InventorySearchKeyType == "") {
			this.$UI.Tips.Floating('warning', '请选择库存范围类型')
			return
		}

		if (this.SearchForm.InventoryStart != "" && this.SearchForm.InventoryEnd != "" && this.SearchForm.InventorySearchKeyType != "") {
			if(Number(this.SearchForm.InventoryStart) < 0 || Number(this.SearchForm.InventoryEnd) < 0){
				this.$UI.Tips.Floating('warning', '范围区间不能为负数')
				return
			}

			if (!this.$Pattern.PositiveInt.test(this.SearchForm.InventoryStart) || !this.$Pattern.PositiveInt.test(this.SearchForm.InventoryEnd)) {
				this.$UI.Tips.Floating('warning', '请输入正确的库存范围')
				return
			}

			if (Number(this.SearchForm.InventoryStart) > Number(this.SearchForm.InventoryEnd)) {
				this.$UI.Tips.Floating('warning', '库存的开始范围不能大于结束范围')
				return
			}
		}

		// 可卖天数
		if ((this.SearchForm.StartCanSellDay != "" && this.SearchForm.EndCanSellDay == "") || (this.SearchForm.StartCanSellDay == "" && this.SearchForm.EndCanSellDay != "")) {
			this.$UI.Tips.Floating('warning', '请输入可卖天数范围')
			return
		}

		if (this.SearchForm.StartCanSellDay != "" && this.SearchForm.EndCanSellDay != "") {
			if(Number(this.SearchForm.StartCanSellDay) < 0 || Number(this.SearchForm.EndCanSellDay) < 0){
				this.$UI.Tips.Floating('warning', '范围区间不能为负数')
				return
			}

			if (!this.$Pattern.PositiveInt.test(this.SearchForm.StartCanSellDay) || !this.$Pattern.PositiveInt.test(this.SearchForm.EndCanSellDay)) {
				this.$UI.Tips.Floating('warning', '请输入正确的可卖天数范围')
				return
			}

			if (Number(this.SearchForm.StartCanSellDay) > Number(this.SearchForm.EndCanSellDay)) {
				this.$UI.Tips.Floating('warning', '可卖天数的开始范围不能大于结束范围')
				return
			}
		}
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
  }
  

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.ProposalSearch())
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

	// 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
	}

	//1-查看 2-编辑供应商 3-生成采购单	4-按2的倍数取整 5-按5的倍数取整
	private OperateGroup(Val: number, Index?: number): void{
		this.$set(this, 'AccurateSearch', false);
		if(Index !== undefined){
			this.CancelSelect();
		}else{
			if (!this.Selected.length) {
				this.$UI.Tips.Floating('warning', `请选择采购建议进行操作`);
				return;
			}
		}

		switch(Val){
			case 1:
				(this.$refs["ViewSalesReport"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index as number]))])
				break;
			case 2:
				(this.$refs["ShowEnableModal"] as any).TriggerModal(false, this.IsLoadingEnableTab, false)
			break;
			case 3:
				this.CheckCreatePurOrder()
			break;
			case 4:
				this.MultiTwoInt()
			break;
			case 5:
				this.MultiFiveInt()
			break;
		}
	}

	// 检查生成采购单
	private CheckCreatePurOrder() {
		// 验证格式
		for (let Item in this.Selected) {
			if (!this.ValidatFunc('qty', this.Selected[Item].SuggestQty.toString(), true) || !this.ValidatFunc('price', this.Selected[Item].PurchasePrice.toString(), true)) {
				this.CancelSelect()
				return
			}
		}
		let PostData:Interface.PostGenerateOrd[] = []
		let Obj: Interface.PostGenerateOrd = new Interface.PostGenerateOrd()
		let Content = '是否对选中SKU进行生成采购单操作'
		//存在仓库、采购员、供应商不同
		for (let Item = 0; Item < this.Selected.length; Item++) {
			if (this.Selected[Item + 1] != undefined) {
				if (this.Selected[Item].WareHouseId != this.Selected[Item + 1].WareHouseId || this.Selected[Item].PurchaserName != this.Selected[Item + 1].PurchaserName || this.Selected[Item].SupplyId != this.Selected[Item + 1].SupplyId) {
					Content = '选择的SKU仓库、采购员和供应商不一致，将生成多个采购单，是否确认操作？'
				}
			}
			Obj["SkuCode"] = this.Selected[Item].SkuCode,
			Obj["SkuId"] = this.Selected[Item].SkuId
			Obj["WarehouseId"] = this.Selected[Item].WareHouseId
			Obj["Quantity"] = this.Selected[Item].SuggestQty
			Obj["PurchasePrice"] = this.Selected[Item].PurchasePrice
			Obj["Remark"] = ""
			
			PostData.push(Obj)
		}
		this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: Content,
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostGenerateOrd(PostData)
    		}else{
					this.CancelSelect();
				}
    	}
    })
	}

	// 验证格式
	private ValidatFunc(Type: string, Val:string, IsRetrun: boolean): boolean|void{
		if (Number(Val) <= 0) {
			this.$UI.Tips.Floating('warning', (Type == 'price' ? '采购价格' : '采购数量') + '不能少于0')
			if (IsRetrun)
				return false
		} else if ((Type == 'qty' && !/^\+?[1-9]\d*$/.test(Val)) || (Type == 'price' && !/^\d+(\.\d+)?$/.test(Val))) {
			this.$UI.Tips.Floating('warning', '输入的' + (Type == 'price' ? '采购价格' : '采购数量') + '格式不正确,请重新输入')
			if (IsRetrun)
				return false
		}
		if (IsRetrun)
			return true
	}

	private PostGenerateOrd(PostData: Interface.PostGenerateOrd[]): void{
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseApplyCreateAndAudit,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$Modal.success({
						title: '提示',
						content: `生成采购单成功，共生成[${Res.Data.Count}]个采购单`
					})
					this.CancelSelect()
          this.GetList()
				} else {
					this.$Request.Error(Res);
					this.$UI.Loading.Hide();
				}
			}
		})
	}

	//可用供应商回调选中供应商
  private CloseEnableSupp(Val: boolean, IsLoadingTab: boolean, SelectData: Interface.Supplier[]): void{
    this.IsLoadingEnableTab = IsLoadingTab;
		if(Val){
			this.PostSupply(SelectData[0].Id)
		}
	}
	//编辑供应商请求
	private PostSupply(SuppId: number): void{
		this.$UI.Loading.Show();
		let Ids = this.Selected.map( (Item: Interface.ProposalList):number => Item.SkuId)
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.UpdDefaultSupply,
				Login: true
			},
			Data: { Id: Ids, SupplyId: SuppId },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$UI.Tips.Floating('success', `编辑供应商成功`);
					this.CancelSelect()
          this.GetList()
				} else {
					this.$Request.Error(Res);
					this.$UI.Loading.Hide();
				}
			}
		})
	}

	//2的倍数取整
	private MultiTwoInt(): void{
		this.$UI.Loading.Show();
		for (let Item in this.Selected) {
			if (this.Selected[Item].SuggestQty % 2 > 0) {
				this.Selected[Item].SuggestQty = this.Selected[Item].SuggestQty + 1
				for (let i in this.List) {
					if (this.Selected[Item].SkuId == this.List[i].SkuId) {
						this.List[i].SuggestQty = this.Selected[Item].SuggestQty
					}
				}
			}
		}
		this.CancelSelect()
		this.$UI.Loading.Hide();
		this.$UI.Tips.Floating('success', `按2的倍数取整成功`);
	}
	//5的倍数取整
	private MultiFiveInt(): void{
		this.$UI.Loading.Show();
		for (let Item in this.Selected) {
			if (this.Selected[Item].SuggestQty % 5 > 0) {
          this.Selected[Item].SuggestQty = parseInt( String(this.Selected[Item].SuggestQty / 5) ) * 5 + 5
				for (let I in this.List) {
					if (this.Selected[Item].SkuId == this.List[I].SkuId) {
						this.List[I].SuggestQty = this.Selected[Item].SuggestQty
					}
				}
			}
		}
		this.CancelSelect()
		this.$UI.Loading.Hide();
		this.$UI.Tips.Floating('success', `按5的倍数取整成功`);
	}
	//导出
	private Export(): void{
		this.CancelSelect()
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SuggestExport,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$Modal.success({
						title: '操作成功',
						content: '创建导出国内采购建议任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。'
					})
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	//表格内数据填充到提交数据
  private SetTabInput(Val: string|number, Idx: number, Key:string): void{
    (this.List[Idx] as any)[Key] = Val
	}
	
	private ShowPurchaseDetail(text: string): void{
		this.PonPurchaseOrd = text;
		this.PurchaseDetailsModal = true;
		this.$nextTick(()=>{
			setTimeout(()=>{
				(this as any).$refs.PonDetails.TriggerModal([])
			}, 100)
		})
	}

	//子组件回调
	private EmitProposal(): void{
		this.CancelSelect()
	}
	
  private Powers: PInterface.Power = {}  // 权限
  private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropPurchaserList: PInterface.KV[] = [];  //采购员下拉
  private DropSupplyIdList: PInterface.KV[] = [];  //供应商下拉
  private RemoteSupplyList: PInterface.KV[] = [];  //搜索后供应商下拉
  private SupplyLoading: boolean = false; //供应商下拉是否正在搜索
  private DropPurchaseState: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.PurchaseState) //状态下拉
	private DropProposalType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ProposalType) //关键词下拉
	private InvSeachKeyTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Inventory) //库存下拉
	private SearchForm: Interface.ProposalSearch = new Interface.ProposalSearch()	//筛选项默认数据
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private List: Interface.ProposalList[] = [] //列表数据
	private Selected: Interface.ProposalList[] = [] //列表选中数据

	private IsLoadingEnableTab: boolean = true;  //打开添加供应商时是否加载表格数据
	private CityTrees:PInterface.AreaTree[] = []; //地区下拉数据

	private PurchaseDetailsModal: boolean = false;	//采购单详情模态框
	private PonPurchaseOrd: string = ""	//采购单号
	
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '产品图', key: 'SkuImage', width: 80, render: (h, Params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + Params.row.SkuImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.SkuImage)
            }
          }
        })
      }
    },
		{ title: 'SKU信息', width: 120, render: (h: any, Params: any): string => {
			function commonStyle(flag: boolean) {
				let style = {
					background: 'rgb(220, 112, 165)',
					borderRadius: '2px',
					color: '#fff',
					textAlign: 'center',
					marginTop: '2px',
					padding: '0 3px',
					marginRight: '4px',
					display: flag ? 'inline-block' : 'none',
				}
				return style
			}
						
      return h('div', { class: "P-MT-5 P-MB-5" }, [
        h('p', Params.row.SkuCode === "" ? '-' : Params.row.SkuCode),
				h('Tooltip', {
					props: {
						'content': Params.row.SkuName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.SkuName === "" ? '-' : Params.row.SkuName)
				]),
				h('span', { style: commonStyle(Params.row.AttributesIds.some( (Item: number):boolean => Item===54 )) }, '仿牌产品'),
				h('span', { style: commonStyle(Params.row.AttributesIds.some( (Item: number):boolean => Item===19 )) }, '疑似品牌侵权')
			])
		}},

		{ title: '仓库/供应商', render: (h: any, Params: any): string => {
			return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "仓"),
          h('span', Params.row.WareHouseName)
				]),
				h('Tooltip', {
					props: {
						'content': Params.row.SupplyName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', { class: 'P-Table-Tip P-BG-Primary' }, "供"),
						h('span', Params.row.SupplyName)
					])
				])
      ])
		} },
		{ title: '可用库存/日均销量', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "可用"),
          h('span', Params.row.Quantity)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "日均"),
          h('span', Params.row.DayOfSaleAvgQty)
        ])
      ])
    }},
    { title: '在途库存/未配货库存', width: 120, render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "在途"),
          h('span', Params.row.PurchasingQuantity)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "未配"),
          h('span', Params.row.BuyQuantity)
        ]),
      ])
    }},
		{ title: '佛山仓采购建议/海外仓采购建议', width: 140, render: (h: any, Params: any): string => {
			return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "佛山"),
          h('span', Params.row.FS_SuggestQty)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "海外"),
          h('span', Params.row.OS_SuggestQty)
        ]),
      ])
		}},
		{ title: '可卖天数', width: 90, render: (h: any, Params: any): string => h('span', Params.row.DayOfSaleAvgQty == 0 ? 0 : ((Params.row.Quantity + Params.row.PurchasingQuantity - Params.row.BuyQuantity)/Params.row.DayOfSaleAvgQty) == 0 ? 0 : ((Params.row.Quantity + Params.row.PurchasingQuantity - Params.row.BuyQuantity)/Params.row.DayOfSaleAvgQty).toFixed(2)) },
		{ title: '采购数量', width: 120, render: (h: any, Params: any): string => 
			h('InputNumber', {
        props: {
          value: Params.row.SuggestQty
				},
				class: 'P-W-100-Percent',
        on: {
          'on-change': (name: number) => {
            this.SetTabInput(name, Params.index, 'SuggestQty')
          }
        }
      })
    },
		{ title: '采购价格(CNY)', width: 120, render: (h: any, Params: any): string => 
			h('InputNumber', {
        props: {
          value: Params.row.PurchasePrice
				},
				class: 'P-W-100-Percent',
        on: {
          'on-change': (name: number) => {
            this.SetTabInput(name, Params.index, 'PurchasePrice')
          }
        }
      })
		},
		{ title: '状态', width: 100, key: 'Status',
      render: (h: any, Params: any): string => {
			  return h('Tag', {
          props: { color: Params.row.PurchaseState ? 'success' : 'error' }
        }, Params.row.PurchaseState ? this.DropPurchaseState[1].Key : this.DropPurchaseState[0].Key )
      }
    },
		{ title: '今日采购单', width: 130, render: (h: any, Params: any): string => {
			let purCodes: string[] = []
			if (Params.row.PurchaseOrderCodes) {
				purCodes = Params.row.PurchaseOrderCodes.split(',')
			}
			return purCodes.length < 1 ? h('span', '-') : h('div', purCodes.map((Item: string, index:number) => {
				return h('span', {
					attrs: { class: 'P-Text-Info' },
					style: { cursor: 'pointer' },
					on: {
						click: (e: any)=>{
							this.ShowPurchaseDetail(e.target.innerText)
						}
					}
				}, Item + (index == purCodes.length - 1 ? '' : ','))
			}))
		}},
		{ title: '采购员', width: 80, key: 'PurchaserName', render: (h: any, Params: any): string =>  h('span', Params.row.PurchaserName === "" ? '-' : Params.row.PurchaserName) },
		{ title: '最后更新时间', width: 160, render: (h: any, Params: any): string => { return h('span', this.$UI.Render.Date(Params.row.LastUpdateTime, true))} },
    { title: '操作', width: 100, render: (h: any, Params: any): string => {
				return h('Dropdown',{
					on: {
            'on-click': (name: any) => {
              this.OperateGroup(name, Params.row._index)
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
						}, Item.Key);
					}))
				])
			}
    }
  ];
}

</script>
<style lang="less">
.WarehouseProposal{
	.ivu-tooltip{
		.ivu-tooltip-rel{
			vertical-align: middle;
		}
	}
}
</style>
