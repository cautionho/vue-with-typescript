<!-- 商品售出率-->
<template>
	<Row id="GoodsSalesRate">
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
            <Select class="P-W-200" placeholder="筛选状态" v-model="SearchForm.SkuStatus" :options="StatusDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选状态" @on-change="OnClearSelect('SkuStatus')" v-model="SearchForm.SkuStatus" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.SkuStatus[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10">
            <Select class="P-W-200" placeholder="筛选开发员" v-model="SearchForm.DevUserId" :options="DevUserIdDrop" />
            <!-- <Select class="P-W-200" placeholder="筛选开发员" @on-change="OnClearSelect('DevUserId')" v-model="SearchForm.DevUserId" filterable clearable>
              <Option v-for="(Item,Index) in DevUserIdDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="WareHouseId">
            <Select class="P-W-200" placeholder="筛选仓库" v-model="SearchForm.WareHouseId" :options="DropWarehouseList" />
            <!-- <Select class="P-W-200" placeholder="筛选仓库" @on-change="OnClearSelect('WareHouseId')" v-model="SearchForm.WareHouseId" filterable clearable>
              <Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10">
            <Cascader class="P-W-200" @on-change="PickCategory" placeholder="筛选品类" :data="CategoryList" change-on-select filterable clearable v-model="CategoryIds"></Cascader>
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="InStorageTime">
            <DatePicker class="P-W-200" v-model="SearchForm.InStorageTime" type="month" placeholder="筛选到货单入库时间"></DatePicker>
          </FormItem>
          <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="PayTime">
            <DatePicker class="P-W-200" v-model="SearchForm.PayTime" type="month" placeholder="筛选发货单付款时间"></DatePicker>
          </FormItem>
          <FormItem class="P-Inline-Block P-MB-10">
            <span class="P-Inline-Block P-ML-10">售出率区间：</span>
            <FormItem class="P-Inline-Block P-ML-10" prop="SoldRateStart">
              <Input type="text" v-model="SearchForm.SoldRateStart" style="width:100px;">
              <span slot="append">%</span></Input>
            </FormItem>
            <span class="P-Inline-Block P-ML-10">~</span>
            <FormItem class="P-Inline-Block P-ML-10" prop="SoldRateEnd">
              <Input type="text" v-model="SearchForm.SoldRateEnd" style="width:100px;">
              <span slot="append">%</span></Input>
            </FormItem>
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
      <Button class="P-MB-10" type="primary" @click="ExportData" v-if="Powers.ExportSalesRateData">导出数据</Button>
      <span class="P-MB-10 P-Float-Right P-Text-Error P-FW-Bold" style="font-size: 18px;" v-show="List.length > 0">{{ new Date().getMonth()+1 }}月{{ new Date().getDate() }}日的数据延迟一天统计</span>
    </Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <ShowBigPic ref="ShowBigPic" />
    <SkuDetail ref="SkuDetail" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'GoodsSalesRate',
  components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
  }
})
export default class GoodsSalesRate extends Vue {
	private mounted() :void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportSalesRateData']))
    this.GetCategory();
    this.GetWarehouseList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  private GetCategory(): void{
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.CategoryGetCategoryTree
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'CategoryList', Res.Data.Tree);
					this.SetTreeMenu(this.CategoryList)
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
    this.$UI.Loading.Show();
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
    
