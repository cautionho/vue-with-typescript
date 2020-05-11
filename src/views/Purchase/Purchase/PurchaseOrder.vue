<!--采购单管理-->
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
					<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选采购员" v-model="SearchForm.Purchaser" :options="DropPurchaserList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选主管" v-model="SearchForm.SaleManager" :options="DropSaleManagerList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选来源" v-model="SearchForm.SourceType" :options="DropSourceTypeList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="DropOrderStatusList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选申请付款状态" v-model="SearchForm.PayStatus" :options="DropFinanceApplyStatusList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选申请退款状态" v-model="SearchForm.RefundStatus" :options="DropFinanceApplyStatusList" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选完成情况" v-model="SearchForm.CompleteStatus" :options="DropOrderCompleteStatus" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选供应商" v-model="SearchForm.SupplyId" :options="DropSupplyIdList" />
					<!-- <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
						<Option v-for="(item, index) in DropWarehouseList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选采购员" @on-change="OnClearSelect('Purchaser')" v-model="SearchForm.Purchaser" filterable clearable>
						<Option v-for="(item,index) in DropPurchaserList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选主管" @on-change="OnClearSelect('SaleManager')" v-model="SearchForm.SaleManager" filterable clearable>
						<Option v-for="(item,index) in DropSaleManagerList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选来源" @on-change="OnClearSelect('SourceType')" v-model="SearchForm.SourceType" filterable clearable>
						<Option v-for="(item,index) in DropSourceTypeList" :value="$Enums.Purchase.SourceType[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(item,index) in DropOrderStatusList" :value="$Enums.Purchase.OrderStatus[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选申请付款状态" @on-change="OnClearSelect('PayStatus')" v-model="SearchForm.PayStatus" filterable clearable>
						<Option v-for="(item,index) in DropFinanceApplyStatusList" :value="$Enums.Purchase.FinanceApplyStatus[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选申请退款状态" @on-change="OnClearSelect('RefundStatus')" v-model="SearchForm.RefundStatus" filterable clearable>
						<Option v-for="(item,index) in DropFinanceApplyStatusList" :value="$Enums.Purchase.FinanceApplyStatus[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选完成情况" @on-change="OnClearSelect('CompleteStatus')" v-model="SearchForm.CompleteStatus" filterable clearable>
						<Option v-for="(item,index) in DropOrderCompleteStatus" :value="$Enums.Purchase.OrderCompleteStatus[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="输入筛选供应商" @on-change="OnClearSelect('SupplyId')" v-model="SearchForm.SupplyId" filterable clearable remote :remote-method="RemoteSupply" :loading="SupplyLoading">
						<Option v-for="(item,index) in RemoteSupplyList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(item,index) in SearchKeyTypeDrop" :value="$Enums.Purchase.OrderSearchType[item]" :key="index">{{item}}</Option>
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
		<Button type="primary" v-if="Powers.PurchaseOrderToReview" @click="ValidateOpePon(11)" class="P-MR-10 P-MB-10">提交审核</Button>
		<Button type="primary" v-if="Powers.PurchaseOrderPMReview" @click="ValidateOpePon(3)" class="P-MR-10 P-MB-10">采购主管审核</Button>
		<Button type="primary" v-if="Powers.PurchaseOrderSMReview" @click="ValidateOpePon(4)" class="P-MR-10 P-MB-10">销售主管确认</Button>
		<Button type="primary" v-if="Powers.PurchaseOrderGMReview" @click="ValidateOpePon(5)" class="P-MR-10 P-MB-10">总经理审核</Button>
		<Button type="primary" v-if="Powers.PayOrderAdd" @click="ValidateOpePon(6)" class="P-MR-10 P-MB-10">申请付款</Button>
		<Button type="primary" v-if="Powers.RefundOrderCreate" @click="ValidateOpePon(7)" class="P-MR-10 P-MB-10">申请退款</Button>
		<Button type="primary" v-if="Powers.PurchaseOrderNoWait" @click="ValidateOpePon(10)" class="P-MR-10 P-MB-10">不等待余货</Button>
		<Button type="error" v-if="Powers.PurchaseOrderStop" @click="ValidateOpePon(8)" class="P-MR-10 P-MB-10">终止采购</Button>
		<Button type="primary" v-if="Powers.PrintPurchaseOrder" @click="ValidateOpePon(12)" class="P-MR-10 P-MB-10">导出采购单</Button>
		<Button type="primary" v-if="Powers.ExportPurOrderDetail" @click="ValidateOpePon(14)" class="P-MB-10">导出采购单明细</Button>
	
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="PurchaseOrder"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Col span="0">
		<Modal v-model="DetailsModal" title="采购单详情" class-name="Container-Tabs" :mask-closable="false" @on-cancel="HandleRes(false)" :width="1200">
			<PonDetails ref="PonDetails" :HideArrival="false" />
			<footer slot="footer">
				<Button @click="HandleRes(false)">返回</Button>
			</footer>
    </Modal>
		<ModifyPon ref="ModifyPon" :Power="Powers.PurchaseOrderToReview" @emit-purchase="HandleRes" />
		<ReviewPon ref="ReviewPon" @emit-purchase="HandleRes" />
		<ApplyFinanceOrder ref="ApplyFinanceOrder" :CurrentPon="CurrentPon" :DropFinanceList="DropFinanceList" @emit-purchase="HandleRes" />
		<PreventPon ref="PreventPon" @emit-purchase="HandleRes" />
		<AddShiped ref="AddShiped" @emit-purchase="HandleRes" />
		<ExportPon ref="ExportPon" @emit-purchase="HandleRes" />
		<ExportPonDetails ref="ExportPonDetails" @handle-res-msg="HandleRes" />

		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
