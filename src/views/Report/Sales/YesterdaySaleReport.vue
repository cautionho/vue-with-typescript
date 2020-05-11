<!--昨日销量报表-->
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
          <Select v-model="SearchForm.WareHouseId" class="P-W-200 P-ML-10" placeholder="筛选仓库" :options="DropWarehouseList" />
          <Select v-model="SearchForm.Platform" class="P-W-200 P-ML-10" placeholder="筛选平台" :options="PlatformDrop" />
          <Select v-model="SearchForm.StoreId" class="P-W-200 P-ML-10" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
          <Select v-model="SearchForm.SortBy" class="P-W-200 P-ML-10" placeholder="筛选排序方式" :options="DropSortByList" />
          <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" @on-change="OnClearSelect('WareHouseId')" v-model="SearchForm.WareHouseId" filterable clearable>
						<Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
					</Select>
          <Select v-model="SearchForm.Platform" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选平台" @on-change="OnClearSelect('Platform')">
            <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
          </Select>
          <Select v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选店铺" ref="Store">
            <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
          </Select>
          <Cascader class="P-W-200 P-ML-10 P-Inline-Block" @on-change="PickCategory" placeholder="筛选品类" :data="CategoryList" change-on-select filterable clearable v-model="CategoryIds"></Cascader>
          <Select class="P-W-200 P-ML-10" placeholder="筛选排序方式" @on-change="OnClearSelect('SortBy')" v-model="SearchForm.SortBy" filterable clearable>
            <Option v-for="(Item,Index) in DropSortByList" :value="$Enums.Report.SkuSortBy[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
          <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Report.YesterdaySearchType[Item]" :key="Index">{{Item}}</Option>
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
  name: 'YesterdaySaleReport',
  components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
  }
})
export default class YesterdaySaleReport extends Vue {
	private mounted() :void {
    this.GetCategory();
    this.GetWarehouseList();
    this.$set(this.SearchForm, 'SortBy', 1)
    this.GetList();
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

	//获取列表
  private GetList(): void{
    this.$set(this, 'AccurateSearch', false);
    this.$set(this, 'List', [])
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.YesterdaySaleQuantity,
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
  private SearchList(Type?:string): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.YesterdaySearch())
    this.$set(this.SearchForm, 'SortBy', 1)
    this.CategoryIds = [];
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
		return (window.innerHeight - 210);
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
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  // private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); //状态下拉
  private DropSortByList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.SkuSortBy); //排序方式下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.YesterdaySearchType);  //关键词下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.YesterdaySearch = new Interface.YesterdaySearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.YesterdayList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + Params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.DefaultImage)
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
    { title: 'SKU名称', key: 'SkuName' }, 
    { title: '仓库', key: 'WarehouseName' }, 
    { title: '昨日销量', key: 'YdaySalesVolume' }, 
    { title: '开发员', key: 'DevUserName' }
	]
}

</script>
<style lang="less"></style>
