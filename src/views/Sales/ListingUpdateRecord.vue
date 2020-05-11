<!--销售 => 设置 => listing更新记录-->
<template>
	<Row class="ListingUpdate">
    <Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选平台" v-model="SearchForm.PlatformId" :options="DropPlatform" />
          <Select class="P-W-200 P-ML-10" placeholder="筛选店铺" v-model="SearchForm.StoreId" ref="Store" :options="DropStoreList" />
          <Select class="P-W-200 P-ML-10" placeholder="筛选类型" v-model="SearchForm.ReviseType" :options="DropReviseType" />
          <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.ReviseStatus" :options="DropReviseStatus" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选平台" @on-change="OnClearSelect('PlatformId')" v-model="SearchForm.PlatformId" filterable clearable>
						<Option v-for="(item, index) in DropPlatform" :value="$Enums.Sales.Platform[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选店铺" @on-change="OnClearSelect('StoreId')" v-model="SearchForm.StoreId" filterable clearable ref="Store">
						<Option v-for="(item,index) in DropStoreList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选类型" @on-change="OnClearSelect('ReviseType')" v-model="SearchForm.ReviseType" filterable clearable>
						<Option v-for="(item,index) in DropReviseType" :value="$Enums.Sales.ReviseType[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('ReviseStatus')" v-model="SearchForm.ReviseStatus" filterable clearable>
						<Option v-for="(item,index) in DropReviseStatus" :value="$Enums.Sales.ReviseStatus[item]" :key="index">{{ item }}</Option>
					</Select> -->
					<DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.UpdateTimeStart" type="datetime" placeholder="开始日期"></DatePicker>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.UpdateTimeEnd" type="datetime" placeholder="结束日期"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" :options="DropSearchType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchType')" v-model="SearchForm.SearchType" filterable clearable>
						<Option v-for="(item,index) in DropSearchType" :value="$Enums.Sales.ReviseSearchType[item]" :key="index">{{item}}</Option>
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
			<Button type="primary" v-if="Powers.ResendListing" @click="ValidatePost(1)" class="P-MR-10 P-MB-10">重发</Button>
			<Button type="primary" v-if="Powers.IgnoreListing" @click="ValidatePost(2)" class="P-MR-10 P-MB-10">忽略</Button>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="ListingTable"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>

