<!--付款单管理、退款单管理 公用组件-->
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
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选费用类型" v-if="Flag === 1" v-model="SearchForm.PayType" :options="PayTypeDrop" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选费用类型" v-if="Flag === 2" v-model="SearchForm.RefundType" :options="RefundTypeDrop" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="StatusDrop" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选申请人" v-model="SearchForm.Creator" :options="CreatorDrop" />
          <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="筛选经办人" v-model="SearchForm.Operator" :options="OperatorDrop" />
          <div class="P-ML-10 P-Inline-Block P-MT-10 P-VA-T">
            <Select placeholder="筛选时间类型" class="P-W-150" v-model="SearchForm.TimeType" :options="TimeTypeDrop" />
            <DatePicker class="P-W-200 P-ML-10" style="margin-left: -5px;" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
          </div>
          <span class="P-ML-10 P-Inline-Block P-VA-T" style="margin-top: 15px;">-</span>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10 P-VA-T" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
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
      <Button type="primary" v-if="(Powers.PayOrderAdd && Flag === 1) || (Powers.RefundOrderCreate && Flag === 2)" @click="OpenCreate" class="P-MR-10 P-MB-10">添加{{Flag === 1 ? '付款单' : '退款单'}}</Button>
      <Button type="primary" v-if="(Powers.PayOrderToReview && Flag === 1) || (Powers.RefundOrderToReview && Flag === 2)" @click="ValidateOpePon(2)" class="P-MR-10 P-MB-10">提交审核</Button>
      <Button type="primary" v-if="(Powers.PayOrderReview && Flag === 1) || (Powers.RefundOrderReview && Flag === 2)" @click="ValidateOpePon(3)" class="P-MR-10 P-MB-10">完成{{Flag === 1 ? '付款' : '退款'}}</Button>
      <Button type="primary" v-if="(Powers.PayOrderReview && Flag === 1) || (Powers.RefundOrderReview && Flag === 2)" @click="ValidateOpePon(1)" class="P-MR-10 P-MB-10">退回修改</Button>
      <Button type="primary" v-if="(Powers.PayOrderReview && Flag === 1) || (Powers.RefundOrderReview && Flag === 2)" @click="ValidateOpePon(4)" class="P-MR-10 P-MB-10">终止{{Flag === 1 ? '付款' : '退款'}}</Button>
      <Button type="primary" v-if="(Powers.PayOrderExport && Flag === 1) || (Powers.RefundOrderExport && Flag === 2)" @click="ExportData" class="P-MR-10 P-MB-10">导出{{Flag === 1 ? '付款单' : '退款单'}}</Button>
			<OpenPayPage ref="OpenPayPage" v-if="Powers.OpenPayPage && Flag === 1" @handle-pay="HandlePayPage" />
		</Col> 
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="PurchaseOrder"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Col span="0">
		<Modal v-model="DetailsModal" title="采购单详情" class-name="Container-Tabs" :mask-closable="false" @on-cancel="HandleRes(false)" :width="1200">
      <PonDetails ref="PonDetails" :PonPurchaseOrd="CurrDetailData" :HideArrival="false" />
			<footer slot="footer">
				<Button @click="HandleRes(false)">返回</Button>
			</footer>
    </Modal>
    <PayManageOperate ref="PayManageOperate" @emit-handle="HandleRes" />
    <ApplyFinanceOrder ref="ApplyFinanceOrder" :CurrentPon="CurrentPon" :DropFinanceList="OperatorDrop" @emit-purchase="HandleRes" />
    <ViewTransactions ref="ViewTransactions" />
    </Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Finance';
/*interface end*/

@Component({
	name: 'Transactions',
	components: {
		PonDetails: () => import('@/components/Purchase/Purchase/PonDetails.vue'),
    ApplyFinanceOrder: () => import('@/components/Purchase/Purchase/ApplyFinanceOrder.vue'),
		PayManageOperate: () => import('@/components/Finance/PayManageOperate.vue'),
    OpenPayPage: () => import('@/components/Finance/OpenPayPage.vue'),
    ViewTransactions: () => import('@/components/Finance/ViewTransactions.vue'),
	}
})

