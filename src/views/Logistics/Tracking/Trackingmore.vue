<!--物流跟踪-->
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
           <Select class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.CountryCode" placeholder="筛选国家" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
           <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选发货仓" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
           <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流渠道" v-model="SearchForm.ShippingMethodId" ref="ShipMethod" :options="DropShipMethodList" optionValKey="Id" optionKey="Name" />
           <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选包裹状态" v-model="SearchForm.PackageStatus" :options="DropPackageStatus" />
            <div class="P-ML-10 P-Inline-Block P-MB-10 P-VA-T">
              <Select placeholder="筛选时间类型" class="P-W-150" v-model="SearchForm.SearchTimeType" :options="TimeTypeDrop" />
              <DatePicker class="P-W-200 P-ML-10" style="margin-left: -5px;" v-model="SearchForm.BeginTime" type="datetime" placeholder="开始时间"></DatePicker>
            </div>
            <span class="P-ML-10 P-MT-5 P-Inline-Block P-VA-T">-</span>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-T" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
            <Select placeholder="筛选时效类型" class="P-W-200 P-ML-10 P-VA-T" v-model="SearchForm.SearchTimeLimitType" :options="DataTypeDrop" />
            <Select placeholder="筛选比较类型" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" v-model="SearchForm.SearchCompareType" :options="CompareTypeDrop" />
            <InputNumber class="P-W-200 P-ML-10 P-MB-10" v-model="SearchForm.TimeLimitValue" placeholder="筛选时间" :min="0" :step="1"></InputNumber>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
          <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
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
      <ExportTrackingMore :CountryList="CountryData" :WarehouseList="DropWarehouseList" :ShipMethodList="DropShipMethodList" />
      <WriteStationMail class="P-MB-10 P-VA-T" ref="WriteStationMail" :IsBtn="true" @trigger-operations="TriggerOperations" @emit-operate-success="OperateSuccess" />
    </Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="GrossProfitTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <!-- <SaleGrossOpeHistory ref="SaleGrossOpeHistory" /> -->
    <ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="GetList"></ShipOrderDetails>
    <LogisticsTracking ref="LogisticsTracking"></LogisticsTracking>
    <ShowTracking ref="ShowTracking"></ShowTracking>
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
@Component({
  name: 'Trackingmore',
  components:{
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    LogisticsTracking: () => import('@/components/Logistics/Tracking/LogisticsTracking.vue'),
    ShowTracking: () => import('@/components/Logistics/Tracking/ShowTracking.vue'),
    ExportTrackingMore: () => import('@/components/Logistics/Tracking/ExportTrackingMore.vue'),
    WriteStationMail: () => import('@/components/CustomerService/Ebay/WriteStationMail.vue')
  }
})
export default class Trackingmore extends Vue {
  @Watch('SearchForm.ShipWarehouseId')
  private ChangeShipWarehouseId(Val: number | ''):void{
    this.SearchForm.ShippingMethodId = '';
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

	private mounted() :void {
    this.GetWarehouseList();
    this.GetCountryDropList();
    this.GetPoints();
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportLogisticsData', 'EbayMsgSend', 'ViewLogisticsTM']))
    this.GetList();
  }

  private SetOperateDrop(h: any, Params: any): string{
    return h('Button', {
      props: {
        type: 'primary',
        size: 'small'
      },
      style: { display: this.Powers.ViewLogisticsTM ? 'inline-block' : 'none' },
      on: {
        click: () => {
          this.CancelSelect();
          this.GetTrackingmoreDetail(Params.row.TrackingNum)
        }
      }
    }, '查看物流跟踪')
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
  private GetSelected(Data: Interface.TrackingmoreList[] ): void{
    this.$set(this, 'Selected', Data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["GrossProfitTb"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	//获取列表
  private GetList(): void{
    this.$UI.Loading.Show();
    this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.BeginTime = SearchGroup.BeginTime === "" ? "" : this.$UI["Render"].NewDate(SearchGroup.BeginTime, true)
    SearchGroup.EndTime = SearchGroup.EndTime === "" ? "" : this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
    this.$set(this, 'List', [])
		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.ChannelTrackingmoreList,
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
    let Begin = new Date(SearchForm.BeginTime).getTime()
    let End = new Date(SearchForm.EndTime).getTime()
    if(SearchForm.BeginTime === "" && SearchForm.EndTime !== ""){
      this.$UI.Tips.Floating('warning', '请选择开始时间')
      return
    }
    if(SearchForm.BeginTime !== "" && SearchForm.EndTime === ""){
      this.$UI.Tips.Floating('warning', '请选择结束时间')
      return
    }

    if(Begin > End) {
      this.$UI.Tips.Floating('warning', '开始时间不能晚于结束时间')
      return
    }

    if(SearchForm.BeginTime !== "" && !SearchForm.SearchTimeType){
      this.$UI.Tips.Floating('warning', '请选择时间类型')
      return
    }

    if((End - Begin) / 86400000 > 30) {
      this.$UI.Tips.Floating('warning', '筛选订单时间区间最多只能30天')
      return
    }
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.TrackingmoreSearch())
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
			if(this.Powers[Item] && ['ExportLogisticsData', 'EbayMsgSend'].includes(Item)){
				F = 255;
			}
		}
		return (window.innerHeight - F);
  }

  private GetTrackingmoreDetail(TrackingNum:number){
    this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.ChannelTrackingmoreDetail,
				Login: true
			},
			Data: TrackingNum,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
					if(Res.Data.Data.length === 0){
            (this as any).$refs.ShowTracking.Trigger(TrackingNum);
          }else{
            (this as any).$refs.LogisticsTracking.TriggerModal(Res.Data.Data);
          }
				} else {
					this.$Request.Error(Res);
				}
				
			}
		})
  }

  private TriggerOperations(){
    if(!this.Selected.length){
      this.$UI.Tips.Floating('warning', '请选择订单再进行发送站内信操作');
      return;
    }
    (this as any).$refs['WriteStationMail'].TriggerOrdinaryWrite(this.Selected.map(Item => Item.OrderCode));
  }

  private OperateSuccess(): void{
    this.CancelSelect();
  }
  
  //导出数据
  private ExportData(B:boolean): void{
    if(B){
      let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
      SearchForm.BeginTime = SearchForm.BeginTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.BeginTime, true)
      SearchForm.EndTime = SearchForm.EndTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.EndTime, true)
      let Begin = new Date(SearchForm.BeginTime).getTime()
      let End = new Date(SearchForm.EndTime).getTime()
      if(SearchForm.BeginTime == '' || SearchForm.EndTime == ''){
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

  /* DisputedType: 0-不展示 1-查看 2-处理 */
  private ForwardShipOrderDetails(C: string, DisputedType: number, Id: number = 0): void {
    this.$set(this, 'AccurateSearch', false);
    (this as  any).$refs.ShipOrderDetails.Validate({
      OrderId: 0,
      OrderCode: C
    }, DisputedType, Id)
  }

  private Powers: PInterface.Power = {}  // 权限
  private TimeTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingmoreTimeType);   // 时间类型下拉
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];  //店铺下拉
  private DataTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingMoreTimeLimitType);  //时效类型下拉
  private CompareTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingMoreCompareType);  //比较类型下拉
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropShipMethodList: PInterface.IdName[] = [];  // 渠道下拉 
  private DropPackageStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingmoreStatus); //状态下拉
  private PackageStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.PackageStatusList); //包裹状态
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingMoreType);  //关键词下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.TrackingmoreSearch = new Interface.TrackingmoreSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.TrackingmoreList[] = []; //列表数据
	private Selected: Interface.TrackingmoreList[] = []; //勾选数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    {title: '发货订单', render: (h: any, Params: any): string => {
      if(Params.row.OrderCode){
        return h('div', Params.row.OrderCode.split(",").map((Item: string, Index: number) => {
          return h('a', {
            on: {
              click: () => {
                this.ForwardShipOrderDetails(Item, 0)
              }
            }
          }, `${Item}${Index === Params.row.OrderCode.split(",").length - 1 ? '' : ', '}`);
        }))
      }else{
        return h('span', '-');
      }
    } },
    { title: '目的国家', width: 90, key: 'CountryName' },
    { title: '跟踪号', width: 120, key: 'TrackingNum' },
    { title: '平台/店铺', width: 150, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '平'),
					h('span', !Params.row.PlatformId ? "-" : (this.PlatformDrop.find(Item=>Item.Value === Params.row.PlatformId) as PInterface.KV).Key )
        ]),
        h('Tooltip', {
					props: {
						'content': Params.row.StoreName,
						'maxWidth': 400
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span', { class: 'P-Table-Tip P-BG-Primary' }, "店"),
						h('span', Params.row.StoreName === "" ? '-' : Params.row.StoreName)
					])
				])
			])
    } },
    { title: '发货仓/物流渠道', width: 180, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '仓'),
					h('span', Params.row.WarehouseName)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '渠'),
					h('span', Params.row.ShippingMethodName)
				]),
			])
    } },
    { title: '更新时间/包裹状态', width: 170, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '更'),
					h('span', this.$UI.Render.Date(Params.row.UpdateTime, true))
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '包'),
					h('span', !Params.row.PackageStatus ? "-" : (this.PackageStatusList.find(Item=>Item.Value === Params.row.PackageStatus) as PInterface.KV).Key )
        ]),
			])
    } },
    { title: '发货时间/上网时间', width: 170, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '发'),
					h('span', this.$UI.Render.Date(Params.row.ShipedTime, true))
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '上'),
					h('span', this.$UI.Render.Date(Params.row.ItemReceived, true))
        ]),
			])
    } },
    { title: '运输时间/停留时间', width: 140, render: (h: any, Params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '运'),
					h('span', Params.row.ItemTimeLength + '天')
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '停'),
					h('span', Params.row.StayTimeLength + '天')
        ]),
			])
    } },
    { title: '最新物流消息', render: (h: any, Params: any): string => {
      return Params.row.LogisticsInfo === "" ? h('span', '-') : h('Tooltip', {
					props: {
						'content': Params.row.LogisticsInfo,
						'maxWidth': 400
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, [
						h('span',Params.row.LogisticsInfo)
					])
				])
    } },
    { title: '操作', align: 'center', width: 120, render: (h: any, Params: any): string => {
      return h('div', [this.SetOperateDrop(h,Params)])
    } }
	]
}

</script>
<style lang="less"></style>