</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Sales';
@Component({
	name: 'ListingUpdateRecord',
	components: {
	}
})
export default class ListingUpdateRecord extends Vue {
  @Watch('SearchForm.PlatformId')
  private TriggerPlatform(Val: number | string):void{
    this.SearchForm.StoreId = '';
    if (this.DropStoreList.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.DropStoreList = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  private GetStoreDropList(Val:number|string):void {
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
          this.DropStoreList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private mounted() {
    this.$set(this.SearchForm, 'ReviseStatus', 2)
    this.$set(this.SearchForm, 'UpdateTimeStart', new Date(new Date(new Date().toLocaleDateString()).getTime()-24*60*60*6*1000))
    this.$set(this.SearchForm, 'UpdateTimeEnd', new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1*1000-1))
		this.GetPoints();
	}

  private GetPoints():void  {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ResendListing', 'IgnoreListing']));
		this.SetOperateDrop();
  }

  private SetOperateDrop(): void{
		let Drops: PInterface.KV[] = [];
		this.Powers.ResendListing ? Drops.push({ Key: '重发', Value: 1 }) : null;
		this.Powers.IgnoreListing ? Drops.push({ Key: '忽略', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
    this.GetList();
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  // 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - 255);
  }


  // 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
    const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.UpdateTimeStart = SearchForm.UpdateTimeStart == '' ? '' :  this.$UI["Render"].NewDate(SearchForm.UpdateTimeStart, true)
    SearchForm.UpdateTimeEnd = SearchForm.UpdateTimeEnd == '' ? '' :  this.$UI["Render"].NewDate(SearchForm.UpdateTimeEnd, true)
    SearchForm["PlatformId"] = SearchForm.PlatformId == "" ? 0 : SearchForm.PlatformId;
    SearchForm["ReviseStatus"] = SearchForm.ReviseStatus == "" ? 0 : SearchForm.ReviseStatus;
    SearchForm["ReviseType"] = SearchForm.ReviseType == "" ? 0 : SearchForm.ReviseType;
    SearchForm["StoreId"] = SearchForm.StoreId == "" ? 0 : SearchForm.StoreId;
    SearchForm["ErpSkuCode"] = SearchForm.SearchType == 1 ? SearchForm.SearchKey : "";
    SearchForm["ListingSkuCode"] = SearchForm.SearchType == 2 ? SearchForm.SearchKey : "";
    SearchForm["ItemId"] = SearchForm.SearchType == 3 ? SearchForm.SearchKey : "";
    SearchForm["PageIndex"] = this.Pager.PageIndex;
    SearchForm["PageSize"] =this.Pager.PageSize;
    delete SearchForm.SearchType
    delete SearchForm.SearchKey

		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ListinReviseGetList,
				Login: true
			},
			Data: SearchForm ,
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

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.ListingUpdateList[] ): void{
    this.$set(this, 'Selected', Data)
  }
  
  //取消全选
  private CancelSelect():void {
    (this.$refs["ListingTable"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	// 触发“搜索”按钮
	private SearchList(): void {
    let Start = new Date(this.SearchForm.UpdateTimeStart).valueOf();
    let End = new Date(this.SearchForm.UpdateTimeEnd).valueOf()
    if(End - Start > 86400000*30){
      this.$UI.Tips.Floating('warning', `更新时间跨度不能超过30天`);
      return
    }
    if (Start > End) {
      this.$UI.Tips.Floating('warning', `开始时间不能晚于结束时间`);
      return
    }
    if(isNaN(Start) && !isNaN(End)){
      this.$UI.Tips.Floating('warning', `请选择开始时间`);
      return
    }
    if(isNaN(End) && !isNaN(Start)){
      this.$UI.Tips.Floating('warning', `请选择结束时间`);
      return
    }
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
  }
  

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.ListingUpdateSearch())
    this.$set(this.SearchForm, 'ReviseStatus', 2)
    this.$set(this.SearchForm, 'UpdateTimeStart', new Date(new Date(new Date().toLocaleDateString()).getTime()-24*60*60*6*1000))
    this.$set(this.SearchForm, 'UpdateTimeEnd', new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1*1000-1))
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

  private ValidatePost(Type: number): void {
    if(this.Selected.length <1){
      this.$UI.Tips.Floating('warning', `请选择记录进行操作`)
      return;
    }

    for(let i=0; i<this.Selected.length; i++){
      if(Type == 1){
        if(this.Selected[i].ReviseStatus == 1 || this.Selected[i].ReviseStatus == 3){
          this.$UI.Tips.Floating('warning', '请选择状态为执行失败或设置忽略的更新记录进行重发操作')
          this.CancelSelect()
          return;
        }
      }else if(Type == 2){
        if(this.Selected[i].ReviseStatus !== 2){
          this.$UI.Tips.Floating('warning', '请选择状态为执行失败的更新记录进行忽略操作')
          this.CancelSelect()
          return;
        }
      }
    }

    this.OperateGroup(Type)
  }

  /*
	列表操作列操作按钮触发方法  
	OpeIndex: 1-重发 2-忽略
	Index： 操作列索引
	*/
  private OperateGroup(OpeIndex:number, Index?: number): void{
    if(Index !== undefined){
			this.CancelSelect();
			this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Index]))])
		}
    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: `是否${OpeIndex === 1 ? '重发': '忽略'}Listing记录`,
    	Enter:false,
    	Callback:(bool:boolean):void=>{
    		if(bool){
    			this.PostSubmitRequest(OpeIndex)
    		}else{
					this.CancelSelect();
				}
    	}
    })
  }

  //请求提交操作  
  private PostSubmitRequest(Type: number):void{
    let PostData = this.Selected.map( (Item: Interface.ListingUpdateList):number => Item.Id)
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: Type === 1 ? this.$Api.ListinReviseResend : this.$Api.ListinReviseIgnore,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$UI.Tips.Floating('success', Type === 1 ? `重发成功` : `忽略成功`);
					this.CancelSelect()
          this.GetList()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
  
  /*列表操作列操作按钮显隐
  Idx: 1-重发 2-忽略 
	(Data) 当前行数据
	 */
  private ControlOpera(Idx: number, Data:Interface.ListingUpdateList){
    switch(Idx){
      case 1: return (Data.ReviseStatus === 2 || Data.ReviseStatus === 4) ? 'inline-block' : 'none';
      case 2: return Data.ReviseStatus === 2 ? 'inline-block' : 'none';
      default: return 'none';
    }
  }
	
  private Powers: PInterface.Power = {}  // 权限
  private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private DropReviseType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.ReviseType);  //类型下拉
  private DropReviseStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.ReviseStatus) //状态下拉
  private DropSearchType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.ReviseSearchType) //关键词下拉
  private DropStoreList: PInterface.KV[] = [] //店铺下拉
	private SearchForm: Interface.ListingUpdateSearch = new Interface.ListingUpdateSearch()	//筛选项默认数据
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private List: Interface.ListingUpdateList[] = [] //列表数据
	private Selected: Interface.ListingUpdateList[] = [] //列表选中数据
	
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '平台', key: 'PlatformId', width: 100, render: (h: any, params: any): string => h('span', params.row.PlatformId === 99 ? '其他' : this.$Enums.Sales.Platform[params.row.PlatformId]) },
		{ title: '店铺', key: 'StoreName' },
		{ title: '系统SKU编号', key: 'ErpSkuCode' },
		{ title: 'Listing SKU编号', key: 'ListingSkuCode' },
		{ title: 'ItemId', render: (h: any, params: any): string => {
      let PlatformId = params.row.PlatformId;
      let ItemId = params.row.ItemId;
      let Href = PlatformId === 1 ? 'https://www.ebay.com/itm/'+ItemId : PlatformId === 2 ? 'https://www.wish.com/product/'+ItemId : PlatformId === 8 ? 'https://www.joom.com/en/products/'+ItemId : 'https://www.vova.com/-m'+ItemId
      return (PlatformId === 1 || PlatformId === 2 || PlatformId === 8 || PlatformId === 13) ? h('a', {
        attrs: {
          href: Href,
          target: '_blank'
        }
      }, ItemId) : h('span', ItemId)
    } },
		{ title: '类型', key: 'ReviseType', width: 100, render: (h: any, params: any): string => h('span', this.$Enums.Sales.ReviseType[params.row.ReviseType]) },
		{ title: '状态', key: 'ReviseStatus', width: 100, render: (h: any, params: any): string => h('span', this.$Enums.Sales.ReviseStatus[params.row.ReviseStatus]) },
    { title: '操作备注', render: (h: any, params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
				h('Tooltip', {
					props: {
						'content': params.row.Remarks,
						'maxWidth': 300
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-3' }, params.row.Remarks === "" ? '-' : params.row.Remarks)
				]),
			])
		}},
		{ title: '更新时间', width: 160, render: (h: any, params: any): string => h('span', this.$UI.Render.Date(params.row.UpdateTime, true)) },
    { title: '操作', width: 140, className: 'Ope-Row', render: (h: any, params: any): string => {
        return h('div', {
          class: "P-MT-5"
        }, this.OperateDrop.map( (Item: PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: { display: this.ControlOpera(Number(Item.Value), params.row) },
            class: 'P-MB-5 P-MR-5',
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }
  ];
}

</script>
<style lang="less">
</style>
