<!--货运退款率统计报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" :rules="Rules" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10">
            <Select class="P-W-200" v-model="SearchForm.ShippingMethodId" placeholder="筛选渠道" :options="ChannelList" optionValKey="Id" optionKey="Name" />
            <!-- <Select class="P-W-200" v-model="SearchForm.ShippingMethodId" @on-change="OnClearSelect('ShippingMethodId')" filterable clearable placeholder="筛选渠道">
              <Option v-for="(Item,Index) in ChannelList" :value="Item.Id" :key="Item.Id">{{ Item.Name }}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10">
            <Select class="P-W-200" v-model="SearchForm.StoreId" placeholder="筛选店铺" :options="StoreDrop" />
            <!-- <Select class="P-W-200" v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable placeholder="筛选店铺">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
            </Select> -->
          </FormItem>
          <span class="P-Inline-Block P-ML-10" style="margin-top: 6px;">发货时间：</span>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="BeginTime">
            <DatePicker class="P-W-200" v-model="SearchForm.BeginTime" type="date" placeholder="筛选开始时间"></DatePicker>
          </FormItem>
          <span class="P-Inline-Block P-ML-10" style="margin-top: 6px;">-</span>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="EndTime">
            <DatePicker class="P-W-200" v-model="SearchForm.EndTime" type="date" placeholder="筛选结束时间"></DatePicker>
          </FormItem>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Button type="primary" @click="SearchList">数据统计</Button>
        </FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'FreightRefund',
  components:{ }
})
export default class FreightRefund extends Vue {
  get StartTimeMs(): number {
    return this.SearchForm.BeginTime != '' ? new Date(this.SearchForm.BeginTime).getTime() : 0;
  }
  get EndTimeMs(): number {
    return this.SearchForm.EndTime != '' ? new Date(this.SearchForm.EndTime).getTime() : 0;
  }

  @Watch('SearchForm.BeginTime')
  private ChangeBeginTime(Val: string | ""): void{
    if(Val){
      (this.$refs.SearchForm as any).validate();
    }
  }

  @Watch('SearchForm.EndTime')
  private ChangeEndTime(Val: string | ""): void{
    if(Val){
      (this.$refs.SearchForm as any).validate();
    }
  }

	private mounted() :void {
    this.GetChannelDropList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //获取渠道
  private GetChannelDropList(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: 0,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'ChannelList', Res.Data.DropList)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.GetStoreDropList()
  }

  // 获取平台下的所有店铺
  private GetStoreDropList():void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales["1"].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.$UI.Loading.Hide();
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表
  private GetList(): void{
    this.$set(this, 'AccurateSearch', false);
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    this.$UI.Loading.Show();
    this.$set(this, 'List', [])
    SearchGroup.BeginTime = this.$UI["Render"].NewDate(SearchGroup.BeginTime, true)
    SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
    SearchGroup.StoreId = SearchGroup.StoreId === "" ? 0 : SearchGroup.StoreId
    SearchGroup.ShippingMethodId = SearchGroup.ShippingMethodId === "" ? 0 : SearchGroup.ShippingMethodId

		this.$Request.Post({
			Server: this.$Server.Report,
			Api: {
				Address: this.$Api.StatisticsShippedRefund,
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
    (this as any).$refs.SearchForm.validate((B: boolean)=>{
      if(B){
        this.$set(this.Pager, 'PageIndex', 1);
        this.GetList();
      }else{
        this.$UI.Tips.Floating('warning', '请检查必填项')
      }
    })
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.FreightRefundSearch());
    (this.$refs['SearchForm'] as any).resetFields();
    this.$set(this, 'List', []);
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
	
	//获取列表高度
	private CalculateTbHeight(): number {
		return (window.innerHeight - 210);
  }

  private ValidateStartDate(Rule: any, Value: string, CallBack:any): void{
    if( Value === '' ){
      CallBack( new Error( '请选择开始时间' ) )
    }else {
      if( this.EndTimeMs != 0){
        if( this.StartTimeMs > this.EndTimeMs ){
          CallBack( new Error( '开始时间不能晚于结束时间' ) );
        }else if( (this.EndTimeMs - this.StartTimeMs) > 31*24*3600000 ){
          CallBack( '时间区间不能超过31天' );
        }else{
          CallBack();
        }
      }else{
        CallBack();
      }
    }
  };
  private ValidateEndDate(Rule:any, Value: string, CallBack:any):void{
    if( Value === '' ){
      CallBack( new Error( '请选择结束时间' ) );
    }else{
      if( this.StartTimeMs!=0 && (this.EndTimeMs - this.StartTimeMs) > 31*24*3600000 ){
        CallBack( new Error( '时间区间不能超过31天' ) );
      }else{
        CallBack()
      }
    }
  };

  private ParseChanne(Ids: number){
    return this.ChannelList.find( Item=> Item.Id === Ids) ? (this.ChannelList.find( Item=> Item.Id === Ids) as PInterface.IdName).Name : '-';
  }

  private StoreDrop: PInterface.KV[] = [];
  private ChannelList: PInterface.IdName[] = [];
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.FreightRefundSearch = new Interface.FreightRefundSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.FreightRefundList[] = []; //列表数据
  private Rules: any = {
    BeginTime: [{ validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{ validator: this.ValidateEndDate, trigger: 'change', type: 'date'}]
  }
	private Cols: PInterface.TableCol[] = [
    { title: '物流渠道', render: (h: any, Params: any): string => h('span', this.ParseChanne(Params.row.ShippingMethodId)) }, 
    { title: '订单总数', key: 'TotalOrders' },
    { title: '订单金额', render: (h: any, Params: any): string => h('span', Params.row.TotalAmount + ' USD') },
    { title: '退款订单数', key: 'RefundTotalOrders' },
    { title: '退款金额', render: (h: any, Params: any): string => h('span', Params.row.RefundTotalAmount + ' USD') },
    { title: '货运问题率', render: (h: any, Params: any): string => h('span', Params.row.FreightProblemRate + '%') },
    { title: '退款率', render: (h: any, Params: any): string => h('span', Params.row.RefundRate + '%') }
	]
}

</script>
<style lang="less">
</style>
