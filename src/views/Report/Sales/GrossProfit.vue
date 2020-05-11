<!--预算毛利报表、已确认毛利报表 公用组件-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
           <Select v-model="SearchForm.Platform" class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" :options="PlatformDrop" />
           <Select class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.StoreId" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
           <Select class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.Country" placeholder="筛选国家" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
           <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选发货仓" v-model="SearchForm.ShipWarehouseId" :options="DropWarehouseList" />
           <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流渠道" v-model="SearchForm.ShipMethodId" ref="ShipMethod" :options="DropShipMethodList" optionValKey="Id" optionKey="Name" />
            <!-- <Select v-model="SearchForm.Platform" filterable clearable class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" @on-change="OnClearSelect('Platform')">
              <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable placeholder="筛选店铺" ref="Store">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.Country" @on-change="OnClearSelect('Country')" filterable clearable placeholder="筛选国家">
              <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryCode">{{Item.CountryNameCn}}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选发货仓" @on-change="OnClearSelect('ShipWarehouseId')" v-model="SearchForm.ShipWarehouseId" filterable clearable>
              <Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流渠道" @on-change="OnClearSelect('ShipMethodId')" v-model="SearchForm.ShipMethodId" filterable clearable ref="ShipMethod">
              <Option v-for="Item in DropShipMethodList" :value="Item.Id" :key="Item.Id">{{Item.Name}}</Option>
            </Select> -->
            <div class="P-ML-10 P-Inline-Block P-MB-10 P-VA-T">
              <Select placeholder="筛选时间类型" class="P-W-150" v-model="SearchForm.TimeType" :options="TimeTypeDrop" />
              <!-- <Select placeholder="筛选时间类型" class="P-W-150" @on-change="OnClearSelect('TimeType')" v-model="SearchForm.TimeType" filterable clearable>
                <Option v-for="(Item, Index) in TimeTypeDrop" :value="$Enums.Warehouse.TimeType[Item]" :key="Index">{{ Item }}</Option>
              </Select> -->
              <DatePicker class="P-W-200 P-ML-10" style="margin-left: -5px;" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
            </div>
            <span class="P-ML-10 P-MT-5 P-Inline-Block P-VA-T">-</span>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-T" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
            <Select placeholder="筛选数据类型" class="P-W-200 P-ML-10 P-VA-T" v-model="SearchForm.DataType" :options="DataTypeDrop" />
              <Select placeholder="筛选比较类型" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" v-model="SearchForm.CompareType" :options="CompareTypeDrop" />
            <!-- <Select placeholder="筛选数据类型" class="P-W-200 P-ML-10 P-VA-T" @on-change="OnClearSelect('DataType')" v-model="SearchForm.DataType" filterable clearable>
              <Option v-for="(Item, Index) in DataTypeDrop" :value="$Enums.Report.DataType[Item]" :key="Index">{{ Item }}</Option>
            </Select>
            <Select placeholder="筛选比较类型" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" @on-change="OnClearSelect('CompareType')" v-model="SearchForm.CompareType" filterable clearable>
              <Option v-for="(Item, Index) in CompareTypeDrop" :value="$Enums.Report.CompareType[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
            <InputNumber class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.CompareValue" placeholder="输入比较数值(毛利率请输入1以内)" :max="Max" :step="Step"></InputNumber>
            <Select v-if="Flag === 1" placeholder="筛选导入类型" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" v-model="SearchForm.ImportFreightType" :options="ImportTypeDrop" />
            <!-- <Select v-if="Flag === 1" placeholder="筛选导入类型" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" @on-change="OnClearSelect('ImportFreightType')" v-model="SearchForm.ImportFreightType" filterable clearable>
              <Option v-for="(Item, Index) in ImportTypeDrop" :value="$Enums.Report.ImportFreightType[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
          <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Report.GrossProfitType[Item]" :key="Index">{{Item}}</Option>
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
      <ExportSalesProfit v-if="Powers.ExportData" ref="ExportSalesProfit" @export-profit="ExportData" />
      <Button v-if="Powers.RecomputeGross" type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="RecomputeGross">重算毛利</Button>
      <ImportTwoStageFreight v-if="Powers.ImportTwoStageFreight && Flag === 1" ref="ImportTwoStageFreight" @import-profit="ChangeImport" />
    </Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="GrossProfitTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <SaleGrossOpeHistory ref="SaleGrossOpeHistory" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'GrossProfit',
  components:{
    ExportSalesProfit: () => import('@/components/Report/Sales/ExportSalesProfit.vue'),
    SaleGrossOpeHistory: () => import('@/components/Report/Sales/SaleGrossOpeHistory.vue'),
    ImportTwoStageFreight: () => import('@/components/Report/Sales/ImportTwoStageFreight.vue'),
  }
})
export default class GrossProfit extends Vue {
  @Prop() private Flag: number    //1-预算毛利报表 2已确认毛利报表

