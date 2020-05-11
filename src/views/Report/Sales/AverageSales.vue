<!--销量报表-->
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
          <Select class="P-W-200 P-ML-10" placeholder="筛选SKU状态" v-model="SearchForm.Status" :options="StatusDrop" />
          <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" v-model="SearchForm.WareHouseId" :options="DropWarehouseList" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选SKU状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.SkuStatus[Item]" :key="Index">{{Item}}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" @on-change="OnClearSelect('WareHouseId')" v-model="SearchForm.WareHouseId" filterable clearable>
						<Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
					</Select> -->
          <Cascader class="P-W-200 P-ML-10 P-Inline-Block" @on-change="PickCategory" placeholder="筛选类目" :data="CategoryList" change-on-select filterable clearable v-model="CategoryIds"></Cascader>
          <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.ReportDate" type="date" placeholder="筛选日期"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
          <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Purchase.SuggestSearchType[Item]" :key="Index">{{Item}}</Option>
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
			<Button type="primary" @click="ExportReport" class="P-MR-10 P-MB-10">导出数据</Button>
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
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'AverageSales',
  components:{
		ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
		SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
  }
})
export default class AverageSales extends Vue {
	private mounted() :void {
    this.GetCategory();
    this.GetWarehouseList();
    this.$set(this.SearchForm, 'ReportDate', new Date(new Date(new Date().toLocaleDateString()).getTime()));
    this.GetList();
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
    SearchGroup.ReportDate === "" ? "" : SearchGroup.ReportDate = this.$UI["Render"].NewDate(SearchGroup.ReportDate, true)

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuStatisticsAvgSaleQuantity,
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
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.AverageSaleSearch())
    this.$set(this.SearchForm, 'ReportDate', new Date(new Date(new Date().toLocaleDateString()).getTime()));
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
		return (window.innerHeight - 255);
  }

  //导出
  private ExportReport():void{
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.ReportDate === "" ? "" : SearchGroup.ReportDate = this.$UI["Render"].NewDate(SearchGroup.ReportDate, true)
    SearchGroup.CategoryId = SearchGroup.CategoryId === 0 ? "" : SearchGroup.CategoryId.toString();
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.ExportAvgSaleQuantity,
				Login: true
			},
			Data: SearchGroup,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出销量报表任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (Res: boolean):void => {}
          })
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
  }
  
  private PickCategory(Value: number[], selectedData: any){
    this.CategoryIds = Value;
    this.$set(this.SearchForm, 'CategoryId', this.CategoryIds.length ? this.CategoryIds[this.CategoryIds.length-1] : 0)
  }
  
  private CategoryIds: number[] = []
  private CategoryList: PInterface.ProductCagtegoryTree[] = []; //类目数组
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.SuggestSearchType);  //关键词下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private SearchForm: Interface.AverageSaleSearch = new Interface.AverageSaleSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.AverageSalesList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'SkuImage', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + Params.row.SkuImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.SkuImage)
            }
          }
        })
      }
    },
		{ title: 'SKU编号/SKU名称', render: (h: any, Params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
        h('p', {
					class: 'P-Pointer',
					on: {
						click: ()=> {
							(this.$refs['SkuDetail'] as any).Trigger(Params.row.SkuCode);
						}
					}
				}, Params.row.SkuCode === "" ? '-' : Params.row.SkuCode),
				h('Tooltip', {
					props: {
						'content': Params.row.SkuName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.SkuName === "" ? '-' : Params.row.SkuName)
				])
			])
		}},
		{ title: '仓库', key: 'WareHouseName' }, 
		{ title: '7日均销量', key: 'AvgSaleQuantity7' }, 
		{ title: '15日均销量', key: 'AvgSaleQuantity15' }, 
		{ title: '30日均销量', key: 'AvgSaleQuantity30' }, 
		{ title: '45日均销量', key: 'AvgSaleQuantity45' }, 
		{ title: '60日均销量', key: 'AvgSaleQuantity60' }
	]
}

</script>
<style lang="less"></style>
