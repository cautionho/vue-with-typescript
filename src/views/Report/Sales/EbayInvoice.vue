<!--昨日销量报表-->
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
            <Select class="P-W-200" v-model="SearchForm.StoreId" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
            <!-- <Select class="P-W-200" v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable placeholder="筛选店铺" ref="Store">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="StartTime">
            <DatePicker class="P-W-200" v-model="SearchForm.StartTime" type="date" placeholder="筛选开始时间"></DatePicker>
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="EndTime">
            <DatePicker class="P-W-200" v-model="SearchForm.EndTime" type="date" placeholder="筛选结束时间"></DatePicker>
          </FormItem>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
          <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Report.InvoiceType[Item]" :key="Index">{{Item}}</Option>
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
      <Button class="P-MB-10" type="primary" @click="ExportData" v-if="Powers.ExportEbayInvoice">导出数据</Button>
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
  name: 'EbayInvoice',
  components:{ }
})
export default class EbayInvoice extends Vue {
  get StartTimeMs(): number {
    return this.SearchForm.StartTime != '' ? new Date(this.SearchForm.StartTime).getTime() : 0;
  }
  get EndTimeMs(): number {
    return this.SearchForm.EndTime != '' ? new Date(this.SearchForm.EndTime).getTime() : 0;
  }

  @Watch('SearchForm.StartTime')
  private ChangeStartTime(Val: string | ""): void{
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
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportEbayInvoice']))
    this.$set(this.SearchForm, 'StartTime', new Date(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1).getTime()))
    this.$set(this.SearchForm, 'EndTime', new Date(new Date(new Date().getFullYear(), new Date().getMonth()-1, new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).getTime()).getTime()+24*60*60*1000-1))
    this.GetStoreDropList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取平台下的所有店铺
  private GetStoreDropList():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales["1"].StoreDrop
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
    this.GetList();
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
    SearchGroup.StartTime = this.$UI["Render"].NewDate(SearchGroup.StartTime, true)
    SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
    SearchGroup.StoreId = SearchGroup.StoreId === "" ? 0 : SearchGroup.StoreId
    SearchGroup.SearchKeyType = SearchGroup.SearchKeyType === "" ? 0 : SearchGroup.SearchKeyType

		this.$Request.Post({
			Server: this.$Server.Sales,
			Api: {
				Address: this.$Api.EbayDataGetEbayInvoice,
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
    this.$set(this, 'SearchForm', new Interface.EbayInvoiceSearch());
    this.$set(this.SearchForm, 'StartTime', new Date(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1).getTime()))
    this.$set(this.SearchForm, 'EndTime', new Date(new Date(new Date().getFullYear(), new Date().getMonth()-1, new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).getTime()).getTime()+24*60*60*1000-1))
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
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let F: number = this.Powers.ExportEbayInvoice ? 255 : 210;
		return (window.innerHeight - F);
  }

  private ExportData():void{
    (this as any).$refs.SearchForm.validate((B: boolean)=>{
      if(B){
        let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm));
        SearchGroup.StartTime = this.$UI["Render"].NewDate(SearchGroup.StartTime, true);
        SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true);
        SearchGroup.StoreId = SearchGroup.StoreId === "" ? 0 : SearchGroup.StoreId;
        SearchGroup.SearchKeyType = SearchGroup.SearchKeyType === "" ? 0 : SearchGroup.SearchKeyType;

        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.ExportEbayInvoice,
            Login: true
          },
          Data: SearchGroup,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Modal({
                Type: 'success',
                Content: `创建导出eBay Invoice报表任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
                Callback: (Res: boolean):void => {}
              })
            } else {
              this.$Request.Error(Res);
            }
            this.$UI.Loading.Hide();
          }
        })
      }else{
        this.$UI.Tips.Floating('warning', '请检查必填项')
      }
    })
  }

  private ValidateStartDate(Rule: any, Value: string, CallBack:any): void{
    if( Value === '' ){
      CallBack( new Error( '请选择开始时间' ) )
    }else {
      if( this.EndTimeMs != 0){
        if( this.StartTimeMs > this.EndTimeMs ){
          CallBack( new Error( '开始时间不能晚于结束时间' ) );
        }else if( (this.EndTimeMs - this.StartTimeMs) > 366*24*3600000 ){
          CallBack( '时间段不能超过1年' );
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
      if( this.StartTimeMs!=0 && (this.EndTimeMs - this.StartTimeMs) > 366*24*3600000 ){
        CallBack( new Error( '时间段不能超过1年' ) );
      }else{
        CallBack()
      }
    }
  };

  private StoreDrop: PInterface.KV[] = [];
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.InvoiceType);  //关键词下拉
  private Powers: PInterface.Power = {}  // 权限
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.EbayInvoiceSearch = new Interface.EbayInvoiceSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.EbayInvoiceList[] = []; //列表数据
  private Rules: any = {
    StartTime: [{ validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{ validator: this.ValidateEndDate, trigger: 'change', type: 'date'}]
  }
	private Cols: PInterface.TableCol[] = [
		{ title: '店铺名', key: 'StoreName' },
    { title: '别名', key: 'Alias' },
    { title: '费用类型', key: 'CostType' },
    { title: '费用说明', key: 'Description' },
    { title: '金额', key: 'TotalPrice' },
    { title: '币种', key: 'Currency' }
	]
}

</script>
<style lang="less">
</style>