    this.GetPurchaserList();
  }
  
  //获取采购员下拉
  private GetPurchaserList(){
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetUserDropList,
				Login: false
			},
			Data: "开发员",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.DevUserIdDrop = Res.Data.DropList;
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
    if((SearchGroup.SoldRateEnd !== "" &&SearchGroup.SoldRateStart　== "") || (SearchGroup.SoldRateEnd == "" &&SearchGroup.SoldRateStart　!== "")){
      this.$UI.Tips.Floating('warning', '请完整输入售出率区间');
      return;
    }
    if(SearchGroup.SoldRateEnd < SearchGroup.SoldRateStart){
      this.$UI.Tips.Floating('warning', '售出率区间输入有误！请检查');
      return;
    }

    this.$UI.Loading.Show();
    this.$set(this, 'List', [])
    SearchGroup.InStorageTime = this.$UI["Render"].NewDate(SearchGroup.InStorageTime, true)
    SearchGroup.PayTime = this.$UI["Render"].NewDate(SearchGroup.PayTime, true)
    SearchGroup.SoldRateEnd = SearchGroup.SoldRateEnd === "" ? 0 : Number(SearchGroup.SoldRateEnd);
    SearchGroup.SoldRateStart = SearchGroup.SoldRateStart === 0 ? "" :  Number(SearchGroup.SoldRateStart);
    SearchGroup.SkuStatus = SearchGroup.SkuStatus === "" ? 0 :  Number(SearchGroup.SkuStatus);
    SearchGroup.DevUserId = SearchGroup.DevUserId === "" ? 0 : SearchGroup.DevUserId;

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.ProductSoldRateList,
				Login: true
			},
			Data: { Conditions: SearchGroup, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.IsStatistics = true;
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
        this.$UI.Tips.Floating('warning', '请填入必填项')
      }
    })
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    (this.$refs['SearchForm'] as any).resetFields();
    this.$set(this, 'SearchForm', new Interface.GoodsSalesRateSearch());
    this.$set(this, 'List', [])
    this.IsStatistics = false;
    this.CategoryIds = [];
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
		let Flag: number = 255;
		return (window.innerHeight - Flag);
  }

  private ExportData():void{
    if(!this.IsStatistics){
      this.$UI.Tips.Floating('warning', '请在统计数据后进行导出数据操作')
    }else{
      let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
      SearchGroup.InStorageTime = this.$UI["Render"].NewDate(SearchGroup.InStorageTime, true)
      SearchGroup.PayTime = this.$UI["Render"].NewDate(SearchGroup.PayTime, true)
      SearchGroup.SoldRateEnd = SearchGroup.SoldRateEnd === "" ? 0 : Number(SearchGroup.SoldRateEnd);
      SearchGroup.SoldRateStart = SearchGroup.SoldRateStart === 0 ? "" : Number(SearchGroup.SoldRateStart);
      SearchGroup.SkuStatus = SearchGroup.SkuStatus === "" ? 0 :  Number(SearchGroup.SkuStatus);
      SearchGroup.DevUserId = SearchGroup.DevUserId === "" ? 0 : SearchGroup.DevUserId;
      
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.ProductSoldRateExport,
          Login: true
        },
        Data: SearchGroup,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Modal({
              Type: 'success',
              Content: `创建导出数据任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据`,
              Callback: (Res: boolean):void => {}
            })
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
  }
  
  private PickCategory(Value: number[], SelectedData: any){
    this.CategoryIds = Value;
    this.$set(this.SearchForm, 'CategoryId', this.CategoryIds.length ? this.CategoryIds[this.CategoryIds.length-1] : 0)
  }

  private CategoryIds: number[] = []
  private CategoryList: PInterface.ProductCagtegoryTree[] = []; //类目数组
  private IsStatistics: boolean = false;  //是否统计出了数据
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); //状态下拉
  private DevUserIdDrop: PInterface.KV[] = []; //采购员下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.YesterdaySearchType);  //关键词下拉
  private Powers: PInterface.Power = {}  // 权限
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.GoodsSalesRateSearch = new Interface.GoodsSalesRateSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.GoodsSalesRateList[] = []; //列表数据
  private Rules: any = {
    WareHouseId:[{required: true, type: 'number', message: '请选择发货仓', trigger: 'change' }],
    InStorageTime:[{required: true, type: 'date', message: '请选择到货单入库时间', trigger: 'change' }],
    PayTime:[{required: true, type: 'date', message: '请选择发货单付款时间', trigger: 'change' }],
    SoldRateStart: [{ message: '格式有误，售出率不能超过100%且最多保留两位小数', trigger: 'change', pattern:/^(\d{1,2}(\.\d{1,2})?|100)$/ }],
    SoldRateEnd: [{ message: '格式有误，售出率不能超过100%且最多保留两位小数', trigger: 'change', pattern:/^(\d{1,2}(\.\d{1,2})?|100)$/ }]
  }
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'ImageUrl', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + Params.row.ImageUrl + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.ImageUrl)
            }
          }
        })
      }
    },
		{ title: 'SKU编号', render: (h: any, Params: any): string => {
      return h('p', {
        class: 'P-Pointer',
        on: {
          click: ()=> {
            (this.$refs['SkuDetail'] as any).Trigger(Params.row.SkuCode);
          }
        }
      }, Params.row.SkuCode)
    }},
    { title: 'SKU名称', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': Params.row.SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent P-Pointer'
      }, [
        h('p', {
          class: 'P-Pointer P-LINE-1',
          on: {
            click: ()=> {
              (this.$refs['SkuDetail'] as any).Trigger(Params.row.SkuCode);
            }
          }
        }, Params.row.SkuName)
      ])
		}},
    { title: '入库数量', key: 'InStorageQuantity' }, 
    { title: '售出数量', key: 'SoldQuantity' }, 
    { title: '售出率', key: 'SoldRate', render: (h: any, Params: any): string => h('p', `${(Params.row.SoldRate*100).toFixed(2)}%`) }, 
    { title: '首次入库时间', width:160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.FirstInStorageTime, true)) },
    { title: 'SKU创建时间', width:160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.SkuCreateTime, true)) },
    { title: '状态', key: 'SkuStatus', render: (h: any, Params: any): string => {
      return h('Tag', {
        props: { 
          color:  (Params.row as any).SkuStatus === 3 ? 'success' : (Params.row as any).SkuStatus === 6 ? 'error' : 'primary'
        }
      }, this.$Enums.Warehouse.SkuStatus[(Params.row as any).SkuStatus] )
    } },
    { title: '开发员', key: 'DevUserName' }
	]
}

</script>
<style lang="less">
  #GoodsSalesRate{
    & .ivu-input-group-append{
      color: #333 !important;
      background: none !important;
    }
  }
</style>
