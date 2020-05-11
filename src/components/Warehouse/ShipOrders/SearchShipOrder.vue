<template>
  <div span="24" class="P-Search-Group">
  <Form inline ref="SearchFilter" v-model="SearchFilter">
    <Dropdown trigger="custom" :visible="AccurateSearch">
      <Button type="primary" @click="TriggerSearch">
        精准搜索
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <Col span="24" slot="list" class="P-P-10">
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" v-model="SearchFilter.Platform" :onChange="GetStoreDrop" :options="PlatformDrop" v-if="!IsFromSales" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" :options="StoreDrop" ref="StoreDrop" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.Status" :options="StatusDrop" v-if="IsStatusFilter" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选国家" v-model="SearchFilter.Country" :options="COUNTRY_DROP" optionValKey="CountryCode" optionKey="CountryName" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选发货仓" v-model="SearchFilter.ShipWarehouseId" :options="WarehouseDrop" :onChange="GetShipMethodDrop" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流渠道" v-model="SearchFilter.ShipMethodId" :options="ShipMethodDrop" optionValKey="Id" optionKey="Name" ref="ShipMethodDrop" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流状态" v-model="SearchFilter.LogisticsStatus" :options="LogisticsStatusDrop" v-if="Page === 'LogisticsException'" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服联系状态" v-model="SearchFilter.CustomerStatus" :options="CustomerProcessDrop" v-if="Page === 'LogisticsException'" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选异常单" v-model="SearchFilter.IsException" :options="ExceptionDrop" v-if="IsFromSales" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选明细类型" v-model="SearchFilter.ItemType" :options="ItemTypeDrop" v-if="IsWarehouseWork" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选库区（可多选）" v-model="SearchFilter.Location" :options="Locations" multiple v-if="IsLocation" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选审核规则" v-model="SearchFilter.RuleId" :options="RulesDrop" v-if="IsReview" />
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="时间类型" v-model="SearchFilter.TimeType" :options="TimeTypeDrop" />
      <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" v-model="SearchFilter.Platform" filterable clearable @on-change="GetStoreDrop" v-if="!IsFromSales">
        <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" filterable clearable ref="StoreDrop">
        <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.Status" filterable clearable v-if="IsStatusFilter">
        <Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.ShipOrderStatus[Item]" :key="Index">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选国家" v-model="SearchFilter.Country" filterable clearable>
        <Option v-for="(Item,Index) in COUNTRY_DROP" :value="Item.CountryCode" :key="Index">{{ `${Item.CountryNameCn}(${Item.CountryName})` }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选发货仓" v-model="SearchFilter.ShipWarehouseId" filterable clearable @on-change="GetShipMethodDrop">
        <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流渠道" v-model="SearchFilter.ShipMethodId" filterable clearable ref="ShipMethodDrop">
        <Option v-for="(Item,Index) in ShipMethodDrop" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选物流状态" v-model="SearchFilter.LogisticsStatus" filterable clearable v-if="Page === 'LogisticsException'">
        <Option v-for="(Item,Index) in LogisticsStatusDrop" :value="$Enums.CustomerService.LogisticsStatus[Item]" :key="Index">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服联系状态" v-model="SearchFilter.CustomerStatus" filterable clearable v-if="Page === 'LogisticsException'">
        <Option v-for="(Item,Index) in CustomerProcessDrop" :value="$Enums.CustomerService.CustomerHandleProcess[Item]" :key="Index">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选异常单" v-model="SearchFilter.IsException" filterable clearable v-if="IsFromSales">
        <Option v-for="(Item,Index) in ExceptionDrop" :value="$Enums.Public.YesNo[Item]" :key="Index">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选明细类型" v-model="SearchFilter.ItemType" filterable clearable v-if="IsWarehouseWork">
        <Option v-for="(Item,Index) in ItemTypeDrop" :value="$Enums.Warehouse.ItemType[Item]" :key="Item">{{ Item }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选库区（可多选）" v-model="SearchFilter.Location" filterable clearable multiple v-if="IsLocation">
        <Option v-for="(Item,Index) in Locations" :value="(Index+1)" :key="Index">{{ (Index+1) }}</Option>
      </Select>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="时间类型" v-model="SearchFilter.TimeType" filterable clearable>
        <Option v-for="(Item,Index) in TimeTypeDrop" :value="$Enums.Warehouse.TimeType[Item]" :key="Item">{{ Item }}</Option>
      </Select> -->
      <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" placeholder="开始时间" v-model="SearchFilter.StartTime"></DatePicker>
      <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" placeholder="结束时间" v-model="SearchFilter.EndTime"></DatePicker>
      <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选排序方式" v-model="SortOrder" :options="SortDrop" v-if="IsSort" />
      </Col>
    </Dropdown>
    <FormItem class="P-ML-10 P-MB-10">
      <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.SearchKey" @on-enter="SearchList" >
      <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchFilter.SearchKeyType" :options="SearchKeyType" />
      <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchFilter.SearchKeyType" filterable clearable>
        <Option v-for="(Item,Index) in SearchKeyType" :value="$Enums.Warehouse.ShipOrderKeyType[Item]" :key="Item">{{Item}}</Option>
      </Select> -->
      <Button slot="append" type="primary" @click="SearchList">搜索</Button>
      </Input>
    </FormItem>
    <FormItem class="P-ML-10 P-MB-10">
      <Button type="warning" @click="ResetList">重置</Button>
    </FormItem>
  </Form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {Getter,Action} from "vuex-class";
import Interface from "@/assets/Interface/ShipOrder";
import PInterface from "@/assets/Interface/Public";

@Component({})
export default class SearchShipOrder extends Vue {
  @Action private "Base/UPDATE_BASE_INFO": any;
  @Getter private 'Base/COUNTRY_DROP':PInterface.CountryEntity[]
  get COUNTRY_DROP() {
    return this["Base/COUNTRY_DROP"];
  }

  @Prop(Interface.ShipOrderSearch) private SearchInit?: Interface.ShipOrderSearch;
  @Prop(PInterface.Pager) private Pager: PInterface.Pager;
  @Prop(String) private Page:string
  // @Prop({default:false,type:Boolean}) private IsFromSales: boolean

  @Emit() EmitList(List: Interface.ShipOrderList[], Total: number) {}
  @Emit() EmitPagerChange(Pager:PInterface.Pager,Init?:boolean){}

  private mounted() {
    this.$set(this, "SearchFilter", JSON.parse(JSON.stringify(this.SearchInit)));
    this.SetFilterFlag()
    
    const PageVal = this.ListApis.filter(Item => Item.Key === this.Page)[0]
    this.ListApi = PageVal ? PageVal.Value as string : this.ListApi
    this.SearchList();

    if(!this.COUNTRY_DROP.length){
      this["Base/UPDATE_BASE_INFO"]('COUNTRY');
    }
    if(!this.WarehouseDrop.length){
      this.GetWarehouseDrop()
    }

    if(this.IsFromSales && this.SearchFilter.Platform){
      this.GetStoreDrop(this.SearchFilter.Platform);
    }
  }

  private SetFilterFlag(): void {
    this.$set(this,'IsFromSales',this.$Enums.Sales.Platform[this.Page] > 0);
    const WarehouseWork: string[] = ['Confirmed', 'WaitPick', 'Picked', 'Packed', 'Shiped','StockOut', 'HoldUp', 'ClearOutStock', 'PauseOutStock', 'Exception'],
          CustomerWarehouseWork: string[] = ['WaitAudit', 'OneDayNoTrackingNumber', 'TwoDaysNotShiped', 'FiveDaysNotShiped', 'WaitHoldUp']
    this.$set(this, 'IsWarehouseWork', WarehouseWork.concat(CustomerWarehouseWork).concat(['SkuError', 'NoMatchWarehouse']).includes(this.Page))
    const Status: string[] = WarehouseWork.concat(['Contact', 'SkuError', 'NoMatchWarehouse'])
    this.$set(this, 'IsStatusFilter', !Status.includes(this.Page))
    const Location: string[] = WarehouseWork.concat(['ClearOutStock', 'WaitHoldUp', 'PauseOutStock'])
    this.$set(this, 'IsLocation', Location.includes(this.Page))
    this.$set(this, 'IsReview', this.Page === 'WaitAudit')
    this.$set(this, 'IsSort', this.Page === 'StockOut')

    this.IsReview ? this.GetReviewRulesDrop() : null;
  }

  private GetStoreDrop(P:number):void{
    (this as any).$refs.StoreDrop.clearSingleSelect();
    if(!P || !this.$Api.Sales[String(P)].StoreDrop){ this.$set(this,'StoreDrop',[]); return;}
    this.$Request.Post({
      Server:this.$Server.Sales,
      Api:{
        Address:this.$Api.Sales[String(P)].StoreDrop,
        Login:false
      },
      Data:"",
      Callback:(res:PInterface.Res):void =>{
        if(res.IsSuccess){
          this.$set(this,'StoreDrop',res.Data.DropList);
        }else{
          this.$Request.Error(res);
        }
      }
    })
  }

  private GetWarehouseDrop():void{
    this.$Request.Post({
      Server:this.$Server.Settings,
      Api:{
        Address:this.$Api.GetWarehouseDropList,
        Login:false
      },
      Data:true,
      Callback:(Res:PInterface.Res):void=>{
        if(Res.IsSuccess){
          this.WarehouseDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
        
      }
    })
  }

  private GetShipMethodDrop(W:number):void{
    (this as any).$refs.ShipMethodDrop.clearSingleSelect();
    if(!W){this.$set(this,'ShipMethodDrop',[]);return;}
    this.$Request.Post({
      Server:this.$Server.Logistics,
      Api:{
        Address:this.$Api.ChannelDropList,
        Login:false
      },
      Data: W,
      Callback:(Res:PInterface.Res):void=>{
        if(Res.IsSuccess){
          this.ShipMethodDrop.splice(0, this.ShipMethodDrop.length, ...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
        
      }
    })
  }

  private GetLocations(): PInterface.KV[] {
    let Locations: PInterface.KV[] =  []
    for(let I=1; I <= 15; I++){ Locations.push({Key: I, Value: I}) }
    return Locations;
  }

  private GetReviewRulesDrop(): void {
    this.$Request.Post({
      Server:this.$Server.Settings,
      Api:{
        Address: this.$Api.AuditRulesDropList,
        Login:false
      },
      Data: "",
      Callback:(Res:PInterface.Res):void=>{
        if(Res.IsSuccess){
          this.RulesDrop.splice(0, this.RulesDrop.length, ...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 点击“精准搜索” */
  private TriggerSearch(): void {
    this.$set(this, "AccurateSearch", !this.AccurateSearch);
  }

  private CloseSearch(): void {
    this.$set(this, "AccurateSearch", false);
  }

  /* 搜索列表数据 */
  private SearchList(): void {
    this.$UI.Loading.Show();
    let SearchFilter = JSON.parse(JSON.stringify(this.SearchFilter))
    SearchFilter.Location = SearchFilter.Location.join(',')
    SearchFilter.StartTime = SearchFilter.StartTime ? this.$UI.Render.NewDate(SearchFilter.StartTime) : '';
    SearchFilter.EndTime = SearchFilter.EndTime ? this.$UI.Render.NewDate(SearchFilter.StartTime) : '';
    this.$Request.Post({
      Server: this.Page === 'LogisticsException' ? this.$Server.CustomerService : this.$Server.Warehouse,
      Api: {
        Address: this.ListApi,
        Login: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: this.Pager.PageSize,
        SortField: this.SortOrder ? 'Price' : '',
        SortOrder: this.SortOrder === 1 ? 'desc' : this.SortOrder === 2 ? 'asc' : '',
        Conditions: SearchFilter
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        this.CloseSearch();
        if (Res.IsSuccess) {
          this.EmitList(
            Res.Data.PageModel.Items,
            Res.Data.PageModel.TotalItems
          );
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }
  /* 重置列表数据 */
  private ResetList(): void {
    this.$set(this,'SearchFilter',new Interface.ShipOrderSearch(this.SearchInit))
    this.$set(this, 'SortOrder', 0);
    this.EmitPagerChange(new PInterface.Pager(),true);
  }

  private AccurateSearch: boolean = false;
  private PlatformDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private StoreDrop:PInterface.KV[] = []
  private WarehouseDrop:PInterface.KV[] = []
  private ShipMethodDrop:PInterface.KV[] = []
  private RulesDrop: PInterface.KV[] = []
  private ItemTypeDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ItemType)
  private Locations:PInterface.KV[] = this.GetLocations()
  private TimeTypeDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TimeType)
  private StatusDrop:PInterface.KV [] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ShipOrderStatus)
  private ExceptionDrop:PInterface.KV [] = this.$Utils.GetEnumArr(this.$Enums.Public.YesNo)
  private LogisticsStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.LogisticsStatus)
  private CustomerProcessDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CustomerHandleProcess)
  private SortDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SortType)
  private SearchKeyType:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ShipOrderKeyType)
  private SearchFilter: Interface.ShipOrderSearch = new Interface.ShipOrderSearch()

  private SortField: string = ''
  private SortOrder: number = 0

  private ListApi: string = this.$Api.ShipOrderGetList
  private ListApis: PInterface.KV[] = [{
    Key: 'ClearOutStock',
    Value: this.$Api.GetExistClearStockoutList
  }, {
    Key: 'LogisticsException',
    Value: this.$Api.LogisticsAnomalyRecordList
  }, {
    Key: 'WaitHoldUp',
    Value: this.$Api.GetWaitHoldUpOrderList
  }, {
    Key: 'WaitAudit',
    Value: this.$Api.GetWaitAuditList
  }, {
    Key: 'SkuError',
    Value: this.$Api.GetShipOrderSkuErrorList
  }, {
    Key: 'NoMatchWarehouse',
    Value: this.$Api.GetUnmatchWareHouseList
  }]

  private IsWarehouseWork: boolean = false
  private IsFromSales:boolean = false
  private IsStatusFilter: boolean = false
  private IsLocation: boolean = false
  private IsReview: boolean = false
  private IsSort: boolean = false
}
</script>