  @Watch('SearchForm.ShipWarehouseId')
  private ChangeShipWarehouseId(Val: number | ''):void{
    this.SearchForm.ShipMethodId = '';
    if (this.DropShipMethodList.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.DropShipMethodList = [];
    if (Val != '') {
      this.GetShipMethodDrop(Val);
    }
  }

  @Watch('SearchForm.Platform')
  private ChangePlatForm(Val: number | ''):void{
    this.SearchForm.StoreId = '';
    if (this.StoreDrop.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.StoreDrop = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  @Watch('SearchForm.CompareValue')
  private ChangeCompareValue(Val: number):void{
    if(Val === null){
      this.SearchForm.CompareValue = 0;
    }
    if(this.SearchForm.DataType == 2 && Val > 1){
      this.SearchForm.CompareValue = 0;
      this.$UI.Tips.Floating('warning', '毛利率请输入1以内的小数')
    }
  }

  @Watch('SearchForm.DataType')
  private ChangeDataType(Val: number):void{
    this.SearchForm.CompareValue = 0;
    if(Val == 2){
      this.Step = 0.1;
      this.Max = 1;
    }else{
      this.Step = 1;
      this.Max = 9999;
    }
  }

	private mounted() :void {
    this.GetWarehouseList();
    this.GetCountryDropList();
    this.DifferCol();
    this.GetPoints();
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportData', 'RecomputeGross', 'ImportTwoStageFreight']))
    this.$set(this.SearchForm, 'IsConfirm', this.Flag === 1 ? false : true)
    this.GetList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  private GetCountryDropList(): void{
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountryList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取平台下的所有店铺
  private GetStoreDropList(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[Val].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取物流渠道
  private GetShipMethodDrop(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: Val,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DropShipMethodList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //组装成级联菜单所要的数据结构
	private SetTreeMenu(Data: PInterface.ProductCagtegoryTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}

  //仓库下拉
  private GetWarehouseList(){
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropWarehouseList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  //获取列表复选框选中的数据
  private GetSelected(Data: Interface.GrossProfitList[] ): void{
    this.$set(this, 'Selected', Data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["GrossProfitTb"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	//获取列表
  private GetList(): void{
    this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();
    this.$UI.Loading.Show();
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.StartTime = SearchGroup.StartTime === "" ? "" : this.$UI["Render"].NewDate(SearchGroup.StartTime, true)
    SearchGroup.EndTime = SearchGroup.EndTime === "" ? "" : this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
    this.$set(this, 'List', [])
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.StatisticsSalesTradingProfit,
				Login: true
			},
			Data: { Conditions: SearchGroup, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
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
	
	//搜索
  private SearchList(): void{
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    let Begin = new Date(SearchForm.StartTime).getTime()
    let End = new Date(SearchForm.EndTime).getTime()

    if(SearchForm.StartTime === "" && SearchForm.EndTime !== ""){
      this.$UI.Tips.Floating('warning', '请选择开始时间')
      return
    }
    if(SearchForm.StartTime !== "" && SearchForm.EndTime === ""){
      this.$UI.Tips.Floating('warning', '请选择结束时间')
      return
    }

    if(Begin > End) {
      this.$UI.Tips.Floating('warning', '开始时间不能晚于结束时间')
      return
    }

    if((End - Begin) / 86400000 > 30) {
      this.$UI.Tips.Floating('warning', '筛选订单时间区间最多只能30天')
      return
    }
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.GrossProfitSearch())
    this.$set(this.SearchForm, 'IsConfirm', this.Flag === 1 ? false : true)
		this.GetList();
	}
	
	//切换列表条数
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex',N);
		this.GetList();
	}
	
	// 计算列表高度
	private CalculateTbHeight(): number {
		let F: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				F = 255;
			}
		}
		return (window.innerHeight - F);
  }
  
  //导出数据
  private ExportData(B:boolean): void{
    if(B){
      let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
      SearchForm.StartTime = SearchForm.StartTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.StartTime, true)
      SearchForm.EndTime = SearchForm.EndTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.EndTime, true)
      let Begin = new Date(SearchForm.BeginTime).getTime()
      let End = new Date(SearchForm.EndTime).getTime()
      if(SearchForm.StartTime == '' || SearchForm.EndTime == ''){
        this.$UI.Tips.Floating('warning','请选择开始时间和结束时间');
        return
      }
      
      if (!SearchForm.TimeType) {
        this.$UI.Tips.Floating('warning', '请选择时间类型')
        return
      }
      
      if ((End - Begin) / 86400000 > 31) {
        this.$UI.Tips.Floating('warning', '筛选订单时间区间最多只能31天')
        return
      }
  
      if (Begin > End) {
        this.$UI.Tips.Floating('warning', '开始时间不能晚于结束时间')
        return
      }
      (this.$refs.ExportSalesProfit as any).Trigger(SearchForm, this.Pager.PageIndex, this.Pager.PageSize)
    }
  }

  private RecomputeGross():void{
    let ShipOrdeIds: number[] = [];
    if(this.Selected.length < 1){
      this.$UI.Tips.Floating('warning','请选择数据进行重算毛利操作');
      return
    }else{
      for(let Item in this.Selected){
        ShipOrdeIds.push(this.Selected[Item].ShipOrderId)
      }
    }

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.ReCalculateTradingProfit,
				Login: true
			},
			Data: ShipOrdeIds,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$UI.Tips.Floating('success','重算毛利成功');
          this.CancelSelect();
          this.GetList();
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private ChangeImport(N: boolean): void{
    if(N){
      this.CancelSelect();
      this.GetList();
    }
  }

  private DifferCol(): void{
    if(this.Flag === 1){
      this.Cols.splice(7, 0, { title: '头程运费/尾程运费', render: (h: any, Params: any): string => {
        return h('div', [
          h('p', [
            h('span', { class: 'P-Table-Tip P-BG-Primary' }, '头'),
            h('span', Params.row.FirstFreight+" USD")
          ]),
          h('p', [
            h('span', { class: 'P-Table-Tip P-BG-Primary' }, '尾'),
            h('span', Params.row.SecondFreight+" USD")
          ]),
        ])
      } })
    }
  }

  private Max: number = 9999;
  private Step: number = 1;
  private Powers: PInterface.Power = {}  // 权限
  private TimeTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TimeType);   // 时间类型下拉
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private DataTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.DataType);  //数据类型下拉
  private CompareTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.CompareType);  //比较类型下拉
  private ImportTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.ImportFreightType);  //导入类型下拉
  private StoreDrop: PInterface.KV[] = [];
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropShipMethodList: PInterface.IdName[] = [];  // 渠道下拉 
  // private StatusDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); //状态下拉
  private SearchKeyTypeDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.Report.GrossProfitType);  //关键词下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.GrossProfitSearch = new Interface.GrossProfitSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.GrossProfitList[] = []; //列表数据
	private Selected: Interface.GrossProfitList[] = []; //勾选数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '发货单号/跟踪号', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '发'),
					h('span', Params.row.ShipOrderCode)
        ]),
        h('Tooltip', {
					props: {
						'content': Params.row.TrackingNumber,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', { class: 'P-Table-Tip P-BG-Primary' }, "跟"),
						h('span',Params.row.TrackingNumber === "" ? '-' : Params.row.TrackingNumber)
					])
				])
			])
    } },
    { title: '平台/店铺', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '平'),
					h('span', Params.row.Platform)
        ]),
        h('Tooltip', {
					props: {
						'content': Params.row.StoreName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', { class: 'P-Table-Tip P-BG-Primary' }, "店"),
						h('span',Params.row.StoreName === "" ? '-' : Params.row.StoreName)
					])
				])
			])
    } },
    { title: '发货仓/物流渠道', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '仓'),
					h('span', Params.row.ShipWarehouseName)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '渠'),
					h('span', Params.row.ShipMethodName)
				]),
			])
    } },
    { title: '国家', width:150, key: 'Country' },
    { title: '订单金额/成本/退款金额', render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '订'),
					h('span', Params.row.OrderTotal+" USD")
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '成'),
					h('span', Params.row.OrderCost+" USD")
        ]),
        h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '退'),
					h('span', Params.row.RefundAmount+" USD")
				]),
			])
    } },
    { title: '汇损/平台佣金/Paypal手续费', render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '汇'),
					h('span', Params.row.ExchangeLoss+" USD")
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '平'),
					h('span', Params.row.PlatformCommission+" USD")
        ]),
        h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '手'),
					h('span', Params.row.PaypalServiceCharge+" USD")
				]),
			])
    } },
    { title: '重量/运费', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '量'),
					h('span', Params.row.Weight+" KG")
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '运'),
					h('span', Params.row.OrderFreight+" USD")
				]),
			])
    } },
    { title: '毛利/毛利率(USD)', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '利'),
					h('span', Params.row.Profit)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '率'),
					h('span', Params.row.ProfitRate + '%')
				]),
			])
    } },
    { title: '平台下单时间/付款时间/发货时间', width: 215, render: (h: any, Params: any): string => {
			return h('div', {class: 'P-MT-5 P-MB-5'}, [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '下'),
					h('span', this.$UI.Render.Date(Params.row.PlatOrderTime, true))
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '付'),
					h('span', this.$UI.Render.Date(Params.row.PaidTime, true))
        ]),
        h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '发'),
					h('span', this.$UI.Render.Date(Params.row.ShipedTime, true))
				])
			])
    } },
    { title: '操作', align: 'center', width: 120, render: (h: any, Params: any): string => {
      return h('div', [
        h('Button',{
          props: {
            type: 'primary',
            size: 'small'
          },
          on: {
            click: () => {
              this.CancelSelect();
              this.$set(this, 'AccurateSearch', false);
              (this.$refs.SaleGrossOpeHistory as any).TriggerModal(Params.row)
            }
          }
        }, '查看操作日志'),
      ]);
    } }
	]
}

</script>
<style lang="less"></style>