import ExpandRow from './PurchaseOrder_Expand.vue';
/*interface end*/

@Component({
	name: 'PurchaseOrder',
	components: {
		PonDetails: () => import('@/components/Purchase/Purchase/PonDetails.vue'),
		ModifyPon: () => import('@/components/Purchase/Purchase/ModifyPon.vue'),
		ReviewPon: () => import('@/components/Purchase/Purchase/ReviewPon.vue'),
		ApplyFinanceOrder: () => import('@/components/Purchase/Purchase/ApplyFinanceOrder.vue'),
		PreventPon: () => import('@/components/Purchase/Purchase/PreventPon.vue'),
		AddShiped: () => import('@/components/Purchase/Purchase/PonAddShiped.vue'),
		ExportPon: () => import('@/components/Purchase/Purchase/ExportPon.vue'),
		ExportPonDetails: () => import('@/components/Purchase/Purchase/ExportPonDetails.vue')

	}
})

export default class PurchaseOrder extends Vue {
	private mounted() {
		this.GetPoints();
	}


	private async GetPoints(): Promise<void>  {
		this.$UI.Loading.Show();
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PayOrderAdd', 'RefundOrderCreate', 'ExportPurOrderDetail','PurchaseOrderToReview', 'PurchaseOrderModify', 'PurchaseOrderPMReview', 'PurchaseOrderSMReview', 'ArrivalOrderCreate', 'PurchaseOrderStop', 'PurchaseOrderNoWait', 'PurchaseOrderInputThirdCode', 'PrintPurchaseOrder', 'PurchaseSetReissue', 'PurchaseBanReissue', 'PurchaseOrderGMReview']));
    this.$set(this, 'DropWarehouseList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true ) )
    this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "采购员" ) )
    this.$set(this, 'DropSaleManagerList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "销售主管" ) )
		this.$set(this, 'DropSupplyIdList', await this.GetDropList<string, PInterface.KV>(this.$Server.Purchase, this.$Api.SupplyDropList, "" ) )
		this.SetOperateDrop();
	}

	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取 仓库 / 岗位 / 用户 下拉 
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
				const list = this.DropSupplyIdList.map( (item: PInterface.KV) => {
					this.SupplyLoading = false;
					return {
						Value: item.Value,
						Key: item.Key
					};
				});
				this.RemoteSupplyList = list.filter( (item: PInterface.KV | any):boolean => item.Key.toLowerCase().indexOf(Query.toLowerCase()) > -1);
			}, 200);
		} else {
			this.RemoteSupplyList = [];
		}
	}

	// 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetList,
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
		this.Powers.PurchaseOrderModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.PurchaseOrderPMReview ? Drops.push({ Key: '采购主管审核', Value: 3 }) : null;
		this.Powers.PurchaseOrderSMReview ? Drops.push({ Key: '销售主管审核', Value: 4 }) : null;
		this.Powers.PurchaseOrderGMReview ? Drops.push({ Key: '总经理审核', Value: 5 }) : null;
		this.Powers.PayOrderAdd ? Drops.push({ Key: '申请付款', Value: 6 }) : null;
		this.Powers.RefundOrderCreate ? Drops.push({ Key: '申请退款', Value: 7 }) : null;
		this.Powers.PurchaseOrderStop ? Drops.push({ Key: '终止采购', Value: 8 }) : null;
		this.Powers.ArrivalOrderCreate ? Drops.push({ Key: '添加发货', Value: 9 }) : null;
		this.Powers.PurchaseOrderNoWait ? Drops.push({ Key: '不等待余货', Value: 10 }) : null;
		Drops.push({ Key: '查看', Value: 2 })
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['PurchaseOrderToReview', 'PurchaseOrderPMReview', 'PurchaseOrderSMReview', 'PurchaseOrderGMReview', 'PayOrderAdd', 'RefundOrderCreate', 'PurchaseOrderNoWait', 'PurchaseOrderStop', 'PrintPurchaseOrder', 'ExportPurOrderDetail'].includes(Item)){
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
  private GetSelected(Data: Interface.PurchaseOrd[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["PurchaseOrder"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
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
		this.$set(this, 'SearchForm', new Interface.PurchaseOrdSearch())
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

	

	//转接功能操作验证	3-采购主管审核 4-销售主管审核 5-总经理审核 6-申请付款 7-申请退款 8-终止采购 9-添加发货 10-不等待余货	11提交审核 12导出采购单
	private ValidateOpePon(Val: number):void{
		if(Val === 14){
			this.CancelSelect();
			(this as any).$refs.ExportPonDetails.TriggerModal(false)
			return 
		}

		if (!this.Selected.length) {
			this.$UI.Tips.Floating('warning', `请选择采购单进行操作`);
			return;
		}

		this.OperateGroup(Val)
	}

	/*
	列表操作列操作按钮触发方法  
	OpeIndex: 1-编辑 2-查看 3-采购主管审核 4-销售主管审核 5-总经理审核 6-申请付款 7-申请退款 8-终止采购 9-添加发货 10-不等待余货 11提交审核 12导出采购单
	Index： 操作列索引
	*/
	private OperateGroup(OpeIndex:number, Index?: number): void{
		this.$set(this, 'AccurateSearch', false);
		if(Index !== undefined){
			this.CancelSelect();
		}
		
		switch(OpeIndex){
			case 1:
				(this as any).$refs.ModifyPon.TriggerModal([JSON.parse(JSON.stringify(this.List[Index as number]))])
			break;
			case 2:
				(this as any).$refs.PonDetails.TriggerModal([JSON.parse(JSON.stringify(this.List[Index as number]))])
				this.DetailsModal = true;
			break;
			case 3:
			case 4:
			case 5:
				(this as any).$refs.ReviewPon.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], Index !== undefined ? false : true, this.DropPurchaserList, OpeIndex-2)
			break;
			case 6:
				this.CurrentPon = 4;
				if(this.DropFinanceList.length < 1){
					this.GetFinanceList()
				}
				(this as any).$refs.ApplyFinanceOrder.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))])
			break;
			case 7:
				this.CurrentPon = 5;
				if(this.DropFinanceList.length < 1){
					this.GetFinanceList()
				}
				(this as any).$refs.ApplyFinanceOrder.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))])
			break;
			case 8:
				(this as any).$refs.PreventPon.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], 6)
			break;
			case 9:
				(this as any).$refs.AddShiped.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], this.DropWarehouseList)
			break;
			case 10:
				(this as any).$refs.PreventPon.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], 7)
			break;
			case 11:
				if(!(this.Selected.every( (Item) => { return Item.Status==1 && Item.PurchaseManagerName !== "" }))){
					this.$UI.Tips.Floating('warning', `请选择状态为新建并且已选择采购主管的采购单进行操作`);
					return;
				}
				this.ConfirmSubmitReview()
			break;
			case 12:
				(this as any).$refs.ExportPon.TriggerModal(this.Selected)
			break;
		}
	}

	//列表操作列操作按钮显隐 
	/* (Idx) 1-编辑  2-查看 3-采购主管审核 4-销售主管审核 5-总经理审核 6-申请付款 7-申请退款 8-终止采购 9-添加发货 10-不等待余货
	 * (Data) 当前行数据
	 */
	private ControlOpera(Idx: number, Data:Interface.PurchaseOrd){
		if((Idx == 1 && Data.Status === 1) || Idx == 2 || (Idx == 3 && Data.Status === 2) || (Idx == 4 && Data.Status === 3) || (Idx == 5 && Data.Status === 10) || (Idx == 6 && Data.Status === 9 && Data.PayStatus === 1)){
			return 'block';
		}

		//状态为 待付款、待发货、待签收、待入库、部分入库, 且未申请退款
		if((Data.Status === 4 || Data.Status === 5 || Data.Status === 6 || Data.Status === 7 || Data.Status === 9) && Data.RefundStatus == 1 && Idx == 7 ){
			return 'block';
		}

		//状态为 新建、待付款且未申请付款、待付款且已申请退款、待发货且已申请退款的普通采购单可执行
		if(((Data.Status == 1) || (Data.Status == 9 && Data.PayStatus == 1) || ((Data.Status == 9 || Data.Status == 4) && Data.RefundStatus == 2)) && Idx == 8){
			return 'block';
		}

		//状态为 待发货、待签收、待入库、部分入库 的普通采购单可执行；
		if((Data.Status == 4 || Data.Status == 5 || Data.Status == 6 || Data.Status == 7) && Idx == 9){
			return 'block';
		}

		if(((Data.Status == 7 || Data.Status == 6 || Data.Status == 5) && Data.RefundStatus == 2) && Idx == 10){
			return 'block';
		}
		
		return 'none'
	}

  //获取财务下拉
  private GetFinanceList():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.GetUserDropList
      },
      Data: "财务",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropFinanceList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

	//确认提交审核
	private ConfirmSubmitReview(): void{
		this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content:'是否确认执行提交审核操作',
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostSubmitReview()
    		}
    	}
    })
	}

	//请求提交审核操作
	private PostSubmitReview():void{
		let postData = this.Selected.map( (Item: Interface.PurchaseOrd):number => Item.Id)
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderToReview,
				Login: true
			},
			Data: postData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$UI.Tips.Floating('success', `提交审核成功`);
          this.GetList()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	//组件回调
	private HandleRes(Res: boolean):void{
		this.$set(this, 'DetailsModal', false)
		if(Res){
      this.GetList()
		}
	}

	private Powers: PInterface.Power = {}  // 权限
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
	private TriggerModifySupplier: boolean = false // 控制“添加/编辑供应商”模态框展示
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
	private DropPurchaserList: PInterface.KV[] = [];  //采购员下拉
	private DropFinanceList: PInterface.KV[] = [];  //财务下拉
	private DropSaleManagerList: PInterface.KV[] = [];  //销售主管下拉
	private DropSupplyIdList: PInterface.KV[] = [];  //供应商下拉
	private RemoteSupplyList: PInterface.KV[] = [];  //搜索后供应商下拉
  private DropSourceTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.SourceType)  //来源下拉
  private DropOrderStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.OrderStatus)  //状态下拉
  private DropFinanceApplyStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.FinanceApplyStatus)  //付款、退款下拉
	private DropOrderCompleteStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.OrderCompleteStatus)  //完成情况下拉
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.OrderSearchType)	//关键词下拉
	private SupplyLoading: boolean = false; //供应商下拉是否正在搜索
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private SearchForm: Interface.PurchaseOrdSearch = new Interface.PurchaseOrdSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: Interface.PurchaseOrd[] = [] // 列表选中数据
	private List: Interface.PurchaseOrd[] = [] // 列表数据源

	private DetailsModal: boolean = false;	//详情模态框标识
	private CurrentPon: number = 0;	//当前操作标识

	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ type: 'expand', width: 40, align: 'center', render: (h: any, params: any): string => {
				return h(ExpandRow, {
					props: {
						row: params.row
					}
				})
			}
		},
		{ title: '采购单号/平台单号', key: 'SupplyName', width: 160, render: (h: any, params: any): string => {
			return h('div', {
				class: "P-MT-5 P-MB-5"
			}, [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '采'),
					h('span', { }, params.row.PurchaseCode)
				]),
        h('p', {
          style: {
            fontWeight: '500',
            textOverflow: 'unset',
            whiteSpace: 'unset'
          }
        }, [
          h('span', { attrs: { class: 'P-Table-Tip P-BG-Primary' } }, '平'),
          params.row.ThirdOrderCode !== "" ? h('a', {
            attrs: {
              href: 'https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + params.row.ThirdOrderCode,
              target: '_blank'
            }
          }, params.row.ThirdOrderCode == "" ? "-" : params.row.ThirdOrderCode) : h('span', { }, '-')
        ])
			])
		} },
		{ title: '来源/产品种类数', key: '', width: 130, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '来'),
					h('span', { }, this.$Enums.Purchase.SourceType[params.row.SourceType])
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '数'),
					h('span', { }, params.row.ItemCount)
				]),
			])
		} },
		{ title: '仓库/供应商', width: 200, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '仓'),
					h('span', { }, params.row.WarehouseName)
				]),
				h('Tooltip', {
					props: {
						'content': params.row.SupplyName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', { class: 'P-Table-Tip P-BG-Primary' }, "供"),
						h('span', params.row.SupplyName)
					])
				])
			])
		} },
		{ title: '订单总价/已入库金额', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '总'),
					h('span', { }, '￥'+(params.row.TotalPrice + params.row.ShippingCost).toFixed(2))
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '入'),
					h('span', { }, '￥'+params.row.InStoragePrice)
				]),
			])
		} },
		{ title: '采购员', key: 'PurchaserName', width: 80, render: (h: any, params: any): string => {
			return h('span', params.row.PurchaserName == "" ? "-" : params.row.PurchaserName)
		} },
		{ title: '备注', key: 'Remark', render: (h: any, params: any): string => {
			return params.row.Remark === "" ? h('span', '-') : h('Tooltip', {
					props: {
						'content': params.row.Remark,
						'maxWidth': 300
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', params.row.Remark)
					])
				])
		} },
		{ title: '采购单状态', key: 'Status',  width: 100, render: (h: any, params: any): string => {
			return h('span', this.$Enums.Purchase.OrderStatus[params.row.Status])
		} },
		{ title: '申请付款', key: 'Phone', width: 85, render: (h: any, params: any): string => {
				return h('Icon', {
          props: { 
            type: params.row.PayStatus === 2 ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: params.row.PayStatus === 2 ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
		{ title: '申请退款', key: 'Phone', width: 85, render: (h: any, params: any): string => {
				return h('Icon', {
          props: { 
            type: params.row.RefundStatus === 2 ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: params.row.RefundStatus === 2 ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
		{ title: '创建时间/预计到货日期', key: '' ,width: 170, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '创'),
					h('span', this.$UI.Render.Date(params.row.CreateTime, true))
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '到'),
					h('span', this.$UI.Render.Date(params.row.ExpectedTime, false))
				])
			])
		} },
		{
			title: '操作',width: 100,render: (h: any, params: any): string => {
				return h('Dropdown',{
					on: {
						'on-click': (name: any) => {
							this.OperateGroup(name, params.row._index)
						}
					}
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: item.Value
							},
							class: "P-TA-C",
							style: { display: this.ControlOpera(Number(item.Value), params.row) },
						}, item.Key);
					}))
				])
			}
		}
	]
}

</script>
<style lang="less"></style>
