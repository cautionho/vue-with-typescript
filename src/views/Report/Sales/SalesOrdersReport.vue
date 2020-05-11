<!--订单销量报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" :rules="RuleValidate" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
          <Form-item class="P-Inline-Block P-ML-10 P-MB-10" prop="Platform">
            <Select v-model="SearchForm.Platform" class="P-W-200" placeholder="筛选平台" :options="PlatformDrop" />
          <!-- <Select v-model="SearchForm.Platform" filterable clearable class="P-W-200" placeholder="筛选平台" @on-change="OnClearSelect('Platform')">
            <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
          </Select> -->
          </Form-item>
          <Form-item class="P-Inline-Block P-ML-10 P-MB-10">
            <Select v-model="SearchForm.StoreId" class="P-W-200" placeholder="筛选平台后再选店铺" ref="Store" :options="StoreDrop" />
          <!-- <Select v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable class="P-W-200" placeholder="筛选平台后再选店铺" ref="Store">
            <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
          </Select> -->
          </Form-item>
          <span class="P-Inline-Block P-ML-10" style="margin-top: 6px;">下单时间：</span>
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
          <Button type="primary" @click="ValidateForm">数据统计</Button>
        </FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
    <Col span="24">
      <ExportSaleOrder ref="ExportSaleOrder" v-if="Powers.ExportSaleOrderReport" />
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
  name: 'SalesOrdersReport',
  components:{
    ExportSaleOrder: () => import('@/components/Report/Sales/ExportSaleOrder.vue')
  }
})
export default class SalesOrdersReport extends Vue {
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
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportSaleOrderReport']))
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
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

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表
  private GetList(): void{
    this.$set(this, 'AccurateSearch', false);
    this.$set(this, 'List', [])
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.BeginTime = this.$UI["Render"].NewDate(SearchGroup.BeginTime, true);
    SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true);

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Report,
			Api: {
				Address: this.$Api.ShipOrderSummaryOfDayList,
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
  private ValidateForm(): void{
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
    this.$set(this, 'SearchForm', new Interface.SalesOrdersSearch());
    this.$set(this, 'Pager', new PInterface.Pager());
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
		let F: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				F = 255;
			}
		}
		return (window.innerHeight - F);
  }

  private ValidateStartDate(Rule: any, Value: string, CallBack: any):void {
    if ( Value === '' && this.EndTimeMs !== 0) {
      CallBack(new Error('开始时间和结束时间必须同时填写'))
    } else if( Value === '' ){
      CallBack(new Error('请选择开始时间'));
    } else {
      const currentTime = new Date().getTime();
      if (this.StartTimeMs > currentTime) {
        CallBack(new Error('开始时间不得晚于当前时间'));
      } else if (this.EndTimeMs != 0) {
        if ((this.EndTimeMs - this.StartTimeMs) > 31 * 24 * 3600000) {
          CallBack('时间区间不能超过31天');
        } else {
          CallBack();
        }
      } else {
        CallBack();
      }
    }
  };
  private ValidateEndDate(Rule: any, Value: string, CallBack: any):void {
    if ( Value === '' && this.StartTimeMs !== 0) {
      CallBack(new Error('开始时间和结束时间必须同时填写'));
    } else if( Value === '' ){
      CallBack(new Error('请选择结束时间'));
    } else {
      if (this.StartTimeMs > this.EndTimeMs) {
        CallBack(new Error('开始时间不能晚于结束时间'));
      } else if (this.StartTimeMs != 0 && (this.EndTimeMs - this.StartTimeMs) > 31 * 24 * 3600000) {
        CallBack(new Error('时间区间不能超过31天'));
      } else {
        CallBack()
      }
    }
  };
  
  private Powers: PInterface.Power = {}  // 权限
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.SalesOrdersSearch = new Interface.SalesOrdersSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.SaleOrdersList[] = []; //列表数据
  private RuleValidate: any = {
    BeginTime: [{validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{validator: this.ValidateEndDate, trigger: 'change', type: 'date'}],
    Platform: [{ required: true, type: 'number', message: '请选择平台', trigger: 'change' }]
  }
	private Cols: PInterface.TableCol[] = [
    { title: '平台', key: 'ShipWarehouseName', render: (h: any, Params: any): string =>  h('p', this.$Enums.Sales.Platform[Params.row.Platform]) }, 
    { title: '店铺', key: 'StoreName' }, 
    { title: '订单总数', key: 'OrderTotal' }, 
    { title: '订单总金额 (USD)', key: 'OrderAmount' }, 
    { title: '取消订单数', key: 'CancelOrderTotal', width: 200 }, 
    { title: '取消订单金额 (USD)', key: 'CancelOrderAmount' }
	]
}

</script>
<style lang="less"></style>