export default class Transactions extends Vue {
  @Prop() Flag: number

	private mounted() {
    this.GetPoints();
    this.SearchKeyTypeDrop = this.Flag === 1 ? this.$Utils.GetEnumArr(this.$Enums.Finance.PayManageKeyType) : this.$Utils.GetEnumArr(this.$Enums.Finance.RefundManageKeyType);
    this.CurrentPon = this.Flag === 1 ? 4 : 5;
	}

	private async GetPoints(): Promise<void>  {
		this.$UI.Loading.Show();
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PayOrderAdd', 'PayOrderToReview', 'PayOrderModify', 'PayOrderReview', 'PayOrderExport', 'OpenPayPage', 'RefundOrderCreate', 'RefundOrderModify','RefundOrderToReview','RefundOrderReview', 'RefundOrderExport']));
    this.$set(this, 'CreatorDrop', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "" ) )
    this.$set(this, 'OperatorDrop', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "财务" ) )
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

	// 获取列表
	private GetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.CancelSelect();
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.StartTime = SearchForm.StartTime === "" ? "" : this.$UI.Render.NewDate(SearchForm.EndTime, true)
    SearchForm.EndTime = SearchForm.EndTime === "" ? "" : this.$UI.Render.NewDate(SearchForm.EndTime, true)
    this.Flag === 1 ? delete SearchForm.RefundType : delete SearchForm.PayType;
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.Flag === 1 ? this.$Api.PayOrderGetList : this.$Api.RefundOrderGetList,
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
		this.Powers.PayOrderModify ? Drops.push({ Key: '编辑', Value: 5 }) : null;
		this.Powers.PayOrderReview ? Drops.push({ Key: `完成${this.Flag === 1 ? '付款' : '退款'}`, Value: 3 }) : null;
		this.Powers.PayOrderReview ? Drops.push({ Key: '退回修改', Value: 1 }) : null;
		this.Powers.PayOrderReview ? Drops.push({ Key: `终止${this.Flag === 1 ? '付款' : '退款'}`, Value: 4 }) : null;
		Drops.push({ Key: '查看', Value: 6 })
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ( (this.Flag === 1 && ['PayOrderAdd', 'PayOrderToReview', 'PayOrderReview', 'PayOrderExport', 'OpenPayPage'].includes(Item)) || (this.Flag === 2 && ['RefundOrderCreate', 'RefundOrderToReview', 'RefundOrderReview', 'RefundOrderExport'].includes(Item))) ){
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
  private GetSelected(Data: Interface.ApplyFinanceList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["PurchaseOrder"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.PayManageSearch())
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
  
  private OpenCreate(): void{
		this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();
    this.Selected.push(new Interface.ApplyFinanceList());
		(this as any).$refs.ApplyFinanceOrder.TriggerModal(this.Selected, this.Flag === 1 ? 1 : 3);
  }

	//转接功能操作验证
	private ValidateOpePon(Val: number):void{
    if (!this.Selected.length) {
			this.$UI.Tips.Floating('warning', `请选择付款单进行操作`);
			return;
    }
    
		if( (Val === 1 || Val === 3 || Val === 4 || Val === 7) && !this.Selected.every(Item => Item.Status === 2) ){
      this.$UI.Tips.Floating('warning', '请选择状态为待审核的付款单进行操作');
      return;
    }

    if(Val === 2 && !this.Selected.every(Item => Item.Status === 1) ){
      this.$UI.Tips.Floating('warning', '请选择状态为新建的付款单进行操作');
      return;
    }

		this.OperateGroup(Val)
	}

	/*
	列表操作列操作按钮触发方法  
	OpeIndex:
	Index： 操作列索引
	*/
	private OperateGroup(OpeIndex:number, Index?: number): void{
		this.$set(this, 'AccurateSearch', false);
		if(Index !== undefined){
			this.CancelSelect();
		}
    
    switch(OpeIndex){
      case 1:
      case 2:
      case 3:
      case 4:
        (this as any).$refs.PayManageOperate.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], OpeIndex, this.Flag)
        break;
      case 5:
				(this as any).$refs.ApplyFinanceOrder.TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], this.Flag === 1 ? 2 : 4);
        break;
      case 6: 
        (this as any).$refs.ViewTransactions.TriggerModal(this.List[Index as number], this.Flag)
        break;
			case 7:
				(this as any).$refs.OpenPayPage.TriggerModal(this.Selected)
				break;
    }
	}

	//列表操作列操作按钮显隐 
	/* (Idx)    1-退回修改 3-完成付款 4-终止付款 5-编辑 6-查看
	 * (Data) 当前行数据
	 */
	private ControlOpera(Idx: number, Data:Interface.ApplyFinanceList) :string{
    if( Idx === 6 || (Idx === 5 && Data.Status == 1) || ((Idx === 1 || Idx === 3 || Idx === 4) && Data.Status == 2) ){
      return 'block'
    }else{
      return 'none'
    }
	}
	
	private ExportData(): void{
		this.$UI.Loading.Show();
		let SearchForm = JSON.parse(JSON.stringify(this.SearchForm))
		SearchForm.StartTime = SearchForm.StartTime === "" ? "" : this.$UI.Render.NewDate(SearchForm.EndTime, true)
		SearchForm.EndTime = SearchForm.EndTime === "" ? "" : this.$UI.Render.NewDate(SearchForm.EndTime, true)

		let Obj = {
			Conditions:{
				"PayType": SearchForm.PayType,
				"RefundType": SearchForm.RefundType,
				"Creator": SearchForm.Creator,
				"Operator": SearchForm.Operator,
				"Status": SearchForm.Status,
				"SearchKeyType": SearchForm.SearchKeyType,
				"SearchKey": SearchForm.SearchKey,
				"BeginTime": SearchForm.StartTime,
				"EndTime": SearchForm.EndTime,
				"TimeType": SearchForm.TimeType
			}
    }
    this.Flag === 1 ? delete Obj.Conditions["RefundType"] : delete Obj.Conditions["PayType"]
  	
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.Flag === 1 ? this.$Api.PayOrderExport : this.$Api.RefundOrderExport,
				Login: true
			},
			Data: Obj,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出${this.Flag === 1 ? "付款单" : '退款单'}任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (Res: boolean):void => {
            }
          });
				} else {
					this.$Request.Error(res);
        }
				this.$UI.Loading.Hide();
			}
		})
	}

  private ShowPurDetail(Data: Interface.ApplyFinanceList){
		this.CurrDetailData = Data.SourceCode;
		this.DetailsModal = true;
		this.$nextTick(()=>{
			setTimeout(()=>{
				(this as any).$refs.PonDetails.TriggerModal([])
			}, 100)
		})
  }
  
  //组件回调
  private HandleRes(B: boolean): void{
    this.$set(this, 'DetailsModal', false);
    
    if(B){
      this.GetList();
    }
	}
	
	// 1-打开 3-完成付款 4-取消
	private HandlePayPage(N: number): void{
		if(N === 1){
			this.ValidateOpePon(7)
		}else if(N === 3){
			this.OperateGroup(3)
		}else{
			this.CancelSelect();
		}
	}

  private DetailsModal: boolean = false; //控制详情模态框
  private CurrDetailData: string = "";
  private CurrentPon: number = 0;

	private Powers: PInterface.Power = {}  // 权限
  private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private PayTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Finance.PayType)	//付款类型下拉
  private RefundTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Finance.RefundType)	//退款类型下拉
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.MaterielApplyStatus)	//状态下拉
  private TimeTypeDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Finance.PayManageTimeType)	//时间类型下拉
  private CreatorDrop: PInterface.KV[] = [];
  private OperatorDrop: PInterface.KV[] = [];
	private SearchKeyTypeDrop: PInterface.KV[] = []	//关键词下拉
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private SearchForm: Interface.PayManageSearch = new Interface.PayManageSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: Interface.ApplyFinanceList[] = [] // 列表选中数据
	private List: Interface.ApplyFinanceList[] = [] // 列表数据源
	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ title: this.Flag === 1 ? '付款单号/来源单据' : '退款单号/来源单据', key: 'SupplyName', width: 160, render: (h: any, Params: any): string => {
			return h('div', {
				class: "P-MT-5 P-MB-5"
			}, [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, this.Flag === 1 ? '付' : '退'),
					h('span', this.Flag === 1 ? Params.row.PayCode : Params.row.RefundCode)
				]),
        h('p', {
          on: {
            click: () => {
              this.ShowPurDetail(Params.row)
            }
          },
          class: 'P-Pointer'
        }, [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '来'),
					h('span', Params.row.SourceCode)
				])
			])
    } },
    { title: '货品金额', width: 160, render: (h: any, Params: any): string => h('span', `${Params.row.GoodsAmount} ${Params.row.GoodsCurrency}`) },
		{ title: '费用类型', width: 120, render: (h: any, Params: any): string => { 
      return h('span', this.Flag === 1 ? (this.PayTypeDrop.find(Item => Item.Value === Params.row.PayType) as PInterface.KV).Key : (this.RefundTypeDrop.find(Item => Item.Value === Params.row.RefundType) as PInterface.KV).Key)
    } },
		{ title: '运费', width: 100, render: (h: any, Params: any): string => h('span', `${Params.row.ShippingAmount} ${Params.row.ShippingCurrency}`) },
		{ title: '总金额', width: 160, render: (h: any, Params: any): string => { 
      let Amount = this.Flag === 1 ? Params.row.PayAmount : Params.row.RefundAmount;
      return h('span', `${Amount} ${Params.row.GoodsCurrency}`) 
    } },
		{ title: '平台单号', width: 140, render: (h: any, Params: any): string => {
      return Params.row.PlatformOrderId === "" ? h('span', '-') : h('a', {
        attrs: { 
          href: 'https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + Params.row.PlatformOrderId,
          target: '_blank'
        }
      }, Params.row.PlatformOrderId)
    } },
		{ title: '申请人/经办人',  width: 120, render: (h: any, Params: any): string => {
			return h('div', {
				class: "P-MT-5 P-MB-5"
			}, [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '申'),
					h('span', { }, Params.row.CreatorName)
				]),
        h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '经'),
					h('span', { }, Params.row.OperatorName)
				])
			])
    } },
    { title: '备注', key: 'Remark', render: (h: any, Params: any): string => {
      return Params.row.Remark === "" ? h('span', '-') : h('Tooltip', {
        props: {
          'content': Params.row.Remark,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', { class: 'P-LINE-1' }, Params.row.Remark)
      ])
    } },
		{ title: '创建时间/最后操作时间', key: '' ,width: 170, render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, '创'),
          h('span', this.$UI.Render.Date(Params.row.CreateTime, true))
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, '操'),
          h('span', this.$UI.Render.Date(Params.row.OperateTime, true))
        ])
      ])
    } },
    { title: '状态', width: 80, render: (h, Params) => {
      return h('span', (this.StatusDrop.find(Item=> Item.Value===Params.row.Status) as PInterface.KV).Key )
    } },
		{
			title: '操作',width: 100, render: (h: any, Params: any): string => {
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
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: item.Value
							},
							class: "P-TA-C",
							style: { display: this.ControlOpera(Number(item.Value), Params.row) },
						}, item.Key);
					}))
				])
			}
		}
	]
}

</script>
<style lang="less"></style>
